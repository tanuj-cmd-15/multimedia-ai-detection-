# Database Migrations Summary

## Overview
All database migration files have been created and are ready for execution. The microservices architecture uses a shared PostgreSQL database with tables distributed across services.

## Migration Files by Service

### 1. Auth Service (Spring Boot + Flyway)
**Location:** `auth-service/src/main/resources/db/migration/`

#### V1__initial_schema.sql ✅
- **users** table with columns:
  - `id` (BIGSERIAL PRIMARY KEY)
  - `email` (VARCHAR(255) UNIQUE)
  - `mobile_number` (VARCHAR(20) UNIQUE)
  - `password_hash` (VARCHAR(255))
  - `google_sub` (VARCHAR(255) UNIQUE)
  - `auth_provider` (VARCHAR(20) CHECK: EMAIL, GOOGLE, MOBILE)
  - `full_name` (VARCHAR(255))
  - `avatar_url` (VARCHAR(500))
  - `email_verified` (BOOLEAN DEFAULT FALSE)
  - `mobile_verified` (BOOLEAN DEFAULT FALSE)
  - `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
  - `last_login_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- Constraints:
  - `valid_auth_method` CHECK constraint ensuring appropriate auth fields
- Indexes:
  - `idx_users_email`
  - `idx_users_mobile`
  - `idx_users_google_sub`
  - `idx_users_created_at`
- Triggers:
  - `update_users_updated_at` for automatic timestamp updates

#### V2__api_keys_schema.sql ✅
- **api_keys** table with columns:
  - `id` (BIGSERIAL PRIMARY KEY)
  - `user_id` (BIGINT NOT NULL)
  - `key_name` (VARCHAR(100))
  - `key_hash` (VARCHAR(64) UNIQUE) - SHA-256 hash
  - `key_prefix` (VARCHAR(10)) - First 8 chars for display
  - `is_active` (BOOLEAN DEFAULT TRUE)
  - `expires_at` (TIMESTAMP)
  - `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
  - `last_used_at` (TIMESTAMP)
- Indexes:
  - `idx_api_keys_user_id`
  - `idx_api_keys_prefix`
  - `idx_api_keys_hash` (partial index WHERE is_active = TRUE)

#### V3__add_foreign_key_constraints.sql ✅ (NEW)
- Foreign key constraint: `api_keys.user_id` → `users.id` (ON DELETE CASCADE)

---

### 2. Trial Service (Spring Boot + Flyway)
**Location:** `trial-service/src/main/resources/db/migration/`

#### V1__subscriptions_schema.sql ✅
- **subscriptions** table with columns:
  - `id` (BIGSERIAL PRIMARY KEY)
  - `user_id` (BIGINT NOT NULL)
  - `plan_type` (VARCHAR(20) CHECK: FREE_TRIAL, PRO, ENTERPRISE)
  - `status` (VARCHAR(20) CHECK: ACTIVE, EXPIRED, CANCELLED, PAYMENT_FAILED)
  - `start_date` (DATE NOT NULL)
  - `expiry_date` (DATE NOT NULL)
  - `audio_limit` (INT NOT NULL)
  - `image_limit` (INT NOT NULL)
  - `trial_requests_used` (INT DEFAULT 0)
  - `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
  - `updated_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- Constraints:
  - `valid_limits` CHECK (audio_limit >= 0 AND image_limit >= 0)
  - `valid_trial_usage` CHECK (trial_requests_used <= audio_limit + image_limit)
  - `valid_dates` CHECK (expiry_date >= start_date)
- Indexes:
  - `idx_subscriptions_user_id`
  - `idx_subscriptions_expiry` (partial index WHERE status = 'ACTIVE')

- **usage_tracking** table with columns:
  - `id` (BIGSERIAL PRIMARY KEY)
  - `user_id` (BIGINT NOT NULL)
  - `detection_type` (VARCHAR(20) CHECK: AUDIO, IMAGE)
  - `count` (INT DEFAULT 0)
  - `tracking_month` (DATE NOT NULL) - First day of month
  - `last_updated` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- Constraints:
  - UNIQUE(user_id, detection_type, tracking_month)
  - `valid_count` CHECK (count >= 0)
- Indexes:
  - `idx_usage_user_month`
- Triggers:
  - `update_subscriptions_updated_at` for automatic timestamp updates

#### V2__add_foreign_key_constraints.sql ✅ (NEW)
- Foreign key constraint: `subscriptions.user_id` → `users.id` (ON DELETE CASCADE)
- Foreign key constraint: `usage_tracking.user_id` → `users.id` (ON DELETE CASCADE)

---

### 3. Support Service (FastAPI + Alembic)
**Location:** `support-service/alembic/versions/`

#### 001_initial_schema.py ✅
- **tickets** table with columns:
  - `id` (BIGSERIAL PRIMARY KEY)
  - `user_id` (BIGINT NOT NULL)
  - `ticket_number` (VARCHAR(20) UNIQUE) - Format: TKT-2024-000001
  - `subject` (VARCHAR(200))
  - `category` (VARCHAR(30) CHECK: TECHNICAL, BILLING, FEATURE_REQUEST, BUG_REPORT, OTHER)
  - `status` (VARCHAR(20) CHECK: OPEN, IN_PROGRESS, WAITING_USER, RESOLVED, CLOSED)
  - `priority` (VARCHAR(10) CHECK: LOW, MEDIUM, HIGH, URGENT)
  - `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
  - `updated_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
  - `resolved_at` (TIMESTAMP)
- Constraints:
  - `valid_resolution` CHECK for resolved/closed status
- Indexes:
  - `idx_tickets_user_id`
  - `idx_tickets_status`
  - `idx_tickets_created_at`

- **ticket_messages** table with columns:
  - `id` (BIGSERIAL PRIMARY KEY)
  - `ticket_id` (BIGINT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE)
  - `sender_type` (VARCHAR(10) CHECK: USER, AGENT, SYSTEM)
  - `sender_name` (VARCHAR(255))
  - `message` (TEXT)
  - `attachments` (JSONB DEFAULT '[]')
  - `is_internal` (BOOLEAN DEFAULT FALSE)
  - `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- Indexes:
  - `idx_ticket_messages_ticket_id`

