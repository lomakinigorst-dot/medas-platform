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


class DoctorLoadItem(BaseModel):
    doctor_name: str
    booked: int
    total_slots: int


class RevenueDay(BaseModel):
    date: str  # "YYYY-MM-DD"
    revenue: int


class ClinicStats(BaseModel):
    today_count: int
    today_revenue: int
    pending_count: int
    month_count: int
    month_revenue: int
    prev_month_revenue: int
    doctors_today: list[DoctorLoadItem]
    revenue_by_day: list[RevenueDay]
    bonus_used: int = 0
    confirmed_month: int = 0
    completed_month: int = 0
    bonuses_applied_month: int = 0
