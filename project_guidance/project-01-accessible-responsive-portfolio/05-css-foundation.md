# Project 1 · Step 5
# CSS Foundation: Tokens, Reset, Header, Hero

**Workshop:** [Project 1](README.md) · [Step 4](04-html.md)  
**Textbook repair:** Month 2 Week 3 (cascade, box model)  
**Time:** 2–3 hours

Paint starts with **custom properties** (tokens). If a color appears twelve times as a magic hex, you cannot theme it. Tokens are how 2026 CSS stays calm.

Create `css/styles.css`. Type **this entire chapter’s CSS**. Step 6 appends layout.

---

## How to read a token

`--paper` is the page. `--ink` is text. `--accent` is the only loud color. `color-mix` and `html:has(#color-mode:checked)` are modern, well-supported, and they keep dark mode **in CSS** — no JavaScript.

**Wrong belief:** “Dark mode needs React.”  
**Correct:** a labeled checkbox plus `:has()` is enough for this site.

---

## Type this file

```css
:root {
  --paper: #f6f3ec;
  --paper-2: #ece6d9;
  --ink: #1a1814;
  --ink-soft: #3c3832;
  --muted: #5f584e;
  --line: rgba(26, 24, 20, 0.14);
  --line-strong: rgba(26, 24, 20, 0.22);
  --accent: #1e4fd7;
  --accent-ink: #163aa3;
  --accent-soft: rgba(30, 79, 215, 0.12);
  --ok: #0f6b4c;
  --shadow: 0 22px 50px rgba(26, 24, 20, 0.08);
  --sans: "Figtree", "Segoe UI", system-ui, sans-serif;
  --serif: "Fraunces", Georgia, serif;
  --radius: 1.15rem;
  --header: 4.35rem;
  --measure: 40rem;
  color-scheme: light;
}

html:has(#color-mode:checked) {
  --paper: #131210;
  --paper-2: #1c1a17;
  --ink: #f4efe6;
  --ink-soft: #d8d1c4;
  --muted: #a3998c;
  --line: rgba(244, 239, 230, 0.12);
  --line-strong: rgba(244, 239, 230, 0.2);
  --accent: #7aa3ff;
  --accent-ink: #c5d6ff;
  --accent-soft: rgba(122, 163, 255, 0.14);
  --ok: #7dceb3;
  --shadow: 0 22px 50px rgba(0, 0, 0, 0.35);
  color-scheme: dark;
}

@media (prefers-color-scheme: dark) {
  html:not(:has(#color-mode:checked)) {
    --paper: #131210;
    --paper-2: #1c1a17;
    --ink: #f4efe6;
    --ink-soft: #d8d1c4;
    --muted: #a3998c;
    --line: rgba(244, 239, 230, 0.12);
    --line-strong: rgba(244, 239, 230, 0.2);
    --accent: #7aa3ff;
    --accent-ink: #c5d6ff;
    --accent-soft: rgba(122, 163, 255, 0.14);
    --ok: #7dceb3;
    --shadow: 0 22px 50px rgba(0, 0, 0, 0.35);
    color-scheme: dark;
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: calc(var(--header) + 0.8rem);
}

body {
  margin: 0;
  min-height: 100%;
  background:
    radial-gradient(900px 420px at 8% -10%, var(--accent-soft), transparent 55%),
    var(--paper);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 1.0625rem;
  line-height: 1.55;
}

a {
  color: var(--accent-ink);
  text-underline-offset: 0.16em;
}

a:hover {
  color: var(--accent);
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.skip {
  position: absolute;
  left: 1rem;
  top: -4rem;
  z-index: 80;
  background: var(--ink);
  color: var(--paper);
  padding: 0.55rem 0.8rem;
  border-radius: 0.4rem;
}

.skip:focus {
  top: 0.8rem;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 40;
  min-height: var(--header);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;
  padding: 0.7rem 1.25rem;
  border-bottom: 1px solid var(--line);
  background: color-mix(in srgb, var(--paper) 88%, transparent);
  backdrop-filter: blur(16px);
}

.mark {
  font-family: var(--serif);
  font-weight: 600;
  font-size: 1.15rem;
  letter-spacing: -0.03em;
  text-decoration: none;
  color: inherit;
  margin-right: auto;
}

.nav-toggle {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.nav-toggle-label {
  display: none;
  border: 1px solid var(--ink);
  border-radius: 999px;
  padding: 0.4rem 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.primary-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.35rem;
}

.primary-nav a {
  text-decoration: none;
  color: var(--ink-soft);
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  font-weight: 600;
}

.primary-nav a:hover,
.primary-nav a:focus-visible {
  background: var(--accent-soft);
  color: var(--ink);
}

.theme {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--muted);
  font-size: 0.88rem;
}

.theme input {
  width: 1.05rem;
  height: 1.05rem;
  accent-color: var(--accent);
}

main {
  max-width: 72rem;
  margin: 0 auto;
  padding: 2.4rem 1.25rem 5rem;
}

.hero {
  display: grid;
  gap: 1rem;
  padding: 2.4rem 0 3.2rem;
  max-width: 42rem;
}

.eyebrow {
  margin: 0;
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--accent-ink);
}

.hero h1 {
  margin: 0;
  font-family: var(--serif);
  font-size: clamp(2.5rem, 7vw, 4.4rem);
  line-height: 0.98;
  letter-spacing: -0.04em;
  font-weight: 600;
}

.lede,
.section-lead {
  color: var(--ink-soft);
  font-size: 1.15rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin: 0.4rem 0 0;
}

.btn,
button[type="submit"] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border-radius: 999px;
  padding: 0.78rem 1.15rem;
  font: inherit;
  font-weight: 700;
  border: 1px solid transparent;
  cursor: pointer;
}

.btn-primary,
button[type="submit"] {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 12px 28px color-mix(in srgb, var(--accent) 30%, transparent);
}

.btn-primary:hover,
button[type="submit"]:hover {
  color: #fff;
  filter: brightness(1.06);
}

.btn-ghost {
  border-color: var(--ink);
  color: var(--ink);
  background: var(--paper);
}
```

Refresh. You should see a sticky header, a large `h1`, and two solid buttons. If the primary button’s text turns blue on hover, you missed the `color: #fff` hover rule — that is a cascade lesson, not a broken browser.

```powershell
git add css/styles.css
git commit -m "Add design tokens, header, and hero CSS."
```

---

## Today's gate

> I can explain `--accent`, `:focus-visible`, `clamp()` on the `h1`, and why the skip link sits off-screen until focus. Dark mode is a checkbox, not a library.

Open [06-css-layout.md](06-css-layout.md).
