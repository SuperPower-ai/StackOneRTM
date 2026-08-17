# Month 11 · Week 2 · Day 5
# Test Database: Run Migrations in Tests

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 3 — Python and backend  
**Month index:** [../../README.md](../../README.md)  
**Week 2:** [1](day-01.md) · [2](day-02.md) · [3](day-03.md) · [4](day-04.md) · Day 5 (today) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Tests and docs  
**Student state:** You can expand/contract and upgrade/downgrade by hand. Today **pytest** applies the **same revisions** to a **test database**, so tests do not drift from `create_all`.  
**Study time:** 3–4 focused hours

Labs: `~\fullstack-lab\month-11\week-02\day-05\`. Small **notices** API (id, body, optional tag). Not 6B. Not Day 4 slots copy-paste as a package import if it fights you — type a thin cousin.

---

## How to use this textbook

1. Tests migrate `month11_w2d5_test` (name yours). They do **not** migrate the database you curl against unless you enjoy pain.  
2. `create_all` in tests is a **known shortcut** you are retiring for this lab.  
3. Optional review links are for later rechecking.

---

## How to read this chapter

If models say `tag` and tests `create_all` while 6B production is one revision behind, tests pass and production 500s. **Tests should upgrade Alembic** so the schema under TestClient is the schema in `versions/`.

```mermaid
flowchart TB
  PYTEST[pytest session] --> URL[TEST_DATABASE_URL]
  URL --> MIG[alembic upgrade head]
  MIG --> RB[rollback Session fixture]
  RB --> TC[TestClient]
```

**Wrong belief:** “`create_all` is faster so CI should use it.”  
**Correct:** speed that tests a **different schema** is a lie. Migrate. If it is slow, migrate once per test **session**, rollback per test.

**Wrong belief:** “I’ll point Alembic at the test DB by editing `alembic.ini` in the test.”  
**Correct:** tests set `DATABASE_URL` or `TEST_DATABASE_URL` **in process** before invoking Alembic. Do not rewrite `alembic.ini` on disk from pytest.

---

## Today's contract

By the end of this day you will be able to:

1. Keep `DATABASE_URL` and `TEST_DATABASE_URL` distinct.  
2. Run `alembic upgrade head` from pytest (session-scoped) against the test URL.  
3. Combine that with Week 1’s **rollback** Session fixture (or TRUNCATE on the test DB only).  
4. Override `get_session` for TestClient.  
5. Assert 200/404 and that a **migrated** column exists (e.g. `tag`).  
6. Document in `TESTS.md` how CI should run migrations.

**Today's gate.** Closed-book:

> Pytest applies Alembic to a test database, then uses a rollback (or truncate) fixture. TestClient hits that schema. I never create_all as the 6B test story. URLs are not mixed.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 40 | Theory |
| B | 70 | Type-along: migrate + fixture + two tests |
| C | 55 | Independent: fail if revision missing; isolation |
| D | 15 | Git |
| E | 15 | Recall |

---

# Block A — Theory

## 1. Invoking Alembic from Python

```python
from alembic.config import Config
from alembic import command

def run_migrations(url: str) -> None:
    cfg = Config("alembic.ini")
    cfg.set_main_option("sqlalchemy.url", url)
    command.upgrade(cfg, "head")
```

Run this from the **project directory** so `alembic.ini` and `script_location` resolve. `uv run pytest` from the uv project root.

If `env.py` **overrides** URL from `os.environ["DATABASE_URL"]`, set that env var to the **test** URL in the fixture **before** `command.upgrade`. Two sources of truth will migrate the wrong database. Prefer env.py reading one variable, and tests assign it.

**Wrong belief:** “I’ll subprocess `uv run alembic upgrade head` without changing URL.”  
**Correct:** that migrates whatever the developer’s shell has. Fixtures must force the test URL.

## 2. Session scope vs function scope

```python
@pytest.fixture(scope="session")
def migrated_engine():
    url = os.environ["TEST_DATABASE_URL"]
    os.environ["DATABASE_URL"] = url  # if env.py reads this
    run_migrations(url)
    engine = create_engine(url)
    yield engine
    engine.dispose()
