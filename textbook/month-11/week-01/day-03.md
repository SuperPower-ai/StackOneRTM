# Month 11 · Week 1 · Day 3
# Implement From Memory: Two Models and a Query

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 3 — Python and backend  
**Month index:** [../../README.md](../../README.md)  
**Week 1:** [1](day-01.md) · [2](day-02.md) · Day 3 (today) · [4](day-04.md) · [5](day-05.md) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Implement from memory  
**Student state:** Day 2 gate passed. You have typed `Mapped`, `mapped_column`, `ForeignKey`, `back_populates`, `Session.begin`, `select()`. Today those ideas must still live in your head — from **this file**.  
**Study time:** 3–4 focused hours  
**Prereq:** Day 2 gate passed.

Labs: `~\fullstack-lab\month-11\week-01\day-03\`. Do **not** copy Day 1 or Day 2 projects. Do **not** paste `~/ops-api/`. **Lab stations** and **instruments** are the noun.

---

## How Day 3 works

Days 1–2 stay **closed** during the build. This recap is the teacher.

Allowed:

- The complete explanation in this file  
- Your own notes in `fullstack-lab`  
- `psql` and echo SQL in front of you  

Not allowed:

- Pasting a finished ORM from AI  
- Copying Day 1–2 `models.py`  
- Browsing SQLAlchemy docs as the teacher during Block C  
- `session.query(...)`  
- SQLite “just for memory day”

If you are stuck **more than 25 minutes** on one task, open **only** the matching Day 1 or Day 2 section **in this textbook**, read it, close it, continue from memory. Record what you had to look up in `lookups.txt`.

There is **no complete models file** in this chapter. The domain is specified. You write it.

---

## How to read this chapter

Two tables, one FK, one Session, one `select()`. That is the whole exam shape.

```mermaid
flowchart LR
  ST[Station] -->|"1-n"| IN[Instrument]
  IN -->|"station_id FK"| ST
  S[Session] --> ADD[add + begin]
  ADD --> SEL["select() scalars"]
```

**Wrong belief:** “Memory day means I skip the FK and print dicts.”  
**Correct:** the skill is **two mapped classes**, a **real FK**, and a **2.x select**.

---

## Complete explanation (ORM you must still own)

**Engine:** created once. URL `postgresql+psycopg://...`. `echo=True` until you can predict INSERT/SELECT. Driver package `psycopg` (v3). Windows: `uv add sqlalchemy "psycopg[binary]"`. Password not in git.

**Base:** `class Base(DeclarativeBase): pass`. Models subclass `Base`. `__tablename__` is the table name.

**Mapped / mapped_column:** `id: Mapped[int] = mapped_column(primary_key=True)`. Optional: `Mapped[str | None]` + `nullable=True`. Strings: `mapped_column(String(n))` when a length is a real rule.

**ForeignKey:** on the **child** column: `mapped_column(ForeignKey("stations.id"))`. Table name, not class name.

**relationship:** both sides, `back_populates` matching attribute names. Parent has `Mapped[list["Instrument"]]`. Child has `Mapped["Station"]`.

**Session:** `with Session(engine) as session:` closes. `with session.begin():` commits on success, rollbacks on exception. `add`, `flush` (SQL, not durable), `commit` (durable), `rollback`. Do not use a process-global Session.

**select() 2.x:**

```python
stmt = select(Station).where(Station.id == station_id)
station = session.scalars(stmt).first()
```

`session.execute(stmt)` returns rows. `scalars()` unwraps ORM entities. `.all()`, `.first()`, `.one_or_none()` — pick the one whose emptiness you can explain. Missing row is `None` or `NoResultFound`; it is **not** HTTP yet. Day 4 raises `HTTPException` 404.

**Not 1.x:** `session.query(Station).filter_by(id=1).first()` is the old API. Do not type it.

**create_all:** lab shortcut. Import all model classes before `Base.metadata.create_all(engine)`. Alembic is next week.

**Pydantic:** not required today. If you build a tiny dict for printing, fine. If you use a schema, export with **`model_dump()`**, not `.dict()`.

**Raw SQL twin:** you can still `psql -d ... -c "SELECT ..."`. If ORM and `psql` disagree, you committed to a different database than you queried.

**Security:** parameterized ORM is default. Do not `text(f"SELECT ... {name}")`. Bind `127.0.0.1`. No secrets in echo logs you commit — paste SQL, not URLs with passwords.

