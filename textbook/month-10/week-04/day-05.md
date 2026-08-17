# Month 10 · Week 4 · Day 5
# Index Docs and Connection Pool Concept

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 3 — Python and backend  
**Month index:** [../../README.md](../../README.md)  
**Week 4:** [1](day-01.md) · [2](day-02.md) · [3](day-03.md) · [4](day-04.md) · Day 5 (today) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Tests, refactor, docs  
**Student state:** You have a reporting pack. Today you document **indexes** and learn what a **connection pool** is — without SQLAlchemy.  
**Study time:** 3–4 focused hours

Labs: `~/ops-api/sql/` plus `~\fullstack-lab\month-10\week-04\day-05\` for the pool essay. No SQLAlchemy engine. No `create_engine(pool_size=)`. Month 11 will attach the pool to the ORM. Docker is not the gate.

---

## How to use this textbook

1. INDEXES.md is a budget, not a wish list.  
2. The pool section is **concept**: you will not build PgBouncer today.  
3. Optional review links are for later rechecking.

---

## How to read this chapter

An **index budget** lists each index, its purpose, and the write cost you accept. A **connection** is a session to PostgreSQL (TCP, authentication, memory). Opening a connection **per HTTP request** is slow. A **pool** keeps a few live connections and **lends** them. SQLAlchemy and many drivers implement a client-side pool. **PgBouncer** is a server-side pooler — Month 15/ops later. Today you must **explain** why FastAPI should not `psycopg.connect()` with no reuse on every click.

```mermaid
flowchart LR
  REQ[HTTP requests] --> POOL[Pool of N connections]
  POOL --> PG[(PostgreSQL max_connections)]
```

**Wrong belief:** “I’ll open a new connection for every query; PostgreSQL is a server, it is fine.”  
**Correct:** each connect is handshake + memory. Under load you exhaust `max_connections` and wait.

**Wrong belief:** “A pool is a second PostgreSQL.”  
**Correct:** a pool is a **set of already-open sessions** (or a proxy that multiplexes). One database.

---

## Today's contract

By the end of this day you will be able to:

1. Write **INDEXES.md** for your Stage B schema (PK/UNIQUE included).  
2. Justify or reject indexes on FK columns and reporting WHERE/ORDER BY.  
3. Explain **connection**, **max_connections**, and **pool** in sentences.  
4. Explain why a transaction should not sit in the pool **checked out** while you call a slow HTTP API.  
5. Not implement SQLAlchemy.

**Today's gate.** Closed-book:

> Indexes are a budget. PK/UNIQUE already count. I can name why a pool exists: reuse sessions, cap concurrency. I do not hold a connection across unrelated work. SQLAlchemy pool settings are Month 11.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 45 | Theory: pools and index docs |
| B | 70 | INDEXES.md + `\d` vs file |
| C | 50 | POOL.md essay + checkout story |
| D | 15 | Git |
| E | 15 | Recall |

---

# Block A — Theory

## 1. Index documentation

For each index:

- Name  
- Table and columns (order)  
- UNIQUE or not  
- Query it serves  
- Write-path cost (every insert to that table)  
- How you checked (EXPLAIN, or “PK default”)  

If EXPLAIN never uses it, **drop or justify “for FK delete checks.”** PostgreSQL uses indexes on `tickets.project_id` when validating RESTRICT/CASCADE lookups.

## 2. What a connection is

Month 1: client/server. `psql` opens a connection. PostgreSQL creates a **backend process** (classic model) for that session. `SHOW max_connections;` — a ceiling. Each FastAPI worker **times** connections if you connect naively.

## 3. Pool concept

A **pool** of size 5 means up to 5 simultaneous SQL sessions from that process. Request A borrows conn 2, runs queries, **returns** it. Request B reuses conn 2. If all 5 are busy, wait or error — better than 5000 connections.

**Client pool:** inside the app process (psycopg pool, SQLAlchemy later).  
**External pool:** PgBouncer between apps and Postgres.

You do not configure PgBouncer today. You write: “many app instances × pool_size must stay under max_connections.”

## 4. Checkout lifetime

Borrow connection → BEGIN → queries → COMMIT → **return to pool**. If you borrow, then call Stripe for 3 seconds, then COMMIT, you **held a PostgreSQL session idle in transaction** — locks, slot, pool starvation. Month 11: keep transactions **short**. Today: write that story in POOL.md.

## 5. Autocommit vs pool

A pooled connection may still have an aborted transaction if you forgot rollback (Week 3). Returning a dirty connection poisons the next request. Drivers reset; you still **rollback on error**.

---

# Block B — INDEXES.md

```powershell
mkdir ~\fullstack-lab\month-10\week-04\day-05 -Force
```

From **your** database:

```powershell
psql -U postgres -d ops_api -c "\d"
```

`\d` each table. List indexes. Write `INDEXES.md` in ops-api (or lab). Include:

- All PK/UNIQUE  
- All extra CREATE INDEX  
- At least one **rejected** index (low selectivity or ILIKE %x%) with a sentence  

If FK columns on children are unindexed, **either** add `CREATE INDEX` in a new `03-indexes.sql` **or** write “table small, postpone.” Honesty.

Align with Day 4 EXPLAIN.md. If you claimed an index and the plan seq-scanned, fix the doc or the index.

---

# Block C — POOL.md

Write 400–800 words (your words) covering:

1. Connection vs pool vs database  
2. Why per-request connect is costly  
3. max_connections arithmetic (example numbers: 3 uvicorn workers × pool 10 = 30)  
4. Short transactions; do not hold checkout during external HTTP  
5. SQLAlchemy/QueuePool is **Month 11** — you are not copying `pool_size=20` as cargo cult  
6. Optional: PgBouncer exists for many-app fan-in  

No code required. A tiny `SHOW max_connections;` paste is welcome.

`CHECKOUT.md`: one bad story (hold during `time.sleep`), one good story (query, commit, return).

---

# Block D — Git

```powershell
cd ~\ops-api
git add sql INDEXES.md
git commit -m "Month 10 Week 4 Day 5: index budget."
```

Commit POOL.md in fullstack-lab if it lives there.

---

# Block E — Recall

1. Why PK is already an index.  
2. Pool vs max_connections.  
3. Idle in transaction.  
4. Rejected index.  
5. Month 11 vs today.

## Office hours

**I built SQLAlchemy to “feel the pool.”** Undo. Essay only.

**I indexed everything after INDEXES.md guilt.** Drop unused. Budget.

---

## Definition of done

- [ ] INDEXES.md matches `\d`  
- [ ] One rejected index named  
- [ ] POOL.md + CHECKOUT.md  
- [ ] No SQLAlchemy engine  
- [ ] Commit exists  

---

## Tomorrow

Finish the reporting pack and **justify indexes** against real EXPLAIN on **your** queries. Pack complete for the exam.

---

## Optional review links

Pools and indexes are explained in this chapter.

- [PostgreSQL: Resource consumption / connections](https://www.postgresql.org/docs/current/runtime-config-connection.html)
- [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)
- [psycopg 3: Connection pools](https://www.psycopg.org/psycopg3/docs/advanced/pool.html)
