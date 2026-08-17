# Month 11 · Week 1 · Day 2
# Relationships, ForeignKey, and Transaction Boundaries

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 3 — Python and backend  
**Month index:** [../../README.md](../../README.md)  
**Week 1:** [1](day-01.md) · Day 2 (today) · [3](day-03.md) · [4](day-04.md) · [5](day-05.md) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Exercises  
**Student state:** Day 1 gate passed. You can declare `Mapped` / `mapped_column`, open a Session, `add`, `commit`, and `select()`. Today you **connect tables** the way Month 10 connected keys, and you make **commit / rollback / close** a habit instead of a hope.  
**Study time:** 3–4 focused hours

Labs: `~\fullstack-lab\month-11\week-01\day-02\`. Do **not** paste `~/ops-api/`.

---

## How to use this textbook

1. Read the recap. Then **do the exercises in order**. Typing without the FK constraint is not “faster.”  
2. Leave `echo=True` on. You should see `INSERT` into two tables and a `FOREIGN KEY` error when you try an orphan.  
3. Optional review links are for later rechecking.

---

## How to read this chapter

A **foreign key** is a database rule: `bins.shelf_id` must name a real `shelves.id`. A **relationship** is the ORM’s navigation: `shelf.bins` and `bin.shelf`. They are not the same thing. The constraint can exist without a relationship. The relationship without a real `ForeignKey` is a toy.

A **transaction boundary** is when the Session **begins** work and then **commits** (durable) or **rolls back** (forgotten) and **closes** (connection returns to the pool). HTTP handlers that leave Sessions open leak connections. Scripts that never `commit` look like they “saved” because `print(shelf.id)` after flush fooled you.

```mermaid
flowchart TB
  S[Shelf] -->|"1-n"| B[Bin]
  B -->|"shelf_id FK"| S
  REQ[Unit of work] --> BEGIN[session.begin or first use]
  BEGIN --> WORK[add / update / select]
  WORK --> COMMIT[commit]
  WORK --> RB[rollback on error]
  COMMIT --> CLOSE[close]
  RB --> CLOSE
```

**Wrong belief:** “`relationship()` creates the foreign key.”  
**Correct:** `mapped_column(ForeignKey("shelves.id"))` creates the FK. `relationship(back_populates=...)` is how you walk the graph in Python.

**Wrong belief:** “I’ll keep one global Session for the whole Uvicorn process.”  
**Correct:** one **engine**. One Session **per request** (or per script). Close it. Day 4 wires this to FastAPI `Depends`.

---

## Today's contract

By the end of this day you will be able to:

1. Declare `ForeignKey` on a child `mapped_column`.  
2. Declare **both sides** of a relationship with **`back_populates`**.  
3. Insert a parent and children in **one transaction**.  
4. Prove an orphan `shelf_id` **fails** in PostgreSQL.  
5. Use `with Session(engine) as session:` and `session.begin()` (or `commit`/`rollback`) so close is not optional.  
6. Explain **flush vs commit** in two sentences.

**Today's gate.** Closed-book:

> The FK is the constraint. `back_populates` is navigation both ways. A Session is a transaction conversation: begin, work, commit or rollback, close. I do not leave orphans, and I do not leave connections checked out.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 35 | Recap (relationships + transactions) |
| B | 70 | Exercises 1–5 (type and run) |
| C | 55 | Exercise 6–7 + defect writeups |
| D | 15 | Git |
| E | 15 | Recall |

---

# Complete explanation

## 1. ForeignKey on the child

```python
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Shelf(Base):
    __tablename__ = "shelves"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80))
    bins: Mapped[list["Bin"]] = relationship(back_populates="shelf")


class Bin(Base):
    __tablename__ = "bins"

    id: Mapped[int] = mapped_column(primary_key=True)
    label: Mapped[str] = mapped_column(String(80))
    shelf_id: Mapped[int] = mapped_column(ForeignKey("shelves.id"))
    shelf: Mapped["Shelf"] = relationship(back_populates="bins")
```

`ForeignKey("shelves.id")` uses the **table.column** string, not the Python class name. `back_populates="shelf"` on `Shelf.bins` must match the attribute name on `Bin`. If the strings disagree, SQLAlchemy errors at mapper configure time — good. Fix the names; do not delete one side “to simplify.”

One-to-many: one shelf, many bins. Month 10’s 1-n. Many-to-many waits until you have an association table in **your** 6B schema — not required in this lab.

**`backref=`** exists in old examples. This course uses **`back_populates`** so both sides are explicit.

---

## 2. Adding children

Two honest styles:

**A. Set the FK integer** after the parent has an id (after flush):

```python
with Session(engine) as session:
    shelf = Shelf(name="Cold room")
    session.add(shelf)
    session.flush()  # INSERT shelf; id assigned; not committed yet
    session.add(Bin(label="B-12", shelf_id=shelf.id))
    session.commit()
```

**B. Append to the relationship** and let the Session order INSERTs:

```python
with Session(engine) as session:
    shelf = Shelf(name="Cold room")
    shelf.bins.append(Bin(label="B-12"))
    session.add(shelf)
    session.commit()
