"""
Seed realistic appointments for СМ-Клиника (May + June 2026).
Run: python -m scripts.seed_appointments
Idempotent: skips appointment generation if > 10 already exist for clinic.
"""
import asyncio
import random
from datetime import date, datetime, time, timedelta
from zoneinfo import ZoneInfo

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings
from app.models.appointment import Appointment
from app.models.clinic import Clinic
from app.models.doctor import Doctor
from app.models.schedule import DoctorSchedule
from app.models.user import User

MOSCOW = ZoneInfo("Europe/Moscow")

NEW_DOCTORS = [
    {
        "slug": "pavel-ivanov-sm",
        "name": "Иванов Павел Сергеевич",
        "specialty": "Терапевт",
        "bio": "Врач-терапевт высшей категории. 18 лет опыта.",
        "avatar": "https://i.pravatar.cc/150?u=pavel-ivanov-sm",
        "experience": 18,
        "rating": 4.8,
        "review_count": 312,
        "price": 2200,
        "is_verified": True,
        "is_active": True,
    },
    {
        "slug": "elena-morozova-sm",
        "name": "Морозова Елена Владимировна",
        "specialty": "Невролог",
        "bio": "Невролог, специализируется на головных болях и нарушениях сна.",
        "avatar": "https://i.pravatar.cc/150?u=elena-morozova-sm",
        "experience": 12,
        "rating": 4.9,
        "review_count": 187,
        "price": 3200,
        "is_verified": True,
        "is_active": True,
    },
    {
        "slug": "aleksey-sidorov-sm",
        "name": "Сидоров Алексей Николаевич",
        "specialty": "Гастроэнтеролог",
        "bio": "Гастроэнтеролог, кандидат медицинских наук.",
        "avatar": "https://i.pravatar.cc/150?u=aleksey-sidorov-sm",
        "experience": 14,
        "rating": 4.7,
        "review_count": 143,
        "price": 2800,
        "is_verified": True,
        "is_active": True,
    },
]

PATIENTS = [
    ("Смирнова Ирина Петровна", "+79161234567"),
    ("Козлов Дмитрий Александрович", "+79162345678"),
    ("Новикова Светлана Игоревна", "+79163456789"),
    ("Морозов Андрей Васильевич", "+79164567890"),
    ("Волкова Татьяна Сергеевна", "+79165678901"),
    ("Лебедев Михаил Юрьевич", "+79166789012"),
    ("Соловьёва Ольга Николаевна", "+79167890123"),
    ("Попов Евгений Борисович", "+79168901234"),
]

SERVICE_TYPES = ["primary", "followup", "online"]
SERVICE_WEIGHTS = [0.5, 0.35, 0.15]


def working_days_between(start: date, end: date) -> list[date]:
    days = []
    d = start
    while d <= end:
        if d.weekday() < 5:
            days.append(d)
        d += timedelta(days=1)
    return days


def rand_slot(day: date) -> datetime:
    hour = random.randint(9, 17)
    minute = random.choice([0, 30])
    if hour == 17:
        minute = 0
    return datetime(day.year, day.month, day.day, hour, minute, tzinfo=MOSCOW)


