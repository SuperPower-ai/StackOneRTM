# Month 15 · Week 1 · Day 5
# SSH Keys and a Runbook: How You Will Enter a Box

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 5 — Production engineering  
**Month index:** [../../README.md](../../README.md)  
**Week 1:** [1](day-01.md) · [2](day-02.md) · [3](day-03.md) · [4](day-04.md) · Day 5 (today) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Tests / docs (a runbook you could hand a teammate)  
**Student state:** You can inspect a process on Ubuntu. Today you prove you can **enter** a Linux box with a **key**, not with a password pasted into Discord.  
**Study time:** 3–4 focused hours  
**Prereq:** Day 4 gate passed. Docker Desktop will be used as a **local box**, not as the Week 2 curriculum. If Docker is not yet installed, install Docker Desktop for Windows with the **WSL2 backend**, then return here. You will not write a Dockerfile today.

Labs: `~/fullstack-lab/month-15/week-01/day-05/`. You will SSH into **localhost’s container**, not into a stranger’s machine. Defense only: no brute-force tools, no exploit PoCs, no “bypass SSH.”

This textbook will **not** paste Project 7.

---

## How to use this textbook

1. Read why a password in chat is a credential leak, not a convenience.  
2. Generate a key pair with `ssh-keygen`.  
3. Run a local Linux container that accepts **your** public key.  
4. Write `SSH.md` so a future you can repeat it without Slack archaeology.  
5. Optional review links are for later rechecking.

---

## How to read this chapter

SSH (**Secure Shell**) is a protocol: encrypted remote login and command execution. The usual **authentication** on servers is **public-key**: you hold a **private** key; the server holds the matching **public** key in `authorized_keys`.

```mermaid
flowchart LR
  You[Your private key: never leaves you] --> Agent[ssh client]
  Agent --> Box[sshd on the box]
  Box --> AK["~/.ssh/authorized_keys: public keys"]
```

**Wrong belief:** “I’ll email the password to myself and change it later.”  
**Correct:** chat, email, and tickets are **logs**. Passwords copied there are stolen copies. Keys plus `authorized_keys` mean the server never needs your private key and you never type a reusable login password over Slack.

**Wrong belief:** “The `.pub` file is the secret.”  
**Correct:** `.pub` is public. You can put it on a server, a GitHub account SSH setting, or in this lab’s notes. The file **without** `.pub` is private: mode `600`, never committed, never pasted.

Kubernetes has its own story for exec into pods. **Not this month.** You are learning SSH because VMs, jump hosts, and many CI “debug this runner” flows still use it.

---

## Today's contract

By the end of this day you will be able to:

1. Generate **ed25519** keys with `ssh-keygen`.  
2. Explain `authorized_keys`, `~/.ssh` modes (`700` / `600`).  
3. SSH as a user into a **local** Linux container using that key.  
4. Write **`SSH.md`**: how to connect, what not to commit, what to do if you lose the private key.  
5. Say why a password in a group chat fails as an operations practice.

**Today's gate.** Closed-book:

> I authenticate with a key pair. The private key stays on my machine at mode 600. The public key is listed in authorized_keys on the box. I wrote SSH.md. I never pasted a live password into chat.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 40 | Theory |
| B | 80 | Type-along: keys + container sshd |
| C | 55 | Independent: runbook + failure drills |
| D | 15 | Git (without the private key) |
| E | 15 | Recall |

---

# Block A — Theory

## 1. Why SSH before “the cloud”

Month 16 will talk about AWS. None of that helps if your only remote story is a password from a screenshot. Teams still debug: “SSH to the bastion, then to the app VM.” Even when the app is in Compose on a single VM, **you** get in with SSH.

Today the “VM” is a container running `sshd` so you do not pay for a cloud box to learn `ssh-keygen`.

## 2. Key pair

**Private key** (`id_ed25519`): a secret file. Anyone who has it can impersonate you on every box that lists the matching public key.

**Public key** (`id_ed25519.pub`): one line, usually starting with `ssh-ed25519`. Safe to share with systems that should allow **you**.

**Fingerprint:** a short hash you can compare out of band (“does this server key match what we expected?”) — you will see host key prompts on first connect. That prompt is **not** a virus. It is ssh asking you to record the server’s identity. First time to a **lab** container, you verify you typed the right port. In a company, you compare fingerprints via a known channel.

**ed25519** is the default choice in this course: short, modern, widely supported. Do not generate DSA. RSA still works; you do not need two algorithms today.

**Passphrase** on the private key: encrypts the key at rest. If someone copies the file, they still need the passphrase. Use a passphrase you will remember. The lab still works with an empty passphrase; production keys should not be empty. Write your choice in `SSH.md` (not the passphrase itself).

## 3. ssh-keygen

```bash
ssh-keygen -t ed25519 -C "month15-lab@$(hostname)" -f ~/fullstack-lab/month-15/week-01/day-05/lab_ed25519
```

`-C` is a comment (email-like label), not a password. `-f` chooses a **lab** key so you do not smash your existing GitHub key if you already have `~/.ssh/id_ed25519`.

