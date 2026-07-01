-- Database Migration Verification Script
-- Run this script after all migrations to verify schema completeness
-- Usage: psql -U postgres -d mayabhedak_db -f verify_migrations.sql

\echo '========================================='
\echo 'Database Migration Verification Script'
\echo '========================================='
\echo ''

-- 1. Check all required tables exist
\echo '1. Checking Required Tables...'
\echo ''

SELECT 
    CASE 
        WHEN COUNT(*) = 9 THEN '✓ All 9 required tables exist'
        ELSE '✗ Missing tables! Expected 9, found ' || COUNT(*)::text
    END AS table_check
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'users',
    'api_keys',
    'subscriptions',
    'usage_tracking',
    'tickets',
    'ticket_messages',
    'faq',
    'notifications',
    'notification_preferences'
);

\echo ''
\echo 'List of all tables:'
SELECT table_name, 
       pg_size_pretty(pg_total_relation_size(quote_ident(table_name)::regclass)) AS size
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

\echo ''
\echo '========================================='
\echo '2. Checking Foreign Key Constraints...'
\echo ''

SELECT 
    tc.table_name, 
    tc.constraint_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule AS on_delete
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name;

\echo ''
SELECT 
    CASE 
        WHEN COUNT(*) >= 7 THEN '✓ All foreign key constraints exist'
        ELSE '✗ Missing foreign keys! Expected at least 7, found ' || COUNT(*)::text
    END AS fk_check
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
AND table_schema = 'public';

\echo ''
\echo '========================================='
\echo '3. Checking Indexes...'
\echo ''

SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

\echo ''
SELECT 
    CASE 
        WHEN COUNT(*) >= 15 THEN '✓ Expected indexes exist (found ' || COUNT(*)::text || ')'
        ELSE '✗ Missing indexes! Expected at least 15, found ' || COUNT(*)::text
    END AS index_check
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN (
    'users',
    'api_keys',
    'subscriptions',
    'usage_tracking',
    'tickets',
    'ticket_messages',
    'faq',
    'notifications',
    'notification_preferences'
);

\echo ''
\echo '========================================='
\echo '4. Checking Check Constraints...'
\echo ''

SELECT 
    tc.table_name,
    tc.constraint_name,
    cc.check_clause
FROM information_schema.table_constraints AS tc
JOIN information_schema.check_constraints AS cc
    ON tc.constraint_name = cc.constraint_name
WHERE tc.constraint_type = 'CHECK'
AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

\echo ''
\echo '========================================='
\echo '5. Checking Unique Constraints...'
\echo ''

SELECT 
    tc.table_name,
    tc.constraint_name,
    kcu.column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE'
AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

\echo ''
\echo '========================================='
\echo '6. Checking Triggers...'
\echo ''

SELECT 
    event_object_table AS table_name,
    trigger_name,
    event_manipulation AS event,
    action_timing AS timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

\echo ''
SELECT 
    CASE 
        WHEN COUNT(*) >= 3 THEN '✓ Expected triggers exist (found ' || COUNT(*)::text || ')'
        ELSE '✗ Missing triggers! Expected at least 3, found ' || COUNT(*)::text
    END AS trigger_check
FROM information_schema.triggers
WHERE trigger_schema = 'public';

\echo ''
\echo '========================================='
\echo '7. Checking Column Definitions for Critical Tables...'
\echo ''

-- Users table columns
\echo 'users table columns:'
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
AND table_schema = 'public'
ORDER BY ordinal_position;

\echo ''
-- API Keys table columns
\echo 'api_keys table columns:'
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'api_keys'
AND table_schema = 'public'
ORDER BY ordinal_position;

\echo ''
-- Subscriptions table columns
\echo 'subscriptions table columns:'
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'subscriptions'
AND table_schema = 'public'
ORDER BY ordinal_position;

\echo ''
\echo '========================================='
\echo '8. Checking Migration History...'
\echo ''

-- Flyway migrations (if exists)
\echo 'Flyway Migration History:'
SELECT 
    version,
    description,
    type,
    script,
    installed_on,
    execution_time,
    success
