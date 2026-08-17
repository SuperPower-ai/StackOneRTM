# Month 11 · Week 4 · Day 2
# Config from the Environment, Secrets out of Git, Health Endpoint

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 3 — Python and backend  
**Month index:** [../../README.md](../../README.md)  
**Week 4:** [1](day-01.md) · Day 2 (today) · [3](day-03.md) · [4](day-04.md) · [5](day-05.md) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Exercises  
**Student state:** You can attach a request id. Today the process **reads config from the environment**, **does not commit secrets**, and answers **GET /health**.  
**Study time:** 3–4 focused hours

Labs: `~\fullstack-lab\month-11\week-04\day-02\`. Noun: **cloakroom tickets**.

---

## How to use this textbook

1. `.env` is gitignored. `.env.example` has **placeholders**.  
2. Health is **honest**. Do not return 200 `ok` if you claimed you pinged Postgres and you did not.  
3. Optional review links are for later rechecking.

---

## How to read this chapter

**Configuration** is how the same code talks to **this** machine’s Postgres, Redis, and log level. **Secrets** are passwords and tokens. They live in the **environment** (or a secret manager later), not in `main.py`, not in git, not in screenshots in the repo.

**Health** is a cheap GET that load balancers and **you** can hit. Distinguish:

- **liveness:** process can answer HTTP (you are not deadlocked)  
- **readiness:** dependencies you **need** are reachable  

This month you implement at least **liveness**. A **readiness** check that pings Postgres is the stretch you should try.

```mermaid
flowchart TB
  ENV[.env not in git] --> SET[pydantic-settings / os.environ]
  SET --> APP[FastAPI]
  APP --> H["GET /health liveness"]
  APP --> R["GET /ready optional"]
  R --> PG[(PostgreSQL)]
```

**Wrong belief:** “I’ll commit `.env` so teammates can run.”  
**Correct:** commit `.env.example`. Teammates copy and fill. A committed password is a **rotation** event.

**Wrong belief:** “Health should return the full config so I can debug.”  
**Correct:** that dumps secrets. Health returns **status**, maybe **version** you chose, **not** `DATABASE_URL`.

---

## Today's contract

By the end of this day you will be able to:

1. Use **pydantic-settings** `BaseSettings` (v2) **or** a small `os.environ[...]` module — prefer Settings.  
2. Load `DATABASE_URL`, `LOG_LEVEL`, optional `REDIS_URL`.  
3. `.gitignore` `.env`; write `.env.example`.  
4. `GET /health` 200 `{"status":"ok"}` (liveness).  
5. Optional `GET /ready` 200/503 based on a **real** `SELECT 1` (or skip with `READY.md` saying liveness only).  
6. Request-id middleware still present (copy by typing from yesterday’s idea, not from 6B).

**Today's gate.** Closed-book:

> Config comes from the environment. Secrets are not in git. /health is liveness. I do not echo URLs with passwords. Settings are not a global dict I mutate in routes.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 30 | Recap |
| B | 75 | Exercises: Settings + health + gitignore |
| C | 50 | ready/SELECT 1 + negative tests |
| D | 15 | Git |
| E | 15 | Recall |

---

# Complete explanation

## 1. pydantic-settings v2

```python
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    log_level: str = "INFO"
    redis_url: str | None = None
```

`uv add pydantic-settings pydantic`. Field names map to `DATABASE_URL` automatically (case-insensitive). Access `settings.database_url` — do not `print` it.

**Wrong belief:** “I’ll use `.dict()` on Settings to pass into logs.”  
**Correct:** v2 is **`model_dump()`**. And still **redact** `database_url` if you dump. Prefer not to dump Settings at all.

Load **once** at startup. `get_settings()` with `functools.lru_cache` is the FastAPI pattern:

```python
from functools import lru_cache

@lru_cache
def get_settings() -> Settings:
    return Settings()
```

Tests override env vars **before** first call, or `get_settings.cache_clear()`.

## 2. Git

`.gitignore`:

```text
.env
```

`.env.example`:

```text
DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@127.0.0.1:5432/month11_w4d2
LOG_LEVEL=INFO
REDIS_URL=
```

Empty `REDIS_URL` means “unset / fakeredis / unused.” Document in README.

`git status` must not list `.env`. If you already committed a secret, **rotate** the password; do not only delete the file. Today if it was a lab password on localhost, still practice: remove from tree, mention in `SECRETS.md`.

## 3. Health vs ready

| Path | 200 means | 503 means |
|---|---|---|
| `/health` | process answered | you probably cannot hit it |
| `/ready` | Postgres (and maybe Redis) answered a ping | skip traffic |

A liveness check that `SELECT 1`s Postgres will kill the process in an orchestrator if the DB blips — that is why **split** them. You may not have Kubernetes. Split anyway so Month 15 is not a surprise.

```python
from sqlalchemy import text

@app.get("/ready")
def ready(session: Session = Depends(get_session)) -> dict[str, str]:
    session.execute(text("SELECT 1"))
    return {"status": "ready"}
