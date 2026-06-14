"""add user role and clinic_id

Revision ID: d3e4f5a6b7c8
Revises: c2d3e4f5a6b7
Create Date: 2026-06-13

"""
from typing import Sequence, Union
import sqlalchemy as sa
from alembic import op

revision: str = "d3e4f5a6b7c8"
down_revision: Union[str, None] = "c2d3e4f5a6b7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("role", sa.String(20), nullable=False, server_default="patient"))
    op.add_column("users", sa.Column("clinic_id", sa.Integer(), nullable=True))
    op.create_foreign_key(
        "fk_users_clinic_id",
        "users", "clinics",
        ["clinic_id"], ["id"],
    )


def downgrade() -> None:
    op.drop_constraint("fk_users_clinic_id", "users", type_="foreignkey")
    op.drop_column("users", "clinic_id")
    op.drop_column("users", "role")
