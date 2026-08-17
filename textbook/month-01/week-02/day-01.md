# Month 1 · Week 2 · Day 1
# Client, Server, Addresses, Ports

**Month index:** [../../README.md](../../README.md)  
**Week 2:** Day 1 (today) · [2](day-02.md) · [3](day-03.md) · [4](day-04.md) · [5](day-05.md) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Learn + small exercises  
**Study time:** 3–4 focused hours  
**Prereq:** Week 1 gate. You can use the terminal without panic.

---

## This week in the roadmap

You must learn: client/server, IP addresses, DNS, domains, ports, TCP, TLS, HTTPS, request/response lifecycle.

You must be able to explain:

**Browser → DNS → network connection → TLS → HTTP → server → response → browser**

Today: client/server, IP, ports, your machine on a network. DNS/TCP/TLS come Day 2–3. The full journey is assembled by Day 3 and drilled all week.

---

## Today's contract

1. Explain client and server as **two programs**, not as “the website” and “the internet.”
2. Explain IPv4 vs IPv6 at a working level; read an IP address.
3. Explain what a **port** is and why `localhost:3000` means what it means.
4. Inspect **your** IP addresses and a few open ports from PowerShell.

**Today's gate**

> A server is a process waiting on an address and a port. A client is a process that connects to that pair. The internet is how packets find that process.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 45 | Theory |
| B | 50 | Guided network inspection |
| C | 70 | Independent mapping of your machine |
| D | 30 | Lab notes in git |
| E | 15 | Recall |

---

# Block A — Theory

## 1. Client/server

A **client** asks. A **server** answers. Both are programs (processes).

| Role | Examples you already know | Later in this program |
|---|---|---|
| Client | Browser, `curl`, PowerShell `Invoke-WebRequest` | React app in the browser, API scripts |
| Server | The process behind `https://example.com` | FastAPI, PostgreSQL, Redis |

Important:

- One machine can run **both** (your laptop: browser + a local FastAPI process).
- A server can be a client of another server (FastAPI is a client of PostgreSQL).
- “The cloud” is still someone else’s computers running server processes.

**Wrong belief:** “The server is a hardware box in a basement.”  
**Correct:** hardware runs an OS; the OS runs a **process** that accepts connections. That process is the server. The box is just the host.

### 1.1 Request / response (preview)

The client sends a **request**. The server sends a **response**. Then, for ordinary HTTP, that little conversation for that request is done.

Week 3 fills in HTTP methods and headers. Today: the relationship exists, and it needs a way to **find** the server.

---

## 2. Why we need addresses

You do not shout “Hey Google” into a cable. Computers find each other with **numbers** (and then names that map to numbers — DNS, Day 2).

Two layers you must not confuse:

| Layer | Question it answers | Example |
|---|---|---|
| **IP address** | Which **machine** (network interface) on the network? | `142.250.190.14` |
| **Port** | Which **process** on that machine? | `443` (HTTPS) |

IP gets the packet to a computer. Port gets it to a program on that computer.

This is the same idea as:

- street address = building (IP)
- apartment number = resident (port)

The analogy is allowed because it preserves the truth: many processes share one machine.

---

## 3. IP addresses

**IP** means Internet Protocol. It is the addressing system of the network.

### 3.1 IPv4

Four numbers 0–255, dotted:

```
192.168.1.10
```

There are about 4 billion IPv4 addresses. That is not enough for every device on Earth, which is why we have private ranges and IPv6.

### 3.2 Special IPv4 ranges (memorize)

| Range | Meaning |
|---|---|
| `127.0.0.1` | **Loopback** — this same machine. Also called `localhost`. |
| `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` | **Private** — your home/LAN. Not unique on the public internet. |
| Others (typical public) | **Public** — routable on the internet (your home router usually has one public IP). |

`/8` and friends are CIDR notation (how big the block is). You do not need to design subnets this month. You need to recognize “this is private” vs “this is loopback” vs “this is probably public.”

