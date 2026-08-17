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
