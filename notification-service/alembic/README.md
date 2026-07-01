# Notification Service Database Migrations

This directory contains Alembic migrations for the Notification Service database schema.

## Database Tables

The Notification Service manages the following tables:

1. **notifications** - In-app notifications with read/unread tracking
2. **notification_preferences** - User preferences for email, SMS, and in-app notifications

## Running Migrations

### Prerequisites

```bash
# Install dependencies
pip install -r requirements.txt
```

### Apply Migrations

```bash
# Run all pending migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View migration history
alembic history

# Check current version
alembic current
```

### Creating New Migrations

```bash
# Auto-generate migration from model changes
alembic revision --autogenerate -m "description of changes"

# Create empty migration
alembic revision -m "description of changes"
```

## Initial Schema (001_initial_schema.py)

Creates:
- `notifications` table with types (INFO, WARNING, ERROR, SUCCESS)
- `notification_preferences` table with digest frequency options (DAILY, WEEKLY, NEVER)
- Indexes for performance optimization including partial index for unread notifications
- Triggers for automatic timestamp updates
- Check constraints for data validation

## Configuration

Database connection is configured in `alembic.ini`:
```ini
sqlalchemy.url = postgresql://swarparikshan:swarparikshan_secure_password@localhost:5432/swarparikshan
```

Update this connection string for your environment or use the DATABASE_URL environment variable.
