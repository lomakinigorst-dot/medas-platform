import redis.asyncio as aioredis
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.otp import generate_otp, send_flash_call, send_sms
import logging

logger = logging.getLogger(__name__)
from app.core.security import create_access_token, verify_token
from app.core.config import settings
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    OTPVerifyRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)

router = APIRouter()
_bearer = HTTPBearer()

OTP_TTL = 600       # 10 minutes
MAX_ATTEMPTS = 3


def _redis() -> aioredis.Redis:
    return aioredis.from_url(settings.REDIS_URL, decode_responses=True)


async def _send_code(phone: str, method: str = "flash") -> None:
    if method == "sms":
        code = generate_otp(6)
        async with _redis() as r:
            await r.setex(f"otp:{phone}", OTP_TTL, code)
            await r.delete(f"otp_attempts:{phone}")
        await send_sms(phone, code)
    else:
        # Flash call: websms.ru generates the 4-digit code (last 4 digits of caller ID)
        code = await send_flash_call(phone)
        if code is None:
            logger.warning("Flash call failed for %s, no code returned", phone)
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Не удалось инициировать звонок. Попробуйте другой способ",
            )
        async with _redis() as r:
            await r.setex(f"otp:{phone}", OTP_TTL, code)
            await r.delete(f"otp_attempts:{phone}")


@router.post("/register")
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)) -> dict:
    result = await db.execute(select(User).where(User.phone == body.phone))
    user = result.scalar_one_or_none()
    if user is None:
        user = User(phone=body.phone, name=body.name, is_verified=False)
        db.add(user)
        await db.commit()
    await _send_code(user.phone, "flash")
    return {"phone": user.phone}


@router.post("/login")
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)) -> dict:
    result = await db.execute(select(User).where(User.phone == body.phone))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")
    await _send_code(user.phone, body.method)
    return {"phone": user.phone}


@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp(body: OTPVerifyRequest, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    if settings.OTP_MASTER_CODE and body.code == settings.OTP_MASTER_CODE:
        result = await db.execute(select(User).where(User.phone == body.phone))
        user = result.scalar_one_or_none()
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")
        if not user.is_verified:
            user.is_verified = True
            await db.commit()
        return TokenResponse(access_token=create_access_token(user.id, user.phone))

    async with _redis() as r:
        stored = await r.get(f"otp:{body.phone}")
        if stored is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Код истёк или не был отправлен")

        attempts_key = f"otp_attempts:{body.phone}"
        attempts = int(await r.get(attempts_key) or 0)
        if attempts >= MAX_ATTEMPTS:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Превышено количество попыток. Запросите новый код",
            )

        if body.code != stored:
            await r.incr(attempts_key)
            await r.expire(attempts_key, OTP_TTL)
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Неверный код")

        await r.delete(f"otp:{body.phone}", f"otp_attempts:{body.phone}")

    result = await db.execute(select(User).where(User.phone == body.phone))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")
    if not user.is_verified:
        user.is_verified = True
        await db.commit()
    token = create_access_token(user.id, user.phone)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse)
async def get_me(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    payload = verify_token(credentials.credentials)
    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Токен недействителен")
    user_id = int(payload["sub"])
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Пользователь не найден")
    return UserResponse.model_validate(user)
