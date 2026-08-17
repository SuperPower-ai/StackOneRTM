# Project 1 · Step 9
# Complete Reference — Full Codes

**Workshop:** [Project 1](README.md)  
**Folder:** [reference/](reference/)

This chapter is the **assembled answer key**. Use it after you have typed Steps 4–8 into **your** repo.

The teaching identity is **Sam Rivera**. Do not deploy that name as yours.

---

## How to compare

```powershell
cd $HOME\portfolio
```

Open your files beside the exam build in `project_guidance/project-01-accessible-responsive-portfolio/reference/`.

Differences in **name and copy** are required. Differences in **structure** (missing `label`, missing skip link, a `div` used as a button) are defects. Fix defects. Keep your identity.

On the course website, open **Studio → Live preview** to see this reference running.

---

## File tree (complete)

```
reference/
  .gitignore
  README.md
  index.html
  404.html
  css/styles.css
  css/print.css
  assets/favicon.svg
```

Every file below is the complete exam build. Type yours first. Then compare.

---

## `.gitignore`

```
.DS_Store
Thumbs.db
*.log
.vscode/
.idea/
```

---

## `assets/favicon.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Sam Rivera">
  <rect width="64" height="64" rx="16" fill="#f6f3ec"/>
  <path d="M18 46V18h10.5c7.4 0 12.2 4.2 12.2 10.4 0 6.3-4.9 10.5-12.3 10.5H26v7.1H18Zm8-14.6h2.2c3.1 0 5-1.7 5-4.2s-1.9-4.1-5-4.1H26v8.3Z" fill="#1e4fd7"/>
</svg>
```

---

## `index.html` (full)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="description"
      content="Sam Rivera is a junior web maker studying Full-Stack Mastery. Semantic HTML, CSS layout, and accessible interfaces — no framework costume."
    />
    <meta name="theme-color" content="#f6f3ec" />
    <meta name="color-scheme" content="light dark" />
    <title>Sam Rivera — Junior web maker</title>
    <link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Figtree:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="css/styles.css" />
    <link rel="stylesheet" href="css/print.css" media="print" />
  </head>
  <body>
    <a class="skip" href="#main">Skip to content</a>

    <header class="site-header">
      <a class="mark" href="#top">Sam Rivera</a>
      <input id="nav-toggle" class="nav-toggle" type="checkbox" />
      <label class="nav-toggle-label" for="nav-toggle">
        <span class="nav-toggle-text">Menu</span>
      </label>
      <nav class="primary-nav" aria-label="Primary">
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#work">Work</a>
        <a href="#contact">Contact</a>
      </nav>
      <div class="theme">
        <input id="color-mode" type="checkbox" />
        <label for="color-mode">Dark mode</label>
      </div>
    </header>

    <main id="main">
      <section class="hero" id="top" aria-labelledby="hero-title">
        <p class="eyebrow">Junior web maker · Full-Stack Mastery</p>
        <h1 id="hero-title">I build pages a keyboard can finish.</h1>
        <p class="lede">
          Semantic HTML, honest CSS, and layouts that hold at 375 pixels.
          No framework yet — on purpose.
        </p>
        <p class="hero-actions">
          <a class="btn btn-primary" href="#work">View selected work</a>
          <a class="btn btn-ghost" href="#contact">Write to me</a>
        </p>
      </section>

      <section class="about" id="about" aria-labelledby="about-title">
        <div>
          <h2 id="about-title">About</h2>
          <p>
            I am Sam Rivera. I am in Month 2 of an 18-month full-stack program:
            documents, cascade, Flexbox, Grid, and accessibility before any
            component library.
          </p>
          <p>
            I care about names in the accessibility tree, visible focus, and
            CSS I can explain. If I cannot rebuild a layout from a spec, it is
            not mine yet.
          </p>
        </div>
        <aside class="about-card" aria-labelledby="focus-title">
          <h3 id="focus-title">Current focus</h3>
          <ul>
            <li>Semantic structure and heading rank</li>
            <li>Flexbox and Grid as different tools</li>
            <li>Keyboard-first forms</li>
            <li>Mobile-first media queries</li>
          </ul>
          <h3>Interests</h3>
          <p>Readable type, calm color, and CSS that does not fight itself.</p>
        </aside>
      </section>

      <section class="skills" id="skills" aria-labelledby="skills-title">
        <h2 id="skills-title">Skills</h2>
        <p class="section-lead">Grouped by job — not fake percentage bars.</p>
        <div class="skill-grid">
          <article>
            <h3>Markup</h3>
            <ul>
              <li>HTML5 landmarks</li>
              <li>Forms and labels</li>
              <li>Images with useful <code>alt</code></li>
            </ul>
          </article>
          <article>
            <h3>Appearance</h3>
            <ul>
              <li>Cascade and specificity</li>
              <li>Flexbox and Grid</li>
              <li>Custom properties</li>
            </ul>
          </article>
          <article>
            <h3>Practice</h3>
            <ul>
              <li>Keyboard checks</li>
              <li>DevTools box model</li>
              <li>Git history from commit one</li>
            </ul>
          </article>
        </div>
      </section>

      <section class="work" id="work" aria-labelledby="work-title">
        <h2 id="work-title">Selected work</h2>
        <p class="section-lead">Three pieces from the same foundation month. Replace these with your own when you fork this reference.</p>
        <div class="card-grid">
          <article class="card">
            <div class="card-visual" aria-hidden="true">
              <span class="viz viz-a"></span>
            </div>
            <h3>Harbor notes</h3>
            <p>A long-form article layout: heading rank, lists, and a measure you can read.</p>
            <p class="tech">HTML · CSS · typography</p>
            <p class="card-links">
              <a href="https://github.com/example/harbor-notes">Repository</a>
              <a href="https://example.github.io/harbor-notes/">Live demo</a>
            </p>
          </article>
          <article class="card">
            <div class="card-visual" aria-hidden="true">
              <span class="viz viz-b"></span>
            </div>
            <h3>Studio intake</h3>
            <p>An accessible contact pattern: real labels, fieldset groups, visible focus.</p>
            <p class="tech">HTML · forms · keyboard</p>
            <p class="card-links">
              <a href="https://github.com/example/studio-intake">Repository</a>
              <a href="https://example.github.io/studio-intake/">Live demo</a>
            </p>
          </article>
          <article class="card">
            <div class="card-visual" aria-hidden="true">
              <span class="viz viz-c"></span>
            </div>
            <h3>This portfolio</h3>
            <p>The site you are on: responsive, semantic, deployed on HTTPS.</p>
            <p class="tech">HTML · CSS · GitHub Pages</p>
            <p class="card-links">
              <a href="https://github.com/example/sam-rivera">Repository</a>
              <a href="#top">Live demo</a>
            </p>
          </article>
        </div>
      </section>

      <section class="contact" id="contact" aria-labelledby="contact-title">
        <h2 id="contact-title">Contact</h2>
        <p class="section-lead">
          Name, email, and a message. There is no backend this month — the form
          is structured and labeled. Use the email link if you want a real send.
        </p>
        <p class="form-note" role="note">
          Submit does not send mail. It is honest HTML for practice.
          Write to
          <a href="mailto:sam.rivera.example@example.com">sam.rivera.example@example.com</a>
          instead.
        </p>
        <form action="#contact" method="post">
          <p>
            <label for="name">Name</label>
            <input id="name" name="name" type="text" autocomplete="name" required maxlength="80" />
          </p>
          <p>
            <label for="email">Email</label>
            <input id="email" name="email" type="email" autocomplete="email" required maxlength="120" />
          </p>
          <p>
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="6" required maxlength="2000"></textarea>
          </p>
          <p>
            <button type="submit">Send message</button>
          </p>
        </form>
      </section>
    </main>

    <footer class="site-footer">
      <p>© <span class="year">2026</span> Sam Rivera. Typed, not templated.</p>
      <nav aria-label="Profile">
        <a href="https://github.com/example">GitHub</a>
        <a href="https://www.linkedin.com/">LinkedIn</a>
        <a href="mailto:sam.rivera.example@example.com">Email</a>
      </nav>
    </footer>
  </body>
</html>
```

