# Month 11 · Week 4 · Day 5
# MongoDB Exercise (Separate): Documents, Embed vs Ref, Index, Aggregation

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 3 — Python and backend  
**Month index:** [../../README.md](../../README.md)  
**Week 4:** [1](day-01.md) · [2](day-02.md) · [3](day-03.md) · [4](day-04.md) · Day 5 (today) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Tests/docs **and** a **separate** Mongo lab  
**Student state:** 6B is relational. Today you learn **document** shape on a **side** database so you can **honestly** say whether Mongo would help 6B.  
**Study time:** 3–4 focused hours

Labs: `~\fullstack-lab\month-11\week-04\day-05\`. Noun: **field observation notes**.  
**Do not** add Mongo to `~/ops-api/`. **Do not** replace PostgreSQL.

---

## How to use this textbook

1. This is a **proof of concept**, not a second product.  
2. If MongoDB is **not installed**, use the **skip-run path**: write documents as JSON files **plus** `EXPLAIN-MONGO.md` that still answers embed vs ref, index, aggregation **as if** you had a server — and try **pymongo** against `mongomock` if you can `uv add mongomock`. Prefer mongomock over inventing nothing.  
3. Optional review links are for later rechecking.

---

## How to read this chapter

A **document** is a JSON-like object (`BSON` in MongoDB). A **collection** is a bag of documents (not a strict table). **Embed** means nested objects inside the parent. **Reference** means store an id and look up another collection (join-like, in the app or with `$lookup`).

```mermaid
flowchart TB
  C[collection observations] --> D1[document: site, notes[]]
  C --> D2[document: site, notes[]]
  REF[collection authors] -.->|ref author_id| D1
```

**Wrong belief:** “I’ll put Mongo next to Postgres in 6B so the résumé has both.”  
**Correct:** two systems of record is a **new product**. The month gate allows **“No, Mongo would not improve the main model.”**

**Wrong belief:** “Documents mean no schema and no indexes.”  
**Correct:** you still **index** what you query. You still **think** about shape. Flexible is not “garbage fields forever.”

---

## Today's contract

By the end of this day you will be able to:

1. Explain **document**, **collection**, **_id**.  
2. **Embed** a small list (notes on an observation) vs **ref** an author id.  
3. Create **one index** (e.g. on `site`).  
4. Run **one tiny aggregation** (`$match` + `$group` count by site) — or mongomock equivalent / written pipeline you explain.  
5. Write **one page** `WOULD-MONGO-HELP-6B.md` answering the project question. **“No” is allowed.**  
6. Keep ops-api **free of** pymongo.

**Today's gate.** Closed-book:

> Mongo stores documents in collections. Embed vs ref is a design choice with join cost vs document size. I indexed one field and grouped once. I did not put Mongo in 6B unless I can defend it — and the default is not to.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 40 | Theory |
| B | 70 | Type-along: mongomock or Mongo + insert/find |
| C | 55 | Index + aggregation + 6B page |
| D | 15 | Git |
| E | 15 | Recall |

---

# Block A — Theory

## 1. When documents fit

Good fit: irregular nested data you **always load together** (an observation with three measurements of different shapes).  
Bad fit: 6B’s **relational** resources with FKs, constraints, Alembic, reporting SQL from Month 10.

PostgreSQL **JSONB** exists if you only needed a blob **beside** typed columns. Mongo is a **different server**. Prefer JSONB over a second SoR for a single nested field.

## 2. Embed vs ref

| | Embed | Ref |
|---|---|---|
| Read | One fetch | Two fetches or `$lookup` |
| Update one nested item | Rewrite parent or careful operator | Update child doc |
| Size | 16MB document limit (know it exists) | Grows in another collection |
| Integrity | No FK | No FK unless you enforce in app |

Lab: **embed** `notes: [{text, at}]` on observation. **Ref** `author_id` as a string to a tiny `authors` collection (two authors). You will **feel** both.

## 3. Index

```javascript
db.observations.createIndex({ site: 1 })
```

pymongo: `coll.create_index("site")`. Without it, find-by-site is a scan. Same lesson as Month 10, different product.

## 4. Aggregation (tiny)

```javascript
db.observations.aggregate([
  { $match: { site: { $exists: true } } },
  { $group: { _id: "$site", n: { $sum: 1 } } }
])
```

That is **enough**. Do not build a data warehouse. SQL `GROUP BY` is the cousin you already know.

## 5. pymongo sketch (type; adapt)

```python
from pymongo import MongoClient

