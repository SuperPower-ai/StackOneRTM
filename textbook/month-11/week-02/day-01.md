# Month 11 · Week 2 · Day 1
# Alembic: What a Migration Is, env.py, and `alembic init`

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 3 — Python and backend  
**Month index:** [../../README.md](../../README.md)  
**Week 2:** Day 1 (today) · [2](day-02.md) · [3](day-03.md) · [4](day-04.md) · [5](day-05.md) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Learn + type-along  
**Student state:** Week 1 gate passed in spirit: you can map tables, open a Session, and you know `create_all` is a lab shortcut. Today schema change becomes **history you can replay**.  
**Study time:** 3–4 focused hours

**This week covers:** Alembic init, `env.py`, autogenerate vs handwritten revisions, upgrade/downgrade, expand-contract, running migrations in tests, a 6B migration pack.

Today: what a **migration** is, what **`alembic_version`** records, what **`env.py`** is for, and how to **`alembic init`** on Windows with `uv`. Autogenerate is Day 2. Do not skip it. This textbook will **not** paste a giant autogenerate dump as the lesson, and it will **not** paste `~/ops-api/`.

Labs: `~\fullstack-lab\month-11\week-02\day-01\`. Noun: **coat hooks** (a wall of numbered hooks — not 6B).

---

## How to use this textbook

1. Read a section. Close it. Say it.  
2. Type `alembic init` and **open the files it created**. Do not treat them as magic.  
3. Your first revision today is **small and handwritten**. Autogenerate tomorrow.  
4. Optional review links are for later rechecking.

---

## How to read this chapter

A **migration** is a versioned script that changes a database schema (and sometimes data) in a way you can **apply** (`upgrade`) and, in development, **undo** (`downgrade`). Alembic stores which revision a database has reached in a table named **`alembic_version`**.

```mermaid
flowchart LR
  M[Models / intent] --> R[Revision script]
  R --> U[alembic upgrade]
  U --> PG[(PostgreSQL)]
  PG --> V[alembic_version]
  U --> D[alembic downgrade]
  D --> PG
```

`create_all` says “make whatever is missing **now**.” It does not record that last Tuesday you added `color TEXT`. A second machine, or a test database, or you in six months, cannot replay “last Tuesday.” Migrations **are** that replay.

**Wrong belief:** “I’ll keep `create_all` in startup; Alembic is for big companies.”  
**Correct:** two environments that both `create_all` **diverge** the first time someone edits a column by hand in `psql`. 6B uses Alembic.

**Wrong belief:** “The migration file is the model. I do not need both.”  
**Correct:** the **model** is how the app thinks **now**. The **revision chain** is how the database **got** here. They must meet. Day 2 is about when autogenerate notices they do not.

---

## Today's contract

By the end of this day you will be able to:

1. Explain **migration**, **revision id**, **down_revision**, and **`alembic_version`**.  
2. Run **`uv run alembic init alembic`** (or the folder name you choose) and name the files it created.  
3. Point **`env.py`** at your `Base.metadata` and a URL from the environment — not a committed password.  
4. Write a **short handwritten** revision that `create_table`s `hooks`.  
5. `upgrade head` and `downgrade -1` in development and prove it with `psql`.  
6. Say why app startup should not call `create_all` once Alembic owns the schema.

**Today's gate.** Closed-book:

> A migration is a replayable schema change. Alembic tracks the current revision. `env.py` is how upgrade finds my metadata and database URL. I can init, write a small revision, upgrade, and downgrade. I did not paste ops-api.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 50 | Theory |
| B | 75 | init + env.py + first handwritten revision |
| C | 50 | Independent: second table revision; upgrade/downgrade notes |
| D | 15 | Git |
| E | 15 | Recall |

---

# Block A — Theory

## 1. The problem `create_all` cannot solve

Week 1 `create_all` created `shelves` if it was missing. It will **not**:

- drop a column you removed from the model (it does not want to destroy data)  
- rename `label` to `title` (it would add `title` and leave `label`)  
- run a data backfill (`UPDATE ... SET new_col = old_col`)  
- tell you what production is on

Alembic revisions are Python files with `upgrade()` and `downgrade()` that call Alembic **operations**: `op.create_table`, `op.add_column`, `op.create_index`, `op.drop_column`, and so on. Those operations emit SQL. You can still `echo` / `--sql` to read it.

Production (later months) **upgrades**. Development **downgrades** when you are fixing a revision you have not shared. Downgrading a database with real data is a **decision**, not a reflex. Today’s lab database is disposable.

---

## 2. Revision graph

Each revision has:

- a **revision id** (hex-ish string Alembic generates)  
- **`down_revision`**: the parent it sits on (`None` for the first)  
- functions `upgrade()` and `downgrade()`

Linear history is the course default: one branch, `head` is one id. **Merge revisions** exist for teams that branched. You do not need a merge today. If `alembic heads` prints two ids, you forked; fix that before 6B pretends it is simple.

`alembic current` = what **this database** has in `alembic_version`.  
`alembic history` = the chain of files.  
`alembic upgrade head` = apply until current matches the latest file.

**Wrong belief:** “If the models import, the database is migrated.”  
**Correct:** models can be ahead of `alembic_version`. That is how you get `column does not exist` at runtime.

---

## 3. What `alembic init` creates

```text
alembic.ini           # config; sqlalchemy.url lives here or you override in env.py
alembic/
  env.py              # runs around each upgrade; you wire metadata + URL
  script.py.mako      # template for new revision files
  README
  versions/           # your revision scripts go here (empty at first)
