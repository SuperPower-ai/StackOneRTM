# Project 08 — Independent Production Capstone

## Main goal

Prove that you can start with a business problem and independently produce a maintainable, secure, observable production system.

This is your engineering examination.

You choose the product.

## 1. Domain rules

Choose a problem with real workflow complexity.

Good examples:
- multi-tenant project management,
- clinic/appointment operations,
- logistics/inventory,
- support-ticket platform,
- event-management platform,
- B2B CRM/workflow.

Avoid:
- basic todo,
- weather app,
- simple blog,
- simple movie search.

The domain must force decisions about users, permissions, relationships, validation, workflows, and failures.

## 2. Requirements before code

Write:

### Problem statement
Who has what problem?

### User types
Who uses the system?

### User stories
At least **12 meaningful user stories**.

### Non-functional requirements
Define realistic learning targets for:
- security,
- availability expectations,
- performance,
- maintainability,
- observability.

## 3. Architecture design

Before coding create:
- system context diagram,
- application architecture diagram,
- ER diagram,
- API outline,
- frontend route map,
- trust boundaries,
- deployment diagram.

Default preference: **modular monolith**.

Do not choose microservices without a demonstrated need.

## 4. Data design

Use:
- relational modeling,
- foreign keys,
- uniqueness,
- constraints,
- justified indexes,
- transaction boundaries.

Document:
- important tables,
- invariants,
- common/hot queries.

## 5. API design

Define before implementation:
- endpoints,
- requests,
- responses,
- errors,
- auth requirements,
- authorization rules,
- pagination strategy.

## 6. Frontend architecture

Define:
- routes,
- page boundaries,
- feature modules,
- API layer,
- server-state strategy,
- local/global state strategy,
- validation,
- error handling.

Redux only if justified.

## 7. Required baseline stack

### Frontend
- React,
- TypeScript,
- modern routing,
- TanStack Query,
- React Hook Form,
- Zod,
- testing.

### Backend
- Python,
- FastAPI,
- Pydantic,
- PostgreSQL,
- SQLAlchemy,
- Alembic,
- Redis when justified.

### Production
- Git/GitHub,
- Linux understanding,
- Docker,
- CI/CD,
- AWS fundamentals,
- logs,
- metrics,
- HTTPS,
- secrets.

## 8. Required product capabilities

Implement:
- registration/login/logout,
- role/resource authorization,
- CRUD for multiple related resources,
- search,
- filtering,
- sorting,
- pagination,
- file/object-storage feature,
- email/notification flow,
- background-job flow,
- audit/history for one important action.

Optional if product-justified:
- WebSockets,
- real-time updates,
- Server-Sent Events.

## 9. Authentication / security

Required:
- password hashing,
- secure credential handling,
- expiry,
- logout/revocation,
- rate limiting on sensitive endpoints,
- authorization,
- validation,
- secret handling.

Review:
- XSS,
- CSRF,
- injection,
- access-control bugs,
- resource-authorization/IDOR-style bugs,
- file upload risks,
- dependency/configuration risks.

## 10. Testing standard

Create test strategy before full implementation.

Required:

### Unit
Business rules.

### Integration
Database and service/repository boundaries.

### API
Validation, permissions, error paths.

### Frontend
Important forms/interactions.

### E2E
Critical journeys.

### Regression
Important discovered bugs should gain a regression test when practical.

## 11. Performance

Identify expected hot paths.

Measure:
- SQL,
- API latency,
- frontend loading/rendering.

Run a small load test.

Record:
- baseline,
- bottleneck,
- change,
- result.

## 12. Background processing

Implement a queue/worker flow.

Required:
- retries,
- idempotency where needed,
- failure visibility,
- job status/observability.

Understand dead-letter handling conceptually.

## 13. Observability

### Logs
Structured/searchable.

### Metrics
At minimum:
- traffic,
- latency,
- errors.

### Health
Health/readiness.

### Error reporting
Unexpected exceptions must be visible.

### Trace thinking
Be able to follow one request through frontend → API → database/cache → background operation where relevant.

## 14. CI/CD

CI should run:
- lint,
- formatting/check,
- type checks,
- frontend tests,
- backend tests,
- integration tests,
- build.

Deployment needs:
- reproducible steps,
- migrations,
- environment separation,
- rollback.

## 15. Cloud deployment

Use enough AWS to understand:
- IAM,
- compute,
- networking basics,
- database hosting,
- object storage,
- DNS,
- HTTPS,
- logging/monitoring.

A simple architecture you understand is better than many services you cannot operate.

## 16. Backup / recovery

Document a backup strategy.

Perform at least one recovery exercise or realistic simulation.

Answer:
- what can be restored,
- how much data could be lost,
- how recovery works.

## 17. Incident examination

Introduce these failures deliberately:

1. frontend production error,
2. API exception,
3. database connection failure,
4. slow query,
5. Redis/cache failure,
6. authentication failure,
7. authorization attack attempt,
8. worker failure,
9. bad deployment configuration.

For each report:

```text
Impact
Detection
Timeline
Root cause
Fix
Regression prevention
Follow-up
```

## 18. Architecture challenge

After the system works, answer:

### 10× users
What breaks first?

### 100× traffic
What must change?

### Database growth
What becomes problematic?

### Redis unavailable
What degrades?

### Worker down
What happens to queued work?

### External provider down
How does the product behave?

Explain evolution. Do not prematurely rebuild everything.

## 19. Optional advanced experiments

Only after the core is excellent:
- WebSockets,
- event-driven workflow,
- Kafka/message broker,
- React framework/SSR experiment,
- OpenTelemetry,
- Kubernetes,
- GraphQL,
- search engine.

Every optional technology requires a written justification.

## 20. Required documentation package

Create:
- `README.md`
- `REQUIREMENTS.md`
- `ARCHITECTURE.md`
- `DATABASE.md`
- `API.md`
- `SECURITY.md`
- `TESTING.md`
- `DEPLOYMENT.md`
- `OPERATIONS.md`
- `INCIDENTS.md`
- diagrams.

Keep documentation concise but real.

## 21. Final demonstration

Without reading a script, demonstrate:

1. Product problem.
2. Architecture.
3. Database model.
4. Authentication.
5. Authorization.
6. Core workflow.
7. Error handling.
8. Tests.
9. CI pipeline.
10. Production deployment.
11. Logs/metrics.
12. One debugging incident.
13. One measured optimization.
14. Scaling plan.
15. One important trade-off.

## 22. Final Definition of Done

- [ ] Turn requirements into architecture.
- [ ] Design relational data.
- [ ] Design and implement an API.
- [ ] Build a maintainable React frontend.
- [ ] Integrate frontend/backend.
- [ ] Implement secure authentication.
- [ ] Enforce authorization.
- [ ] Write meaningful tests.
- [ ] Containerize the system.
- [ ] Build CI/CD.
- [ ] Deploy to cloud infrastructure.
- [ ] Observe the running system.
- [ ] Diagnose failures from evidence.
- [ ] Recover from common operational problems.
- [ ] Measure performance.
- [ ] Improve a bottleneck.
- [ ] Explain scaling options.
- [ ] Explain when **not** to add complexity.
- [ ] Critically review AI- or teammate-generated code.
- [ ] Defend major architecture choices.

Completing this capstone does not mean learning is over. It demonstrates the core behavior of an independent, production-capable full-stack engineer and prepares you for deeper mastery through repeated real-system ownership.
