# Month 14 · Week 3 · Day 7
# Week Review — RTL and MSW

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 4 — Full-stack application  
**Month index:** [../../README.md](../../README.md)  
**Week 3:** [1](day-01.md) · [2](day-02.md) · [3](day-03.md) · [4](day-04.md) · [5](day-05.md) · [6](day-06.md) · Day 7 (today)  
**Week rhythm today:** Review  
**Study time:** 3–4 focused hours

Work in `~\fullstack-lab\month-14\week-03\day-07\`.

---

## Week synthesis

**RTL:** test what the user can see and do. `getByRole`, `getByLabelText`, `getByText`. Avoid `container.querySelector('.list-item')`.

**MSW:** intercepts `fetch` in tests with handlers. The component uses the real client. You change the **network story**, not the internals.

**States:** loading, empty, error, data. All four are product. Accessibility: `role="alert"` for errors; names on buttons; jest-axe or similar is a flashlight, not a full audit.

**Wrong belief:** “MSW is a mock of useQuery.”  
**Correct:** MSW is HTTP. Query still runs.

---

## Mini-exam

Tiny React list + `api.ts` + MSW: three tests (data, empty, error). You write the component; this file does not paste Project 7.

---

## Retro

Week 4: Playwright one journey, lint/format, coverage honesty, **break a feature** gate.

---

## Definition of done

- [ ] Mini tests green  
- [ ] Commit  

---

## Optional review links

This synthesis is the lesson. These pages are for later checking, not for first learning.

- [MSW](https://mswjs.io/docs/)
