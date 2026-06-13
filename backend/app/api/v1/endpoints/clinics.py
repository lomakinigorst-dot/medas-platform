from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.clinic import Clinic
from app.schemas.clinic import ClinicListOut, ClinicOut

router = APIRouter(prefix="/clinics", tags=["clinics"])


@router.get("", response_model=ClinicListOut)
async def list_clinics(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
) -> ClinicListOut:
    total_result = await db.execute(select(func.count()).select_from(Clinic).where(Clinic.is_active == True))  # noqa: E712
    total = total_result.scalar_one()

    result = await db.execute(
        select(Clinic).where(Clinic.is_active == True).order_by(Clinic.rating.desc()).offset(skip).limit(limit)  # noqa: E712
    )
    items = list(result.scalars().all())
    return ClinicListOut(total=total, items=items)


@router.get("/{slug}", response_model=ClinicOut)
async def get_clinic(slug: str, db: AsyncSession = Depends(get_db)) -> ClinicOut:
    result = await db.execute(select(Clinic).where(Clinic.slug == slug, Clinic.is_active == True))  # noqa: E712
    clinic = result.scalar_one_or_none()
    if clinic is None:
        raise HTTPException(status_code=404, detail="Clinic not found")
    return clinic  # type: ignore[return-value]
