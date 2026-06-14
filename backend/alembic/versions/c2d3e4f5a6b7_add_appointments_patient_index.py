"""add_appointments_patient_index

Revision ID: c2d3e4f5a6b7
Revises: a3f8c2d1e5b9
Create Date: 2026-06-13

"""
from alembic import op

revision = "c2d3e4f5a6b7"
down_revision = "a3f8c2d1e5b9"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_index("ix_appointments_patient_id", "appointments", ["patient_id"])


def downgrade() -> None:
    op.drop_index("ix_appointments_patient_id", table_name="appointments")
