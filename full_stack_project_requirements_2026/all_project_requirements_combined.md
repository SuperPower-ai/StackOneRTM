# Full-Stack Mastery Journey — Complete Project Requirements

> Combined edition of all project specifications. Each individual project is also available as its own Markdown file.



---

# Project 01 — Accessible Responsive Portfolio

## Main goal

Build a professional multi-section website using only **HTML and CSS**.

This project trains the foundations that React and every other frontend tool eventually depend on: semantic HTML, CSS layout, responsive design, accessibility, browser DevTools, Git basics, and deployment.

Do **not** use React, Tailwind, Bootstrap, or a component library.

## 1. Product requirements

Create a personal developer portfolio website containing:

### Navigation
- Name or logo.
- Links to major sections.
- Keyboard accessible.
- Usable on mobile.

### Hero
- Name.
- Short role description.
- Primary CTA.
- Secondary CTA.

### About
- Short introduction.
- Current learning focus.
- Technical interests.

### Skills
Group skills logically. Do not use fake percentage bars such as “JavaScript 95%.”

### Projects
Show at least **3 project cards**, each with:
- name,
- short description,
- technologies,
- image/visual placeholder,
- repository link,
- live-demo link when available.

### Contact
Include:
- name,
- email,
- message,
- submit button.

No backend is required yet.

### Footer
Include professional/profile links.

## 2. HTML requirements

Use semantic HTML correctly. Appropriate elements include:
- `header`
- `nav`
- `main`
- `section`
- `article`
- `footer`
- `form`
- `label`
- `input`
- `textarea`
- `button`

Requirements:
- One clear page-level `h1`.
- Logical heading hierarchy.
- Real labels for form controls.
- Correct `alt` text.
- Descriptive links.
- Buttons for actions; links for navigation.

## 3. CSS requirements

Demonstrate:
- box model,
- cascade,
- specificity,
- inheritance,
- typography,
- Flexbox,
- Grid,
- positioning,
- responsive design,
- media queries.

Use reusable CSS and custom properties where useful. Avoid repetitive declarations.

## 4. Accessibility requirements

A keyboard-only user must be able to:
- reach all links,
- reach all form controls,
- see visible focus,
- use the full site.

Check:
- contrast,
- headings,
- form labels,
- focus states,
- semantic elements.

Do not use ARIA to repair HTML that could have been semantic.

## 5. Responsive requirements

Test approximately:
- 375 px,
- 768 px,
- 1024 px,
- large desktop.

No normal screen size should show overlapping content or horizontal scrolling.

## 6. Git requirements

Use Git from the beginning:
- initialize repository,
- `.gitignore`,
- small meaningful commits,
- push to GitHub.

Do not make one giant final commit.

## 7. Debugging requirements

Use DevTools to solve at least:
- one layout problem,
- one responsive problem,
- one cascade/specificity problem.

Add a short **Debugging lessons** section to the README.

## 8. Documentation

README:
- purpose,
- screenshot,
- features,
- technologies,
- local run instructions,
- accessibility notes,
- responsive-design notes,
- lessons learned.

## 9. Deployment

Deploy publicly. Verify:
- no broken assets,
- mobile works,
- HTTPS is enabled by the host.

## 10. Forbidden shortcuts

Do not use:
- React/Vue/Angular,
- Tailwind/Bootstrap,
- UI component libraries,
- copied portfolio templates.

## 11. Optional stretch goals

Only after requirements are complete:
- dark mode,
- reduced-motion support,
- print stylesheet,
- custom 404 page.

## 12. Definition of Done

- [ ] Rebuild the structure without a tutorial.
- [ ] Explain semantic HTML.
- [ ] Explain Flexbox vs Grid.
- [ ] Explain cascade and specificity.
- [ ] Make the site responsive.
- [ ] Navigate everything by keyboard.
- [ ] Fix layout problems with DevTools.
- [ ] Use Git naturally.
- [ ] Deploy the site.
- [ ] Explain every major HTML/CSS decision.


---

# Project 02 — Vanilla JavaScript Application

## Main goal

Build a real browser application without React.

