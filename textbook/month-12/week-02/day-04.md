# Month 12 · Week 2 · Day 4
# Lab: Detail + Edit; Optimistic Updates — When Not To

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 4 — Full-stack application  
**Month index:** [../../README.md](../../README.md)  
**Week 2:** [1](day-01.md) · [2](day-02.md) · [3](day-03.md) · Day 4 (today) · [5](day-05.md) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Learn + lab feature  
**Student state:** You can paginate a list. Today **one row** has a detail screen and an **edit**. You will hear **optimistic UI** and you will **name a risk** before you use it.  
**Study time:** 3–4 focused hours

**Week nav fix:** Day 5 is [day-05.md](day-05.md).

Labs: `~\fullstack-lab\month-12\week-02\day-04\`. Noun: **lockers** (`id`, `code`, `label`). Not Project 7.

---

## How to use this textbook

1. Read a section. Close it. Say the risk out loud.
2. Type detail + edit with **invalidate** first. Optimistic is an experiment you may skip if you write the risk clearly.
3. Optional review links are for later rechecking.

---

## How to read this chapter

List keys are collections. Detail is **another key**: `["lockers", id]`. Edit is a **mutation**. After PATCH 200, invalidate the detail key **and** the list prefix.

**Optimistic** means: update the cache **before** the server agrees, then rollback if it fails. That is a **bet**.

```mermaid
flowchart TB
  EDIT[Save] --> OPT{Optimistic?}
  OPT -->|yes| SET[setQueryData now]
  SET --> PATCH[PATCH server]
  PATCH --> OK[keep]
  PATCH --> FAIL[rollback]
  OPT -->|no| PATCH2[PATCH first]
  PATCH2 --> INV[invalidateQueries]
```

**Wrong belief:** “Optimistic is how professional apps always edit.”  
**Correct:** professional apps **name the lie**. If GET will not match what you painted, you taught the user a ghost.

---

## Today's contract

By the end of this day you will be able to:

1. Route `/lockers/:id` with React Router (`useParams` from `"react-router"`).
2. `useQuery({ queryKey: ["lockers", id], queryFn, enabled: !!id })`.
3. Edit with `useMutation` + **`invalidateQueries({ queryKey: ["lockers", id] })`** and prefix `["lockers"]`.
4. Narrow `id` from `string | undefined` — **no `as string`**.
5. Write **`RISK.md`**: when you must **not** be optimistic, with a **named risk**.
6. Optionally implement optimistic **once**, with rollback on error.

**Today's gate.** Closed-book:

> Detail has id in the key. Edit invalidates detail and list. Optimistic UI is a bet. I can name a risk that makes that bet dishonest. isPending on the detail query is first load of that id.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 50 | Theory |
| B | 60 | Detail + pessimistic edit |
| C | 70 | RISK.md + optional optimistic with rollback |
| D | 20 | Git |
| E | 15 | Recall |

---

# Block A — Theory

## 1. Detail key

```tsx
const { id } = useParams();
const lockerId = id !== undefined && /^\d+$/.test(id) ? Number(id) : undefined;

