# Database Schema Diagram

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USERS (Auth Service)                        │
│  id (PK) | email (UK) | mobile_number (UK) | password_hash |        │
│  google_sub (UK) | auth_provider | full_name | avatar_url |         │
│  email_verified | mobile_verified | created_at | last_login_at      │
└────────────┬────────────────────────────────────────────────────────┘
             │
             ├─────────────────┬─────────────────┬──────────────────┬────────────────┐
             │                 │                 │                  │                │
             ▼                 ▼                 ▼                  ▼                ▼
┌────────────────────┐  ┌──────────────────┐  ┌───────────────┐  ┌──────────────┐  ┌──────────────────┐
│   API_KEYS         │  │  SUBSCRIPTIONS   │  │ USAGE_TRACKING│  │   TICKETS    │  │  NOTIFICATIONS   │
│   (Auth Service)   │  │ (Trial Service)  │  │(Trial Service)│  │(Support Svc) │  │ (Notif Service)  │
├────────────────────┤  ├──────────────────┤  ├───────────────┤  ├──────────────┤  ├──────────────────┤
│ id (PK)            │  │ id (PK)          │  │ id (PK)       │  │ id (PK)      │  │ id (PK)          │
│ user_id (FK) ──────┼─►│ user_id (FK) ────┼─►│ user_id (FK)──┼─►│ user_id (FK) │  │ user_id (FK) ────┤
│ key_name           │  │ plan_type        │  │ detection_type│  │ ticket_number│  │ title            │
│ key_hash (UK)      │  │ status           │  │ count         │  │ subject      │  │ message          │
│ key_prefix         │  │ start_date       │  │ tracking_month│  │ category     │  │ notif_type       │
│ is_active          │  │ expiry_date      │  │ last_updated  │  │ status       │  │ is_read          │
│ expires_at         │  │ audio_limit      │  │               │  │ priority     │  │ action_url       │
│ created_at         │  │ image_limit      │  │ UK: user_id,  │  │ created_at   │  │ metadata (JSONB) │
│ last_used_at       │  │ trial_req_used   │  │ detection_type│  │ updated_at   │  │ created_at       │
│                    │  │ created_at       │  │ tracking_month│  │ resolved_at  │  │ read_at          │
└────────────────────┘  │ updated_at       │  │               │  └──────┬───────┘  └──────────────────┘
                        └──────────────────┘  └───────────────┘         │
                                                                         │
                        ┌─────────────────────────────────────────────┐ │
                        │    NOTIFICATION_PREFERENCES (Notif Service) │ │
                        ├─────────────────────────────────────────────┤ │
                        │ id (PK)                                     │ │
                        │ user_id (FK, UK) ───────────────────────────┼─┘
                        │ email_enabled                               │
                        │ sms_enabled                                 │
                        │ in_app_enabled                              │
                        │ marketing_emails                            │
                        │ digest_frequency                            │
                        │ created_at                                  │
                        │ updated_at                                  │
                        └─────────────────────────────────────────────┘
                                                                         
                                                ┌──────────────────────┐
                                                │  TICKET_MESSAGES     │
                                                │  (Support Service)   │
                                                ├──────────────────────┤
                                                │ id (PK)              │
                                         ┌──────┤ ticket_id (FK) ──────┼──┐
                                         │      │ sender_type          │  │
                                         │      │ sender_name          │  │
                                         │      │ message              │  │
                                         │      │ attachments (JSONB)  │  │
                                         │      │ is_internal          │  │
                                         │      │ created_at           │  │
                                         │      └──────────────────────┘  │
                                         │                                 │
                                         │  ┌──────────────────────────────┘
                                         │  │
                                         ▼  ▼
                        ┌─────────────────────────────────────────────┐
                        │              FAQ (Support Service)          │
                        ├─────────────────────────────────────────────┤
                        │ id (PK)                                     │
                        │ category                                    │
                        │ question                                    │
                        │ answer                                      │
                        │ helpful_count                               │
                        │ display_order                               │
                        │ created_at                                  │
                        │ updated_at                                  │
                        └─────────────────────────────────────────────┘

