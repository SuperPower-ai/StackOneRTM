# Month 11 · Week 2 · Day 4
# Lab: Evolve a Schema Safely (Expand / Contract)

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 3 — Python and backend  
**Month index:** [../../README.md](../../README.md)  
**Week 2:** [1](day-01.md) · [2](day-02.md) · [3](day-03.md) · Day 4 (today) · [5](day-05.md) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Lab  
**Student state:** You can add a nullable column, backfill, and tighten NOT NULL. Today you apply **expand/contract** to a change that would otherwise **break old code** — a rename-shaped evolution with two columns living together.  
**Study time:** 3–4 focused hours

Labs: `~\fullstack-lab\month-11\week-02\day-04\`. Noun: **mail slots**. Do **not** implement inside `~/ops-api/`.

---

## How to use this textbook

1. The lab has **phases**. Do not jump to DROP.  
2. Type HTTP only as far as it proves the contract: old field still works while the new one exists.  
3. Autogenerate may propose drop+add. **Reject** that as the rename.

---

## How to read this chapter

**Expand/contract** (also called expand-and-contract, parallel change) means:

1. **Expand** the schema (and maybe the API) so old and new shapes both work.  
2. **Migrate** data and callers.  
3. **Contract**: remove the old column/field when nothing reads it.

```mermaid
flowchart TB
  V1["v1: label TEXT NOT NULL"] --> EX["expand: add title nullable"]
  EX --> COPY["backfill title from label"]
  COPY --> APP["app writes both / reads title with fallback"]
  APP --> NN["title NOT NULL"]
  NN --> CON["contract: drop label"]
