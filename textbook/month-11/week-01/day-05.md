# Month 11 · Week 1 · Day 5
# Tests Against a Test Database (and Rollback Fixtures)

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 3 — Python and backend  
**Month index:** [../../README.md](../../README.md)  
**Week 1:** [1](day-01.md) · [2](day-02.md) · [3](day-03.md) · [4](day-04.md) · Day 5 (today) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Tests and docs  
**Student state:** You have list/get with `select()` and an N+1 story. Today you **prove** repository behavior against **PostgreSQL that is not your lab toy data** — a **test database** and/or a **transaction that rolls back**.  
**Study time:** 3–4 focused hours

Labs: `~\fullstack-lab\month-11\week-01\day-05\`. You may type a **small** rooms/desks app again (do not import Day 4 as a hidden package if that makes pytest paths miserable). Do **not** point tests at `~/ops-api` production data.

---

## How to use this textbook

1. Tests that use the database you also click around in will **fight you**. Make a **second** database.  
2. A test you did not run is a wish. `uv run pytest -q`.  
3. CONTRACT.md still matters: statuses and JSON, not only SQLAlchemy internals.  
4. Optional review links are for later rechecking.

---

## How to read this chapter

Month 9 reset a **dict** in a fixture. Month 11 must reset **rows**. Two honest strategies:

1. **Dedicated test database** (`month11_test`): `create_all` (this week) or Alembic (next week) once per session; **truncate** or drop/create between tests if needed.  
2. **Transactional rollback:** open a connection, `BEGIN`, bind a Session to that connection, run the test, **rollback** — the next test sees empty tables without DROP.

```mermaid
flowchart TB
  PYTEST[pytest] --> FIX[fixture Session]
  FIX --> TX[transaction on test DB]
  TX --> APP[TestClient HTTP]
  APP --> SEL[select / IntegrityError]
  SEL --> RB[rollback]
  RB --> NEXT[next test: clean tables]
```

**Wrong belief:** “I’ll test against `month11_w1d4` and delete rows in `finally`.”  
**Correct:** delete-in-finally fails when the test crashes first. Rollback fixtures and a **named test database** are the habit 6B needs.

**Wrong belief:** “I’ll mock the Session so tests are fast.”  
**Correct:** unit-test pure functions all you want. **Constraint and N+1 and 404** tests need a real engine. Mocking SQLAlchemy to always return a list teaches you nothing Month 10 did not already risk.

---

## Today's contract

By the end of this day you will be able to:

1. Create `month11_test` (or similar) and point tests at `TEST_DATABASE_URL`.  
2. Write a pytest fixture that yields a **Session** and **rolls back**.  
3. Override FastAPI `get_session` so **TestClient** uses that Session.  
4. Assert HTTP **200 / 404** and at least one **IntegrityError** (orphan) at the DB layer.  
5. Document in `TESTS.md` why production URL is not the test URL.  
6. Keep using `select()` and Pydantic **`model_dump`** (if you dump), never `.dict()`.

**Today's gate.** Closed-book:

> Tests use a test database. A rollback fixture isolates rows. TestClient still speaks HTTP. I override the Session dependency. I never commit leftover junk into the database I use for manual curl.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 40 | Theory |
| B | 70 | Type-along: fixture + TestClient + 404 test |
| C | 55 | Independent: orphan test + isolation proof |
| D | 15 | Git |
| E | 15 | Recall |

---

# Block A — Theory

## 1. Why a test database

`create_all` and seeds in Day 4 left rows with ids 1, 2, 3. Tests that `assert body[0]["id"] == 1` will flake when you seed again. Worse: a test that `DELETE FROM rooms` will wreck the demo you still wanted to `curl.exe`.

**`TEST_DATABASE_URL`** is a different database on the same PostgreSQL, same user, empty on purpose.

```powershell
psql -U postgres -c "CREATE DATABASE month11_test;"
```

`.env.example`:

```text
DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@127.0.0.1:5432/month11_w1d5
TEST_DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@127.0.0.1:5432/month11_test
```

pytest reads `TEST_DATABASE_URL`. Uvicorn reads `DATABASE_URL`. If they are equal, you failed the day even if tests are green.

---

## 2. Rollback fixture (core)

```python
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from models import Base

TEST_URL = ...  # from env


