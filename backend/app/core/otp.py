import random
import re
import xml.etree.ElementTree as ET

import httpx

from app.core.config import settings

_WEBSMS_URL = "https://cab.websms.ru/http_in5.asp"
_SMSC_URL = "https://smsc.ru/sys/send.php"


def generate_otp(digits: int = 6) -> str:
    return str(random.randint(10 ** (digits - 1), 10**digits - 1))


def _normalize_phone(phone: str) -> str:
    d = re.sub(r"\D", "", phone)
    if d.startswith("8") and len(d) == 11:
        d = "7" + d[1:]
    elif len(d) == 10:
        d = "7" + d
    return d  # websms.ru expects 7XXXXXXXXXX without +


async def send_flash_call(phone: str) -> str | None:
    """Initiate flash call via websms.ru.
    websms.ru calls the user and returns the 4-digit code (last 4 digits of caller ID).
    Returns the code string to store in Redis, or None on failure.
    """
    if not settings.WEBSMS_LOGIN or not settings.WEBSMS_PASSWORD:
        return None
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            r = await client.get(
                _WEBSMS_URL,
                params={
                    "http_username": settings.WEBSMS_LOGIN,
                    "http_password": settings.WEBSMS_PASSWORD,
                    "mode": "flashcall",
                    "message": "FLASH",
                    "phone_list": _normalize_phone(phone),
                    "format": "XML",
                },
            )
        root = ET.fromstring(r.text)
        http_in = root.find("httpIn")
        if http_in is not None and http_in.get("error_num") != "0":
            return None
        sms = root.find(".//sms")
        if sms is not None:
            return sms.get("code")
        return None
    except Exception:
        return None


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
