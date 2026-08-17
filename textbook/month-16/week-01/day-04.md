# Month 16 · Week 1 · Day 4
# Lab: Integration Tests with a Postgres Service Container

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 5 — Production engineering  
**Month index:** [../../README.md](../../README.md)  
**Week 1:** [1](day-01.md) · [2](day-02.md) · [3](day-03.md) · Day 4 (today) · [5](day-05.md) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Lab (type-along + independent)  
**Student state:** You can write a unit CI job from memory. Unit tests do not prove SQL. Today the runner gets a **Postgres** that is not your laptop’s Docker Desktop GUI.  
**Study time:** 3–4 focused hours

Labs: `~\fullstack-lab\month-16\week-01\day-04\`. Do **not** implement this inside Project 7. Do **not** paste Project 7. Domain today: **reading-room desk holds**.

---

## How to use this textbook

1. Read Block A. Close it. Say what a **service container** is in one sentence.  
2. Type the tiny API + pytest + workflow. Predict the first failure in `PREDICT.txt`.  
3. Never put a real password in git. The CI user `ci` / password `ci` is a **disposable lab** credential for a throwaway database.  
4. Optional review links are for later rechecking.

---

## How to read this chapter

A **service container** is a Docker container GitHub starts **next to** your job, on the same runner network. Your steps talk to it by **hostname** (the service id) and **port**. For Postgres, that hostname is often `postgres` and the port `5432`.

```mermaid
flowchart LR
  JOB[Job steps: pytest]
  SVC[Service: postgres:16]
  JOB -->|DATABASE_URL host=postgres| SVC
```

This is **not** Kubernetes. It is not ECS. It is not “production.” It is a **fresh database** for integration tests so CI does not lie the way a dirty local volume can.

**Wrong belief:** “I’ll mock SQLAlchemy Session in CI so I do not need Postgres.”  
**Correct:** then CI never sees a missing migration or a unique constraint. Fake **email**. Keep a **test database** for persistence (Month 14).

**Wrong belief:** “I’ll SSH to my laptop’s Postgres from GitHub.”  
**Correct:** the runner cannot see your house. Also that would be a gift to the internet. Service containers exist so the database is **inside** the job.

**Wrong belief:** “`create_all` in the API startup is fine if CI is green.”  
**Correct:** Week 2 Day 4 forbids `create_all` as a production migrate story. Today the lab may apply schema in pytest fixtures **or** a typed `alembic upgrade` step. Prefer a fixture that creates tables on an empty test database for this **tiny** app. Do not copy that into production deploys.

---

## Today's contract

By the end of this day you will be able to:

1. Explain **service container**, **job `env`**, and **`DATABASE_URL`** on the runner.  
2. Run pytest that **inserts and reads a row** in Postgres on GitHub Actions.  
3. Wait for Postgres **health** (`pg_isready`) so tests do not flail on a cold start.  
4. Keep production URLs out of CI.

**Today's gate.** Closed-book:

> Integration CI starts Postgres as a service container, sets `DATABASE_URL` for the job, waits until Postgres is healthy, and runs pytest against that empty database. It does not use my laptop’s data. It is not Kubernetes.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 50 | Theory |
| B | 80 | Type-along: tiny FastAPI + SQLAlchemy + pytest + workflow |
| C | 50 | Independent: prove a unique constraint in CI |
| D | 15 | Git |
| E | 15 | Recall |

---

# Block A — Theory

## 1. Why unit CI was not enough

Day 2’s `can_release` tests never opened a socket. A broken `relationship()`, a missing `commit`, or a unique index would stay green. Month 11 already asked for a test database. Today that database must exist **on the runner**.

## 2. Service containers in Actions

Under a job you may add `services:` — a map of containers.

Each service:

- **`image:`** — Docker image (`postgres:16`).  
- **`env:`** — container environment (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`).  
- **`ports:`** — publish `5432:5432` so the job can connect. On GitHub-hosted runners, mapped ports are reachable at `localhost` **or** at the service hostname depending on the networking mode. The documented, portable pattern for GitHub-hosted Ubuntu jobs is: connect to `localhost` **when you map the port**, or to the **service name** as hostname. This course will use **`localhost`** plus port mapping, which matches GitHub’s current Ubuntu job networking for service containers.

If `localhost` fails in a log, try host `postgres` (the service id). Write what you observed in `HOST.txt`. Do not cargo-cult both at once.

- **`options:`** — Docker options. You will pass a **health command** so the job waits.

Postgres health (Linux image, runs inside the service container):

