# Month 11 · Week 2 · Day 7
# Week Review — Migration Safety

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 3 — Python and backend  
**Month index:** [../../README.md](../../README.md)  
**Week 2:** [1](day-01.md) · [2](day-02.md) · [3](day-03.md) · [4](day-04.md) · [5](day-05.md) · [6](day-06.md) · Day 7 (today)  
**Week rhythm today:** Review, repair, plan Week 3  
**Student state:** You inited Alembic, reviewed autogenerate, told a NOT NULL story, expand/contracted, migrated tests, and started a 6B pack. Today **safety** must still live in your head — from **this file**.  
**Study time:** 3–4 focused hours

Do not start Week 3 because the calendar moved. Redis on a schema you cannot migrate is two problems.

Work in `~\fullstack-lab\month-11\week-02\day-07\`. Do not implement the mini-build inside `~/ops-api/`.

---

## How to read this chapter

This is a **closed-book teaching day**. The synthesis **is** the Week 2 lesson.

```mermaid
flowchart TB
  S[Speak synthesis] --> M[Mini-build migrations]
  M --> D[Debug]
  D --> R[Retro + Week 3 plan]
```

Days 1–6 closed during mini-build. Repair from **this** recap.

---

## Week synthesis (the lesson, in this book)

A **migration** is a replayable schema change. **Alembic** stores the pointer in **`alembic_version`**. **`env.py`** supplies **URL** (from environment, not a committed password) and **`target_metadata = Base.metadata`** (models **imported**). `alembic init` creates `alembic.ini`, `env.py`, `versions/`.

**upgrade head** applies files until current matches the tip. **downgrade -1** reverses one revision **in development**. Production prefers forward. Downgrade of a DROP is a data conversation.

**`create_all`** is a Week 1 lab door. 6B startup should **not** use it as the source of truth. Tests **`command.upgrade("head")`** on **`TEST_DATABASE_URL`**, then rollback fixtures. Two URLs.

**Autogenerate** diffs metadata vs database. It is a **draft**. It does not know **rename** (often drop+add, **data loss**), **backfill**, or tables it should not own. You **edit**. Empty autogenerate means match **or** empty metadata — check imports.

**NOT NULL story:** add **nullable** → **UPDATE** fill → **`alter_column` nullable=False**. Constant `DEFAULT` can be one DDL on PostgreSQL; you still own the three-beat story for computed fills.

**Expand/contract:** add new column; dual-write or dual-read; tighten; drop old when code stopped using it. HTTP CONTRACT.md moves with the overlap.

**Stamp** means “record this revision without running it.” Legal only when the database **already matches**. Otherwise you lie and the next autogen is chaos.

**Revision code** uses `op.*` / `sa.Column`. **App models** use `Mapped` / `mapped_column`. **Pydantic** uses `model_dump`. No `Query()`. No `.dict()`.

**Wrong belief:** “Autogenerate is the migration.”  
**Correct:** the **edited** `upgrade()` is the migration.

**Wrong belief:** “If models import, production is migrated.”  
**Correct:** `alembic current` on that database is the truth.

**Wrong belief:** “Downgrade is a production rollback plan.”  
**Correct:** it is a **dev** tool and a test of intent. Data-loss DROPs need a restore story, not muscle memory `downgrade`.

The sections below unpack that for the mini-build.

---

## Today's contract

**Today's gate.** Closed-book:

> I can explain alembic_version, env.py, autogenerate-as-draft, NOT NULL fill, expand/contract, test-DB upgrades, and I built a tiny chain (create → nullable column → backfill/NOT NULL or index) with upgrade/downgrade from this spec.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| 1 | 40 | Speak + `exam-01.md` |
| 2 | 55 | Mini-build `kits` table chain |
| 3 | 30 | Debug A–E |
| 4 | 20 | Review 6B MIGRATIONS.md — one fix |
| 5 | 20 | pytest migrate or `alembic current` proof |
| 6 | 20 | Design: why stamp is a lie when schemas differ |
| 7 | 20 | Retro + Week 3 |

---

# Complete explanation — safety you must still own

## 1. Files

`alembic.ini` placeholder URL. `env.py` online migrations. `versions/*.py` linear `down_revision`.

## 2. Order

Parents before children. Drop children before parents. Add nullable before NOT NULL. Do not drop the column the app still maps.

## 3. Review checklist (every revision)

- Does upgrade fail on **populated** tables?  
- Does downgrade drop data you still need in **dev**?  
- Did autogen drop a table you do not know?  
- Indexes named for `drop_index`?  
- SQL injection in `op.execute`? Constants only.

## 4. Tests

Session-scoped upgrade; function-scoped rollback; override `get_session`; `clear()`. Prove an extra column exists.

## 5. 6B

Your pack, your names. Mini-build is **kits**, not your product.

---

# Block 1 — Speak

No notes: create_all vs Alembic; env.py; autogenerate limits; three-beat NOT NULL; expand/contract; stamp; test URL.

Write `exam-01.md` (15–25 lines).

---

# Block 2 — Mini-build (Days 1–6 closed)

```powershell
cd ~\fullstack-lab
mkdir month-11\week-02\day-07\mini -Force
cd ~\fullstack-lab\month-11\week-02\day-07\mini
uv init --name lab-kits-mig
uv add sqlalchemy "psycopg[binary]" alembic
uv add --dev pytest
psql -U postgres -c "CREATE DATABASE month11_w2d7;"
psql -U postgres -c "CREATE DATABASE month11_w2d7_test;"
```

**Spec: field kits** — not 6B.

1. `Kit` model: `id`, `code` unique, `label`.  
2. Alembic init; env.py from `DATABASE_URL`.  
3. Revision: create `kits`.  
4. Insert two rows (`psql` or Session).  
5. Revision: add `status` **nullable**.  
6. Backfill `'packed'`; `status` NOT NULL (same revision after execute, or extra revision).  
7. Optional: index on `status`.  
8. `upgrade` / `downgrade -1` at least across the status add.  
9. pytest: set TEST URL, `command.upgrade("head")`, inspect `status` column exists. No FastAPI required if time is tight.

No autogen dump in `exam-01.md`. `STORY.md` three beats. `select()` if you query. No `Query()`.

```powershell
$env:DATABASE_URL = "postgresql+psycopg://postgres:YOUR_PASSWORD@127.0.0.1:5432/month11_w2d7"
uv run alembic upgrade head
```

---

# Block 3 — Debug

Write `exam-03-debug.md`.

**A.** Autogenerate includes `op.drop_table('spatial_ref_sys')` or `users` you do not own. Developer upgrades because pytest was green locally on `create_all`.  
**B.** Adds `status NOT NULL` in one autogen; table has rows; upgrade fails.  
**C.** Renames `label` → `title` by drop+add; GET returns null titles.  
**D.** Tests `create_all`; production missing latest index; CI green.  
**E.** `alembic stamp head` on a database created from old SQL that lacks `status`.

---

# Block 4 — Review 6B

Open **only** `MIGRATIONS.md` / `env.py` (not to paste into mini). One safety gap: `exam-04-6b.md`. If solid, `MATCH.txt`.

---

# Block 5 — Proof

`uv run pytest -q` in mini if you wrote the inspect test. Else `psql` `\d kits` after upgrade and a downgrade experiment on **test** DB.

---

# Block 6 — Design

`design.md`: 10–15 lines. Stamp vs upgrade from empty. When template-clone a DB to practice downgrade.

---

# Block 7 — Retro

`retro.md`: weakest revision; whether startup still `create_all`s in 6B; Week 3 question (Redis is optional and justified).

## Debug keys (after you write A–E)

**A.** Delete those ops. Metadata/URL wrong or unmanaged tables. Never apply unread drops.

**B.** Nullable + backfill + alter. Or a constant DEFAULT you can explain.

**C.** Expand/contract or `rename_column` with a data plan. Drop+add is data death.

**D.** Tests must `alembic upgrade`. `create_all` is a different schema factory.

**E.** Stamp lied. `status` never applied. Stamp only when `\d` matches the revision.

If you wrote “Alembic bug,” rewrite from the synthesis.

---

```powershell
cd ~\fullstack-lab
git add month-11
git commit -m "Month 11 Week 2 review: kits migrations and safety notes."
```

---

# Lecture: unread DDL is how you delete the product

The week’s skill is not `alembic revision --autogenerate`. It is **refusing** to run a draft that drops strangers, null-tightens too soon, or renames by destruction.

`alembic_version` is a pointer. Files are the diffs. You are the reviewer. `psql` `\d` is the camera. Tests that migrate are the second camera.

Redis next week will cache GET lists. If the column does not exist, you will cache 500s. Migration safety is a Redis prerequisite even though Redis is not SQL.

---

## Definition of done

- [ ] `exam-01.md` from memory  
- [ ] Mini chain upgraded  
- [ ] Debug A–E written  
- [ ] 6B note or MATCH  
- [ ] Retro exists  
- [ ] I will not start Redis with unread drops in 6B versions/  

---

# Worked session — kits mini

`uv init` in `day-07/mini`. Alembic init. Create kits. Two rows. Nullable status. Backfill. NOT NULL. Inspect on test DB via pytest or psql. Debug A–E. design.md stamp. retro.md no Redis until 6B upgrade is honest.

Windows: `$env:DATABASE_URL`, `uv run alembic`, `psql -d month11_w2d7`. Not ops-api.

If autogen is used, trim to the story. If the file is 400 lines, it is the wrong mini.

---

## Optional review links

Repair from this synthesis first.

- [Alembic autogenerate](https://alembic.sqlalchemy.org/en/latest/autogenerate.html)  
- [Alembic commands](https://alembic.sqlalchemy.org/en/latest/api/commands.html)

---

## Next week

[Week 3 Day 1 — Redis data types and when you are allowed to use it](../week-03/day-01.md). PostgreSQL remains the system of record.

---

# Closing lecture — forward is normal; unread is not

Upgrade is how environments meet. Downgrade is how you test that you **understood** the forward. Stamp is a scalpel. Autogenerate is a diff. Expand/contract is how you rename without lying to old processes.

Mini is kits. 6B is yours. `create_all` is not the test story. NOT NULL without a fill is a populated-table footgun.

Write A–E in full sentences. Retro names Redis as **justified or absent**, not as a résumé checkbox.

---

## Recite-back checklist

Write `RECITE.txt`.

- [ ] alembic_version is a pointer  
- [ ] env.py: URL + imported metadata  
- [ ] autogenerate is a draft  
- [ ] nullable → fill → NOT NULL  
- [ ] drop+add is not a rename  
- [ ] tests upgrade TEST_DATABASE_URL  
- [ ] stamp only when true  
- [ ] mini not in `~/ops-api/`

If any debug answer is “just stamp head,” rewrite it from the synthesis.
Do not start Week 3 until the kits chain upgrades and A–E are sentences.

---

## Office hours (review day)

**Two heads.** You branched revisions. `alembic merge` exists; for the mini, delete the extra unapplied file and keep a line. 6B on one laptop should stay linear if you always pull/commit `versions/`.

**`downgrade -1` after NOT NULL** leaves NULLs if you only alter nullable True without a policy. Fine. If you `drop_column` in downgrade, data in `status` is gone. STORY.md should say which downgrade you implemented.

**pytest inspect cannot find `kits`.** Upgrade did not run, or inspect used the wrong engine URL. Print `engine.url` in the test **without** the password (render with username only) — or print the database **name** only.

Windows: two databases `month11_w2d7` and `_test`. Do not mix. `uv run alembic current`. Mini is kits, not 6B.

Redis is next week. If retro wants Redis tonight, write why a missing column would be cached as 500s, then do not open Redis until kits upgrade.
