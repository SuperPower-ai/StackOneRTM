# Month 12 · Week 4 · Day 4
# Lab: Thin Happy Path — Playwright or curl.exe + UI

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 4 — Full-stack application  
**Month index:** [../../README.md](../../README.md)  
**Week 4:** [1](day-01.md) · [2](day-02.md) · [3](day-03.md) · Day 4 (today) · [5](day-05.md) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Learn + lab feature  
**Student state:** You can list-create-list by hand. Today you **record** that path so it can fail in CI later. **Month 14** is deep Playwright. Today a **thin** happy path is enough.  
**Study time:** 3–4 focused hours

Labs: `~\fullstack-lab\month-12\week-04\day-04\`. Continue **tabs** or **stickers**. Not Project 7 source.

**Track A:** one Playwright test: see list (or empty), create, see title.  
**Track B:** if Playwright is deferred (install pain, time), a **scripted** `curl.exe` sequence **plus** a written UI protocol you actually performed, with evidence. Track B is allowed. Do not pretend you ran Playwright.

---

## How to use this textbook

1. Read a section. Close it. Say “thin.”
2. Automate **one** happy path, not a full suite.
3. Optional review links later.

---

## How to read this chapter

RTL + TestClient do not click a **real** browser. CORS, cookies, and Vite appear when a **browser** speaks. Playwright does that. It is also slower and flakier if you over-specify.

Thin means: **one** test file, **one** flow, `getByRole`, no screenshot essay, no visual regression.

```mermaid
flowchart LR
  PW[Playwright] --> V[Vite 5173]
  PW --> A[FastAPI 8000]
  V --> A
```

**Wrong belief:** “Month 12 requires a full Playwright POM framework.”  
**Correct:** Month 14. Today: one spec.

**Wrong belief:** “curl.exe is as good as Playwright for CORS.”  
**Correct:** curl skips CORS. Track B must include a **browser** check you wrote down (Network Allow-Origin, or create in the UI).

---

## Today's contract

By the end of this day you will be able to:

1. Choose Track A or B and write it in `TRACK.md`.  
2. **A:** Install Playwright for the lab; test `list-create-list`; start **both** servers (or Playwright `webServer` if you can).  
3. **B:** `HAPPYPATH.md` with exact `curl.exe` commands **and** UI steps you ran; screenshot optional; statuses required.  
4. Keep the flow aligned with CONTRACT (201, envelope).  
5. Not mock `useQuery` in this path (Playwright uses the real UI).

**Today's gate.** Closed-book:

> I have a repeatable happy path: Playwright one spec, or curl.exe plus a documented UI pass. I know CORS is a browser rule. Month 14 will deepen Playwright.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 40 | Theory: thin E2E vs RTL |
| B | 70 | Track A or B |
| C | 60 | Evidence + one failure restore |
| D | 20 | Git |
| E | 15 | Recall |

---

# Block A — Theory

## 1. What thin covers

| Assert | Thin E2E |
|---|---|
| Empty or loading then form | yes |
| Fill title, submit | yes |
| New title visible | yes |
| 422 loc | no (pytest) |
| Every filter combo | no |

---

## 2. Playwright sketch (Track A)

```powershell
npm init playwright@latest
```

Follow the installer. Prefer Chromium only today.

```ts
import { test, expect } from "@playwright/test";

test("create sticker appears in list", async ({ page }) => {
  await page.goto("http://127.0.0.1:5173/");
  await page.getByLabel(/title/i).fill("Hello sticker");
  await page.getByRole("button", { name: /add/i }).click();
  await expect(page.getByText("Hello sticker")).toBeVisible();
});
```

**Both servers must run.** Document in `README.md`. Playwright `webServer` can start Vite; Uvicorn may be a second command. If that is too much, Track B.

Use **127.0.0.1** to match CORS.

---

## 3. Track B protocol

`HAPPYPATH.md`:

1. Start Uvicorn; `curl.exe` GET empty.  
2. Start Vite; open 127.0.0.1:5173.  
3. Note loading/empty.  
4. Create in UI.  
5. `curl.exe` GET contains title.  
6. Optional: Origin header on curl for Allow-Origin.

That is a **manual** E2E with HTTP proof. Allowed this month.

---

## 4. Auth

If login exists, thin path may skip auth **or** include lab login. Do not record real passwords. Do not write attack cases.

---

## 5. Security

- Base URL 127.0.0.1.  
- No production credentials in playwright config.

---

# Block B — Type-along

```powershell
cd ~\fullstack-lab
mkdir month-12\week-04\day-04 -Force
cd ~\fullstack-lab\month-12\week-04\day-04
```

Rebuild or type a tiny list-create app. Then Track A or B.

Write `TRACK.md`.

---

# Block C — Independent

Break the test (wrong button name) or skip a curl step; show fail; restore. `RED.txt`.

```powershell
cd ~\fullstack-lab
git add month-12
git commit -m "Month 12 Week 4 Day 4: thin happy path evidence."
```

Do not commit Playwright browsers if huge; follow Playwright’s gitignore.

---

# Block E — Recall

1. RTL vs Playwright.  
2. Why curl is not CORS.  
3. Why thin.  
4. 127.0.0.1 vs localhost.  
5. Month 14.

---

## Office hours

**Playwright times out.** Servers not up; CORS localhost mismatch; `isPending` forever (API down).

**Track B without UI.** Not done — add the browser paragraph.

**Full POM.** Delete it. One file.

```mermaid
sequenceDiagram
  participant P as Playwright or human
  participant V as Vite
  participant A as API
  P->>V: open list
  V->>A: GET
  P->>V: submit
  V->>A: POST 201
  V->>A: GET
  P->>P: see title
```

---

## Definition of done

- [ ] TRACK.md A or B  
- [ ] Happy path evidence  
- [ ] RED.txt  
- [ ] README how to run servers  
- [ ] Commit exists  

---

## Optional review links

- [Playwright intro](https://playwright.dev/docs/intro)
- Month 14 will go deeper; do not binge today.

---

## Tomorrow

**Refactor client types; no `any`.** DTOs, parse functions, Query `data` typed.

---

# Worked session — one path, recorded

List-create-list. Playwright **or** curl+UI doc. 127.0.0.1. CORS 5173. 201. Invalidate. `getByRole`. No Project 7. No payload tests.

---

# Closing lecture — evidence beats folklore

“It worked in Chrome” is not a file. Playwright is a file. Track B is a file plus curl. Month 14 will make Playwright ordinary. Today you prove you **can** record the join.

Query and TestClient remain the fast net. E2E is the slow net for the path that makes money (create appears).