```text
--health-cmd "pg_isready -U ci -d ci"
--health-interval 10s
--health-timeout 5s
--health-retries 5
```

**Wrong belief:** “I’ll `sleep 20` in a step instead of a healthcheck.”  
**Correct:** sleep is a flake generator (Month 14). Healthcheck is a **condition**.

## 3. `DATABASE_URL` as job env

The app and pytest must see the same URL.

```yaml
env:
  DATABASE_URL: postgresql+psycopg://ci:ci@localhost:5432/ci
```

Place `env` on the **job** so every step inherits it (install, migrate, pytest). Do not commit a URL that points at RDS production.

Scheme notes: SQLAlchemy 2 with psycopg3 often wants `postgresql+psycopg://`. If you use `psycopg2`, the scheme may be `postgresql+psycopg2://`. Match **your** driver. The lab below uses `psycopg` (v3) or the default you already know from Month 11. If import fails on the runner, the log will say so — install the driver in `requirements-dev.txt`.

**Wrong belief:** “I’ll read `.env` from the repo in CI.”  
**Correct:** `.env` is for laptops and must be gitignored. CI injects env in YAML or in GitHub Secrets (Week 2). A lab password in YAML for a **local service container** is not a cloud secret. Still never put **your** RDS password there.

## 4. Isolation on a fresh database

Every CI job starts a **new** Postgres. You still isolate **tests** from each other with rollback or truncate (Month 14). A fresh container does not excuse a session-scoped dirty dict.

Order of operations:

1. Service becomes healthy.  
2. Install Python deps including the DB driver.  
3. Create schema (fixture `create_all` **in this lab only**, or `alembic upgrade head` if you type a tiny Alembic).  
4. pytest.

Production deploy will **not** use `create_all` (Week 2 Day 4). Keep `PROD-MIGRATE.txt` with one sentence: “CI lab schema ≠ production migrate.”

## 5. What the healthcheck does not prove

`pg_isready` means the server accepts connections. It does **not** mean your tables exist, your URL user is correct, or your tests passed. If auth fails, you will see `password authentication failed` — fix `POSTGRES_PASSWORD` and the URL together.

## 6. Frontend

No Vite today. Integration here means **API + Postgres**. Frontend build stays in the Day 2 / Day 6 pipeline as a separate step.

## 7. Cost and time

Service containers pull an image. First run is slower. That is acceptable. Do not add five extra services “for realism.” Redis waits until **your** product needs it in the Project 7 checklist.

## 8. Security posture (defense)

The service is reachable from the **job**, not from the public internet. Do not add a workflow that opens your home 5432. Do not scan other people’s RDS. You are learning **your** pipeline.

Do not write exploit PoCs against Postgres. If a test fails open (no password), **fix the config**. That is the lesson.

## 9. Windows laptop vs Linux runner

You may develop the tiny app in PowerShell with Docker Desktop Postgres if you already have it:

```powershell
# optional local check — not the Actions file
docker run --name m16-pg -e POSTGRES_USER=ci -e POSTGRES_PASSWORD=ci -e POSTGRES_DB=ci -p 5432:5432 -d postgres:16
```

Stop and remove that container when done so you do not leave port 5432 occupied. CI still uses the **service** in YAML. `curl.exe` is not how you talk to Postgres.

If port 5432 is already your Month 15 Compose stack, use **5433:5432** locally. In **Actions**, 5432 on the runner is usually free.

## 10. Failures you should expect once

| Log fragment | Typical cause |
|---|---|
| `could not connect` / `Connection refused` | Tests started before healthy; wrong host/port |
| `password authentication failed` | URL user/password ≠ `POSTGRES_*` |
| `database "ci" does not exist` | `POSTGRES_DB` mismatch |
| `No module named 'psycopg'` | Driver not in pip install |
| `relation "holds" does not exist` | Schema never created |

Write those in `DEBUG-MAP.md` after you hit at least one for real or on paper.

---

# Block B — Type-along

```powershell
cd ~\fullstack-lab
mkdir month-16\week-01\day-04 -Force
cd ~\fullstack-lab\month-16\week-01\day-04
uv init --name lab-ci-postgres
uv add fastapi sqlalchemy psycopg
uv add --dev pytest httpx ruff
```

If `uv add psycopg` needs the binary extra, follow the resolver’s message (often `psycopg[binary]`). Put the same packages in `requirements-dev.txt` for the runner:

```text
fastapi
sqlalchemy
psycopg[binary]
httpx
pytest
ruff
```

