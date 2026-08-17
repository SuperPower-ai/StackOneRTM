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
