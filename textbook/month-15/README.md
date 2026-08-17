# Month 15 — Linux, Docker, Networking, Observability

**Program:** Full-Stack Mastery Textbook  
**Phase:** 5 — Production engineering  
**Length:** 4 weeks · 7 days each · 3–4 focused hours/day  
**Prereq:** Month 14 gate passed (you can break a feature and name the test that goes red)  
**This month’s job:** Put Project 7 on a **Linux-shaped machine** you can inspect, pack it into **containers** you can explain, and make the running system **observable** — logs, health, and a first correlation id.

This textbook will **not** paste Project 7. You containerize **your** repos. Tiny labs live in `~\fullstack-lab\month-15\`.

---

## How this textbook is organized

```
month-15/
  README.md     ← you are here
  week-01/      Linux: filesystem, users, processes, SSH, packages, net, logs
  week-02/      Docker: images, containers, Dockerfile, layers, volumes, networks
  week-03/      Compose: frontend, API, Postgres, Redis — production-shaped images
  week-04/      Observability: structured logs, metrics/traces concepts, health, alert ideas
                + exam: a failing containerized system
```

**Machine this month:** you still own a Windows laptop. Production is **Linux**. Labs run in **WSL2 Ubuntu** and **Docker Desktop**. PowerShell is not the production shell this month. When a day says `bash`, type it in Ubuntu.

---

## The picture

```mermaid
flowchart LR
  You[Your laptop] --> WSL[WSL Ubuntu]
  You --> DD[Docker Desktop]
  DD --> C[Containers: web / api / db / redis]
  C --> Logs[stdout JSON logs]
  C --> Health[/health and /ready]
```

**Wrong belief:** “Docker is a lighter virtual machine, so I do not need Linux.”  
**Correct:** a container shares a **Linux kernel**. Files, users, processes, ports, and logs are Linux ideas. Docker is a packaging and isolation tool on top.

**Wrong belief:** “If Compose is green, the product is in production.”  
**Correct:** Compose on your laptop is a **rehearsal**. Production still needs images you trust, config you can name, health that means something, and logs you can grep.

---

## Month 15 Gate

True **without a tutorial**:

1. In Ubuntu, explain a path, a permission bit, a process, and a listening port from **evidence** (`ls`, `stat`, `ps`, `ss`).  
2. SSH to a box (or a local Linux container acting as one) with a **key**, not a password pasted into a chat.  
3. Build an image from a **Dockerfile** you wrote; explain **layers** and **build context**.  
4. Run API + Postgres (and Redis if your product uses it) with **Compose**, **named volumes**, and **env files** that are not committed secrets.  
5. Images run as **non-root**. A **healthcheck** fails when the process is up but not ready.  
6. Logs are **structured** (JSON or key=value) with a **request id**.  
7. You can say what a **metric** and a **trace** are for, even if you only emit logs this month.  
8. Given a **failing** compose stack, you diagnose whether the fault is frontend, network, backend, database, configuration, or the machine — and write the evidence.

If any item is false, do not start Month 16.

---

## Kubernetes

Not this month. Compose is the skill. Orchestrators wait until a real need appears (roadmap optional list).

---

## Start

Open [week-01/day-01.md](week-01/day-01.md).

When Month 15’s gate is true, continue with [Month 16](../month-16/README.md).
