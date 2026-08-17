# Month 11 · Week 1 · Day 1
# Models, mapped_column, and a First Session

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 3 — Python and backend  
**Month index:** [../../README.md](../../README.md)  
**Week 1:** Day 1 (today) · [2](day-02.md) · [3](day-03.md) · [4](day-04.md) · [5](day-05.md) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Learn + type-along  
**Student state:** Month 10 gate passed. You can design a schema, write SQL, and justify a join. Today that SQL becomes **objects you load in a Session** — without forgetting the SQL.  
**Study time:** 3–4 focused hours

**This week covers:** SQLAlchemy 2.x models, sessions, relationships, `select()`, transaction boundaries, lazy vs eager loading, N+1.

Today: what an **ORM model** is, how **`Mapped` / `mapped_column`** declare a table, how an **engine** talks to PostgreSQL, and how a **Session** is a unit of work — compared to the **raw SQL** you wrote in Month 10. Relationships are Day 2. Do not skip them. Project 6B is **not** a paste today.

Labs: `~\fullstack-lab\month-11\week-01\day-01\`.  
Product work stays in **your** `~/ops-api/` — this textbook will **not** give you that app.

---

## How to use this textbook

1. Read a section. Close it. Say it in a full sentence.  
2. Type every lab. Do not paste a generated “SQLAlchemy starter kit.”  
3. Leave `echo=True` on the engine until you can **read** the SQL it prints.  
4. Optional review links are for later rechecking.

---

## How to read this chapter

A **model** is a Python class that maps to a **table**. A **Session** is a conversation with the database for one unit of work: you load rows, change objects, then **commit** or **rollback**. An **engine** is the pool of connections. SQLAlchemy 2.x writes SQL you already know — `INSERT`, `SELECT`, `UPDATE` — and you must still be able to read it.

```mermaid
flowchart LR
  PY[Python objects] --> S[Session]
  S --> E[Engine / pool]
  E --> PG[(PostgreSQL)]
  PG --> E
  E --> S
  S --> PY
```

Month 10 you typed `INSERT INTO shelves ...` in `psql`. Today you type `session.add(shelf)` and **watch the same INSERT**. If you cannot name the SQL, you are not using an ORM — you are hoping.

**Wrong belief:** “SQLAlchemy replaces SQL, so Month 10 was a detour.”  
**Correct:** SQLAlchemy **emits** SQL. Month 10 is how you debug echo, `EXPLAIN`, and a missing foreign key.

**Wrong belief:** “I’ll copy `session.query(Model).filter_by(...)` from a 2019 blog.”  
**Correct:** this course is **SQLAlchemy 2.x**: `select()`, `Mapped`, `mapped_column`, `Session`. The 1.x `Query()` API is retired for new code.

---

## Today's contract

By the end of this day you will be able to:

1. Create a small **`uv`** project with `sqlalchemy` and `psycopg` (the v3 driver).  
2. Subclass **`DeclarativeBase`**, declare one model with **`Mapped`** and **`mapped_column`**.  
3. Build an **engine** with a PostgreSQL URL and `echo=True`.  
4. Open a **Session**, `add`, `commit`, then `select()` the row back.  
5. Compare that round-trip to an equivalent **raw SQL** script from Month 10.  
6. Name **engine vs connection vs Session** in one sentence each.

**Today's gate.** Closed-book:

> A model maps a class to a table. The engine holds connections. A Session is a unit of work: add, flush, commit, or rollback. `select()` is how I query in 2.x. Echo shows the SQL I already learned. I did not paste `~/ops-api/`.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 50 | Theory |
| B | 70 | uv project + engine + first Session |
| C | 55 | Independent: second table as a model; write the SQL twin |
| D | 15 | Git |
| E | 15 | Recall |

---

# Block A — Theory

## 1. Why an ORM exists

Month 9 stored dicts in RAM. Month 10 stored rows in PostgreSQL and you spoke SQL. An HTTP handler that concatenates SQL strings is how injection starts, and a handler that returns a raw tuple is how your FastAPI `response_model` becomes a lie.

SQLAlchemy’s job is:

- **Map** classes to tables so Python code names `shelf.name` instead of `row[1]`.  
- **Parameterize** SQL so values are never glued into the string.  
- **Track** objects in a Session so you can change attributes and flush once.  
- **Still show you the SQL** when `echo=True`.

It is not a second database. PostgreSQL remains the system of record. Redis is Week 3. MongoDB is a Week 4 lab, not this model.

Use SQLAlchemy when you have a real schema (you do, from Month 10), you want models as a documented Python surface, and you will migrate with Alembic next week. Do not use it as an excuse to skip `EXPLAIN`.

---

## 2. Engine, connection, Session

| Piece | Job | If you confuse it |
|---|---|---|
| **Engine** | URL + dialect + **connection pool** | You create a new engine per request and exhaust Postgres |
| **Connection** | One checkout from the pool | You hold it open across HTTP requests |
| **Session** | Unit of work: identity map + pending INSERT/UPDATE/DELETE | You treat it like a global dict that lives forever |

The engine is created **once** at process start (like `app = FastAPI()`). A Session is created **per request** (or per script), used, then **closed**. Day 2 makes the close/commit boundary precise. Today you feel `with Session(engine) as session:`.

A **connection pool** is a handful of open connections reused so you do not TCP-handshake PostgreSQL on every call. You do not configure a giant pool on a laptop. You **name** the idea.

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

engine = create_engine(
    "postgresql+psycopg://postgres:YOUR_PASSWORD@127.0.0.1:5432/month11",
    echo=True,
    pool_pre_ping=True,
)
```

