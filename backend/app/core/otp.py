import random
import re

import httpx

from app.core.config import settings

_SMSC_URL = "https://smsc.ru/sys/send.php"


def generate_otp() -> str:
    return str(random.randint(100000, 999999))


def _normalize_phone(phone: str) -> str:
    digits = re.sub(r"\D", "", phone)
    if digits.startswith("8") and len(digits) == 11:
        digits = "7" + digits[1:]
    elif len(digits) == 10:
        digits = "7" + digits
    return "+" + digits


async def send_otp(phone: str, code: str) -> bool:
    if not settings.SMSC_LOGIN or not settings.SMSC_PASSWORD:
        return False
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(
                _SMSC_URL,
                params={
                    "login": settings.SMSC_LOGIN,
                    "psw": settings.SMSC_PASSWORD,
                    "phones": _normalize_phone(phone),
                    "mes": f"Ваш код MEDAS: {code}. Никому не сообщайте.",
                    "fmt": "3",
                    "charset": "utf-8",
                },
            )
            data = r.json()
            return "id" in data
    except Exception:
        return False
