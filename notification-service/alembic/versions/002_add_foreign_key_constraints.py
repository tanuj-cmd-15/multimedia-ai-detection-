"""Add foreign key constraints to notification service tables

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
    # Add foreign key constraint from notifications to users
    # Note: This references users table from auth-service database
    # In a shared PostgreSQL setup, we assume users table exists
    op.execute("""
        ALTER TABLE notifications 
        ADD CONSTRAINT fk_notifications_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    """)
    
    # Add foreign key constraint from notification_preferences to users
    op.execute("""
        ALTER TABLE notification_preferences 
        ADD CONSTRAINT fk_notification_preferences_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    """)
    
    # Add comments
    op.execute("""
        COMMENT ON CONSTRAINT fk_notifications_user_id ON notifications IS 'Foreign key to users table with cascade delete';
        COMMENT ON CONSTRAINT fk_notification_preferences_user_id ON notification_preferences IS 'Foreign key to users table with cascade delete';
    """)


def downgrade() -> None:
    op.execute("ALTER TABLE notification_preferences DROP CONSTRAINT IF EXISTS fk_notification_preferences_user_id;")
    op.execute("ALTER TABLE notifications DROP CONSTRAINT IF EXISTS fk_notifications_user_id;")