const detail = useQuery({
  queryKey: ["lockers", lockerId],
  queryFn: () => api.getLocker(lockerId!),
  enabled: lockerId !== undefined,
});
```

Prefer parsing without `!` if you can: `queryFn` only runs when `enabled` is true, but TypeScript may still want a narrowed number. A small helper `function requireId(id: number | undefined): number` that throws is better than `as string`.

**Wrong belief:** “`["lockers"]` is enough; I’ll find the row in the list cache.”  
**Correct:** page 2’s cache may not include this id. Detail **GET** is the source of truth.

---

## 2. Pessimistic edit (course default)

```tsx
const queryClient = useQueryClient();
const save = useMutation({
  mutationFn: (input: LockerPatchDto) => api.patchLocker(lockerId, input),
  onSuccess: () => {
    void queryClient.invalidateQueries({ queryKey: ["lockers", lockerId] });
    void queryClient.invalidateQueries({ queryKey: ["lockers"] });
  },
});
```

Wait for 200. Then refetch. The UI can show mutation `isPending` on Save. The user sees old values until success. That is **honest**.

PATCH on FastAPI: Pydantic model + **`model_dump(exclude_unset=True)`** so omitted fields stay. Missing id: `HTTPException` 404.

---

## 3. Optimistic pattern (know it)

```tsx
useMutation({
  mutationFn: (input: LockerPatchDto) => api.patchLocker(lockerId, input),
  onMutate: async (input) => {
    await queryClient.cancelQueries({ queryKey: ["lockers", lockerId] });
    const previous = queryClient.getQueryData(["lockers", lockerId]);
    queryClient.setQueryData(["lockers", lockerId], (old) => /* merge input */);
    return { previous };
  },
  onError: (_err, _input, ctx) => {
    if (ctx?.previous !== undefined) {
      queryClient.setQueryData(["lockers", lockerId], ctx.previous);
    }
  },
  onSettled: () => {
    void queryClient.invalidateQueries({ queryKey: ["lockers", lockerId] });
  },
});
```

This is the shape. You must still **throw** in `mutationFn` on !ok or `onError` never runs.

---

## 4. When NOT to be optimistic (you must name the risk)

Write these in `RISK.md`. Pick **at least one** as your “I will not optimistic this” case:

| Situation | Named risk |
|---|---|
| **Server assigns fields** (normalized `code`, timestamps, unique suffix) | You paint a `code` the GET will replace. User copies the wrong code. |
| **Unique constraint 409** | Two lockers cannot share `code`. Optimistic list shows a duplicate that **snaps away**. User thinks they saved. |
| **Authorization / ownership** (Week 4 / Month 13) | You show an edit that **403** will refuse. Ghost success. |
| **Multipart upload** (Week 3) | You cannot fake a stored path or size before the server writes the file. |
| **Create with client-made ids** | Fake negative ids collide with Query keys; GET `/lockers/-1` 422/404. **Risk: phantom id.** |
| **Money, inventory counts, anything two users edit** | Last-write-wins plus optimism **hides** the other user’s value until rollback. **Risk: lost update you already hid.** |

**Wrong belief:** “Rollback makes optimistic safe.”  
**Correct:** rollback fixes the cache. It does not un-send an email, un-charge a card, or un-confuse a user who already left the page. If rollback is not enough, **do not** paint success first.

**This course’s default for locker `code` uniqueness: do not optimistic the `code` field.** Invalidate after PATCH.

You may optimistic a **label** (cosmetic string) if you implement rollback and still invalidate on settled. Write that choice.

---

## 5. Router

```powershell
npm install react-router
```

```tsx
import { Route, Routes, useParams, Link } from "react-router";
```

List links to `/lockers/1`. Unknown id: query `isError` from 404 `ApiError`.

---

## 6. Security start

- Path id wins over body id.
- Do not `as any` the PATCH body.
- 409 vs 422: unique vs schema (Month 9). Show a toast or field error — tests tomorrow.

---

# Block B — Type-along

```powershell
cd ~\fullstack-lab
mkdir month-12\week-02\day-04 -Force
cd ~\fullstack-lab\month-12\week-02\day-04
```

Stub: CRUD-enough GET list, GET one, PATCH, unique `code` 409. CORS 5173. `model_dump(exclude_unset=True)` on patch.

Vite: list, detail, edit form. Pessimistic invalidate. `enabled` when id parsed.

Write `NETWORK.txt`: GET detail, PATCH, GET detail again.

---

# Block C — Independent

1. `RISK.md`: at least **one** named risk from the table, in your words, tied to **this** noun.  
2. Optional: optimistic **label** with rollback; keep `code` pessimistic.  
3. 404 detail UI.  
4. No `as string` on params without narrowing.

```powershell
cd ~\fullstack-lab
git add month-12
git commit -m "Month 12 Week 2 Day 4: locker detail edit and optimistic risk."
```

---

# Block E — Recall

1. Why detail is a separate key.  
2. `exclude_unset` on PATCH.  
3. A named risk against optimistic create ids.  
4. Why `onError` needs a thrown `ApiError`.  
5. Prefix vs id invalidation.

---

## Office hours — defects you will hit

**`enabled: true` with `id` undefined.** `getLocker(undefined)` → `/lockers/undefined`. Parse first.

**Optimistic without `cancelQueries`.** In-flight GET overwrites your optimistic data. Cancel, then set.

**409 optimistic duplicate.** The named risk. Remove optimism on `code`.

**Invalidated only `["lockers", id]`.** List still shows old label. Prefix too.

```mermaid
sequenceDiagram
  participant E as Edit
  participant M as mutation
  participant C as cache
  participant A as API
  E->>M: save label
  M->>A: PATCH
  A-->>M: 200
  M->>C: invalidate detail + list
```

---

## Definition of done

- [ ] Detail `useQuery` with id in key  
- [ ] Edit mutation + invalidate  
- [ ] `RISK.md` names when **not** to be optimistic  
- [ ] Id narrowed without reckless `as`  
- [ ] Commit exists  

---

## Optional review links

- [Optimistic updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)
- [FastAPI PATCH exclude unset](https://fastapi.tiangolo.com/tutorial/body-updates/)

---

## Tomorrow

**Tests:** mutation **failure** rollback and/or error toast. Prove `onError` is not a comment.

---

# Worked session — pessimistic first

Routes. `getLocker`. PATCH `model_dump(exclude_unset=True)`. Unique code 409. Invalidate two keys.

`RISK.md` title: “Phantom id” or “409 snap-back” or “lost update”. One paragraph.

Optimistic only on a cosmetic field, with rollback, if time.

`useParams` from `"react-router"`. Vite extra `--`. CORS 5173. No Project 7 dump.

---

# Closing lecture — honesty is a product feature

Invalidate after edit is slower by one GET. Users see saved data that GET agrees with.

Optimistic is a bet that the server will echo your paint. Unique fields, server-normalized fields, auth, files, money, and fake ids are **named risks**. Rollback is cache hygiene, not time travel.

Detail key includes id. List prefix still matters. `enabled` guards undefined ids.

v5 object API. `isPending` on detail first load. Mutation `isPending` on Save. `gcTime` not `cacheTime`.