---

## `css/styles.css` (full)

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

img {
  max-width: 100%;
  height: auto;
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

.about,
.skills,
.work,
.contact {
  padding: 2.4rem 0;
  border-top: 1px solid var(--line);
}

.about {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(16rem, 0.8fr);
  gap: 1.4rem;
}

.about-card,
.skill-grid article,
.card {
  background: var(--paper);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  padding: 1.15rem 1.2rem;
  box-shadow: var(--shadow);
}

h2 {
  font-family: var(--serif);
  font-size: clamp(1.7rem, 3vw, 2.2rem);
  letter-spacing: -0.03em;
  margin: 0 0 0.6rem;
}

h3 {
  margin: 0 0 0.45rem;
  font-size: 1.05rem;
}

.skill-grid,
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
}

.card {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  text-decoration: none;
  color: inherit;
}

.card-visual {
  height: 8.5rem;
  border-radius: 0.85rem;
  margin: -0.35rem -0.35rem 0.9rem;
  overflow: hidden;
  background: var(--paper-2);
}

.viz {
  display: block;
  width: 100%;
  height: 100%;
}

.viz-a {
  background:
    linear-gradient(135deg, var(--accent-soft), transparent 55%),
    radial-gradient(circle at 80% 20%, var(--accent), transparent 42%);
}

.viz-b {
  background:
    repeating-linear-gradient(-12deg, transparent, transparent 12px, var(--line) 13px),
    linear-gradient(180deg, var(--accent-soft), var(--paper-2));
}

.viz-c {
  background:
    linear-gradient(90deg, var(--ink) 0 28%, transparent 28%),
    linear-gradient(var(--accent-soft), var(--paper));
}

.tech,
.card-links {
  margin-top: auto;
  font-size: 0.88rem;
}

.card-links a {
  overflow-wrap: anywhere;
}

form {
  display: grid;
  gap: 0.85rem;
  max-width: 34rem;
}

