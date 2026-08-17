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
