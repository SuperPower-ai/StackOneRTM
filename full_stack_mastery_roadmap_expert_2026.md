# Full-Stack Mastery Roadmap — Expert Revision (2026)

**Starting point:** Total full-stack beginner  
**Core program:** 18 months at roughly 3–4 focused hours/day  
**Long-term target:** Full-stack mastery through continued production experience after the core program  
**Primary stack:** HTML, CSS, JavaScript, TypeScript, React, React Router, TanStack Query, Python, FastAPI, PostgreSQL, SQLAlchemy, Alembic, Redis, Docker, Linux, Git/GitHub, GitHub Actions, AWS  
**Secondary / conditional tools:** Redux Toolkit, MongoDB, task queues, WebSockets, Next.js or another React framework for framework literacy  
**Learning model:** Understand → Practice → Build → Test → Debug → Explain → Refactor → Deploy → Observe

---

# 1. What “Mastery” Means

Do not define mastery by months completed, tutorials watched, or technologies listed on a résumé.

For every important technology or concept, reach these levels:

1. **Understand** — Explain what it is and what problem it solves.
2. **Implement** — Use it without copying a tutorial.
3. **Debug** — Diagnose failures using documentation, logs, browser tools, tests, and debuggers.
4. **Test** — Prove important behavior automatically.
5. **Secure** — Identify the common risks introduced by the feature.
6. **Design** — Explain when to use it and when not to use it.
7. **Operate** — Deploy, configure, monitor, and troubleshoot it.
8. **Optimize** — Measure before optimizing and explain the trade-off.

A topic is not complete because you “covered” it.

---

# 2. Non-Negotiable Rules

## Rule 1 — Build every week

Every week includes:
- theory,
- small exercises,
- independent implementation,
- debugging,
- project work,
- review and refactoring.

## Rule 2 — Git from Day 1

Use Git for every meaningful project.

Early:
- init,
- status,
- add,
- commit,
- log,
- diff,
- push,
- pull,
- .gitignore.

Later:
- branches,
- merges,
- conflict resolution,
- pull requests,
- rebase,
- revert,
- bisect,
- release tags.

## Rule 3 — Tests begin early

Testing is not a Month-14-only skill.

Introduce:
- simple JavaScript tests while learning JavaScript,
- pytest while learning Python,
- API tests while learning FastAPI,
- integration tests with PostgreSQL,
- React component/integration tests while learning React,
- end-to-end tests once a real full-stack application exists.

## Rule 4 — Security begins with the first user input

Security is learned progressively:
- HTML/forms → safe input/output thinking,
- browser/JavaScript → XSS awareness,
- APIs → validation and authorization,
- SQL → injection prevention and least privilege,
- authentication → secure credential/token/session handling,
- deployment → secret management and infrastructure permissions.

## Rule 5 — AI assists learning; it does not replace learning

For difficult tasks:

1. Try independently.
2. Identify exactly what is unclear.
3. Ask AI for explanation, hints, alternatives, or review.
4. Implement the solution yourself.
5. Run tests.
6. Verify important details with official documentation.
7. Explain the final solution in your own words.

Never keep code in a project that you cannot explain.

## Rule 6 — Learn tools because a problem requires them

Examples:

- Need server-state caching/synchronization? → TanStack Query.
- Need complex global client state? → Redux Toolkit.
- Need fast temporary/shared data? → Redis.
- Need background processing? → Task queue.
- Need real-time bidirectional communication? → WebSockets.
- Need document-oriented data modeling? → MongoDB.
- Need independent service boundaries? → Consider microservices only after mastering modular monoliths.

## Rule 7 — Do not optimize prematurely

Correctness → clarity → measurement → optimization.

---

# 3. Daily and Weekly Study System

## 3–4 hour study day

- 30–45 min: concepts / official documentation
- 45–60 min: focused exercises
- 60–90 min: independent coding
- 30–60 min: project work
- 15 min: notes / recall / review

When you have extra time, increase independent project work—not passive tutorials.

## Weekly rhythm

