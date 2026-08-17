# Month 1 · Week 1 · Day 1
# The Machine: OS, CPU, Memory, Storage

**Program:** Full-Stack Mastery · 18 months  
**Phase:** 1 — Foundations  
**Month index:** [../../README.md](../../README.md)  
**Week 1:** Day 1 (today) · [2](day-02.md) · [3](day-03.md) · [4](day-04.md) · [5](day-05.md) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Learn + small exercises  
**Student state:** Total full-stack beginner  
**Study time:** 3–4 focused hours  
**Machine today:** Windows PowerShell (Linux equivalents are shown so this knowledge transfers)

**This week covers:** operating systems, CPU, memory, storage, files/directories, paths, processes, programs vs processes, terminal, environment variables, PATH — plus practice: navigate, create/move/delete, run programs, inspect processes, inspect environment variables.

Today is the machine model and first contact with the filesystem and Git. Environment variables and PATH are Day 2. Do not skip them later.

---

## How to use this textbook

This is not a video transcript and not a tutorial to skim.

1. Read a section. Close it. Say the idea in your own words.
2. Type every command yourself. Do not paste.
3. If a command fails, read the error. Then fix it. That *is* the lesson.
4. Do not keep an explanation you cannot repeat without looking.
5. AI may explain or review. It may not replace your reasoning.

If you finish early, do the stretch lab — not another article.

---

## Today's contract

By the end of this day you will be able to:

1. Explain what a computer is as an engineer, not as a consumer.
2. Explain what an operating system actually does.
3. Explain CPU, RAM, and storage — and why they are not the same thing.
4. Open a terminal, see where you are, and inspect your own machine.
5. Create, list, move, and delete files and directories on purpose.

**Today's gate.** You pass Day 1 when you can explain, closed-book:

> When I open a browser, what parts of the computer start working, and what is the difference between a program, a process, a file, and memory?

If you cannot answer that, you are not done. Re-read. Re-do the lab. Do not start Day 2.

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 40 | Theory: computer, OS, CPU, RAM, storage |
| B | 50 | Guided lab: inspect the machine |
| C | 70 | Independent lab: filesystem + written explanations |
| D | 30 | Course workspace + first Git commit |
| E | 15 | Closed-book recall |

---

# Block A — Theory

## 1. Why a full-stack engineer must know this

A website is not “the internet” and not “the code editor.”

A website is **programs running on computers**:

- the **browser** is a program on the user’s computer
- the **server** is a program on another computer
- the **database** is a program that stores data on disk and answers questions from memory

When a site is slow, the cause is never “the computer is bad” as a vague feeling. The cause is one of these, always:

- the CPU is busy
- RAM is full or data is in the wrong place
- the disk is slow
- the network is slow
- the program is waiting
- the program is doing unnecessary work

If you cannot name those parts, you cannot debug. Full-stack work is mostly debugging systems you built.

We start here so every later topic — HTTP, JavaScript, React, FastAPI, PostgreSQL, Docker, AWS — has a real machine underneath it.

---

## 2. What a computer is

A computer is a machine that **stores data** and **follows instructions**.

That is the whole idea. Everything else is an elaboration.

### 2.1 The four parts

Almost every computer you will use — laptop, phone, cloud server — has the same shape:

| Part | Job | Forget this and you will think… |
|---|---|---|
| **CPU** | Executes instructions | “The computer” is one blob |
| **Memory (RAM)** | Holds what is being used *right now* | Files and running programs live in the same place |
| **Storage** | Holds files when power is off | Closing a program and deleting a file are the same |
| **I/O** | Talks to the outside world | Keyboard, screen, network, disk controller |

I/O means input/output: keyboard, mouse, screen, speakers, network card, USB, disk.

### 2.2 The important rule

**The CPU can only work on data that is in RAM.**

A file on disk is not being used. It is stored. To use it, the operating system copies some of it into RAM. Then the CPU can read it.

This is why:

- opening a large application takes time (load from storage into RAM)
- too many open programs makes the machine crawl (RAM pressure)
- a saved file survives a restart (it is on storage)
- unsaved work dies when the process dies (it lived only in RAM)

