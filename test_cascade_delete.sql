-- Test script to verify CASCADE DELETE behavior
-- This script creates a test user with related data and then deletes it
-- to verify that all related records are automatically deleted

\echo '========================================='
\echo 'Testing CASCADE DELETE Behavior'
\echo '========================================='
\echo ''

-- Start transaction so we can rollback after testing
BEGIN;

\echo '1. Creating test user...'
INSERT INTO users (
    email, 
    password_hash, 
    auth_provider, 
    full_name,
    email_verified
) VALUES (
    'test.cascade@example.com',
    '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFG', -- Dummy bcrypt hash
    'EMAIL',
    'Test Cascade User',
    TRUE
) RETURNING id, email, full_name;

-- Store the user_id for subsequent queries
\gset test_

\echo ''
\echo 'Test user created with ID:' :test_id
\echo ''

\echo '2. Creating related records for test user...'

-- Create API Key
INSERT INTO api_keys (user_id, key_name, key_hash, key_prefix, is_active)
VALUES (:test_id, 'Test API Key', 'abc123def456', 'mb_live_', TRUE)
RETURNING id AS api_key_id;

-- Create Subscription
INSERT INTO subscriptions (
    user_id, 
    plan_type, 
    status, 
    start_date, 
    expiry_date,
    audio_limit,
    image_limit
) VALUES (
    :test_id,
    'FREE_TRIAL',
    'ACTIVE',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '14 days',
    50,
    50
) RETURNING id AS subscription_id;

-- Create Usage Tracking
INSERT INTO usage_tracking (
    user_id,
    detection_type,
    count,
    tracking_month
) VALUES 
    (:test_id, 'AUDIO', 10, DATE_TRUNC('month', CURRENT_DATE)),
    (:test_id, 'IMAGE', 15, DATE_TRUNC('month', CURRENT_DATE))
RETURNING id AS usage_id, detection_type;

-- Create Ticket
INSERT INTO tickets (
    user_id,
    ticket_number,
    subject,
    category,
    status,
    priority
) VALUES (
    :test_id,
    'TKT-TEST-000001',
    'Test Support Ticket',
    'TECHNICAL',
    'OPEN',
    'MEDIUM'
) RETURNING id AS ticket_id;

\gset ticket_

-- Create Ticket Message
INSERT INTO ticket_messages (
    ticket_id,
    sender_type,
    sender_name,
    message
) VALUES (
    :ticket_id,
    'USER',
    'Test Cascade User',
    'This is a test message'
) RETURNING id AS message_id;

-- Create Notification
INSERT INTO notifications (
    user_id,
    title,
    message,
    notification_type
) VALUES (
    :test_id,
    'Test Notification',
    'This is a test notification',
    'INFO'
) RETURNING id AS notification_id;

-- Create Notification Preferences
INSERT INTO notification_preferences (
    user_id,
    email_enabled,
    sms_enabled,
    in_app_enabled
) VALUES (
    :test_id,
    TRUE,
    TRUE,
    TRUE
) RETURNING id AS pref_id;

\echo ''
\echo '3. Counting related records before deletion...'

SELECT 
    'api_keys' AS table_name,
    COUNT(*) AS count
FROM api_keys 
WHERE user_id = :test_id
UNION ALL
SELECT 'subscriptions', COUNT(*) 
FROM subscriptions 
WHERE user_id = :test_id
UNION ALL
SELECT 'usage_tracking', COUNT(*) 
FROM usage_tracking 
WHERE user_id = :test_id
UNION ALL
SELECT 'tickets', COUNT(*) 
FROM tickets 
WHERE user_id = :test_id
UNION ALL
SELECT 'ticket_messages', COUNT(*) 
FROM ticket_messages 
WHERE ticket_id = :ticket_id
UNION ALL
SELECT 'notifications', COUNT(*) 
FROM notifications 
WHERE user_id = :test_id
UNION ALL
SELECT 'notification_preferences', COUNT(*) 
FROM notification_preferences 
WHERE user_id = :test_id;

\echo ''
\echo '4. Deleting test user (this should cascade to all related records)...'

DELETE FROM users WHERE id = :test_id;

\echo ''
\echo '5. Counting related records after deletion (all should be 0)...'

SELECT 
    'api_keys' AS table_name,
    COUNT(*) AS count,
    CASE WHEN COUNT(*) = 0 THEN '✓' ELSE '✗' END AS status
FROM api_keys 
WHERE user_id = :test_id
UNION ALL
SELECT 'subscriptions', COUNT(*),
    CASE WHEN COUNT(*) = 0 THEN '✓' ELSE '✗' END
FROM subscriptions 
WHERE user_id = :test_id
UNION ALL
SELECT 'usage_tracking', COUNT(*),
    CASE WHEN COUNT(*) = 0 THEN '✓' ELSE '✗' END
FROM usage_tracking 
WHERE user_id = :test_id
UNION ALL
SELECT 'tickets', COUNT(*),
    CASE WHEN COUNT(*) = 0 THEN '✓' ELSE '✗' END
FROM tickets 
WHERE user_id = :test_id
UNION ALL
SELECT 'ticket_messages', COUNT(*),
    CASE WHEN COUNT(*) = 0 THEN '✓' ELSE '✗' END
FROM ticket_messages 
WHERE ticket_id = :ticket_id
UNION ALL
SELECT 'notifications', COUNT(*),
    CASE WHEN COUNT(*) = 0 THEN '✓' ELSE '✗' END
FROM notifications 
WHERE user_id = :test_id
UNION ALL
SELECT 'notification_preferences', COUNT(*),
    CASE WHEN COUNT(*) = 0 THEN '✓' ELSE '✗' END
FROM notification_preferences 
WHERE user_id = :test_id;

\echo ''
\echo '6. Verifying user deletion...'

SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '✓ Test user successfully deleted'
        ELSE '✗ Test user still exists!'
    END AS user_deletion_status
FROM users 
WHERE id = :test_id;

\echo ''
\echo '========================================='
\echo 'Test Complete!'
\echo '========================================='
\echo ''
\echo 'Expected result: All related records should show count = 0 with ✓ status'
\echo 'This confirms CASCADE DELETE is working correctly.'
\echo ''
\echo 'Rolling back transaction to leave database clean...'

-- Rollback to undo all test changes
ROLLBACK;

\echo ''
\echo '✓ Transaction rolled back. Database is unchanged.'
\echo ''
\echo 'To verify CASCADE DELETE in a persistent way:'
\echo '  1. Remove the BEGIN and ROLLBACK commands'
\echo '  2. Run the script'
\echo '  3. Verify deletions'
\echo '  4. Manually verify the database state'
\echo ''