**Day 1:** Learn + small exercises  
**Day 2:** Exercises + debugging  
**Day 3:** Implement from memory  
**Day 4:** Add a real project feature  
**Day 5:** Tests + refactor + documentation  
**Day 6:** Independent project work  
**Day 7:** Review, explain concepts aloud, fix weak areas, plan next week

---

# 4. Horizontal Skills — Run Through All 18 Months

These do not belong to one isolated month.

## Debugging
Progressively learn:
- browser DevTools,
- console,
- network inspector,
- breakpoints,
- stack traces,
- Python debugger,
- application logs,
- SQL inspection,
- container logs,
- production logs and metrics.

## Documentation
Learn to read:
- tutorials only for initial orientation,
- official guides,
- API references,
- error messages,
- changelogs,
- migration guides.

## Communication
For every serious project write:
- README,
- setup instructions,
- architecture summary,
- key trade-offs,
- known limitations,
- testing instructions.

## Computer Science
Integrate gradually:
- Big-O,
- arrays,
- hash maps,
- sets,
- stacks,
- queues,
- recursion,
- trees,
- graphs at a basic level,
- sorting/searching concepts,
- concurrency,
- memory/process concepts.

The goal is engineering understanding, not months of isolated algorithm grinding.

---

# PHASE 1 — FOUNDATIONS

# Month 1 — Computer, Internet, CLI, Git, and Web Architecture

## Week 1 — Computer Fundamentals

Learn:
- operating systems,
- CPU,
- memory,
- storage,
- files/directories,
- paths,
- processes,
- programs vs processes,
- terminal,
- environment variables,
- PATH.

Practice:
- navigate the filesystem,
- create/move/delete files,
- run programs,
- inspect processes,
- inspect environment variables.

## Week 2 — Internet and Networking Fundamentals

Learn:
- client/server model,
- IP addresses,
- DNS,
- domains,
- ports,
- TCP basics,
- TLS,
- HTTPS,
- request/response lifecycle.

Be able to explain:

Browser → DNS → network connection → TLS → HTTP → server → response → browser

## Week 3 — HTTP and APIs

Learn:
- HTTP methods,
- headers,
- body,
- JSON,
- query parameters,
- path parameters,
- cookies,
- status codes,
- caching headers at a conceptual level,
- REST basics.

Practice:
- browser Network tab,
- curl,
- API client.

## Week 4 — Git and Web Architecture

Learn basic Git:
- repository,
- commit,
- diff,
- log,
- remote,
- push/pull,
- .gitignore.

Learn architecture:
- frontend,
- backend,
- API,
- database,
- authentication,
- authorization,
- web server,
- application server.

### Month 1 Gate

You can:
- explain what happens when a URL is entered,
- inspect an HTTP request,
- use terminal basics,
- create and push a Git repository,
- draw a simple frontend/API/database architecture.

---

# Month 2 — HTML, CSS, Accessibility, Responsive Design

## Week 1 — HTML

Learn:
- document structure,
- semantic elements,
- headings,
- text,
- links,
- images,
- lists,
- tables,
- metadata.

## Week 2 — Forms and Accessibility

Learn:
- form controls,
- labels,
- validation,
- keyboard navigation,
- semantic structure,
- focus,
- accessibility tree concepts,
- ARIA basics and when not to use ARIA.

## Week 3 — CSS Foundations

Learn:
- selectors,
- cascade,
- specificity,
- inheritance,
- typography,
- units,
- box model,
- normal flow,
- display,
- positioning.

## Week 4 — Layout and Responsive UI

Learn:
- Flexbox,
- Grid,
- media queries,
- mobile-first thinking,
- responsive images,
- transitions,
- basic animations.

### Project 1 — Accessible Responsive Portfolio

Requirements:
- responsive layout,
- semantic HTML,
- keyboard usable,
- accessible forms,
- no CSS framework,
- Git history from beginning,
- deployed publicly.

### Month 2 Gate

Rebuild a supplied layout from a screenshot without a tutorial.

---

# Month 3 — JavaScript Fundamentals

## Week 1 — Language Fundamentals

