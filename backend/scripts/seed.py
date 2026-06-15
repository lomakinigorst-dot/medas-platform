"""
Seed initial data: clinics + doctors from frontend mock data.
Run: python -m scripts.seed
"""
import asyncio
from datetime import time

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy import select

from app.core.config import settings
from app.core.database import Base
from app.models.clinic import Clinic
from app.models.doctor import Doctor
from app.models.schedule import DoctorSchedule
from app.models.user import User

CLINICS = [
    {
        "slug": "medicina-na-tsvetnoy",
        "name": "Медицина на Цветном",
        "description": "Многопрофильный медицинский центр в центре Москвы с 20-летней историей.",
        "address": "ул. Цветной бульвар, 30",
        "metro": "Цветной бульвар",
        "phone": "+7 (495) 123-45-67",
        "website": "https://medicina-tsvetnoy.ru",
        "rating": 4.9,
        "review_count": 1247,
        "accepts_dms": True,
    },
    {
        "slug": "evromedservice",
        "name": "ЕвроМедСервис",
        "description": "Европейские стандарты диагностики и лечения.",
        "address": "Ленинский пр., 123",
        "metro": "Университет",
        "phone": "+7 (495) 234-56-78",
        "rating": 4.8,
        "review_count": 893,
        "accepts_dms": True,
    },
    {
        "slug": "sm-klinika",
        "name": "СМ-Клиника",
        "description": "Сеть семейных клиник с педиатрическими отделениями.",
        "address": "ул. Новочерёмушкинская, 65",
        "metro": "Профсоюзная",
        "phone": "+7 (495) 345-67-89",
        "rating": 4.7,
        "review_count": 2104,
        "accepts_dms": False,
    },
    {
        "slug": "stomatologiya-ulybka",
        "name": "Стоматология Улыбка",
        "description": "Современная стоматология — от диагностики до имплантации.",
        "address": "ул. Арбат, 15",
        "metro": "Арбатская",
        "phone": "+7 (495) 456-78-90",
        "rating": 4.6,
        "review_count": 543,
        "accepts_dms": False,
    },
    {
        "slug": "semeynyy-doktor",
        "name": "Семейный доктор",
        "description": "Семейная клиника. Принимаем детей и взрослых.",
        "address": "Кутузовский пр., 22",
        "metro": "Кутузовская",
        "phone": "+7 (495) 567-89-01",
        "rating": 4.5,
        "review_count": 731,
        "accepts_dms": True,
    },
]

DOCTORS = [
    {
        "slug": "anna-sokolova",
        "name": "Соколова Анна Михайловна",
        "specialty": "Кардиолог",
        "bio": "Специалист по заболеваниям сердечно-сосудистой системы. Кандидат медицинских наук.",
        "avatar": "https://i.pravatar.cc/150?u=anna-sokolova",
        "experience": 15,
        "rating": 4.9,
        "review_count": 238,
        "price": 3500,
        "is_verified": True,
        "clinic_slug": "medicina-na-tsvetnoy",
    },
    {
        "slug": "igor-petrov",
        "name": "Петров Игорь Сергеевич",
        "specialty": "Хирург",
        "bio": "Хирург высшей категории. Специализируется на малоинвазивных операциях.",
        "avatar": "https://i.pravatar.cc/150?u=igor-petrov",
        "experience": 22,
        "rating": 4.8,
        "review_count": 156,
        "price": 4000,
        "is_verified": True,
        "clinic_slug": "evromedservice",
    },
    {
        "slug": "maria-kozlova",
        "name": "Козлова Мария Александровна",
        "specialty": "Педиатр",
        "bio": "Педиатр с многолетним опытом. Специализируется на раннем развитии и вакцинации.",
        "avatar": "https://i.pravatar.cc/150?u=maria-kozlova",
        "experience": 10,
        "rating": 4.95,
        "review_count": 412,
        "price": 2500,
        "is_verified": True,
        "clinic_slug": "sm-klinika",
    },
]


async def seed() -> None:
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with session_maker() as session:
        # Clinics
        clinic_map: dict[str, int] = {}
        for data in CLINICS:
            clinic = Clinic(**data)
            session.add(clinic)
            await session.flush()
            clinic_map[data["slug"]] = clinic.id

        # Doctors
        doctor_ids: list[int] = []
        for data in DOCTORS:
            clinic_slug = data.pop("clinic_slug")
            doctor = Doctor(**data, clinic_id=clinic_map.get(clinic_slug))
            session.add(doctor)
            await session.flush()
            doctor_ids.append(doctor.id)

        # Schedules: Mon-Fri (0-4), 09:00-18:00, 30-min slots
        for doctor_id in doctor_ids:
            for weekday in range(5):  # 0=Mon .. 4=Fri
                session.add(DoctorSchedule(
                    doctor_id=doctor_id,
                    weekday=weekday,
                    start_time=time(9, 0),
                    end_time=time(18, 0),
                    slot_duration_min=30,
                ))

        # Clinic admin user (upsert)
        sm_clinic_id = clinic_map.get("sm-klinika")
        existing = await session.execute(select(User).where(User.phone == "+70000000001"))
        clinic_user = existing.scalar_one_or_none()
        if clinic_user is None:
            session.add(User(
                phone="+70000000001",
                name="Администратор СМ-Клиника",
                role="clinic",
                clinic_id=sm_clinic_id,
                is_active=True,
                is_verified=True,
            ))
        else:
            clinic_user.role = "clinic"
            clinic_user.clinic_id = sm_clinic_id

        # Doctor user (upsert) — linked to first seeded doctor
        if doctor_ids:
            existing_doc = await session.execute(select(User).where(User.phone == "+70000000002"))
            doctor_user = existing_doc.scalar_one_or_none()
            if doctor_user is None:
                session.add(User(
                    phone="+70000000002",
                    name="Иванова Мария Сергеевна",
                    role="doctor",
                    doctor_id=doctor_ids[0],
                    is_active=True,
                    is_verified=True,
                ))
            else:
                doctor_user.role = "doctor"
                doctor_user.doctor_id = doctor_ids[0]

        await session.commit()

    await engine.dispose()
    print(f"✅ Seeded {len(CLINICS)} clinics, {len(DOCTORS)} doctors + schedules + 1 clinic admin + 1 doctor user.")


if __name__ == "__main__":
    asyncio.run(seed())
