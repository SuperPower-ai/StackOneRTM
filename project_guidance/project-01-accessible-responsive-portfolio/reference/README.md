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