Learn:
- variables,
- primitive types,
- operators,
- conditions,
- loops,
- type conversion,
- equality,
- truthy/falsy.

## Week 2 — Functions and Data

Learn:
- functions,
- parameters,
- return values,
- scope basics,
- arrays,
- objects,
- destructuring,
- spread/rest,
- array methods,
- maps and sets.

Introduce:
- algorithmic thinking,
- Big-O intuition.

## Week 3 — DOM and Events

Learn:
- DOM,
- selecting/creating/updating elements,
- events,
- event propagation,
- forms,
- validation,
- localStorage.

## Week 4 — Asynchronous JavaScript

Learn:
- JSON,
- fetch,
- promises,
- async/await,
- try/catch,
- loading/error/empty states,
- AbortController concept,
- network failures.

### Project 2 — Vanilla JavaScript Application

Build a task/product/movie application with:
- CRUD-like interactions,
- filtering/search,
- persistence,
- external API call,
- loading/error states,
- responsive UI.

### Month 3 Gate

Build the main application logic without copying a tutorial.

---

# Month 4 — Deep JavaScript, Browser Runtime, Testing, Advanced Git

## Week 1 — JavaScript Depth

Learn:
- lexical scope,
- closures,
- `this`,
- prototypes,
- classes,
- modules,
- immutability,
- references vs values.

## Week 2 — Runtime and Async Internals

Learn:
- call stack,
- event loop,
- tasks/microtasks,
- promise behavior,
- error propagation,
- browser runtime concepts.

## Week 3 — JavaScript Testing and Quality

Learn:
- test anatomy,
- assertions,
- unit tests,
- testable design,
- linting,
- formatting,
- debugging with breakpoints.

## Week 4 — Git Depth

Learn:
- branches,
- merges,
- conflicts,
- pull requests,
- rebase concept,
- revert,
- useful commit messages.

### Month 4 Gate

Given a small broken JavaScript application, debug it, write regression tests, and submit the fix through a branch/PR-style workflow.

---

# Month 5 — TypeScript and Frontend Tooling

## Week 1 — TypeScript Fundamentals

Learn:
- primitive types,
- arrays,
- objects,
- functions,
- inference,
- annotations.

## Week 2 — Type Modeling

Learn:
- interfaces,
- type aliases,
- unions,
- intersections,
- literal types,
- generics.

## Week 3 — Type Safety

Learn:
- narrowing,
- type guards,
- utility types,
- `unknown`,
- `never`,
- nullability,
- discriminated unions.

Avoid:
- using `any` to silence problems,
- over-engineering type-level puzzles too early.

## Week 4 — Tooling

Learn:
- npm,
- package.json,
- semantic versioning concepts,
- lockfiles,
- scripts,
- Vite,
- environment configuration,
- lint/format workflow.

### Project 3 — TypeScript Conversion

Convert the Month-3 JavaScript app to TypeScript, fixing the design instead of mechanically adding types.

### Month 5 Gate

Model API data and application state without leaning on `any`.

---

# PHASE 2 — MODERN FRONTEND ENGINEERING

# Month 6 — React + TypeScript Fundamentals

## Week 1

Learn:
- components,
- JSX,
- props,
- composition,
- rendering,
- component boundaries.

## Week 2

Learn:
- state,
- events,
- forms,
- lists,
- conditional rendering,
- controlled inputs.

## Week 3

Learn:
- `useState`,
- `useEffect`,
- `useContext`,
- `useReducer`,
- refs,
- custom hooks,
- effect dependencies.

Focus strongly on:
- when an effect is unnecessary,
- derived state,
- lifting state,
- composition.

## Week 4

Learn:
- React Router,
- nested routes,
- route parameters,
- protected UI routes,
- error/loading UI,
- basic component testing.

### Project 4 — React Dashboard

Use:
- React,
- TypeScript,
- Vite,
- React Router,
- component tests.

### Month 6 Gate

Build a multi-page React application from a blank project without a tutorial.

---

# Month 7 — Modern React Data, Forms, State, Performance

