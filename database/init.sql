-- MayaBhedak - Complete Database Schema
-- PostgreSQL 15+

-- ============================================
-- DROP EXISTING TABLES (BE CAREFUL!)
-- ============================================
DROP TABLE IF EXISTS ticket_messages CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS api_keys CASCADE;
DROP TABLE IF EXISTS usage_tracking CASCADE;
DROP TABLE IF EXISTS audio_analyses CASCADE;
DROP TABLE IF EXISTS image_analyses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- USERS TABLE (Enhanced for Multi-Auth)
-- ============================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    
    -- Basic Info
    email VARCHAR(255) UNIQUE,
    mobile VARCHAR(20) UNIQUE,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    
    -- Authentication
    password_hash VARCHAR(255),
    google_sub VARCHAR(255) UNIQUE,
    auth_provider VARCHAR(20) NOT NULL CHECK (auth_provider IN ('EMAIL', 'GOOGLE', 'MOBILE')),
    
    -- Verification Status
    email_verified BOOLEAN DEFAULT FALSE,
    mobile_verified BOOLEAN DEFAULT FALSE,
    
    -- Plan & Trial
    plan VARCHAR(20) NOT NULL DEFAULT 'FREE_TRIAL' CHECK (plan IN ('FREE_TRIAL', 'PRO', 'ENTERPRISE')),
    trial_requests_used INTEGER DEFAULT 0,
    trial_expires_at TIMESTAMP,
    
    -- Organization (for Enterprise users)
    organization_name VARCHAR(255),
    organization_role VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_mobile ON users(mobile);
CREATE INDEX idx_users_google_sub ON users(google_sub);
CREATE INDEX idx_users_plan ON users(plan);

-- ============================================
-- API KEYS TABLE
-- ============================================
CREATE TABLE api_keys (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Key Info
    key_name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(64) NOT NULL UNIQUE, -- SHA-256 hash
    key_prefix VARCHAR(10) NOT NULL, -- First 8 chars for display (mb_XXXXXXXX)
    
    -- Permissions
    scopes TEXT[] NOT NULL, -- ['audio:detect', 'image:detect', 'video:detect']
    rate_limit INTEGER DEFAULT 100, -- requests per minute
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMP,
    
    -- Rotation
    rotated_from_key_id BIGINT REFERENCES api_keys(id),
    grace_period_expires_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_active ON api_keys(is_active);

-- ============================================
-- USAGE TRACKING TABLE
-- ============================================
CREATE TABLE usage_tracking (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Request Info
    detection_type VARCHAR(20) NOT NULL CHECK (detection_type IN ('AUDIO', 'IMAGE', 'VIDEO')),
    endpoint VARCHAR(100) NOT NULL,
    
    -- Response
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER,
    
    -- Billing
    billable BOOLEAN DEFAULT TRUE,
    plan_at_time VARCHAR(20),
    
    -- Metadata
    request_id VARCHAR(100) UNIQUE,
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_usage_user_id ON usage_tracking(user_id);
CREATE INDEX idx_usage_created_at ON usage_tracking(created_at);
CREATE INDEX idx_usage_detection_type ON usage_tracking(detection_type);

-- ============================================
-- AUDIO ANALYSES TABLE (Enhanced)
-- ============================================
CREATE TABLE audio_analyses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    
    -- File Info
    filename VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT,
    duration_seconds DECIMAL(10,2),
    sample_rate INTEGER,
    
    -- Detection Results
    prediction VARCHAR(20) NOT NULL CHECK (prediction IN ('REAL', 'FAKE')),
    confidence DECIMAL(5,2) NOT NULL,
    real_score DECIMAL(5,2) NOT NULL,
    fake_score DECIMAL(5,2) NOT NULL,
    
    -- Features
    mel_mean DECIMAL(10,4),
    mel_std DECIMAL(10,4),
    attention_peak_frame INTEGER,
    attention_concentration DECIMAL(10,4),
    
    -- Suspicious Regions
    suspicious_regions JSONB,
    attention_weights JSONB,
    
    -- Model Info
    model_version VARCHAR(50),
    
    -- Storage
    file_path TEXT,
    
    analyzed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audio_user_id ON audio_analyses(user_id);
CREATE INDEX idx_audio_analyzed_at ON audio_analyses(analyzed_at);
CREATE INDEX idx_audio_prediction ON audio_analyses(prediction);

-- ============================================
-- IMAGE ANALYSES TABLE (Enhanced)
-- ============================================
CREATE TABLE image_analyses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    
    -- File Info
    filename VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT,
    width INTEGER,
    height INTEGER,
    format VARCHAR(20),
    
    -- Detection Results
    prediction VARCHAR(20) NOT NULL CHECK (prediction IN ('REAL', 'AI_GENERATED')),
    confidence DECIMAL(5,2) NOT NULL,
    real_score DECIMAL(5,2) NOT NULL,
    fake_score DECIMAL(5,2) NOT NULL,
    
    -- Model Info
    model_architecture VARCHAR(100),
    model_input_size VARCHAR(20),
    model_num_classes INTEGER,
    model_version VARCHAR(50),
    
    -- Grad-CAM Heatmap
    heatmap TEXT, -- Base64 encoded
    
    -- Storage
    file_path TEXT,
    
    analyzed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_image_user_id ON image_analyses(user_id);
CREATE INDEX idx_image_analyzed_at ON image_analyses(analyzed_at);
CREATE INDEX idx_image_prediction ON image_analyses(prediction);

-- ============================================
-- SUPPORT TICKETS TABLE
-- ============================================
CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Ticket Info
    subject VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    
    -- Assignment
    assigned_to_agent_id BIGINT REFERENCES users(id),
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP
);

CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);