- `postgresql+psycopg` means PostgreSQL via **psycopg 3**. Do not use the old `psycopg2` string unless you installed that driver on purpose.  
- `pool_pre_ping=True` asks “are you still alive?” before reuse — useful after a laptop sleep.  
- Never commit the password. A URL in a lab `.env` that is gitignored is fine; a URL in a screenshot in git is not.  
- `echo=True` prints SQL to the terminal. That is the teacher. Turn it off later when you know the statements.

**Wrong belief:** “I’ll put `create_engine` inside every function so it is fresh.”  
**Correct:** one engine per process. Many Sessions. The pool exists so you are **not** opening a TCP connection per query.

The word **session** will mean login cookies in Month 13. SQLAlchemy’s `Session` is unrelated. Say **database session** when you need to be precise.

---

## 3. DeclarativeBase, Mapped, mapped_column

SQLAlchemy 2.x style (type this; do not invent a 1.x `Column` soup unless you know why):

```python
from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Shelf(Base):
    __tablename__ = "shelves"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80))
    location: Mapped[str | None] = mapped_column(String(80), nullable=True)
```

Read it like Month 10 DDL:

- `__tablename__` is the table name.  
- `Mapped[int]` is the **Python** type you want on the instance.  
- `mapped_column(...)` is the **SQL** column: type, nullability, primary key.  
- `Mapped[str | None]` plus `nullable=True` is an optional column. `Mapped[str]` without `nullable=True` is `NOT NULL`.

`id` as integer primary key is enough today. PostgreSQL identity / `SERIAL` behavior is configured with `mapped_column(primary_key=True)` and the dialect’s default. You already know what a primary key **is** from Month 10.

**Do not** write this 1.x pattern in new labs:

```python
# not this course
class Shelf(Base):
    __tablename__ = "shelves"
    id = Column(Integer, primary_key=True)
    name = Column(String(80))
```

You will still **see** `Column` in old stack traces and Alembic internals. You write **`mapped_column`**.

---

## 4. Session: add, flush, commit, select

```python
from sqlalchemy import select
from sqlalchemy.orm import Session

with Session(engine) as session:
    shelf = Shelf(name="North wall", location="Bay A")
    session.add(shelf)
    session.commit()
    print(shelf.id)

    stmt = select(Shelf).where(Shelf.name == "North wall")
    found = session.scalars(stmt).first()
    print(found.name if found else "missing")
```

