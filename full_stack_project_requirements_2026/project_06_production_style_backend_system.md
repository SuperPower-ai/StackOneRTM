# Project 06 — Production-Style Backend System

## Main goal

Build a backend that behaves like a real service.

Recommended domain: **Issue / Project / Inventory Management API**.

Final stack:
- Python,
- FastAPI,
- Pydantic,
- PostgreSQL,
- SQLAlchemy,
- Alembic,
- Redis,
- pytest.

Build it in stages.

# Stage A — API Before Database

Start with temporary/in-memory storage.

This forces you to understand HTTP, contracts, validation, and business behavior before the ORM/database becomes a distraction.

## 1. Core domain

Use at least **3 related resources**.

Example:

```text
users
projects
tasks
```

Possible relationships:
- user owns projects,
- project has tasks,
- task has assignee.

Authentication may be simplified initially. Full security is added later.

## 2. Required API features

For primary resources implement:
- create,
- read one,
- list,
- update,
- partial update,
- delete/archive.

Also add:
- pagination,
- filtering,
- sorting,
- search.

Return appropriate HTTP status codes.

## 3. API contracts

Use Pydantic for:
- request validation,
- response schemas.

Separate create/update/response models when their shapes differ.

Do not blindly expose database models as API contracts.

## 4. Error handling

Handle:
- malformed request,
- validation failure,
- not found,
- duplicate/conflict,
- invalid relationship,
- unexpected server failure.

Use a consistent error format.

## 5. Architecture

A reasonable flow is:

```text
router
  ↓
service
  ↓
repository/data access
```

But do not create empty layers just to follow a pattern. Explain why each layer exists.

# Stage B — PostgreSQL

Replace temporary persistence with PostgreSQL.

## 6. Database requirements

Use:
- primary keys,
- foreign keys,
- NOT NULL constraints,
- UNIQUE constraints when appropriate,
- timestamps,
- meaningful indexes.

## 7. Raw SQL requirement

Before relying fully on SQLAlchemy, manually write:
- joins,
- grouping,
- filters,
- aggregates,
- at least one CTE,
- at least one reporting query.

You must understand the SQL beneath the ORM.

## 8. SQLAlchemy requirements

Use:
- models,
- relationships,
- sessions,
- transaction boundaries,
- eager loading where appropriate.

Find and prevent at least one possible N+1 query.

## 9. Alembic requirements

Practice:
- initial migration,
- adding a column,
- adding/changing an index,
- upgrade,
- downgrade in development.

Do not manually change production schemas.

## 10. Transaction requirement

Implement at least one multi-record atomic operation.

Examples:
- create project + owner membership,
- inventory transfer,
- order + line items.

Explain what could fail without a transaction.

## 11. PostgreSQL performance

For at least **2 important queries**:
- inspect query plan,
- add/adjust an index if justified,
- compare behavior.

Document the read benefit and write/storage cost.

# Stage C — Redis

Use Redis only for a real reason.

## 12. Redis requirement

Choose at least one:

### Cache
Define:
- cache key,
- TTL,
- invalidation behavior.

### Rate limit
Implement a simple rate-limit strategy.

### Shared temporary state
Examples:
- token,
- counter,
- job status.

Do not use Redis merely to claim experience.

## 13. Testing

### Unit tests
Pure business rules.

### API tests
CRUD, validation, errors, pagination/filtering.

### Integration tests
Use a test database for repository behavior, transactions, and constraints.

### Redis tests
Test the chosen Redis behavior or isolate it behind a testable boundary.

## 14. Logging

Implement useful structured logs including:
- request/correlation ID,
- operation/method/path,
- outcome/status,
- useful error context.

Never log passwords, tokens, or secrets.

## 15. Configuration

Use environment-based configuration for:
- database,
- Redis,
- environment,
- external service settings.

No hardcoded secrets.

## 16. Health

Expose a health endpoint.

Understand the future difference between:
- process alive,
- dependencies ready.

## 17. MongoDB learning exercise

Keep this separate from the main backend.

Build a small proof of concept showing:
- documents,
- collections,
- embedding,
- referencing,
- index,
- aggregation.

Write one page answering:

**Would MongoDB improve the main application's data model? Why or why not?**

“No” is a valid answer.

## 18. Documentation

Include:
- architecture diagram,
- ER diagram,
- API overview,
- setup,
- environment variables,
- migrations,
- test commands,
- Redis decision,
- query/index notes,
- limitations.

## 19. Definition of Done

- [ ] Design an API contract before implementing.
- [ ] Model relational data correctly.
- [ ] Write SQL manually.
- [ ] Use SQLAlchemy without forgetting SQL.
- [ ] Run migrations safely.
- [ ] Explain transactions.
- [ ] Diagnose N+1.
- [ ] Explain indexes.
- [ ] Use Redis for a justified problem.
- [ ] Write unit/API/integration tests.
- [ ] Investigate failures using logs and tests.
- [ ] Explain every major architectural layer.
