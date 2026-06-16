from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ClinicBase(BaseModel):
    slug: str
    name: str
    description: str | None
    address: str
    metro: str | None
    phone: str | None
    website: str | None
    rating: float
    review_count: int
    accepts_dms: bool
    logo_url: str | None = None


class ClinicOut(ClinicBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_active: bool
    created_at: datetime


class ClinicListOut(BaseModel):
    total: int
    items: list[ClinicOut]