@pytest.fixture
def engine():
    eng = create_engine(TEST_URL, echo=False)
    Base.metadata.create_all(eng)
    yield eng
    # optional: Base.metadata.drop_all(eng) at end of session — not required if you always rollback


@pytest.fixture
def session(engine):
    connection = engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()
```

Each test gets a Session whose work is **rolled back**. Inserts are visible **inside** the test. The next test does not see them.

**Nested transactions / savepoints:** if the code under test calls `session.commit()`, it may commit the **outer** transaction and isolation dies. Patterns:

- Prefer the code under test **not** commit when the fixture owns the transaction — inject a Session and let the fixture commit/rollback.  
- Or use a savepoint: `nested = connection.begin_nested()` and after each `commit` from the app, `begin_nested()` again (the “join the transaction” pattern).

For Day 5, the cleanest teaching path: **handlers receive the fixture Session** and your test `get_session` **does not commit** (the fixture rolls back). Production `get_session` still commits. Two functions, or a parameter. Write the choice in `TESTS.md`.

**Wrong belief:** “I’ll `TRUNCATE rooms CASCADE` in autouse.”  
**Correct:** TRUNCATE works but is slower and easy to point at the wrong DB. Rollback is the first skill. TRUNCATE is allowed if you document it and assert you are on `month11_test`.

---

## 3. TestClient + dependency override

```python
from fastapi.testclient import TestClient
from main import app, get_session


@pytest.fixture
def client(session):
    def _override() -> Session:
        yield session

    app.dependency_overrides[get_session] = _override
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
```

If you forget `clear()`, the next test file may reuse a closed Session. Month 9 already taught overrides for repos. Same seatbelt.

HTTP assertions:

```python
def test_missing_room_404(client: TestClient) -> None:
    r = client.get("/rooms/999")
    assert r.status_code == 404
    assert "detail" in r.json()
```

Seed **inside the test** (or a `room` fixture that `session.add` + `session.flush()` so the id exists). Do not depend on Day 4 seed.

---

## 4. What to assert (minimum)

| Case | Assert |
|---|---|
| GET empty list | 200 and `[]` (or envelope you documented) |
| GET one after insert | 200, fields |
| GET missing | 404, `detail` |
| GET `/rooms/abc` | 422 |
| Orphan bin/desk at Session layer | `pytest.raises(IntegrityError)` then rollback already handled |
| Two tests both create “Hall A” | both pass — isolation |

Do not assert exact echo SQL strings. They change. Do not snapshot OpenAPI.

N+1: you **may** count queries with `engine.sync_engine` events or `echo` capture — optional stretch. A simple way: `sqlalchemy.event` listen `after_cursor_execute` and append to a list. Not required if time is short; `TESTS.md` should still **explain** how you would catch N+1 in CI later.

---

## 5. Docs you write today

`CONTRACT.md` — even for the lab: list/get statuses.

`TESTS.md` — test URL, rollback vs truncate, override, why commit in the app is dangerous inside this fixture.

`.env.example` — placeholders, no real password.

---

# Block B — Type-along

```powershell
cd ~\fullstack-lab
mkdir month-11\week-01\day-05 -Force
cd ~\fullstack-lab\month-11\week-01\day-05
uv init --name lab-room-tests
uv add fastapi uvicorn sqlalchemy "psycopg[binary]" pydantic
uv add --dev pytest httpx
psql -U postgres -c "CREATE DATABASE month11_w1d5;"
psql -U postgres -c "CREATE DATABASE month11_test;"
```

Tiny app: health, GET `/rooms`, GET `/rooms/{id}`, models Room/Desk, `selectinload` on list (you already know why). `create_all` on both engines when needed.

`tests/conftest.py`: engine, session rollback, client override.

`tests/test_rooms.py`:

1. `test_list_empty`  
2. `test_create_via_session_then_get` (add in fixture session, flush, GET)  
3. `test_get_missing_404`  
4. `test_list_includes_desks_after_seed`

```powershell
uv run pytest -q
```

Write `TESTS.md`.

---

# Block C — Independent

1. `test_orphan_desk_raises` using `session.add(Desk(..., room_id=99999))` + `session.flush()` + `pytest.raises`.  
2. Two tests that insert a room with the **same** `name` unique constraint **if** you add `unique=True` on `Room.name` — both must pass (isolation). If you did not add unique, write why both inserts would succeed even without rollback — then add unique **or** use a fixed `id` assert that would flake without rollback.  
3. Prove isolation: test A inserts room “Zed”; test B `GET /rooms` empty (or not containing Zed) **without** depending on test order. If B sees Zed, your fixture committed. Fix it. Write `ISOLATION.txt`.  
4. Break the 404 test (assert 200); show fail; restore. Paste snippet into `FAIL.txt`.

Do not hit Redis. Do not drop the user’s `postgres` database.

```powershell
cd ~\fullstack-lab
git add month-11
git commit -m "Month 11 Day 5: test database and rollback Session fixture."
```

---

# Block E — Recall

1. Why `DATABASE_URL == TEST_DATABASE_URL` is a fail.  
2. Why `commit()` in the handler can break rollback fixtures.  
3. Why `dependency_overrides.clear()` exists.  
4. IntegrityError vs HTTP 404.  
5. Why mocking `session.scalars` is not an integration test.

## Office hours

**Tests pass, `month11_test` has rows afterward.** You committed. Rollback did not wrap the connection the app used — two engines, or override not applied.

**`queue pool limit`.** Sessions not closed. `finally: session.close()` / `connection.close()`.

**pytest cannot import `main`.** Run from the uv project root: `uv run pytest -q`.

**Windows env in pytest.** `conftest.py` should set URL in code from `os.environ.get` with a **test-only default that still is month11_test**, not the production name. Do not default to `month11_w1d4`.

**`create_all` every test is slow.** Engine fixture with `scope="session"` for `create_all` once; session fixture function-scoped with rollback. Document scope in `TESTS.md`.

**I used SQLite memory `sqlite:///:memory:` for speed.** Not this month’s integration story. PostgreSQL FKs and types are the point. SQLite will accept types Month 10 told you not to treat as real.

