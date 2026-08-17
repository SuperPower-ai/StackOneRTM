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
