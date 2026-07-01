"""Initial schema for support service

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
    # Create tickets table
    op.execute("""
        CREATE TABLE IF NOT EXISTS tickets (
            id BIGSERIAL PRIMARY KEY,
            user_id BIGINT NOT NULL,
            ticket_number VARCHAR(20) UNIQUE NOT NULL,
            subject VARCHAR(200) NOT NULL,
            category VARCHAR(30) NOT NULL CHECK (category IN ('TECHNICAL', 'BILLING', 'FEATURE_REQUEST', 'BUG_REPORT', 'OTHER')),
            status VARCHAR(20) NOT NULL CHECK (status IN ('OPEN', 'IN_PROGRESS', 'WAITING_USER', 'RESOLVED', 'CLOSED')),
            priority VARCHAR(10) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            resolved_at TIMESTAMP,
            
            CONSTRAINT valid_resolution CHECK (
                (status IN ('RESOLVED', 'CLOSED') AND resolved_at IS NOT NULL) OR
                (status NOT IN ('RESOLVED', 'CLOSED') AND resolved_at IS NULL)
            )
        );
    """)
    
    # Create indexes for tickets
    op.execute("""
        CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
        CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
        CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);
    """)
    
    # Create ticket_messages table
    op.execute("""
        CREATE TABLE IF NOT EXISTS ticket_messages (
            id BIGSERIAL PRIMARY KEY,
            ticket_id BIGINT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
            sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('USER', 'AGENT', 'SYSTEM')),
            sender_name VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            attachments JSONB DEFAULT '[]',
            is_internal BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    
    # Create index for ticket_messages
    op.execute("""
        CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id, created_at);
    """)
    
    # Create faq table
    op.execute("""
        CREATE TABLE IF NOT EXISTS faq (
            id BIGSERIAL PRIMARY KEY,
            category VARCHAR(50) NOT NULL,
            question VARCHAR(500) NOT NULL,
            answer TEXT NOT NULL,
            helpful_count INT DEFAULT 0,
            display_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    
    # Create index for faq
    op.execute("""
        CREATE INDEX IF NOT EXISTS idx_faq_category ON faq(category, display_order);
    """)
    
    # Create trigger for tickets updated_at
    op.execute("""
        CREATE OR REPLACE FUNCTION update_ticket_timestamp()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ language 'plpgsql';
        
        CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
        FOR EACH ROW EXECUTE FUNCTION update_ticket_timestamp();
    """)
    
    # Create trigger for faq updated_at
    op.execute("""
        CREATE TRIGGER update_faq_updated_at BEFORE UPDATE ON faq
        FOR EACH ROW EXECUTE FUNCTION update_ticket_timestamp();
    """)
    
    # Add comments for documentation
    op.execute("""
        COMMENT ON TABLE tickets IS 'Customer support tickets with category, status, and priority tracking';
        COMMENT ON TABLE ticket_messages IS 'Messages within support tickets from users, agents, or system';
        COMMENT ON TABLE faq IS 'Frequently asked questions with categories and display order';
        COMMENT ON COLUMN ticket_messages.is_internal IS 'Internal notes visible only to support agents';
        COMMENT ON COLUMN ticket_messages.attachments IS 'JSON array of file URLs stored in MinIO';
    """)
    
    # Insert default FAQ entries
    op.execute("""
        INSERT INTO faq (category, question, answer, display_order) VALUES
        ('GENERAL', 'What is MayaBhedak?', 'MayaBhedak is an AI-powered deepfake detection platform that analyzes audio and image files to determine authenticity. Our advanced machine learning models can detect synthetic content created by various AI tools.', 1),
        ('GENERAL', 'How does the detection work?', 'Our system uses state-of-the-art deep learning models trained on millions of real and synthetic samples. For audio, we analyze acoustic patterns and artifacts. For images, we examine pixel-level inconsistencies and GAN signatures.', 2),
        ('GENERAL', 'How accurate is the detection?', 'Our models achieve 95%+ accuracy on benchmark datasets. However, accuracy can vary based on file quality, generation method, and post-processing. We provide confidence scores with each prediction.', 3),
        ('TRIAL', 'What happens after my free trial expires?', 'After your 14-day trial expires, you will need to upgrade to a paid plan (Pro or Enterprise) to continue using the platform. Your account and previous detection history will be preserved.', 4),
        ('TRIAL', 'How do I upgrade to Pro plan?', 'Navigate to Settings > Subscription and click "Upgrade to Pro". You can pay via credit card, UPI, or net banking. The Pro plan provides 1000 audio + 1000 image detections per month for ₹999.', 5),
        ('BILLING', 'Can I get a refund?', 'We offer a 7-day money-back guarantee for new Pro subscribers. Enterprise plans have custom refund policies. Contact support@mayabhedak.com for refund requests.', 6),
        ('API', 'How do I generate an API key?', 'Go to Settings > API Keys and click "Generate New Key". Copy the key immediately as it will not be shown again. Pro users can create up to 5 API keys.', 7),
        ('API', 'What are the rate limits for each plan?', 'Free Trial: 10 requests/minute, Pro: 100 requests/minute, Enterprise: 1000 requests/minute. Rate limits reset every 60 seconds.', 8),
        ('PRIVACY', 'Is my data stored permanently?', 'Audio and image files are stored for 30 days for analysis history, then automatically deleted. Detection results and metadata are retained for 90 days. Enterprise users can customize retention policies.', 9),
        ('ACCOUNT', 'How do I delete my account?', 'Go to Settings > Account > Delete Account. This action is irreversible and will permanently delete all your data, detection history, and subscription information.', 10)
        ON CONFLICT DO NOTHING;
    """)


def downgrade() -> None:
    op.execute("DROP TRIGGER IF EXISTS update_faq_updated_at ON faq;")
    op.execute("DROP TRIGGER IF EXISTS update_tickets_updated_at ON tickets;")
    op.execute("DROP FUNCTION IF EXISTS update_ticket_timestamp();")
    op.execute("DROP TABLE IF EXISTS faq;")
    op.execute("DROP TABLE IF EXISTS ticket_messages;")
    op.execute("DROP TABLE IF EXISTS tickets;")
