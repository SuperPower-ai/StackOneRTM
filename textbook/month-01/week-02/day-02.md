# Month 1 · Week 2 · Day 2
# DNS, Domains, TCP, TLS, HTTPS

**Month index:** [../../README.md](../../README.md)  
**Week 2:** [1](day-01.md) · Day 2 (today) · [3](day-03.md) · [4](day-04.md) · [5](day-05.md) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Exercises + debugging  
**Study time:** 3–4 focused hours

---

## Today's contract

1. Explain a **domain name** vs an **IP address**.
2. Explain **DNS** as a lookup service (name → IP), including what happens when it fails.
3. Explain **TCP** as “a reliable connection” at a beginner-honest level (not a packet-trace course).
4. Explain **TLS** and why **HTTPS** is HTTP over that encrypted connection.
5. Debug: wrong name, DNS failure, wrong port, HTTP vs HTTPS.

**Today's gate**

> DNS finds the IP. TCP connects to IP:port. TLS wraps the socket in encryption and checks certificates. Then HTTP can speak. If you skip TLS, the words of HTTP are visible on the path.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 45 | Theory |
| B | 55 | DNS + TLS labs + broken cases |
| C | 70 | Independent DNS investigation |
| D | 30 | Notes + git |
| E | 15 | Recall |

---

# Block A — Theory

## 1. Domains

A **domain name** is a human-readable name registered in the DNS system.

```
www.example.com
```

Read **right to left**:

| Piece | Name | Role |
|---|---|---|
| `com` | TLD (top-level domain) | Registry class (`.com`, `.org`, country codes) |
| `example` | Second-level domain | What someone registered |
| `www` | Subdomain | Often “the website,” sometimes omitted (`example.com`) |

A **FQDN** (fully qualified domain name) names a specific host: `www.example.com`.

You buy/rent the right to use a name (Month 16 will touch DNS for deployment). Today: names exist so humans do not memorize `93.184.216.34`.

**URL vs domain:**

- Domain: `example.com`
- URL: `https://example.com/index.html` — scheme + host + path + more

---

## 2. DNS

**DNS** (Domain Name System) is the distributed lookup that answers:

> What IP address (or addresses) should I use for this name?

It is not the website. It is the **phone book**.

### 2.1 A lookup, simplified

When the browser sees `https://example.com`:

1. Check its cache: did we already resolve this name recently?
2. Ask the OS.
3. The OS asks a **resolver** (often your router, which asks your ISP, which asks other DNS servers).
4. Eventually an **authoritative** server for `example.com` answers: here are A (IPv4) and/or AAAA (IPv6) records.
5. The browser can now connect to that IP.

There are other record types (you should recognize the names):

| Type | Meaning |
|---|---|
| **A** | IPv4 address |
| **AAAA** | IPv6 address |
| **CNAME** | Alias to another name |
| **MX** | Mail servers (not needed for browsing) |
| **NS** | Which servers are authoritative for this name |
| **TXT** | Text (often verification, later email security) |

Month 1: you must be fluent in **A/AAAA**. Know the others exist.

### 2.2 DNS failure modes (debugging)

| What you see | Typical cause |
|---|---|
| `DNS_PROBE_FINISHED_NXDOMAIN` | Name does not exist (typo) |
| Browser hangs then fails | Resolver unreachable; no internet; wrong DNS server |
| Wrong site / old site | Cached DNS; CDN; you are not where you think |
| Works by IP, fails by name | DNS problem, not web-server problem |

This is why “is it DNS?” is a real question. If `Test-NetConnection 8.8.8.8` works but `Resolve-DnsName example.com` fails, you have network but broken name lookup.

`8.8.8.8` is Google’s public DNS resolver. `1.1.1.1` is Cloudflare’s. Using them as **ping targets** tests reachability, not “Google the website.”

---

## 3. TCP (honest beginner model)

**TCP** (Transmission Control Protocol) is how two processes usually create a **connection** for HTTP.

What you must understand:

1. TCP is **connection-oriented**: handshake, then a stream of bytes, then teardown.
2. It tries to be **reliable**: lost packets are retransmitted (you do not rebuild this in JavaScript).
3. HTTP (almost always) runs **on top of** TCP. The browser does not send a raw HTTP request into a void; it sends it into a TCP connection to `IP:port`.

The handshake is called **three-way** (SYN, SYN-ACK, ACK). You do not need to memorize packet flags for the Month 1 gate. You need:

> If TCP cannot connect (wrong IP, port closed, firewall), HTTP never starts. The error is **connection refused** or **timed out**, not `404`. `404` means HTTP *did* start and the server said “no such resource.”

**UDP** is another transport (DNS often uses UDP). Know the name. Do not go down a protocol rabbit hole today.

---

## 4. TLS and HTTPS

**TLS** (Transport Layer Security) is encryption and identity for the connection.

**HTTPS** means HTTP over TLS. The URL scheme is `https://`. Default port **443**.

### 4.1 What TLS gives you

1. **Encryption** — a network observer should not read the HTTP headers and body as clear text (they still see that you connected to an IP, and SNI often shows the hostname — details later).
2. **Server authentication** — the server presents a **certificate** that a **certificate authority (CA)** signed, saying “this public key belongs to `example.com`.” The browser checks that chain against its trust store.
3. **Integrity** — tampering with bytes in transit should be detected.

**HTTP** (`http://`, port 80) skips this. Café Wi-Fi can read your cookies and passwords. That is why Rule 4 starts here: never treat HTTP as safe for credentials.

