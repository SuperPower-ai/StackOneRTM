# Month 11 · Week 2 · Day 6
# Independent: Migration Pack for Project 6B

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 3 — Python and backend  
**Month index:** [../../README.md](../../README.md)  
**Week 2:** [1](day-01.md) · [2](day-02.md) · [3](day-03.md) · [4](day-04.md) · [5](day-05.md) · Day 6 (today) · [7](day-07.md)  
**Week rhythm today:** Independent implementation  
**Student state:** You can init Alembic, review autogenerate, expand/contract, and migrate a test DB. Today **your** `~/ops-api/` gets a **real revision chain**. This textbook will **not** write it.  
**Study time:** 3–4 focused hours

Work in **`~/ops-api/`**. Checklists in `~\fullstack-lab\month-11\week-02\day-06\`.

---

## How to use this textbook

1. Open **your** Week 1 Day 6 inventory and models first. Empty Alembic on a schema you did not map is theater.  
2. AI may review a revision; it may not invent your tables.  
3. If Month 10 already created tables **without** `alembic_version`, you must choose **stamp vs generate-from-empty** honestly — see Block A.  
4. Optional review links are for later rechecking.

---

## How to read this chapter

A **migration pack** for 6B is:

- `alembic.ini` + `env.py` wired to **your** `Base` and env URL  
- at least an **initial** revision that matches **your** tables  
- at least **one later** change: a **column** or an **index** (project spec Stage B Alembic)  
- `upgrade head` / `downgrade -1` proven on a **dev** database  
- README / `MIGRATIONS.md` commands  
- test database still distinct  

```mermaid
flowchart TB
  INV[Day 6 inventory] --> MOD[2.x models]
  MOD --> ENV[env.py metadata]
  ENV --> R0[revision: baseline]
  R0 --> R1[revision: column or index]
  R1 --> DEV[upgrade on dev]
  R1 --> TST[upgrade on test URL]
