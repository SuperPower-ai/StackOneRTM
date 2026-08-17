# Month 14 · Week 2 · Day 5
# Regression Tests: Reproduce the Bug with a Test First

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 4 — Full-stack application  
**Month index:** [../../README.md](../../README.md)  
**Week 2:** [1](day-01.md) · [2](day-02.md) · [3](day-03.md) · [4](day-04.md) · Day 5 (today) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Learn + type-along  
**Student state:** You can fake mail and assert 403. Today you practice the loop Month 1 promised: **red, green, keep the test**.  
**Study time:** 3–4 focused hours

Labs: `~\fullstack-lab\month-14\week-02\day-05\`. Do not paste Project 7. You will **plant** a bug in a tiny app, lock it with pytest, then fix it.

---

## How to use this textbook

1. Read the loop. Do not skip the red step.  
2. Type the broken behavior **on purpose**, write the test, watch it fail, fix, watch it pass.  
3. A test written after you already fixed the bug is a souvenir unless you proved it would have failed.  
4. Optional review links are for later rechecking.

---

## How to read this chapter

A **regression test** is a claim that a bug **cannot return unnoticed**. The honest way to write it is to **see red** on the bug, then green on the fix.

```mermaid
flowchart LR
  BUG[Observe or plant bug] --> RED[Test fails]
  RED --> FIX[Fix production code]
  FIX --> GREEN[Test passes]
  GREEN --> KEEP[Commit the test]
