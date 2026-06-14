"""Seed only doctor_schedules for existing doctors (Mon-Fri, 09:00-18:00, 30-min slots)."""
import asyncio
from datetime import time

from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.models.doctor import Doctor
from app.models.schedule import DoctorSchedule

engine = create_async_engine(settings.DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def seed():
    async with AsyncSessionLocal() as session:
        # Delete existing schedules to avoid duplicates
        await session.execute(delete(DoctorSchedule))
        await session.flush()

        doctors_result = await session.execute(select(Doctor).where(Doctor.is_active == True))  # noqa: E712
        doctors = list(doctors_result.scalars().all())

        if not doctors:
            print("No doctors found. Run main seed first.")
            return

        for doctor in doctors:
            for weekday in range(5):  # Mon-Fri
                session.add(DoctorSchedule(
                    doctor_id=doctor.id,
                    weekday=weekday,
                    start_time=time(9, 0),
                    end_time=time(18, 0),
                    slot_duration_min=30,
                ))

        await session.commit()
        print(f"✅ Seeded schedules for {len(doctors)} doctors (Mon-Fri, 09:00-18:00, 30-min slots).")


asyncio.run(seed())
