# Month 15 · Week 1 · Day 6
# Independent: Packages and Networking Tools — Port to Process

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 5 — Production engineering  
**Month index:** [../../README.md](../../README.md)  
**Week 1:** [1](day-01.md) · [2](day-02.md) · [3](day-03.md) · [4](day-04.md) · [5](day-05.md) · Day 6 (today) · [7](day-07.md)  
**Week rhythm today:** Independent implementation  
**Student state:** You can enter a box with a key. Today you **maintain** the box (`apt`) and **ask it who is listening** (`ss`), like an on-call engineer who cannot open Wireshark on a production VM.  
**Study time:** 3–4 focused hours  
**Prereq:** Day 5 gate passed. Ubuntu bash. Docker Desktop may still be running from yesterday; stop leftover `month15-ssh` if it holds port 2222.

Labs: `~/fullstack-lab/month-15/week-01/day-06/`. This textbook will **not** give you a finished `NET.md`. It will give you a **spec envelope**. Do not scan other people’s machines. Do not run exploit tools. `ping`/`curl`/`ss` against **localhost** and well-known public names (`example.com`) only.

---

## How to use this textbook

1. Install only packages this day names (plus `dnsutils` or `bind9-dnsutils` for `dig`).  
2. Write evidence into `NET.md` as you go — commands and **your** output summaries, not screenshots of the whole internet.  
3. Map **one** listening TCP port to a **PID** and command line.  
4. Optional review links are for later rechecking.

---

## How to read this chapter

A server is not “up” because the process exists. It is up because something is **bound** to a port (or to a socket) and answers. Week 4 will add `/health`. Today is the POSIX picture: **packages**, **name resolution**, **ICMP ping**, **HTTP curl**, **sockets**.

```mermaid
flowchart LR
  DNS[Name: example.com] --> IP[A or AAAA record]
  IP --> TCP[TCP connect]
  TCP --> Port[Port 443]
  Port --> PID[Process that called bind]
```

**Wrong belief:** “`ping` proves the website works.”  
**Correct:** ping proves **ICMP echo** (if the host even replies). Many hosts disable ping. HTTP can still work. HTTP can fail while ping works. Use the tool that matches the question.

**Wrong belief:** “`localhost` is 127.0.0.1 and that is the whole story.”  
**Correct:** `localhost` can also be `::1` (IPv6). A server bound only to IPv4 may confuse you. `ss` shows the truth.

Kubernetes Service DNS is a later vocabulary. **Not this month.** Today: `getent` and `dig` on ordinary names.

---

## Today's contract

By the end of this day you will be able to:

1. Update apt indexes and install a package **on purpose**.  
2. Use **`ss`** to list listening TCP ports.  
3. Use **`ping`**, **`curl`**, **`dig`** or **`getent`** and say what each proves.  
4. Map a listen port → inode/process (`ss -lptn` / `ss -lptn | grep`).  
5. Write `NET.md` a teammate could follow on **this** WSL Ubuntu.

**Today's gate.** Closed-book:

> apt updates indexes then installs packages. ss shows sockets. ping is ICMP. curl is HTTP. dig/getent resolve names. I can name the process holding a port I care about. I did not scan the internet.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 35 | Theory (read, then close) |
| B | 40 | apt + tool check |
| C | 90 | Independent: listen map + NET.md |
| D | 20 | Self-review checklist |
| E | 15 | Recall + commit |

---

# Block A — Theory

## 1. apt: indexes versus packages

**apt** is Ubuntu’s package manager. Two moments students mash together:

| Command | What it does |
|---|---|
| `sudo apt update` | Downloads **index** files: what versions exist in the repos |
| `sudo apt install pkg` | Fetches and installs **packages** (and dependencies) |
| `sudo apt upgrade` | Upgrades installed packages (do **not** blindly do this mid-lab unless you mean to) |

`update` without `install` changes almost nothing on disk except lists. `install` without a recent `update` can try stale versions or miss a package name.

Packages live as **.deb** files; apt solves a dependency graph. You do not download random `curl` binaries from a blog.

**Wrong belief:** “`apt update` upgrades my Python.”  
**Correct:** it refreshes **catalogs**. `install`/`upgrade` change installed software.