```

You will **edit `env.py`**. You will **not** paste a 400-line autogenerate into the textbook as “the lesson.” A revision you **read** is the lesson.

`alembic.ini` often contains `sqlalchemy.url = driver://user:pass@localhost/dbname`. **Do not commit a real password.** Prefer:

- `sqlalchemy.url` empty or a placeholder, and  
- `env.py` reads `os.environ["DATABASE_URL"]` (or your settings object).

If the URL in `alembic.ini` and the URL in FastAPI differ, you will migrate `month11` and run the app on `month11_w1d4`. That bug is famous. One settings module, two consumers.

---

## 4. `env.py` conceptually

`env.py` is ordinary Python Alembic executes. Two modes:

- **Offline:** generate SQL files without connecting (`alembic upgrade head --sql`). Useful for review.  
- **Online:** connect and run migrations.

You care about online today. The idea:

1. Build an engine from `DATABASE_URL`.  
2. Set `target_metadata = Base.metadata` so **autogenerate** (tomorrow) can compare models to the database.  
3. Run `context.run_migrations()`.

You must **import your models** so `Base.metadata` actually has tables. Empty metadata → autogenerate thinks you want to drop the world, or create nothing. Day 2 will punish a forgotten import. Today, import `Hook` so the first revision can still be handwritten while metadata is ready.

Alembic’s generated `env.py` has comments. Read them. Change the URL and metadata. Do not rewrite the whole file from a blog for a different SQLAlchemy version.

---

## 5. Handwritten first revision (why)

Autogenerate is a **diff tool**. If it diffs a messy database against messy models, it writes messy operations. Your first table is small enough to write:

```python
def upgrade() -> None:
    op.create_table(
        "hooks",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("code", sa.String(length=32), nullable=False),
        sa.Column("wall", sa.String(length=32), nullable=False),
    )
    op.create_index("ix_hooks_code", "hooks", ["code"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_hooks_code", table_name="hooks")
    op.drop_table("hooks")
```

That is **not** a dump. It is a table you can still say in SQL. `sa` is `sqlalchemy` as imported in the revision template.

You may use `mapped_column` on the **model** and `sa.Column` in the **revision**. Revisions are Alembic operations, not ORM classes. Do not copy-paste `class Hook` into `versions/`.

---

## 6. Commands you will type

```powershell
uv add alembic sqlalchemy "psycopg[binary]"
uv run alembic init alembic
uv run alembic revision -m "create hooks"
# edit the new file in alembic/versions/
uv run alembic upgrade head
uv run alembic current
uv run alembic downgrade -1
uv run alembic upgrade head
```

`revision -m` without `--autogenerate` makes a **stub**. You fill `upgrade`/`downgrade`. That is today.

`--sql` prints SQL instead of executing (offline-ish). Try it once after you have a revision: `uv run alembic upgrade head --sql`. Save a snippet in `SQL.txt`. That is Month 10 literacy applied to Alembic.

