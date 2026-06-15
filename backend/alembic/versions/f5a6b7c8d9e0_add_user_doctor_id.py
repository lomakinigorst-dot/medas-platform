"""add user doctor_id

Revision ID: f5a6b7c8d9e0
Revises: e4f5a6b7c8d9
Create Date: 2026-06-15
"""
from typing import Union

import sqlalchemy as sa
from alembic import op

revision: str = "f5a6b7c8d9e0"
down_revision: Union[str, None] = "e4f5a6b7c8d9"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("doctor_id", sa.Integer(), sa.ForeignKey("doctors.id"), nullable=True),
    )
    op.create_index("ix_users_doctor_id", "users", ["doctor_id"])


def downgrade() -> None:
    op.drop_index("ix_users_doctor_id", table_name="users")
    op.drop_column("users", "doctor_id")