Legend:
  PK  = Primary Key
  FK  = Foreign Key
  UK  = Unique Key
  ──► = Foreign Key Relationship (with ON DELETE CASCADE)
```

## Table Details by Service

### Auth Service Tables

#### 1. users
**Purpose:** Central user authentication table supporting email/password, Google OAuth, and mobile OTP

**Key Fields:**
- `auth_provider`: Determines authentication method (EMAIL, GOOGLE, MOBILE)
- `email_verified`, `mobile_verified`: Track verification status
- `google_sub`: Unique identifier from Google OAuth

**Indexes:**
- `idx_users_email` - Fast email lookup
- `idx_users_mobile` - Fast mobile number lookup
- `idx_users_google_sub` - Fast Google OAuth lookup
- `idx_users_created_at` - User registration timeline queries

#### 2. api_keys
**Purpose:** Store API keys for programmatic access

**Key Fields:**
- `key_hash`: SHA-256 hash of actual key (never store plaintext)
- `key_prefix`: First 8 characters for display (e.g., "mb_live_abc1...")
- `is_active`: Enable/disable keys without deletion

**Security:**
- Full API key only shown once at generation
- Hash comparison for validation
- Partial index on active keys for performance

---

### Trial Service Tables

#### 3. subscriptions
**Purpose:** Manage user subscription plans and trial periods

**Key Fields:**
- `plan_type`: FREE_TRIAL (50+50, 14 days), PRO (1000+1000, monthly), ENTERPRISE (unlimited)
- `status`: ACTIVE, EXPIRED, CANCELLED, PAYMENT_FAILED
- `audio_limit`, `image_limit`: Monthly detection quotas
- `trial_requests_used`: Combined usage counter for free trial

**Business Rules:**
- One active subscription per user
- Expiry date must be >= start date
- Trial usage cannot exceed total limits

#### 4. usage_tracking
**Purpose:** Track monthly detection usage per user

**Key Fields:**
- `detection_type`: AUDIO or IMAGE
- `tracking_month`: First day of month (e.g., 2024-01-01)
- `count`: Number of detections this month

**Unique Constraint:**
- (user_id, detection_type, tracking_month) ensures one row per user per type per month

**Reset Logic:**
- Automatically reset counters on first day of new month

---

### Support Service Tables

#### 5. tickets
**Purpose:** Customer support ticket tracking

**Key Fields:**
- `ticket_number`: Unique identifier (format: TKT-2024-000001)
- `category`: TECHNICAL, BILLING, FEATURE_REQUEST, BUG_REPORT, OTHER
- `status`: OPEN → IN_PROGRESS → WAITING_USER → RESOLVED → CLOSED
- `priority`: LOW, MEDIUM, HIGH, URGENT (auto-assigned based on keywords)

**Validation:**
- Resolved/closed tickets must have `resolved_at` timestamp

#### 6. ticket_messages
**Purpose:** Conversation thread within tickets

**Key Fields:**
- `sender_type`: USER, AGENT, SYSTEM
- `attachments`: JSONB array of MinIO file URLs
- `is_internal`: Internal notes only visible to agents

**Cascade Delete:**
- All messages deleted when parent ticket is deleted

#### 7. faq
**Purpose:** Frequently asked questions with categorization

**Key Fields:**
- `category`: Group related questions
- `display_order`: Control display sequence
- `helpful_count`: Track user feedback

**Initial Data:**
- 10 pre-populated common questions on registration, billing, API, etc.

---

### Notification Service Tables

#### 8. notifications
**Purpose:** In-app notifications with read/unread tracking

**Key Fields:**
- `notification_type`: INFO, WARNING, ERROR, SUCCESS
- `action_url`: Deep link within app (optional)
- `metadata`: JSONB for additional context
- `is_read`: Track read status

**Cleanup:**
- Auto-delete notifications older than 90 days

#### 9. notification_preferences
**Purpose:** User notification settings

**Key Fields:**
- `email_enabled`, `sms_enabled`, `in_app_enabled`: Channel preferences
- `marketing_emails`: Opt-in for marketing
- `digest_frequency`: DAILY, WEEKLY, NEVER

**Constraint:**
- One preference row per user (UNIQUE on user_id)

---

## Foreign Key Relationships

All foreign keys use **ON DELETE CASCADE** to ensure data integrity:

```sql
-- When a user is deleted:
users.id (deleted)
  ├─► api_keys.user_id (all user's API keys deleted)
  ├─► subscriptions.user_id (all user's subscriptions deleted)
  ├─► usage_tracking.user_id (all user's usage records deleted)
  ├─► tickets.user_id (all user's tickets deleted)
  │   └─► ticket_messages.ticket_id (all messages in those tickets deleted)
  ├─► notifications.user_id (all user's notifications deleted)
  └─► notification_preferences.user_id (user's preferences deleted)
```

## Indexes Strategy

### Performance Indexes
- **User lookups:** `idx_users_email`, `idx_users_mobile`, `idx_users_google_sub`
- **Usage queries:** `idx_usage_user_month` for quota checks
- **Subscription expiry:** `idx_subscriptions_expiry` (partial index on ACTIVE)
- **Notification queries:** `idx_notifications_unread` (partial index on unread)

### Composite Indexes
- `idx_notifications_user_id` on `(user_id, created_at DESC)` for timeline queries
- `idx_ticket_messages_ticket_id` on `(ticket_id, created_at)` for conversation threads

## Data Types

### Integer Types
- `BIGSERIAL` for all primary keys (auto-increment, 64-bit)
- `BIGINT` for all foreign keys
- `INT` for counts, limits, and small numbers

### String Types
- `VARCHAR(n)` for bounded strings (emails, names, status codes)
- `TEXT` for unbounded content (messages, descriptions, answers)

### Date/Time Types
- `TIMESTAMP` for all timestamps (no timezone, stored in UTC)
- `DATE` for dates without time (expiry dates, tracking months)

### Special Types
- `JSONB` for flexible metadata and arrays (better performance than JSON)
- `BOOLEAN` for flags and toggles

## Database Size Estimates

Assuming 100,000 users:

| Table                     | Rows Est. | Avg Size/Row | Total Size |
|---------------------------|-----------|--------------|------------|
| users                     | 100,000   | 1 KB         | ~100 MB    |
| api_keys                  | 250,000   | 500 B        | ~125 MB    |
| subscriptions             | 100,000   | 500 B        | ~50 MB     |
| usage_tracking            | 200,000   | 200 B        | ~40 MB     |
| tickets                   | 50,000    | 800 B        | ~40 MB     |
| ticket_messages           | 200,000   | 1 KB         | ~200 MB    |
| faq                       | 100       | 1 KB         | ~100 KB    |
| notifications             | 500,000   | 500 B        | ~250 MB    |
| notification_preferences  | 100,000   | 300 B        | ~30 MB     |
| **Total**                 |           |              | **~835 MB**|

*Note: Estimates include indexes and metadata overhead*

## Migration Execution Flow

```
Step 1: Auth Service V1    → Create users table (base for all FKs)
        Auth Service V2    → Create api_keys table
        Auth Service V3    → Add FK: api_keys.user_id → users.id
        ✓ Auth database complete

Step 2: Trial Service V1   → Create subscriptions, usage_tracking tables
        Trial Service V2   → Add FKs: subscriptions.user_id → users.id
                                     usage_tracking.user_id → users.id
        ✓ Trial database complete

Step 3: Support Service 001 → Create tickets, ticket_messages, faq tables
        Support Service 002 → Add FK: tickets.user_id → users.id
        ✓ Support database complete

Step 4: Notif Service 001   → Create notifications, notification_preferences tables
        Notif Service 002   → Add FKs: notifications.user_id → users.id
                                       notification_preferences.user_id → users.id
        ✓ Notification database complete

✓ All migrations complete - Database ready for use
```

---

**For execution instructions, see:** `RUN_MIGRATIONS.md`  
**For detailed migration files, see:** `DATABASE_MIGRATIONS_SUMMARY.md`
