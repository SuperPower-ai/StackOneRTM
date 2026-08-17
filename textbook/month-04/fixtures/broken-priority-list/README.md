# Broken Priority List (Month 4 gate fixture)

This is a small **priority task list**. It is supposed to let a user:

- add a task with a title and priority 1 / 2 / 3
- mark a task done
- filter by priority
- sort by priority
- clear completed tasks
- see how many tasks are still open
- keep data after refresh

It is **not finished correctly**. Your job is to make the behavior match the list below, with **tests that stay red until the bug is gone**.

This folder is a **starting snapshot**. Copy it into your lab or a new repo. Submit the fix on a **branch** and open a **pull request** (Week 4 Days 4–7).

There is no answer key in the textbook.

---

## How to run

Serve this folder over HTTP (same habit as Months 2–3). Open `index.html`.

```powershell
# from this folder, if you have Node:
npx --yes serve -p 5500
```

Then open `http://127.0.0.1:5500`.

Tests (some pass today even though the UI is wrong):

```powershell
npm test
```

---

## What users report (reproduce these)

Work from **symptoms**. Do not assume a single cause.

1. **Priority filter is empty.** Choose “Priority 1” when you already added priority-1 tasks. The list often goes blank. “All” still shows them.
2. **Sort destroys order.** Click **Sort by priority**, then **All**. The add-order is gone; there is no way to get it back except refresh (and refresh keeps the sorted order).
3. **Clear completed is backwards.** Complete one task, click **Clear completed**. The **unfinished** tasks disappear, or the completed ones stay — the control does not do what its label says.
4. **Done does not toggle the row you clicked.** With two or more tasks, clicking **Done** on a row either errors in the console, does nothing useful, or changes a different row than the one you clicked.
5. **Open count is wrong or crashes.** The header control **Refresh count** should show how many tasks are not done. Clicking it shows `0`, a blank, or an error in the console instead of the real number.
6. **Garbage in storage kills the page.** In DevTools → Application → Local Storage, set `priority-list` to `NOT_JSON` and reload. The page should recover with an empty list, not a white screen.
7. **Markup in titles.** Add a title exactly `wait <b>now</b>`. The word “now” should appear as **plain text** including the letters `<b>`, not bold.

If you cannot reproduce one item, write that in `DEBUG.md` with what you tried. Do not skip it silently.

---

## Definition of done (gate)

- Every symptom above is fixed **or** you filed why it was already false on your machine (unlikely if you copied this folder).
- `npm test` includes **regression** tests that failed before the fix for at least three of the logic bugs (filter, sort mutation, clear completed, parse). UI/delegation bugs are proven with a breakpoint write-up if a unit test cannot reach the DOM.
- ESLint / Prettier not required **inside this fixture** until you add them; your PR body still says how you ran tests.
- Pull request against `main` with a real description (symptom → cause → test).