### 2.3 Program vs data

A program is a file of instructions. A photo is a file of data. To the machine, both are bytes.

The difference is **how they are used**:

- the OS loads a program into RAM and tells the CPU “start executing here”
- the OS loads a photo into RAM and tells a program “here is the data to display”

You do not need to memorize hardware brands. You need this model.

---

## 3. The operating system

The **operating system (OS)** is the program that owns the machine.

Windows, Linux, and macOS are operating systems.

### 3.1 What the OS actually does

The OS is not the wallpaper, the Start menu, or the desktop icons. Those are only a user interface.

The OS:

1. **Starts the hardware** and keeps it usable.
2. **Runs programs** and stops them.
3. **Shares the CPU** among many programs.
4. **Gives each program memory** and tries to stop them from overwriting each other.
5. **Owns the filesystem** — names, folders, permissions.
6. **Talks to devices** — disk, network, keyboard — so each program does not talk to hardware directly.
7. **Enforces rules** — which user may read which file, which program may bind to which network port.

Without an OS, you would write hardware-specific code for every task. With an OS, you write “open this file” and the OS handles the disk.

### 3.2 Kernel and user space

Two layers matter:

- **Kernel:** the core of the OS. It can talk to hardware. It is privileged.
- **User space:** ordinary programs. Browser, editor, terminal, your future API server. They ask the kernel for services.

When your Python program “opens a file,” it does not move the disk head itself. It asks the kernel. The kernel decides whether that is allowed, then does the work.

This is why permissions exist. This is why a crashed website should not, by itself, destroy the operating system. Isolation is the point.

### 3.3 What “Windows” vs “Linux” means for you

Same ideas. Different commands, different filesystem shape, different permission model.

| Idea | Windows | Linux (later, Month 15 and servers) |
|---|---|---|
| Home folder | `C:\Users\YourName` | `/home/yourname` |
| Path separator | `\` | `/` |
| Shell today | PowerShell | bash / zsh |
| Process list | `Get-Process` | `ps` |
| Environment | `$env:NAME` | `$NAME` |

You are on Windows today. That is fine. The *concepts* are the same. Cloud servers will almost always be Linux. Learn the idea now; learn Linux commands when the roadmap reaches them.

**Wrong belief:** “The OS is the desktop.”  
**Correct:** the desktop is an app. The OS is the kernel plus system programs that manage the machine.

---

## 4. CPU

**CPU** means Central Processing Unit. It is the part that executes instructions.

### 4.1 Fetch, decode, execute

The CPU repeats a tiny loop, billions of times per second:

1. **Fetch** the next instruction from RAM.
2. **Decode** what it means.
3. **Execute** it (add two numbers, compare, jump, read memory, …).

A “fast CPU” can do more of these loops per second, and/or do more of them in parallel.

### 4.2 Cores and threads — the honest beginner version

- A **core** is an independent execution engine on the chip.
- A **logical processor / thread** is a slot the OS can schedule work onto.

Your OS runs many programs at once by **time-slicing**: give program A a tiny slice of CPU, then program B, then A again. On a multi-core machine, several slices can be true at the same time.

You do not need chip microarchitecture yet. You need this:

> The CPU is busy doing instructions, waiting for data, or idle. “The app froze” usually means *your program is waiting or stuck*, not that electricity stopped.

### 4.3 Why this matters in web work

- A tight JavaScript loop on a page can freeze the UI — that tab’s work is occupying a thread.
- A FastAPI server with a slow function occupies a worker while other requests wait.
- More CPU does not fix a program that waits on a slow database query. That is not a CPU problem.

**Wrong belief:** “More CPU always makes a website faster.”  
**Correct:** CPU helps CPU-bound work. Most web slowness is waiting — disk, database, network, or bad design.

---

## 5. Memory (RAM)

**RAM** means Random Access Memory. It is the working table of the computer.

### 5.1 Properties that matter

1. **Fast.** The CPU can read RAM much faster than disk.
2. **Volatile.** When power is gone, RAM is empty.
3. **Limited.** Laptops often have 8–32 GB. Servers vary. It is never infinite.
4. **Addressable.** Every byte has an address. Programs use addresses; you will meet this idea again with pointers, references, and memory errors.

### 5.2 What lives in RAM

- the running OS
- running programs (processes)
- the data those programs are currently using
- caches — copies of recently used disk data, kept in RAM for speed

### 5.3 RAM is not storage

| | RAM | Storage (SSD/HDD) |
|---|---|---|
| Speed | Very fast | Slower |
| Survives restart? | No | Yes |
| Typical size | Gigabytes | Hundreds of GB to TB |
| What you name | Rarely (the OS manages it) | Files and folders |

When people say “I saved the file,” they mean: a program asked the OS to **write bytes to storage**. Until that write happens, the work may exist only in RAM.

### 5.4 When RAM is full

The OS may:

- stop giving memory to programs (they crash or fail allocations)
- use **swap**: copy idle RAM pages to disk to free RAM. This keeps the machine alive but can make it feel extremely slow, because disk is not RAM.

**Wrong belief:** “Memory means disk space.”  
**Correct:** memory = RAM. Disk space = storage. They are different resources with different failure modes.

---

## 6. Storage

**Storage** is where files live when the computer is off.

### 6.1 Disk, SSD, volume, drive

- **Disk / SSD:** the physical (or virtual) device.
- **Volume / partition / drive letter:** a region the OS formats and mounts. On Windows you see `C:`, sometimes `D:`.
- **Filesystem:** the rules for naming files, directories, permissions, and where bytes go.

You will not format disks in this program. You will constantly use the filesystem.

### 6.2 A file is an OS abstraction

A file is not a piece of paper. It is:

- a **name** (and a location in a directory)
- **bytes**
- **metadata** — size, timestamps, permissions

A directory (folder) is a special file whose job is to contain names of other files and directories.

This is why paths matter. A path is how you point to a file through the directory tree.

### 6.3 Why storage matters in full-stack work

- Your source code is files.
- Git stores history as files.
- PostgreSQL stores tables as files (managed by the database, not by you).
- Uploaded images are files.
- Logs are files.
- Docker images are files.

If you cannot navigate a filesystem, you cannot deploy anything.

---

## 7. Files, directories, and paths

You need this today to use the terminal. Day 2 will go deeper. Today you need the model.

### 7.1 The tree

The filesystem is a tree.

```
C:\
 └── Users\
      └── Universe\
           ├── Downloads\
           │    └── 2026\
           └── Documents\
