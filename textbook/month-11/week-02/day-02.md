# Month 11 · Week 2 · Day 2
# Autogenerate vs Handwritten; Column + Index; Upgrade/Downgrade

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 3 — Python and backend  
**Month index:** [../../README.md](../../README.md)  
**Week 2:** [1](day-01.md) · Day 2 (today) · [3](day-03.md) · [4](day-04.md) · [5](day-05.md) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Exercises  
**Student state:** Day 1 gate passed. You can `alembic init`, wire `env.py`, and handwrite a `create_table`. Today you compare **autogenerate** to that craft, and you **add a column and an index** you can upgrade and downgrade.  
**Study time:** 3–4 focused hours

Labs: `~\fullstack-lab\month-11\week-02\day-02\`. Noun: **lockers** (not 6B, not Day 1 hooks unless you rebuild — prefer a **new** database).

---

## How to use this textbook

1. Autogenerate is a **draft**. You read it, trim it, then upgrade.  
2. Do not paste a 200-line autogenerate file into notes as if that were understanding.  
3. Every upgrade in this lab has a matching downgrade you **run**.  
4. Optional review links are for later rechecking.

---

## How to read this chapter

Autogenerate **compares** `Base.metadata` to the live database (or to what Alembic thinks the database is). It emits operations for the diff. It cannot see your **intent**: rename vs drop+add, data backfill, “this table is managed by another tool.”

```mermaid
flowchart TB
  MOD[Models] --> AG[alembic revision --autogenerate]
  DB[(PostgreSQL)] --> AG
  AG --> DRAFT[versions/*.py draft]
  DRAFT --> YOU[you read and edit]
  YOU --> UP[upgrade head]
  UP --> DOWN[downgrade -1]
```

**Wrong belief:** “`--autogenerate` means I never write SQL again.”  
**Correct:** it means you get a **first draft** of `op.add_column` / `op.create_index`. You still own `upgrade()` and `downgrade()`.

**Wrong belief:** “I’ll autogenerate the whole 6B schema from empty every Monday.”  
**Correct:** one chain from empty is fine once. Repeated autogenerate against a drifted DB is how you get `drop_table('alembic_version')` horror. Review **every** file.

---

## Today's contract

By the end of this day you will be able to:

1. Run `alembic revision --autogenerate -m "..."` after a model change.  
2. Read the file: keep `add_column` / `create_index`, **delete** nonsense.  
3. `upgrade head` and `downgrade -1` for that change.  
4. Handwrite the same column+index as a **second** exercise (or comment the autogen and rewrite) so you know both.  
5. Explain one thing autogenerate **cannot** know (rename, backfill, partial index intent).  
6. Keep passwords out of `alembic.ini`.

**Today's gate.** Closed-book:

> Autogenerate diffs metadata vs database. I edit the draft. Upgrade applies; downgrade undoes in development. Adding a nullable column is not the same as adding NOT NULL without a default. I did not accept a dump I could not read.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 30 | Recap: autogenerate limits |
| B | 75 | Exercises 1–4 |
| C | 50 | Exercises 5–6 + notes |
| D | 15 | Git |
| E | 15 | Recall |

---

# Complete explanation

## 1. Command

```powershell
uv run alembic revision --autogenerate -m "add locker color and index"
```

Requirements:

- `env.py` `target_metadata = Base.metadata`  
- models **imported**  
- database **already at a known revision** (yesterday’s habit)  
- `DATABASE_URL` in the environment  

If the database was created with `create_all` and has **no** `alembic_version`, autogenerate thinks every table is new **or** you stamp. Do not stamp until you can say `stamp` means “lie to Alembic that this revision is applied without running it.” Day 7. Today: **migrate from empty** with a first create, then autogenerate the **delta**.

---

## 2. What a good draft looks like (shape, not a dump)

You should see something **in this neighborhood** — your names differ:

```python
def upgrade() -> None:
    op.add_column("lockers", sa.Column("color", sa.String(length=16), nullable=True))
    op.create_index("ix_lockers_color", "lockers", ["color"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_lockers_color", table_name="lockers")
    op.drop_column("lockers", "color")
```

That is the whole lesson-sized file. If autogenerate also `drop_table("spatial_ref_sys")` or drops tables you do not own, **delete those operations**. If it tries to drop `alembic_version`, you mis-wired metadata.

**Never** commit `pass` in both upgrade and downgrade because “it generated empty” without asking why. Empty autogenerate means models and DB already match — or imports failed and metadata is empty **and** the DB is empty. Check both.

---

## 3. Column nullability

`nullable=True` is the **safe add** to a table that already has rows. PostgreSQL can add a nullable column without a default.

`nullable=False` with no default on a table **with rows** fails: existing rows would violate NOT NULL. Tomorrow’s memory day is the **story**: add nullable → backfill → `alter_column` NOT NULL.

Today: add **nullable** `color`. If you add NOT NULL without default and upgrade explodes, write the error in `NULL.txt` and change to nullable. That explosion is teaching, not a broken Alembic.

---

## 4. Indexes

`op.create_index("ix_lockers_color", "lockers", ["color"])` is a named index. Downgrade drops **that name**. If you let PostgreSQL auto-name and then drop the wrong name, downgrade fails.

Unique index vs unique constraint: both exist. Autogenerate may pick one. Read it. Month 10 uniqueness still applies.

Do not index every column “for speed.” Index what you filter/join. `color` is indexed in the lab so you **practice** `create_index`, not because lockers are a product.

---

## 5. Upgrade / downgrade as a loop

```powershell
uv run alembic upgrade head
psql -U postgres -d month11_w2d2 -c "\d lockers"
uv run alembic downgrade -1
psql -U postgres -d month11_w2d2 -c "\d lockers"
uv run alembic upgrade head
```

`\d lockers` should gain and lose `color` and the index. If downgrade says the index name is missing, copy the **exact** name from `\d` into `drop_index`.

`alembic upgrade +1` / `downgrade -1` move one step. `upgrade head` goes to the tip.

---

## 6. Handwritten vs autogenerate (when to choose)

| Situation | Prefer |
|---|---|
| New empty table matching the model | Either; handwritten is readable |
| Add column/index that autogen saw correctly | Autogen + review |
| Rename column | Handwritten (`alter_column` / `batch` / expand-contract). Autogen often drop+add (**data loss**) |
| Backfill | Handwritten `op.execute("UPDATE ...")` with a documented WHERE |
| Enum / constraint tweaks | Read twice; often handwritten |

**Wrong belief:** “I’ll disable autogenerate forever because it is dangerous.”  
**Correct:** it is dangerous **unread**. It is a good diff for column adds.

---

# Block B — Exercises

```powershell
cd ~\fullstack-lab
mkdir month-11\week-02\day-02 -Force
cd ~\fullstack-lab\month-11\week-02\day-02
uv init --name lab-alembic-ag
uv add sqlalchemy "psycopg[binary]" alembic
psql -U postgres -c "CREATE DATABASE month11_w2d2;"
$env:DATABASE_URL = "postgresql+psycopg://postgres:YOUR_PASSWORD@127.0.0.1:5432/month11_w2d2"
uv run alembic init alembic
```

Wire `env.py` as yesterday. Model `Locker`: `id`, `code` unique, `floor` int.

### Exercise 1 — First revision (handwritten or autogen from empty)

From empty DB, generate or handwrite `create lockers`. Upgrade. `\dt`. Record revision id in `REV.txt`.

### Exercise 2 — Change the model, autogenerate the delta

Add `color: Mapped[str | None] = mapped_column(String(16), nullable=True)` and an index (`index=True` on `mapped_column` or `Index(...)` on the table — pick one, be consistent).

```powershell
uv run alembic revision --autogenerate -m "add locker color"
```

Open the file. **Copy only the `upgrade`/`downgrade` bodies** into `DRAFT-NOTES.md` (20 lines max). Delete any drop of unrelated tables. Then upgrade.

### Exercise 3 — Downgrade that delta

`downgrade -1`. `\d lockers` has no `color`. `upgrade head`. Color is back.

### Exercise 4 — Autogenerate empty

Without model changes:

```powershell
uv run alembic revision --autogenerate -m "should be empty"
```

If it is not empty, **do not upgrade**. Explain in `EMPTY.txt` what it wanted to do. Delete the revision file if it is junk (only if **not** applied). If it is empty `pass`, you may delete the file so history stays meaningful — note that in `EMPTY.txt`.

---

# Block C — More exercises

### Exercise 5 — Handwrite the same kind of change on a new column

Add `note: Mapped[str | None]`. **Do not** autogenerate. `alembic revision -m "add locker note"` and write `add_column` / `drop_column` yourself. Upgrade/downgrade once.

### Exercise 6 — Trap: NOT NULL add

On paper (or a **scratch** database you can wipe): what SQL happens if you `add_column(..., nullable=False)` with no server default while rows exist? If you have time, try it, capture the PostgreSQL error, rollback/downgrade, write `TRAP.txt`. If you do not try it, still write the predicted error. Day 3 implements the safe story.

`COMPARE.md`: three bullets — autogen helped; autogen cannot rename safely; I still ran downgrade.

Do not start 6B migrations today (Day 6). Do not `create_all` after Alembic owns the DB.

```powershell
cd ~\fullstack-lab
git add month-11
git commit -m "Month 11 Week 2 Day 2: autogenerate review, column and index."
```

---

# Block E — Recall

1. What autogenerate compares.  
2. Why empty autogenerate can be success.  
3. Why drop+add is not a rename.  
4. Why nullable add is the default safe column add.  
5. Index names in downgrade.

## Office hours

**Autogenerate wants to drop everything.** Metadata empty (forgot model import) **or** connected to the wrong empty database while models are huge. Check URL. Check imports.

**`Can't locate revision identified by`.** `down_revision` points at a file you deleted. Restore from git.

**Index created twice.** Model `index=True` plus a duplicate `Index()` and two revisions. `\d` and drop extras on the lab DB; fix models.

**Downgrade fails after autogen used `batch_alter`.** Read the file; PostgreSQL usually does not need SQLite batch mode. You are on PostgreSQL.

**I committed a 1500-line autogen that recreates the universe.** Do not upgrade it on anything you like. Reset the lab DB. Write a smaller revision. That is the whole point of this day.

---

## Lecture: the diff is not the intent

Autogenerate sees “column missing” not “we renamed `wall` to `location`.” If you rename on the model, autogen often `drop_column('wall')` + `add_column('location')` and **your data dies on upgrade**. Day 4 expand-contract is how adults rename. Today, if you want a rename, **do not use autogen for it**.

`--autogenerate` also does not know that a column must be backfilled from another system. `op.execute` is handwritten SQL. Keep it boring. Parameterize if it is not a constant lab update.

Upgrade is applying intent. Downgrade is proving you **had** intent, not only a forward dump.

---

## Worked session — lockers, draft, downgrade

New uv project. Init Alembic. Create lockers. Add `color` on the model. Autogenerate. Trim. Upgrade. `\d`. Downgrade. Upgrade. Empty autogen explained. Handwritten `note` column. TRAP.txt for NOT NULL. `DRAFT-NOTES.md` is short on purpose.

Windows: same `$env:DATABASE_URL` for alembic and `psql -d month11_w2d2`. `uv run alembic history`.

No ops-api. No giant file in the textbook. Your draft notes stay small.

---

## Definition of done

- [ ] Autogenerate ran and I edited the draft  
- [ ] Column + index upgraded and downgraded  
- [ ] Empty autogen explained  
- [ ] One handwritten add_column  
- [ ] NOT NULL trap predicted or captured  
- [ ] Commit exists  

---

## Optional review links

- [Alembic autogenerate](https://alembic.sqlalchemy.org/en/latest/autogenerate.html)  
- [Operation reference](https://alembic.sqlalchemy.org/en/latest/ops.html)

---

## Tomorrow

**From memory:** a revision that adds a **nullable** column, then a second step that makes it **NOT NULL** with a **default/backfill story**. Days 1–2 closed during the build.

---

# Closing lecture — read the draft, then run it

Autogenerate is `diff`. You are the author of `upgrade()`. Nullable column adds are the default safe move. Indexes need names you can drop. Downgrade is part of the exercise, not homework.

If the generated file scares you, it is too big. Split the model change. Two small revisions beat one novel.

Lockers, not 6B. PostgreSQL, not SQLite. `psql` `\d` is the proof.
