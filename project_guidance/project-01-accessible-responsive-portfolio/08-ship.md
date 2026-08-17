# Project 1 · Step 8
# Git, README, Deploy, Definition of Done

**Workshop:** [Project 1](README.md) · [Step 7](07-responsive-accessibility.md)  
**Spec:** documentation, Git history, public HTTPS  
**Time:** 2 hours plus however long GitHub Pages takes to go green

---

## Finish the README

Replace the stub. This shape matches the specification:

```markdown
# Your Name — Portfolio

Project 1 for Full-Stack Mastery (2026). HTML and CSS only.

## Screenshot

Add `/assets/screenshot-desktop.png` and `/assets/screenshot-mobile.png` after you capture them.

## Features

- Semantic landmarks and one h1
- Keyboard-usable navigation and contact form
- Flexbox header, Grid sections
- Custom properties, dark mode, reduced motion
- Print stylesheet and custom 404
- Honest contact form (no backend)

## Technologies

HTML5, CSS3. No React, Tailwind, or Bootstrap.

## Local run

npx --yes serve . -p 5500

Open http://127.0.0.1:5500

## Accessibility notes

(Your KEYBOARD.md summary: skip link, labels, focus, contrast.)

## Responsive-design notes

(Your VIEWPORTS.md summary: 375 / 768 / 1024 / wide.)

## Debugging lessons

1. Layout: (the bug you caused and the DevTools fix)
2. Responsive: (scroll-padding, wrapping nav, or similar)
3. Cascade: (a selector that lost, and why)

## Lessons learned

(One honest paragraph.)

## Live site

https://YOUR_USER.github.io/portfolio/
```

```powershell
git add README.md
git commit -m "Document purpose, a11y, responsive notes, and debugging lessons."
```

You need **more than one commit** in the log. `git log --oneline` should tell a story: gitignore, plan, HTML, CSS, responsive, docs.

---

## Create the GitHub repository

On github.com: **New repository**, name `portfolio` (or `your-name-site`), **no** README (you already have one). Do not initialize with a license if it would create a merge conflict — add a license file later if you want.

```powershell
cd $HOME\portfolio
git branch -M main
git remote add origin https://github.com/YOUR_USER/portfolio.git
git push -u origin main
```

If GitHub asks for auth, use a **personal access token** as the password over HTTPS, or GitHub CLI `gh auth login`.

---

## GitHub Pages (HTTPS)

1. Repo **Settings → Pages**.  
2. Source: **Deploy from a branch**.  
3. Branch: `main`, folder: `/ (root)`.  
4. Save. Wait until the Pages URL is green.  
5. Open `https://YOUR_USER.github.io/portfolio/` (path matches the repo name unless you use a `*.github.io` user site).

**Relative URLs.** `href="css/styles.css"` works. `href="/css/styles.css"` breaks on project Pages because the site lives under `/portfolio/`. You already used relative links. Keep them.

**404.** Pages uses root `404.html` automatically.

Confirm:

- No broken CSS (View Source, click the stylesheet link).  
- Phone width in DevTools.  
- The lock icon: **HTTPS**.

Put the live URL in the README and push.

```powershell
git add README.md
git commit -m "Add public HTTPS URL."
git push
```

---

## Definition of Done (spec §12)

Tick only what is **true**. If a row is false, stay on this workshop.

- [ ] I can rebuild this structure without the workshop open (try on paper).  
- [ ] I can explain semantic HTML and heading rank.  
- [ ] I can explain Flexbox vs Grid on **this** page.  
- [ ] I can explain cascade/specificity with one example from `styles.css`.  
- [ ] 375 / 768 / 1024 / wide: no accidental horizontal scroll.  
- [ ] Keyboard can reach every link and control; focus is visible.  
- [ ] I used DevTools to fix layout, responsive, and cascade issues (README).  
- [ ] Git history is many small commits, not one dump.  
- [ ] Public HTTPS URL works.  
- [ ] I can explain every major HTML/CSS decision out loud.

Month 2’s gate **also** requires the Northline Studio exam layout in the textbook. This workshop does not replace Week 4 Day 7. Do both.

---

## Today's gate

> `git log` is a story. The README is honest. The live URL is HTTPS. I did not upload Sam Rivera’s name as myself.

Open [09-complete-reference.md](09-complete-reference.md) to compare with the exam build.
