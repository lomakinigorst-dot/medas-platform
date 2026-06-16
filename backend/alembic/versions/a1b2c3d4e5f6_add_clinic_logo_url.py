"""add_clinic_logo_url

Revision ID: a1b2c3d4e5f6
Revises: f5a6b7c8d9e0
Create Date: 2026-06-16 00:00:00.000000

"""
from typing import Union

import sqlalchemy as sa
from alembic import op

revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, None] = "f5a6b7c8d9e0"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("clinics", sa.Column("logo_url", sa.String(500), nullable=True))


def downgrade() -> None:
    op.drop_column("clinics", "logo_url")
