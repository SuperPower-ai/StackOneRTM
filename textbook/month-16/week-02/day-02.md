# Month 16 · Week 2 · Day 2
# Image Tags, Digests, and Building in CI

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 5 — Production engineering  
**Month index:** [../../README.md](../../README.md)  
**Week 2:** [1](day-01.md) · Day 2 (today) · [3](day-03.md) · [4](day-04.md) · [5](day-05.md) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Exercises + type-along  
**Student state:** Day 1 gate passed. You can say why `git pull` is not CD. Today the artifact becomes a **container image** tagged with a **git SHA**, pushed to a registry, built on the **Linux runner**.  
**Study time:** 3–4 focused hours

Labs: `~\fullstack-lab\month-16\week-02\day-02\`. Tiny image, not Project 7. Do not paste product Dockerfiles as if they were this course’s source. GHCR means GitHub Container Registry.

---

## How to use this textbook

1. Read tag versus digest until you can teach it.  
2. Type a tiny Dockerfile and a CI job that builds (and pushes if you have a registry login).  
3. Optional review links are for later rechecking.

---

## How to read this chapter

A **tag** is a human name on an image (`abc1234`, `staging`, `latest`). A **digest** is a content hash (`sha256:` plus hex). Tags can be **moved**. Digests cannot: if the bytes change, the digest changes.

```mermaid
flowchart LR
  SHA[GITHUB_SHA] --> BUILD[docker build]
  BUILD --> TAG[image:abc1234]
  BUILD --> DIG[image@sha256:…]
  TAG --> REG[GHCR or local]
```

**Wrong belief:** “I’ll always deploy `:latest`.”  
**Correct:** `:latest` is a sticker someone can peel. Yesterday’s rollback of `:latest` is still `:latest`. Tag with the **git SHA**. Record the digest in the release ledger.

**Wrong belief:** “I’ll build on the production VM so Docker is ‘right there.’”  
**Correct:** that rebuilds. CI on `ubuntu-latest` produces `linux/amd64` images that App Runner, ECS, and typical EC2 AMIs expect. Your Windows Docker Desktop may build `linux/amd64` too if that is the engine’s mode — still **prefer one build in CI** so staging and production receive the same digest.

---

## Today's contract

1. Explain **tag**, **digest**, **registry**, and `GITHUB_SHA`.  
2. Write a tiny Dockerfile and build it locally in Docker Desktop (PowerShell).  
3. Add a CI job that builds the image (push to GHCR is required if you can authenticate; otherwise build-only plus `PUSH-OWED.md`).  
4. Never put registry passwords in YAML; use `GITHUB_TOKEN` or a secret **name**.

**Today's gate.** Closed-book:

> I tag images with a git SHA. I treat a digest as the immutable id. CI builds the image on Linux. I do not overwrite SHA tags. `:latest` is not a release process.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 45 | Theory |
| B | 80 | Type-along: Dockerfile + local build + workflow |
| C | 55 | Exercises: retag thought experiment + ledger |
| D | 15 | Git |
| E | 15 | Recall |

---

# Block A — Theory

## 1. Why an image is the artifact this course prefers

Month 15 already taught Dockerfile layers, non-root users, and Compose. An image **is** the runnable artifact: OS packages, Python, your wheels, the frontend nginx if you chose that shape. Promoting an image is one sentence: **change what the platform runs**.

A `dist/` zip is a valid artifact for static hosting (Week 3 CloudFront). The API still wants an image.

Kubernetes is optional. Images do not require a cluster. Compose, App Runner, ECS Fargate, and a single EC2 all **run images**.

## 2. Tag with git SHA

On GitHub Actions, `github.sha` is the commit that triggered the workflow. A common tag:

```text
ghcr.io/<owner>/<name>:<sha>
```

Use the short SHA (7–12 hex chars) or the full 40. Be consistent. Do **not** also overwrite that tag later.

You may add a moving tag `staging` **in addition**, as a pointer, if you understand it is a pointer. The **ledger** stores SHA and digest.

`GITHUB_SHA` for a `pull_request` event is the **merge commit** GitHub synthesizes, not always the head of your branch. For image builds intended for production, prefer building on **`push` to `main`** (or a `workflow_dispatch` on a tag). PR workflows can still **build** to prove the Dockerfile; they should **not** push a tag named as if it were production.

**Wrong belief:** “I’ll push to GHCR on every PR with tag `pr-42`.”  
**Correct:** that is allowed as a **preview** if you clean up. Do not confuse it with the production SHA.

## 3. Digest immutability

After build:

```text
docker image ls --digests
```

On the runner, `docker inspect` or the push output shows `sha256:`. Registries let you pull by digest:

```text
image@sha256:0123456789abcdef...
```

Compose can pin digest. App Runner and ECS can pin digest. If someone retags `abc1234` to different bytes (a bad practice you will refuse), the digest pull still gets the old bytes **if** you stored the digest.

**Wrong belief:** “SHA tag is enough because git SHA is unique.”  
**Correct:** unique until a human runs `docker tag` / `docker push` of **other** bytes to the same tag. Policy: **never retag a SHA**. Digest is the belt.

## 4. GHCR or similar

**GitHub Container Registry** (`ghcr.io`) sits next to your repo. Other registries (Docker Hub, AWS ECR) are the same **idea**: authenticate, push, pull.

This course default: **GHCR** for the learning path because Week 3 may still pull from GHCR into App Runner **or** you copy to ECR later. You may use **ECR** from the start if you already live in AWS. Do not use a random anonymous registry.

Authentication in Actions (shape, not a secret dump):

- `permissions: packages: write` plus `contents: read` when pushing to GHCR with `GITHUB_TOKEN`.  
- Login action, then `docker push`.

Never paste a PAT into YAML. If a PAT leaks, **revoke** it in GitHub settings. Rotation is Day 5.

## 5. Build in CI

Typical steps: checkout → set up QEMU/buildx **only if** you need extra architectures → `docker build -t …:$SHA .` → `docker push`.

GitHub-hosted runners include Docker. You do **not** need Kubernetes-in-Docker.

Multi-stage Dockerfiles (Month 15) still apply: build frontend in a Node stage, copy static files, run API as non-root. Today’s **gym** image can be a 10-line Python HTTP server. Product images stay in **your** repo.

## 6. What not to put in the image

Secrets, `.env`, `id_rsa`, production `DATABASE_URL`. Bake **code**. Inject **config** at run.

`COPY . .` plus a fat context is how you leak `.git` and env files. Use `.dockerignore`.

---

# Block B — Type-along

```powershell
cd ~\fullstack-lab
mkdir month-16\week-02\day-02\image-lab -Force
cd ~\fullstack-lab\month-16\week-02\day-02\image-lab
```

`app.py` — a **tiny** library-holds health app, not Project 7:

```python
from http.server import BaseHTTPRequestHandler, HTTPServer
import os

