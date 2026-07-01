# Database Migrations - MayaBhedak Microservices

This document describes the database schema and migration setup for all five microservices in the MayaBhedak platform.

## Overview

Each microservice manages its own database schema using appropriate migration tools:

| Service | Migration Tool | Database Tables |
|---------|---------------|-----------------|
| **Auth Service** | Flyway (Java) | users, api_keys |
| **Trial Service** | Flyway (Java) | subscriptions, usage_tracking |
| **Support Service** | Alembic (Python) | tickets, ticket_messages, faq |
| **Notification Service** | Alembic (Python) | notifications, notification_preferences |

## Database Connection

All services connect to the same PostgreSQL database:
```
Host: localhost:5432
Database: swarparikshan
Username: swarparikshan
Password: swarparikshan_secure_password
```

## Auth Service Migrations (Flyway)

### Location
```
auth-service/src/main/resources/db/migration/
```

### Migrations
- **V1__initial_schema.sql** - Creates `users` table with multi-auth support (EMAIL, GOOGLE, MOBILE)
- **V2__api_keys_schema.sql** - Creates `api_keys` table with SHA-256 hashing

### Running Migrations
```bash
cd auth-service
./mvnw flyway:migrate
./mvnw flyway:info
```

### users Table
- Supports three authentication providers: EMAIL, GOOGLE, MOBILE
- Unique constraints on email, mobile_number, and google_sub
- Automatic timestamp triggers
- Check constraints to enforce valid auth method combinations

### api_keys Table
- SHA-256 hashed API keys for secure storage
- Key prefix for display (mb_live_abc1...)
- Support for key rotation and expiration
- Pro users: max 5 keys, Enterprise: unlimited

## Trial Service Migrations (Flyway)

### Location
```
trial-service/src/main/resources/db/migration/
```

### Migrations
- **V1__subscriptions_schema.sql** - Creates `subscriptions` and `usage_tracking` tables

### Running Migrations
```bash
cd trial-service
./mvnw flyway:migrate
./mvnw flyway:info
```

### subscriptions Table
- Three plan types: FREE_TRIAL, PRO, ENTERPRISE
- Status tracking: ACTIVE, EXPIRED, CANCELLED, PAYMENT_FAILED
- Separate limits for audio and image detections
- Check constraints for data validation

### usage_tracking Table
- Monthly usage tracking per user per detection type
- Unique constraint on (user_id, detection_type, tracking_month)
- Atomic increment operations to prevent race conditions
- Auto-reset on first day of each month

## Support Service Migrations (Alembic)

### Location
```
support-service/alembic/versions/
```

### Migrations
- **001_initial_schema.py** - Creates tickets, ticket_messages, and faq tables

### Running Migrations
```bash
cd support-service
alembic upgrade head
alembic current
alembic history
```

### tickets Table
- Categories: TECHNICAL, BILLING, FEATURE_REQUEST, BUG_REPORT, OTHER
- Status workflow: OPEN → IN_PROGRESS → WAITING_USER → RESOLVED → CLOSED
- Priority levels: LOW, MEDIUM, HIGH, URGENT
- Automatic ticket_number generation (TKT-2024-000001)

### ticket_messages Table
- Sender types: USER, AGENT, SYSTEM
- JSONB attachments field for file URLs
- Internal messages flag for agent-only notes

### faq Table
- Pre-populated with 10 common questions
- Categories for organization
- Display order for custom sorting
- Helpful count for analytics

## Notification Service Migrations (Alembic)

### Location
```
notification-service/alembic/versions/
```

### Migrations
- **001_initial_schema.py** - Creates notifications and notification_preferences tables

### Running Migrations
```bash
cd notification-service
alembic upgrade head
alembic current
alembic history
```

### notifications Table
- Types: INFO, WARNING, ERROR, SUCCESS
- Read/unread tracking with read_at timestamp
- Optional action_url for deep linking
- JSONB metadata field for additional context
- Partial index on unread notifications for performance

### notification_preferences Table
- Per-user notification settings
- Email, SMS, and in-app toggles
- Marketing email opt-in
- Digest frequency: DAILY, WEEKLY, NEVER

## Complete Migration Workflow

### Initial Setup (Fresh Database)

```bash
# 1. Start PostgreSQL
docker-compose -f docker-compose-infra.yml up -d postgres

# 2. Run Auth Service migrations
cd auth-service
./mvnw flyway:migrate

# 3. Run Trial Service migrations
cd ../trial-service
./mvnw flyway:migrate

# 4. Run Support Service migrations
cd ../support-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head

# 5. Run Notification Service migrations
cd ../notification-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
```

### Verifying Migrations

```sql
-- Connect to PostgreSQL
psql -U swarparikshan -d swarparikshan

-- Check all tables
\dt

-- Expected tables:
-- users
-- api_keys
-- subscriptions
-- usage_tracking
-- tickets
-- ticket_messages
-- faq
-- notifications
-- notification_preferences

-- Check Flyway history
SELECT * FROM flyway_schema_history ORDER BY installed_rank;

-- Check Alembic history
SELECT * FROM alembic_version;
```

## Schema Validation

### Foreign Key Relationships
```sql
-- None between services (microservices architecture)
-- Each service manages its own data
-- user_id fields reference users table in auth-service
```

### Constraints Summary

| Table | Primary Key | Unique Constraints | Check Constraints | Foreign Keys |
|-------|-------------|-------------------|-------------------|--------------|
| users | id | email, mobile_number, google_sub | auth_provider validation | None |
| api_keys | id | key_hash | None | None |
| subscriptions | id | None | plan_type, status, limits, dates | None |
| usage_tracking | id | (user_id, detection_type, month) | count >= 0 | None |
| tickets | id | ticket_number | category, status, priority | None |
| ticket_messages | id | None | sender_type | ticket_id → tickets |
| faq | id | None | None | None |
| notifications | id | None | notification_type | None |
| notification_preferences | id | user_id | digest_frequency | None |

## Data Model Guidelines

### User References
- All services store `user_id` as BIGINT
- No foreign key constraints across services (microservices pattern)
- Services query Auth Service API to validate users

### Timestamps
- All tables use `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
- Update-heavy tables include `updated_at` with triggers
- Timezone-aware operations use UTC

### JSON Fields
- `ticket_messages.attachments` - Array of MinIO file URLs
- `notifications.metadata` - Additional context data
- All JSON fields use JSONB for better performance

## Troubleshooting

### Flyway Migration Failed
```bash
# Check current version
./mvnw flyway:info

# Repair failed migration
./mvnw flyway:repair

# Retry migration
./mvnw flyway:migrate
```

### Alembic Migration Failed
```bash
# Check current version
alembic current

# View history
alembic history

# Downgrade one step
alembic downgrade -1

# Retry upgrade
alembic upgrade head
```

### Connection Issues
- Verify PostgreSQL is running: `docker ps`
- Check connection string in configuration files
- Ensure database exists: `psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname='swarparikshan'"`

## Production Considerations

1. **Backup Before Migration**: Always backup production database before applying migrations
2. **Test Migrations**: Run migrations on staging environment first
3. **Rollback Plan**: Test downgrade migrations to ensure rollback capability
4. **Zero-Downtime**: Use blue-green deployment for schema changes
5. **Connection Pooling**: Configure appropriate connection pool sizes per service
6. **Monitoring**: Set up alerts for migration failures and slow queries

## References

- [Flyway Documentation](https://flywaydb.org/documentation/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [PostgreSQL Best Practices](https://www.postgresql.org/docs/current/sql.html)