```

- **Root** on Windows for your main disk is `C:\`
- **Directory** contains files and other directories
- **File** is a leaf: it holds content

### 7.2 Absolute vs relative path

**Absolute path:** starts from the root. It does not depend on where you currently are.

```
C:\Users\Universe\Downloads\2026
```

**Relative path:** starts from your **current working directory**.

If you are in `C:\Users\Universe\Downloads`, then `2026` means `C:\Users\Universe\Downloads\2026`.

Special names:

| Symbol | Meaning |
|---|---|
| `.` | this directory |
| `..` | parent directory |
| `~` | home directory (PowerShell understands this) |

### 7.3 Current working directory

The terminal always has a **current location**. Commands like “list files” list *here*, not “the whole computer.”

If a command “cannot find a file,” the first question is:

> Where am I, and what path did I actually type?

That question will save you years.

---

## 8. Programs vs processes (first look)

A **program** is a file on storage: `chrome.exe`, `python.exe`, `node.exe`.

A **process** is a program that is **currently running**:

- it has a process ID (PID)
- it has memory
- it may have open files and network connections
- it can be listed, inspected, and stopped

You can have one program and many processes. Opening three browser windows may mean several processes. Running your API twice means two processes.

You will inspect processes in the lab. Day 2 treats this in full, including environment variables and `PATH`.

**Wrong belief:** “The program on disk *is* the running app.”  
**Correct:** the file is the recipe. The process is the cooking.

---

## 9. The terminal

The **terminal** (here: PowerShell) is a text program that sends commands to the OS.

You type a command. The shell:

1. reads the line
2. finds the program to run (this uses `PATH` — Day 2)
3. starts a process
4. shows you the output

The terminal is not a toy. It is how you will use Git, run servers, run tests, build Docker images, and inspect production machines.

Graphical folders are the same filesystem. The terminal is a more precise way to talk to it.

---

## 10. One picture to keep

When you double-click a browser:

1. The OS finds the browser **file** on **storage**.
2. The OS creates a **process**.
3. It copies needed instructions and data into **RAM**.
4. The **CPU** executes those instructions.
5. The browser uses **I/O** (screen, keyboard, network).
6. When you quit, the process dies. RAM used by it is freed. The program file remains on storage.

Every web request you will ever debug is a variation of this picture across two or more computers.

---

# Block B — Guided lab

Open **PowerShell**. Not CMD, if you can choose. Not the editor’s output panel — a real shell.

Type every command. After each one, look at the output and answer the question in your notes.

If an error appears, copy the error into your notes, then try to understand it before you retry.

---

### Lab 0 — Confirm you are in PowerShell

```powershell
$PSVersionTable.PSVersion
```

You should see a version number. If this command fails, you are not in PowerShell.

---

### Lab 1 — Who and where

```powershell
whoami
hostname
Get-Location
pwd
```

`pwd` in PowerShell is an alias for `Get-Location`. Same idea as Linux.

**Write:** What user are you? What is the computer’s name? What directory are you in?

---

### Lab 2 — The operating system

```powershell
Get-CimInstance Win32_OperatingSystem |
  Select-Object Caption, Version, OSArchitecture, LastBootUpTime
