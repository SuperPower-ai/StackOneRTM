# Month 14 · Week 2 · Day 6
# Independent: Isolate Your API Tests

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 4 — Full-stack application  
**Month index:** [../../README.md](../../README.md)  
**Week 2:** [1](day-01.md) · [2](day-02.md) · [3](day-03.md) · [4](day-04.md) · [5](day-05.md) · Day 6 (today) · [7](day-07.md)  
**Week rhythm today:** Independent implementation  
**Student state:** You practiced fixtures, DB isolation patterns, 403, FakeMailer, and regression loops **in labs**. Today those habits land in **your** API repository.  
**Study time:** 3–4 focused hours

This textbook will **not** paste Project 7. Product tests live in **your** repo. Evidence notes (paths, commands, counts) may live in `~\fullstack-lab\month-14\week-02\day-06\`.

---

## How to use this textbook

1. Work in the API repo you already have.  
2. Write fixtures and tests **you** own. AI may review; it may not ship the suite.  
3. If isolation is already excellent, **prove** it with an empty-start test and document the pattern.  
4. Optional review links are for later rechecking.

---

## How to read this chapter

Week 2’s product skill is not “I have a lab SQLite.” It is “`uv run pytest` on **my** API is deterministic, isolated, and fakes I/O at boundaries.”

```mermaid
flowchart TB
  URL[TEST_DATABASE_URL] --> FIX[conftest fixtures]
  FIX --> HTTP[TestClient tests]
  FIX --> MAIL[FakeMailer override]
  HTTP --> EMPTY[test_list_starts_empty or equivalent]
