# Project 1 · Step 4
# HTML: One Document, Real Meaning

**Workshop:** [Project 1](README.md) · [Step 3](03-repository.md)  
**Textbook repair:** Month 2 Weeks 1–2 if landmarks or labels are foggy  
**Time:** 2–3 focused hours — type, do not paste blindly

Today `index.html` becomes the **whole product’s meaning**. CSS tomorrow will only paint what exists.

Serve the folder from this step onward:

```powershell
cd $HOME\portfolio
npx --yes serve . -p 5500
```

---

## Rules while you type

1. Replace **Sam Rivera** with your name everywhere.  
2. Replace example GitHub and email with yours (or a clearly fake address you own).  
3. One page-level **`h1`**. Section titles are `h2`. Cards use `h3`.  
4. Buttons for actions; `<a>` for navigation.  
5. Every control has a **visible `<label>`**.  
6. Do not add ARIA to fake a `nav` or a `button`.

**Wrong belief:** “I’ll put a `div` everywhere and fix it with CSS.”  
**Correct:** the accessibility tree reads your tags. CSS cannot turn a `div` into a link for a keyboard.

---

## Favicon

Create `assets/favicon.svg`. Change the letter path later if you want; the rectangle is enough today:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Your Name">
  <rect width="64" height="64" rx="16" fill="#f6f3ec"/>
  <path d="M18 46V18h10.5c7.4 0 12.2 4.2 12.2 10.4 0 6.3-4.9 10.5-12.3 10.5H26v7.1H18Zm8-14.6h2.2c3.1 0 5-1.7 5-4.2s-1.9-4.1-5-4.1H26v8.3Z" fill="#1e4fd7"/>
</svg>
```

---

## The full document

Create `index.html`. Type this file. Then change the identity strings.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="description"
      content="Your Name is a junior web maker studying Full-Stack Mastery. Semantic HTML, CSS layout, and accessible interfaces."
    />
    <meta name="theme-color" content="#f6f3ec" />
    <meta name="color-scheme" content="light dark" />
    <title>Your Name — Junior web maker</title>
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
      <a class="mark" href="#top">Your Name</a>
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
          <p>Write two true sentences about you. Current learning focus belongs here.</p>
          <p>Write what you care about in HTML and CSS, in your own words.</p>
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
              <li>Images with useful alt text</li>
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
        <p class="section-lead">Three cards. Use your Month 2 labs if you have no public demos yet. Point repository and live links at real URLs or honest placeholders you will replace.</p>
        <div class="card-grid">
          <article class="card">
            <div class="card-visual" aria-hidden="true"><span class="viz viz-a"></span></div>
            <h3>First piece</h3>
            <p>One sentence: what a visitor gets.</p>
            <p class="tech">HTML · CSS</p>
            <p class="card-links">
              <a href="https://github.com/YOUR_USER/YOUR_REPO">Repository</a>
              <a href="https://YOUR_USER.github.io/YOUR_REPO/">Live demo</a>
            </p>
          </article>
          <article class="card">
            <div class="card-visual" aria-hidden="true"><span class="viz viz-b"></span></div>
            <h3>Second piece</h3>
            <p>One sentence.</p>
            <p class="tech">HTML · forms</p>
            <p class="card-links">
              <a href="https://github.com/YOUR_USER/YOUR_REPO">Repository</a>
              <a href="https://YOUR_USER.github.io/YOUR_REPO/">Live demo</a>
            </p>
          </article>
          <article class="card">
            <div class="card-visual" aria-hidden="true"><span class="viz viz-c"></span></div>
            <h3>This portfolio</h3>
            <p>The site you are on.</p>
            <p class="tech">HTML · CSS · GitHub Pages</p>
            <p class="card-links">
              <a href="https://github.com/YOUR_USER/portfolio">Repository</a>
              <a href="#top">Live demo</a>
            </p>
          </article>
        </div>
      </section>

      <section class="contact" id="contact" aria-labelledby="contact-title">
        <h2 id="contact-title">Contact</h2>
        <p class="section-lead">Name, email, message, submit. No backend this month.</p>
        <p class="form-note" role="note">
          Submit does not send mail. Write to
          <a href="mailto:you@example.com">you@example.com</a>
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
      <p>© 2026 Your Name. Typed, not templated.</p>
      <nav aria-label="Profile">
        <a href="https://github.com/YOUR_USER">GitHub</a>
        <a href="https://www.linkedin.com/in/YOUR_USER">LinkedIn</a>
        <a href="mailto:you@example.com">Email</a>
      </nav>
    </footer>
  </body>
</html>
```

Save. Refresh `http://127.0.0.1:5500`. It will look almost unstyled. That is success: **meaning without paint**.

---

## Check in Elements

1. The tree shows `header`, `nav`, `main`, `section`, `footer`.  
2. There is exactly one `h1`.  
3. Each input’s accessible name is the label text (hover in the Accessibility pane).  
4. Tab from the top: Skip → logo → Menu (on a narrow window) → nav links → theme → content.

```powershell
git add index.html assets/favicon.svg
git commit -m "Add semantic portfolio document."
```

---

## Today's gate

> I can point at every required section in my HTML. The form has real labels. I did not use a `div` as a button. The name on the page is mine.

Open [05-css-foundation.md](05-css-foundation.md).
