import logging

import redis.asyncio as aioredis
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.otp import generate_otp, send_flash_call, send_sms, send_telegram_alert
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

logger = logging.getLogger(__name__)
router = APIRouter()
_bearer = HTTPBearer()

OTP_TTL = 600        # 10 minutes
MAX_ATTEMPTS = 3     # wrong codes per OTP session
CALL_COOLDOWN = 55   # seconds between call requests
LOCKOUT_2H = 7200    # lockout after SMS OTP exhausted
LOCKOUT_30M = 1800   # lockout after too many failed sessions
MAX_FAIL_TOTAL = 15  # 5 sessions × 3 attempts → 30-min lockout


def _redis() -> aioredis.Redis:
    return aioredis.from_url(settings.REDIS_URL, decode_responses=True)


def _lockout_message(ttl: int) -> str:
    if ttl >= 3600:
        h = ttl // 3600
        m = (ttl % 3600) // 60
        return f"Аккаунт временно заблокирован. Попробуйте через {h} ч {m} мин"
    return f"Аккаунт временно заблокирован. Попробуйте через {ttl // 60} мин"


async def _check_lockout(phone: str, r: aioredis.Redis) -> None:
    """Raise 429 if phone is in lockout."""
    ttl = await r.ttl(f"lockout:{phone}")
    if ttl > 0:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                            detail=_lockout_message(ttl))


async def _send_code(phone: str, method: str = "flash") -> None:
    async with _redis() as r:
        await _check_lockout(phone, r)

        cooldown_ttl = await r.ttl(f"otp_cooldown:{phone}")
        if cooldown_ttl > 0:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Подождите {cooldown_ttl} сек перед повторным запросом кода",
            )

        if method == "sms":
            code = generate_otp(6)
            await r.setex(f"otp:{phone}", OTP_TTL, code)
            await r.setex(f"otp_type:{phone}", OTP_TTL, "sms")
            await r.setex(f"otp_cooldown:{phone}", CALL_COOLDOWN, "1")
            await r.delete(f"otp_attempts:{phone}")
        else:
            code = await send_flash_call(phone)
            if code is None:
                logger.warning("Flash call failed for %s — both providers down", phone)
                await send_telegram_alert(
                    f"⚠️ <b>MEDAS OTP 503</b>\n"
                    f"Оба провайдера недоступны для {phone[:8]}***\n"
                    f"websms.ru + smsc.ru не отвечают"
                )
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Не удалось инициировать звонок. Попробуйте другой способ или обратитесь в поддержку",
                )
            await r.setex(f"otp:{phone}", OTP_TTL, code)
            await r.setex(f"otp_type:{phone}", OTP_TTL, "flash")
            await r.setex(f"otp_cooldown:{phone}", CALL_COOLDOWN, "1")
            await r.delete(f"otp_attempts:{phone}")

    if method == "sms":
        await send_sms(phone, code)  # type: ignore[possibly-undefined]


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
    # Master password bypass — before any Redis check
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
        await _check_lockout(body.phone, r)

        stored = await r.get(f"otp:{body.phone}")
        if stored is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="Код истёк или не был отправлен — запросите новый звонок")

        attempts_key = f"otp_attempts:{body.phone}"
        attempts = int(await r.get(attempts_key) or 0)
        if attempts >= MAX_ATTEMPTS:
            otp_type = await r.get(f"otp_type:{body.phone}")
            if otp_type == "sms":
                await r.setex(f"lockout:{body.phone}", LOCKOUT_2H, "sms_exhausted")
                await r.delete(f"otp:{body.phone}", attempts_key, f"otp_type:{body.phone}")
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Исчерпаны все попытки входа. Попробуйте через 2 часа или напишите в поддержку",
                )
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Превышено количество попыток. Запросите новый звонок",
            )

        if body.code != stored:
            new_attempts = await r.incr(attempts_key)
            await r.expire(attempts_key, OTP_TTL)

            # Cumulative failure tracker (30-min lockout after 15 total wrong entries)
            fail_key = f"otp_failures:{body.phone}"
            total_fails = int(await r.get(fail_key) or 0) + 1
            await r.set(fail_key, total_fails, ex=LOCKOUT_30M)
            if total_fails >= MAX_FAIL_TOTAL:
                await r.setex(f"lockout:{body.phone}", LOCKOUT_30M, "too_many_failures")
                await r.delete(fail_key, f"otp:{body.phone}", attempts_key)
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Слишком много неверных попыток. Попробуйте через 30 минут",
                )

            remaining = MAX_ATTEMPTS - new_attempts
            if remaining > 0:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                    detail=f"Неверный код. Осталось попыток: {remaining}")
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                                detail="Превышено количество попыток. Запросите новый звонок")

        # Code correct — clean up
        await r.delete(f"otp:{body.phone}", attempts_key,
                       f"otp_type:{body.phone}", f"otp_failures:{body.phone}")

    result = await db.execute(select(User).where(User.phone == body.phone))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")
    if not user.is_verified:
        user.is_verified = True
        await db.commit()
    return TokenResponse(access_token=create_access_token(user.id, user.phone))


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