You need network permission for apt. If you are offline, write that in `NET.md` and install from cache only if packages are already present — honesty over theater.

## 2. Sockets, ports, bind

A **port** is a 16-bit number on a transport protocol (TCP/UDP). **Privileged ports** 1–1023 typically need root to bind (80, 443, 22). Your user can bind 8000, 5432 (sometimes), 2222.

**Listen** means: the process called `bind` + `listen`. Incoming connections can complete.

**`ss`** (socket statistics) replaced the older `netstat` on modern Ubuntu.

```bash
ss -lnt
ss -lptn
```

Useful flags: `-l` listening, `-n` numeric (no reverse DNS delay), `-t` TCP, `-u` UDP, `-p` processes (may need sudo to see others’ PIDs).

**Wrong belief:** “If I see 0.0.0.0:8000, only my laptop can connect.”  
**Correct:** `0.0.0.0` means **all IPv4 interfaces**. On a public VM that is the world. `127.0.0.1:8000` is only local. This distinction is how people accidentally publish Redis.

## 3. ping, curl, dig, getent

**ping** sends ICMP echo. Success: a host (or something in front) answered ICMP. Failure: not “the API is down.” Firewalls drop ICMP constantly.

**curl** is an HTTP(S) client (also other protocols). `curl -I` fetches headers. `curl -v` is verbose. You already used curl in earlier months on Windows as `curl.exe`. Today: `curl` in Ubuntu.

**dig** queries DNS **directly** (talks to a resolver you name, or the system one). Good for “what A record does this name have.”

**getent hosts** asks the **C library** name service (files, then DNS, per `/etc/nsswitch.conf`). That is what most programs use. If `dig` works and `getent` fails, you are looking at nsswitch or `/etc/hosts`, not “the internet is down.”

```bash
getent hosts example.com
dig +short example.com A
```

## 4. Mapping port → process

Question: “What is using 8000?”

```bash
ss -lptn | grep 8000
```

Read `pid=` and the command. If `-p` shows `-` you may need `sudo ss -lptn`.

Then:

```bash
ps -o pid,ppid,user,cmd -p THE_PID
```

That chain is a Week 1 Day 7 exam skill and a Week 2 “port already allocated” skill.

## 5. Scope and ethics

You may:

- listen on **your** WSL
- curl `https://example.com` or `https://neverssl.com` as a reachability check
- curl `127.0.0.1` ports **you** started

You may not:

- port-scan campus, employer, or random IPs
- run nmap “for practice” against anything you do not own
- attempt logins on hosts that are not your lab

Defense and diagnosis only.

## 6. A tiny listener you will start

So you have a port to map, start a **lab** HTTP server in the day folder — not Project 7:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

That is a process. `ss` should show `127.0.0.1:8765`. `curl` should get a directory listing or 200. Then you know the chain works.

---

# Block B — apt and tools

```bash
mkdir -p ~/fullstack-lab/month-15/week-01/day-06
cd ~/fullstack-lab/month-15/week-01/day-06
```

```bash
sudo apt update
```

Write three lines from the output into `APT.md`: number of packages that can be upgraded (do not upgrade them all unless you have a reason), and whether any error appeared.

Install tools if missing:

```bash
sudo apt install -y iproute2 iputils-ping curl
sudo apt install -y bind9-dnsutils || sudo apt install -y dnsutils
```

`iproute2` provides `ss`. Confirm:

```bash
command -v ss
command -v ping
command -v curl
command -v dig
command -v getent
ss --version
```

Record versions (or `command -v` paths) in `APT.md`.

---

# Block C — Independent (spec envelope)

Create `NET.md` with these sections, filled from **commands you type**.

### 1. Listening table (before your lab server)

Run:

```bash
ss -lnt
```

List **five** listening TCP sockets (or all, if fewer). Columns: local address:port, and a guess (sshd, docker-proxy, nothing). Do not invent PIDs you did not look up.

### 2. Start a lab listener

In one terminal:

```bash
cd ~/fullstack-lab/month-15/week-01/day-06
echo "port-map-lab" > index.html
python3 -m http.server 8765 --bind 127.0.0.1
```

Leave it running. In another Ubuntu terminal:

```bash
ss -lptn | grep 8765
curl -sS -D - http://127.0.0.1:8765/ -o /tmp/month15-curl-body.txt | head
head /tmp/month15-curl-body.txt
ps -o pid,cmd -p "$(ss -lptn | awk '/8765/{print}' | grep -oP 'pid=\K[0-9]+' | head -1)"
```

If the awk/grep is too cute and fails, do it **by eye**: copy PID from `ss -lptn` into `ps -p`. That is the intended skill.

Paste into `NET.md`: ss line, curl status, PID, command line. **Question:** why `--bind 127.0.0.1` is safer than `0.0.0.0` on a shared network.

Stop the server with Ctrl+C (SIGINT) in its terminal when the section is done — or after section 5.

### 3. ping vs curl

```bash
ping -c 3 example.com
curl -I -sS --max-time 10 https://example.com | head
```

Write: did ping get replies? Did curl get an HTTP status? If ping fails and curl works (or the reverse), explain using Block A. Do not attack example.com; three pings and one HEAD are enough.

### 4. Name resolution

```bash
getent hosts example.com
dig +short example.com A
cat /etc/resolv.conf
```

Write: IP from getent vs dig; what `nameserver` you are using (WSL often uses a Windows-generated resolver — describe what you see, do not “fix” it unless it is broken).

If `dig` is missing after apt, record the apt error; `getent` still counts.

### 5. Port already in use (rehearsal)

Start the http.server on 8765 again if stopped. In a second terminal try another:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Capture the error. Write: **which process still holds the port** (ss + ps). Stop the first one, retry, confirm success, then stop.

This is Week 1 Day 7 defect “port in use.”

### 6. Docker port if Desktop is running (optional evidence)

```bash
ss -lnt | grep 2375 || true
ss -lnt | grep 2376 || true
docker ps 2>/dev/null | head
```

If Docker is up, you may see `docker-proxy` on published ports. One sentence: published container ports appear on the **host** as listeners. Week 2 will name this.

### Forbidden list

Do not: `nmap`, masscan, hydra, ssh to hosts you did not start, `curl` of internal company URLs that are not yours, Project 7 full source.

---

# Block D — Self-review

Checklist in `CHECK.txt` (yes/no):

- [ ] apt update ran  
- [ ] ss, ping, curl, getent all used  
- [ ] Port 8765 mapped to python PID  
- [ ] ping vs curl paragraph exists  
- [ ] Second bind on 8765 error captured  
- [ ] No private keys from Day 5 in this folder  
- [ ] NET.md is complete sentences, not only command dumps  

If any no, fix before Day 7.

---

# Block E — Recall and git

Recall out loud:

1. apt update vs install.  
2. 127.0.0.1 vs 0.0.0.0.  
3. ping vs curl.  
4. dig vs getent.  
5. How to find who owns a port.

```bash
cd ~/fullstack-lab
git add month-15/week-01/day-06
git commit -m "Month 15 Day 6: apt notes and port-to-process NET.md."
```

---

## Office hours

**`ss: command not found`.** `sudo apt install iproute2`.

**`ping: socket: Operation not permitted`.** Some WSL/corporate policies restrict ICMP. Write it down; rely on curl. Do not spend an hour on ICMP.

**`curl: (6) Could not resolve host`.** DNS. `cat /etc/resolv.conf`, `getent hosts`. Corporate VPN + WSL is a known mess; try Windows `nslookup` only as a comparison note, then fix WSL resolver using Microsoft WSL DNS docs — after you have written the **symptom**.

**`python3: command not found`.** `sudo apt install -y python3`.

**I scanned 10.0.0.0/8 at work.** Stop. That can be a policy violation. This course does not ask for it.

---

## Definition of done

- [ ] `APT.md` and `NET.md` exist and match the spec  
- [ ] You mapped 8765 → PID with evidence  
- [ ] You captured “address already in use”  
- [ ] Gate paragraph closed-book  
- [ ] Commit exists  

---

## Optional review links

- [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html)  
- [apt(8)](https://manpages.ubuntu.com/manpages/noble/en/man8/apt.8.html)  
- [curl book: command line](https://curl.se/docs/manpage.html)  
- [bind9 dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility)  

---

## Tomorrow

**Week review:** `journalctl`, `/var/log`, synthesis, debug five Linux defects. Do not start Week 2 if Day 6 has no port map.
