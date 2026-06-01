"""add_username_to_users

Revision ID: a1b2c3d4e5f6
Revises: ce05435f23b0
Create Date: 2026-06-01 19:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, None] = "ce05435f23b0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("username", sa.String(length=100), nullable=True))
    op.execute(
        """
        UPDATE users
        SET username = lower(split_part(email, '@', 1)) || '_' || left(id::text, 8)
        WHERE username IS NULL
        """
    )
    op.alter_column("users", "username", existing_type=sa.String(length=100), nullable=False)
    op.create_index(op.f("ix_users_username"), "users", ["username"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_users_username"), table_name="users")
    op.drop_column("users", "username")