-- ============================================
-- TICKET MESSAGES TABLE
-- ============================================
CREATE TABLE ticket_messages (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    
    -- Message Info
    sender VARCHAR(10) NOT NULL CHECK (sender IN ('USER', 'AGENT', 'SYSTEM')),
    sender_user_id BIGINT REFERENCES users(id),
    message TEXT NOT NULL,
    
    -- Attachments
    attachments JSONB,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX idx_ticket_messages_created_at ON ticket_messages(created_at);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification Info
    type VARCHAR(50) NOT NULL, -- 'TRIAL_EXPIRY', 'TRIAL_EXHAUSTED', 'TICKET_UPDATE', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Link/Action
    action_url TEXT,
    action_text VARCHAR(100),
    
    -- Status
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Priority
    priority VARCHAR(20) DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ============================================
-- SEED DATA (Optional)
-- ============================================

-- Create a demo user (Email auth)
INSERT INTO users (email, name, password_hash, auth_provider, plan, email_verified, trial_expires_at)
VALUES (
    'demo@mayabhedak.com',
    'Demo User',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5PEk0dYFmQZ/e', -- password: demo123
    'EMAIL',
    'FREE_TRIAL',
    TRUE,
    CURRENT_TIMESTAMP + INTERVAL '14 days'
);

-- Create sample FAQ data (can be moved to application code)
COMMENT ON TABLE users IS 'Enhanced users table supporting Email, Google OAuth, and Mobile OTP authentication';
COMMENT ON TABLE api_keys IS 'API keys with SHA-256 hashing and rotation support';
COMMENT ON TABLE usage_tracking IS 'Track all API usage for billing and analytics';
COMMENT ON TABLE tickets IS 'Customer support ticket system';
COMMENT ON TABLE notifications IS 'In-app notification system';

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEWS (for analytics)
-- ============================================

CREATE VIEW user_trial_status AS
SELECT 
    u.id,
    u.email,
    u.name,
    u.plan,
    u.trial_requests_used,
    50 - u.trial_requests_used AS remaining_requests,
    u.trial_expires_at,
    EXTRACT(DAY FROM (u.trial_expires_at - CURRENT_TIMESTAMP)) AS days_remaining,
    CASE 
        WHEN u.trial_expires_at < CURRENT_TIMESTAMP THEN 'EXPIRED'
        WHEN u.trial_requests_used >= 50 THEN 'EXHAUSTED'
        WHEN u.trial_requests_used >= 40 THEN 'WARNING'
        ELSE 'ACTIVE'
    END AS trial_status
FROM users u
WHERE u.plan = 'FREE_TRIAL';

-- ============================================
-- GRANTS (adjust as needed)
-- ============================================

-- Grant permissions to application user
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mayabhedak_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mayabhedak_user;

-- ============================================
-- COMPLETION
-- ============================================

SELECT 'Database schema created successfully!' AS status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
