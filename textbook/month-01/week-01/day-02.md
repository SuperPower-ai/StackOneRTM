# Month 1 · Week 1 · Day 2
# Filesystem Fluency, Processes, Environment, PATH

**Month index:** [../../README.md](../../README.md)  
**Week 1:** [1](day-01.md) · Day 2 (today) · [3](day-03.md) · [4](day-04.md) · [5](day-05.md) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Exercises + debugging  
**Study time:** 3–4 focused hours  
**Prereq:** Day 1 gate passed. `~/fullstack-lab` exists with a first commit.

---

## Today's contract

By the end of this day you will be able to:

1. Navigate the filesystem without guessing — absolute path, relative path, hidden files, permissions at a beginner level.
2. Run a program from the terminal and find its process.
3. Explain a **process** vs a **program** with a PID in front of you.
4. List environment variables and explain what they are for.
5. Explain **PATH**: how the shell finds `git`, and why “not recognized” happens.
6. Debug the three most common shell failures: wrong directory, typo, program not on PATH.

**Today's gate**

> Why does `git` work in one folder and “the term git is not recognized” happen on another machine? What exactly does PATH have to do with it? How do you prove your answer?

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 40 | Theory: filesystem depth, processes, env, PATH |
| B | 55 | Guided drills + deliberate errors |
| C | 70 | Independent debugging lab |
| D | 35 | Add PATH notes to the lab repo |
| E | 15 | Closed-book recall |

---

# Block A — Theory

## 1. The filesystem is a tree of names

Day 1 introduced the tree. Today you make it automatic.

The OS does not think in “the Downloads folder I click.” It thinks in **paths**: a sequence of names from a root to a file.

### 1.1 Roots

