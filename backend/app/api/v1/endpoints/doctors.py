from datetime import date, timedelta
import calendar

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.doctor import Doctor
from app.models.schedule import DoctorSchedule
from app.schemas.doctor import DoctorListOut, DoctorOut
from app.schemas.appointment import SlotOut
from app.services.schedule_service import get_available_slots

router = APIRouter(prefix="/doctors", tags=["doctors"])


@router.get("", response_model=DoctorListOut)
async def list_doctors(
    skip: int = 0,
    limit: int = 20,
    specialty: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> DoctorListOut:
    query = select(Doctor).where(Doctor.is_active == True)  # noqa: E712
    count_query = select(func.count()).select_from(Doctor).where(Doctor.is_active == True)  # noqa: E712

    if specialty:
        query = query.where(Doctor.specialty.ilike(f"%{specialty}%"))
        count_query = count_query.where(Doctor.specialty.ilike(f"%{specialty}%"))

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

    today = date.today()
    days_in_month = calendar.monthrange(year, mon)[1]
    result = []
    for day in range(1, days_in_month + 1):
        d = date(year, mon, day)
        if d < today:
            continue
        if d.weekday() in available_weekdays:
            result.append(d.isoformat())
    return result


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
