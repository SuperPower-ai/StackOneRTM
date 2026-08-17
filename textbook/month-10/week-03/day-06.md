# Month 10 · Week 3 · Day 6
# Independent: Invariants Your Project 6 Schema Must Enforce

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 3 — Python and backend  
**Month index:** [../../README.md](../../README.md)  
**Week 3:** [1](day-01.md) · [2](day-02.md) · [3](day-03.md) · [4](day-04.md) · [5](day-05.md) · Day 6 (today) · [7](day-07.md)  
**Week rhythm today:** Independent implementation  
**Student state:** You can prove abort and ROLLBACK on lab tables. Today you name the **same class of rules** on **your** Stage B schema.  
**Study time:** 3–4 focused hours

Work in `~/ops-api/sql/` (or fullstack-lab day-06). This textbook will **not** list your invariants for you. No finished project. No SQLAlchemy. No API. No blog schema.

---

## How to use this textbook

1. Open **your** SCHEMA.md. Write invariants in English first.  
2. For each: constraint, transaction, or “application must wrap.”  
3. Prove at least **two** with SQL on **your** database.  
4. Optional review links are for later rechecking.

---

## How to read this chapter

A schema without named invariants is a drawing. Week 1 FKs are invariants. Week 3 adds **bundles**: “create parent and child together or not at all,” “move quantity without a split,” “do not overwrite status with a stale read.”

```mermaid
flowchart TB
  S[Your SCHEMA.md] --> I[INVARIANTS.md]
  I --> DB[CHECK FK UNIQUE]
  I --> TX[BEGIN pairs]
  I --> APP[Must wrap in API later]
```

**Wrong belief:** “I’ll enforce everything in FastAPI.”  
**Correct:** FastAPI is a client. Dual-write without a transaction is how inventory lies.

**Wrong belief:** “I’ll copy the bins transfer into ops-api.”  
**Correct:** only if your product **has** a conservation law. Name **your** law.

---

## Today's contract

By the end of this day you will be able to:

1. List **at least six** invariants for your domain.  
2. Tag each: `constraint` / `transaction` / `isolation-note` / `later-trigger`.  
3. Prove two constraint failures abort a bundle **on your tables**.  
4. Identify one **lost-update** risk in your nouns.  
5. Identify one operation that **must** be a single transaction in Month 11.

**Today's gate.** Closed-book:

> I can name what the DB already refuses and what still needs a transaction. I proved abort on my schema. I did not paste Atlas bins as my product. I did not ship an API.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 40 | Inventory of rules from SCHEMA.md |
| B | 40 | INVARIANTS.md complete tags |
| C | 80 | Two proofs + one race story |
| D | 20 | Align docs; git |
| E | 15 | Recall |

---

# Block A — Harvest rules

From your CREATE TABLE files, list every CHECK, UNIQUE, FK, NOT NULL. Those are **already** invariants. Do not stop there. Ask:

- Can a child exist without a parent? (FK)  
- Can two members share the same pair? (composite PK)  
- Can a workflow skip a required sibling row? (**transaction**)  
- Can two agents decrement the same qty? (**isolation / single SQL UPDATE**)  
- Can DELETE parent while work remains? (RESTRICT)

Forbidden: inventing a blog. If Day 6 Week 1 is missing, repair that first.

---

# Block B — INVARIANTS.md template (fill with your nouns)

For each row:

| ID | Sentence | Mechanism | Proof |
|---|---|---|---|
| I1 | … | FK RESTRICT | `proofs/i1.sql` |
| I2 | … | CHECK | |
| I3 | … | UNIQUE | |
| I4 | create X and Y together | transaction | |
| I5 | qty conserved | transaction + CHECK | |
| I6 | status not stale-written | isolation note: use SQL `status = 'open'` in WHERE | |

You need **six**. Extra is fine. `later-trigger` is allowed once if you cannot encode yet — write why, not as a cop-out for a missing FK.

Write `MONTH11.md`: which FastAPI handler will BEGIN a transaction (names only, no code).

---

# Block C — Prove two

On `ops_api` (or your Day 6 DB):

1. BEGIN; insert parent; insert illegal child; ROLLBACK; parent gone.  
2. Either UNIQUE abort bundle **or** a two-update transfer/move in your domain with ROLLBACK.

`proofs/` + `RESULTS.md`.

**Race story** `RACES.md`: one lost-update in your nouns; whether `col = col + 1` fixes it; whether FOR UPDATE would be the read-think-write case.

No SELECT FOR UPDATE against production. Lab DB only. No lock-wait loops.

If you use Python, placeholders, rollback on exception.

---

# Block D — Git

Update SCHEMA.md with a link to INVARIANTS.md.

```powershell
cd ~\ops-api
git add sql SCHEMA.md INVARIANTS.md
git commit -m "Month 10 Week 3 Day 6: Stage B transactional invariants."
```

---

# Block E — Recall

1. Constraint vs multi-row invariant.  
2. Why RESTRICT is an invariant.  
3. One operation that needs BEGIN in Month 11.  
4. Stale write in your domain.  
5. Why abort takes the sibling insert.

## Office hours

**All six are FKs.** Add a transaction invariant (create two rows) and an isolation note. Variety is the lesson.

**I have no qty.** Status transitions, membership add+audit, issue+label — any pair.

**Proofs ran on w3l_ lab tables.** Wrong. Your nouns.

---

## Definition of done

- [ ] Six tagged invariants  
- [ ] Two proofs on **your** schema  
- [ ] RACES.md  
- [ ] MONTH11.md handler names  
- [ ] Commit exists  

---

## Tomorrow

Week review: transactions + constraints. Mini exam on a new pair of updates. Repair from Day 7’s synthesis.

---

## Optional review links

- [PostgreSQL: Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [PostgreSQL: Transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html)
- [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