## Week 1 — Server State

Learn TanStack Query:
- queries,
- mutations,
- query keys,
- stale data,
- cache lifecycle,
- invalidation,
- refetching,
- pagination,
- optimistic updates.

## Week 2 — Forms

Learn:
- React Hook Form,
- schema validation,
- Zod,
- server validation vs client validation,
- accessible error presentation.

## Week 3 — State Architecture

Decision order:
1. local component state,
2. composition,
3. Context,
4. URL state,
5. server state via TanStack Query,
6. Redux Toolkit only when substantial shared client state justifies it.

Learn Redux Toolkit enough to understand:
- store,
- slices,
- actions,
- reducers,
- selectors,
- middleware,
- async architecture.

## Week 4 — UI Architecture and Performance

Learn:
- feature-based organization,
- reusable component APIs,
- error boundaries,
- code splitting,
- lazy loading,
- rendering performance,
- browser performance tools,
- Tailwind or a component library after CSS fundamentals.

### Frontend Project — Production-Style Admin Application

Requirements:
- TypeScript,
- routing,
- server-state layer,
- forms and validation,
- authentication UI mock,
- accessible components,
- component/integration tests,
- responsive design,
- error handling.

### Month 7 Gate

Explain exactly where each piece of state belongs and why.

---

# PHASE 3 — PYTHON AND BACKEND ENGINEERING

# Month 8 — Python Engineering Foundations

## Week 1

Learn:
- syntax,
- values/types,
- strings,
- conditions,
- loops.

## Week 2

Learn:
- lists,
- tuples,
- dictionaries,
- sets,
- comprehensions,
- iterators.

## Week 3

Learn:
- functions,
- modules,
- packages,
- exceptions,
- classes,
- OOP,
- composition.

## Week 4

Learn:
- type hints,
- dataclasses,
- decorators,
- generators,
- context managers,
- file I/O,
- JSON,
- virtual environments,
- `pyproject.toml`,
- dependency management,
- `uv`,
- linting with Ruff,
- pytest,
- async/await fundamentals.

### Project 5 — Tested Python CLI

Build a CLI application with:
- CRUD,
- persistence,
- validation,
- clean modules,
- type hints,
- automated tests,
- error handling.

### Month 8 Gate

Write and test a small Python program without relying on JavaScript habits.

---

# Month 9 — FastAPI and API Engineering

## Week 1 — API Fundamentals

Learn:
- application lifecycle,
- routes,
- HTTP methods,
- path/query parameters,
- request bodies,
- status codes.

## Week 2 — Validation and Contracts

Learn:
- Pydantic,
- request models,
- response models,
- validation,
- error responses,
- OpenAPI,
- API documentation.

## Week 3 — Application Architecture

Learn:
- routers,
- dependencies,
- configuration,
- services,
- repositories as a pattern—not a mandatory layer,
- middleware,
- dependency injection concepts.

Prefer the simplest architecture that keeps responsibilities clear.

## Week 4 — API Features and Tests

Learn:
- pagination,
- filtering,
- search,
- sorting,
- CORS,
- versioning trade-offs,
- file upload basics,
- background-task basics,
- pytest API tests,
- mocking external boundaries.

### Project 6A — Production-Style API Without Database

Build a clean, tested API with temporary/in-memory persistence first.

### Month 9 Gate

Design an API contract before implementing it.

---

# Month 10 — SQL and PostgreSQL

## Week 1 — Relational Modeling

Learn:
- tables,
- rows,
- columns,
- data types,
- primary keys,
- foreign keys,
- constraints,
- one-to-one,
- one-to-many,
- many-to-many,
- normalization fundamentals.

## Week 2 — SQL

Master:
- SELECT,
- INSERT,
- UPDATE,
- DELETE,
- WHERE,
- ORDER BY,
- GROUP BY,
- HAVING,
- JOIN,
- subqueries,
- CTEs,
- aggregates,
- window-function basics.

## Week 3 — Transactions and Correctness

Learn:
- ACID,
- transactions,
- isolation,
- locks,
- concurrency anomalies,
- constraints,
- database-enforced correctness.