### 3.3 IPv6

Longer hexadecimal addresses, for example `fe80::...` (link-local) or `2001:db8::1` (documentation).

You will see IPv6 on modern Windows (`Get-NetIPAddress`). For Month 1:

- Know it exists.
- `::1` is IPv6 loopback (like `127.0.0.1`).
- If a tool fails, sometimes it is IPv6 vs IPv4 confusion. Try `127.0.0.1` explicitly.

### 3.4 Your home network’s usual picture

```
[Your PC: private IP 192.168.x.x]
        |
[Home router: private IP inside, public IP outside]
        |
[Internet]
        |
[Server: public IP]
```

Many devices share one public IP (NAT). That is why a friend cannot type your `192.168.1.10` from another city and reach your PC. You will meet this again when deploying.

---

## 4. Ports

A **port** is a 16-bit number: **0–65535**.

A process **binds** (listens) on a port. Incoming connections to that IP+port are delivered to that process.

### 4.1 Ports you must know

| Port | Usual service |
|---|---|
| 22 | SSH (Linux servers, Month 15) |
| 53 | DNS |
| 80 | HTTP (unencrypted) |
| 443 | HTTPS (HTTP over TLS) |
| 3000, 5173, 8000, 8080 | Common **local** dev servers (React, Vite, FastAPI) |
| 5432 | PostgreSQL (later) |
| 6379 | Redis (later) |

These are **conventions**. You *can* run HTTP on port 8765. Browsers **assume** 80 and 443 if you omit the port:

- `http://example.com` → port 80
- `https://example.com` → port 443
- `http://localhost:5173` → port 5173 (must be written)

### 4.2 `localhost:3000`

Means: connect to **this machine** (`127.0.0.1` or `::1`) on port **3000**.

If nothing is listening on 3000, the client fails: connection refused. The website is not “down on the internet.” **Your** process is not running.

### 4.3 Privileged ports

On Linux, binding ports below 1024 often needs extra privilege. On Windows the details differ, but the idea remains: not every user can grab port 80. Dev servers use 3000+ for this reason.

---

## 5. Hostnames (light preview)

`localhost` is a name that resolves to loopback. `example.com` is a **domain name** that DNS will map to an IP (Day 2).

A URL you will parse all month:

```
https://localhost:8000/path?query=1
```

| Piece | Meaning |
|---|---|
| `https` | Scheme — use TLS, default port 443 (here overridden) |
| `localhost` | Host |
| `8000` | Port |
| `/path` | Path (Week 3) |
| `?query=1` | Query (Week 3) |

---

## 6. Security today

- **Port 80 vs 443:** 80 is HTTP in the clear. 443 is HTTPS (TLS). Do not send passwords to `http://` sites. Week 2 Day 2 explains TLS.
- **Listening on `0.0.0.0` vs `127.0.0.1`:** later, when you run FastAPI, binding to all interfaces can expose a dev server to your LAN. Today just know: loopback is only you; a LAN IP is your house; a public IP is the world.
- Do not scan random internet IPs. Inspect **your** machine and a few public lookup commands in this textbook.

---

# Block B — Guided lab

### Lab 1 — Loopback is you

```powershell
Resolve-DnsName localhost
ping -n 2 127.0.0.1
ping -n 2 localhost
```

**Write:** Does `localhost` become `127.0.0.1` and/or `::1`?

### Lab 2 — Your addresses

```powershell
Get-NetIPAddress | Sort-Object AddressFamily |
  Select-Object AddressFamily, InterfaceAlias, IPAddress, PrefixLength |
  Format-Table -AutoSize
```

**Write:**

- One IPv4 private address (often `192.168.` or `10.`)
- Loopback if listed
- Do not confuse a virtual adapter (vEthernet, Docker, VPN) with your Wi-Fi/Ethernet without looking at `InterfaceAlias`