```

**Wrong belief:** “I’ll copy Day 2’s SQLite engine into production tests and call Postgres done.”  
**Correct:** the product test DB is **Postgres** (Month 11). SQLite was a pattern gym. If you still mock `Session.commit` everywhere, today is the day you stop for at least **one** resource.

**Wrong belief:** “Isolation means deleting the developer database by hand before pytest.”  
**Correct:** fixtures do it every test. Hands are not CI.

---

## Today's contract

1. `TEST_DATABASE_URL` (or equivalent) points at a **named test** database.  
2. Fixtures isolate (rollback, truncate, or documented equivalent).  
3. At least one **empty-start** (or equivalent “no leftover rows”) test.  
4. Mail/Redis/clock faked at a boundary **or** an honest OWED with a date.  
5. `uv run pytest -q` documented; no production URL.

**Today's gate.** Closed-book:

> My API pytest uses a test database, isolates rows, and does not send real email. I can name the fixture that resets state.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 25 | Inventory current pytest + DB URL |
| B | 40 | Safety assert + isolation fixture |
| C | 90 | Empty-start + one deny or mail fake |
| D | 20 | Update TEST-STRATEGY.md isolation section |
| E | 15 | Recall + evidence note |

---

# Block A — Inventory

In `~\fullstack-lab\month-14\week-02\day-06\INVENTORY.md` (paths only):

| Question | Answer |
|---|---|
| Command that runs API tests | |
| Database URL env var name | |
| Does the name contain `test`? | |
| Isolation pattern today | none / rollback / truncate / hope |
| Mail in pytest | real / fake / no mail yet |
| Flaky test names | |

Run `uv run pytest -q` in the **API** repo. Record counts. If the suite is huge, run a folder you own (`tests/api` or similar).

---

# Block B — Safety and isolation

**Must:**

- Refuse to run if the database URL looks like production (substring `test`, or a dedicated user, or both — write the rule).  
- Function-scoped cleanup: rollback **or** truncate **or** delete in FK order.  
- `dependency_overrides.clear()` in teardown if you override.

**Should:**

- `pytest.ini` / `pyproject.toml` mark `db`.  
- Factory for the primary resource with overrides (Week 2 Day 1).

**Must not:**

- `DROP DATABASE` on a URL you use for manual clicking unless it is clearly `*_test`.  
- Commit secrets.  
- Paste routers into the lab folder.

Windows: set env in the session:

```powershell
$env:TEST_DATABASE_URL = "postgresql+psycopg://USER:PASS@127.0.0.1:5432/YOUR_APP_test"
uv run pytest -q
```

Use **your** credentials locally; never paste them into the textbook lab git.

---

# Block C — Proof tests

Add (names yours):

1. A test that the **list of your primary resource starts empty** (or empty for a unique filter you control). If you cannot empty the whole table because of seeds, document seed rows and assert a **unique code you create** is not present at start — then still isolate that code. Prefer true empty for a table you own.  
2. One **403 or 401** TestClient test if missing (Month 13).  
3. If you send email: FakeMailer override and `sent` assert on one path; 422 does not send.

If Alembic is required, `upgrade head` on the test DB **once** (session fixture or a documented script). Do not migrate production.

Regression: if you found a real bug, use Day 5’s loop. If not, do not plant a bug in production without a branch (Week 4 Day 6 is the rehearsal).

---

# Block D — Strategy update

Update **your** `TEST-STRATEGY.md` section 5 (isolation) and 3 (doubles) with what you actually implemented. If you still mock Session for most tests, write **why** and what you will miss. Honesty > cosmetics.

Copy no source into fullstack-lab. `EVIDENCE.md` in the lab: commands, test names, pass counts.

---

# Block E — Recall

1. Why SQLite lab ≠ product proof.  
2. Safety assert limitation.  
3. Why empty-start must not be deleted when it flakes.  
4. Overrides teardown.  
5. Where evidence lives vs where tests live.

```powershell
cd ~\fullstack-lab
git add month-14
git commit -m "Month 14 Week 2 Day 6: API isolation evidence notes (no product source)."
```

Commit fixture work in the **API** repo separately.

---

## Office hours

**Cannot create a test database.** Month 10–11 unfinished. Create `app_test` with `createdb` / pgAdmin. Do not pytest on `postgres` default DB full of experiments if you can avoid it.

**Rollback vs commit war.** Truncate for the week; read Day 2 savepoint note; do not mock commit as the “fix.”

**Suite 40 minutes.** Marks and a fast subset for default; full `db` in CI later (Month 16). Still isolate.

**No FastAPI tests at all.** Then Days 3–5 labs were not enough: add TestClient tests **now** on one resource. The month gate requires a test that goes red when you break a feature.

## Forbidden

Project 7 source in `fullstack-lab`. `.env` with real passwords in git.

---

## Definition of done

- [ ] Test DB URL documented and used  
- [ ] Isolation fixture exists  
- [ ] Empty-start (or equivalent) green **and** order-independent  
- [ ] Strategy section updated  
- [ ] Lab evidence without source  
- [ ] API repo commit exists  

---

## Optional review links

Isolation is explained in Day 2 of this week.

- [pytest](https://docs.pytest.org/en/stable/)  

---

## Tomorrow

**Week review.** Synthesis, mini-build (not your product), debug, plan Week 3 (RTL, MSW, a11y).


<!-- length-pad -->
# Lecture: isolating YOUR api tests

This section is still the lesson. Read it if a block felt thin. Say each claim aloud before you continue.

## Claims you must still own

1. Postgres test database, not the SQLite gym as proof.

2. Safety assert on the URL.

3. Isolation fixture every test.

4. Empty-start or equivalent unique-code absence.

5. Fake mail/redis/clock or dated OWED.

6. Alembic on the test DB.

7. Evidence is paths and names, not source.

8. Do not DROP a URL you use for clicking unless it is clearly *_test.

9. If the suite is huge, still isolate the folder you run.

10. Strategy section 5 must match reality.

## Wrong belief / Correct

**Wrong belief:** “Copy Day 2 SQLite into production tests.”  
**Correct:** Product is Postgres.

**Wrong belief:** “Isolation means deleting the DB by hand.”  
**Correct:** Fixtures do it.

**Wrong belief:** “I still mock Session.commit for everything.”  
**Correct:** Keep at least one resource honest.

## Drills (write answers in the lab folder)

1. Fill INVENTORY.md.

2. Run empty-start until order-independent.

3. Update TEST-STRATEGY.md.

## Windows

- $env:TEST_DATABASE_URL = '...'

- uv run pytest -q

## Pitfalls

- Secrets in lab git.

- Deleting empty-start because it flakes.

## Say it in six sentences

Close the file. Speak the day's gate paragraph. Name the command you will run. Name the folder you will type in. Name what you will not paste. Name the test that would go red if you broke the matching product behavior. If you cannot, reread Block A.

## Git reminder

```powershell
cd ~\fullstack-lab
git add month-14
git status
```

Commit when the day's definition of done is true. Do not commit secrets. Product tests stay in product repos.

<!-- length-pad-2 -->
# Worked questions: product isolation

Write answers in `Q.md` in the day's lab folder before you peek at the sentences under each question. Then compare.

**Q1.** Why not SQLite as product proof?

Answer: Postgres types and constraints differ.

**Q2.** Safety assert limitation?

Answer: A prod name could contain the letters test.

**Q3.** Empty-start flakes?

Answer: Fix fixtures; do not delete the detector.

**Q4.** Rollback vs commit war?

Answer: Savepoint or truncate; do not mock commit as the fix.

**Q5.** Evidence format?

Answer: repo, cmd, passed, isolation, test names.

**Q6.** Alembic?

Answer: upgrade head on the test DB.

**Q7.** Secrets?

Answer: Env in the session; never lab git.

**Q8.** No tests at all?

Answer: Add TestClient on one resource today.

**Q9.** Huge suite?

Answer: Marks and a folder; still isolate.

**Q10.** Strategy mismatch?

Answer: Rewrite section 5 to match reality.

## Quick table

| Idea | Honest use | Dishonest use |
|---|---|---|
| Test DB | Dedicated name | Shared with TablePlus humans |
| Rollback | Fast | Broken by commit |
| Truncate | Survives commit | Forgotten table |
| Mock Session | Fast | Misses constraints |
| Evidence | Names | Pasted routers |

## Closing

Day 6 is the week that matters: YOUR repo. Labs do not replace it.

If this page is the only thing you remember tomorrow, you still have the day's gate. Type the lab. Run the command. Do not paste Project 7.
