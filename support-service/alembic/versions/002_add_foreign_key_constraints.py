"""Add foreign key constraints to support service tables

Revision ID: 002
Revises: 001
Create Date: 2024-01-02 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '002'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add foreign key constraint from tickets to users
    # Note: This references users table from auth-service database
    # In a shared PostgreSQL setup, we assume users table exists
    op.execute("""
        ALTER TABLE tickets 
        ADD CONSTRAINT fk_tickets_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    """)
    
    # Add comment
    op.execute("""
        COMMENT ON CONSTRAINT fk_tickets_user_id ON tickets IS 'Foreign key to users table with cascade delete';
    """)


def downgrade() -> None:
    op.execute("ALTER TABLE tickets DROP CONSTRAINT IF EXISTS fk_tickets_user_id;")

