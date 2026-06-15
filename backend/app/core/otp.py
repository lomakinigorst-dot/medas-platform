import random
import re

import httpx

from app.core.config import settings

_SMSC_URL = "https://smsc.ru/sys/send.php"


def generate_otp(digits: int = 4) -> str:
    return str(random.randint(10 ** (digits - 1), 10**digits - 1))


def _normalize_phone(phone: str) -> str:
    d = re.sub(r"\D", "", phone)
    if d.startswith("8") and len(d) == 11:
        d = "7" + d[1:]
    elif len(d) == 10:
        d = "7" + d
    return "+" + d


async def send_flash_call(phone: str, code: str) -> bool:
    """Flash call: robot reads 4-digit code via voice.
    TODO: Replace with real flash call provider (sigmasms.ru, redsms.ru, websms.ru)
    so last 4 digits of calling number = code.
    """
    if not settings.SMSC_LOGIN or not settings.SMSC_PASSWORD:
        return True
    spaced = ". ".join(code)
    text = f"Ваш код MEDAS: {spaced}. Повторяю: {spaced}."
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(
                _SMSC_URL,
                params={
                    "login": settings.SMSC_LOGIN,
                    "psw": settings.SMSC_PASSWORD,
                    "phones": _normalize_phone(phone),
                    "mes": text,
                    "call": "1",
                    "voice": "w",
                    "fmt": "3",
                    "charset": "utf-8",
                },
            )
            return "id" in r.json()
    except Exception:
        return False


async def send_sms(phone: str, code: str) -> bool:
    """Send OTP via smsc.ru SMS as last resort."""
    if not settings.SMSC_LOGIN or not settings.SMSC_PASSWORD:
        return True
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(
                _SMSC_URL,
                params={
                    "login": settings.SMSC_LOGIN,
                    "psw": settings.SMSC_PASSWORD,
                    "phones": _normalize_phone(phone),
                    "mes": f"MEDAS: ваш код подтверждения {code}",
                    "charset": "utf-8",
                    "fmt": "3",
                },
            )
            return "id" in r.json()
    except Exception:
        return False
