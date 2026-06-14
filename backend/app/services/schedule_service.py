from datetime import date, datetime, time, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.appointment import Appointment
from app.models.schedule import DoctorSchedule


async def get_available_slots(db: AsyncSession, doctor_id: int, target_date: date) -> list[dict]:
    weekday = target_date.weekday()  # 0=Mon, 6=Sun

    result = await db.execute(
        select(DoctorSchedule).where(
            DoctorSchedule.doctor_id == doctor_id,
            DoctorSchedule.weekday == weekday,
        )
    )
    schedule = result.scalar_one_or_none()
    if schedule is None:
        return []

    # Fetch booked slots for this date
    day_start = datetime.combine(target_date, time.min)
    day_end = datetime.combine(target_date, time.max)
    booked_result = await db.execute(
        select(Appointment.scheduled_at).where(
            Appointment.doctor_id == doctor_id,
            Appointment.scheduled_at >= day_start,
            Appointment.scheduled_at <= day_end,
            Appointment.status != "cancelled",
        )
    )
    booked_times = {row[0].strftime("%H:%M") for row in booked_result.all()}

    slots = []
    current = datetime.combine(target_date, schedule.start_time)
    end = datetime.combine(target_date, schedule.end_time)
    delta = timedelta(minutes=schedule.slot_duration_min)

    while current + delta <= end:
        slot_str = current.strftime("%H:%M")
        slots.append({"time": slot_str, "available": slot_str not in booked_times})
        current += delta

    return slots
