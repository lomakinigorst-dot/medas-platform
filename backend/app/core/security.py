from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt

from app.core.config import settings

_ALGORITHM = "HS256"
_EXPIRE_DAYS = 7


def create_access_token(user_id: int, phone: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=_EXPIRE_DAYS)
    payload = {"sub": str(user_id), "phone": phone, "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=_ALGORITHM)


def verify_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[_ALGORITHM])
    except JWTError:
        return None
