-- Add foreign key constraints from subscriptions and usage_tracking to users
-- Note: These tables reference users from auth-service database
-- In a shared PostgreSQL setup, we assume users table exists

-- Add foreign key constraint from subscriptions to users
ALTER TABLE subscriptions 
ADD CONSTRAINT fk_subscriptions_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Add foreign key constraint from usage_tracking to users
ALTER TABLE usage_tracking 
ADD CONSTRAINT fk_usage_tracking_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Add comments
COMMENT ON CONSTRAINT fk_subscriptions_user_id ON subscriptions IS 'Foreign key to users table with cascade delete';
COMMENT ON CONSTRAINT fk_usage_tracking_user_id ON usage_tracking IS 'Foreign key to users table with cascade delete';

