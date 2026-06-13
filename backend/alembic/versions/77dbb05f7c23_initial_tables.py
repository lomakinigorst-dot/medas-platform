"""initial_tables

Revision ID: 77dbb05f7c23
Revises:
Create Date: 2026-06-13 21:43:28.487206

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '77dbb05f7c23'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Baseline: tables already created via seed.py (create_all).
    # This migration marks the initial schema as known to Alembic.
    pass


def downgrade() -> None:
    pass
