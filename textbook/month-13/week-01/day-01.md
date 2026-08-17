# Month 13 · Week 1 · Day 1
# Passwords: Hash, Never Store, Never Log

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 4 — Full-stack application  
**Month index:** [../../README.md](../../README.md)  
**Week 1:** Day 1 (today) · [2](day-02.md) · [3](day-03.md) · [4](day-04.md) · [5](day-05.md) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Learn + type-along  
**Student state:** Month 12 gate passed. You can change database → API → UI. Today **who someone is** starts with a secret you must **not** keep in a form that can leak.  
**Study time:** 3–4 focused hours

**This week covers:** password hashing, credential storage, sessions, cookies, tokens, JWT trade-offs.

Today: why plaintext passwords are a product disaster, what a **password hash** is, **argon2** (or bcrypt) as the library you call, and the rule **never log the password**. Sessions and cookies are Day 2. Do not skip them.

This book teaches **defense**. It does not teach you to break other people’s systems.

Labs: `~\fullstack-lab\month-13\week-01\day-01\`. Do not paste Project 7 auth.

---

## How to use this textbook

1. Read a section. Close it. Say it.
2. Type the hashing lab. Use a **throwaway** password you do not use anywhere else.
3. If you ever see a password in a log file, treat that as a **bug you fix today**.
4. Optional review links are for later rechecking.

---

## How to read this chapter

Authentication answers **who are you?** The usual first-party answer is: you prove you know a password. The server must **verify** that proof without **storing** the password.

```mermaid
flowchart LR
  P[Password from the request] --> H[Hash function argon2]
  H --> DB[(Stored hash only)]
  P2[Later login attempt] --> H2[Hash + verify]
  H2 --> DB
  H2 --> YES[Match: identity accepted]
  H2 --> NO[No match: generic failure]
```

**Wrong belief:** “I’ll encrypt passwords so I can decrypt them if the user forgets.”  
**Correct:** encryption is reversible with a key. A password store must be **one-way**. Forgot-password is a **reset**, not a retrieval. Week 2.

**Wrong belief:** “Base64 is hashing.”  
**Correct:** Base64 is encoding. Anyone can reverse it. It is not protection.

---

## Today's contract

By the end of this day you will be able to:

1. Explain **hash** vs **encryption** vs **encoding** in one sentence each.
2. Hash a password with **argon2** (preferred) or **bcrypt** and verify a later attempt.
3. Store only the hash in a dict or table — never the password.
4. Name **salt** as something modern password hashes **include** (you do not invent a salt scheme today).
5. Write a register/login pair of functions that return generic errors (no “email not found” vs “wrong password” split **yet** — you will discuss enumeration on Day 5).
6. Grep your lab: the password string must not appear in logs.

**Today's gate.** Closed-book:

> I store a slow password hash, not the password. Verification uses the library compare. I cannot get the password back from the hash. Logs and git never contain the password. Reset is a future token, not decryption.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 50 | Theory |
| B | 65 | Type-along: hash + verify + tiny store |
| C | 50 | Independent: FastAPI register/login JSON, no JWT yet |
| D | 20 | Git + secret hygiene |
| E | 15 | Recall |

---

# Block A — Theory

## 1. Why this is Week 1 of security

If you keep passwords as text, a stolen backup is a stolen identity **and** a stolen identity on every other site where that person reused the password. You do not control reuse. You control **your** store.

A **hash** maps input to a fixed-size string that is not designed to be reversed. Password hashes are **slow** on purpose so guessing many passwords is expensive. `sha256` of a password is the wrong tool: it is fast, and people have tables of common passwords hashed that way. Use **argon2id** or **bcrypt**.

## 2. Salt, in one honest paragraph

If two users pick the same password, a naive hash would look the same in the database. That helps an attacker who stole the hash file. A **salt** is extra random data mixed in so the stored values differ. Modern password hashing APIs **generate and store the salt inside the hash string**. You call `hash()` and `verify()`. You do not concatenate salts by hand in this course.

## 3. Verify

Never write `if hash(password) == stored` with a fast hash you invented. Use the library’s `verify(password, stored_hash)`. That function knows the algorithm parameters embedded in the stored string.

## 4. What you log

Log: user id after success, “login failed” without the password, request id (Month 11).

Do not log: password, Authorization header, cookie values, reset tokens.

**Wrong belief:** “Debug mode is private on my laptop, so printing the body is fine.”  
**Correct:** debug prints get copied into tickets. Treat the lab like a habit you will keep.

## 5. What today is not

Today is **not** OAuth, not JWT, not 2FA. A dict of `{email: hash}` is enough to learn hashing. Day 2 puts a **session id** in a cookie. Month 12’s UI can wait until you have something safe to cookie.

---

# Block B — Type-along

## B1. Project

```powershell
mkdir ~\fullstack-lab\month-13\week-01\day-01 -Force
cd ~\fullstack-lab\month-13\week-01\day-01
uv init --name m13d01
uv add argon2-cffi
```

## B2. `passwords.py`

Use a password you will **never** reuse on a real site. Example below uses `lab-only-pass` — type it; do not replace it with a real password of yours.

```python
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