**Wrong belief:** “`relationship` means I can omit `ForeignKey`.”  
**Correct:** PostgreSQL will not enforce orphans without the FK.

**Wrong belief:** “I flushed, so a crash is safe.”  
**Correct:** uncommitted transactions vanish. That is the point.

---

## Today's contract

Rebuild Day 1–2 skills as if this were a lab exam.

**Today's gate.** Closed-book:

> Using the editor, `psql`, this recap, and my notes, I produced two models with a ForeignKey and back_populates, inserted in one transaction, selected with `select()`, and I can explain flush vs commit and why I closed the Session.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 20 | Closed-book oral review (no typing yet) |
| B | 40 | Paper drills |
| C | 90 | Build the spec |
| D | 35 | Defect hunt with echo + psql |
| E | 15 | Record lookups |

---

# Block A — Speak first

Out loud, no notes, no Day 1–2 files:

1. Engine vs Session vs connection.  
2. `Mapped` vs `mapped_column`.  
3. Where the `ForeignKey` goes.  
4. Why `back_populates` is two strings.  
5. flush vs commit.  
6. What `with Session(engine)` does on the way out.  
7. Why `session.query` is not this course.

If any answer is mush, re-read the recap. Do not open Day 2 yet.

---

# Block B — Paper drills

On paper or `DRILLS.txt` (no Python running):

1. Write the class headers and `mapped_column` lines for `Station` (`id`, `code` unique-ish string, `room`).  
2. Write `Instrument` with `station_id` FK and `name`.  
3. Write both `relationship` lines with `back_populates`.  
4. Write a `select()` that loads instruments for `station_id == 1`.  
5. Sketch the transaction: add station, add two instruments, exception before commit — how many rows in `psql`?

Do not look up answers. The recap is enough.

---

# Block C — Spec (you implement)

```powershell
cd ~\fullstack-lab
mkdir month-11\week-01\day-03 -Force
cd ~\fullstack-lab\month-11\week-01\day-03
uv init --name lab-stations
uv add sqlalchemy "psycopg[binary]"
psql -U postgres -c "CREATE DATABASE month11_w1d3;"
```

**Resource: lab stations and instruments** (not Project 6B, not shelves from Day 1–2).

**CONTRACT (implement this):**

| Piece | Rule |
|---|---|
| `Station` | `id` PK, `code` `Mapped[str]` (non-empty in your seed), `room` `Mapped[str]` |
| `Instrument` | `id` PK, `name` `Mapped[str]`, `station_id` FK → `stations.id` |
| Relationships | `station.instruments`, `instrument.station`, `back_populates` |
| Seed | One transaction: 2 stations, 3 instruments (at least one station has two instruments) |
| Query | `select` all instruments for a given station code (join or two-step — you choose, document which) |
| Orphan | Attempt invalid `station_id`; IntegrityError; rollback |
| SQL twin | `03-join.sql` with a JOIN you run in `psql` |

Rules:

- SQLAlchemy **2.x** only (`select()`, `Mapped`, `mapped_column`).  
- `echo=True`. Save representative INSERT in `ECHO.txt` (no passwords).  
- `with Session` + explicit transaction boundary.  
- `create_all` allowed. Import both models first.  
- Windows: `$env:DATABASE_URL = "postgresql+psycopg://postgres:YOUR_PASSWORD@127.0.0.1:5432/month11_w1d3"`.  
- Prove with **`psql`**. Write commands in `PSQL.txt`.  

Stretch if early: `UniqueConstraint` on `Station.code` and prove a duplicate fails. Still no FastAPI required. Still no Alembic.

Do **not** add Redis, Mongo, or a third entity “for résumé completeness.”

---

# Block D — Defect hunt

On **your** database, without changing the spec:

1. Stop importing `Instrument` and call `create_all` on a fresh DB — which tables appear?  
2. Query with `psql` against database `postgres` by mistake — what do you see?  
3. After commit, open a **new** Session and access `station.instruments` — extra SELECT? Write yes/no in `LAZY.txt`.  
4. `session.close()` then `print(instrument.station.name)` — what exception or behavior?  
5. Two Sessions: load the same `Station` id in each; `is` identity — same object or not? Write `IDENTITY.txt` (two sentences). Identity map is **per Session**. Day 7 names it; today you observe it.

If the orphan insert succeeds, you do not have an FK. Drop tables or use a new database. That is a **schema** bug, not a “Postgres quirk.”

## Traces (predict, then run)

**Trace 1 — create then join**

