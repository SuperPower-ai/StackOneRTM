# Month 15 · Week 4 · Day 6
# Independent: Observability on the Week 3 Stack — OBS.md

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 5 — Production engineering  
**Month index:** [../../README.md](../../README.md)  
**Week 4:** [1](day-01.md) · [2](day-02.md) · [3](day-03.md) · [4](day-04.md) · [5](day-05.md) · Day 6 (today) · [7](day-07.md)  
**Week rhythm today:** Independent implementation  
**Student state:** You wrote ALERTING.md. Today you **apply** JSON logs, request ids, and `/health` vs `/ready` to **your** Week 3 four-service lab (bike-share holds) — or a copy of it.  
**Study time:** 3–4 focused hours  
**Prereq:** Day 5 gate passed. Week 3 Day 6 stack exists (or you rebuild a four-service stand-in **without** Project 7).

This textbook will **not** paste your Week 3 app. Spec envelope + forbidden list. Work in `~/fullstack-lab/month-15/week-04/day-06/` **or** patch Week 3 day-06 in place and put **evidence + OBS.md** here. Choose one; write `WHERE.md`.

---

## How to use this textbook

1. Prefer a **copy** of the Week 3 stack into day-06 so you do not break exam evidence.  
2. OBS.md is the exam artifact. Incomplete code with honest OBS is better than silent magic.  
3. Stop db; show ready 503. Grep a request id.  
4. Optional review links are for later rechecking.

---

## How to read this chapter

Week 3 proved **wiring**. Week 4 proves **speech**. A stack that cannot fail ready or emit an id will fail tomorrow’s exam even if nginx is green.

```mermaid
flowchart LR
  Web[nginx] --> API[FastAPI + JSON logs + ids]
  API --> Ready[/ready SELECT 1]
  API --> PG[Postgres]
  API --> RD[Redis]
```

**Wrong belief:** “I’ll add OpenTelemetry Collector because OBS.md sounds fancy.”  
**Correct:** OBS.md is logs + probes + which pillar answers what + one alert sentence. Collector optional and not required for the Month 15 gate.

**Wrong belief:** “I’ll finally paste Project 7.”  
**Correct:** still no. Pattern only, later, yourself.

---

## Today's contract

1. API: JSON logs, request id middleware, `/health` (process), `/ready` (DB ping; Redis optional documented).  
2. Evidence: db stop experiment.  
3. nginx: forward `X-Request-ID` if you reverse-proxy (or document that JS cannot see API ids).  
4. **`OBS.md`** complete.  
5. `.env` still gitignored.

**Today's gate.** Closed-book:

> The four-service lab logs JSON with a request id. /ready fails when Postgres is down; /health does not. OBS.md explains pillars and one symptom alert. I did not paste Project 7.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 20 | Copy stack; WHERE.md |
| B | 40 | Middleware + probes |
| C | 95 | Compose glue, evidence, OBS.md |
| D | 20 | Self-review vs Month 15 gate preview |
| E | 15 | Recall + commit |

---

# Block A — Copy, do not invent a fifth product

```bash
mkdir -p ~/fullstack-lab/month-15/week-04/day-06
cd ~/fullstack-lab/month-15/week-04/day-06
```

Copy **your** files from `~/fullstack-lab/month-15/week-03/day-06/` if they exist. If they do not, rebuild four services to the Week 3 Day 6 spec (bike-share) — faster than a new domain. Still not Project 7.

`WHERE.md`: canonical path of compose.yaml.

---

# Block B — Spec envelope (observability)

### Must — API

- JSON stdout logs with `level`, `msg`, `request_id`, `path`, `status` on finish  
- `X-Request-ID` in/out  
- `GET /health` 200 without DB  
- `GET /ready` 200/503 from Postgres `SELECT 1`  
- Redis: `/ready` **may** require PING; if you skip, OBS.md says Redis is **not** on the ready path (honest)  
- Do not log `DATABASE_URL` or `REDIS_URL`

### Must — evidence commands

```bash
docker compose up --build -d
curl -sS -D - http://127.0.0.1:8921/health   # or your ports
curl -sS -D - http://127.0.0.1:8921/ready
docker compose stop db
curl -sS -w "%{http_code}" http://127.0.0.1:8921/health
curl -sS -w "%{http_code}" http://127.0.0.1:8921/ready
docker compose start db
```

Ports: if you kept 8920/8921, use them. Document actual ports in OBS.md.

### Should — nginx

If you proxy `/api/`, add `proxy_set_header X-Request-ID $request_id;` or pass through client header. If you do not proxy, document the limitation.

### Must not

- New Kubernetes manifests  
- Logging passwords  
- `chmod 777`  
- Alertmanager install required  
- Project 7  

---

# Block C — OBS.md spec (the product)

Write **`OBS.md`** with these headings (complete sentences):

1. **Architecture** — four services; mermaid.  
2. **Logs** — format, fields, stdout, how to `compose logs`. Example **redacted** JSON line.  
3. **Request id** — header, generation, nginx yes/no.  
4. **Probes** — /health vs /ready; db-stop evidence (paste status codes).  
5. **Pillars** — one question each for logs, metrics (even if not emitted), traces (even if not emitted).  
6. **OTel** — one paragraph: not installed / why that is OK this month.  
7. **Alerting** — one **symptom** page you would add; explicitly **not** CPU. Pointer to Day 5 if you want.  
8. **Secrets** — confirmation grep for password is empty (you ran it).  
9. **Gaps** — no dashboards running; no traces; Redis on ready or not.  
10. **Month 15 gate preview** — which README items this stack already supports.

`EVIDENCE.md` — raw curl codes from the db-stop drill.

---

# Block D — Self-review vs README gate