```

**Wrong belief:** “I’ll autogenerate from empty against production-shaped data and commit the dump.”  
**Correct:** you **read** every operation. You split if the file is a novel. You never drop tables you do not own.

**Wrong belief:** “I’ll keep `create_all` in FastAPI startup and also Alembic.”  
**Correct:** pick Alembic. Remove startup `create_all` or you will hide missing revisions.

---

## Today's contract

By the end of this day you will be able to:

1. `alembic init` in **your** repo (if not already).  
2. Wire `env.py` to your models and `DATABASE_URL`.  
3. Produce a baseline revision that matches your Month 10 tables (handwritten, autogen-edited, or stamp **documented**).  
4. Add a second revision: column **or** index.  
5. `upgrade` and `downgrade -1` on **dev**.  
6. Write `MIGRATIONS.md` (commands, Windows PowerShell).  
7. Note how tests will `upgrade` (Day 5 pattern) even if you only sketch the fixture.

**Today's gate.** Closed-book:

> 6B schema history lives in Alembic. I can upgrade and downgrade in development. I did not paste a tutorial ops-api. I did not leave create_all as the source of truth.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 25 | Baseline strategy (empty vs stamp) |
| B | 40 | init + env.py + baseline |
| C | 90 | second revision + upgrade/downgrade |
| D | 30 | docs + test URL note |
| E | 15 | PROGRESS.md |

---

# Block A — Choose a baseline (do this first)

Write `~\fullstack-lab\month-11\week-02\day-06\BASELINE.md` answering:

**Does the dev database already have tables from Month 10 SQL?**

**Path 1 — disposable dev DB:** drop/create `opsapi_dev` (or whatever you use), run Alembic from empty, revisions `create_*` for your tables. Data you needed: re-seed. Cleanest history.

**Path 2 — keep tables, stamp:** if the live tables **already match** models, `alembic revision --autogenerate` may be empty after stamp. Procedure: generate a revision that **would** create everything, **stamp** the database to that revision **without** running create (because tables exist). If stamp + empty autogen, you claimed “DB matches models.” If autogen then wants changes, **do not stamp past them** — run them.

**Path 3 — autogen against empty metadata disaster:** forgotten imports. Forbidden.

Stamp is a **lie that is true** only when the schema already matches the revision you stamp. Write the exact commands you used. If you cannot explain stamp, use Path 1 on a **new** database name and leave the old one alone.

**Forbidden:** `drop_all` on a database you cannot recreate. `psql` `\dt` first.

---

# Complete explanation (keep open; other week files closed)

**env.py:** import all model modules; `target_metadata = Base.metadata`; URL from environment; no committed password.

**2.x models:** `Mapped`, `mapped_column`, `ForeignKey`, `back_populates`. Revisions use `op.*` and `sa.Column`, not class bodies.

**Autogenerate:** draft. Rename ≠ drop+add. NOT NULL needs a fill story. Expand/contract for lockstep-hostile changes.

**Commands (Windows):**

```powershell
cd ~\ops-api
$env:DATABASE_URL = "postgresql+psycopg://postgres:YOUR_PASSWORD@127.0.0.1:5432/YOUR_DEV_DB"
uv run alembic current
uv run alembic history
uv run alembic upgrade head
uv run alembic downgrade -1
uv run alembic upgrade head
```

Use `uv run` or **your** 6A runner — be consistent. `py -3` if that is how you invoke scripts.

**Tests:** `TEST_DATABASE_URL`, `command.upgrade` in conftest, rollback. If not finished today, `TESTS.md` lists it as next.

**HTTP:** still FastAPI. Wiring Session to routes may be in progress. `PROGRESS.md` honest.

**Pydantic:** `model_dump`, not `.dict()`.

**Not today:** Redis, Mongo, Docker-as-the-course. Docker only if you already run Postgres that way from Month 10 — not required.

---

# Block B — Init and baseline

In `~/ops-api/`:

```powershell
uv add alembic
uv run alembic init alembic
```

If the folder exists, do not init twice. Wire `env.py`. `.env.example` placeholders.

Baseline revision: **read it**. If it is huge, that may still be honest for a first create — but you must be able to say what the FKs are. Split by table only if you still get a linear chain and FKs order (parents first).

Upgrade on **dev**. `\dt` matches inventory.

---

# Block C — Second revision (required)

Project spec: practice adding a **column** and/or **index**. Do **one** real change you can justify (example **shapes**, not your domain dictated):

- nullable `archived_at`  
- index on a FK you filter by  
- `notes` text nullable  

Use expand rules if NOT NULL. Autogenerate + **edit**, or handwritten.

`upgrade head`. App still starts. `downgrade -1` on **dev** (you accept data loss on that column). `upgrade head` again.

If downgrade is too scary because you already have precious seed data, **clone** a database: `CREATE DATABASE opsapi_miglab TEMPLATE opsapi_dev;` (PostgreSQL template) and practice downgrade **there**. Write that you did.

---

# Block D — Docs

`MIGRATIONS.md` in ops-api:

- how to set URL on PowerShell  
- `alembic upgrade head`  
- how tests will migrate  
- “do not create_all on startup”  
- baseline strategy (link to BASELINE.md or copy the paragraph)

README pointer to that file.

Do not commit `.env`.

---

# Block E — Recall

1. Why stamp is dangerous if schemas differ.  
2. Why startup `create_all` hides missing upgrades.  
3. Parent tables before child FKs in a baseline.  
4. What your second revision actually did.  
5. Test URL vs dev URL.

## Quality bar

Too thin: one empty `pass` revision and `create_all` still in `main`.  
Too thick: a downloaded “enterprise” migration pack with ten unused tables.

**Forbidden rescue:** copying Day 4 `slots` into 6B as the product.

If autogenerate wants to drop Month 10 reporting tables you still use, **those tables need models or need to be excluded**. `include_object` in env.py is advanced; listing them in `NOTES.md` and keeping them is honest. Do not drop reporting tables to make autogen quiet.

---

## Predicted failures

| Symptom | Cause |
|---|---|
| autogen drops everything | wrong URL or empty metadata |
| FK order error on upgrade | child table before parent |
| app 500 column missing | models ahead of `alembic current` |
| password in git | alembic.ini |

```powershell
# you commit in ops-api — example message:
# git commit -m "Add Alembic baseline and one schema evolution for 6B."
```

Also commit lab notes in fullstack-lab.

---

## Definition of done

- [ ] BASELINE.md chosen path  
- [ ] env.py wired; no secrets in git  
- [ ] baseline applied to a database you control  
- [ ] second revision: column or index  
- [ ] downgrade proven on dev or a clone  
- [ ] MIGRATIONS.md  
- [ ] no tutorial ops-api paste  
- [ ] PROGRESS.md honest  

---

## Optional review links

Week 2 Days 1–5 in this textbook. Project 6 Stage B **Alembic** heading in `full_stack_project_requirements_2026/project_06_production_style_backend_system.md` — headings only.

- [Alembic tutorial](https://alembic.sqlalchemy.org/en/latest/tutorial.html)

---

## Tomorrow

**Week review: migration safety** — synthesis, mini-build in fullstack-lab, debug, retro. Do not start Redis because the calendar moved.

---

# Closing lecture — your history, your tables

The pack is not a badge. It is how a second machine builds your schema without `psql` folklore.

Stamp only when true. Autogenerate only when read. Expand when NOT NULL or rename would burn data. Tests migrate. Startup does not `create_all`.

This file contains **no** of your table names. If a chatbot filled them, delete and write yours.

PROGRESS.md tells whether HTTP already uses the Session. Week 3 will not cache a schema you cannot migrate.