hasher = PasswordHasher()


def hash_password(plain: str) -> str:
    return hasher.hash(plain)


def verify_password(plain: str, stored: str) -> bool:
    try:
        return hasher.verify(stored, plain)
    except VerifyMismatchError:
        return False
```

## B3. `demo.py`

```python
from passwords import hash_password, verify_password

stored = hash_password("lab-only-pass")
print("hash starts with:", stored[:20])
print("ok password:", verify_password("lab-only-pass", stored))
print("wrong password:", verify_password("nope", stored))
```

```powershell
uv run python demo.py
```

You should see a hash that is **not** `lab-only-pass`, `True`, then `False`.

Hash the same password a second time. The strings **differ** (salt). Both still verify. Write that in `NOTES.md`.

## B4. Tiny store

`store.py`:

```python
from passwords import hash_password, verify_password

USERS: dict[str, str] = {}


def register(email: str, password: str) -> None:
    if email in USERS:
        raise ValueError("could not register")
    USERS[email] = hash_password(password)


def login(email: str, password: str) -> bool:
    stored = USERS.get(email)
    if stored is None:
        return False
    return verify_password(password, stored)
```

Register Ada. Login with the right password. Login with the wrong password. Print `USERS` and confirm it contains **hashes**, not `lab-only-pass`.

---

# Block C — Independent

Add FastAPI (`uv add fastapi uvicorn`). Two routes:

- `POST /register` body `{email, password}` → 201, body `{email}` **without** password or hash.
- `POST /login` → 200 `{ok: true}` or 401 `{detail: "invalid credentials"}` for **both** unknown email and wrong password.

Use `curl.exe` with JSON. Do not put the password on a command line you will screenshot into git. A local file `body.json` that is **gitignored** is safer than a shell history you later paste.

Write `HYGIENE.md`: how you avoided logging the password; that hashes are not returned in JSON.

Do **not** add JWT. Do **not** add cookies yet.

---

# Block D — Git

```powershell
cd ~\fullstack-lab
git add month-13/week-01/day-01
git commit -m "Month 13 Week 1 Day 1: argon2 hash and verify."
```

Search the commit diff for `lab-only-pass` inside source that will be pushed. Demo scripts that hash a **fictional** lab password are OK. Real passwords are not.

---

# Block E — Recall

1. Hash vs encryption.  
2. Why sha256(password) is the wrong store.  
3. Why two hashes of one password differ and both verify.  
4. What login JSON must never include.  
5. Why forgot-password cannot “look up” the password.

## Office hours

**`argon2` install fails on Windows.** Use the wheel from pip via `uv add argon2-cffi`. If a compiler error appears, you are missing a build path — `uv` should prefer wheels. bcrypt is the backup: `uv add bcrypt`, still a real password hash.

**Verify always false.** You swapped argument order. Argon2’s `verify(stored, plain)` — match the library. In the wrapper above, `hasher.verify(stored, plain)` follows argon2-cffi.

---

## Definition of done

- [ ] Hash and verify run locally  
- [ ] Store holds hashes only  
- [ ] Independent HTTP register/login without leaking secrets in responses  
- [ ] Commit exists  

---

## Tomorrow

Session ids and cookies: a random unguessable id, stored server-side, sent as **HttpOnly** cookie. JWT is a trade-off you will **name**, not a default.

---

## Optional review links

Password hashing is explained in this chapter. These pages are for later checking, not for first learning.

- [OWASP: Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [argon2-cffi documentation](https://argon2-cffi.readthedocs.io/)
- [passlib](https://passlib.readthedocs.io/en/stable/) (same algorithms; `.hash` / `.verify` names)

---

# Lecture: timing-safe compare is a library property

**Naive `==` on secrets** can, in some languages, stop at the first differing character. In principle, an unauthorized person who can measure **many** responses very precisely might **try** to learn about a secret from tiny time differences. That is a **class of bug**, not a lab you will run and not a timing experiment you will build.

**What prevents it:** you do **not** write a character-by-character loop. You call **`verify`** on **argon2-cffi** or **passlib**. Those implementations are the compare. Python’s `hmac.compare_digest` is the helper if you must compare two **high-entropy** byte strings (for example two hashes of a **random reset token** next week). You still do not invent a loop “for security.”

**Wrong belief:** “I’ll write my own constant-time compare to be thorough.”  
**Correct:** you will get it wrong. Call the library.

**Wrong belief:** “`if candidate == stored_hash` is fine because hashes are long.”  
**Correct:** `verify` is the API. The stored string encodes algorithm parameters. Equality of two strings is not “this password is right.”

Write `COMPARE.txt` in the lab: one paragraph — verify is the compare; timing-safe is a property you **buy**, not a demo you plot.

---

# Lecture: passlib and argon2-cffi are both allowed

This course allows:

- **`argon2-cffi`:** `PasswordHasher().hash` / `.verify` (today’s type-along).  
- **`passlib[argon2]`:** `from passlib.hash import argon2` then `.hash` / `.verify`.  
- **bcrypt** via passlib or `bcrypt` if argon2 cannot install **today**. Write `ALGO.txt`.

Prefer **argon2**. Defaults beat a blog’s “rounds = 4.” You may lower cost **only** in tests, with a **separate** hasher object that never becomes production settings.

**Pepper** (optional literacy): a server-side secret mixed in, kept in config not in the table. Not required today. Not a substitute for argon2.

**Length policy:** minimum you can defend (this course: **at least 10** for new apps unless you write a reason). **Maximum** so a huge body cannot become a denial-of-service on the hasher (cap at 128 or 256 **before** hash). Do not `.lower()` passwords. Emails might be case-folded; passwords are **not**. Empty password: reject at validation; do not hash empty.

**bcrypt 72-byte limit:** know it exists if you chose bcrypt. Another reason argon2 is nicer.

---

# What an unauthorized person might try — and what stops it

If a dump ever leaves your control, they might **try** to recover passwords from a `password` column. **What prevents it:** there is **no** password column — only `password_hash`. They might then **try** many guesses against those hashes. **What slows that:** argon2/bcrypt (slow on purpose) plus a **unique salt per hash** so one guessed word does not unlock every row that used the same word.

They might **try** to read passwords from logs, `/docs` examples, or a JSON body that echoed register. **What prevents it:** never log them; never put them on Out models; never commit secrets.

They might **try** to compare with homemade `==`. **What prevents it:** library `verify`.

This chapter does **not** walk through stealing a dump or guessing. Defense is the job.

---

# Worked session — hashes, not the product

`uv init` in `~\fullstack-lab\month-13\week-01\day-01`. `uv add argon2-cffi` (or passlib). `hash_password` / `verify_password`. Two hashes of the same lab password **differ**; both verify. Print the store; confirm the plaintext is **not** a substring of the stored value.

FastAPI optional: `POST /register` 201 `{email}` only; `POST /login` 401 generic. Bind `127.0.0.1`. **`curl.exe`** with `--data-binary @body.json`. Gitignore `body.json` if it contains even a lab password you might reuse by accident — today’s lab password must be **fictional**.

```powershell
uv run uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Do not add JWT. Do not add Google login. Do not store the hash in a cookie (Day 2: a **session id** is a different object).

