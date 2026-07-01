-- API Keys table for authentication
CREATE TABLE IF NOT EXISTS api_keys (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    key_name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(64) NOT NULL,
    key_prefix VARCHAR(10) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP,
    
    UNIQUE(key_hash)
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_prefix ON api_keys(key_prefix);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash) WHERE is_active = TRUE;

-- Comments for documentation
COMMENT ON TABLE api_keys IS 'API keys for programmatic access with SHA-256 hashing';
COMMENT ON COLUMN api_keys.key_hash IS 'SHA-256 hash of the API key (64 hex characters)';
COMMENT ON COLUMN api_keys.key_prefix IS 'First 8 characters of key for display: mb_live_abc1...';
COMMENT ON COLUMN api_keys.is_active IS 'Whether the API key is currently active and valid';