What happened:

1. `Shelf(...)` created a Python object **not yet** in PostgreSQL.  
2. `session.add` put it in the Session as **pending**.  
3. `commit` **flushed** (emitted `INSERT`) and committed the transaction. After commit, `shelf.id` is populated.  
4. `select(Shelf).where(...)` is 2.x. `session.scalars(stmt).first()` returns a `Shelf` or `None`.

Compare to Month 10:

```sql
INSERT INTO shelves (name, location) VALUES ('North wall', 'Bay A') RETURNING id;
SELECT id, name, location FROM shelves WHERE name = 'North wall';
```

Same facts. Different spelling. Echo will show something very close to that INSERT/SELECT.

**`session.query(Shelf)` is not the lesson.** If a tutorial leads with `.query(`, close it. Use `select()`.

**Wrong belief:** “`session.scalars` is a weird extra; I’ll `.execute` and index tuples.”  
**Correct:** `execute` returns rows. `scalars()` picks the ORM entity from those rows. For `select(Shelf)` that is what you want. For `select(Shelf.name)` you want values, not entities — then `scalars` is still honest.

---

## 5. Creating tables today vs Alembic next week

`Base.metadata.create_all(engine)` will `CREATE TABLE` from models. That is **legal in a Day 1 lab** so you can feel a Session before you learn migrations.

It is **not** how Project 6B evolves a schema. Week 2 is Alembic: history you can upgrade and downgrade. If you `create_all` in production later, two machines disagree about columns and nobody has a revision to replay.

Today: `create_all` in the lab script is a bootstrap. Write one sentence in `NOTES.md`: “create_all is a lab shortcut; Alembic owns 6B.”

---

## 6. `scalars`, `execute`, and `session.get`

You will see three execution styles. Use them on purpose.

| Call | Returns | Use |
|---|---|---|
| `session.scalars(select(Shelf)).all()` | `Shelf` instances | Normal ORM load |
| `session.execute(select(Shelf)).all()` | `Row` objects; `row[0]` is the `Shelf` | When you select **more than one** entity |
| `session.execute(select(Shelf.name)).all()` | Rows of values | Reports, like Month 10 `SELECT name` |
| `session.get(Shelf, 1)` | One instance or `None` | Primary-key lookup |

`session.get(Shelf, 1)` is 2.x and hits the **identity map** first. If the object is already in the Session, there may be **no SQL**. Prove it with echo: get twice, second time quiet. That is not Redis. That is the Session remembering the instance. Day 7 names the map; today you may notice it.

```python
stmt = select(Shelf.id, Shelf.name).order_by(Shelf.id)
rows = session.execute(stmt).all()
for shelf_id, name in rows:
    print(shelf_id, name)
```

That is closer to Month 10 than `select(Shelf)` is. Both are legal. List APIs later usually want entities so you can apply `selectinload`. Reports can stay as value SELECTs — or raw SQL you already trust.

**Wrong belief:** “`execute` is raw SQL and `scalars` is the ORM.”  
**Correct:** both execute a `select()` construct. `scalars` unwraps the first column. If you `select(Shelf.id, Shelf.name)` and then `scalars()`, you get ids only and you will think names vanished.

---

## 7. What echo is trying to teach

Leave `echo=True` until you can predict:

- `BEGIN`  
- `INSERT INTO shelves ...` with **bound parameters** (`%(name)s` style, not your password concatenated)  
- `COMMIT`  
- `SELECT` on the way back  

If you see `ROLLBACK` after an error, that is the Session aborting the transaction. Good. If you see INSERT and never COMMIT, you flushed without commit or the `with` block rolled back. Read the log in order.

SQLAlchemy may emit `RETURNING id`. PostgreSQL `RETURNING` is a feature you already met in Month 10. Do not fight it.

---

## 8. Security start

