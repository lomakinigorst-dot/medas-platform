"""
Seed doctor test user linked to first doctor in DB.
Run: python -m scripts.seed_doctor_user
"""
import asyncio

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy import select

from app.core.config import settings
from app.models.doctor import Doctor
from app.models.user import User


async def seed() -> None:
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        first_doctor = (await session.execute(select(Doctor).limit(1))).scalar_one_or_none()
        if first_doctor is None:
            print("❌ No doctors in DB — run seed.py first")
            return

        existing = (await session.execute(select(User).where(User.phone == "+70000000002"))).scalar_one_or_none()
        if existing is None:
            session.add(User(
                phone="+70000000002",
                name="Иванова Мария Сергеевна",
                role="doctor",
                doctor_id=first_doctor.id,
                is_active=True,
                is_verified=True,
            ))
            print(f"✅ Created doctor user +70000000002 → doctor_id={first_doctor.id} ({first_doctor.name})")
        else:
            existing.role = "doctor"
            existing.doctor_id = first_doctor.id
            print(f"✅ Updated doctor user +70000000002 → doctor_id={first_doctor.id} ({first_doctor.name})")

        await session.commit()

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
