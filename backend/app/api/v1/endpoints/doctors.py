import calendar
from datetime import date, time as dt_time

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.day_off import DoctorDayOff
from app.models.doctor import Doctor
from app.models.schedule import DoctorSchedule
from app.models.user import User
from app.schemas.doctor import DoctorListOut, DoctorOut, DoctorPatch
from app.schemas.appointment import SlotOut
from app.services.schedule_service import get_available_slots

router = APIRouter(prefix="/doctors", tags=["doctors"])


@router.get("", response_model=DoctorListOut)
async def list_doctors(
    skip: int = 0,
    limit: int = 20,
    specialty: str | None = None,
    clinic_id: int | None = None,
    db: AsyncSession = Depends(get_db),
) -> DoctorListOut:
    query = select(Doctor).where(Doctor.is_active == True)  # noqa: E712
    count_query = select(func.count()).select_from(Doctor).where(Doctor.is_active == True)  # noqa: E712

    if specialty:
        query = query.where(Doctor.specialty.ilike(f"%{specialty}%"))
        count_query = count_query.where(Doctor.specialty.ilike(f"%{specialty}%"))

    if clinic_id is not None:
        query = query.where(Doctor.clinic_id == clinic_id)
        count_query = count_query.where(Doctor.clinic_id == clinic_id)

    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    result = await db.execute(query.order_by(Doctor.rating.desc()).offset(skip).limit(limit))
    items = list(result.scalars().all())
    return DoctorListOut(total=total, items=items)


@router.get("/{slug}", response_model=DoctorOut)
async def get_doctor(slug: str, db: AsyncSession = Depends(get_db)) -> DoctorOut:
    result = await db.execute(select(Doctor).where(Doctor.slug == slug, Doctor.is_active == True))  # noqa: E712
    doctor = result.scalar_one_or_none()
    if doctor is None:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor  # type: ignore[return-value]


@router.get("/{slug}/available-days", response_model=list[str])
async def get_available_days(
    slug: str,
    month: str = Query(..., description="YYYY-MM"),
    db: AsyncSession = Depends(get_db),
) -> list[str]:
    dr_result = await db.execute(select(Doctor).where(Doctor.slug == slug, Doctor.is_active == True))  # noqa: E712
    doctor = dr_result.scalar_one_or_none()
    if doctor is None:
        raise HTTPException(status_code=404, detail="Doctor not found")

    try:
        year, mon = int(month[:4]), int(month[5:7])
    except (ValueError, IndexError):
        raise HTTPException(status_code=400, detail="month must be YYYY-MM")

    sched_result = await db.execute(
        select(DoctorSchedule.weekday).where(DoctorSchedule.doctor_id == doctor.id)
    )
    available_weekdays = {row[0] for row in sched_result.all()}

    if not available_weekdays:
        return []

    day_off_result = await db.execute(
        select(DoctorDayOff.date).where(
            DoctorDayOff.doctor_id == doctor.id,
            DoctorDayOff.date >= date(year, mon, 1),
        )
    )
    blocked_dates = {row[0] for row in day_off_result.all()}

    today = date.today()
    days_in_month = calendar.monthrange(year, mon)[1]
    result = []
    for day in range(1, days_in_month + 1):
        d = date(year, mon, day)
        if d < today:
            continue
        if d.weekday() in available_weekdays and d not in blocked_dates:
            result.append(d.isoformat())
    return result