```

**Write:** What OS are you running? 32-bit or 64-bit? When did this machine last boot?

If that command fails, use:

```powershell
systeminfo
```

This prints a lot. Find OS Name, OS Version, System Type.

---

### Lab 3 — CPU

```powershell
Get-CimInstance Win32_Processor |
  Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed
```

**Write:** How many cores? How many logical processors? What is the CPU name?

---

### Lab 4 — RAM

```powershell
Get-CimInstance Win32_ComputerSystem |
  Select-Object @{Name='TotalRAM_GB'; Expression={[math]::Round($_.TotalPhysicalMemory / 1GB, 2)}}
```

```powershell
Get-CimInstance Win32_OperatingSystem |
  Select-Object @{Name='FreeRAM_GB'; Expression={[math]::Round($_.FreePhysicalMemory / 1MB, 2)}}
```

**Write:** Total RAM. Free RAM. Are they the same? Why not?

Free is less than total because the OS and running processes are already using memory. That is normal.

---

### Lab 5 — Storage

```powershell
Get-PSDrive -PSProvider FileSystem
```

```powershell
Get-Volume |
  Select-Object DriveLetter, FileSystemLabel, FileSystem, @{Name='Size_GB';Expression={[math]::Round($_.Size/1GB,2)}}, @{Name='Free_GB';Expression={[math]::Round($_.SizeRemaining/1GB,2)}}
```

**Write:** Which drive holds your files? How much space is free? File system type (often NTFS)?

---

### Lab 6 — Processes

```powershell
Get-Process |
  Select-Object -First 20 Id, ProcessName, CPU, WorkingSet
```

```powershell
Get-Process |
  Sort-Object WorkingSet -Descending |
  Select-Object -First 10 Id, ProcessName, @{Name='RAM_MB';Expression={[math]::Round($_.WorkingSet/1MB,1)}}
```

**Write:**

- What is a PID?
- Which process is using the most RAM right now?
- Find a process you recognize (browser, editor). Write its name and Id.

**Do not** run `Stop-Process` today. Inspect only.

---

### Lab 7 — Home and tree

```powershell
cd ~
Get-Location
Get-ChildItem
ls
```

`ls` in PowerShell aliases `Get-ChildItem`.

```powershell
cd $HOME\Downloads
Get-Location
Get-ChildItem
```

If `Downloads` does not exist, stay in `$HOME` and list what *does* exist. Do not invent folders that are not there.

**Write:** What is your home directory path? What is inside Downloads?

---

# Block C — Independent lab

No tutorial. Documentation and this chapter only. Type everything.

You will work under your home directory. Do **not** delete files you did not create.

---

### Task 1 — Build a small directory tree

Create this structure yourself, command by command:

```
~/fullstack-lab/
  day-01/
    notes.txt
    scratch/
