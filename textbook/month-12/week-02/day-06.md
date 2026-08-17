# Month 12 · Week 2 · Day 6
# Independent: Filter and Search on Your Domain

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 4 — Full-stack application  
**Month index:** [../../README.md](../../README.md)  
**Week 2:** [1](day-01.md) · [2](day-02.md) · [3](day-03.md) · [4](day-04.md) · [5](day-05.md) · Day 6 (today) · [7](day-07.md)  
**Week rhythm today:** Independent implementation  
**Student state:** Labs paginate and mutate. Today **your** list gains **filter and search** with URL + queryKey.  
**Study time:** 3–4 focused hours

This textbook will **not** give you product source. Spec envelope + forbidden list only.

Notes: `~\fullstack-lab\month-12\week-02\day-06\`. Code in **your** API and web repos.

---

## How to use this textbook

1. Envelope first.  
2. Type the join.  
3. Tests part of the day.  
4. Optional links later.

---

## How to read this chapter

Week 2’s independent skill is not “I paginated ferry tickets.” It is “**my** noun slices on the server, and the address bar matches the cache key.”

```mermaid
flowchart TB
  E[CONTRACT.md] --> API["query params on FastAPI"]
  E --> URL["search params on React Router"]
  E --> KEY["queryKey resource q page filter"]
```

**Wrong belief:** “I’ll filter in React with `.filter` on the full GET.”  
**Correct:** that is a demo. Your 6B/Project 7 list should **query Postgres** (or your store) with the same params.

**Wrong belief:** “I’ll skip the URL and only use Query keys.”  
**Correct:** refresh and shareable links fail. Both.

---

## Today's contract

By the end of this day you will be able to:

1. Document `q`, one **filter**, and **page** (or skip/limit).  
2. Implement them on **your** GET list (SQLAlchemy filters if 6B).  
3. Wire UI: committed search, filter control, pagination.  
4. `queryKey: ["noun", { q, filter, page }]`.  
5. `placeholderData: keepPreviousData`.  
6. Changing search/filter resets page.  
7. Invalidate prefix after an existing create if you have one.

**Today's gate.** Closed-book:

> My list params exist in CONTRACT, URL, queryKey, and SQL/API together. keepPreviousData is the page-change trick. I did not slice a dump in the browser as the product behavior.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 25 | CONTRACT.md |
| B | 40 | Failing test (API or UI) |
| C | 90 | Implement |
| D | 30 | curl.exe + refresh URL |
| E | 15 | Recall |

---

# Block A — Envelope

`~\fullstack-lab\month-12\week-02\day-06\CONTRACT.md`:

- Repo paths  
- Param names and types  
- Envelope fields including **total** (filtered total)  
- Sort whitelist if any  
- Example URLs  
- queryKey examples  
- CORS 5173  
- What happens on empty page  

**Forbidden:** todo list; copying lab “archive cards” into ops-web. **Allowed:** lab fallback only with `BLOCKED.md`.

---

# Complete explanation (Days 1–5 closed except this recap)

**Query v5.** Object `useQuery` / `useMutation`. `invalidateQueries({ queryKey: ["noun"] })`. `isPending` first load. `placeholderData: keepPreviousData`. `gcTime` not `cacheTime`.

**URL.** `useSearchParams` from `"react-router"`. Commit `q`. Reset page.

**API.** Filter → search → sort whitelist → total → slice. Empty 200. Cap limit. Pydantic Out `model_dump()`. Never string-build SQL.

**Client.** `URLSearchParams`. No fetch in pages. `VITE_API_BASE`.

**Optimistic.** Not required today. If you edit, remember Day 4 risks.

**Windows.** `curl.exe` with quoted query URLs.

```mermaid
sequenceDiagram
  participant B as Browser
  participant Q as useQuery
  participant A as FastAPI
  participant P as Postgres
  B->>Q: ?q=acme&page=2
  Q->>A: GET same params
  A->>P: WHERE + LIMIT
  P-->>A: rows + count
  A-->>Q: envelope
```

---

# Block B — Red first

TestClient: two rows, `q` matches one, `total === 1`. **Or** RTL: set URL, see one title.

Save `RED.txt`.

---

# Block C — Implement

API query params. Indexes later; correctness today. UI controls. `keepPreviousData`. Prefix invalidate if create exists.

Do not add uploads (Week 3). Do not add auth product (Week 4).

---

# Block D — Manual

```powershell
curl.exe -s "http://127.0.0.1:8000/YOUR?q=test&page=1&limit=10"
```

Refresh `http://127.0.0.1:5173/...?q=test&page=2`. Write `EVIDENCE.md`.

---

# Block E — Recall

1. Why total is filtered.  
2. Why page is in the key.  
3. Prefix invalidate.  
4. Named optimistic risk (one sentence).

## Quality bar

A classmate can implement from CONTRACT.md without Slack. Params named. 200 empty. `keepPreviousData` mentioned.

If you only added a client-side filter, the day is **not** done unless `BLOCKED.md` says the API cannot change yet — then the **lab** must still server-filter.

---

```powershell
cd ~\fullstack-lab
git add month-12\week-02\day-06
git commit -m "Month 12 Day 6: filter search envelope and evidence."
```

Product repos: separate commits.

---

## Definition of done

- [ ] CONTRACT first  
- [ ] Server-side filter/search/page  
- [ ] URL + queryKey  
- [ ] `placeholderData: keepPreviousData`  
- [ ] Evidence + one test  
- [ ] No `*` CORS  

---

## Optional review links

Week 2 Days 1–5 in this textbook.

---

## Tomorrow

**Week 2 review.** Mini-build. Debug. Retro. Then Week 3 uploads and dual validation.
