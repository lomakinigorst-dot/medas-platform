from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.appointment import Appointment
from app.models.clinic import Clinic
from app.models.doctor import Doctor
from app.models.schedule import DoctorSchedule
from app.models.user import User
from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentOut,
    ClinicAppointmentOut,
    ClinicStats,
    DoctorLoadItem,
    RevenueDay,
)

MOSCOW = ZoneInfo("Europe/Moscow")

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
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[ClinicAppointmentOut]:
    if current_user.role != "clinic":
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    if current_user.clinic_id is None:
        raise HTTPException(status_code=403, detail="Клиника не привязана к аккаунту")
    query = (
        select(Appointment)
        .where(Appointment.clinic_id == current_user.clinic_id)
        .order_by(Appointment.scheduled_at.desc())
    )
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


@router.get("/clinic/stats", response_model=ClinicStats)
async def clinic_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ClinicStats:
    if current_user.role != "clinic":
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    if current_user.clinic_id is None:
        raise HTTPException(status_code=403, detail="Клиника не привязана к аккаунту")

    cid = current_user.clinic_id
    now_moscow = datetime.now(MOSCOW)
    today = now_moscow.date()
    month_start = today.replace(day=1)
    prev_month_end = month_start - timedelta(days=1)
    prev_month_start = prev_month_end.replace(day=1)
    thirty_days_ago = today - timedelta(days=29)

    def date_of(col):  # type: ignore[no-untyped-def]
        return func.date(col)

    base = Appointment.clinic_id == cid

    # today_count
    today_count_res = await db.execute(
        select(func.count(Appointment.id)).where(
            base,
            date_of(Appointment.scheduled_at) == today,
            Appointment.status != "cancelled",
        )
    )
    today_count: int = today_count_res.scalar_one() or 0

    # today_revenue
    today_rev_res = await db.execute(
        select(func.coalesce(func.sum(Appointment.price), 0)).where(
            base,
            date_of(Appointment.scheduled_at) == today,
            Appointment.status.in_(["confirmed", "completed"]),
        )
    )
    today_revenue: int = today_rev_res.scalar_one() or 0

    # pending_count
    pending_res = await db.execute(
        select(func.count(Appointment.id)).where(base, Appointment.status == "pending")
    )
    pending_count: int = pending_res.scalar_one() or 0

    # month_count
    month_count_res = await db.execute(
        select(func.count(Appointment.id)).where(
            base,
            date_of(Appointment.scheduled_at) >= month_start,
            date_of(Appointment.scheduled_at) <= today,
            Appointment.status != "cancelled",
        )
    )
    month_count: int = month_count_res.scalar_one() or 0

    # month_revenue
    month_rev_res = await db.execute(
        select(func.coalesce(func.sum(Appointment.price), 0)).where(
            base,
            date_of(Appointment.scheduled_at) >= month_start,
            date_of(Appointment.scheduled_at) <= today,
            Appointment.status.in_(["confirmed", "completed"]),
        )
    )
    month_revenue: int = month_rev_res.scalar_one() or 0

    # prev_month_revenue
    prev_rev_res = await db.execute(
        select(func.coalesce(func.sum(Appointment.price), 0)).where(
            base,
            date_of(Appointment.scheduled_at) >= prev_month_start,
            date_of(Appointment.scheduled_at) <= prev_month_end,
            Appointment.status.in_(["confirmed", "completed"]),
        )
    )
    prev_month_revenue: int = prev_rev_res.scalar_one() or 0

    # doctors_today: booked slots per doctor
    doctors_today_res = await db.execute(
        select(Appointment.doctor_id, func.count(Appointment.id))
        .where(
            base,
            date_of(Appointment.scheduled_at) == today,
            Appointment.status != "cancelled",
        )
        .group_by(Appointment.doctor_id)
    )
    booked_by_doctor: dict[int, int] = {row[0]: row[1] for row in doctors_today_res.all()}

    # month_count per doctor (all non-cancelled this month)
    doctors_month_res = await db.execute(
        select(Appointment.doctor_id, func.count(Appointment.id))
        .where(
            base,
            date_of(Appointment.scheduled_at) >= month_start,
            date_of(Appointment.scheduled_at) <= today,
            Appointment.status != "cancelled",
        )
        .group_by(Appointment.doctor_id)
    )
    month_by_doctor: dict[int, int] = {row[0]: row[1] for row in doctors_month_res.all()}

    # total_slots per doctor from DoctorSchedule for today's weekday
    today_weekday = today.weekday()  # 0=Mon
    schedules_res = await db.execute(
        select(DoctorSchedule).where(
            DoctorSchedule.doctor_id.in_(list(booked_by_doctor.keys()) or [-1]),
            DoctorSchedule.weekday == today_weekday,
        )
    )
    schedules = schedules_res.scalars().all()
    slots_by_doctor: dict[int, int] = {}
    for sched in schedules:
        start_dt = datetime.combine(today, sched.start_time)
        end_dt = datetime.combine(today, sched.end_time)
        minutes = int((end_dt - start_dt).total_seconds() // 60)
        slots_by_doctor[sched.doctor_id] = minutes // sched.slot_duration_min

    # Fetch doctor names
    if booked_by_doctor:
        names_res = await db.execute(
            select(Doctor.id, Doctor.name).where(Doctor.id.in_(list(booked_by_doctor.keys())))
        )
        name_map: dict[int, str] = {row[0]: row[1] for row in names_res.all()}
    else:
        name_map = {}

    doctors_today: list[DoctorLoadItem] = [
        DoctorLoadItem(
            doctor_name=name_map.get(did, "Врач"),
            booked=booked,
            total_slots=slots_by_doctor.get(did, 0),
            month_count=month_by_doctor.get(did, 0),
        )
        for did, booked in sorted(booked_by_doctor.items())
    ]

    # revenue_by_day: last 30 days
    rev_by_day_res = await db.execute(
        select(date_of(Appointment.scheduled_at), func.coalesce(func.sum(Appointment.price), 0))
        .where(
            base,
            date_of(Appointment.scheduled_at) >= thirty_days_ago,
            date_of(Appointment.scheduled_at) <= today,
            Appointment.status != "cancelled",
        )
        .group_by(date_of(Appointment.scheduled_at))
        .order_by(date_of(Appointment.scheduled_at))
    )
    revenue_by_day: list[RevenueDay] = [
        RevenueDay(date=str(row[0]), revenue=int(row[1]))
        for row in rev_by_day_res.all()
    ]

    # bonus_used: total bonuses spent by patients this month
    bonus_used_res = await db.execute(
        select(func.coalesce(func.sum(Appointment.bonuses_used), 0)).where(
            base,
            date_of(Appointment.scheduled_at) >= month_start,
            date_of(Appointment.scheduled_at) <= today,
            Appointment.status.in_(["confirmed", "completed"]),
        )
    )
    bonus_used: int = bonus_used_res.scalar_one() or 0

    # confirmed_month: confirmed + completed appointments this month
    confirmed_month_res = await db.execute(
        select(func.count(Appointment.id)).where(
            base,
            date_of(Appointment.scheduled_at) >= month_start,
            date_of(Appointment.scheduled_at) <= today,
            Appointment.status.in_(["confirmed", "completed"]),
        )
    )
    confirmed_month: int = confirmed_month_res.scalar_one() or 0

    # completed_month: completed appointments this month
    completed_month_res = await db.execute(
        select(func.count(Appointment.id)).where(
            base,
            date_of(Appointment.scheduled_at) >= month_start,
            date_of(Appointment.scheduled_at) <= today,
            Appointment.status == "completed",
        )
    )
    completed_month: int = completed_month_res.scalar_one() or 0

    # bonuses_applied_month: appointments where bonuses were used this month
    bonuses_applied_res = await db.execute(
        select(func.count(Appointment.id)).where(
            base,
            date_of(Appointment.scheduled_at) >= month_start,
            date_of(Appointment.scheduled_at) <= today,
            Appointment.bonuses_used > 0,
        )
    )
    bonuses_applied_month: int = bonuses_applied_res.scalar_one() or 0

    return ClinicStats(
        today_count=today_count,
        today_revenue=today_revenue,
        pending_count=pending_count,
        month_count=month_count,
        month_revenue=month_revenue,
        prev_month_revenue=prev_month_revenue,
        doctors_today=doctors_today,
        revenue_by_day=revenue_by_day,
        bonus_used=bonus_used,
        confirmed_month=confirmed_month,
        completed_month=completed_month,
        bonuses_applied_month=bonuses_applied_month,
    )


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