**UserOut:** `id`, `email`. Storage may have `password_hash`. `response_model` is the seatbelt (Month 9). Leak = omitted Out.

**Exceptions:** `verify` on a corrupted stored string may raise. Catch and treat as **login failure**, not 500 with a traceback in the body.

---

# Closing lecture — storage is the first lock

Plaintext in a column is a disaster waiting for a dump.
Encoding is not hashing. Encryption for “email them their password”
is a product that should not exist. Reset is Week 2.

argon2 or bcrypt through a library. Salt is already in the string.
You do not invent a salt loop today. You do not invent a compare loop.
`verify` is the API. Timing-safe is a library property.

Never log passwords, reset tokens, or session ids.
Never put hashes on UserOut. Never put hashes in Vite.
SHA-256 is a checksum tool, not a password tool.

This lab is `~\fullstack-lab\month-13\week-01\day-01\`.
Project 7 remains yours. Notes, not a paste.

Bind 127.0.0.1 if you add HTTP. `curl.exe` if you add HTTP.
Windows: PowerShell quoting is hostile; a JSON file is kinder.

If two hashes of the same password are equal, you are not using
the password library. If verify is `==`, rewrite it.

---

## Recite-back checklist (close the editor, then tick)

Write `RECITE.txt` with one honest sentence per line.
If a line is mush, re-read the matching section in **this** file only.

- [ ] Hash is one-way; encryption is not the password tool  
- [ ] Salt is inside argon2/bcrypt stored strings  
- [ ] argon2-cffi or passlib hash + verify  
- [ ] No homemade timing compare  
- [ ] No plaintext column  
- [ ] No secrets in logs  
- [ ] UserOut omits hash  
- [ ] Lab is not the product dump  

If `login` returns 200 with `ok: false`, that is a **status** bug. Use **401**.
If register JSON includes `password` or `password_hash`, that is a leak.
If you logged the request body on `/login`, delete the log line before you commit.

**Windows:** `curl.exe`, not the `curl` alias. Bind `127.0.0.1`. JSON via `--data-binary @body.json`.

The hash is not a session. Day 2’s session id is a **random handle**. Do not put the hash in a cookie.


**Dummy verify (preview of Day 5):** when the email is missing, you may still call `verify` against a **startup dummy hash** so the missing-user path is not obviously faster than the known-user path. Then return the same 401. You will test **equal bodies** on Day 5. Do not `time.sleep` only on one branch.

**Git:** do not commit `.env`. Do not commit a production dump of `USERS`. The lab dict is RAM.

**Project 7 note (not a dump):** `PROJECT7-HASH.md` — which column holds the hash, which Out model omits it, which library you will call.

If argon2-cffi cannot install, bcrypt is acceptable **today** with `ALGO.txt`. Prefer argon2 when both work. Do not MD5 it twice. Do not Base64 the password. Do not AES the password with a key in `.env` so you can “email it back.”