```

Commands you may use (look up any you forget after trying):

```powershell
cd ~
mkdir fullstack-lab
cd fullstack-lab
mkdir day-01
cd day-01
mkdir scratch
New-Item -ItemType File -Name notes.txt
Get-ChildItem
Get-ChildItem -Recurse
```

Confirm with `Get-ChildItem -Recurse` from `fullstack-lab` that the tree exists.

---

### Task 2 — Write to a file from the terminal

```powershell
cd ~\fullstack-lab\day-01
Set-Content -Path notes.txt -Value "Day 1 lab"
Get-Content notes.txt
Add-Content -Path notes.txt -Value "RAM is not storage."
Get-Content notes.txt
```

**Write in `notes.txt` (you may use Notepad or VS Code after creating it):**

1. OS, CPU cores, total RAM, free disk — numbers from your machine.
2. One paragraph: program vs process.
3. One paragraph: why RAM is emptied at shutdown and a `.txt` file is not.

---

### Task 3 — Copy, rename, move, delete

Work only inside `~\fullstack-lab\day-01`.

```powershell
cd ~\fullstack-lab\day-01
Copy-Item notes.txt scratch\notes-copy.txt
Get-ChildItem -Recurse
Rename-Item scratch\notes-copy.txt notes-renamed.txt
Get-ChildItem scratch
Move-Item scratch\notes-renamed.txt .\notes-moved.txt
Get-ChildItem
Get-ChildItem scratch
Remove-Item notes-moved.txt
Get-ChildItem
```

After each command, predict the tree. Then look. If the tree is not what you predicted, stop and explain the surprise in `notes.txt`.

---

### Task 4 — Paths on purpose

From `~\fullstack-lab\day-01`, run:

```powershell
Get-Location
Get-Item .\notes.txt
Get-Item $HOME\fullstack-lab\day-01\notes.txt
cd scratch
Get-Location
Get-Item ..\notes.txt
cd ..
Get-Location
```

**Write answers:**

1. Which of those paths are absolute?
2. Which are relative?
3. What does `..` mean in `..\notes.txt`?

---

### Task 5 — A command that should fail

Type this **on purpose**:

```powershell
Get-Content this-file-does-not-exist.txt
```

**Write:**

- the exact error
- what the error is telling you
- how you would confirm whether the file exists

Then prove it:

```powershell
Test-Path notes.txt
Test-Path this-file-does-not-exist.txt
```

Debugging starts with reading the error, not with guessing.

---

### Task 6 — Independent investigation (no new theory)

Using only commands you have already seen, answer these about **your** machine. Put answers in `notes.txt`.

1. How many processes are running? Hint: `(Get-Process).Count`
2. Is your total RAM greater than 8 GB?
3. What is your current working directory after `cd ~`?
4. Name one running process that is not a program you opened yourself. Why might the OS be running it?

If you cannot answer one of these, you are missing a concept from Block A. Go back. Do not search a random blog.

---

# Block D — Course workspace and Git from Day 1

Git theory is Month 1 Week 4. Using Git starts today. Minimum ritual only.

### D1 — Create the course notes file

Inside `~\fullstack-lab\day-01`, your `notes.txt` is the lab notebook. Keep it.

Also create the textbook-adjacent workspace you will keep for 18 months — if you are already working in `Downloads\2026`, stay there for the textbook files. The lab folder is for *your* typed work.

### D2 — Check Git

```powershell
git --version
```

If this fails, install **Git for Windows**, reopen PowerShell, run `git --version` again. Do not continue Block D until it works.

### D3 — First repository

```powershell
cd ~\fullstack-lab
git init
git status
```

You should see an initialized repository and untracked files.

Create a ignore file so junk does not get committed later:

```powershell
Set-Content -Path .gitignore -Value ".DS_Store`nThumbs.db"
```

Then:

```powershell
git add .
git status
git commit -m "Day 1: machine lab notes and filesystem practice."
git log
```

If Git asks for your name and email, set them locally for this repo only:

```powershell
git config user.name "Your Name"
git config user.email "you@example.com"
```

Then commit again if the first commit did not happen.

You do not need GitHub today. Local history is enough.

**Write in notes:** What did `git init`, `git add`, and `git commit` each do, in one sentence each?

Here is what they do — learn it here, not from `git help`:

- **`git init`** creates a hidden folder `.git` inside the current directory. That folder *is* the repository: it will hold every commit. The files next to `.git` are your **working tree** (the files you edit). After `init`, Git is watching this folder, but it has not saved a snapshot yet.
- **`git add`** copies a file’s *current bytes* into the **index** (staging area). The index is a proposed snapshot. `add` does not yet make history. You can add some files and leave others untracked.
- **`git commit`** freezes the index into a **commit**: a snapshot with your name, a message, a time, and a pointer to the previous commit (the parent). After a successful commit, `git log` shows it. The working tree can change again; history stays.
- **`git status`** compares working tree, index, and last commit, and tells you what is untracked, modified, or staged.
- **`git log`** lists commits, newest first.

If Git refuses the commit and asks for `user.name` / `user.email`, it needs to label the snapshot with an author. The `git config` commands above store that **in this repository only**. They are not a GitHub login.

**Wrong belief:** “`git add` uploads to the internet.”  
**Correct:** `add` and `commit` are local. Upload is `push` (Week 4 Day 2).

---

# Block E — Closed-book recall

Close this file. Close the browser if you used one. Use only your notes after the first attempt.

Answer out loud or on paper:

1. What are the four parts of a computer in this chapter’s model?
2. Why can the CPU not execute a file that is only on disk?
3. What does the OS do that a normal program must not do by itself?
4. What is the difference between RAM and storage?
5. What is a path?
6. What is the difference between a program and a process?
7. What is the current working directory, and why does it matter when a command fails?
8. When you save `notes.txt`, which resource did you change: CPU, RAM, or storage? Be precise: you changed **storage**; the editor also used CPU and RAM to do it.

Then reopen this file and mark anything you missed. Re-study only those parts.

---

## Definition of done

Check each box only if it is true.

- [ ] I can explain OS, CPU, RAM, and storage without reading.
- [ ] I inspected *my* OS, CPU, RAM, disk, and process list from PowerShell.
- [ ] I created, copied, renamed, moved, and deleted files I created.
- [ ] I can explain absolute path, relative path, `.`, and `..`.
- [ ] I read a real error from a missing file and explained it.
- [ ] I can explain program vs process with an example from my process list.
- [ ] I have `~/fullstack-lab` with notes and a first Git commit.
- [ ] I did not paste commands. I typed them.

If any box is false, stay on Day 1.

---

## Common failures on Day 1

| What happened | What it usually means |
|---|---|
| `The term '…' is not recognized` | Typo, or you are not in PowerShell, or the program is not installed |
| `Cannot find path` | Wrong current directory or wrong path |
| You deleted the wrong file | You were not where you thought you were. `Get-Location` first, always |
| Git commit refused | Identity not configured, or nothing staged |
| You understood while reading and went blank later | You recognized words. You did not learn. Repeat Block E |

---

## What we did *not* do today

On purpose:

- no HTML, CSS, or JavaScript
- no deep Git (branches, remotes, merge)
- no environment variables / `PATH` in full
- no Linux administration
- none of the 8 roadmap projects

Those arrive when the roadmap says they arrive.

---

## Tomorrow — Day 2

**Week rhythm:** Exercises + debugging.

We will deepen:

- files and paths until they are automatic
- processes in more detail
- environment variables
- `PATH` — how the shell finds programs
- what to do when a command is “not recognized”

Prepare by being able to answer today’s gate in 60 seconds.

---

## Optional review links

The lesson is this chapter, not the pages below. Use them only after you can already explain the material, if you want to verify wording against a vendor.

- Microsoft: [What is PowerShell?](https://learn.microsoft.com/powershell/scripting/overview)
- Microsoft: [Navigation in PowerShell](https://learn.microsoft.com/powershell/scripting/samples/managing-current-location)
- Git: [git-init](https://git-scm.com/docs/git-init)
