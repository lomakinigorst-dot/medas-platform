from pydantic import BaseModel, field_validator
import re


class RegisterRequest(BaseModel):
    phone: str
    name: str

    @field_validator("phone")
    @classmethod
    def normalize_phone(cls, v: str) -> str:
        digits = re.sub(r"\D", "", v)
        if len(digits) == 11 and digits[0] in ("7", "8"):
            return "+" + ("7" + digits[1:] if digits[0] == "8" else digits)
        if len(digits) == 10:
            return "+7" + digits
        return v


class LoginRequest(BaseModel):
    phone: str
    method: str = "flash"  # "flash" or "sms"


class OTPVerifyRequest(BaseModel):
    phone: str
    code: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    phone: str
    name: str
    bonus_balance: int
    role: str
    clinic_id: int | None
    doctor_id: int | None

    model_config = {"from_attributes": True}
