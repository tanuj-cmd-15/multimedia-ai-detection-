-- Add foreign key constraint from api_keys to users
ALTER TABLE api_keys 
ADD CONSTRAINT fk_api_keys_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Add comments
COMMENT ON CONSTRAINT fk_api_keys_user_id ON api_keys IS 'Foreign key to users table with cascade delete';

