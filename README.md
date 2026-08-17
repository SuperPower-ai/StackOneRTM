# Full-Stack Mastery (2026)

An 18-month full-stack program: a **daily textbook**, eight **project specifications**, and a **roadmap**.

Students should read the textbook as a website, not as a folder of raw files.

## Read it on the web

Live site (after GitHub Pages is enabled):

**https://superpower-ai.github.io/StackOneRTM/**

| Page | URL |
|---|---|
| Home | https://superpower-ai.github.io/StackOneRTM/ |
| Month 1 | https://superpower-ai.github.io/StackOneRTM/month-01/ |
| First study day | https://superpower-ai.github.io/StackOneRTM/month-01/week-01/day-01/ |
| Project specs | https://superpower-ai.github.io/StackOneRTM/projects/ |
| Roadmap | https://superpower-ai.github.io/StackOneRTM/roadmap/ |

If the site 404s, open the repo **Settings → Pages → Source: GitHub Actions**, then wait for the **Deploy textbook site** workflow.

The Markdown in `textbook/` is unchanged. GitHub still renders those files. The site **builds** them into articles with typography, navigation, search, Mermaid diagrams, and previous/next chapter links.

## Preview locally

You need Node.js 22.

```powershell
cd site
npm install
npm run dev
```

Open `http://localhost:4321/`. Production build:

```powershell
npm run build
npm run preview
```

## What students do

1. One chapter per study day. Order is mandatory.
2. Type the labs. Do not paste.
3. Build the eight numbered projects from `full_stack_project_requirements_2026/` — never from a pasted solution.
4. Do not start month N+1 until that month’s gate is true.

Months **1–9** are in print. Months **10–18** are forthcoming.

## Repository layout

```
textbook/                              daily textbook (source of truth)
full_stack_project_requirements_2026/  the eight project specs
full_stack_mastery_roadmap_expert_2026.md
site/                                  the website (Astro)
.github/workflows/pages.yml            GitHub Pages deploy
```

Do not flatten `textbook/`. Relative links inside the Markdown depend on that tree.