---

## Lecture: HTTP tests still catch status bugs

A test that only calls `session.scalars(select(Room)).all()` never notices you forgot `HTTPException`. TestClient GET `/rooms/999` does. Keep **both**: one IntegrityError unit-at-the-repo, several HTTP tests.

Pydantic Out: if the test asserts a key that is not on Out, you leaked via returning ORM. Fix Out, not the test.

`model_dump()` in tests is fine for comparing payloads. `.dict()` is not the v2 habit.

Alembic will replace `create_all` in Week 2 Day 5. The **fixture shape** (test URL, rollback, override) stays.

---

## Worked session — two URLs, one rollback

Two databases. App engine vs test engine. `conftest.py` connection.begin / Session / yield / rollback / close. Override `get_session`. TestClient 404. Seed in the test Session with `flush`. Isolation file. `uv run pytest -q`. No ops-api. No `Query()`.

If GET in TestClient does not see the flushed row, you overrode with a **different** Session than the one you inserted into. Same object.

---

## Definition of done

- [ ] `month11_test` exists and is what pytest uses  
- [ ] Rollback fixture (or documented TRUNCATE on test DB only)  
- [ ] TestClient 200 and 404 green  
- [ ] Isolation proof written  
- [ ] `TESTS.md` + `CONTRACT.md`  
- [ ] Overrides cleared  
- [ ] Commit exists; no passwords  

---

## Optional review links

- [SQLAlchemy testing recipes](https://docs.sqlalchemy.org/en/20/orm/session_transaction.html#joining-a-session-into-an-external-transaction-such-as-for-test-suites)  
- [FastAPI testing dependencies](https://fastapi.tiangolo.com/advanced/testing-dependencies/)  
- [pytest fixtures](https://docs.pytest.org/en/stable/explanation/fixtures.html)

---

## Tomorrow

**Independent:** map **your** Project 6 tables to SQLAlchemy models. This textbook will **not** write `~/ops-api/` for you. Day 5’s fixture ideas go with you.

---

# Closing lecture — the test database is part of the product

6B without `TEST_DATABASE_URL` will eventually pytest against the database you care about and you will restore from a backup you do not have.

Rollback is isolation. Override is how HTTP sees the same Session. `clear()` is how the next test lives. IntegrityError is the FK still on duty. 404 is still yours to raise.

`create_all` is this week’s schema installer. Week 2 you migrate instead. Do not skip tests until Alembic “feels ready.” The Session fixture is the harder habit.

Green pytest on a dict mock is Month 9. Green pytest on PostgreSQL is Month 11.
