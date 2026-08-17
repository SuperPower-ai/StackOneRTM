# Month 10 · Week 3 · Day 3
# From Memory: Two Updates in One Transaction

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 3 — Python and backend  
**Month index:** [../../README.md](../../README.md)  
**Week 3:** [1](day-01.md) · [2](day-02.md) · Day 3 (today) · [4](day-04.md) · [5](day-05.md) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Implement from memory  
**Student state:** You have typed BEGIN/COMMIT/ROLLBACK and heard lost-update stories. Today a **transfer-like** pair of updates must live in your head.  
**Study time:** 3–4 focused hours  
**Prereq:** Day 2 gate passed.

Labs: `~\fullstack-lab\month-10\week-03\day-03\`. Noun: **`w3_bins`** inventory transfer, not `w3_accounts` copied. Days 1–2 closed for 25 minutes of Block 2. No complete solution dump. No SQLAlchemy. No lock cookbook.

---

## How Day 3 works

Allowed: this recap, `psql` errors, two windows if you need them.  
Not allowed: pasting Day 1 transfer SQL, AI-finished transactions, attacking anything but `month10`.

Stuck > 25 minutes: open **only** the matching Day 1 or Day 2 section, close it, log `lookups.txt`.

---

## How to read this chapter

Two stock movements are **one** business fact: leave bin A, enter bin B. Autocommit would allow “left A, never arrived in B.” A transaction makes them one.

```mermaid
flowchart LR
  B[BEGIN] --> D[UPDATE src qty]
  D --> I[UPDATE dst qty]
  I --> C[COMMIT]
```

**Wrong belief:** “Memory day means I keep Day 1 SQL on screen.”  
**Correct:** the recap is the teacher.

---

## Complete explanation (transactions you must still own)

A **transaction** starts at BEGIN and ends at COMMIT or ROLLBACK. **Autocommit** in `psql` commits each statement. Two UPDATEs without BEGIN are two facts.

**Atomicity:** both qty changes or neither. **Consistency:** CHECKs (`qty >= 0`) still apply; a failure **aborts** the transaction — ROLLBACK; further commands fail until you end the block. **Isolation:** default Read Committed; others do not see uncommitted qty. **Durability:** COMMIT means the transfer survived a crash.

**ROLLBACK** undoes uncommitted work. Sequences may still gap.

**Lost update:** reading qty into a variable and writing `qty = 7` can clobber a concurrent decrement. Prefer `SET qty = qty - 1` in SQL. SELECT FOR UPDATE is for read-think-write across multiple rows/decisions — concept, not a script to hang sessions.

**Transfer pattern:**

1. BEGIN  
2. UPDATE source `qty = qty - :n WHERE id = :src AND qty >= :n` — if UPDATE 0, ROLLBACK (insufficient stock)  
3. UPDATE dest `qty = qty + :n WHERE id = :dst`  
4. COMMIT  

RETURNING both rows. If dest id is wrong, FK/WHERE 0 rows — ROLLBACK so source is not decremented.

CHECK `qty >= 0` is a backstop. UPDATE 0 on insufficient stock is friendlier than a CHECK error, but CHECK still saves you from a bug that subtracts anyway.

Placeholders in Python: `%s`. Never f-string qty.

---

## Today's contract

**Today's gate.** Closed-book:

> I moved quantity between two bins in one transaction. ROLLBACK left both bins as before. A failed second UPDATE aborted the first. I used qty = qty - n, not a stale absolute. I did not copy the accounts file.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| 1 | 25 | Speak recap; sketch bins |
| 2 | 90 | CREATE bins + transfer SQL from memory |
| 3 | 45 | Insufficient stock + two-window visibility |
| 4 | 20 | Git |
| 5 | 15 | Recall |

---

# Block 1 — Sketch

`w3_bins (id, code UNIQUE, qty INTEGER CHECK >= 0)`. Two bins: `A` qty 10, `B` qty 0. Transfer 4 from A to B. Speak autocommit failure mode. Speak CHECK vs WHERE qty >= n.

---

# Block 2 — Spec (you implement)

```powershell
mkdir ~\fullstack-lab\month-10\week-03\day-03 -Force
cd ~\fullstack-lab\month-10\week-03\day-03
```

Write `01-schema.sql`, `02-transfer-commit.sql`, `03-transfer-rollback.sql`.

Must:

1. CREATE table; seed A=10, B=0.  
2. BEGIN; decrement A by 4 with `qty = qty - 4`; increment B by 4; SELECT both; COMMIT. Final 6 and 4.  
3. Reset; BEGIN; decrement A; ROLLBACK; both back to 10 and 0.  
4. BEGIN; decrement A; `SELECT 1/0` or illegal UPDATE; prove abort; ROLLBACK; A not stuck decremented.  
5. RETURNING on both UPDATEs.

25-minute timer closed-book for schema + first successful transfer.

`PROOF.md` with numbers.

---

# Block 3 — Independent

**Insufficient stock.** Transfer 999 from A. Prefer `WHERE qty >= 999` and treat UPDATE 0 as failure + ROLLBACK. Also try a transfer that trips CHECK if you omit the WHERE. Record both. `STOCK.md`.

**Visibility.** Optional two windows: BEGIN transfer, do not commit; other session SELECT qty. Other session should see old qty. COMMIT; see new. `VISIBILITY.md`.

**Stale write (do not ship).** Once, demonstrate lost-update **or** write why you refuse to `SET qty = 6` after a SELECT. `STALE.md`.

No FOR UPDATE loops. If you use FOR UPDATE, one SELECT of bin A in a short transaction, then UPDATE, COMMIT immediately.

---

# Block 4 — Git

```powershell
cd ~\fullstack-lab
git add month-10\week-03\day-03
git commit -m "Month 10 Week 3 Day 3: bin transfer in one transaction."
```

---

# Block 5 — Recall

1. Why two UPDATEs need BEGIN.  
2. UPDATE 0 vs CHECK fail.  
3. Aborted state.  
4. qty = qty - n vs stale 6.  
5. lookups.txt.

## Office hours

**I copied w3_accounts.** Wrong noun. Bins.

**B went to 4, A stayed 10.** You committed only the second statement (autocommit). One BEGIN around both.

**Hung session.** Open transaction. ROLLBACK.

---

## Definition of done

- [ ] Transfer commit 6/4  
- [ ] Rollback restores  
- [ ] Abort experiment  
- [ ] STOCK.md  
- [ ] Commit exists  

---

## Tomorrow

Lab: **prove ROLLBACK undoes** and **constraint failure aborts** with a checklist someone else can rerun.

---

## Optional review links

The recap in this file is the teacher.

- [PostgreSQL: Transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html)
- [PostgreSQL: UPDATE](https://www.postgresql.org/docs/current/sql-update.html)
