# Database Migration Execution Guide

## Prerequisites

1. PostgreSQL 12+ running (either locally or via Docker)
2. Database created: `mayabhedak_db`
3. Database user with appropriate permissions

## Quick Start (Docker Compose)

The easiest way to run all migrations is to start the services using Docker Compose. The Spring Boot services (Auth and Trial) will automatically run Flyway migrations on startup.

```bash
# Start PostgreSQL first
docker-compose up -d postgres redis

# Wait for PostgreSQL to be ready (about 10 seconds)
# Then start Auth Service (creates users table and other auth tables)
docker-compose up -d auth-service

# Wait for Auth Service to complete migrations (check logs)
docker logs swarparikshan-app-auth-service-1

# Start Trial Service (creates subscriptions and usage_tracking tables)
docker-compose up -d trial-service

# Run Support Service migrations manually
cd support-service
alembic upgrade head
cd ..

# Run Notification Service migrations manually
cd notification-service
alembic upgrade head
cd ..
```

## Manual Migration Execution

### Step 1: Auth Service (Flyway - Automatic)

The Auth Service uses Spring Boot with Flyway. Migrations run automatically on startup.

**Migration Files:**
- `V1__initial_schema.sql` - Creates users table
- `V2__api_keys_schema.sql` - Creates api_keys table
- `V3__add_foreign_key_constraints.sql` - Adds foreign key constraints

**To run:**
```bash
cd auth-service
mvn spring-boot:run
# OR with Docker
docker-compose up auth-service
```

**Verify:**
```bash
# Check Flyway schema history
docker exec -it postgres psql -U postgres -d mayabhedak_db -c "SELECT * FROM flyway_schema_history;"
```

### Step 2: Trial Service (Flyway - Automatic)

The Trial Service uses Spring Boot with Flyway. Migrations run automatically on startup.

**Migration Files:**
- `V1__subscriptions_schema.sql` - Creates subscriptions and usage_tracking tables
- `V2__add_foreign_key_constraints.sql` - Adds foreign key constraints

**To run:**
```bash
cd trial-service
mvn spring-boot:run
# OR with Docker
docker-compose up trial-service
```

### Step 3: Support Service (Alembic - Manual)

The Support Service uses FastAPI with Alembic. Migrations must be run manually.

**Migration Files:**
- `001_initial_schema.py` - Creates tickets, ticket_messages, and faq tables
- `002_add_foreign_key_constraints.py` - Adds foreign key constraints

**To run:**
```bash
cd support-service

# Activate virtual environment (if not already activated)
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Run migrations
alembic upgrade head

# Verify current version
alembic current

# View migration history
alembic history
```

### Step 4: Notification Service (Alembic - Manual)

The Notification Service uses FastAPI with Alembic. Migrations must be run manually.

**Migration Files:**
- `001_initial_schema.py` - Creates notifications and notification_preferences tables
- `002_add_foreign_key_constraints.py` - Adds foreign key constraints

**To run:**
```bash
cd notification-service

# Activate virtual environment (if not already activated)
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Run migrations
alembic upgrade head

# Verify current version
alembic current

# View migration history
alembic history
```

## Verification

After running all migrations, verify the database schema:

```sql
-- Connect to PostgreSQL
psql -U postgres -d mayabhedak_db

-- List all tables
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
-- flyway_schema_history (Flyway metadata)
-- alembic_version (Alembic metadata)

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

-- Check indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

## Troubleshooting

### Issue: "relation users does not exist"

**Cause:** Auth Service migrations have not run yet.

**Solution:** 
1. Ensure Auth Service starts first
2. Wait for Auth Service migrations to complete
3. Then start other services

### Issue: "constraint already exists"

**Cause:** Attempting to re-run a migration that already executed.

**Solution:**
```bash
# For Flyway (Spring Boot services)
# Check migration status in flyway_schema_history table

# For Alembic (FastAPI services)
alembic current
alembic downgrade -1  # Downgrade one version if needed
alembic upgrade head  # Re-apply
```

### Issue: "password authentication failed"

**Cause:** Database credentials mismatch.

**Solution:**
Check configuration files:
- `auth-service/src/main/resources/application.yml`
- `trial-service/src/main/resources/application.yml`
- `support-service/alembic.ini`
- `notification-service/alembic.ini`

Ensure they all point to the same database with correct credentials.

### Issue: Alembic "can't locate revision identified by"

**Cause:** Alembic version table is out of sync.

**Solution:**
```bash
# Check current state
alembic current

# Stamp to specific revision (if needed)
alembic stamp head

# Or clear and restart
# WARNING: This will lose migration history
DROP TABLE alembic_version;
alembic upgrade head
```

## Rolling Back Migrations

### Flyway (Auth & Trial Services)

Flyway doesn't support automatic rollback in community edition. For rollback:

1. Manually write down migration SQL
2. Execute DROP statements in reverse order
3. Delete from `flyway_schema_history` table

**Example:**
```sql
-- Rollback V3
ALTER TABLE api_keys DROP CONSTRAINT IF EXISTS fk_api_keys_user_id;
DELETE FROM flyway_schema_history WHERE version = '3';
```

### Alembic (Support & Notification Services)

Alembic supports automatic rollback via downgrade functions:

```bash
# Downgrade one version
alembic downgrade -1

# Downgrade to specific version
alembic downgrade 001

# Downgrade all migrations
alembic downgrade base
```

## Environment Variables

Ensure these environment variables are set:

```bash
# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=mayabhedak_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# For Docker Compose
docker-compose uses .env file automatically
```

## Complete Fresh Setup

To start completely fresh (WARNING: Destroys all data):

```bash
# Stop all services
docker-compose down

# Remove PostgreSQL volume
docker volume rm swarparikshan-app_postgres_data

# Restart with clean database
docker-compose up -d postgres

# Wait 10 seconds for PostgreSQL to initialize

# Run migrations in order
docker-compose up -d auth-service
# Wait for auth-service logs to show "Migration complete"

docker-compose up -d trial-service
# Wait for trial-service logs to show "Migration complete"

cd support-service
alembic upgrade head
cd ..

cd notification-service
alembic upgrade head
cd ..
```

## Migration Status Check

Quick command to check migration status across all services:

```bash
# Check Flyway migrations (Auth & Trial)
docker exec -it postgres psql -U postgres -d mayabhedak_db -c "SELECT version, description, installed_on, success FROM flyway_schema_history ORDER BY installed_rank;"

# Check Alembic version (Support & Notification)
docker exec -it postgres psql -U postgres -d mayabhedak_db -c "SELECT * FROM alembic_version;"
```

## Next Steps

After migrations are complete:
1. Verify all tables exist with `\dt` in psql
2. Check foreign key constraints are in place
3. Start all microservices
4. Test with sample data insertion
5. Verify cascade delete behavior

---

**For detailed schema information, see:** `DATABASE_MIGRATIONS_SUMMARY.md`