## Week 4 — Performance

Learn:
- indexes,
- composite indexes,
- selectivity concepts,
- query plans,
- EXPLAIN / EXPLAIN ANALYZE,
- pagination trade-offs,
- N+1 problems,
- connection-pool concepts.

### Database Project

Design a realistic schema and implement meaningful reporting queries using raw SQL before relying on an ORM.

### Month 10 Gate

Given a feature requirement, design the schema and justify keys, constraints, relationships, and indexes.

---

# Month 11 — SQLAlchemy, Alembic, Redis, Backend Integration

## Week 1 — SQLAlchemy

Learn:
- models,
- sessions,
- relationships,
- querying,
- transaction boundaries,
- eager vs lazy loading concepts.

## Week 2 — Alembic and Database Lifecycle

Learn:
- migrations,
- upgrade/downgrade thinking,
- schema evolution,
- migration safety,
- test database setup.

## Week 3 — Redis

Learn Redis through problems:
- caching,
- TTL,
- counters,
- sessions,
- rate-limiting concepts,
- shared ephemeral state,
- cache invalidation.

## Week 4 — Backend Production Patterns

Learn:
- structured logging,
- request IDs,
- configuration,
- health endpoints,
- graceful errors,
- timeouts,
- retry concepts,
- idempotency basics.

### Project 6B — Real Backend

Upgrade the Month-9 API to:
- PostgreSQL,
- SQLAlchemy,
- Alembic,
- Redis for a justified use case,
- integration tests,
- structured logging.

### MongoDB Rule

Learn MongoDB concepts and build one small exercise:
- documents,
- collections,
- embedding vs referencing,
- indexes,
- aggregation basics.

Do **not** add MongoDB to the main application unless its data model genuinely benefits from a document database.

### Month 11 Gate

Explain why PostgreSQL is the system of record, what Redis is doing, and why another database is or is not required.

---

# PHASE 4 — FULL-STACK APPLICATION ENGINEERING

# Month 12 — Full-Stack Integration

Connect:

React + TypeScript  
↓  
React Router / TanStack Query  
↓  
FastAPI  
↓  
PostgreSQL  
↓  
Redis where justified

## Week 1
- API client design,
- environment configuration,
- CORS,
- loading/error UX,
- typed request/response contracts.

## Week 2
- CRUD,
- filtering,
- search,
- pagination,
- optimistic vs pessimistic updates.

## Week 3
- file uploads,
- email integration,
- notification concepts,
- frontend/backend validation.

## Week 4
- basic authentication implementation,
- integration testing,
- end-to-end happy path.

### Project 7 — Full-Stack Application v1

Choose a serious domain such as:
- project management,
- inventory,
- scheduling,
- CRM,
- issue tracking,
- learning platform.

Do not choose a trivial todo application.

### Month 12 Gate

From a requirement, independently change database → API → frontend → tests.

---

# Month 13 — Authentication, Authorization, and Security

## Week 1 — Authentication

Learn:
- password hashing,
- credential storage principles,
- sessions,
- cookies,
- access tokens,
- refresh tokens,
- JWT trade-offs.

Do not assume JWT is always the right choice.

## Week 2 — OAuth/OIDC and Account Security

Learn:
- OAuth concepts,
- OpenID Connect concepts,
- social login,
- account linking risks,
- token rotation/revocation,
- 2FA concepts,
- password reset,
- email verification.

## Week 3 — Web Security

Learn:
- XSS,
- CSRF,
- SQL injection,
- NoSQL injection,
- CORS misconceptions,
- input validation,
- output encoding,
- Content Security Policy concepts,
- SSRF awareness,
- rate limiting,
- secret management,
- dependency risk.

## Week 4 — Authorization

Learn:
- authentication vs authorization,
- roles,
- permissions,
- RBAC,
- ownership/resource-level authorization,
- least privilege,
- basic ABAC concepts.

### Security Project Work

Threat-model your Month-12 application:
- assets,
- actors,
- trust boundaries,
- attack surfaces,
- mitigations.

