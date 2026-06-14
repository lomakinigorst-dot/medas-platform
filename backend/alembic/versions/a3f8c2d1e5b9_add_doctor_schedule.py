"""add_doctor_schedule

Revision ID: a3f8c2d1e5b9
Revises: 77dbb05f7c23
Create Date: 2026-06-13

"""
from alembic import op
import sqlalchemy as sa

revision = "a3f8c2d1e5b9"
down_revision = "77dbb05f7c23"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "doctor_schedules",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("doctor_id", sa.Integer(), sa.ForeignKey("doctors.id"), nullable=False, index=True),
        sa.Column("weekday", sa.Integer(), nullable=False),
        sa.Column("start_time", sa.Time(), nullable=False),
        sa.Column("end_time", sa.Time(), nullable=False),
        sa.Column("slot_duration_min", sa.Integer(), nullable=False, server_default="30"),
    )


def downgrade() -> None:
    op.drop_table("doctor_schedules")