@router.patch("/{doctor_id}", response_model=DoctorOut)
async def patch_doctor(
    doctor_id: int,
    body: DoctorPatch,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DoctorOut:
    if current_user.role != "clinic":
        raise HTTPException(status_code=403, detail="Доступ только для клиник")
    result = await db.execute(select(Doctor).where(Doctor.id == doctor_id))
    doctor = result.scalar_one_or_none()
    if doctor is None:
        raise HTTPException(status_code=404, detail="Врач не найден")
    if doctor.clinic_id != current_user.clinic_id:
        raise HTTPException(status_code=403, detail="Врач не принадлежит вашей клинике")
    if body.price is not None:
        doctor.price = body.price
    if body.is_active is not None:
        doctor.is_active = body.is_active
    await db.commit()
    await db.refresh(doctor)
    return doctor  # type: ignore[return-value]


@router.get("/{slug}/slots", response_model=list[SlotOut])
async def get_doctor_slots(
    slug: str,
    date: date = Query(..., description="YYYY-MM-DD"),
    db: AsyncSession = Depends(get_db),
) -> list[SlotOut]:
    result = await db.execute(select(Doctor).where(Doctor.slug == slug, Doctor.is_active == True))  # noqa: E712
    doctor = result.scalar_one_or_none()
    if doctor is None:
        raise HTTPException(status_code=404, detail="Doctor not found")
    slots = await get_available_slots(db, doctor.id, date)
    return [SlotOut(**s) for s in slots]


# ─── Schedule management (clinic-only) ───────────────────────────────────────

class ScheduleItem(BaseModel):
    weekday: int  # 0=Mon, 6=Sun
    start_time: str  # "HH:MM"
    end_time: str    # "HH:MM"
    slot_duration_min: int = 30


class DayOffCreate(BaseModel):
    date: str   # "YYYY-MM-DD"
    reason: str | None = None


@router.get("/{doctor_id}/schedule", response_model=list[ScheduleItem])
async def get_schedule(
    doctor_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ScheduleItem]:
    if current_user.role != "clinic":
        raise HTTPException(status_code=403, detail="Доступ только для клиник")
    rows = await db.execute(
        select(DoctorSchedule).where(DoctorSchedule.doctor_id == doctor_id)
    )
    schedules = rows.scalars().all()
    return [
        ScheduleItem(
            weekday=s.weekday,
            start_time=str(s.start_time)[:5],
            end_time=str(s.end_time)[:5],
            slot_duration_min=s.slot_duration_min,
        )
        for s in schedules
    ]


@router.put("/{doctor_id}/schedule", response_model=list[ScheduleItem])
async def put_schedule(
    doctor_id: int,
    items: list[ScheduleItem],
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ScheduleItem]:
    if current_user.role != "clinic":
        raise HTTPException(status_code=403, detail="Доступ только для клиник")
    dr = await db.execute(select(Doctor).where(Doctor.id == doctor_id))
    doctor = dr.scalar_one_or_none()
    if doctor is None:
        raise HTTPException(status_code=404, detail="Врач не найден")
    if doctor.clinic_id != current_user.clinic_id:
        raise HTTPException(status_code=403, detail="Врач не принадлежит вашей клинике")
    # Delete existing and replace
    existing = await db.execute(select(DoctorSchedule).where(DoctorSchedule.doctor_id == doctor_id))
    for row in existing.scalars().all():
        await db.delete(row)
    for item in items:
        sh, sm = map(int, item.start_time.split(":"))
        eh, em = map(int, item.end_time.split(":"))
        db.add(DoctorSchedule(
            doctor_id=doctor_id,
            weekday=item.weekday,
            start_time=dt_time(sh, sm),
            end_time=dt_time(eh, em),
            slot_duration_min=item.slot_duration_min,
        ))
    await db.commit()
    return items


@router.get("/{doctor_id}/day-offs", response_model=list[DayOffCreate])
async def get_day_offs(
    doctor_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[DayOffCreate]:
    if current_user.role != "clinic":
        raise HTTPException(status_code=403, detail="Доступ только для клиник")
    rows = await db.execute(select(DoctorDayOff).where(DoctorDayOff.doctor_id == doctor_id))
    return [DayOffCreate(date=str(r.date), reason=r.reason) for r in rows.scalars().all()]


@router.post("/{doctor_id}/day-offs", status_code=201)
async def add_day_off(
    doctor_id: int,
    body: DayOffCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    if current_user.role != "clinic":
        raise HTTPException(status_code=403, detail="Доступ только для клиник")
    dr = await db.execute(select(Doctor).where(Doctor.id == doctor_id))
    doctor = dr.scalar_one_or_none()
    if doctor is None:
        raise HTTPException(status_code=404, detail="Врач не найден")
    if doctor.clinic_id != current_user.clinic_id:
        raise HTTPException(status_code=403, detail="Врач не принадлежит вашей клинике")
    d = date.fromisoformat(body.date)
    existing = await db.execute(
        select(DoctorDayOff).where(DoctorDayOff.doctor_id == doctor_id, DoctorDayOff.date == d)
    )
    if existing.scalar_one_or_none() is None:
        db.add(DoctorDayOff(doctor_id=doctor_id, date=d, reason=body.reason))
        await db.commit()
    return {"date": body.date, "blocked": True}


@router.delete("/{doctor_id}/day-offs/{day_off_date}", status_code=200)
async def remove_day_off(
    doctor_id: int,
    day_off_date: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    if current_user.role != "clinic":
        raise HTTPException(status_code=403, detail="Доступ только для клиник")
    d = date.fromisoformat(day_off_date)
    existing = await db.execute(
        select(DoctorDayOff).where(DoctorDayOff.doctor_id == doctor_id, DoctorDayOff.date == d)
    )
    row = existing.scalar_one_or_none()
    if row:
        await db.delete(row)
        await db.commit()
    return {"date": day_off_date, "blocked": False}