Open [Month 15 README](../../README.md) gate list. For items 6–8 (logs, metrics/traces vocabulary, failing stack diagnosis **tomorrow**), mark `GATE-PREVIEW.txt` true/false. If logs or ready are false, fix **today**.

---

# Block E — Recall and git

Recall:

1. Why health stays 200.  
2. Where JSON goes.  
3. What OBS.md is for tomorrow.  
4. What you still will not have (Jaeger).

```bash
cd ~/fullstack-lab
git add month-15/week-04/day-06
git commit -m "Month 15 Day 6: OBS.md and probes on four-service lab."
```

---

## Office hours

**Week 3 stack missing.** Rebuild quickly from Week 3 Day 6 spec. Do not start the exam stack today.

**Ready 503 always.** DATABASE_URL host `db`; compose project name; you stopped db and forgot start.

**Copied Day 4 harbor instead of four services.** Harbor is two services. The spec is **four**. Add nginx+redis or copy Week 3.

**OBS.md is a vendor screenshot.** Rewrite in sentences.

---

## Definition of done

- [ ] health 200 / ready 503 with db stopped (evidence)  
- [ ] JSON + request id  
- [ ] OBS.md 10 sections  
- [ ] GATE-PREVIEW.txt  
- [ ] Commit without .env  

---

## Optional review links

- [12factor logs](https://12factor.net/logs)  
- [FastAPI middleware](https://fastapi.tiangolo.com/tutorial/middleware/)  
- [Compose logs](https://docs.docker.com/reference/cli/docker/compose/logs/)  

---

# Lecture: wiring a four-service stack so it can talk

Tomorrow’s exam will not ask you to recite vendor product names. It will ask you to **fail a database** and still have an API process that answers `/health`, while `/ready` tells the load-balancer story. If you only have Week 3 “it curls,” you are not done.

## 1. Copy vs mutate

If you edit Week 3 Day 6 in place and break it, you lose the compose evidence for gate row 4. Copy the tree:

```bash
cp -a ~/fullstack-lab/month-15/week-03/day-06/. ~/fullstack-lab/month-15/week-04/day-06/
# then add observability in the copy
```

If `cp -a` complains about a running bind, `docker compose down` in the Week 3 folder first.

## 2. Middleware you actually type

The request id belongs **before** the path operation. A sketch you may type (not Project 7):

```python
import json
import logging
import time
import uuid
from contextvars import ContextVar

from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware

request_id_var: ContextVar[str] = ContextVar("request_id", default="-")

def emit(level: str, msg: str, **fields: object) -> None:
    line = {"level": level, "msg": msg, "request_id": request_id_var.get(), **fields}
    print(json.dumps(line), flush=True)

class RequestIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        raw = request.headers.get("x-request-id", "")
        rid = raw if 1 <= len(raw) <= 128 else str(uuid.uuid4())
        token = request_id_var.set(rid)
        started = time.perf_counter()
        try:
            response = await call_next(request)
        finally:
            request_id_var.reset(token)
        response.headers["X-Request-ID"] = rid
        emit(
            "info",
            "request_finished",
            method=request.method,
            path=request.url.path,
            status=response.status_code,
            duration_ms=int((time.perf_counter() - started) * 1000),
        )
        return response
```

Wire it with `app.add_middleware(RequestIdMiddleware)`. Do not `print(dict(request.headers))`. Do not put `DATABASE_URL` in `fields`.

## 3. Ready without killing the process

```python
@app.get("/health")
def health() -> dict[str, str]:
    emit("info", "health_ok")
    return {"status": "ok"}

@app.get("/ready")
def ready() -> JSONResponse:
    try:
        # short timeout SELECT 1 — your driver here
        ping_db()
    except Exception:
        emit("error", "db_ping_failed")
        return JSONResponse({"status": "not_ready"}, status_code=503)
    return JSONResponse({"status": "ready"}, status_code=200)
```

`ping_db` must **not** print the connection string. Catch `Exception` here is a probe, not a substitute for fixing the driver.

## 4. nginx and the id

If JS talks to port 8921 directly, the browser sees the API’s `X-Request-ID`. If JS talks to `/api/` on 8920, nginx must forward:

```nginx
proxy_set_header X-Request-ID $http_x_request_id;
```

If the client omitted it, generate in FastAPI; nginx can also use `$request_id` if you enable that module — not required. Document which path you took in OBS.md section 3.

## 5. Evidence that will be on the exam

| Check | Command idea | Pass |
|---|---|---|
| Health with db down | `curl /health` after `compose stop db` | 200 |
| Ready with db down | `curl /ready` | 503 |
| Correlation | `-H 'X-Request-ID: exam-1'` then `compose logs api \| grep exam-1` | JSON line |
| Secret | `compose logs api \| grep -F "$POSTGRES_PASSWORD"` | no match |

If health also 503, you pinged the DB in both handlers. If the API container **exits**, you connected at import time without try/except.

## 6. OBS.md is not a blog

A teammate should be able to **stop db** and **grep an id** from OBS.md alone. If a section is “we will add Datadog later,” that is a **gap** (section 9), not a fake green.

**Wrong belief:** “Four services plus a logo screenshot is observability.”  
**Correct:** observability is **questions you can already answer** from stdout and probes.

**Wrong belief:** “I will add `/metrics` with twenty gauges today.”  
**Correct:** name two future metrics in OBS.md section 5. Emitting Prometheus is optional stretch. The gate asks you to **say** what a metric is for.

Write `TODAY-LIMITS.md` (eight lines): what you did not install (Jaeger, Grafana, OTel collector) and why that is allowed.

---

## Tomorrow

**Month 15 exam + gate.** Closed-book oral, synthesis, and a **failing** containerized system with **six planted faults**. Do not start Month 16 if the gate is false.