---

## 7. Security

- No passwords in `alembic.ini` committed to git.  
- Migrations that insert **admin users with passwords** are how secrets land in history forever. Do not.  
- `downgrade` that `DROP TABLE` is fine on a lab DB. It is not a joke on production.  
- Review SQL before you run someone else’s revision.

---

# Block B — Type-along

```powershell
cd ~\fullstack-lab
mkdir month-11\week-02\day-01 -Force
cd ~\fullstack-lab\month-11\week-02\day-01
uv init --name lab-alembic-init
uv add sqlalchemy "psycopg[binary]" alembic
psql -U postgres -c "CREATE DATABASE month11_w2d1;"
$env:DATABASE_URL = "postgresql+psycopg://postgres:YOUR_PASSWORD@127.0.0.1:5432/month11_w2d1"
```

### B1. Models (app truth)

`models.py`: `Base`, `Hook` with `id`, `code` (unique), `wall`. `Mapped` / `mapped_column`. No FastAPI required.

### B2. Init

```powershell
uv run alembic init alembic
```

List files in `NOTES.md`. Open `alembic/env.py`. Import `Hook` and `Base`. Set `target_metadata = Base.metadata`. Make the engine URL come from `os.environ["DATABASE_URL"]` (both offline and online paths if the template has both — read the file you actually got).

Placeholder in `alembic.ini` for `sqlalchemy.url` — not your password.

### B3. First revision, handwritten

```powershell
uv run alembic revision -m "create hooks table"
```

Fill `upgrade`/`downgrade` as in the theory (match **your** column names). Do not run autogenerate yet.

```powershell
uv run alembic upgrade head
psql -U postgres -d month11_w2d1 -c "\dt"
psql -U postgres -d month11_w2d1 -c "SELECT * FROM alembic_version;"
```

You should see `hooks` and a revision id.

```powershell
uv run alembic downgrade -1
psql -U postgres -d month11_w2d1 -c "\dt"
```

`hooks` gone; `alembic_version` empty or missing depending on version — write what you see. Then `upgrade head` again.

```powershell
uv run alembic upgrade head --sql > upgrade.sql
```

Read `upgrade.sql`. If it is empty, you were already at head — `downgrade -1` then `--sql` on the way up, or use a range. Document the command that actually printed `CREATE TABLE`.

Write `ENV.md`: where the URL is read, where `target_metadata` is set, why models are imported.

---

# Block C — Independent

Add model `Peg` (`id`, `hook_id` as **integer without relationship** if you want to wait — or with `ForeignKey` if you are comfortable). **New revision** (handwritten) `create pegs` with FK to `hooks.id`.

`upgrade head`. `psql` `\d pegs`. `downgrade -1` should drop `pegs` but leave `hooks`. `downgrade -1` again drops `hooks`. Then `upgrade head` restores both.

If downgrade fails because of FK order, you learned why `drop_table` order matters. Fix `downgrade()` to drop children first.

Write `CHAIN.md`: two revision ids, which is down_revision of which.

Do **not** `create_all` in a startup path. If you still have a seed script, it should **assume tables exist** (migrated) or you document that seed is lab-only after upgrade.

Do not paste 6B. Do not add Redis.

```powershell
cd ~\fullstack-lab
git add month-11
git commit -m "Month 11 Week 2 Day 1: alembic init and handwritten create table."
```

---

# Block E — Recall

1. What `alembic_version` stores.  
2. Why `create_all` is not a history.  
3. What you change in `env.py`.  
4. `upgrade head` vs `downgrade -1`.  
5. Why the revision uses `op.create_table` not `class Hook`.

## Office hours

**`Can't locate revision`.** File deleted but database still points at it. Do not delete applied revisions. Lab: drop DB and start over, or `alembic stamp` only when you understand stamp (Day 7).

**`Target database is not up to date` / autogenerate later.** Tomorrow.

**`No such table: alembic_version` after downgrade off the first revision.** Expected-ish. `upgrade head` recreates.

**Imported Base but metadata empty.** Import the model modules, not only `Base`.

