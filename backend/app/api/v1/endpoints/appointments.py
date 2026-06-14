from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.appointment import Appointment
from app.models.clinic import Clinic
from app.models.doctor import Doctor
from app.models.user import User
from app.schemas.appointment import AppointmentCreate, AppointmentOut, ClinicAppointmentOut

router = APIRouter(prefix="/appointments", tags=["appointments"])

SERVICE_PRICES = {"primary": 0, "followup": 0, "online": 0}  # use doctor.price as base


@router.post("", response_model=AppointmentOut, status_code=status.HTTP_201_CREATED)
async def create_appointment(
    body: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> AppointmentOut:
    # Resolve doctor by slug
    dr_result = await db.execute(select(Doctor).where(Doctor.slug == body.doctor_slug, Doctor.is_active == True))  # noqa: E712
    doctor = dr_result.scalar_one_or_none()
    if doctor is None:
        raise HTTPException(status_code=404, detail="Врач не найден")

    price = doctor.price
    bonuses_used = 0
    if body.use_bonuses and current_user.bonus_balance > 0:
        max_deduct = price // 10  # 10% cap
        bonuses_used = min(current_user.bonus_balance, max_deduct)
        current_user.bonus_balance -= bonuses_used

    appointment = Appointment(
        patient_id=current_user.id,
        doctor_id=doctor.id,
        clinic_id=doctor.clinic_id or 1,
        service_type=body.service_type,
        scheduled_at=body.scheduled_at,
        price=price,
        bonuses_used=bonuses_used,
        bonuses_earned=0,
        status="pending",
        notes=body.notes,
    )
    db.add(appointment)
    await db.commit()
    await db.refresh(appointment)

    clinic_name: str | None = None
    if doctor.clinic_id:
        cl_result = await db.execute(select(Clinic.name).where(Clinic.id == doctor.clinic_id))
        clinic_name = cl_result.scalar_one_or_none()

    return AppointmentOut(
        id=appointment.id,
        doctor_name=doctor.name,
        clinic_name=clinic_name,
        scheduled_at=appointment.scheduled_at,
        service_type=appointment.service_type,
        status=appointment.status,
        price=appointment.price,
        bonuses_used=appointment.bonuses_used,
        bonuses_earned=appointment.bonuses_earned,
    )


@router.get("/my", response_model=list[AppointmentOut])
async def my_appointments(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[AppointmentOut]:
    result = await db.execute(
        select(Appointment)
        .where(Appointment.patient_id == current_user.id)
        .order_by(Appointment.scheduled_at.desc())
    )
    appointments = list(result.scalars().all())

    out = []
    for apt in appointments:
        dr_result = await db.execute(select(Doctor).where(Doctor.id == apt.doctor_id))
        doctor = dr_result.scalar_one_or_none()

        clinic_name: str | None = None
        if doctor and doctor.clinic_id:
            cl_result = await db.execute(select(Clinic.name).where(Clinic.id == doctor.clinic_id))
            clinic_name = cl_result.scalar_one_or_none()

        out.append(AppointmentOut(
            id=apt.id,
            doctor_name=doctor.name if doctor else "Неизвестно",
            clinic_name=clinic_name,
            scheduled_at=apt.scheduled_at,
            service_type=apt.service_type,
            status=apt.status,
            price=apt.price,
            bonuses_used=apt.bonuses_used,
            bonuses_earned=apt.bonuses_earned,
        ))
    return out


@router.get("/clinic", response_model=list[ClinicAppointmentOut])
async def clinic_appointments(
    clinic_id: int | None = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[ClinicAppointmentOut]:
    query = select(Appointment).order_by(Appointment.scheduled_at.desc())
    if clinic_id is not None:
        query = query.where(Appointment.clinic_id == clinic_id)
    result = await db.execute(query)
    appointments = list(result.scalars().all())

    out = []
    for apt in appointments:
        dr_result = await db.execute(select(Doctor).where(Doctor.id == apt.doctor_id))
        doctor = dr_result.scalar_one_or_none()

        patient_result = await db.execute(select(User).where(User.id == apt.patient_id))
        patient = patient_result.scalar_one_or_none()

        clinic_name: str | None = None
        if doctor and doctor.clinic_id:
            cl_result = await db.execute(select(Clinic.name).where(Clinic.id == doctor.clinic_id))
            clinic_name = cl_result.scalar_one_or_none()

        out.append(ClinicAppointmentOut(
            id=apt.id,
            doctor_name=doctor.name if doctor else "Неизвестно",
            patient_name=patient.name if patient else "Пациент",
            clinic_name=clinic_name,
            scheduled_at=apt.scheduled_at,
            service_type=apt.service_type,
            status=apt.status,
            price=apt.price,
            bonuses_used=apt.bonuses_used,
            bonuses_earned=apt.bonuses_earned,
        ))
    return out


@router.patch("/{appointment_id}/confirm", response_model=AppointmentOut)
async def confirm_appointment(
    appointment_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> AppointmentOut:
    result = await db.execute(
        select(Appointment).where(Appointment.id == appointment_id)
    )
    apt = result.scalar_one_or_none()
    if apt is None:
        raise HTTPException(status_code=404, detail="Запись не найдена")
    if apt.status != "pending":
        raise HTTPException(status_code=400, detail=f"Нельзя подтвердить запись со статусом {apt.status}")

    apt.status = "confirmed"
    await db.commit()
    await db.refresh(apt)

    dr_result = await db.execute(select(Doctor).where(Doctor.id == apt.doctor_id))
    doctor = dr_result.scalar_one_or_none()
    clinic_name: str | None = None
    if doctor and doctor.clinic_id:
        cl_result = await db.execute(select(Clinic.name).where(Clinic.id == doctor.clinic_id))
        clinic_name = cl_result.scalar_one_or_none()

    return AppointmentOut(
        id=apt.id,
        doctor_name=doctor.name if doctor else "Неизвестно",
        clinic_name=clinic_name,
        scheduled_at=apt.scheduled_at,
        service_type=apt.service_type,
        status=apt.status,
        price=apt.price,
        bonuses_used=apt.bonuses_used,
        bonuses_earned=apt.bonuses_earned,
    )


@router.patch("/{appointment_id}/complete", response_model=AppointmentOut)
async def complete_appointment(
    appointment_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> AppointmentOut:
    result = await db.execute(
        select(Appointment).where(Appointment.id == appointment_id)
    )
    apt = result.scalar_one_or_none()
    if apt is None:
        raise HTTPException(status_code=404, detail="Запись не найдена")
    if apt.status in ("completed", "cancelled"):
        raise HTTPException(status_code=400, detail=f"Нельзя завершить запись со статусом {apt.status}")

    apt.status = "completed"
    apt.bonuses_earned = round(apt.price * 0.05)

    patient_result = await db.execute(select(User).where(User.id == apt.patient_id))
    patient = patient_result.scalar_one_or_none()
    if patient:
        patient.bonus_balance += apt.bonuses_earned

    await db.commit()
    await db.refresh(apt)

    dr_result = await db.execute(select(Doctor).where(Doctor.id == apt.doctor_id))
    doctor = dr_result.scalar_one_or_none()
    clinic_name: str | None = None
    if doctor and doctor.clinic_id:
        cl_result = await db.execute(select(Clinic.name).where(Clinic.id == doctor.clinic_id))
        clinic_name = cl_result.scalar_one_or_none()

    return AppointmentOut(
        id=apt.id,
        doctor_name=doctor.name if doctor else "Неизвестно",
        clinic_name=clinic_name,
        scheduled_at=apt.scheduled_at,
        service_type=apt.service_type,
        status=apt.status,
        price=apt.price,
        bonuses_used=apt.bonuses_used,
        bonuses_earned=apt.bonuses_earned,
    )


@router.patch("/{appointment_id}/cancel", response_model=AppointmentOut)
async def cancel_appointment(
    appointment_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> AppointmentOut:
    result = await db.execute(
        select(Appointment).where(
            Appointment.id == appointment_id,
            Appointment.patient_id == current_user.id,
        )
    )
    apt = result.scalar_one_or_none()
    if apt is None:
        raise HTTPException(status_code=404, detail="Запись не найдена")
    if apt.status == "completed":
        raise HTTPException(status_code=400, detail="Нельзя отменить завершённый приём")

    if apt.bonuses_used > 0:
        current_user.bonus_balance += apt.bonuses_used

    apt.status = "cancelled"
    await db.commit()
    await db.refresh(apt)

    dr_result = await db.execute(select(Doctor).where(Doctor.id == apt.doctor_id))
    doctor = dr_result.scalar_one_or_none()
    clinic_name: str | None = None
    if doctor and doctor.clinic_id:
        cl_result = await db.execute(select(Clinic.name).where(Clinic.id == doctor.clinic_id))
        clinic_name = cl_result.scalar_one_or_none()

    return AppointmentOut(
        id=apt.id,
        doctor_name=doctor.name if doctor else "Неизвестно",
        clinic_name=clinic_name,
        scheduled_at=apt.scheduled_at,
        service_type=apt.service_type,
        status=apt.status,
        price=apt.price,
        bonuses_used=apt.bonuses_used,
        bonuses_earned=apt.bonuses_earned,
    )