```

**Wrong belief:** “I’ll fix it first; tests later if I have time.”  
**Correct:** after the fix you cannot prove the test would have caught it unless you temporarily revert the fix (Week 4 Day 6 rehearsal). Today we **start** from red.

**Wrong belief:** “Any new assert is a regression test.”  
**Correct:** it is a regression test when it encodes a **specific failure that happened** (or that you planted as practice). Name the test after the bug: `test_blank_code_does_not_create_hold`.

---

## Today's contract

1. Tell a bug story in one paragraph (`BUG.md`).  
2. Write a failing test **before** changing the fix (or restore the bug if you jumped).  
3. Fix the smallest production change.  
4. Keep the test.  
5. Explain why a snapshot of the whole JSON is a weak regression net.

**Today's gate.** Closed-book:

> I reproduce with a test first. I watch pytest fail for the right reason. I fix. I keep the test. That is the Month 14 exam in miniature.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 45 | Theory |
| B | 75 | Type-along: planted bug → red → green |
| C | 60 | Independent: second bug (authz or 409) |
| D | 15 | Git |
| E | 15 | Recall |

---

# Block A — Theory

## 1. Why “test first” for bugs

When you fix by intuition, you often fix a **symptom** (add a null check) without pinning the **rule**. The next refactor removes the check. A named test is the rule’s memory.

Month 8 already did a regression drill on a JSON store. Month 14 does it on **HTTP + a rule**, because that is Project 7’s shape.

## 2. The red you want

`uv run pytest -q --tb=short` should fail with an **assertion** you recognize, not an import error, not a fixture hang.

Bad red: `FixtureNotFound`. You wrote the test wrong.  
Good red: `assert 201 == 422` or `assert True is False` on `can_edit`.

Read the traceback from the **bottom** (Month 8). The last assertion is the claim.

## 3. Bisecting a real bug (product)

When Day 6 you isolate **your** API tests, a real bug might appear:

1. Write `test_...` that names the behavior you wanted.  
2. Confirm red on current main.  
3. Fix.  
4. Confirm green.  
5. Commit **test and fix together** or test-first then fix — both are fine if red was seen.

If you cannot get red, you do not understand the bug yet. Do not skip to green.

## 4. Characterization tests

Sometimes you inherit mystery code. A **characterization** test pins **current** behavior, even if it is ugly, so a refactor cannot drift silently. Later you change the test when you change the contract on purpose.

Regression tests for **bugs** pin the **desired** behavior. Do not confuse the two. If current behavior is the bug, the test must fail now.

## 5. Weak regression tests

| Weak | Why | Stronger |
|---|---|---|
| Snapshot entire JSON | Any new field fails; bug might still be in a field you never read | Assert the field that was wrong |
| `assert status_code != 500` | 200 with wrong body still passes | Assert 403/422/body key |
| UI screenshot only | Flakes; misses API | TestClient + one Playwright journey |
| `test_bugfix` with no comment | Nobody knows the story | Name + `BUG.md` link |

## 6. pytest.raises and HTTP

Unit: `with pytest.raises(ValueError):`.  
HTTP: assert status. Do not `raises(HTTPException)` around TestClient — the client **catches** it and returns a response.

## 7. Repro files

Keep `tests/test_regressions.py` or put the test next to the resource. A junk drawer is fine if names are searchable. `TEST-STRATEGY.md` can list “regression: blank code 409 vs 201” as a story.

## 8. The exam connection

Week 4 Day 7: **break a feature on purpose**; show which automated test fails; repair. That only works if a test exists. Today you practice **creating** that kind of test from a bug story.

---

# Block B — Type-along

```powershell
cd ~\fullstack-lab
mkdir month-14\week-02\day-05 -Force
cd ~\fullstack-lab\month-14\week-02\day-05
uv init --name lab-regression
uv add fastapi
uv add --dev pytest httpx
```

Build a tiny **holds** API: POST 201 with `title` and `code`. **Plant this bug on purpose:** POST with `code: "  "` (spaces) still returns **201** and stores a blank-looking code (strip never ran). That is a real class of bug.

`BUG.md`: “Whitespace-only codes were accepted and later broke uniqueness.”

**Order of work (do not skip):**

1. Implement the buggy behavior (no strip / no reject).  
2. Write `test_whitespace_code_rejected` expecting **422** (or 400 if you contract that — pick 422).  
3. `uv run pytest` — **must be red**. Paste the failure in `RED1.txt`.  
4. Fix: `Field(min_length=1)` after strip, or a validator.  
5. `uv run pytest` — green.  
6. Keep the test.

Also a unit test on `normalize_code(code: str) -> str` if you extract strip+validate. Red/green that too.

```powershell
uv run pytest -q
```

---

# Block C — Independent

Second story — pick **one**:

- **Unique:** second POST same code returns 200 instead of 409 (plant, test 409, fix).  
- **Deny:** PATCH as stranger returns 200 (plant, test 403, fix).  
- **Mail:** create 422 still sends mail (if you copy Day 4 pattern).

Same loop: `BUG2.md`, `RED2.txt`, fix, green.

Write `WHY-FIRST.md`: what would have happened if you had fixed before the test.

Do not start a coverage trophy. Do not paste product bugs as source; you may **name** a real Project 7 bug in `PRODUCT.md` (title only) for Day 6.

```powershell
cd ~\fullstack-lab
git add month-14
git commit -m "Month 14 Week 2 Day 5: regression red-green for whitespace codes."
```

---

# Block E — Recall

1. Good red vs fixture red.  
2. Why TestClient does not use `pytest.raises(HTTPException)`.  
3. Characterization vs regression.  
4. Weak snapshot tests.  
5. How this prepares Week 4 Day 7.

## Office hours

**Went green immediately.** You already fixed it. Revert the fix (`git checkout` the app file), confirm red, then fix again. That is the skill.

**Test failed on 201 vs 422 but for the wrong field.** Tighten the assert (`loc` contains `code`).

**Planted bug felt fake.** Good. Real bugs feel the same in pytest: red, then green.

Windows: `--tb=short` keeps the story readable.

## Minimum regression shape

```python
def test_whitespace_code_rejected(client: TestClient) -> None:
    r = client.post("/holds", json={"title": "North", "code": "   "})
    assert r.status_code == 422