**Two `sqlalchemy.url`s.** FastAPI `.env` vs `alembic.ini`. One source of truth.

**I put a password in `alembic.ini` and committed.** Rotate if it was real; fix git history later if needed; today remove it and add to `.gitignore` patterns. `.env.example` placeholders only.

**Used SQLite so Alembic would be easier.** No. PostgreSQL types and indexes are the point.

---

## Lecture: migrations are code review, not a button

A revision that `DROP TABLE` in `upgrade()` because autogenerate panicked is how you delete production. Tomorrow you will **read** autogenerate. Today you feel that `upgrade` and `downgrade` are **functions you wrote**. If you cannot reverse a `create_table` with `drop_table`, you are not ready to autogenerate a rename.

`env.py` is the **adapter** between Alembic and your app: metadata + URL. Treat it like `main.py` — small, explicit, no secrets.

Linear history: one `head`. If you write revisions on two laptops without pulling, you will need a merge. For 6B on one machine, pull is not the issue — **forgetting to commit `versions/`** is. A teammate (or future you) without the file cannot upgrade.

---

## Worked session — init, env.py, one table

`uv init` in day-01. Add sqlalchemy, psycopg, alembic. `CREATE DATABASE month11_w2d1`. `Hook` model. `alembic init alembic`. Wire `env.py`. Handwritten `create hooks`. `upgrade head`. `\dt`. `alembic_version`. `downgrade -1`. `--sql` snippet. Then `Peg` second revision. `CHAIN.md`. No `create_all` as the migration. No ops-api. No autogenerate dump.

Windows: `$env:DATABASE_URL` in the same PowerShell you run `uv run alembic`. If Alembic says it cannot connect, the child process did not inherit the var — set it again.

`psql` remains the camera. Alembic is not a GUI.

---

## Definition of done

- [ ] `alembic init` files exist and I can name them  
- [ ] `env.py` uses env URL + `Base.metadata`  
- [ ] Handwritten create table upgraded and downgraded  
- [ ] `alembic_version` inspected  
- [ ] Independent second revision in the chain  
- [ ] No password in git  
- [ ] Commit exists  

---

## Optional review links

Alembic init and env.py are explained in this chapter. These pages are for later checking, not for first learning.

- [Alembic tutorial](https://alembic.sqlalchemy.org/en/latest/tutorial.html)  
- [env.py](https://alembic.sqlalchemy.org/en/latest/tutorial.html#the-migration-environment)

---

## Tomorrow

**Autogenerate vs handwritten**, `upgrade`/`downgrade` as a habit, **adding a column and an index**. You will read the generated file and **edit** it. You will not accept a dump you do not understand.

---

# Closing lecture — history is the schema’s git

Git versions files. Alembic versions databases. `alembic_version` is the commit hash analog — a pointer, not the full diff. The diff is the files in `versions/`.

`create_all` is still useful in Week 1 labs. 6B startup that `create_all`s will fight Alembic (tables exist, revisions do not, or the reverse). Pick Alembic.

`env.py` imports models. Revisions use `op.*`. Models use `Mapped`. Three layers, one PostgreSQL.

Hooks are the noun. ops-api waits for Day 6. Autogenerate waits for Day 2. Downgrade is a development tool, not a production personality.

Read the SQL. Then git add `alembic/versions`.

---

## Recite-back checklist

Write `RECITE.txt`.

- [ ] A migration is replayable DDL (and sometimes DML)  
- [ ] `alembic_version` is a pointer  
- [ ] `env.py` imports models and reads the URL from the environment  
- [ ] `op.create_table` is not a Python class  
- [ ] `upgrade head` / `downgrade -1` both ran  
- [ ] no password in `alembic.ini`  
- [ ] `create_all` is not the 6B path  
- [ ] not ops-api  

If a line is mush, re-read Block A of **this** file only.

**Windows:** `$env:DATABASE_URL` must be set in the **same** PowerShell that runs `uv run alembic`. `psql -d month11_w2d1 -c "\dt"` is the camera. `uv run alembic current` should match the id in `alembic_version` after upgrade.

If `alembic` is not found, you ran it outside `uv run`. If `psycopg` is missing, `uv add` it in this project — Alembic uses SQLAlchemy’s engine, which still needs the driver.
