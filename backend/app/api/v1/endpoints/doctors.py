from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.doctor import Doctor
from app.schemas.doctor import DoctorListOut, DoctorOut

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
