# Project 07 — Evolving Full-Stack Product

## Main goal

Build one serious product and keep evolving it through multiple engineering stages.

Recommended domains:
- project management,
- issue tracking,
- inventory operations,
- small CRM,
- appointment/scheduling,
- learning-management system.

This project is intentionally long-lived. You will use it to learn integration, authentication, authorization, security, testing, Docker, CI/CD, AWS, observability, background jobs, reliability, and performance.

## 1. Product scope

Include:

### Users
- registration,
- login,
- logout,
- profile.

### Organizations / Workspaces
Users belong to one or more logical workspaces.

### Primary business entity
Examples:
- project,
- customer,
- inventory location,
- course.

### Secondary entity
Examples:
- task,
- deal,
- stock item,
- lesson.

The system must contain meaningful ownership/membership relationships.

## 2. Roles and permissions

Implement at least:
- regular member,
- administrator/owner.

Optional:
- manager/moderator.

The backend must enforce permissions. Hiding a button in React is not authorization.

## 3. Frontend

Use:
- React,
- TypeScript,
- React Router,
- TanStack Query,
- React Hook Form,
- Zod.

Required:
- responsive UI,
- accessible forms,
- list/detail/create/edit,
- loading/error/empty states,
- protected app areas,
- good mutation feedback.

Redux Toolkit remains optional unless justified.

## 4. Backend

Use:
- FastAPI,
- Pydantic,
- PostgreSQL,
- SQLAlchemy,
- Alembic.

Required:
- REST APIs,
- validation,
- business rules,
- authorization,
- pagination,
- filtering,
- search,
- sorting,
- consistent errors.

## 5. Authentication

Implement a secure design.

Possible approaches:
- secure server-managed session cookie,
- access/refresh token architecture.

You must explain why you chose yours.

Required:
- registration,
- login,
- logout,
- authenticated request,
- invalid/expired credential handling,
- password-reset design or implementation,
- email-verification design or implementation.

Do not automatically choose JWT because it is popular.

## 6. Authorization

Implement:
- role checks,
- ownership/membership checks,
- unauthorized vs forbidden behavior.

Test cross-workspace/resource isolation.

Example: a Workspace A member must not read Workspace B data by changing an ID.

## 7. Security

Create a threat model:
- assets,
- trust boundaries,
- attack surfaces,
- mitigations.

Address:
- XSS,
- CSRF when relevant,
- SQL injection,
- CORS,
- validation,
- password hashing,
- secrets,
- rate limiting,
- authorization bypass,
- unsafe uploads if supported.

## 8. File uploads

Implement at least one safe upload:
- avatar,
- attachment,
- document.

Validate:
- size,
- type,
- access/ownership.

Do not trust filename extensions alone.

## 9. Email / notifications

Implement at least one:
- welcome email,
- invitation,
- password reset,
- assignment notification.

Hide provider-specific code behind a testable boundary.

## 10. Background job

Move one slow/non-critical operation outside the request lifecycle.

Examples:
- email,
- report generation,
- image processing.

Learn:
- queue,
- worker,
- retry,
- idempotency,
- failure visibility.

## 11. Redis

Use Redis for at least one justified case:
- cache,
- rate limiting,
- ephemeral auth/session state,
- job coordination/status.

Document:
- key format,
- TTL,
- invalidation,
- Redis-failure behavior.

## 12. Testing

### Backend
- unit,
- API,
- database integration,
- authorization,
- failure paths.

### Frontend
- components,
- forms,
- query success/error.

### E2E
Use Playwright for critical flows:
1. register/login,
2. create core entity,
3. edit it,
4. permission boundary,
5. logout.

Do not E2E-test every tiny detail.

## 13. Docker

Containerize:
- frontend,
- backend,
- PostgreSQL,
- Redis,
- worker if used.

Use:
- multi-stage builds,
- volumes,
- networks,
- health checks,
- environment configuration.

Avoid unnecessary root execution in production containers.

## 14. Observability

Implement:

### Logs
Structured application logs.

### Correlation
A request identifier or equivalent context.

### Metrics
At least:
- request count,
- latency,
- error count.

### Error reporting
Unexpected failures must be visible.

### Health
Health/readiness information.

Understand tracing conceptually.

## 15. CI

Automatically run:

```text
lint
↓
type check
↓
unit tests
↓
integration tests
↓
frontend build
↓
backend validation/build
```

Broken CI means the change is not ready.

## 16. Deployment

Deploy publicly while learning AWS concepts:
- compute,
- managed PostgreSQL,
- object storage,
- IAM,
- DNS,
- HTTPS,
- monitoring.

Required:
- repeatable deployment,
- environment-specific config,
- secret management,
- migration procedure,
- rollback procedure.

## 17. Database operations

Document:
- migration process,
- backup strategy,
- restore concept,
- connection-pool concept.

Perform a restore/recovery exercise if practical.

## 18. Performance

Measure:
- backend latency,
- slow SQL,
- frontend performance.

Use one or more:
- query plans,
- profiling,
- browser Performance tools,
- load testing.

Make at least **2 measured improvements**.

Do not claim “optimized” without a before/after measurement.

## 19. Failure exercises

Simulate:
- database failure,
- Redis failure,
- email provider failure,
- invalid authentication,
- background job failure.

Document system behavior and improvement opportunities.

## 20. Git / team workflow simulation

Even alone:
- feature branches,
- PRs,
- self-review diffs,
- issue descriptions,
- meaningful commits.

For one large feature:
- write requirements first,
- split tasks,
- implement over multiple commits.

## 21. Documentation

Include:
- product overview,
- architecture diagram,
- ER diagram,
- API documentation,
- threat model,
- state architecture,
- test strategy,
- local setup,
- Docker setup,
- deployment,
- environment variables,
- incident notes,
- performance notes,
- major trade-offs.

## 22. Required incident drill

Create at least five failures:
- frontend exception,
- backend 500,
- missing env variable,
- slow query,
- expired auth,
- stale cache,
- worker failure.

For each:
1. observe,
2. reproduce,
3. hypothesize,
4. inspect evidence,
5. find root cause,
6. fix,
7. add regression protection,
8. deploy,
9. monitor.

## 23. Definition of Done

- [ ] Change a feature across database → backend → frontend → tests.
- [ ] Implement authentication safely.
- [ ] Enforce authorization on the server.
- [ ] Explain major security risks.
- [ ] Containerize everything.
- [ ] Run automated CI.
- [ ] Deploy.
- [ ] Inspect logs/metrics.
- [ ] Diagnose production-like failures.
- [ ] Measure and improve performance.
- [ ] Explain architectural trade-offs.
- [ ] Explain what changes at 10× traffic.

At this stage you should be able to own a real application, not just build demo screens.