**App (type it).** One table `holds` with `id`, `title` unique, `code` unique. FastAPI:

- `POST /holds` body `{title, code}` → 201 `{id, title, code}`  
- duplicate title or code → 409  
- empty title → 422 (Pydantic)  
- `GET /holds/{id}` → 200 or 404  

Use a SQLAlchemy model and a session. Read `DATABASE_URL` from the environment. **Do not** paste Project 7 models. **Do not** ship `create_all` as a production entrypoint; a pytest fixture may call `Base.metadata.create_all` for this gym.

`conftest.py` ideas you must own:

- Skip or fail loudly if `DATABASE_URL` is missing.  
- Refuse a URL that looks like production (if it contains `amazonaws.com` or the hostname of **your** known prod, abort).  
- Function-scoped session with rollback **or** truncate. Empty-start: `test_list_or_get_missing`.

```powershell
$env:DATABASE_URL = "postgresql+psycopg://ci:ci@127.0.0.1:5432/ci"
uv run pytest -q
```

Only if you started a local container. If you cannot run Postgres locally, type the app anyway and let **GitHub** be the first green. Write `LOCAL.txt` saying which path you took.

Write `PREDICT.txt` **before** the first Actions run: will the unique 409 test fail because you forgot `commit`? Yes/no and why.

Create `.github/workflows/ci.yml` in this lab (push to GitHub). Type the service block:

```yaml
name: CI Postgres

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: ci
          POSTGRES_PASSWORD: ci
          POSTGRES_DB: ci
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready -U ci -d ci"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    env:
      DATABASE_URL: postgresql+psycopg://ci:ci@localhost:5432/ci
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Install
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements-dev.txt

      - name: Lint
        run: ruff check .

      - name: Integration tests
        run: pytest -q
```

The `>-` YAML fold puts health options on one Docker `options` string. Type it carefully.

Push. Read the log. Save `EVIDENCE.md`: job name, whether the service showed as healthy, pytest summary line. No secrets.

---

# Block C — Independent

Add **one** test you did not type in Block B:

- Two POSTs with the same `code` return 409 on the second.  
- Or GET missing id is 404 with a `detail` key.

Push. Confirm the run is green.

Write `SERVICE.md` (12–20 lines): hostname/port you used; why this is not production RDS; why Kubernetes was not required; how this maps to Project 7’s **test** database name (name only).

Write `PROD-MIGRATE.txt`: one sentence that `create_all` in pytest is not how Week 4 will migrate production.

---

# Block D — Git

```powershell
cd ~\fullstack-lab
git add month-16
git commit -m "Month 16 Day 4: Postgres service container CI lab."
```

Push the **lab GitHub repo** as well if it is separate.

---

# Block E — Recall

1. What a service container is.  
2. Why `pg_isready` beats `sleep`.  
3. Where `DATABASE_URL` should live for the job.  
4. Why CI must not use production RDS.  
5. `create_all` in a test fixture vs production migrate.

## Office hours

**Connection refused.** Health retries exhausted; image pull failed; you pointed at `postgres` host when this runner wanted `localhost` or the reverse. Change one variable, push, record in `HOST.txt`.

**Pytest green with zero SQL tests.** You still ran Day 2 units only. Add a test that fails if Postgres is down (connection fixture).

**`uv` on the runner.** Today’s YAML uses pip. Do not write `uv run` unless you install uv in a step.

**Docker-in-Docker.** Not required. Service containers are enough.

**Playwright.** Not today.

**Leaving `docker run` Postgres on the laptop.** `docker rm -f m16-pg` when finished.

---

## Definition of done

- [ ] Workflow has a `postgres` service with a health command  
- [ ] pytest talks to that database via `DATABASE_URL`  
- [ ] At least one test asserts SQL-backed HTTP (201, 409, or 404)  
- [ ] `EVIDENCE.md` from a real Actions log or an honest blocker  
- [ ] `PROD-MIGRATE.txt` exists  
- [ ] No production secrets in git  
- [ ] Commit exists  

---

## Optional review links

Repair from this chapter first.

- [GitHub Actions: About service containers](https://docs.github.com/en/actions/use-cases-and-examples/using-containerized-services/about-service-containers)  
- [GitHub: Creating PostgreSQL service containers](https://docs.github.com/en/actions/use-cases-and-examples/using-containerized-services/creating-postgresql-service-containers)  
- [Postgres Docker image](https://hub.docker.com/_/postgres)  

---

## Tomorrow

**Caches, artifacts, required status checks, branch protection** — so a green job you can skip stops being the story.