class H(BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        body = b'{"ok":true,"service":"holds-health"}\n'
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8000"))
    HTTPServer(("0.0.0.0", port), H).serve_forever()
```

`Dockerfile`:

```text
FROM python:3.12-slim
WORKDIR /app
COPY app.py .
RUN useradd --create-home appuser
USER appuser
EXPOSE 8000
CMD ["python", "app.py"]
```

`.dockerignore`:

```text
.git
.github
*.md
```

Local build (Docker Desktop running):

```powershell
docker build -t holds-health:dev .
docker run --rm -p 8000:8000 holds-health:dev
```

In another PowerShell:

```powershell
curl.exe http://127.0.0.1:8000/
```

Stop the container. Write `LOCAL-BUILD.md`: image id, that this tag `dev` is **not** a SHA.

Add `.github/workflows/image.yml`. Type a **build** job. Push job example (GHCR). Replace OWNER/IMAGE in your head with **your** GitHub user and repo name when you type it in the real repo:

```yaml
name: Image

on:
  push:
    branches: [main]

permissions:
  contents: read
  packages: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        env:
          SHA: ${{ github.sha }}
        run: |
          IMAGE=ghcr.io/${{ github.repository_owner }}/holds-health
          docker build -t "$IMAGE:$SHA" -t "$IMAGE:sha-${SHA::12}" .
          docker push "$IMAGE:$SHA"
          docker push "$IMAGE:sha-${SHA::12}"
          docker image inspect "$IMAGE:$SHA" --format '{{index .RepoDigests 0}}'
```

`${SHA::12}` is bash substring on the runner — **Linux**. Do not put that in PowerShell as-is without rewriting.

If GHCR push is forbidden on your account today, omit login/push and keep `docker build`. Write `PUSH-OWED.md`.

Packages on GHCR may be **private** by default. You do not need them public.

---

# Block C — Exercises

Write `TAG-VS-DIGEST.md`:

| Statement | True/False | Why |
|---|---|---|
| `:latest` is immutable | | |
| A git-SHA tag is unique if we never retag | | |
| Digest changes if we change one file and rebuild | | |
| Rebuilding on the server from the same SHA is the same digest | | |

The last row is **false** if the build is not reproducible (base image moved). That is why you **promote the digest you already pushed**, not “rebuild SHA on prod.”

Add a line to Week 2 Day 1 `LEDGER.md` (copy a row into today): SHA, tag, digest placeholder `sha256:lab`.

Write `PR-VS-MAIN.md`: why production images build on `main` (or a tag), not on every PR, in six lines.

Break exercise: add `ENV PASSWORD=please-no` to the Dockerfile, then **delete it**. Write `LEAK.md`: secrets belong at runtime.

---

# Block D — Git

```powershell
cd ~\fullstack-lab
git add month-16
git commit -m "Month 16 Day 2: SHA-tagged image lab and tag-vs-digest notes."
```

---

# Block E — Recall

1. Tag vs digest.  
2. Why not `:latest` for rollback.  
3. Why CI Linux build vs Windows Desktop.  
4. What `GITHUB_TOKEN` is for (login), and that it is not in git.  
5. Why PR image tags are not production.

## Office hours

**`denied: permission`** on GHCR. `packages: write`; package linked to the repo; user namespace vs org.

**Build works locally, CI cannot see Docker.** You used a runner without Docker (self-hosted). This course uses GitHub-hosted Ubuntu.

**Fat image.** You `COPY . .` without dockerignore. Fix the ignore file. Do not bake secrets. Do not attack registries.

---

## Definition of done

- [ ] Local `docker build` ran  
- [ ] `curl.exe` hit the gym container or you recorded a blocker  
- [ ] Workflow builds (and pushes, or PUSH-OWED)  
- [ ] `TAG-VS-DIGEST.md` completed  
- [ ] No secrets in the image  
- [ ] Commit exists  

---

## Optional review links

- [GitHub: Working with the Container registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)  
- [docker/login-action](https://github.com/docker/login-action)

## Tomorrow

**Memory** — draw and write promotion plus rollback with Days 1–2 closed.