client = MongoClient("mongodb://127.0.0.1:27017")
db = client["month11_lab"]
obs = db["observations"]
obs.insert_one({"site": "north-fen", "notes": [{"text": "fog"}], "author_id": "a1"})
```

**mongomock:**

```python
import mongomock

client = mongomock.MongoClient()
```

Same insert/find API for the lab. Write `SERVER.md`: real vs mock.

## 6. Windows / install

MongoDB Community / Atlas **if you already have it**. Docker **only if already installed**. Otherwise **mongomock**. Skip-run: JSON files + pipeline written in `AGG.txt` + still `WOULD-MONGO-HELP-6B.md`.

This is **not** a Mongo DBA course.

## 7. Security

Do not expose Mongo to the LAN. Do not commit connection strings with passwords. Do not store 6B user passwords in a side collection “for fun.”

---

# Block B — Type-along

```powershell
cd ~\fullstack-lab
mkdir month-11\week-04\day-05 -Force
cd ~\fullstack-lab\month-11\week-04\day-05
uv init --name lab-mongo-exercise
uv add pymongo mongomock
```

`lab.py`: insert two observations (different sites), one with two embedded notes; insert two authors; `find` by site; print counts.

`EMBED-VS-REF.md`: why notes are embedded and authors referenced **in this lab**.

---

# Block C — Index, aggregate, 6B page

1. `create_index("site")`. `index_information()` printed to `INDEX.txt`.  
2. Aggregation group by site → `AGG.txt` output.  
3. `WOULD-MONGO-HELP-6B.md` (one page, 20–40 lines): your 6B entities; FK-heavy or not; reporting SQL you already have; **yes/no**; JSONB alternative. **No** is a complete answer.  
4. `NOT-IN-OPS-API.txt`: one sentence signed by you.

pytest optional: mongomock insert + aggregate count.

Do not `uv add pymongo` inside ops-api today.

```powershell
cd ~\fullstack-lab
git add month-11
git commit -m "Month 11 Week 4 Day 5: separate Mongo exercise and 6B writeup."
```

---

# Block E — Recall

1. Document vs row.  
2. Embed vs ref.  
3. Why an index.  
4. `$group` vs SQL GROUP BY.  
5. Why 6B default is still Postgres.

## Office hours

**mongomock aggregation differs.** Write the pipeline anyway; if mock fails, run the pipeline on paper in AGG.txt and say so.

**I added Mongo to FastAPI 6B “just a little.”** Remove it. This day forbids it.

**Atlas password in git.** Rotate; gitignore.

---

## Lecture: a second SoR is a marriage

SQLAlchemy + Alembic + constraints are a **spine**. Mongo is a **different spine**. Week 1–2 work does not port automatically. If your data is already tables, “documents” are a fashion.

The project **requires the exercise and the page**, not the wedding.

JSONB in Postgres is the compromise for a nested blob **next to** keys. Mention it in the page.

---

## Worked session — mock, two docs, group, page

uv init. mongomock (or Mongo). Observations + authors. Embed notes. Ref author. Index site. Aggregate counts. WOULD-MONGO-HELP-6B.md. NOT-IN-OPS-API.txt. No Redis required. No ops-api imports.

Windows: `uv run py -3 lab.py`. No Docker course.

---

## Definition of done

- [ ] insert/find works (mock or server or skip-run JSON)  
- [ ] embed vs ref written  
- [ ] one index  
- [ ] one aggregation (run or written)  
- [ ] 6B page with yes/no  
- [ ] Mongo not in ops-api  
- [ ] Commit exists  

---

## Optional review links

- [MongoDB documents](https://www.mongodb.com/docs/manual/core/document/)  
- [Embedding vs references](https://www.mongodb.com/docs/manual/data-modeling/)  
- [Aggregation $group](https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/)

---

## Tomorrow

**Independent:** finish **6B checklist** against **project_06 spec headings only** — you map **your** repo to the headings. No pasted app.

---

# Closing lecture — learn the shape, keep the spine

Documents, collections, embed, ref, index, tiny `$group`. Then a page that may say **No**.

6B stays PostgreSQL + SQLAlchemy + Alembic + optional Redis. Mongo stays in `fullstack-lab`.

If the page says Yes, you still **do not** have to migrate this month — you need a **reason** and a **plan**. The gate allows No.

Field notes are the noun. ops-api is not a collection.