1. Seed commits.  
2. `psql` JOIN returns three instrument names with station codes.  
3. ORM `select` for one code returns the matching children only.

**Trace 2 — atomic**

Raise after adding a station and one instrument, before commit. `psql` count is 0 for both tables (or unchanged from before the attempt).

**Trace 3 — 2.x**

Grep your project: no `.query(`, no `.dict(`, no `Column(` as the primary mapping style. `mapped_column` only for new models.

Windows quoting is not an HTTP problem today. PowerShell `$env:DATABASE_URL` must be visible to `uv run` in **that** terminal.

---

# Block E — Lookups

`lookups.txt`: what you opened Day 1–2 for, if anything. If empty, write `none`.

```powershell
cd ~\fullstack-lab
git add month-11
git commit -m "Month 11 Day 3: two models and select() from memory."
```

---

# Lecture: 2.x select is a statement object

`stmt = select(Instrument).where(Instrument.station_id == sid)` does not hit the database. `session.scalars(stmt).all()` does. Students who print `stmt` and think they queried will also forget `commit`. Keep the two steps in your mouth: **construct**, then **execute**.

`where` uses class attributes (`Instrument.station_id`), not strings of column names. That is how you stay parameterized.

`JOIN` in SQLAlchemy: `select(Instrument, Station).join(Instrument.station)` is legal. You may also `select(Instrument).where(...)` after looking up the station id. Document which you used in `QUERY.md`. Day 4 will force you to see N+1 when you loop parents and touch `.instruments` each time.

**Unique `code`.** If you skip uniqueness, two stations can share a code and your “query by code” is ambiguous. `.first()` hides the bug. Prefer `.one_or_none()` after you understand it, or enforce uniqueness. Stretch is the UniqueConstraint.

**create_all and leftover tables.** Memory day is a good day for a **dedicated** database name. Mixing Day 1 `bins` with Day 3 `instruments` in `month11` is how FKs point at the wrong story.

---

## Definition of done

- [ ] Spoke Block A without notes  
- [ ] Two models + FK + `back_populates`  
- [ ] One transaction seed; `psql` JOIN agrees  
- [ ] Orphan failed  
- [ ] `select()` only; no `Query()`  
- [ ] `lookups.txt` exists  
- [ ] Commit exists  

---

# Worked session — stations, not ops-api

CONTRACT table first in `NOTES.md`. `uv init`, add sqlalchemy and psycopg, `CREATE DATABASE month11_w1d3`. `Station` / `Instrument`. Seed in `session.begin()`. Query instruments for one code. Orphan IntegrityError. `03-join.sql`. `ECHO.txt`. `IDENTITY.txt`. No Day 2 copy. No `~/ops-api/`. No `session.query`.

If INSERT never appears in echo, you did not execute/commit. If `psql` is empty, wrong database. If relationship configure fails, `back_populates` strings.

Bind parameters. Close Sessions. Flush is not commit.

---

## Optional review links

Repair from this recap first. These pages are for later checking, not for first learning.

- [SQLAlchemy 2.0 querying](https://docs.sqlalchemy.org/en/20/orm/queryguide/select.html)  
- [Relationships](https://docs.sqlalchemy.org/en/20/orm/basic_relationships.html)

---

## Tomorrow

**Lab:** list/get with `select()` over HTTP. You will **show an N+1**, then remove it with `selectinload` / `joinedload`. FastAPI returns Pydantic Out, not Session objects.

---

# Closing lecture — two classes, one FK, one statement

Memory day is not a typing race. It is whether `ForeignKey` still lives in your fingers when the example file is closed.

`DeclarativeBase`. `Mapped`. `mapped_column`. Child holds the FK. Both sides `back_populates`. `select()` then `scalars`. `begin` then commit or rollback. `with Session` closes.

Stations and instruments. Not users/projects/tasks. Not a Mongo collection. Not Redis. PostgreSQL is the record.

If you copied Day 2 shelves and renamed a string, the day failed even if pytest does not exist yet. New names, new database, new files.

`lookups.txt` is honesty. `none` is allowed. Silence is not.

---

## Recite-back checklist (close the editor, then tick)

Write `RECITE.txt` with one honest sentence per line.

- [ ] Engine once; Session per unit of work  
- [ ] FK on the child column  
- [ ] `back_populates` both ways  
- [ ] `select()` not `Query()`  
- [ ] flush ≠ commit  
- [ ] close before you treat objects as JSON  
- [ ] not ops-api; not SQLite  
- [ ] echo + psql agree