```

If execute throws, return 503 — `HTTPException(503, "db")` or a handler. Do not 200 with `"ready": false` as the only signal (Month 9: statuses mean things).

## 4. Windows env

```powershell
$env:DATABASE_URL = "postgresql+psycopg://..."
```

`.env` file also works with pydantic-settings `env_file`. Do not commit it.

`psql` still uses its own login; that is not FastAPI config.

---

# Block B — Exercises

```powershell
cd ~\fullstack-lab
mkdir month-11\week-04\day-02 -Force
cd ~\fullstack-lab\month-11\week-04\day-02
uv init --name lab-settings-health
uv add fastapi uvicorn sqlalchemy "psycopg[binary]" pydantic-settings
psql -U postgres -c "CREATE DATABASE month11_w4d2;"
```

### Exercise 1 — Settings

`config.py` BaseSettings. Missing `DATABASE_URL` should fail **at import/startup**, not with a mysterious pool error later. Prove by unsetting and running — capture error in `MISSING.txt`.

### Exercise 2 — gitignore

`.env` with a fake password. `.env.example` placeholders. `git check-ignore .env` or `git status` proof in `GIT.txt`.

### Exercise 3 — /health

200 JSON. curl.exe. Request-id header still on response (middleware typed again).

### Exercise 4 — do not leak

A forbidden route `GET /debug-config` that returns settings **must not exist**. If you add it “temporarily,” delete it. `LEAK.md`: why it is a fail.

---

# Block C

### Exercise 5 — /ready

`SELECT 1` via `text("SELECT 1")` — parameterized not needed for constant. Wrong `DATABASE_URL` → 503. Write `READY.txt`.

### Exercise 6 — log level from settings

`LOG_LEVEL=DEBUG` vs `INFO`. Do not log the URL.

pytest optional: TestClient `/health` 200 without real DB; `/ready` may skip if you did not inject session — then TestClient `/ready` needs test DB. If too heavy, curl only + `TESTS.md` “tomorrow timeouts.”

```powershell
cd ~\fullstack-lab
git add month-11
git commit -m "Month 11 Week 4 Day 2: settings, gitignore, health/ready."
```

Confirm `.env` untracked.

---

# Block E — Recall

1. `.env` vs `.env.example`.  
2. `model_dump` vs `.dict`.  
3. liveness vs readiness.  
4. Why 503 not 200 false.  
5. `lru_cache` cache_clear in tests.

## Office hours

**Settings not reading .env.** cwd not the project root. `env_file` path. Uvicorn started elsewhere.

**Committed .env.** Remove; rotate if real; rewrite history only if you know git well — for class, rotate and add gitignore is the minimum.

**/ready 200 with bad URL.** You caught exceptions and returned ok. Stop.

**Health returns settings.** Delete the route.

---

## Lecture: config is a door, not a debug page

Month 9 already said env for CORS origins. Today is the **habit at 6B scale**: one Settings object, two files (example + local), health that does not confess secrets.

Redis URL optional. Empty means the architecture’s “no Redis” or fakeredis in tests. Do not require Redis for `/health` liveness — a cache down should not kill liveness if Postgres is SoR. `/ready` **may** require Redis if you chose fail-closed. Document.

SQLAlchemy engine from `settings.database_url`. One engine. `select()` still 2.x when you query.

---

## Worked session — Settings, ignore, health, SELECT 1

uv init. pydantic-settings. .env gitignored. /health 200. /ready SELECT 1. middleware X-Request-ID. MISSING.txt. GIT.txt. No debug-config. No ops-api. Bind 127.0.0.1.

Windows: `$env:DATABASE_URL` or `.env`. `curl.exe`. `psql` for the database create.

---

## Definition of done

- [ ] Settings from env  
- [ ] `.env` not in git; example exists  
- [ ] `/health` 200  
- [ ] `/ready` honest or READY.md  
- [ ] no config leak route  
- [ ] Commit exists  

---

## Optional review links

- [pydantic-settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)  
- [Kubernetes probes](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-probes) — conceptual; you are not in Month 15

---

## Tomorrow

**From memory: timeouts and failing loudly.** Days 1–2 closed during the build.

---

# Closing lecture — the process should know where it is

Environment variables are how machines differ. Git is how code is shared. Health is how you ask “are you there?” without a SQL GUI.

`model_dump` if you dump. Redact. Prefer not to dump.

503 means not ready. 200 means the promise of that path. Liveness is cheap. Readiness is a ping you actually run.

Cloakroom tickets are the noun. 6B Settings will be **yours** on Day 6.

---

## Recite-back checklist

Write `RECITE.txt`.

- [ ] Settings from environment  
- [ ] `.env` gitignored; `.env.example` committed  
- [ ] missing DATABASE_URL fails loud at startup  
- [ ] `/health` is liveness, no URLs  
- [ ] `/ready` pings or READY.md  
- [ ] 503 not 200-with-false  
- [ ] `model_dump` if dumping; redact  
- [ ] no `/debug-config`  
- [ ] request id still present  

**lru_cache trap.** Tests that change env after first `get_settings()` see old values. `get_settings.cache_clear()` in a fixture. Write that in TESTS.md even if you skip pytest today.

**Redis and /ready.** If Redis is optional in ARCHITECTURE.md, `/health` must not require it. `/ready` may. Document. fakeredis should not be the reason liveness fails.

Windows: `git status` must not show `.env`. `curl.exe` `/health` and `/ready`. `$env:DATABASE_URL` or `.env` file. Bind 127.0.0.1.

If `/ready` 500 instead of 503, you let the exception bubble. Map it. Loud and **correct status**.
