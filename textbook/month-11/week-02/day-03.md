# Month 11 · Week 2 · Day 3
# From Memory: Nullable Column, Then NOT NULL (the Default Story)

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 3 — Python and backend  
**Month index:** [../../README.md](../../README.md)  
**Week 2:** [1](day-01.md) · [2](day-02.md) · Day 3 (today) · [4](day-04.md) · [5](day-05.md) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Implement from memory  
**Student state:** Day 2 gate passed. You have init, autogenerate-as-draft, add column, upgrade/downgrade. Today you must still own the **expand** story: nullable add → backfill → NOT NULL.  
**Study time:** 3–4 focused hours  
**Prereq:** Day 2 gate passed.

Labs: `~\fullstack-lab\month-11\week-02\day-03\`. Do **not** copy Day 2 `versions/`. Do **not** paste `~/ops-api/`. Noun: **lab badges** (`badges` table).

---

## How Day 3 works

Days 1–2 stay **closed** during the build. This recap is the teacher.

Allowed: this file, your notes, `psql`, Alembic output.  
Not allowed: pasting a finished migration pack from AI, copying yesterday’s lockers revisions, accepting autogenerate you did not read.

Stuck **> 25 minutes**: open **only** the matching Day 1 or Day 2 section, close it, continue. Record `lookups.txt`.

There is **no complete revision file** in this chapter. The story is specified. You write it.

---

## How to read this chapter

Adding `NOT NULL` to a populated table in **one** step is how upgrades fail. The adult sequence is **expand**, then **tighten**.

```mermaid
flowchart LR
  A[add column NULL] --> B[backfill every row]
  B --> C["ALTER ... SET NOT NULL"]
  C --> D[model Mapped[str] not optional]