| System | Root idea | Example home |
|---|---|---|
| Windows | Drive letters. Your main disk is usually `C:\` | `C:\Users\Universe` |
| Linux | One tree. Root is `/` | `/home/universe` |

Windows also has extra drives (`D:\`) and a PowerShell provider system (`Env:`, `Alias:`). For this program, treat `C:\Users\...` as your working universe unless you have a reason not to.

### 1.2 Directory operations are name operations

| Intent | PowerShell | Linux |
|---|---|---|
| Where am I? | `Get-Location` / `pwd` | `pwd` |
| List | `Get-ChildItem` / `ls` | `ls` |
| List hidden too | `Get-ChildItem -Force` | `ls -a` |
| Change directory | `Set-Location` / `cd` | `cd` |
| Make directory | `mkdir` / `New-Item -ItemType Directory` | `mkdir` |
| Copy | `Copy-Item` | `cp` |
| Move / rename | `Move-Item` / `Rename-Item` | `mv` |
| Delete file | `Remove-Item` | `rm` |
| Delete empty dir | `Remove-Item` | `rmdir` |
| Print file | `Get-Content` | `cat` |
| Full path of a name | `(Resolve-Path .).Path` | `realpath .` |

Deleting a directory with contents:

```powershell
Remove-Item -Recurse -Force some-folder
```

**Do this only to folders you created in `fullstack-lab`.** There is no undo.

### 1.3 Hidden files

A name starting with `.` is a convention for “config / metadata” (`.gitignore`). On Windows, files can also have a Hidden attribute.

```powershell
Get-ChildItem -Force
```

You will live in hidden files: `.gitignore`, later `.env`, `.git/`.

### 1.4 Permissions — beginner truth

The OS can refuse a read, write, or execute.

On Windows you will mostly meet:

- **Access denied** — the user or process is not allowed.
- **File in use** — another process has the file open.
- **Execution policy** — PowerShell refusing to run a `.ps1` script (this is not NTFS permissions; it is a PowerShell safety setting).

On Linux (Month 15) you will meet `rwx` and `chmod`. Same idea: the kernel enforces rules.

**Wrong belief:** “If I can see the file, I can run it.”  
**Correct:** seeing, reading, writing, and executing are different permissions. PowerShell may also block scripts separately.

---

## 2. Running a program

A **program** is a file the OS knows how to execute (`.exe`, a script the shell can interpret, later `python`, `node`).

To run it you either:

1. Type a **full path**: `C:\Program Files\Git\cmd\git.exe`
2. Type a **name** and let the shell search **PATH**: `git`

Then the OS creates a **process**.

### 2.1 Starting and seeing a process

```powershell
notepad
Get-Process notepad
```

`notepad` starts a GUI program. The shell may return immediately. The process still exists until you close Notepad.

```powershell
Start-Process notepad
Get-Process notepad | Select-Object Id, ProcessName, Path
```

`Path` (when present) shows which **file** that process was launched from. That is the program.

### 2.2 What a process has

A running process has at least:

- **PID** — process identifier, unique for that run
- **Memory** — its working set in RAM
- **Environment** — a copy of environment variables at start (important later)
- **Current directory**
- **Open handles** — files, network connections

When the process exits, the PID is finished. Start the program again: **new process, new PID**, same program file.

### 2.3 Parent and child (enough for now)

Your PowerShell is a process. When it runs `git status`, it starts a **child** process `git`, waits (usually), then shows you git’s output.

The browser is a process (often several). Your future API server will be a process. Docker will run processes inside containers. “The app is up” means “the process is running and listening.”

**Do not** kill unknown processes. Inspect only, unless you started it.

---

## 3. Environment variables

An **environment variable** is a named string the OS and processes use for configuration.

Examples:

| Name | Typical meaning |
|---|---|
| `USERNAME` / `USER` | Who you are |
| `COMPUTERNAME` / `HOSTNAME` | Machine name |
| `HOME` / `USERPROFILE` | Home directory |
| `PATH` | Where to search for programs |
| `TEMP` | Temporary files |
| Later: `DATABASE_URL` | How the app finds the database |

They are not magic. They are **key = value** pairs inherited by child processes.

### 3.1 Why programs use them

A program should not hard-code “the database is on my laptop.” It should read `DATABASE_URL`. Change the environment, not the source code, when you deploy.

That is Month 12–16. Today you learn that the environment **exists** and you can inspect it.

### 3.2 Session vs persistent

In PowerShell:

```powershell
$env:MY_LAB = "day2"
```

This exists in **this shell process**. Close the window: it is gone.

Persistent user variables live in Windows settings / `[System.Environment]::SetEnvironmentVariable`. You will not need to set persistent variables today. You must know the difference so you do not think “I set PATH” when you only set it for one window.

### 3.3 Security

Environment variables often hold **secrets** (API keys, tokens).

Rules from this day forward:

- Do not paste secrets into chat, screenshots, or Git.
- Do not commit `.env` files. `.gitignore` them when they appear.
- `Get-ChildItem Env:` can print secrets if they exist. Be careful what you share from that list.

---

## 4. PATH

**PATH** is an environment variable whose value is a list of directories.

When you type `git`, the shell does **not** search the whole disk. It:

1. Checks if `git` is an alias or function.
2. Checks the current directory (PowerShell’s rules differ slightly from cmd; do not rely on “the .ps1 in this folder” being found by name alone — you often need `.\script.ps1`).
3. Walks each directory in PATH, in order, looking for `git`, `git.exe`, `git.cmd`, …

The **first match wins**.

### 4.1 Why this is a full-stack skill

Later you will install Node, Python, Git, Docker, AWS CLI. If PATH is wrong:

- `python` runs the Windows Store stub, not the Python you installed
- `git` is not recognized
- CI fails because the server’s PATH is not your laptop’s PATH

“Works on my machine” is often a PATH difference.

### 4.2 PowerShell scripts are not on PATH by default

To run a script in the current directory you must say so:

```powershell
.\inspect-machine.ps1
```

The `.\` is not decoration. It means “this directory.” Windows does this so a downloaded `git.ps1` in a random folder cannot hijack the real `git`.

That is a security design.

### 4.3 Execution policy

PowerShell may refuse scripts:

```
cannot be loaded because running scripts is disabled on this system
```

Check:

```powershell
Get-ExecutionPolicy -List
```

For a student machine, a reasonable fix is **CurrentUser** (not the whole computer):

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Meaning: local scripts you wrote can run; downloaded scripts must be signed. You can also run one file without changing policy:

```powershell
powershell -ExecutionPolicy Bypass -File .\inspect-machine.ps1
```

Understand the message. Do not disable security blindly for all users.

---

## 5. A debugging playbook for the shell

When a command fails, ask in this order:

1. **What is the exact error?** Copy it. Read it.
2. **Where am I?** `Get-Location`
3. **Does the path exist?** `Test-Path ...`
4. **Did I typo the command name?**
5. **Is the program installed?** `Get-Command git -ErrorAction SilentlyContinue`
6. **Is it on PATH?** `$env:PATH -split ';' | Where-Object { $_ -match 'Git' }`
7. **Am I in the right shell?** CMD vs PowerShell vs Git Bash behave differently.
8. **Permissions / execution policy?**

This playbook is more valuable than memorizing 50 commands.

---

# Block B — Guided lab

Type everything. After each failure you cause on purpose, write the error and the cause in `~/fullstack-lab/day-01/notes.txt` or a new `~/fullstack-lab/week-01/day-02-notes.txt`.

Create the week folder:

```powershell
cd ~\fullstack-lab
mkdir week-01 -ErrorAction SilentlyContinue
cd week-01
```

---

### Lab 1 — Hidden files and Force

```powershell
cd ~\fullstack-lab
Get-ChildItem
Get-ChildItem -Force
```

You should see `.git` with `-Force`. That directory **is** the repository. Do not edit files inside `.git` by hand.

**Write:** What is `.git`? What command created it?

---

### Lab 2 — Resolve paths

```powershell
cd ~\fullstack-lab
(Get-Location).Path
Resolve-Path .
Resolve-Path ..
Resolve-Path .\week-01
Test-Path .\week-01
Test-Path .\does-not-exist
```

**Write:** One sentence each for `Resolve-Path` vs `Test-Path`.

---

### Lab 3 — Run a program and inspect the process

```powershell
Start-Process notepad
Start-Sleep -Seconds 1
Get-Process notepad | Select-Object Id, ProcessName, CPU, WorkingSet, Path
Get-Process -Id (Get-Process notepad)[0].Id
```

Close Notepad with the GUI, then:

```powershell
Get-Process notepad
```

You should get an error: the process is gone. The program file `notepad.exe` is still on disk.

**Write:** Program file path (if shown). PID while running. What happened to the PID after close?

---

### Lab 4 — Inspect the environment

```powershell
$env:USERNAME
$env:USERPROFILE
$env:COMPUTERNAME
$env:HOME
$env:TEMP
Get-ChildItem Env: | Select-Object -First 20 Name, Value
```

`Get-ChildItem Env:` lists environment variables as if they were a drive.

Set a **session** variable:

```powershell
$env:FULLSTACK_DAY = "week1-day2"
$env:FULLSTACK_DAY
```

Open a **new** PowerShell window and run `$env:FULLSTACK_DAY` there.

**Write:** Was it set in the new window? Why?

---

### Lab 5 — Dissect PATH

```powershell
$env:PATH
$env:PATH -split ';'
$env:PATH -split ';' | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
```

Find Git:

```powershell
Get-Command git | Format-List *
where.exe git
```

**Write:** The full path of `git.exe`. Which PATH directory contains it?

If `Get-Command git` fails, Git is not installed or not on PATH. Install Git for Windows, close and reopen PowerShell, retry. Do not continue until `git --version` works.

---

### Lab 6 — Why `.\` is required

```powershell
cd ~\fullstack-lab\week-01
Set-Content -Path hello.ps1 -Value 'Write-Host "hello from a script"'
hello.ps1
```

This should fail or not do what you expect. Read the error.

Then:

```powershell
.\hello.ps1
```

If execution policy blocks you:

```powershell
Get-ExecutionPolicy -List
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
.\hello.ps1
```

**Write:** Why `hello.ps1` without `.\` is the wrong idea on Windows.

---

### Lab 7 — Deliberate failures (debugging)

Cause each failure. Write error + cause + fix.

**A. Wrong directory**

```powershell
cd ~\fullstack-lab
Get-Content notes.txt
```

(The file is probably in `day-01\notes.txt`, not here.)

**B. Typo**

```powershell
get-childitm
```

**C. Command not on PATH**

```powershell
this-program-does-not-exist
```

**D. Missing file**

```powershell
Get-Content ~\fullstack-lab\week-01\missing.txt
```

Use the playbook. Do not skip writing the four answers.

---

# Block C — Independent lab

Close the theory sections. Use your notes and `Get-Help`.

### Task 1 — Map PATH yourself

Write `~\fullstack-lab\week-01\path-map.txt` containing:

1. How many directories are on your PATH?  
   Hint: `($env:PATH -split ';').Count`
2. The directory that contains `git.exe`
3. The directory that contains `powershell.exe` or `pwsh.exe`  
   `Get-Command powershell | Select-Object Source`
4. One sentence: what would go wrong if you deleted the Git directory from PATH?

### Task 2 — Process detective

1. Start Notepad.
2. Record its PID and WorkingSet.
3. In the same shell, start a second Notepad (`Start-Process notepad`).
4. List **both** processes: same program name, different PIDs.
5. Close both.

Write the two PIDs in `path-map.txt`. That is the proof of “one program, many processes.”

### Task 3 — Environment without looking at this file

List all environment variable **names** that contain `PATH` or `USER`:

```powershell
Get-ChildItem Env: | Where-Object { $_.Name -match 'PATH|USER' } | Select-Object Name
```

Do not paste values that look like keys or tokens into any document you might push.

### Task 4 — Help system

```powershell
Get-Help Get-ChildItem -Online
```

If `-Online` is inconvenient:

```powershell
Get-Help Get-Process -Detailed
```

**Write:** One thing `Get-Help` told you that this textbook did not. That is the documentation habit. Official help beats random blogs.

---

# Block D — Lab repo feature

Add a small script you will extend on Day 4. Type it. Do not paste from a chat.

`~\fullstack-lab\week-01\hello.ps1` already exists. Create `env-report.ps1`:

```powershell
Write-Host "User:        $env:USERNAME"
Write-Host "Home:        $env:USERPROFILE"
Write-Host "Computer:    $env:COMPUTERNAME"
Write-Host "Location:    $(Get-Location)"
Write-Host "Git command: $((Get-Command git).Source)"
Write-Host "PATH entries: $(($env:PATH -split ';').Count)"
```

Run:

```powershell
cd ~\fullstack-lab\week-01
.\env-report.ps1
```

Then:

```powershell
cd ~\fullstack-lab
git status
git add week-01
git commit -m "Week 1 Day 2: PATH, environment, and process lab."
git log --oneline
```

If `hello.ps1` or `env-report.ps1` should not be secret — they should not — they belong in Git.

---

# Block E — Closed-book recall

1. What is PATH?
2. Why might `git` work in PowerShell after install only if you **reopen** the terminal?
3. Program vs process — give an example with two PIDs.
4. Why `.\script.ps1` and not `script.ps1`?
5. Session vs persistent environment variable.
6. Name the debugging order: error, location, existence, typo, PATH.
7. Why is dumping `Get-ChildItem Env:` into a public gist a bad idea?

---

## Definition of done

- [ ] I can explain PATH without reading.
- [ ] `Get-Command git` shows a real path on my machine.
- [ ] I ran a `.ps1` with `.\` and I know why `.\` is required.
- [ ] I started a program and found its PID.
- [ ] I listed environment variables and set a session variable.
- [ ] I caused four failures and wrote the cause of each.
- [ ] Day 2 work is committed to `fullstack-lab`.

---

## Optional review links

Environment variables, PATH, execution policy, and processes are explained in this chapter. These pages are for later checking, not for first learning.

- [about_Environment_Variables](https://learn.microsoft.com/powershell/module/microsoft.powershell.core/about/about_environment_variables)
- [about_Path](https://learn.microsoft.com/powershell/module/microsoft.powershell.core/about/about_path_syntax)
- [Get-ExecutionPolicy](https://learn.microsoft.com/powershell/module/microsoft.powershell.security/get-executionpolicy)
- [Get-Process](https://learn.microsoft.com/powershell/module/microsoft.powershell.management/get-process)

---

## Tomorrow — Day 3

Implement from memory: filesystem, processes, env, PATH. The type-along answers will not be in the Day 3 file. Day 1 and Day 2 notes will.