- **faq** table with columns:
  - `id` (BIGSERIAL PRIMARY KEY)
  - `category` (VARCHAR(50))
  - `question` (VARCHAR(500))
  - `answer` (TEXT)
  - `helpful_count` (INT DEFAULT 0)
  - `display_order` (INT DEFAULT 0)
  - `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
  - `updated_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- Indexes:
  - `idx_faq_category`
- Initial Data: 10 pre-populated FAQ entries

- Triggers:
  - `update_tickets_updated_at` for automatic timestamp updates
  - `update_faq_updated_at` for automatic timestamp updates

#### 002_add_foreign_key_constraints.py ✅ (NEW)
- Foreign key constraint: `tickets.user_id` → `users.id` (ON DELETE CASCADE)

---

### 4. Notification Service (FastAPI + Alembic)
**Location:** `notification-service/alembic/versions/`

#### 001_initial_schema.py ✅
- **notifications** table with columns:
  - `id` (BIGSERIAL PRIMARY KEY)
  - `user_id` (BIGINT NOT NULL)
  - `title` (VARCHAR(200))
  - `message` (TEXT)
  - `notification_type` (VARCHAR(20) CHECK: INFO, WARNING, ERROR, SUCCESS)
  - `is_read` (BOOLEAN DEFAULT FALSE)
  - `action_url` (VARCHAR(500))
  - `metadata` (JSONB)
  - `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
  - `read_at` (TIMESTAMP)
- Indexes:
  - `idx_notifications_user_id`
  - `idx_notifications_unread` (partial index WHERE is_read = FALSE)

- **notification_preferences** table with columns:
  - `id` (BIGSERIAL PRIMARY KEY)
  - `user_id` (BIGINT UNIQUE NOT NULL)
  - `email_enabled` (BOOLEAN DEFAULT TRUE)
  - `sms_enabled` (BOOLEAN DEFAULT TRUE)
  - `in_app_enabled` (BOOLEAN DEFAULT TRUE)
  - `marketing_emails` (BOOLEAN DEFAULT FALSE)
  - `digest_frequency` (VARCHAR(10) CHECK: DAILY, WEEKLY, NEVER)
  - `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
  - `updated_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- Indexes:
  - `idx_notification_preferences_user_id`

- Triggers:
  - `update_notification_preferences_updated_at` for automatic timestamp updates

#### 002_add_foreign_key_constraints.py ✅ (NEW)
- Foreign key constraint: `notifications.user_id` → `users.id` (ON DELETE CASCADE)
- Foreign key constraint: `notification_preferences.user_id` → `users.id` (ON DELETE CASCADE)

---

## Database Relationships

```
users (Auth Service)
├── api_keys (Auth Service) - One-to-Many
├── subscriptions (Trial Service) - One-to-Many
├── usage_tracking (Trial Service) - One-to-Many
├── tickets (Support Service) - One-to-Many
├── notifications (Notification Service) - One-to-Many
└── notification_preferences (Notification Service) - One-to-One

tickets (Support Service)
└── ticket_messages - One-to-Many
```

## Execution Order

The migrations must be executed in the following order to satisfy foreign key constraints:

1. **Auth Service V1** - Creates `users` table (base table for all foreign keys)
2. **Auth Service V2** - Creates `api_keys` table
3. **Auth Service V3** - Adds foreign key constraint on `api_keys`
4. **Trial Service V1** - Creates `subscriptions` and `usage_tracking` tables
5. **Trial Service V2** - Adds foreign key constraints
6. **Support Service 001** - Creates `tickets`, `ticket_messages`, and `faq` tables
7. **Support Service 002** - Adds foreign key constraint on `tickets`
8. **Notification Service 001** - Creates `notifications` and `notification_preferences` tables
9. **Notification Service 002** - Adds foreign key constraints

## Running Migrations

### Auth Service & Trial Service (Flyway)
Migrations run automatically on application startup with Spring Boot and Flyway.

```bash
# Migrations execute when services start
docker-compose up auth-service trial-service
```

### Support Service (Alembic)
```bash
cd support-service
alembic upgrade head
```

### Notification Service (Alembic)
```bash
cd notification-service
alembic upgrade head
```

## Validation

After running migrations, verify with:

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check foreign key constraints
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name;
```

## Notes

- All services use a **shared PostgreSQL database** (single database, multiple schemas optional)
- Foreign key constraints ensure **referential integrity** across services
- **CASCADE DELETE** ensures cleanup when users are deleted
- All timestamps use PostgreSQL's `CURRENT_TIMESTAMP`
- All primary keys use `BIGSERIAL` for auto-increment
- Indexes are optimized for common query patterns
- Check constraints ensure data validity at database level
- Triggers maintain automatic timestamp updates
- Comments provide documentation within the database

## Compatibility

- **PostgreSQL Version:** 12.0 or higher
- **Flyway Version:** 9.x (for Spring Boot services)
- **Alembic Version:** 1.13.x (for FastAPI services)
- **SQLAlchemy Version:** 2.x (for FastAPI services)

---

**Status:** ✅ All migrations complete and ready for execution
**Last Updated:** 2024-01-15
