from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DoctorBase(BaseModel):
    slug: str
    name: str
    specialty: str
    bio: str | None
    avatar: str | None
    experience: int
    rating: float
    review_count: int
    price: int
    is_verified: bool


class DoctorOut(DoctorBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    clinic_id: int | None
    is_active: bool
    created_at: datetime


class DoctorListOut(BaseModel):
    total: int
    items: list[DoctorOut]
