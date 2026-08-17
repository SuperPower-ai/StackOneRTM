# Month 10 · Week 4 · Day 3
# From Memory: OFFSET vs Keyset Pagination, and N+1

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 3 — Python and backend  
**Month index:** [../../README.md](../../README.md)  
**Week 4:** [1](day-01.md) · [2](day-02.md) · Day 3 (today) · [4](day-04.md) · [5](day-05.md) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Implement from memory  
**Student state:** You can read EXPLAIN. Today **pagination** and **N+1** must live in your head — from **this file**.  
**Study time:** 3–4 focused hours  
**Prereq:** Day 2 gate passed.

Labs: `~\fullstack-lab\month-10\week-04\day-03\`. Use `w4_tickets`. Days 1–2 closed 25 minutes. No complete solution dump. No SQLAlchemy. No ORM lazy-load lecture — N+1 is a **SQL loop**.

---

## How Day 3 works

Allowed: this recap, `psql`, EXPLAIN output.  
Not allowed: pasting Day 1 indexes as the whole day, AI pagination templates, attacking other systems.

Stuck > 25 min: open only the matching earlier section, log `lookups.txt`.

---

## How to read this chapter

**OFFSET pagination** skips `N` rows then takes `LIMIT`. It is simple and gets expensive and **unstable** when new rows insert at the front. **Keyset** (seek) pagination says “give me rows **after** this `(created_at, id)`” using a WHERE on the sort key. **N+1** is: one query for N parents, then **one query per parent** for children — N+1 round trips. It is a **loop of SQL**, not a mysterious ORM curse. JOINs or `WHERE parent_id IN (…)` (or a later `= ANY`) fetch children in **one** (or few) statements.

```mermaid
flowchart TB
  OFF[OFFSET 10000] --> S[Scan/skip many rows]
  KEY[WHERE created_at < $t OR ...] --> I[Index-friendly seek]
  LOOP[for each project: SELECT tickets] --> N1[N+1 round trips]
  IN[WHERE project_id = ANY($ids)] --> ONE[One child query]
```

**Wrong belief:** “Page 200 with OFFSET is the same cost as page 1.”  
**Correct:** OFFSET 1990 still makes the engine **find and discard** those rows.

**Wrong belief:** “N+1 is only SQLAlchemy lazy loading.”  
**Correct:** a Python `for p in projects: cur.execute(… WHERE project_id = %s)` is N+1 with raw SQL.

---

## Complete explanation (you must still own)

**LIMIT 20** is a cap. Combined with **ORDER BY** it is a page. Without ORDER BY it is random-ish.

**OFFSET 40 LIMIT 20** is page 3 if pages are 20. Problems: (1) cost grows with OFFSET; (2) if a new ticket inserts at the top, rows **shift** — user sees duplicates or skips; (3) EXPLAIN often still walks a lot.

**Keyset:** sort by `(created_at DESC, id DESC)` — unique tie-breaker. Next page:

```sql
WHERE (created_at, id) < ($last_created_at, $last_id)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

Or the expanded form:

```sql
WHERE created_at < $t
   OR (created_at = $t AND id < $last_id)
```

Use placeholders. The client sends the last row’s key, not page number. You cannot jump to “page 50” cheaply without a different design. That is the trade.

**N+1:** 50 projects, 50 extra ticket queries. Fix: JOIN (fan-out: group in app or aggregate in SQL) or:

```sql
SELECT * FROM w4_tickets WHERE project_id IN (1,2,3); -- still bind a list properly
```

In psycopg, passing a list to `= ANY(%s)` is the parameterized form. Do not interpolate ids into a string.

**COUNT(*) OVER()** or a separate `SELECT COUNT(*)` for total: OFFSET UIs often want total pages. COUNT is extra cost. Keyset UIs often have **next** without total. Month 9 list envelopes used `total` — SQL must compute it honestly (`COUNT(*)` filtered, not `len(page)`).

Indexes: keyset wants the **ORDER BY** columns indexed (Day 1 composite). OFFSET may seq scan or sort. EXPLAIN in sentences.

---

## Today's contract

**Today's gate.** Closed-book:

> OFFSET skips rows and can drift. Keyset uses WHERE on the sort key plus LIMIT. N+1 is a loop of queries; I can write one IN/ANY or JOIN instead. I demonstrated both pagination styles and an N+1 vs one-query pair on w4_tickets.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| 1 | 25 | Speak recap |
| 2 | 90 | OFFSET + keyset + EXPLAIN sentences |
| 3 | 45 | N+1 vs IN/ANY |
| 4 | 20 | Git |
| 5 | 15 | Recall |

---

# Block 1 — Speak

OFFSET vs keyset; why `id` is in the key; N+1 as a for-loop. Then Block 2.

---

# Block 2 — Spec

```powershell
mkdir ~\fullstack-lab\month-10\week-04\day-03 -Force
cd ~\fullstack-lab\month-10\week-04\day-03
```

You write:

1. `page_offset.sql` — `ORDER BY created_at DESC, id DESC LIMIT 10 OFFSET 20`  
2. `page_keyset.sql` — first page LIMIT 10; second page using the last row’s `(created_at, id)` from page 1 (placeholders or psql variables).  
3. `EXPLAIN ANALYZE` both; `PLANS.md` four sentences each: did OFFSET look more expensive?  
4. `DRIFT.md`: insert a ticket with `created_at = now()`, then rerun OFFSET page 1 vs keyset page 1 — which shifted?

25-minute closed-book for the two page queries.

---

# Block 3 — N+1

Write `n_plus_one.md` describing a Python loop (you may write `nplusone.py` that **must not** be the submitted “good” path). Then `one_query.sql`: tickets for a set of project ids in **one** statement. Optional tiny psycopg: loop vs `ANY(%s)` with a list; print query counts (you count `execute` calls). Placeholders only.

Write `TOTAL.md`: how Month 9 `total` maps to `SELECT COUNT(*) FROM w4_tickets WHERE …` — not `len(page)`.

---

# Block 4 — Git

```powershell
cd ~\fullstack-lab
git add month-10\week-04\day-03
git commit -m "Month 10 Week 4 Day 3: keyset pagination and N+1."
```

---

# Block 5 — Recall

1. Why OFFSET 100000 hurts.  
2. Why keyset needs a unique sort.  
3. N+1 in one sentence without saying ORM.  
4. total vs page length.  
5. Placeholders for ANY.

## Office hours

**Tuple comparison `(created_at, id) < ($t, $id)`.** PostgreSQL supports row comparison. Expanded OR form is fine if clearer.

**Clock skew / equal timestamps.** That is why `id` is in the key.

**I used SQLAlchemy `.options(selectinload)`.** Stop. Month 11. Today IN/ANY or JOIN.

---

## Definition of done

- [ ] OFFSET and keyset queries  
- [ ] PLANS.md sentences  
- [ ] DRIFT.md  
- [ ] one_query vs loop documented  
- [ ] Commit exists  

---

## Tomorrow

Lab: **reporting pack** (3–5 queries: JOIN, GROUP, CTE, window) on **YOUR** Project 6 schema.

---

## Optional review links

The recap in this file is the teacher.

- [PostgreSQL: LIMIT OFFSET](https://www.postgresql.org/docs/current/queries-limit.html)
- [PostgreSQL: EXPLAIN](https://www.postgresql.org/docs/current/sql-explain.html)