If you already live on `~/.ssh/id_ed25519` for GitHub, **keep it**. Use a separate lab key today. Mixing “GitHub push” and “throwaway container” keys is how people revoke the wrong thing.

## 4. authorized_keys and modes

On the **server**, each user’s `~/.ssh/authorized_keys` is a list of public key lines. `sshd` will allow a client that proves it holds the matching private key.

Modes sshd is picky about (typical):

| Path | Mode |
|---|---|
| `~/.ssh` | `700` (`drwx------`) |
| `~/.ssh/authorized_keys` | `600` or `640` depending on sshd config; `600` is safe |
| private key on the **client** | `600` |

If modes are too open, sshd **silently** refuses keys and you think “keys don’t work.” `ls -ld ~/.ssh` is part of the runbook.

You will **not** disable host-key checking globally (`StrictHostKeyChecking=no` in a user config for all hosts). For a disposable lab container whose host key changes every recreate, you may use a **lab-only** `known_hosts` file or remove one stale line from `~/.ssh/known_hosts`. That is hygiene, not “turn off security.”

## 5. Why passwords in chat fail

A password is a **shared secret**. Chat is:

- retained  
- searchable  
- often visible to future teammates, bots, and compromised accounts  
- sometimes logged by compliance tools you forgot existed  

Once pasted, you must **treat it as leaked**: rotate. Keys let you **add** a public key and **remove** it when someone leaves, without texting a new password to six people.

**Wrong belief:** “It’s a throwaway lab password, so Slack is fine.”  
**Correct:** the **habit** is the defect. Muscle memory from labs becomes production incident mail.

This course will not teach password spraying, hydra, or ssh exploits. If you are locked out of **your** WSL user, you reset it the Windows/WSL documented way — you do not “break in.”

## 6. ssh as a command

```bash
ssh -i lab_ed25519 -p 2222 labuser@127.0.0.1
```

`-i` identity file (private key). `-p` port. `user@host`. Once in, you are in a shell on **that** machine (today: container). `exit` to leave.

`scp` and `sftp` exist; not required today. Git-over-SSH is the same key idea you may already use with GitHub.

## 7. Docker today: a box, not a curriculum

You will run a Linux image with sshd **because** the assignment is SSH. Week 2 will teach images properly. Today:

- Docker Desktop running, WSL2 engine  
- You `docker run` an image that includes sshd **or** you build a tiny lab image from a 10-line Dockerfile you type — that Dockerfile is **lab scaffolding**, not Week 2 mastery  

If `docker` is missing in Ubuntu:

```bash
docker version
```

Install Docker Desktop on Windows, enable “Use the WSL 2 based engine,” enable your Ubuntu distro in Resources → WSL Integration. Open a **new** Ubuntu window.

**Wrong belief:** “I should SSH into production from a coffee-shop laptop with password auth enabled.”  
**Correct:** key-only, preferably from a bastion, later with extra factors. Today: key-only into a **local** container.

---

# Block B — Type-along

```bash
mkdir -p ~/fullstack-lab/month-15/week-01/day-05
cd ~/fullstack-lab/month-15/week-01/day-05
docker version
```

### B1 — Lab key

```bash
ssh-keygen -t ed25519 -C "month15-lab" -f ./lab_ed25519
ls -l lab_ed25519 lab_ed25519.pub
chmod 600 lab_ed25519
cat lab_ed25519.pub
```

Write `KEY-FACTS.md`: algorithm; comment; public line **is** shareable; private filename must not be committed.

Create `.gitignore` in this day folder:

```text
lab_ed25519
lab_ed25519.pub
```

Wait: **do** allow committing a **copy** of the **public** key as `lab_ed25519.pub.example` if you want evidence — never the private file. Simpler: gitignore both, and paste the **public** line into `SSH.md`. Private file stays gitignored.

```text
lab_ed25519
```

Keep `.pub` out of git too if you prefer; the public line in `SSH.md` is enough evidence.

### B2 — authorized_keys file to mount

```bash
mkdir -p ./box-ssh
cat lab_ed25519.pub > ./box-ssh/authorized_keys
chmod 700 ./box-ssh
chmod 600 ./box-ssh/authorized_keys
```

### B3 — Container with sshd

Type `sshd.Dockerfile` (name it clearly so Week 2 can sneer at it later as “not a production image”):

```dockerfile
FROM ubuntu:24.04
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssh-server \
 && rm -rf /var/lib/apt/lists/* \
 && mkdir -p /run/sshd /home/labuser/.ssh \
 && useradd -m -s /bin/bash labuser \
 && echo 'labuser:disabled-password-login' | chpasswd \
 && chown -R labuser:labuser /home/labuser/.ssh
COPY sshd_config.tail /tmp/sshd_config.tail
RUN cat /tmp/sshd_config.tail >> /etc/ssh/sshd_config
CMD ["/usr/sbin/sshd", "-D"]
```

Create `sshd_config.tail`:

```text
Port 22
PasswordAuthentication no
PubkeyAuthentication yes
ChallengeResponseAuthentication no
PermitRootLogin no
```

This is **defense hardening for a lab**, not an exploit. Password auth off means the only way in is the key you mount.

