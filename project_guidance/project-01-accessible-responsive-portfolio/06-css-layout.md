# Project 1 · Step 6
# CSS Layout: Flex, Grid, and the Rest of the Page

**Workshop:** [Project 1](README.md) · [Step 5](05-css-foundation.md)  
**Textbook repair:** Month 2 Week 4 Days 1–4  
**Time:** 2–3 hours

**Flexbox** lines things up in one direction (the header). **Grid** makes two-dimensional regions (about + card, skill cards, project cards). You will use both. You will not use a framework grid.

Append **all of this** to `css/styles.css`.

```css
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

.card-links {
  display: flex;
  gap: 0.9rem;
  padding-top: 0.7rem;
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

img {
  max-width: 100%;
  height: auto;
}
```

Refresh. About should sit in two columns on a wide screen. Skills and work should be three columns. Cards should share height because they are Grid children; the links sit at the bottom because the card is a **column flex** with `margin-top: auto` on `.tech`.

**Wrong belief:** “I need `float` for the about sidebar.”  
**Correct:** Grid. Floats are for wrapping text around an image, not page chrome.

```powershell
git add css/styles.css
git commit -m "Lay out about, skills, work, contact, and footer."
```

---

## DevTools lab (required)

Pick **one** layout bug you cause on purpose (for example, delete `minmax(0, 1fr)` and put `1fr 1fr 1fr` with a huge unbreakable string in a card). Fix it with the box model overlay. Write three lines in `README.md` under a heading you will finish in Step 8: **Debugging lessons**.

---

## Today's gate

> I can say when I chose Flex (header, footer, card column) and when I chose Grid (page regions, card grid). I did not hide overflow on `body` to fake responsiveness.

Open [07-responsive-accessibility.md](07-responsive-accessibility.md).