- Parameterized ORM queries are not an excuse to concatenate `text(f"WHERE name = '{user}'")`. If you drop to `text()`, bind parameters.  
- Connection URLs contain passwords. `.env` gitignored; `.env.example` with placeholders.  
- Bind FastAPI to `127.0.0.1` when you add HTTP later this week. Today may be a script only.  
- Do not log the full URL.

---

# Block B — Type-along

## B1. Database

```powershell
psql -U postgres -c "SELECT version();"
psql -U postgres -c "CREATE DATABASE month11;"
```

If `month11` already exists from a retry, that is fine. Do not put this lab in the `postgres` default database.

## B2. Project

```powershell
cd ~\fullstack-lab
mkdir month-11\week-01\day-01 -Force
cd ~\fullstack-lab\month-11\week-01\day-01
uv init --name lab-shelves
uv add sqlalchemy "psycopg[binary]"
```

`psycopg[binary]` is the Windows-friendly extra. If install fails, read the error; do not silently switch to SQLite to “save time.” This month’s system of record is PostgreSQL.

Create `.env.example`:

```text
DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@127.0.0.1:5432/month11
```

Copy to `.env` locally. Add `.env` to `.gitignore` if `uv init` did not.

For today’s script you may read the URL from the environment in PowerShell:

```powershell
$env:DATABASE_URL = "postgresql+psycopg://postgres:YOUR_PASSWORD@127.0.0.1:5432/month11"
```

Or a tiny `config.py` that reads `os.environ["DATABASE_URL"]`. Do not hardcode the password in `main.py` that you will commit.

## B3. Models + script

Type `models.py` with `Base` and `Shelf` as in Block A.

Type `seed.py` that:

1. Builds `engine` with `echo=True` from `DATABASE_URL`.  
2. Calls `Base.metadata.create_all(engine)`.  
3. Opens `with Session(engine) as session:`, adds two `Shelf` rows, `commit`.  
4. Runs `select(Shelf).order_by(Shelf.id)` and prints names.

```powershell
uv run py -3 seed.py
```

(`uv run python seed.py` is also fine if that is the interpreter `uv` pinned. Prefer `uv run` so you use the project environment.)

Read the **echo**. You should see `CREATE TABLE` (first run) and `INSERT` and `SELECT`. Paste the INSERT into `ECHO.txt` (SQL only, no password).

Run it a **second** time if you add `unique=True` on `name` later — uniqueness failures are PostgreSQL doing its job. Today names need not be unique unless you choose that.

## B4. Raw SQL twin

In the same folder, type `01-shelves.sql`:

```sql
-- Twin of the ORM round-trip. Run against month11 after you understand echo.
SELECT id, name, location FROM shelves ORDER BY id;
```

```powershell
psql -U postgres -d month11 -f 01-shelves.sql
```

Write `COMPARE.md`: three sentences — what the model declared, what echo inserted, what `psql` selected. If they disagree, you did not commit, or you connected to a different database.

---

# Block C — Independent

Add a second model **`Bin`** with:

- `id` integer PK  
- `label` text `NOT NULL`  
- `capacity` integer `NOT NULL`  

Do **not** add `ForeignKey` or `relationship` yet. That is tomorrow. Today you prove a second `__tablename__` and a second `select()`.

Insert two bins in a Session. Select them. Write `02-bins.sql` that `SELECT`s the same table. If `create_all` did not make `bins`, you forgot to import the model before `create_all` — metadata only knows classes that were imported.

Write `WHAT-I-SAW.md`:

- engine vs Session in your words  
- why `Mapped[str | None]` is different from `Mapped[str]`  
- the echo INSERT vs your Month 10 muscle memory  

Do **not** open `~/ops-api` to copy models. Do **not** add FastAPI unless you finish early — HTTP is Day 4’s lab. Do **not** use `users` / `projects` / `tasks` as the lab noun; those are **your** 6B tables on Day 6.