```

**Wrong belief:** “I’ll add `status TEXT NOT NULL DEFAULT 'active'` in one autogen and call it a day.”  
**Correct:** a **server default** can be a valid **one-step** for a constant. You must still be able to tell the **three-step story** (nullable → UPDATE → NOT NULL) because 6B will need it when the value is **computed**, not a constant. Today you practice the three-step even if a default would have worked.

**Wrong belief:** “Downgrade can skip the backfill reverse.”  
**Correct:** downgrade of NOT NULL is `nullable=True` (or drop the column if you are reversing the whole add). Be explicit.

---

## Complete explanation (Alembic you must still own)

**Init:** `uv run alembic init alembic`. `env.py`: import models, `target_metadata = Base.metadata`, URL from `os.environ["DATABASE_URL"]`. No password in committed `alembic.ini`.

**Revision chain:** `revision` id, `down_revision`. Linear `head`. Files in `alembic/versions/`.

**Commands:**

```powershell
uv run alembic revision -m "create badges"
uv run alembic revision --autogenerate -m "draft only if I will edit"
uv run alembic upgrade head
uv run alembic downgrade -1
uv run alembic current
uv run alembic history
```

**Operations:** `op.create_table`, `op.add_column`, `op.alter_column`, `op.create_index`, `op.drop_*`, `op.execute("UPDATE ...")` for backfill.

**Models:** SQLAlchemy 2.x `Mapped`, `mapped_column`. After the column is required in the database, the model should be `Mapped[str]` not `Mapped[str | None]` — **but** during the nullable phase the model may still allow None if old app code is running. That is expand-contract (Day 4). Today you may tighten the model in the same afternoon **after** the data is backfilled, because this is a lab, not two production deploys. Still write the **order** in `STORY.md`.

**Autogenerate:** diffs metadata vs DB. Will often try to add NOT NULL in one op. **Edit** it into nullable add + later alter, or reject the file and handwrite. Do not paste the dump into `STORY.md`.

**create_all:** not the 6B path. Lab may still use it only if you have not inited Alembic — you have. Do not mix.

**Pydantic:** if you touch schemas, `model_dump()`. Not `.dict()`. Not required if this is schema-only.

**Security:** backfill SQL should not interpolate user input. A lab `UPDATE badges SET status = 'active' WHERE status IS NULL` is a constant. Fine.

**Wrong belief:** “`server_default='active'` in SQLAlchemy is the same as backfilling existing rows.”  
**Correct:** `server_default` affects **new** rows (and can be used in `ADD COLUMN ... DEFAULT ...` which in PostgreSQL may rewrite or fill — know that PostgreSQL `ADD COLUMN ... NOT NULL DEFAULT` can work in one step for a constant). You still write the **nullable then UPDATE then NOT NULL** path today so computed fills have a home.

PostgreSQL note: `ADD COLUMN ... NOT NULL DEFAULT 'active'` is often accepted **as one DDL** for a constant default. Your memory exam is the **general** story, because 6B will copy from another column (`SET new = old`) where a constant default is the wrong fill.

---

## Today's contract

**Today's gate.** Closed-book:

> I created a table with Alembic, added a nullable column, backfilled, then set NOT NULL, with upgrade and downgrade that I ran. I can explain why one-step NOT NULL without a fill fails on populated tables.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 20 | Oral review |
| B | 40 | Paper: write upgrade/downgrade outlines |
| C | 90 | Implement spec |
| D | 35 | Defect hunt |
| E | 15 | lookups.txt |

---

# Block A — Speak first

Out loud:

1. What `alembic_version` holds.  
2. What `env.py` must import.  
3. Why autogenerate is a draft.  
4. Why NOT NULL add fails if rows exist and there is no fill.  
5. Order of drop in downgrade when an index exists.  
6. Why `create_all` fights Alembic.

If mush, re-read the recap only.

---

# Block B — Paper drills

`DRILLS.txt`:

1. Stub `upgrade()` for `create_table badges (id, code unique, owner_name)`.  
2. Stub `upgrade()` for `add_column status nullable`.  
3. Write the `UPDATE` that sets `status = 'active'` where NULL.  
4. Stub `alter_column` status to `nullable=False`.  
5. Write `downgrade()` for step 4, then 3 (no-op or leave values), then drop column.

You may combine 2–4 as **two or three revision files**. Three files is clearer for the story. Two is allowed if `STORY.md` still lists three moments.

---

# Block C — Spec (you implement)

```powershell
cd ~\fullstack-lab
mkdir month-11\week-02\day-03 -Force
cd ~\fullstack-lab\month-11\week-02\day-03
uv init --name lab-badge-mig
uv add sqlalchemy "psycopg[binary]" alembic
psql -U postgres -c "CREATE DATABASE month11_w2d3;"
$env:DATABASE_URL = "postgresql+psycopg://postgres:YOUR_PASSWORD@127.0.0.1:5432/month11_w2d3"
```

**CONTRACT:**

| Step | What |
|---|---|
| 0 | `alembic init`, `env.py` wired, `Badge` model |
| 1 | Revision: create `badges` (`id`, `code` unique, `owner_name`) |
| 2 | `upgrade head`. Insert **two rows** with a Session or `psql` INSERT (no `status` yet) |
| 3 | Revision: add `status` **nullable** |
| 4 | `upgrade`. Prove `\d badges` shows `status` nullable. Rows have NULL |
| 5 | Revision: `op.execute` backfill `'active'` (or `'issued'` — pick one and document) |
| 6 | Revision **or same file after execute**: `alter_column` NOT NULL |
| 7 | Model now `Mapped[str]` for status. App `select()` sees values |
| 8 | Downgrade path: you can reverse to “no status column” without leaving the DB unrestorable. Run it on this lab DB at least **once**, then upgrade back |

**Rules:** SQLAlchemy 2.x models. `select()` if you query. No `Query()`. No giant autogenerate dump in the lab README. Autogenerate allowed only if you **edit** toward this story. Prefer handwritten for steps 3–6.

Windows: PowerShell, `uv run alembic`, `psql`.

Stretch: unique index on `code` in create table; extra revision `ix_badges_status` non-unique.

Do not add FastAPI unless leftover time. Do not open Redis/Mongo.

---

# Block D — Defect hunt

1. After step 2 (rows exist), if you **skip** nullable and add NOT NULL without default — what does PostgreSQL say? Try on a **copy** or predict if you already tightened. `TRAP.txt`.  
2. Backfill omitted, then NOT NULL — same class of error.  
3. Downgrade drops column while a **view** exists — skip views; you have none.  
4. `op.execute` typo table name — upgrade fails; database revision **not** advanced if the transaction rolled back. Confirm `alembic current`.  
5. Model still `Mapped[str | None]` after NOT NULL — honesty in `MODEL.txt`: DB vs Python.

**Trace 1.** `\d badges` after each upgrade. Paste three `\d` snippets (create / nullable / not null) into `DESCRIBE.txt`.

**Trace 2.** `SELECT code, status FROM badges;` after backfill — no NULL.

**Trace 3.** `downgrade` to before status; `\d` has no status; data otherwise intact.

---

# Block E — Lookups

`lookups.txt` or `none`.

```powershell
cd ~\fullstack-lab
git add month-11
git commit -m "Month 11 Week 2 Day 3: nullable then NOT NULL badge status."
```

---

# Lecture: three moments even when PostgreSQL allows one

PostgreSQL can `ADD COLUMN status TEXT NOT NULL DEFAULT 'active'` in one command. Teams still split the work when:

- the fill is **not** a constant (`status` copied from `legacy_state`)  
- the old app **cannot** send `status` yet (expand: nullable; new app writes it; then NOT NULL)  
- you need to **deploy code** that understands both NULL and a value (Day 4)

Today you split so the sequence is in your fingers. `STORY.md` must list the moments in English. If your revisions are combined, the English still has three beats.

`alter_column('badges', 'status', existing_type=sa.String(...), nullable=False)` — Alembic likes `existing_*` hints. If you omit them, it may still work on PostgreSQL. If autogenerate included `existing_nullable=True`, keep it; it documents the before state.

Do not `op.execute(f"UPDATE badges SET status = '{user}'")`. Constants only.

---

## Definition of done

- [ ] Spoke Block A  
- [ ] Rows existed **before** NOT NULL  
- [ ] Backfill ran; no NULL left  
- [ ] NOT NULL applied  
- [ ] Downgrade proven once  
- [ ] `STORY.md` + `DESCRIBE.txt`  
- [ ] No ops-api paste  
- [ ] Commit exists  

---

# Worked session — badges, three beats

`uv init`, alembic init, wire env.py, `Badge` model. Create table revision. Upgrade. Insert two badges. Add nullable status. Upgrade. UPDATE backfill. alter NOT NULL. Model required. `\d` at each step. Downgrade to pre-status, upgrade back. `STORY.md`. `TRAP.txt`. No locker copy. No `Query()`.

If `alembic current` is behind files, you edited an applied revision — do not. New file.

If backfill is in the same revision as add_column, order inside `upgrade()` still matters: add, execute, alter.

---

## Optional review links

Repair from this recap first.

- [Alembic op.alter_column](https://alembic.sqlalchemy.org/en/latest/ops.html#alembic.operations.Operations.alter_column)  
- [Alembic op.execute](https://alembic.sqlalchemy.org/en/latest/ops.html#alembic.operations.Operations.execute)

---

## Tomorrow

**Lab:** evolve a schema **safely** with expand/contract across a fake “old app / new app” boundary — not only a column fill, but a contract the HTTP layer could survive.

---

# Closing lecture — fill, then tighten

NOT NULL is a promise about **every** row. You cannot promise until every row has a value. Nullable add is permission. UPDATE is the fill. ALTER is the promise.

Autogenerate will try to skip the story. You will not let it.

Badges, not 6B. `psql` `\d` after every upgrade. Downgrade is part of memory day. `lookups.txt` is honesty.

`Mapped` follows the database you actually have **or** you document the lag. Lying in the model is how Sessions insert NULL into a NOT NULL column and you blame PostgreSQL.

---

## Recite-back checklist

Write `RECITE.txt`.

- [ ] alembic_version is a pointer  
- [ ] env.py imports models  
- [ ] nullable add before NOT NULL  
- [ ] backfill is UPDATE  
- [ ] downgrade run once  
- [ ] no unread autogen dump  
- [ ] not ops-api
