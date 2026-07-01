# Support Service Database Migrations

This directory contains Alembic migrations for the Support Service database schema.

## Database Tables

The Support Service manages the following tables:

1. **tickets** - Customer support tickets with status tracking
2. **ticket_messages** - Messages within tickets from users, agents, or system
3. **faq** - Frequently asked questions with pre-populated default entries

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
- `tickets` table with categories (TECHNICAL, BILLING, FEATURE_REQUEST, BUG_REPORT, OTHER)
- `ticket_messages` table with sender types (USER, AGENT, SYSTEM)
- `faq` table with 10 pre-populated common questions
- Indexes for performance optimization
- Triggers for automatic timestamp updates
- Foreign key constraints and check constraints

## Configuration

Database connection is configured in `alembic.ini`:
```ini
sqlalchemy.url = postgresql://swarparikshan:swarparikshan_secure_password@localhost:5432/swarparikshan
```

Update this connection string for your environment.