```powershell
cd ~\fullstack-lab
git add month-11
git commit -m "Month 11 Day 1: SQLAlchemy model, engine, first Session."
```

Confirm `.env` is not in the commit.

---

# Block E — Recall

1. What `DeclarativeBase` is for.  
2. `Mapped` vs `mapped_column`.  
3. Why one engine, many Sessions.  
4. `select(Shelf)` vs `session.query(Shelf)`.  
5. Why `create_all` is a lab shortcut.

## Office hours

**`password authentication failed`.** Same as Month 10: user, password, host. The ORM did not invent a new login. Fix the URL.

**`No module named psycopg`.** You added SQLAlchemy but not the driver. `uv add "psycopg[binary]"`. The URL dialect `+psycopg` must match the package.

**Echo shows SQLAlchemy wrapping names with quotes.** PostgreSQL folds unquoted identifiers. Echo quoting is normal. Your Month 10 unquoted `shelves` is the same table.

**`relation "shelves" does not exist` in psql.** You queried database `postgres` instead of `month11`, or `create_all` never ran, or the URL pointed at a different DB than `-d month11`.

**I used SQLite `sqlite:///lab.db` because Postgres felt slow to type.** Undo it. This month’s pool, types, and Week 2 migrations assume PostgreSQL. SQLite will lie about types and constraints.

**I copied `session.query`.** Replace with `select()` today, not “later.” Muscle memory is the product.

**`uv run` cannot find `psycopg` but `pip list` on the system can.** You installed the driver on the wrong interpreter. Always `uv add` inside the lab project.

**Echo shows `%s` or `$1` instead of `'North wall'`.** That is parameterization. The value is sent separately. That is the injection seatbelt. Month 10 told you not to concatenate. The ORM is keeping that promise unless you `text(f"...")`.

---

## Side-by-side: Month 10 SQL vs today’s objects

Write this table into `COMPARE.md` in your own words after Block B. Here is the course version so you can check:

| Job | Month 10 | Today |
|---|---|---|
| Connect | `psql -U postgres -d month11` | `create_engine(url)` once |
| Create table | `CREATE TABLE ...` in a `.sql` file | `mapped_column` + `create_all` (lab only) |
| Insert | `INSERT INTO ... VALUES (...)` | `session.add(Shelf(...)); commit` |
| Choose rows | `SELECT ... WHERE name = '...'` | `select(Shelf).where(Shelf.name == "...")` |
| Transaction | `BEGIN` / `COMMIT` / `ROLLBACK` | Session begin/commit/rollback |
| Proof | query in `psql` | `psql` **and** echo |

If you cannot fill the SQL column, you are not ready to hide it behind a class. Stay until echo is readable.

A model is a **declaration**. It does not insert anything by existing. Students who “wrote the class” and then wondered why `psql` is empty skipped `create_all` **or** skipped `commit` **or** pointed the engine at a different database. Those are three different bugs. Name which one you had in `WHAT-I-SAW.md`.

---

## Lecture: the identity of a row is not the identity of a dict

In Month 9, `SHELVES[1] = {...}` was a dict you owned. Two lookups returned the same dict because you stored one object in a module global.

In SQLAlchemy, two `select`s **in the same Session** for the same primary key return the **same Python instance**. That is the **identity map** (Week 1 Day 7 names it fully). Two Sessions are two conversations: you can have two objects for one row if you opened two Sessions. That is not a bug. Do not “fix” it by making a global Session.

`flush` sends SQL but may still be inside an uncommitted transaction. `commit` makes it durable. `rollback` drops pending changes. Today you `commit` in a script. Day 2 is where you practice `begin` and `close` as a habit.

`expire_on_commit` (default True) means after commit, attribute access may **SELECT again** to refresh. Echo will surprise you with a SELECT you did not write. That SELECT is the Session being honest that the row might have changed. Day 7 reviews expire. Today: if you see an extra SELECT after commit, write it in `ECHO.txt` and do not panic.

---

