"""Initial schema for notification service

Revision ID: 001
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create notifications table
    op.execute("""
        CREATE TABLE IF NOT EXISTS notifications (
            id BIGSERIAL PRIMARY KEY,
            user_id BIGINT NOT NULL,
            title VARCHAR(200) NOT NULL,
            message TEXT NOT NULL,
            notification_type VARCHAR(20) NOT NULL CHECK (notification_type IN ('INFO', 'WARNING', 'ERROR', 'SUCCESS')),
            is_read BOOLEAN DEFAULT FALSE,
            action_url VARCHAR(500),
            metadata JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            read_at TIMESTAMP
        );
    """)
    
    # Create indexes for notifications
    op.execute("""
        CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id, created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
    """)
    
    # Create notification_preferences table
    op.execute("""
        CREATE TABLE IF NOT EXISTS notification_preferences (
            id BIGSERIAL PRIMARY KEY,
            user_id BIGINT UNIQUE NOT NULL,
            email_enabled BOOLEAN DEFAULT TRUE,
            sms_enabled BOOLEAN DEFAULT TRUE,
            in_app_enabled BOOLEAN DEFAULT TRUE,
            marketing_emails BOOLEAN DEFAULT FALSE,
            digest_frequency VARCHAR(10) DEFAULT 'WEEKLY' CHECK (digest_frequency IN ('DAILY', 'WEEKLY', 'NEVER')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    
    # Create index for notification_preferences
    op.execute("""
        CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);
    """)
    
    # Create trigger for notification_preferences updated_at
    op.execute("""
        CREATE OR REPLACE FUNCTION update_notification_prefs_timestamp()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ language 'plpgsql';
        
        CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences
        FOR EACH ROW EXECUTE FUNCTION update_notification_prefs_timestamp();
    """)
    
    # Add comments for documentation
    op.execute("""
        COMMENT ON TABLE notifications IS 'In-app notifications for users with read/unread tracking';
        COMMENT ON TABLE notification_preferences IS 'User preferences for email, SMS, and in-app notifications';
        COMMENT ON COLUMN notifications.metadata IS 'Additional context data as JSON for notification rendering';
        COMMENT ON COLUMN notifications.action_url IS 'Optional deep link within the application';
        COMMENT ON COLUMN notification_preferences.digest_frequency IS 'Frequency for weekly digest emails: DAILY, WEEKLY, or NEVER';
    """)


def downgrade() -> None:
    op.execute("DROP TRIGGER IF EXISTS update_notification_preferences_updated_at ON notification_preferences;")
    op.execute("DROP FUNCTION IF EXISTS update_notification_prefs_timestamp();")
    op.execute("DROP TABLE IF EXISTS notification_preferences;")
    op.execute("DROP TABLE IF EXISTS notifications;")