```

If this is green on a buggy app, your app already rejects — pick another bug.

---

## Definition of done

- [ ] `RED1.txt` shows a real assertion failure  
- [ ] Fix committed with the test  
- [ ] Second bug loop done  
- [ ] `WHY-FIRST.md` written  
- [ ] Commit exists  

---

## Optional review links

The red-green loop is explained in this chapter.

- [pytest](https://docs.pytest.org/en/stable/)  

---

## Tomorrow

**Independent:** isolate **your** API tests (test DB, fixtures, fakes at boundaries). Product repo, not a paste of this lab into production.


<!-- length-pad -->
# Lecture: regression red then green

This section is still the lesson. Read it if a block felt thin. Say each claim aloud before you continue.

## Claims you must still own

1. Good red is an assertion you recognize, not FixtureNotFound.

2. Read tracebacks from the bottom.

3. Name tests after the bug story.

4. TestClient does not use pytest.raises(HTTPException).

5. Characterization pins current behavior; regression pins desired.

6. Snapshots of whole JSON are weak.

7. If you went green immediately, revert the fix and prove red.

8. The exam needs this loop on a feature break.

9. Keep the test after the fix.

10. Planting a bug in a lab is practice; planting on main overnight is not.

## Wrong belief / Correct

**Wrong belief:** “I'll fix first; tests later.”  
**Correct:** You cannot prove the test would have caught it.

**Wrong belief:** “Any new assert is a regression test.”  
**Correct:** It must encode a specific failure.

**Wrong belief:** “assert status != 500 is enough.”  
**Correct:** 200 with the wrong body still passes.

## Drills (write answers in the lab folder)

1. Produce RED1.txt from whitespace codes.

2. Run a second bug loop.

3. Write WHY-FIRST.md.

## Windows

- uv run pytest -q --tb=short

## Pitfalls

- test_bug as a name.

- Raising HTTPException around TestClient.

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
# Worked questions: red-green

Write answers in `Q.md` in the day's lab folder before you peek at the sentences under each question. Then compare.

**Q1.** What is good red?

Answer: An assertion about status or a predicate, not FixtureNotFound.

**Q2.** Why revert if already green?

Answer: You never saw the test catch the bug.

**Q3.** Why not pytest.raises(HTTPException) around TestClient?

Answer: The client turns it into a response.

**Q4.** Weak snapshot?

Answer: Any new field fails; the bug field might not be asserted.

**Q5.** Characterization vs regression?

Answer: Current vs desired. Do not pin a bug as desired.

**Q6.** Exam connection?

Answer: Break a feature; a kept test goes red.

**Q7.** Name shape?

Answer: test_whitespace_only_code_returns_422.

**Q8.** Second loop?

Answer: 409, 403, or mail-on-422. Same red-green.

**Q9.** Commit?

Answer: Test and fix together or test first then fix — red must have been seen.

**Q10.** Plant on main?

Answer: No. Lab or a branch.

## Quick table

| Idea | Honest use | Dishonest use |
|---|---|---|
| Red | Bug exists | Fixture typo |
| Green | Fix works | You deleted the test |
| Keep | Memory | Souvenir without red |
| Name | Grep the story | test_bug |
| HTTP | status_code | raises HTTPException |

## Closing

Month 14's exam is this loop aimed at a product feature. Practice until RED1.txt exists.

If this page is the only thing you remember tomorrow, you still have the day's gate. Type the lab. Run the command. Do not paste Project 7.

## One more planted story (if Block C was thin)

Plant `PATCH` as a stranger returning 200. Write `test_stranger_patch_returns_403`. Watch red. Call `can_edit` in the route. Watch green. That is Month 13 plus Month 14 in one motion.

Do not leave the plant on disk when you stop. The test stays. The bug does not.

The stranger-PATCH story is the same loop as whitespace codes: name the claim, see red, fix the route, keep the test. If you already did this in Block C, write `ALREADY.md` instead of planting twice.

That loop is also how you un-OWED a deny test in TEST-STRATEGY.md before the exam.

```powershell
uv run pytest -q --tb=short
```