```

A single `RENAME COLUMN label TO title` can work **if** you deploy database and app in one lockstep and no replica lags and no second process uses `label`. 6B on a laptop might survive a rename. You still **practice** expand/contract because production and “old TestClient fixtures” will not always lockstep.

**Wrong belief:** “I’ll `op.rename_column` and fix FastAPI in the same commit; that is safer.”  
**Correct:** same-commit lockstep is **a** strategy. Expand/contract is the one that survives **two versions** running. Learn it as the default for destructive-looking changes.

**Wrong belief:** “Autogenerate drop `label` add `title` is a rename.”  
**Correct:** that **copies no data**. Upgrade would empty `title` and destroy `label`.

---

## Today's contract

By the end of this day you will be able to:

1. Start from a `slots` table with `label`.  
2. Expand: add `title` nullable; backfill from `label`; keep `label`.  
3. Point a small FastAPI GET/POST at **title with fallback to label** (or write both).  
4. Tighten `title` NOT NULL.  
5. Contract: drop `label` in a **later** revision after you stopped reading it.  
6. Show upgrade/downgrade for expand; contract downgrade is “add label back” if you still care — document the data loss risk of contract downgrade.

**Today's gate.** Closed-book:

> I evolved a populated table without a drop+add rename. Old and new columns overlapped. I contracted only after the app stopped needing the old column. Autogenerate did not silently delete data.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 35 | Theory: expand/contract vs lockstep rename |
| B | 80 | Lab phases 0–3 (expand + app) |
| C | 50 | Phases 4–5 (tighten + contract) + notes |
| D | 15 | Git |
| E | 15 | Recall |

---

# Block A — Theory

## 1. Who is “old app”?

In production: an old Uvicorn still running while you migrate. In this lab: **your own GET handler** that still accepts or returns `label` during expand. You simulate two clients with `curl.exe`:

- Client A posts `{"label": "Box 12"}`  
- Client B posts `{"title": "Box 12"}`  

During expand, both should create a row. Document which fields you store.

## 2. Dual-write vs dual-read

**Dual-read:** store `label` as source; `title` filled by backfill; GET returns `title or label`.  
**Dual-write:** POST sets both columns to the same string until contract.

Pick one, write it in `CONTRACT.md`. Dual-write makes contract easier (both columns populated). Dual-read is less write traffic. Lab: **dual-write** if you have POST; dual-read if GET-only plus SQL backfill.

## 3. Pydantic

`SlotCreate` may have `title: str | None = None` and `label: str | None = None` during expand, with a validator or handler rule: at least one required. Out may include both for a while, then only `title`. **`model_dump()`**, not `.dict()`. `response_model` allowlist.

## 4. Alembic phases as **separate revisions**

| Rev | upgrade |
|---|---|
| 1 | create slots (`id`, `label` NOT NULL) |
| 2 | add `title` nullable |
| 3 | `UPDATE slots SET title = label WHERE title IS NULL` |
| 4 | `alter_column title NOT NULL` |
| 5 | drop `label` (contract) — **only after** app ignores `label` |

You may merge 2+3. Do not merge 5 with 2.

## 5. Downgrade honesty

Downgrade 5→4: `add_column label` — **data in label is gone** unless you copy `title` back in downgrade. Write `op.execute("UPDATE slots SET label = title")` in downgrade **before** you cannot. That is a **lab courtesy**. Production contract downgrades are rare; still think.

---

# Block B — Lab phases 0–3

```powershell
cd ~\fullstack-lab
mkdir month-11\week-02\day-04 -Force
cd ~\fullstack-lab\month-11\week-02\day-04
uv init --name lab-slots-evolve
uv add fastapi uvicorn sqlalchemy "psycopg[binary]" alembic pydantic
uv add --dev pytest httpx
psql -U postgres -c "CREATE DATABASE month11_w2d4;"
$env:DATABASE_URL = "postgresql+psycopg://postgres:YOUR_PASSWORD@127.0.0.1:5432/month11_w2d4"
```

`alembic init`; wire `env.py`. Models 2.x. Session per request as Week 1 Day 4.

**Phase 0.** Revision create `slots`. Upgrade. Seed two rows with `label` only (psql or seed script).

**Phase 1–2.** Add `title` nullable; upgrade; backfill; `\d slots` shows both columns. `SELECT id, label, title`.

**Phase 3.** FastAPI:

| Method | Path | Rules |
|---|---|---|
| GET | `/health` | 200 |
| GET | `/slots` | 200 array; JSON has `title` (from title or fallback) |
| GET | `/slots/{id}` | 200 / 404 |
| POST | `/slots` | 201; accept `title` and/or `label` per CONTRACT.md |

`select()` not `Query()`. Bind `127.0.0.1`.

```powershell
uv run uvicorn main:app --reload --host 127.0.0.1 --port 8000
curl.exe -s http://127.0.0.1:8000/slots
```

Write `EXPAND.txt`: both columns present; GET still works for the two seed rows.

---

# Block C — Tighten and contract

**Phase 4.** `title` NOT NULL. Upgrade. Try INSERT with NULL title in `psql` — should fail. App dual-write should always set title.

**Phase 5.** Remove `label` from Out and Create. Deploy that code **in the lab** (you just edit). Then revision drop `label`. Upgrade. `\d slots` has no `label`. GET still 200.

`CONTRACT.md` updated **before** you drop — Month 9 habit. If you drop first, you are evolving by accident.

`DOWNGRADE.txt`: what `downgrade -1` after drop does to data. Run it once on the lab DB, then upgrade back.

Stretch: TestClient test that POST `label` only still 201 **before** contract, and 422 after. That test documents the contract change. Two test files or a marked skip — do not keep a test that requires `label` after drop without updating it.

```powershell
cd ~\fullstack-lab
git add month-11
git commit -m "Month 11 Week 2 Day 4: expand-contract slots label to title."
```

---

# Block E — Recall

1. Why drop+add is not a rename.  
2. Dual-write vs dual-read.  
3. When it is legal to DROP the old column.  
4. Why contract downgrade needs a copy-back.  
5. Why CONTRACT.md moves **before** the drop revision.

## Office hours

**Autogenerate at phase 5 also drops something else.** Metadata mismatch. Import all models. Do not apply.

**POST 422 after expand.** Your Create model required `title` too soon. Expand means old client still works.

**`title` NULL after backfill.** UPDATE did not run or ran before add_column committed. Check `alembic current` and `SELECT`.

**Session still using `Slot.label` after drop.** You contracted the DB before the ORM. Order: code stop reading → migrate drop → remove mapped_column.

**I renamed with `op.alter_column(..., new_column_name=...)` only.** Legal PostgreSQL rename; skip dual-write. Write in `NOTES.md` that you chose lockstep **and** still wrote the expand story in English. The lab prefers you **perform** expand/contract, not only essay it. If time is gone, essay + one nullable add is not enough — do phases 1–5 on this small table.

---

## Lecture: HTTP contract and schema contract move together

Month 9 CONTRACT.md is an HTTP promise. Alembic is a schema promise. Expand/contract is when they **disagree on purpose for a while**. Document the overlap. `/docs` will show both fields if your Pydantic still has both — that is correct during expand.

6B will rename something this year (you will). If you only know drop+add, you will empty a column of issues or inventory counts. This lab is cheap. That is not.

N+1 is not today’s villain. Do not nest a second resource. One table.

---

## Worked session — slots, two columns, then one

Init Alembic. Create `slots(label)`. Seed. Add `title` NULL. Backfill. FastAPI list/get/post with dual-write or fallback. Tighten NOT NULL. Stop using `label` in Out. Drop `label`. `curl.exe` still lists titles. `DOWNGRADE.txt`. `CONTRACT.md` twice (expand version, contract version) or one file with dated sections.

Windows: `uv run alembic`, `psql \d slots`, `curl.exe`. Database `month11_w2d4`. No ops-api. No Mongo.

`from_attributes` Out. `model_dump` if needed. `HTTPException` 404.

---

## Definition of done

- [ ] Seed rows survived the expand  
- [ ] `title` backfilled from `label`  
- [ ] App worked during overlap  
- [ ] `label` dropped only after code stopped needing it  
- [ ] CONTRACT.md matches the **current** API  
- [ ] Downgrade note written  
- [ ] Commit exists  

---

## Optional review links

- [Alembic batch / alter](https://alembic.sqlalchemy.org/en/latest/batch.html) — PostgreSQL often does not need batch; do not copy SQLite-only patterns blindly  
- [Expand-contract (parallel change)](https://martinfowler.com/bliki/ParallelChange.html)

---

## Tomorrow

**Test database + running migrations in tests** (`alembic upgrade head` in pytest setup, not `create_all` as the 6B story).

---

# Closing lecture — overlap is the safety

The unsafe rename is a jump. The safe rename is a **bridge**: two columns, then one.

Autogenerate does not love you. It diffs. You supply the bridge with `add_column`, `UPDATE`, dual-write, `drop_column`.

Mail slots are the noun. 6B Day 6 will need this when **your** schema changes under real rows.

Prove with `\d` and `curl.exe`, not with a screenshot of a GUI wizard.

---

## Recite-back checklist

Write `RECITE.txt`.

- [ ] drop+add is data loss, not a rename  
- [ ] expand adds the new column beside the old  
- [ ] backfill copies values  
- [ ] dual-write or dual-read during overlap  
- [ ] CONTRACT.md moves before DROP  
- [ ] contract downgrade needs a copy-back if you care  
- [ ] autogenerate was not allowed to delete `label` unread  
- [ ] not ops-api  

**HTTP during overlap.** Client A sends `label`. Client B sends `title`. Both 201. If you 422 `label` too early, you did not expand — you lockstepped the API ahead of the story.

**SQLAlchemy model during overlap.** You may have **both** `label` and `title` mapped. After drop, remove `label` from the class **in the same release you drop**, or the Session will INSERT a missing column. Order: stop writing label in Python → migrate drop → delete mapped_column.

Windows: `uv run alembic history`, `psql \d slots`, `curl.exe` GET `/slots`. Bind 127.0.0.1. `model_dump` on Out. `select()` not `Query()`.

If POST is 200, set `status_code=201`. Month 9 still applies. The ORM is not a status code.

---

## Predicted `\d` snapshots (write before you run)

| After revision | `label` | `title` |
|---|---|---|
| create slots | NOT NULL | absent |
| expand | NOT NULL | nullable |
| backfill | still there | values copied |
| tighten | still there | NOT NULL |
| contract | absent | NOT NULL |

If a cell surprises you, the revision order is wrong. Do not DROP `label` while GET still reads it.

**curl.exe during expand:** POST `{"label":"A"}` 201; GET shows `title` filled if you dual-write or fallback. POST `{"title":"B"}` 201. After contract, POST `{"label":"C"}` is 422 if Create dropped `label`.

Windows quoting: use `body.json`. Bind 127.0.0.1. Database `month11_w2d4`.