form p {
  margin: 0;
  display: grid;
  gap: 0.35rem;
}

label {
  font-weight: 700;
}

input,
textarea {
  font: inherit;
  color: inherit;
  background: var(--paper);
  border: 1px solid var(--line-strong);
  border-radius: 0.8rem;
  padding: 0.7rem 0.8rem;
}

.form-note {
  padding: 0.8rem 0.95rem;
  border-left: 3px solid var(--accent);
  background: var(--accent-soft);
  border-radius: 0 0.7rem 0.7rem 0;
  max-width: 40rem;
}

.site-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.8rem;
  padding: 1.4rem 1.25rem 2.2rem;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.92rem;
}

.site-footer nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
}

@media (max-width: 860px) {
  .about,
  .skill-grid,
  .card-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .nav-toggle-label {
    display: inline-flex;
  }

  .primary-nav {
    display: none;
    width: 100%;
    flex-direction: column;
    order: 5;
  }

  .nav-toggle:focus-visible + .nav-toggle-label {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
  }

  .nav-toggle:checked ~ .primary-nav {
    display: flex;
  }

  .hero-actions .btn,
  button[type="submit"] {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    transition: none !important;
    animation: none !important;
  }
}
```

---

## `css/print.css` (full)

```css
@media print {
  :root {
    --paper: #fff;
    --ink: #111;
    --muted: #333;
    --accent: #000;
  }

  body {
    background: #fff;
    color: #111;
    font-size: 12pt;
  }

  .skip,
  .theme,
  .hero-actions,
  .form-note,
  .nav-toggle-label {
    display: none !important;
  }

  a[href^="http"]::after {
    content: " (" attr(href) ")";
    font-size: 0.85em;
    color: #333;
  }

  .hero,
  .about,
  .skills,
  .work,
  .contact {
    break-inside: avoid;
  }

  .site-header {
    position: static;
    border: 0;
  }
}
```

---

## `404.html` (full)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Page not found — Sam Rivera</title>
    <link rel="stylesheet" href="css/styles.css" />
  </head>
  <body>
    <a class="skip" href="#main">Skip to content</a>
    <header class="site-header">
      <a class="mark" href="index.html">Sam Rivera</a>
      <nav class="primary-nav" aria-label="Primary">
        <a href="index.html#about">About</a>
        <a href="index.html#work">Work</a>
        <a href="index.html#contact">Contact</a>
      </nav>
    </header>
    <main id="main" class="hero">
      <p class="eyebrow">404</p>
      <h1>This page is not on the site.</h1>
      <p class="lede">The URL may be mistyped. The home page still is.</p>
      <p class="hero-actions">
        <a class="btn btn-primary" href="index.html">Return home</a>
      </p>
    </main>
  </body>
</html>
```

---

## `README.md` (Sam’s example README)

Yours must be about **you**. This is only the example.

````markdown
# Sam Rivera — Junior web maker

Example **Project 1** portfolio for Full-Stack Mastery (2026). Replace the name, copy, and links with **yours** before you claim it as a résumé.

## Screenshot

Open `index.html` over HTTP and capture the hero at 1280px and 375px. Put those images here when this is your repo.

## Features

- Semantic landmarks, one `h1`, logical headings
- Keyboard-usable nav, form, and skip link
- Flexbox header, Grid sections
- Custom properties, light/dark (checkbox + `prefers-color-scheme`)
- Mobile nav without JavaScript
- Print stylesheet and custom 404
- Honest contact form (no fake backend)

## Technologies

HTML5 and CSS3 only. No React, Tailwind, or Bootstrap.

## Run locally

```powershell
npx --yes serve . -p 5500
```

Open `http://127.0.0.1:5500`. Do not use `file://`.

## Accessibility notes

- Visible `:focus-visible`
- Real `<label>` elements
- Contrast checked on paper and ink
- `prefers-reduced-motion` disables smooth scroll and animation

## Responsive notes

Checked near 375, 768, 1024, and a wide desktop. Nav becomes a disclosure under 640px.

## Debugging lessons

1. **Layout:** a Grid child overflowed because a long URL would not wrap — `overflow-wrap: anywhere` on `.card-links a` is the honest fix, not `overflow-x: hidden` on `body`.
2. **Responsive:** the sticky header covered in-page targets until `scroll-padding-top` matched `--header`.
3. **Cascade:** a later `a { color }` beat the primary button until `.btn-primary` used a more specific selector and `:hover` set `color: #fff` again.

## Lessons learned

Meaning lives in HTML. Paint lives in CSS. A keyboard user is a first-class visitor.

## Live site

After GitHub Pages: put the HTTPS URL here.
````

---

## After you match the spec

Return to Month 2 Week 4 Day 7 and finish the **gate layout** if you have not. Project 1 HTTPS does not skip the exam rebuild.

Then Month 3. Project 2 has its own workshop later — this folder is only Project 1.

---

## Optional review links

- [MDN: HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) — recheck names, not first learning  
- [MDN: CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)  
- [GitHub Pages](https://docs.github.com/en/pages)  
