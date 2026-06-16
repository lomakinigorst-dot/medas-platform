"""add user medical profile fields

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-06-16
"""
from typing import Union

import sqlalchemy as sa
from alembic import op

revision: str = "b2c3d4e5f6a7"
down_revision: Union[str, None] = "a1b2c3d4e5f6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("birth_date", sa.Date(), nullable=True))
    op.add_column("users", sa.Column("blood_type", sa.String(10), nullable=True))
    op.add_column("users", sa.Column("allergies", sa.Text(), nullable=True))
    op.add_column("users", sa.Column("chronic_conditions", sa.Text(), nullable=True))
    op.add_column("users", sa.Column("weight_kg", sa.Float(), nullable=True))
    op.add_column("users", sa.Column("height_cm", sa.Integer(), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "height_cm")
    op.drop_column("users", "weight_kg")
    op.drop_column("users", "chronic_conditions")
    op.drop_column("users", "allergies")
    op.drop_column("users", "blood_type")
    op.drop_column("users", "birth_date")