Add security tests for critical authorization paths.

### Month 13 Gate

You can explain how an unauthorized user might attack each major endpoint and what prevents it.

---

# Month 14 — Testing, Code Quality, Reliability

## Week 1 — Testing Strategy

Deepen:
- unit tests,
- integration tests,
- API tests,
- component tests,
- E2E tests,
- test pyramid / testing trade-offs,
- test doubles,
- fixtures,
- deterministic tests.

## Week 2 — Backend Quality

Learn:
- pytest fixtures,
- database isolation,
- testing transactions,
- external service mocks/fakes,
- failure-path tests,
- regression tests.

## Week 3 — Frontend Quality

Learn:
- React Testing Library,
- user-focused tests,
- Mock Service Worker,
- accessibility checks,
- frontend integration tests.

## Week 4 — E2E and Engineering Hygiene

Learn:
- Playwright,
- critical-user-flow tests,
- linting,
- formatting,
- pre-commit hooks,
- code review,
- dependency updates,
- useful coverage—not coverage chasing.

### Month 14 Gate

Break a feature deliberately and show which automated test catches it.

---

# PHASE 5 — PRODUCTION ENGINEERING

# Month 15 — Linux, Docker, Networking, Observability

## Week 1 — Linux

Learn:
- filesystem,
- users/groups,
- permissions,
- processes,
- signals,
- services,
- SSH,
- package management,
- networking tools,
- logs.

## Week 2 — Docker

Learn:
- images,
- containers,
- Dockerfile,
- layers,
- build context,
- volumes,
- networks,
- environment variables.

## Week 3 — Docker Compose and Production Images

Containerize:
- frontend,
- backend,
- PostgreSQL,
- Redis.

Learn:
- multi-stage builds,
- non-root containers,
- health checks,
- startup ordering,
- persistence,
- configuration.

## Week 4 — Observability

Learn:
- structured logs,
- log levels,
- request correlation,
- metrics,
- traces conceptually,
- health/readiness checks,
- error reporting,
- dashboards,
- alerting principles.

### Month 15 Gate

Given a failing containerized system, diagnose whether the problem is frontend, network, backend, database, configuration, or infrastructure.

---

# Month 16 — CI/CD and AWS

## Week 1 — CI

With GitHub Actions:

commit/PR  
→ lint  
→ type check  
→ unit tests  
→ integration tests  
→ build

## Week 2 — CD and Deployment Safety

Learn:
- artifacts/images,
- environment promotion,
- deployment configuration,
- migrations during deployment,
- rollback,
- secret handling,
- release tags.

## Week 3 — AWS Fundamentals

Understand:
- IAM,
- compute,
- storage,
- managed databases,
- networking/VPC basics,
- DNS,
- CDN concepts,
- monitoring.

Practical subset:
- application compute/container hosting,
- RDS PostgreSQL,
- S3,
- IAM,
- DNS/HTTPS,
- CloudWatch or equivalent observability.

## Week 4 — Production Deployment

Deploy the Month-12 application.

You must be able to:
- configure DNS,
- enable HTTPS,
- manage environment variables/secrets,
- run migrations,
- inspect logs,
- restart/redeploy,
- roll back,
- troubleshoot a failed release.

### Month 16 Gate

A fresh commit can pass CI and reach production through a repeatable deployment process.

---

# PHASE 6 — ADVANCED ENGINEERING AND SYSTEM DESIGN

# Month 17 — Performance, Background Work, Distributed-System Thinking

## Week 1 — Performance Engineering

Learn:
- measurement first,
- latency vs throughput,
- frontend performance,
- API profiling,
- query profiling,
- connection pools,
- caching,
- CDN concepts,
- load testing.

## Week 2 — Background Processing

Learn:
- job queues,
- workers,
- retries,
- exponential backoff,
- idempotency,
- dead-letter queues,
- scheduled jobs.

Implement one real background workflow.

## Week 3 — Real-Time and Event-Driven Concepts