Recommended product: **Movie / Product / Book Explorer + Personal Collection**.

The domain is flexible. The project must combine DOM manipulation, forms, state, local persistence, external API requests, async JavaScript, loading/error/empty states, testing, and debugging.

## 1. Core user stories

A user can:
- search remote data,
- view results,
- open details,
- save an item,
- remove an item,
- update a simple status/category,
- filter saved items,
- sort saved items,
- refresh without losing local saved data.

## 2. Required UI areas

### Search
- input,
- search action,
- clear action,
- validation against empty/whitespace input.

### Results
Show useful item data and actions to view/save.

### Details
Show richer information for one item.

### Saved collection
Support add, remove, update status/category, filter, and sort.

## 3. JavaScript requirements

Demonstrate:
- functions with clear responsibilities,
- arrays/objects,
- `map`, `filter`, `find`, `some`, `sort`,
- destructuring,
- spread syntax,
- modules,
- DOM creation/update,
- events,
- event bubbling,
- forms.

Suggested organization:

```text
src/
  api.js
  storage.js
  state.js
  ui.js
  main.js
```

Do not use one giant script.

## 4. Async / HTTP requirements

Use a real public API.

Handle:
- loading,
- success,
- empty results,
- bad input,
- network failure,
- non-2xx API response.

Use:
- `fetch`,
- promises,
- `async/await`,
- `try/catch`.

Do not silently ignore errors.

## 5. Application state

Keep a simple state model such as:

```text
state
  query
  results
  savedItems
  loading
  error
```

You do not need a state library.

## 6. Persistence

Use `localStorage`.

Handle:
- missing data,
- malformed stored data,
- loading at startup,
- saving after changes.

## 7. UI requirements

Reuse Project 01 skills:
- responsive,
- keyboard usable,
- clear loading state,
- useful errors,
- empty states.

## 8. Testing

Add tests for logic that does not require the DOM:
- filtering,
- sorting,
- formatting,
- validation,
- state transformation.

Include at least one regression test after fixing a real bug.

## 9. Debugging

Use:
- console,
- breakpoints,
- Network tab.

Document at least **2 real bugs**:
- symptom,
- hypothesis,
- evidence,
- root cause,
- fix.

## 10. Git

Use feature branches for at least two features. Practice merging and clear commits.

## 11. Documentation

README:
- problem,
- features,
- API,
- architecture,
- project structure,
- run instructions,
- tests,
- limitations,
- debugging lessons.

## 12. Forbidden shortcuts

Do not use React, Vue, Angular, Redux, TanStack Query, or jQuery.

## 13. Stretch goals

- `AbortController`,
- pagination,
- favorites,
- debounce,
- URL query parameters,
- theme preference.

## 14. Definition of Done

- [ ] Build DOM interactions without tutorial copying.
- [ ] Explain event bubbling.
- [ ] Explain promises and `async/await`.
- [ ] Explain an HTTP request.
- [ ] Handle loading/error/empty states.
- [ ] Persist local data.
- [ ] Organize modules.
- [ ] Debug with browser tools.
- [ ] Write useful tests.
- [ ] Explain the application's state flow.


---

# Project 03 — TypeScript Application

## Main goal

Take Project 02 and redesign it in **TypeScript + Vite**.

This is not a mechanical migration. You are learning to model data, make invalid states harder to represent, and use the compiler as an engineering tool.

## 1. Product baseline

Keep:
- remote search,
- results,
- details,
- saved collection,
- filters/sorting,
- local persistence,
- error/loading states.

## 2. TypeScript requirements

Type:
- external API responses,
- internal models,
- function inputs/outputs,
- DOM references where needed,
- application state,
- storage format,
- error/result structures.

## 3. Data modeling

Separate external and internal shapes when needed.

Example:

```text
RemoteMovie
    ↓ transform
Movie
    ↓
SavedMovie
```

**External data is not automatically trusted application data.**

## 4. Concepts to demonstrate

Use naturally:
- inference,
- explicit function types,
- interfaces/type aliases,
- unions,
- literal types,
- optional properties,
- generics,
- narrowing,
- type guards,
- `unknown`,
- utility types,
- discriminated unions.