## Worked session — one table, two inserts, one select

`uv init` in `~\fullstack-lab\month-11\week-01\day-01`. Add sqlalchemy and `psycopg[binary]`. `.env.example` with `DATABASE_URL`. `models.py`: `Base`, `Shelf`. `seed.py`: engine `echo=True`, `create_all`, Session, two shelves, `select(Shelf)`. Run with `uv run`. Read INSERT in echo. `psql -d month11` SELECT twin. `COMPARE.md`. Then `Bin` without a foreign key. `NOTES.md` sentence about Alembic next week.

If `create_all` is silent and `psql` has no table, the engine URL is wrong or `Shelf` was not imported. Import the class so `Base.metadata` has the table.

Windows: `psql` from PATH as in Month 10. PowerShell `$env:DATABASE_URL = "..."`. `curl.exe` is not required today; there is no HTTP server unless you added one.

Do not paste Project 6B models. Shelves and bins are the noun. `~/ops-api/` stays closed.

---

## Extra drills (if Block C finished early)

1. `session.get(Shelf, id)` twice with echo on. Second call: SQL or silent? Write one line.  
2. `select(Shelf.name)` + `scalars().all()` — list of strings. Then the same `select` with `execute().all()` — rows. Know both.  
3. Insert with `location=None`. `psql` shows NULL, not the string `"None"`. If you see `"None"`, you stored a Python string.  
4. Two engines in one script to two different databases — then **do not** do that in the app. The drill exists so you feel why `DATABASE_URL` must be one obvious place.

Do not add `relationship` until tomorrow. Do not “preview Alembic.” Do not open Redis because echo felt chatty.

**Wrong belief:** “I’ll `Base.metadata.reflect(engine)` and skip declaring classes.”  
**Correct:** reflection is a tool for archaeology. This course **declares** models so they match a schema you understand. Week 2 migrations need `target_metadata` from **your** `Base`.

---

## Definition of done

- [ ] `uv` project talks to PostgreSQL through SQLAlchemy  
- [ ] `Shelf` uses `Mapped` and `mapped_column`  
- [ ] Session `add` + `commit` + `select()` worked  
- [ ] Echo SQL saved; `psql` twin agrees  
- [ ] Independent `Bin` model without FK  
- [ ] I can say engine vs Session  
- [ ] Commit exists; no password in git  

---

## Optional review links

SQLAlchemy 2.x mapping and Sessions are explained in this chapter. These pages are for later checking, not for first learning.

- [SQLAlchemy 2.0 ORM overview](https://docs.sqlalchemy.org/en/20/orm/quickstart.html)  
- [mapped_column](https://docs.sqlalchemy.org/en/20/orm/mapping_styles.html#declarative-mapping)  
- [psycopg 3](https://www.psycopg.org/psycopg3/docs/)

---

## Tomorrow

**Relationships**, **`ForeignKey`**, **`back_populates`**, and **Session / transaction boundaries** (`begin`, `commit`, `close`). Bring today’s tables; we will connect them the way Month 10 connected keys.

---

# Closing lecture — objects are a view of rows

A model is not a Pydantic schema. Pydantic (Month 9) validates HTTP. SQLAlchemy maps tables. You will still write `ShelfOut` later and **`model_dump`** it — you will **not** return a Session object from FastAPI and hope JSON works.

`select()` is the 2.x query. `Query()` is the old API. `Mapped` is the annotation. `mapped_column` is the column. The engine is a pool. The Session is a unit of work.

Echo is mandatory until you can predict the INSERT. `create_all` is a lab door, not a migration history. PostgreSQL is still the record. Raw SQL in `psql` is still how you prove the table exists.

Bind parameters stay. Passwords stay out of git. Shelves are the lab noun. ops-api is yours on Day 6, written by you.

Windows reminder: `psql` is still the proof camera. SQLAlchemy is not a GUI. If `psql -d month11 -c "\dt"` does not list `shelves`, the ORM did not create it where you are looking.
