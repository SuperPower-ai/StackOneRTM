# Project 1 · Step 3
# Repository and Modern Folder Structure

**Workshop:** [Project 1](README.md) · [Step 2](02-environment.md)  
**Time:** 45–60 minutes

Today the project becomes a **Git repository** with a folder shape you could still defend in Month 18.

---

## Create the folder

PowerShell:

```powershell
cd $HOME
mkdir portfolio
cd portfolio
git init
```

If `~/portfolio` already exists from Month 2 Week 4 Day 6, `cd` into it. Do not nest a second `git init` inside `fullstack-lab` as a dump of the whole course.

---

## `.gitignore`

Create `.gitignore` and type:

```
.DS_Store
Thumbs.db
*.log
.vscode/
.idea/
```

Commit as soon as it exists. Empty repos with a giant later commit fail the spec.

```powershell
git add .gitignore
git commit -m "Add gitignore for the portfolio."
```

---

## The structure you will fill

Type this tree into `PLAN.md` (create the file):

```
portfolio/
  .gitignore
  README.md          ← you write in Step 8; stub today
  index.html         ← Step 4
  404.html           ← Step 7
  css/
    styles.css       ← Steps 5–7
    print.css        ← Step 7
  assets/
    favicon.svg      ← Step 4
```

Create the empty directories:

```powershell
mkdir css, assets
```

**Why this shape (2026, still beginner-clear):**

| Choice | Reason |
|---|---|
| `css/` not `CSS/` | Lowercase URLs; GitHub Pages is case-sensitive |
| One `styles.css` | You can **see the cascade**. Ten tiny files hide it |
| `print.css` separate | Print is a different medium; the spec’s stretch goal stays honest |
| `assets/` | Favicon and future images; relative paths stay short |
| No `src/`, no `dist/` | Those belong to Vite (Month 5). This site **is** the files you deploy |
| No `node_modules/` | The portfolio is not an npm app |

**Wrong belief:** “A professional repo needs `src/components`.”  
**Correct:** this project is a static document. Pretend-React folders are a costume.

---

## Stub README

Create `README.md`:

```markdown
# Your Name — Portfolio

Project 1 for Full-Stack Mastery. HTML and CSS only.

## Run locally

npx --yes serve . -p 5500
```

```powershell
git add PLAN.md README.md
git commit -m "Plan folder layout and stub README."
```

---

## Editor

In Cursor: **File → Open Folder** → `portfolio`. The sidebar should show `.gitignore`, `README.md`, `PLAN.md`, `css/`, `assets/`.

---

## Today's gate

> This is its own Git repo. The folder layout is decided. I have at least two small commits. I have not pasted a template.

Open [04-html.md](04-html.md).
