# Month 1 — Computer, Internet, CLI, Git, and Web Architecture

**Program:** Full-Stack Mastery Textbook  
**Phase:** 1 — Foundations  
**Length:** 4 weeks · 7 days each · 3–4 focused hours/day  
**Starting point:** Total full-stack beginner  
**This month’s job:** Make the machine, the network, HTTP, Git, and web architecture *real* — not vocabulary.

If you study only this month’s textbook, you must be able to pass the **Month 1 Gate** at the end of Week 4 Day 7. That is the rule.

---

## How this book teaches (read this)

**This textbook is the lesson.** Every idea the roadmap requires this month is explained in the day files, in words you can study without another site.

Links to Microsoft, Git, or MDN at the end of a day are **optional review** after you already understand the chapter — so you can check that the world still agrees, or go deeper later. They are not a substitute for the explanation above them. You do not need those pages to learn the material the first time.

If a lab says you may use `Get-Help`, that is to read a **command’s flags** on your machine, not to learn the concept. The concept is in this book.

Do not skip a theory section because a URL looks official. Read the theory. Then, if you want, verify.

---

## How this textbook is organized

```
month-01/
  README.md                 ← you are here
  week-01/                  Computer fundamentals
    day-01.md … day-07.md
  week-02/                  Internet and networking
    day-01.md … day-07.md
  week-03/                  HTTP and APIs
    day-01.md … day-07.md
  week-04/                  Git and web architecture + month exam
    day-01.md … day-07.md
```

Each day file is one study day. Do them in order. Do not skip a gate.

The eight roadmap **projects** are specified in `full_stack_project_requirements_2026/`. This textbook will not give you those project solutions. Month 1 has **labs** (you type them). Project 1 begins in Month 2.

---

## Month 1 Gate

You pass the month only when all of these are true **without a tutorial open**:

1. Explain what happens when a URL is entered in a browser  
   (`Browser → DNS → connection → TLS → HTTP → server → response → browser`).
2. Inspect a real HTTP request (method, URL, headers, status, body).
3. Use the terminal: navigate, create/move/delete files, run a program, inspect processes and environment variables.
4. Create a Git repository, commit, and **push** it to GitHub.
5. Draw a simple frontend / API / database architecture and explain each box.

If any item is false, do not start Month 2. Repair the weak week.

---

## What this month must teach (complete list)

From the roadmap — nothing below is optional.

| Week | Must learn | Must practice |
|---|---|---|
| 1 | OS, CPU, memory, storage, files/directories, paths, processes, program vs process, terminal, environment variables, PATH | Navigate filesystem; create/move/delete files; run programs; inspect processes; inspect environment variables |
| 2 | Client/server, IP addresses, DNS, domains, ports, TCP, TLS, HTTPS, request/response lifecycle | Explain the full URL journey; diagnose DNS/port/TLS failures |
| 3 | HTTP methods, headers, body, JSON, query parameters, path parameters, cookies, status codes, caching headers (concept), REST basics | Browser Network tab; curl; an API client |
| 4 | Git: repository, commit, diff, log, remote, push/pull, `.gitignore`. Architecture: frontend, backend, API, database, authentication, authorization, web server, application server | Push a repo; draw and explain architecture |

Horizontal skills this month (they run all 18 months — we start them now):

- **Debugging:** read errors, isolate “where am I / what did I type / what is missing.”
- **Documentation:** official docs over random blogs; write a README for the lab repo.
- **Communication:** notes another engineer could follow.
- **Computer science (gradual):** bits/bytes, processes, memory vs storage, client/server as two programs on two machines.
- **Security (start):** HTTPS meaning, do not commit secrets, cookies are credentials, `.gitignore` exists for a reason.
- **Tests (start):** a test is a claim that can fail. This month you write claims and check them by running commands. Language test frameworks come later.

---

## Weekly rhythm (every week)

| Day | Roadmap rhythm | What you do |
|---|---|---|
| 1 | Learn + small exercises | New theory. Type-along labs. |
| 2 | Exercises + debugging | Drill. Break things. Read errors. |
| 3 | Implement from memory | Rebuild yesterday’s skills with the file closed. |
| 4 | Add a real project feature | Extend `fullstack-lab` with a real artifact. |
| 5 | Tests + refactor + documentation | Verify, clean up, write the README. |
| 6 | Independent project work | Spec only. No type-along solution. |
| 7 | Review | Explain aloud, repair weak spots, plan next week. |

Week 4 Day 7 is the **Month 1 exam** (all seven review types from the roadmap).

---

## Daily time box (every day)

| Minutes | Block |
|---|---|
| 30–45 | Concepts from this textbook (optional review links only after the chapter is already clear) |
| 45–60 | Focused exercises |
| 60–90 | Independent work |
| 30–60 | Lab / “project” work (Month 1 = `fullstack-lab`, not Project 1) |
| 15 | Notes / recall / review |

Extra time goes to independent work, not more videos.

---

## Tools you need this month

Install these before Week 1 Day 2 is over. Week 1 Day 1 can start with PowerShell alone.

| Tool | Why | Month 1 use |
|---|---|---|
| **Windows PowerShell** | Your shell | Every day |
| **Git for Windows** | Version control | Day 1 ritual; mastery in Week 4 |
| **A browser** (Edge or Chrome) | DevTools Network tab | Weeks 2–3 |
| **Cursor / VS Code** | Editor | Notes, scripts, markdown |
| **GitHub account** | Remote + push | Week 4 |
| **curl.exe** | HTTP from the terminal | Week 3 (already on modern Windows) |
| **An API client** | Roadmap requires it | Week 3 Day 4: Bruno, Insomnia, Thunder Client, or Postman — any one |

Linux commands appear in tables so Month 15 is not a foreign language. You work in PowerShell now.

---

## Lab repository (not a roadmap project)

All Month 1 typed work lives in:

```
~/fullstack-lab/
```

By the end of the month it must contain:

- Week 1 machine inspector script and notes
- Week 2 URL-journey writeup
- Week 3 HTTP inspection notes and JSON samples
- Week 4 architecture diagram (markdown or image) and a GitHub remote
- `README.md`
- `.gitignore`
- A Git history from Week 1

You will **push this repo**. You will not receive a finished copy from this textbook.

---

## Standing rules (from the roadmap)

1. Build every week.
2. Git from Day 1.
3. Tests begin now, at this month’s level.
4. Security begins now, at this month’s level.
5. Try first. Then ask AI. Then verify with official docs. Then explain.
6. Learn a tool because a problem needs it.
7. Correctness → clarity → measurement → optimization. No premature optimization.

Never keep text in your notes that you cannot explain.

---

## Definition of done for a day

Borrowed from the roadmap’s mastery ladder, scaled to today:

- **Understand** — explain it.
- **Implement** — do it in the terminal without copying a tutorial.
- **Debug** — when it fails, find why.
- **Test** — state a claim and check it.
- **Secure** — know the obvious risk (secrets, HTTP vs HTTPS, cookies).
- **Design** — know when the idea applies.
- **Operate** — run it on your machine.
- **Optimize** — not this month’s focus. Do not tune what you cannot yet measure.

---

## Start

Open [week-01/day-01.md](week-01/day-01.md).

Do not read Week 4 first. The exam will catch you if you skip.