Do not force concepts where they make the code worse.

## 5. State/error modeling

Prefer explicit states such as:

```text
idle
loading
success
error
```

over unrelated booleans that can form impossible combinations.

Explain why your design is safer.

## 6. `any` rule

Target **zero unjustified `any`**.

If `any` exists, document why and what safer alternative you considered.

Prefer `unknown` at uncertain boundaries.

## 7. Runtime validation awareness

Understand:

> TypeScript types disappear at runtime.

Validate important external data before trusting it. Write a small guard/validator where useful.

## 8. Tooling

Use:
- Vite,
- npm scripts,
- TypeScript compiler,
- ESLint,
- formatter,
- tests.

Add scripts for:
- development,
- build,
- typecheck,
- lint,
- test.

Production build must pass with no TypeScript errors.

## 9. Refactoring

Improve at least **3 design problems** from Project 02:
- oversized functions,
- duplication,
- weak error handling,
- mixed UI/API concerns,
- ambiguous data shapes.

Document the reasoning.

## 10. Tests

Keep existing tests and add tests for:
- transformation,
- validation/type guards,
- error-state logic.

## 11. Definition of Done

- [ ] Explain TypeScript vs JavaScript.
- [ ] Model an API response.
- [ ] Transform external data into internal models.
- [ ] Use unions/narrowing correctly.
- [ ] Use generics without copying.
- [ ] Avoid unjustified `any`.
- [ ] Explain compile-time vs runtime validation.
- [ ] Pass typecheck/lint/test/build.
- [ ] Explain how TypeScript improved the design.


---

# Project 04 — React Admin Dashboard

## Main goal

Build a production-style frontend using:

- React,
- TypeScript,
- Vite,
- React Router,
- TanStack Query,
- React Hook Form,
- Zod,
- testing tools.

Redux Toolkit is **conditional**. Use it only if you have a genuine complex global client-state problem.

Recommended domain: **Operations / Inventory / Project Management Admin Dashboard**.

Use a mock or public API first. The real FastAPI backend comes later.

## 1. Required pages

### Login mock
- email/password,
- validation,
- loading,
- simulated success/failure.

### Dashboard
- summary cards,
- recent activity,
- table/list,
- at least one derived metric.

### Entity list
Support:
- pagination,
- search,
- filter,
- sorting,
- loading,
- errors,
- empty state.

### Entity details
Show a single record.

### Create/Edit
- typed form,
- validation,
- field-level messages,
- simulated server error,
- loading/disabled submit state.

### Not Found/Error
No known failure should produce a blank screen.

## 2. Component architecture

Separate:
- pages,
- reusable UI,
- feature components,
- data/API code.

Avoid oversized components and premature abstractions.

## 3. React requirements

Demonstrate:
- props,
- state,
- composition,
- controlled inputs,
- conditional rendering,
- list keys,
- `useState`,
- `useEffect`,
- `useContext`,
- `useReducer` where useful,
- refs,
- custom hooks.

Do not use `useEffect` for values that can be derived during rendering.

## 4. Routing

Use React Router:
- nested routes,
- params,
- 404,
- layout route,
- protected-route UI concept.

## 5. Server state

Use TanStack Query for remote data:
- query keys,
- list query,
- detail query,
- mutation,
- invalidation,
- refetching,
- pagination,
- loading/error.

Use optimistic updates only when they improve the UX.

Explain:
- server state,
- cached state,
- stale state,
- client state.

## 6. Forms

Use React Hook Form + Zod:
- create,
- edit,
- required/optional fields,
- useful messages,
- server errors.

## 7. State architecture

Classify important state:
- local UI,
- URL,
- Context,
- server,
- global client.

Create `STATE_ARCHITECTURE.md`.

### Redux rule

If you add Redux Toolkit, document:
- exact problem,
- why simpler state approaches are insufficient.

Do not put ordinary server data into Redux without a reason.

## 8. Accessibility

Required:
- keyboard navigation,
- labels,
- visible focus,
- accessible dialogs if present,
- meaningful errors,
- semantic tables when used.

