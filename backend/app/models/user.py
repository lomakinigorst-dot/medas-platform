from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    phone: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    hashed_password: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    bonus_balance: Mapped[int] = mapped_column(Integer, default=500)  # welcome bonus
    role: Mapped[str] = mapped_column(String(20), default="patient", server_default="patient")
    clinic_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("clinics.id"), nullable=True)
    doctor_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("doctors.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    appointments: Mapped[list["Appointment"]] = relationship("Appointment", back_populates="patient")  # noqa: F821
    reviews: Mapped[list["Review"]] = relationship("Review", back_populates="patient")  # noqa: F821
    bonus_transactions: Mapped[list["BonusTransaction"]] = relationship("BonusTransaction", back_populates="user")  # noqa: F821
