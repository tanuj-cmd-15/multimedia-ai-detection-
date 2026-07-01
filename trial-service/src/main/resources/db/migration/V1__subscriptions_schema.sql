-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('FREE_TRIAL', 'PRO', 'ENTERPRISE')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('ACTIVE', 'EXPIRED', 'CANCELLED', 'PAYMENT_FAILED')),
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    audio_limit INT NOT NULL,
    image_limit INT NOT NULL,
    trial_requests_used INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_limits CHECK (audio_limit >= 0 AND image_limit >= 0),
    CONSTRAINT valid_trial_usage CHECK (trial_requests_used <= (audio_limit + image_limit)),
    CONSTRAINT valid_dates CHECK (expiry_date >= start_date)
);

-- Usage tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    detection_type VARCHAR(20) NOT NULL CHECK (detection_type IN ('AUDIO', 'IMAGE')),
    count INT NOT NULL DEFAULT 0,
    tracking_month DATE NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, detection_type, tracking_month),
    CONSTRAINT valid_count CHECK (count >= 0)
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_expiry ON subscriptions(expiry_date) WHERE status = 'ACTIVE';
CREATE INDEX idx_usage_user_month ON usage_tracking(user_id, tracking_month);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_subscription_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
FOR EACH ROW EXECUTE FUNCTION update_subscription_timestamp();

-- Comments
COMMENT ON TABLE subscriptions IS 'User subscription plans (FREE_TRIAL, PRO, ENTERPRISE)';
COMMENT ON TABLE usage_tracking IS 'Monthly usage tracking per user per detection type';
COMMENT ON COLUMN subscriptions.trial_requests_used IS 'Total detections used (audio + image combined for FREE_TRIAL)';
COMMENT ON COLUMN usage_tracking.tracking_month IS 'First day of the tracking month (e.g., 2024-01-01)';