## 9. Testing

Use React Testing Library.

Test:
- one form flow,
- one loading → success flow,
- one error flow,
- one important interaction.

Use Mock Service Worker or equivalent for API mocking.

## 10. Performance

Investigate:
- rerenders,
- route-level code splitting,
- loading behavior,
- bundle basics.

Measure before adding memoization.

## 11. Quality

Set up:
- lint,
- format,
- typecheck,
- tests.

Everything should pass before a feature is considered done.

## 12. Documentation

README:
- screenshots,
- user flows,
- architecture,
- state decisions,
- routes,
- API mocking,
- tests,
- accessibility,
- trade-offs.

## 13. Definition of Done

- [ ] Build React pages without tutorial copying.
- [ ] Explain component boundaries.
- [ ] Explain local vs server state.
- [ ] Use TanStack Query intentionally.
- [ ] Build typed runtime-validated forms.
- [ ] Explain when Redux is unnecessary.
- [ ] Test user behavior.
- [ ] Handle loading/empty/error states.
- [ ] Debug React problems.
- [ ] Explain frontend architecture from memory.


---

# Project 05 — Tested Python CLI

## Main goal

Build a command-line application that proves you understand Python as a language and engineering environment—not just FastAPI syntax.

Recommended product: **Personal Task / Issue Tracker CLI**.

Persist data in a local JSON file initially.

## 1. Required commands

Support commands equivalent to:
- create,
- list,
- show,
- update,
- delete,
- search,
- filter,
- complete/close.

## 2. Data model

Each item should include fields such as:
- id,
- title,
- description,
- status,
- priority,
- created_at,
- updated_at.

Optional:
- due date,
- tags.

Use type hints.

## 3. Python requirements

Demonstrate:
- functions,
- modules/packages,
- lists/dictionaries/sets,
- comprehensions,
- exceptions,
- classes where useful,
- composition,
- dataclasses where appropriate,
- iterators/generators in one sensible use,
- context managers,
- file handling,
- JSON,
- type hints.

Do not force OOP everywhere.

## 4. Structure

Separate responsibilities.

Example:

```text
src/
  models.py
  repository.py
  services.py
  cli.py
tests/
```

Your exact structure can differ.

**CLI input/output should not contain all business logic.**

## 5. Persistence

Implement JSON storage.

Handle:
- missing file,
- empty file,
- malformed data,
- write failure.

Use safe write behavior where practical.

## 6. Validation

Reject invalid data clearly:
- empty title,
- invalid priority/status,
- nonexistent ID.

Expected user mistakes should not end in unreadable tracebacks.

## 7. Exceptions

Understand:
- when to raise,
- when to catch,
- when a programmer error should fail loudly.

Do not wrap every line in `try/except`.

## 8. Testing

Use pytest.

Required tests:
- create,
- update,
- delete,
- search/filter,
- invalid data,
- missing record,
- persistence.

Use fixtures where helpful.

Add at least one regression test after a real bug.

## 9. Modern Python tooling

Use:
- `pyproject.toml`,
- project/virtual environment management,
- `uv`,
- Ruff,
- pytest,
- type checking if included in your setup.

Have commands/scripts for:
- run,
- lint,
- test.

## 10. Logging

Add basic logging for:
- application start,
- storage failures,
- unexpected errors.

Do not log sensitive information.

## 11. Documentation

README:
- install,
- run,
- example commands,
- project structure,
- tests,
- decisions,
- limitations.

## 12. Refactoring exercise

After the first working version, refactor one ugly area without changing behavior.

Document:
- original problem,
- new design,
- why it is better.

Tests should protect the behavior.

## 13. Definition of Done

- [ ] Write Python without translating JavaScript line-by-line.
- [ ] Organize a multi-module project.
- [ ] Use type hints.
- [ ] Use exceptions intentionally.
- [ ] Test business logic with pytest.
- [ ] Use fixtures.
- [ ] Read/write persistence safely.
- [ ] Refactor while tests stay green.
- [ ] Explain when a class is useful.
- [ ] Use modern Python tooling.


---

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


---

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


---

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
