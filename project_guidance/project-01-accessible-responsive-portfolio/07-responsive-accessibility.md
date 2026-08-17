# Project 1 · Step 7
# Responsive, Keyboard, Dark Mode, Print, 404

**Workshop:** [Project 1](README.md) · [Step 6](06-css-layout.md)  
**Spec checks:** responsive widths, keyboard, contrast, optional stretch  
**Time:** 2–3 hours

Append this to `css/styles.css`:

```css
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

## How the mobile menu works

The checkbox `#nav-toggle` is **visually hidden** but still a control. Its `<label>` is the Menu button. On a narrow screen, `:checked ~ .primary-nav` reveals the links. **No JavaScript.** Tab to Menu, press Space, Tab into the links.

On a wide screen the label is `display: none` and the nav stays a row. Four links do not need a hamburger on desktop.

---

## Four widths (required)

Device toolbar: **375**, **768**, **1024**, and a wide desktop (or undocked window).

For each, write a row in `VIEWPORTS.md`:

| Width | Overflow-x? | Nav | Form | Notes |
|---|---|---|---|---|
| 375 | | | | |
| 768 | | | | |
| 1024 | | | | |
| 1440 | | | | |

If anything needs `overflow-x: hidden` on `body`, you failed. Fix the child.

---

## Keyboard pass (required)

From the address bar:

1. Tab to **Skip to content**, activate it, confirm you land in `main`.  
2. Tab every link and every form control.  
3. You always see `:focus-visible`.  
4. You can check Dark mode and Menu with the keyboard.

Record it in `KEYBOARD.md` (a list of stops).

---

## Print stylesheet

Create `css/print.css`:

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

  .site-header {
    position: static;
    border: 0;
  }
}
```

`index.html` already links it with `media="print"`. Ctrl+P → preview.

---

## Custom 404

Create `404.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Page not found — Your Name</title>
    <link rel="stylesheet" href="css/styles.css" />
  </head>
  <body>
    <a class="skip" href="#main">Skip to content</a>
    <header class="site-header">
      <a class="mark" href="index.html">Your Name</a>
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

GitHub Pages will serve this file for unknown paths **if** it sits at the repo root with that name.

---

## Contrast

Hero text on `--paper` must stay readable. If you change `--accent`, check the primary button (white text on blue). DevTools **Inspect** → contrast ratio. Aim for **4.5:1** for body text.

```powershell
git add css/styles.css css/print.css 404.html VIEWPORTS.md KEYBOARD.md
git commit -m "Add responsive nav, print sheet, 404, and evidence notes."
```

---

## Today's gate

> 375px does not scroll sideways. Keyboard finishes the form. Reduced-motion is respected. Print is not a wallpaper of buttons. 404 exists.

Open [08-ship.md](08-ship.md).