```

Function-scoped Session: bind to a connection with `begin()` / rollback as Week 1 Day 5.

If `command.upgrade` is inside each test, you will be sad. Once per session is enough **if** tests roll back data. DDL from a test that creates extra tables is out of scope — do not.

## 3. When the app still `create_all`s

If `main.py` calls `create_all` on import, tests will fight Alembic. **Remove** startup `create_all` in this lab. Seed is a script you run after upgrade, not import-time DDL.

## 4. Assertions that prove migrations ran

- `SELECT tag FROM notices` works (column from a revision, not only the first table).  
- A test that uses `inspect(engine).get_columns("notices")` and asserts `tag` in names.  
- HTTP GET returns the field from Out (`model_dump` if you compare dicts).

Do not assert revision ids as frozen hex in tests — `alembic_version` can be `SELECT version_num` equals `command.current` if you want, optional stretch.

## 5. IntegrityError still exists

Migrated FKs still raise. HTTP still maps to 404/409 **you** choose. Tests still use TestClient for statuses.

---

# Block B — Type-along

```powershell
cd ~\fullstack-lab
mkdir month-11\week-02\day-05 -Force
cd ~\fullstack-lab\month-11\week-02\day-05
uv init --name lab-mig-tests
uv add fastapi uvicorn sqlalchemy "psycopg[binary]" alembic pydantic
uv add --dev pytest httpx
psql -U postgres -c "CREATE DATABASE month11_w2d5;"
psql -U postgres -c "CREATE DATABASE month11_w2d5_test;"
```

`.env.example`:

```text
DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@127.0.0.1:5432/month11_w2d5
TEST_DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@127.0.0.1:5432/month11_w2d5_test
```

Alembic chain:

1. create `notices(id, body)`  
2. add `tag` nullable  

Models match head. FastAPI GET list/get, POST 201. `select()`. Session Depends.

`tests/conftest.py`: set test URL, `command.upgrade`, engine, rollback session, TestClient override, `dependency_overrides.clear()`.

Tests:

1. `test_health`  
2. `test_post_and_get`  
3. `test_get_missing_404`  
4. `test_tag_column_exists` via inspect or POST with tag  

```powershell
$env:TEST_DATABASE_URL = "postgresql+psycopg://postgres:YOUR_PASSWORD@127.0.0.1:5432/month11_w2d5_test"
$env:DATABASE_URL = $env:TEST_DATABASE_URL
uv run pytest -q
```

Write `TESTS.md`. Confirm `month11_w2d5` (dev) was **not** required for pytest. Optionally leave dev unmigrated to prove tests do not need it.

---

# Block C — Independent

1. Temporarily comment `target_metadata` import so a **new** autogen would be wrong — do **not** leave it broken. Instead: add a test that fails if `tag` missing — then `downgrade` the test DB by hand and run pytest **once** to see fail (`FAIL.txt`), then upgrade again. That is “tests catch schema.”  
2. Isolation: two tests insert a notice with the same unique `body` if unique; both pass.  
3. `TESTS.md`: “never create_all in 6B tests.”  
4. Break 404 test; restore; snippet in `FAIL404.txt`.

Do not migrate `postgres` default DB. Do not drop unrelated databases.

```powershell
cd ~\fullstack-lab
git add month-11
git commit -m "Month 11 Week 2 Day 5: pytest runs Alembic on test DB."
```

---

# Block E — Recall

1. Why `create_all` in tests diverges.  
2. How to point `command.upgrade` at TEST URL.  
3. Session vs function fixture scope.  
4. Why `main.py` must not `create_all` on import.  
5. How you proved `tag` exists.

## Office hours

**pytest migrated my dev database.** `env.py` ignored `cfg.set_main_option` and read a leftover `$env:DATABASE_URL` from the shell pointing at dev. Set both explicitly in conftest.

**`No config file 'alembic.ini'`.** Wrong cwd. pytest.ini `pythonpath` will not fix cwd; `Config(path)` absolute or `os.chdir` carefully. Prefer `Config` with absolute path to `alembic.ini`.

**Upgrade every test, pool exhausted.** Session-scoped migrate; close connections.

**Windows alembic not found.** `uv add alembic` and `uv run pytest`.

**Tests green, production missing revision.** You never ran `alembic upgrade` on dev. Document the runbook in README: upgrade then uvicorn.

---

## Lecture: the test database is a product environment

CI is an environment. It needs URL, migrations, tests. If only your laptop has `create_all` leftovers, CI is the first honest runner — or the first surprise. Prefer honesty on the laptop.

Rollback fixtures + migrated schema = Month 10 constraints + Month 9 HTTP tests.

Pydantic Out still allowlists. A new migrated column that is internal should **not** appear in JSON unless CONTRACT says so.

---

## Worked session — two DBs, upgrade in conftest

Two databases. Alembic two revisions. FastAPI notices. conftest forces TEST URL, `command.upgrade("head")`, rollback Session, TestClient. pytest green without touching dev data. Inspect `tag`. TESTS.md. No ops-api. No `Query()`. `model_dump` if comparing.

```powershell
uv run pytest -q
uv run alembic -c alembic.ini current
```

If current on **dev** changed, you pointed Alembic at the wrong URL. Fix before git.

---

## Definition of done

- [ ] Distinct test URL  
- [ ] pytest runs `upgrade head`  
- [ ] Rollback or truncate isolation  
- [ ] 201/404 tests green  
- [ ] Column from a **later** revision proven  
- [ ] No import-time `create_all`  
- [ ] Commit exists  

---

## Optional review links

- [Alembic command API](https://alembic.sqlalchemy.org/en/latest/api/commands.html)  
- [FastAPI testing](https://fastapi.tiangolo.com/tutorial/testing/)  
- Week 1 Day 5 of this month (rollback fixture)

---

## Tomorrow

**Independent:** a **migration pack** for **your** 6B — init if needed, revisions that match **your** tables, upgrade on a **dev** database you own. This textbook will not write those revisions.

---

# Closing lecture — migrate the schema you claim to test

`create_all` tests the models. `alembic upgrade` tests the **history** plus the models. 6B needs the history.

Two URLs. Session-scoped upgrade. Function-scoped rollback. Overrides cleared. `tag` (or your extra column) is the canary.

Windows PowerShell: set TEST URL in the same session as `uv run pytest`. `psql` `\d notices` on the **test** database after pytest — columns should exist; rows should be gone if you rolled back (or leftover if you committed — then fix the fixture).

Honesty in TESTS.md is part of the grade of the day.

---

## Recite-back checklist

Write `RECITE.txt`.

- [ ] TEST_DATABASE_URL ≠ DATABASE_URL  
- [ ] pytest calls `command.upgrade("head")`  
- [ ] env.py cannot silently migrate dev  
- [ ] rollback or truncate isolation  
- [ ] `tag` (later column) exists because of a revision  
- [ ] no import-time `create_all`  
- [ ] overrides cleared  
- [ ] not ops-api  

**Absolute path to alembic.ini** in conftest:

```python
from pathlib import Path
CFG = Path(__file__).resolve().parents[1] / "alembic.ini"
cfg = Config(str(CFG))
```

Adjust `parents[n]` to **your** layout. If pytest runs from another cwd, relative `Config("alembic.ini")` fails. That failure is a **path** bug, not an Alembic bug.

**Windows:** `$env:TEST_DATABASE_URL = "...month11_w2d5_test"` **and** set `DATABASE_URL` to the same value inside the fixture if `env.py` reads it. `uv run pytest -q`. `psql -d month11_w2d5_test -c "\d notices"`.

If pytest created tables in `month11_w2d5` (dev), you leaked the URL. Fix before you trust 6B CI.

Do not `drop database postgres`. Do not migrate Atlas production from a lab.