Learn:
- WebSockets,
- Server-Sent Events concept,
- Pub/Sub,
- events,
- delivery guarantees,
- duplicate events,
- ordering,
- eventual consistency.

Implement real-time functionality only when the product use case needs it.

## Week 4 — System Design and Architecture

Learn:
- vertical/horizontal scaling,
- load balancing,
- stateless services,
- database scaling concepts,
- replication concepts,
- caching layers,
- modular monolith,
- service boundaries,
- microservices trade-offs,
- dependency injection,
- SOLID,
- design patterns,
- failure modes.

### React Framework Literacy

At this stage, learn the concepts behind modern React frameworks:
- CSR,
- SSR,
- prerendering/static generation,
- hydration,
- server/client boundaries,
- routing/data-loading architectures.

Build one small framework-based experiment. Do not replace FastAPI unless there is a reason.

### Month 17 Gate

Given a system-design problem, start with the simplest architecture and justify every added component.

---

# PHASE 7 — CAPSTONE

# Month 18 — Production Master Project

This is the core-program examination.

Build a serious application from a blank repository.

## Week 1 — Discovery and Design

Produce:
- requirements,
- user stories,
- non-functional requirements,
- wireframes,
- database schema,
- API specification,
- architecture diagram,
- threat model,
- test strategy,
- deployment plan.

## Week 2 — Backend

Implement:
- FastAPI,
- PostgreSQL,
- SQLAlchemy,
- migrations,
- authentication,
- authorization,
- Redis where justified,
- background processing,
- logging,
- tests.

## Week 3 — Frontend

Implement:
- React,
- TypeScript,
- routing,
- TanStack Query,
- forms,
- validation,
- state architecture,
- responsive UI,
- accessibility,
- error handling,
- tests.

Use Redux Toolkit only if the application contains a genuine global-client-state problem that warrants it.

## Week 4 — Production

Implement:
- Docker,
- CI/CD,
- cloud deployment,
- HTTPS,
- secrets,
- migrations,
- monitoring,
- alerts,
- backups strategy,
- load testing,
- performance analysis,
- security review,
- documentation.

### Final Incident Drill

Simulate production failures:
- frontend exception,
- API 500,
- database unavailable,
- slow query,
- stale cache,
- expired/invalid auth,
- failed background job,
- bad deployment configuration.

For each:
1. reproduce,
2. observe,
3. form hypotheses,
4. inspect evidence,
5. find root cause,
6. fix,
7. write regression test,
8. deploy,
9. monitor.

---

# 5. Project Progression — Fewer, Deeper Projects

## Project 1 — Accessible Portfolio
**Stack:** HTML + CSS

## Project 2 — Vanilla JavaScript Application
**Stack:** HTML + CSS + JavaScript + external API

## Project 3 — TypeScript Application
**Stack:** TypeScript + Vite

## Project 4 — React Application
**Stack:** React + TypeScript + Router + tests

## Project 5 — Python CLI
**Stack:** Python + pytest

## Project 6 — Backend System
**Stack:** FastAPI + PostgreSQL + SQLAlchemy + Alembic + Redis + tests

## Project 7 — Evolving Full-Stack Product
**Stack:** React + TypeScript + TanStack Query + FastAPI + PostgreSQL + Redis

Keep improving this project through:
- security,
- testing,
- Docker,
- CI/CD,
- AWS,
- observability,
- background jobs,
- performance.

## Project 8 — Independent Capstone
Built from zero with no tutorial architecture.

---

# 6. Technology Priority

## Must Master

### Web / Frontend
- HTML
- semantic HTML
- accessibility
- CSS
- responsive design
- JavaScript
- browser APIs
- HTTP
- TypeScript
- React
- React Router
- TanStack Query
- forms/validation
- frontend testing

### Backend
- Python
- typing
- async fundamentals
- FastAPI
- Pydantic
- REST/API design
- PostgreSQL
- SQL
- SQLAlchemy
- Alembic
- Redis
- backend/API testing

### Production
- Git/GitHub
- Linux
- Docker
- Docker Compose
- CI/CD
- DNS
- HTTPS
- cloud fundamentals
- logging
- metrics
- deployment
- debugging
- security

