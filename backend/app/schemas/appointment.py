from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class SlotOut(BaseModel):
    time: str
    available: bool


class AppointmentCreate(BaseModel):
    doctor_slug: str
    scheduled_at: datetime
    service_type: Literal["primary", "followup", "online"]
    use_bonuses: bool = False
    notes: str | None = None


class AppointmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    doctor_name: str
    clinic_name: str | None
    scheduled_at: datetime
    service_type: str
    status: str
    price: int
    bonuses_used: int
    bonuses_earned: int


class ClinicAppointmentOut(AppointmentOut):
    patient_name: str