Simpler view:

```powershell
ipconfig
```

Find “IPv4 Address” for your active adapter. `ipconfig /all` shows more (DNS servers — needed Day 2).

### Lab 3 — Who do you think you are on the public internet?

Your PC’s private IP is not the IP a website sees.

```powershell
curl.exe -s https://api.ipify.org
echo ""
```

This asks a public service “what public IP do you see?” That is usually your **router**, not your `192.168` address.

If this fails (offline, TLS inspection, firewall), write the error. Do not fight it for an hour. `ipconfig` is enough to continue.

**Write:** Private IP vs public IP — two numbers, one sentence each.

### Lab 4 — Ports: is anything listening?

```powershell
Get-NetTCPConnection -State Listen |
  Select-Object LocalAddress, LocalPort, OwningProcess |
  Sort-Object LocalPort |
  Format-Table -AutoSize
```

Pick **one** LocalPort you recognize or can look up (135, 445, 7680, a browser debug port, etc.). Map to process:

```powershell
Get-Process -Id <OwningProcess>
```

Replace `<OwningProcess>` with the number from the table.

**Write:** One listening port, PID, process name. You are looking at a **server** on your own machine (even if it is a Windows service, not a website).

### Lab 5 — Test a port

```powershell
Test-NetConnection -ComputerName 127.0.0.1 -Port 80
Test-NetConnection -ComputerName 127.0.0.1 -Port 443
Test-NetConnection -ComputerName example.com -Port 443
```

`TcpTestSucceeded : True` means a TCP connection worked (Week 2 Day 2 will name TCP). `False` on local 80 is normal if you are not running a web server.

**Write:** For `example.com:443`, did it succeed?

`Test-NetConnection` can be slow. Wait for it.

---

# Block C — Independent work

Create `~\fullstack-lab\week-02\` and `~\fullstack-lab\week-02\day-01-notes.md`.

Answer in your own words:

1. Client vs server, with two examples (one of them: browser vs `example.com`).
2. Why IP is not enough and we also need ports.
3. Table of **your** machine:

   | Item | Value |
   |---|---|
   | Hostname | `hostname` |
   | A private IPv4 | |
   | Loopback | |
   | Public IPv4 (if curl worked) | |
   | One listening port + process | |

4. What would happen if two programs tried to listen on the same IP and port? (The second bind fails. You will see this when a dev server is “already running.”)

5. Draw in ASCII:

```
Browser (client process)
   -> needs IP + port
Server (process listening)
```

---

# Block D — Git

```powershell
cd ~\fullstack-lab
git add week-02
git commit -m "Week 2 Day 1: client/server, IP, and port inspection notes."
```

Start `week-02/README.md`:

```markdown
# Week 2 — Internet and networking

Labs for IP, DNS, TCP, TLS, HTTPS, and the URL journey.
```

---

# Block E — Recall

1. What is a client? A server?
2. `127.0.0.1` vs `192.168.1.5` vs a public IP.
3. Why `https://example.com` does not show a port in the address bar.
4. What `localhost:5173` means.
5. Is the browser a server? (It is a client. It may also listen on a debug port — extra, not the main idea.)

---

## Definition of done

- [ ] I can explain client/server without saying “the internet does it.”
- [ ] I recorded private vs public IP from *my* machine.
- [ ] I listed a listening port and its process.
- [ ] I know ports 80, 443, 53, and why dev uses 3000+.
- [ ] Notes committed.

---

## Optional review links

Client/server, IP, ports, and the URL journey are explained in this chapter. These pages are for later checking, not for first learning.

- [How the Internet works (MDN)](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work)
- [Test-NetConnection](https://learn.microsoft.com/powershell/module/nettcpip/test-netconnection)

---

## Tomorrow

DNS and domains: names to IPs. Then TCP and TLS. The URL journey starts to have all of its arrows.
