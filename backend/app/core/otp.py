import random
import re
import xml.etree.ElementTree as ET

import httpx

from app.core.config import settings

_WEBSMS_URL = "https://cab.websms.ru/http_in5.asp"
_SMSC_URL = "https://smsc.ru/sys/send.php"
_TG_URL = "https://api.telegram.org/bot{token}/sendMessage"


def generate_otp(digits: int = 6) -> str:
    return str(random.randint(10 ** (digits - 1), 10**digits - 1))


def _normalize_phone(phone: str) -> str:
    d = re.sub(r"\D", "", phone)
    if d.startswith("8") and len(d) == 11:
        d = "7" + d[1:]
    elif len(d) == 10:
        d = "7" + d
    return d  # websms.ru expects 7XXXXXXXXXX without +


async def send_telegram_alert(message: str) -> None:
    """Send alert to Telegram. Silent on failure — never blocks OTP flow."""
    if not settings.TELEGRAM_BOT_TOKEN or not settings.TELEGRAM_CHAT_ID:
        return
    try:
        url = _TG_URL.format(token=settings.TELEGRAM_BOT_TOKEN)
        async with httpx.AsyncClient(timeout=5.0) as client:
            await client.post(url, json={
                "chat_id": settings.TELEGRAM_CHAT_ID,
                "text": message,
                "parse_mode": "HTML",
            })
    except Exception:
        pass  # alert failure must never break auth


async def _websms_flash_call(phone: str) -> str | None:
    """websms.ru flash call: returns 4-digit code (caller ID last 4 digits) or None."""
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


async def _smsc_voice_call(phone: str, code: str) -> bool:
    """smsc.ru voice call: reads 4-digit code aloud. Fallback if websms.ru unavailable."""
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


async def send_flash_call(phone: str) -> str | None:
    """Initiate OTP call. Tries websms.ru flash call first, falls back to smsc.ru voice.
    Returns the 4-digit code stored in Redis, or None if both fail.
    """
    if settings.WEBSMS_LOGIN and settings.WEBSMS_PASSWORD:
        code = await _websms_flash_call(phone)
        if code:
            return code

    # Fallback: smsc.ru voice call with 4-digit code
    if settings.SMSC_LOGIN and settings.SMSC_PASSWORD:
        code = generate_otp(4)
        if await _smsc_voice_call(phone, code):
            return code

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