### 4.2 Certificates (working level)

- A cert binds a **hostname** (or names) to a key.
- If the cert is expired, for the wrong name, or unsigned by a trusted CA, the browser **warns**.
- `localhost` HTTPS is awkward (self-signed certs). Dev often uses HTTP on localhost; production must use HTTPS (Month 16).

### 4.3 What TLS is not

- TLS does not mean the **website** is honest. A phishing site can have HTTPS.
- TLS does not replace **authorization** on your API. It protects the pipe, not your business rules (Month 13).

### 4.4 The order (critical)

```
DNS (name → IP)
  → TCP connect to IP:443
    → TLS handshake (certificates, keys)
      → HTTP request
        → HTTP response
```

If you explain HTTPS without TCP+TLS, you are waving. If you explain HTTP without DNS, you skipped how the client found the machine.

---

## 5. HTTP vs HTTPS in the address bar

Browsers mark HTTP as “Not secure.” They may upgrade to HTTPS (HSTS) for known sites.

For this program:

- Production: HTTPS.
- Local development: HTTP to `localhost` is common.
- Never send passwords to HTTP on a real network.

---

# Block B — Guided lab

### Lab 1 — Resolve a name

```powershell
Resolve-DnsName example.com
Resolve-DnsName example.com -Type A
Resolve-DnsName example.com -Type AAAA
```

**Write:** IPv4 and IPv6 (if any) for `example.com`.

```powershell
Resolve-DnsName www.example.com
```

Compare. Sometimes `www` is a CNAME.

### Lab 2 — A name that should fail

```powershell
Resolve-DnsName this-name-should-not-exist-abcxyz-123.com
```

**Write:** the error. This is NXDOMAIN (or similar). Typos look like this.

### Lab 3 — DNS server in use

```powershell
Get-DnsClientServerAddress | Where-Object { $_.AddressFamily -eq 2 } |
  Select-Object InterfaceAlias, ServerAddresses
```

`AddressFamily 2` is IPv4. **Write:** which DNS resolvers your machine uses (often your router `192.168.1.1` or ISP).

`ipconfig /all` — find “DNS Servers.”

### Lab 4 — TCP to 80 vs 443

```powershell
Test-NetConnection example.com -Port 80
Test-NetConnection example.com -Port 443
```

Both often succeed because servers listen on both (80 may redirect to 443).

### Lab 5 — See HTTPS with curl

```powershell
curl.exe -I https://example.com
curl.exe -I http://example.com
```

`-I` asks for headers only (HEAD-like). **Write:**

- status line of HTTPS
- does HTTP 80 **redirect** (`301`/`302`/`308`) to HTTPS? Look for `Location:`

```powershell
curl.exe -I --max-redirs 0 http://example.com
```

### Lab 6 — Certificate peek

```powershell
curl.exe -vI https://example.com
```

Verbose output includes TLS. Look for lines about certificate, `SSL connection`, `subject`. You will not understand every line. Find:

- that TLS happened
- the HTTP status after TLS

**Wrong port:**

```powershell
curl.exe -v --connect-timeout 5 https://example.com:81
```

This should fail or hang until timeout. **Write:** HTTP never started.

### Lab 7 — Deliberate scheme mistake

```powershell
curl.exe -I https://example.com
curl.exe -I http://example.com
```

If you put a password in a URL (never do that in real life), HTTP would leak it. **Write one sentence** in notes: why login forms must be HTTPS.

---

# Block C — Independent investigation

Pick **one** real site you use (documentation site, GitHub, your school). Stay professional; this is inspection, not attacking.

In `week-02/dns-investigation.md`:

1. Domain name
2. `Resolve-DnsName` results (A/AAAA)
3. `Test-NetConnection` 443 result
4. `curl.exe -I https://...` status and `server` header if present
5. Does `http://` redirect to `https://`?
6. What failed when you resolved a typo of that domain?

Then write a paragraph: **If DNS is wrong, can TLS still succeed against the real server?** (You would connect to the wrong IP if DNS is poisoned or mistyped — TLS might fail the name check, or you might see a different site. This is why certificate **hostname** checks matter.)

Do not run port scans on ranges of IPs. One name, ports 80 and 443 only.

---

# Block D — Git

```powershell
cd ~\fullstack-lab
git add week-02
git commit -m "Week 2 Day 2: DNS, TCP, TLS labs and investigation."
```

---

# Block E — Recall

1. DNS answers what question?
2. A vs AAAA vs CNAME.
3. Connection refused vs 404.
4. HTTPS = HTTP + TLS. Order of DNS, TCP, TLS, HTTP.
5. HTTPS does not mean the site is trustworthy.

---

## Definition of done

- [ ] I can explain DNS without calling it “the internet.”
- [ ] I resolved a real name and a fake name.
- [ ] I saw HTTP vs HTTPS headers with curl.
- [ ] I can explain why a TLS/port failure is not an HTTP status code.
- [ ] Investigation notes committed.

---

## Optional review links

DNS, domains, TCP, and TLS are explained in this chapter. These pages are for later checking, not for first learning.

- [MDN: What is a domain name?](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_domain_name)
- [MDN: What is HTTPS?](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS)
- [Resolve-DnsName](https://learn.microsoft.com/powershell/module/dnsclient/resolve-dnsname)

---

## Tomorrow

Implement the **full URL journey** from memory. Draw it. Then verify each arrow with a command.