FROM flyway_schema_history
ORDER BY installed_rank;

\echo ''
-- Alembic migrations (if exists)
\echo 'Alembic Migration Version:'
SELECT * FROM alembic_version;

\echo ''
\echo '========================================='
\echo '9. Checking FAQ Initial Data...'
\echo ''

SELECT 
    CASE 
        WHEN COUNT(*) >= 10 THEN '✓ FAQ table has initial data (found ' || COUNT(*)::text || ' entries)'
        ELSE '✗ FAQ missing initial data! Expected 10, found ' || COUNT(*)::text
    END AS faq_data_check
FROM faq;

\echo ''
\echo 'FAQ entries by category:'
SELECT 
    category,
    COUNT(*) AS count
FROM faq
GROUP BY category
ORDER BY category;

\echo ''
\echo '========================================='
\echo '10. Database Summary...'
\echo ''

SELECT 
    'Total tables' AS metric,
    COUNT(*)::text AS value
FROM information_schema.tables 
WHERE table_schema = 'public'
UNION ALL
SELECT 
    'Total foreign keys',
    COUNT(*)::text
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
AND table_schema = 'public'
UNION ALL
SELECT 
    'Total indexes',
    COUNT(*)::text
FROM pg_indexes
WHERE schemaname = 'public'
UNION ALL
SELECT 
    'Total triggers',
    COUNT(*)::text
FROM information_schema.triggers
WHERE trigger_schema = 'public'
UNION ALL
SELECT 
    'Database size',
    pg_size_pretty(pg_database_size(current_database()))
UNION ALL
SELECT 
    'FAQ entries',
    COUNT(*)::text
FROM faq;

\echo ''
\echo '========================================='
\echo 'Verification Complete!'
\echo '========================================='
\echo ''
\echo 'Expected Results:'
\echo '  - 9 tables (users, api_keys, subscriptions, usage_tracking, tickets, ticket_messages, faq, notifications, notification_preferences)'
\echo '  - 7+ foreign key constraints (all with ON DELETE CASCADE)'
\echo '  - 15+ indexes for performance'
\echo '  - 3+ triggers for timestamp updates'
\echo '  - 10+ FAQ entries'
\echo ''
\echo 'If any checks show ✗, review the migration logs and re-run failed migrations.'
\echo ''

-- Check for any obvious schema issues
\echo 'Final Health Check:'
\echo ''

DO $$
DECLARE
    table_count INTEGER;
    fk_count INTEGER;
    faq_count INTEGER;
    all_ok BOOLEAN := TRUE;
BEGIN
    -- Count tables
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN (
        'users', 'api_keys', 'subscriptions', 'usage_tracking',
        'tickets', 'ticket_messages', 'faq', 'notifications', 'notification_preferences'
    );
    
    -- Count foreign keys
    SELECT COUNT(*) INTO fk_count
    FROM information_schema.table_constraints
    WHERE constraint_type = 'FOREIGN KEY'
    AND table_schema = 'public';
    
    -- Count FAQ entries
    SELECT COUNT(*) INTO faq_count FROM faq;
    
    -- Validate
    IF table_count < 9 THEN
        RAISE NOTICE '✗ Missing tables! Found %, expected 9', table_count;
        all_ok := FALSE;
    END IF;
    
    IF fk_count < 7 THEN
        RAISE NOTICE '✗ Missing foreign keys! Found %, expected at least 7', fk_count;
        all_ok := FALSE;
    END IF;
    
    IF faq_count < 10 THEN
        RAISE NOTICE '✗ Missing FAQ data! Found %, expected at least 10', faq_count;
        all_ok := FALSE;
    END IF;
    
    IF all_ok THEN
        RAISE NOTICE '✓✓✓ All database migrations completed successfully! ✓✓✓';
        RAISE NOTICE 'The database schema is ready for use.';
    ELSE
        RAISE NOTICE '';
        RAISE NOTICE '✗✗✗ Database schema has issues. Review the output above. ✗✗✗';
    END IF;
END $$;