## Must Understand Well, Use When Needed

- Redux Toolkit
- background-job framework
- WebSockets
- Nginx/reverse proxies
- OpenTelemetry concepts
- React framework/SSR concepts
- MongoDB
- message queues
- event-driven architecture
- microservices

## Optional Until a Real Need Appears

- Kubernetes
- Kafka
- GraphQL
- Elasticsearch/OpenSearch
- advanced NoSQL systems
- service mesh
- multi-region architecture

Do not turn optional infrastructure into beginner prerequisites.

---

# 7. Definition of Done for Every Major Topic

Before moving on, answer mostly “yes”:

## Knowledge
- Can I explain what it is?
- Can I explain what problem it solves?
- Can I explain its trade-offs?

## Implementation
- Can I build a feature without copying a tutorial?
- Can I read the official documentation?
- Can I debug common failures?

## Integration
- Can I connect it to the rest of the stack?
- Can I identify its boundaries and dependencies?

## Quality
- Can I test it?
- Can I handle errors?
- Can I refactor it without fear?

## Security
- Do I know the main risks it introduces?
- Can I prevent obvious misuse?

## Production
- Can I configure it?
- Can I deploy it?
- Can I observe it?
- Can I troubleshoot it?

## Design
- Can I explain when NOT to use it?

If not, do focused remediation before progressing.

---

# 8. Monthly Review Exam

At the end of each month:

1. **Closed-book explanation** — Explain the major concepts aloud.
2. **Independent build** — Implement a small feature with documentation only.
3. **Debugging challenge** — Fix intentionally broken code.
4. **Code review** — Refactor one older feature.
5. **Testing challenge** — Add useful regression coverage.
6. **Architecture question** — Explain one design decision and an alternative.
7. **Retrospective** — Record weak areas and schedule review.

Do not repeat an entire month because one detail is weak. Repair the weak prerequisite deliberately.

---

# 9. AI-Era Engineering Skills

By the second half of the program, practice:

- using AI to explain unfamiliar code,
- asking for competing designs,
- reviewing diffs,
- generating test ideas,
- forming debugging hypotheses,
- analyzing logs,
- reviewing SQL,
- reviewing security assumptions,
- generating boilerplate you already understand,
- checking AI output against documentation,
- rejecting hallucinated APIs or unsafe suggestions.

Mastery criterion:

**AI should make you faster, not make you dependent.**

You must be able to review the generated code as if it came from a junior engineer.

---

# 10. After Month 18 — The Mastery Loop

Month 18 should make the goal **production-capable independent engineer**, not magically “finished master.”

Continue in repeated 8–12 week cycles.

Each cycle must include:

1. Build or own a non-trivial system.
2. Work with unfamiliar requirements.
3. Make an architecture decision under constraints.
4. Diagnose real or simulated incidents.
5. Measure and improve performance.
6. Upgrade dependencies safely.
7. Perform a security review.
8. Refactor an older subsystem.
9. Deploy and observe the system.
10. Explain trade-offs to another engineer.

Then broaden selectively:

- advanced PostgreSQL,
- distributed systems,
- messaging/Kafka,
- Kubernetes,
- deeper AWS,
- frontend performance,
- advanced React framework architecture,
- domain-driven design,
- security engineering,
- platform/SRE skills.

Mastery comes from repeated ownership of systems—not collecting technologies.

---

# 11. Final Standard

You are approaching full-stack mastery when you can receive:

> “Build a secure multi-user project-management platform that must be maintainable, observable, and able to grow.”

and independently produce:

Requirements  
→ architecture  
→ database schema  
→ API contract  
→ frontend architecture  
→ authentication/authorization  
→ implementation  
→ automated tests  
→ containers  
→ CI/CD  
→ cloud deployment  
→ observability  
→ incident response  
→ performance analysis  
→ security review  
→ scaling plan

You should also be able to explain **why** each major decision was made, what alternative you rejected, what can fail, and how you would detect and recover from that failure.

That—not the number of libraries memorized—is the target.
