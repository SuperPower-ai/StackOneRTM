# Project 1 · Step 2
# Environment: Tools a Beginner Actually Needs

**Workshop:** [Project 1](README.md) · [Step 1](01-welcome.md)  
**Machine:** Windows 10/11, PowerShell  
**Time:** 60–90 minutes if Git or Node is missing; 20 minutes if Month 1 is true

You cannot paint CSS in a void. This step installs a **boring, professional** environment and proves it with commands you type.

---

## What “environment” means here

| Tool | Why Project 1 needs it |
|---|---|
| **Cursor or VS Code** | Edit HTML/CSS with a file tree |
| **Git** | History from commit one |
| **GitHub account** | Remote + Pages (HTTPS) |
| **A current browser** | Chrome or Edge — DevTools |
| **Node.js 22** | So `npx serve` can host the folder over HTTP |

You do **not** need React, Vite, npm packages for the portfolio itself, Docker, or a database.

**Wrong belief:** “I will double-click `index.html` and see the real site.”  
**Correct:** `file://` lies about paths and will lie again on GitHub Pages. Serve HTTP from the first save.

---

## 1. Confirm Git

PowerShell:

```powershell
git --version
```

You want a version line, not “not recognized.” If Git is missing, install **Git for Windows**, reopen PowerShell, run the command again. Month 1 already taught this. Do not skip it.

Set your name if you have not (use **your** identity):

```powershell
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

This workshop does not change other people’s `git config` for you beyond reminding you it must exist.

---

## 2. Confirm the editor

Open Cursor (or VS Code). File → Open Folder will be how you enter `~/portfolio/` tomorrow.

Install, if you want them:

- **EditorConfig** (optional)
- Do **not** install a “HTML boilerplate portfolio” extension. It is a template in disguise.

---

## 3. Confirm the browser

Open DevTools once (`F12` or `Ctrl+Shift+I`):

- **Elements** — the DOM  
- **Computed** — which CSS won  
- **Toggle device toolbar** — 375 / 768 / 1024  

You will use all three before you deploy.

---

## 4. Node.js for a local server

```powershell
node -v
npx -v
```

You want Node **22** (or a current LTS). If `node` is missing, install it from the official Node.js Windows installer, then **close and reopen PowerShell**.

Test the runner you will use every chapter:

```powershell
mkdir $HOME\fullstack-lab\project-01-env-check
cd $HOME\fullstack-lab\project-01-env-check
Set-Content -Path index.html -Value "<!DOCTYPE html><html lang='en'><head><meta charset='utf-8'><title>Env</title></head><body><p>HTTP works.</p></body></html>"
npx --yes serve . -p 5500
```

Leave it running. In the browser open `http://127.0.0.1:5500`. You must see **HTTP works.**

Stop the server with `Ctrl+C`.

`curl.exe` check (optional):

```powershell
curl.exe -I http://127.0.0.1:5500
```

If the server is still up you should see an HTTP status line.

---

## 5. GitHub

1. Create a free GitHub account if you do not have one.  
2. Do **not** create the portfolio repository yet — that is Step 3, on purpose, so the folder layout is correct from commit one.  
3. Enable **two-factor authentication** on GitHub. That is professional hygiene, not extra credit.

You will push with HTTPS or SSH. HTTPS + a personal access token or GitHub CLI is enough. If `gh` is not installed, you can still use GitHub’s website “create repo” and `git remote add` in Step 8.

---

## 6. Windows-specific truths

- Paths: `~\portfolio` in this course means `C:\Users\YOU\portfolio` unless you chose otherwise.  
- Use `curl.exe`, not the `curl` alias that is `Invoke-WebRequest`.  
- PowerShell does not accept bash `&&` in older versions. Use `;` or separate lines.  
- Folder names: no spaces in `portfolio` if you can help it. `my-portfolio` is fine.

---

## Today's gate

> I can show Git, an editor, a browser with DevTools, Node/`npx`, and a folder served at `http://127.0.0.1:5500`. I will not open this project as `file://`.

Open [03-repository.md](03-repository.md).