You need `authorized_keys` inside the container. Simplest lab path: bind-mount the file.

Also copy a small `entrypoint` is optional. Bind mount:

```bash
docker build -t month15-sshd -f sshd.Dockerfile .
docker rm -f month15-ssh 2>/dev/null || true
docker run -d --name month15-ssh -p 2222:22 \
  -v "$PWD/box-ssh/authorized_keys:/home/labuser/.ssh/authorized_keys:ro" \
  month15-sshd
docker logs month15-ssh
```

If sshd complains about modes/ownership, fix **inside** with a one-off (you own this container):

```bash
docker exec -u root month15-ssh chown labuser:labuser /home/labuser/.ssh/authorized_keys
docker exec -u root month15-ssh chmod 600 /home/labuser/.ssh/authorized_keys
docker exec -u root month15-ssh chmod 700 /home/labuser/.ssh
```

Then:

```bash
ssh -i ./lab_ed25519 -p 2222 -o StrictHostKeyChecking=accept-new labuser@127.0.0.1
```

`accept-new` records the host key **if unknown**; it does not blindly accept **changed** keys (OpenSSH 7.6+). First connect: you should get a `labuser@...` prompt. Run `hostname` and `whoami`. `exit`.

If it fails, `ssh -v` (verbose) — read “Offering public key” vs “Permission denied (publickey).” Write the last 20 lines (no private key material) into `DEBUG-SSH.txt`.

### B4 — Prove password auth is off

```bash
ssh -p 2222 -o PreferredAuthentications=password -o PubkeyAuthentication=no labuser@127.0.0.1
```

It should **not** let you in with the dummy password. That is the point. Record the refusal in `SSH.md`.

Stop offering passwords to the container for the rest of the day.

---

# Block C — Independent: the runbook

Write **`SSH.md`** in the lab folder. Required sections (complete sentences):

1. **Purpose** — SSH to a local lab box (container), key-only.  
2. **Client files** — private key path, mode 600, gitignored.  
3. **Server files** — `authorized_keys` path, modes, `PasswordAuthentication no`.  
4. **Connect command** — the exact `ssh` line that worked, including port.  
5. **First-time host key** — what the prompt means; how you will remove a **stale** `known_hosts` line if you recreate the container (`ssh-keygen -R "[127.0.0.1]:2222"`).  
6. **Lost private key** — generate a new pair, install new `.pub`, delete the old line from `authorized_keys`. You cannot “derive” the private key from `.pub`.  
7. **Chat policy** — one paragraph: no passwords, no private keys, public keys OK.  
8. **Not Kubernetes** — one sentence.

### Failure drills (write answers in `DRILLS.md`)

**D1.** Private key is `644`. Predict sshd/client complaint. Then `chmod 600` and reconnect.  
**D2.** Recreate the container, host key changes, ssh refuses. Repair with `ssh-keygen -R` for that host/port — not by disabling checking forever.  
**D3.** You accidentally `git add lab_ed25519`. What do you do? (Do not push. Remove from index. If it were ever pushed, **rotate**: new key, delete old from every `authorized_keys`. Assume leaked.)

---

# Block D — Git

```bash
cd ~/fullstack-lab
git status
```

Confirm `lab_ed25519` is **not** staged. If it is, `git restore --staged` that file and fix `.gitignore`.

```bash
git add month-15/week-01/day-05
git commit -m "Month 15 Day 5: SSH key lab and SSH.md runbook."
```

Stop the container when finished:

```bash
docker rm -f month15-ssh
```

---

# Block E — Recall

1. Private vs public key.  
2. What `authorized_keys` contains.  
3. Mode on a private key.  
4. Why chat passwords fail.  
5. What a changed host key warning is telling you.  
6. PasswordAuthentication no — what you proved.

---

## Office hours

**`docker: command not found` in Ubuntu.** Docker Desktop WSL integration. New terminal after install.

**Permission denied (publickey).** Modes, ownership `labuser`, public key line matches, `-i` points at **private** file.

**`WARNING: UNPROTECTED PRIVATE KEY FILE`.** chmod 600 on the client key.

**Host key verification failed.** Container was recreated. `ssh-keygen -R "[127.0.0.1]:2222"` then reconnect. Do not teach the internet to use `-o StrictHostKeyChecking=no` as a lifestyle.

**I SSHed into a cloud VM I do not own.** Stop. This lab is local only.

---

## Definition of done

- [ ] Key pair exists; private key gitignored and `600`  
- [ ] Interactive SSH into the container succeeded  
- [ ] Password auth refused  
- [ ] `SSH.md` has all eight sections  
- [ ] Commit does not contain the private key  

---

## Optional review links

- [OpenSSH ssh-keygen](https://man.openbsd.org/ssh-keygen)  
- [OpenSSH sshd_config](https://man.openbsd.org/sshd_config)  
- [Docker Desktop: WSL](https://docs.docker.com/desktop/wsl/)  

---

## Tomorrow

**Independent:** `apt update`/`install`; `ss`, `ping`, `curl`, `dig`/`getent` — map a **listening port** to a **process**.