```

Style B is convenient. Style A makes the FK visible. Practice **both**. Echo will show two INSERTs in one transaction if you commit once.

---

## 3. Transaction boundaries

| Call | Meaning |
|---|---|
| `Session(engine)` | Opens a Session; a transaction typically begins on first use |
| `session.flush()` | Emit SQL; still in the transaction |
| `session.commit()` | Durable + (by default) expires attributes |
| `session.rollback()` | Forget pending changes; transaction aborted |
| `session.close()` | Session done; connection back to the pool |
| `with Session(engine) as session:` | **close** on the way out |
| `with session.begin():` | **commit** if the block succeeds, **rollback** if it raises |

Preferred lab pattern:

```python
with Session(engine) as session:
    with session.begin():
        session.add(Shelf(name="Dock"))
    # committed if no exception; Session still open until outer with ends
```

Or simply `session.add(...); session.commit()` inside `with Session(...)`. Do **not** skip close. Do **not** `commit` in a `finally` that also runs after errors — that is how you commit half-broken state. Rollback on error.

**Wrong belief:** “If I `flush()`, it is saved even if I forget `commit`.”  
**Correct:** flush is “Postgres has the statement in this transaction.” Rollback or process death undoes it. Commit is durable.

**Wrong belief:** “I’ll call `session.close()` and then read `shelf.name`.”  
**Correct:** after close, the instance is **expired / detached**. Access may error or emit unexpected SQL if you rebound it. Read what you need **before** close, or copy fields into a Pydantic model with **`model_dump`** later — not `.dict()`.

---

## 4. Cascade (know the word; do not enable the universe)

`relationship(..., cascade="all, delete-orphan")` can DELETE children when you delete a parent. That is a **product decision**. PostgreSQL `ON DELETE CASCADE` on the FK is another decision. They can disagree. Today: **do not** set a fancy cascade unless an exercise asks. Default is fine. If you delete a shelf that still has bins, PostgreSQL should **reject** you if the FK has no `ON DELETE CASCADE`. That rejection is success for the lesson.

---

## 5. select() with a join (preview of Day 4)

```python
stmt = select(Bin).where(Bin.shelf_id == shelf_id)
bins = session.scalars(stmt).all()
```

Loading `shelf.bins` without an eager option can **lazy-load**: extra SELECT when you touch the collection. That is tomorrow’s N+1 lab. Today, if echo shows a surprise SELECT when you print `shelf.bins`, write it down; do not disable lazy loading globally to hide it.

---

# Block B — Exercises (type-along)

New uv project (do not import Day 1 as a package):

```powershell
cd ~\fullstack-lab
mkdir month-11\week-01\day-02 -Force
cd ~\fullstack-lab\month-11\week-01\day-02
uv init --name lab-fk
uv add sqlalchemy "psycopg[binary]"
```

Use database `month11` or `CREATE DATABASE month11_w1d2;` if you want a clean slate.

```powershell
psql -U postgres -c "CREATE DATABASE month11_w1d2;"
$env:DATABASE_URL = "postgresql+psycopg://postgres:YOUR_PASSWORD@127.0.0.1:5432/month11_w1d2"
```

`create_all` is still allowed today. Alembic is Week 2.

### Exercise 1 — Models with FK

Type `models.py` with `Shelf` and `Bin` as above. `seed.py` creates the engine with `echo=True` and `create_all`.

### Exercise 2 — Parent then children, one commit

Insert one shelf and two bins in **one** `session.begin()` (or one `commit`). Prove with `psql`:

```sql
SELECT b.label, s.name
FROM bins b
JOIN shelves s ON s.id = b.shelf_id
ORDER BY b.id;
```

Save the join output in `JOIN.txt`.

### Exercise 3 — Orphan must fail

In a **new** Session, `add` a `Bin` with `shelf_id=99999` (no such shelf). Commit. PostgreSQL should raise `ForeignKeyViolation` (or IntegrityError wrapping it). Catch it, rollback, write the error class name in `ORPHAN.txt`. If it **succeeds**, your FK is missing — you used a plain `Mapped[int]` without `ForeignKey`, or `create_all` ran against an old `bins` table without the constraint. `DROP TABLE` both tables and `create_all` again, or use a fresh database.

### Exercise 4 — Navigation both ways

After a successful commit, in a new Session, `select` the shelf and print `[b.label for b in shelf.bins]`. Then `select` a bin and print `bin.shelf.name`. If one side is empty, `back_populates` is wrong or you queried a different id.

### Exercise 5 — Rollback undoes flush

Begin a Session. `add` a shelf with a unique name you will search for. `flush()`. `select` that name — it is visible **in this Session**. `rollback()`. `select` again — gone. Write `FLUSH-VS-COMMIT.md` (six to ten lines). If the row survived rollback, you committed by accident (`begin()` autocommit confusion, or two Sessions).

---

# Block C — More exercises

### Exercise 6 — Close then read

Commit a shelf. Exit the `with Session` block. Try `print(shelf.name)` on the instance you still hold. Record what happens in `DETACHED.txt`. Then reload with a **new** Session and `select()`. The lesson is: HTTP handlers must copy values out (later: Pydantic Out) before the Session closes.

### Exercise 7 — Two-row atomic story

Insert a shelf and a bin. After `add`ing both, **raise** `RuntimeError("lab boom")` before commit (inside `session.begin()`). Confirm **neither** row exists in `psql`. That is Month 10’s transaction lesson with objects. Write `ATOMIC.txt`.

If the shelf exists and the bin does not, you committed twice or used two Sessions. Fix it.

### Defect hunt (write `DEFECTS.md`)

For each, predict echo + outcome, then run if unsure:

**A.** `relationship` only on `Shelf`, no `Bin.shelf`, no `back_populates`.  
**B.** `ForeignKey("Shelf.id")` using the class name.  
**C.** Global `session = Session(engine)` at import; never close; run the script three times.  
**D.** `session.commit()` inside a loop of 100 inserts without `begin` grouping — not wrong, but name the cost (many transactions).

Do **not** add FastAPI yet. Do **not** copy 6B table names (`users` / `projects` / `tasks` as a trio).

```powershell
cd ~\fullstack-lab
git add month-11
git commit -m "Month 11 Day 2: FK, relationships, Session begin/commit/close."
```

---

# Block E — Recall

1. FK vs relationship.  
2. Why `back_populates` appears twice.  
3. flush vs commit.  
4. What `with Session(engine)` guarantees.  
5. Why a global Session is a pool leak waiting to happen.

## Office hours

**`Mapper failed to initialize` / back_populates error.** Attribute names must match. `bins` ↔ `back_populates="bins"` on the other class.

**`relation bins already exists` with no FK.** You `create_all`’d Day 1’s unconstrained `bins` into `month11`. Fresh DB or `DROP TABLE bins, shelves CASCADE;`.

**Lazy load after close: `DetachedInstanceError`.** Expected in Exercise 6. Do not keep the Session open forever to dodge it.

**I used `session.query(Bin).filter(Bin.shelf_id == x)`.** Rewrite to `select(Bin).where(Bin.shelf_id == x)` and `session.scalars`.

**Cascade deleted my bins when I deleted a shelf and I wanted a 409.** You enabled a cascade or `ON DELETE CASCADE`. Today the default should be “Postgres says no.”

---

## Lecture: the Session is not a cache you ship to React

`shelf.bins` looks like a list. It is a **collection bound to a Session**. Serializing it after close is how students get empty lists and mysterious SELECTs. Day 4 you will `select()` in a request, build JSON (Pydantic Out + **`model_dump`** if you need a dict), and close.

Transaction boundaries in FastAPI later: `yield` a Session in `Depends`, commit if the request succeeded, rollback if it raised, close in `finally`. You will type that on Day 4. Today the script equivalent must already be in your fingers.

Month 10: `BEGIN; INSERT; INSERT; COMMIT;`. Month 11: `with session.begin(): add; add`. Same ACID. The ORM did not remove isolation. It can still lose an update if you use two Sessions without a plan — that is still SQL.

---

## Worked session — FK, two inserts, one rollback

Fresh uv project. Models with `ForeignKey` and `back_populates` both ways. `create_all` on a dedicated database. One `begin`: shelf + two bins. `psql` join. Orphan 99999 fails. Flush then rollback vanishes. Raise before commit: zero rows. Close then read: write what Python did. `select()` only; no `Query()`.

Windows: `$env:DATABASE_URL`, `uv run`, `psql -U postgres -d month11_w1d2`. No Redis. No Mongo. No ops-api paste.

---

## Definition of done

- [ ] `ForeignKey` on `Bin.shelf_id`  
- [ ] `back_populates` both directions  
- [ ] Orphan insert failed and was recorded  
- [ ] One transaction created parent + children  
- [ ] Rollback exercise written  
- [ ] `select()` used; no `Query()`  
- [ ] Commit exists  

---

## Optional review links

- [SQLAlchemy relationships](https://docs.sqlalchemy.org/en/20/orm/basic_relationships.html)  
- [Session / transactions](https://docs.sqlalchemy.org/en/20/orm/session_transaction.html)  
- [ForeignKey](https://docs.sqlalchemy.org/en/20/core/constraints.html#sqlalchemy.schema.ForeignKey)

---

## Tomorrow

**From memory:** two models + a query. Days 1–2 closed during the build. This file’s recap is the backup after 25 minutes.

---

# Closing lecture — constraints first, navigation second

PostgreSQL enforces `shelf_id`. SQLAlchemy lets you write `bin.shelf.name`. If you only learn navigation, you will ship apps that omit the FK “because the relationship is there” and then orphans appear from a raw INSERT or a bug. Always declare `ForeignKey`. Always close the Session. Always know whether you committed.

`begin` / `commit` / `rollback` / `close` are the same story as Month 10, now with objects. Flush is not durability. Two INSERTs that must succeed together share one `begin`. Exercise 7 is the exam item.

`back_populates` is explicit. `Query()` is not the course. Echo stays on until the INSERTs look familiar. Shelves and bins stay the lab noun. `~/ops-api/` is still yours to write, not ours to paste.