async def seed_appointments() -> None:
    random.seed(42)

    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with session_maker() as session:
        # Get clinic
        result = await session.execute(select(Clinic).where(Clinic.slug == "sm-klinika"))
        clinic = result.scalar_one_or_none()
        if clinic is None:
            print("❌ СМ-Клиника not found. Run seed.py first.")
            return
        clinic_id = clinic.id

        # Add new doctors (upsert)
        doctor_price_map: dict[int, int] = {}
        all_doctor_ids: list[int] = []

        for data in NEW_DOCTORS:
            res = await session.execute(select(Doctor).where(Doctor.slug == data["slug"]))
            doc = res.scalar_one_or_none()
            if doc is None:
                doc = Doctor(**data, clinic_id=clinic_id)
                session.add(doc)
                await session.flush()
                for wd in range(5):
                    session.add(DoctorSchedule(
                        doctor_id=doc.id,
                        weekday=wd,
                        start_time=time(9, 0),
                        end_time=time(18, 0),
                        slot_duration_min=30,
                    ))
                print(f"  + Добавлен врач: {data['name']}")
            all_doctor_ids.append(doc.id)
            doctor_price_map[doc.id] = doc.price

        # Include existing Козлова (sm-klinika doctor)
        res = await session.execute(select(Doctor).where(Doctor.slug == "maria-kozlova"))
        kozlova = res.scalar_one_or_none()
        if kozlova:
            all_doctor_ids.append(kozlova.id)
            doctor_price_map[kozlova.id] = kozlova.price

        # Add test patients (upsert)
        patient_ids: list[int] = []
        for name, phone in PATIENTS:
            res = await session.execute(select(User).where(User.phone == phone))
            user = res.scalar_one_or_none()
            if user is None:
                user = User(
                    phone=phone,
                    name=name,
                    is_active=True,
                    is_verified=True,
                    role="patient",
                    bonus_balance=0,
                )
                session.add(user)
                await session.flush()
            patient_ids.append(user.id)

        # Check idempotency
        cnt = (await session.execute(
            select(func.count(Appointment.id)).where(Appointment.clinic_id == clinic_id)
        )).scalar_one()
        if cnt > 10:
            print(f"ℹ️  Appointments already exist ({cnt}). Skipping generation.")
            await session.commit()
            return

        def make_apt(day: date, doctor_id: int, status: str) -> Appointment:
            svc = random.choices(SERVICE_TYPES, weights=SERVICE_WEIGHTS)[0]
            price = doctor_price_map[doctor_id]
            bonuses_earned = round(price * 0.05) if status == "completed" else 0
            return Appointment(
                patient_id=random.choice(patient_ids),
                doctor_id=doctor_id,
                clinic_id=clinic_id,
                service_type=svc,
                scheduled_at=rand_slot(day),
                price=price,
                bonuses_used=0,
                bonuses_earned=bonuses_earned,
                status=status,
            )

        apts: list[Appointment] = []

        # May 2026: completed(78%) + cancelled(22%)
        for day in working_days_between(date(2026, 5, 5), date(2026, 5, 30)):
            for did in all_doctor_ids:
                n = random.choices([0, 2, 3, 4, 5], weights=[10, 20, 35, 25, 10])[0]
                for _ in range(n):
                    status = random.choices(["completed", "cancelled"], weights=[78, 22])[0]
                    apts.append(make_apt(day, did, status))

        # June 1–13: completed(80%) + cancelled(20%)
        for day in working_days_between(date(2026, 6, 1), date(2026, 6, 13)):
            for did in all_doctor_ids:
                n = random.choices([0, 2, 3, 4, 5], weights=[10, 20, 35, 25, 10])[0]
                for _ in range(n):
                    status = random.choices(["completed", "cancelled"], weights=[80, 20])[0]
                    apts.append(make_apt(day, did, status))

        # June 14 (today, Sunday) — дежурные записи
        today = date(2026, 6, 14)
        for did in all_doctor_ids[:2]:
            for _ in range(random.randint(2, 4)):
                status = random.choices(["confirmed", "pending"], weights=[60, 40])[0]
                apts.append(make_apt(today, did, status))

        # June 15–30: pending/confirmed
        for day in working_days_between(date(2026, 6, 15), date(2026, 6, 30)):
            for did in all_doctor_ids:
                n = random.choices([0, 1, 2, 3, 4], weights=[15, 25, 30, 20, 10])[0]
                for _ in range(n):
                    status = (
                        "pending"
                        if day > date(2026, 6, 16)
                        else random.choices(["pending", "confirmed"], weights=[50, 50])[0]
                    )
                    apts.append(make_apt(day, did, status))

        for apt in apts:
            session.add(apt)

        await session.commit()
        total_may = sum(1 for a in apts if a.scheduled_at.month == 5)
        total_june = sum(1 for a in apts if a.scheduled_at.month == 6)
        print(f"✅ Seeded {len(apts)} appointments (май: {total_may}, июнь: {total_june}) для clinic_id={clinic_id}.")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed_appointments())
