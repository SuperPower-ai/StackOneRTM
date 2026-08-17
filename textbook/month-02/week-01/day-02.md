# Month 2 · Week 1 · Day 2
# Text, Links, Images, Lists — and Broken HTML

**Month index:** [../../README.md](../../README.md)  
**Week 1:** [1](day-01.md) · Day 2 (today) · [3](day-03.md) · [4](day-04.md) · [5](day-05.md) · [6](day-06.md) · [7](day-07.md)  
**Week rhythm today:** Exercises + debugging  
**Study time:** 3–4 focused hours  
**Prereq:** Day 1 gate passed. `month-02/week-01/day-01/index.html` exists and was served over HTTP.

---

## Today's contract

By the end of this day you will be able to:

1. Choose `p`, `strong`, `em`, `small`, `blockquote`, `pre`/`code`, `time`, `abbr`, and know when **not** to use `br`.
2. Write links with `href`, descriptive text, and safe `target="_blank"`.
3. Write `img` with useful `alt`, `width`/`height`, and empty `alt` only when decorative.
4. Build `ul`, `ol`, `li`, and `dl` lists that match the meaning of the content.
5. Debug invalid nesting, missing `alt`, and “click here” by inspecting the DOM and the Accessibility pane.

**Today's gate**

> When is `alt=""` correct, and when is it a defect? Why is “click here” a bad link? Why is a user-typed string not something you paste into HTML as markup?

---

## Time box

| Block | Minutes | Work |
|---|---|---|
| A | 40 | Theory: text, links, images, lists, first security rule |
| B | 55 | Guided drills + deliberate defects |
| C | 70 | Independent debugging lab |
| D | 30 | Commit a repaired page |
| E | 15 | Closed-book recall |

---

# Block A — Theory

## 1. Paragraphs are the default for prose

`<p>` is a paragraph. One idea, then close the tag. Consecutive sentences in one `<p>` are fine. Two topics: two `<p>`s.

### 1.1 `br` is not a paragraph

`<br>` is a **line break inside** a unit that must keep those lines — a poem, an address block you have not marked up more carefully, a short verse.

```html
<p>
  100 Library Lane<br>
  Northside, ST 00000
</p>
```

Do **not** do this:

```html
Some text<br><br>
More text<br><br>
```

That is fake spacing. Screen readers may announce “break.” CSS margin is Week 3. Today: real paragraphs.

**Wrong belief:** “`<br>` is how I make space.”  
**Correct:** `<br>` is a newline inside one element. Vertical rhythm is CSS. New ideas are `<p>`.

---

## 2. Emphasis, importance, side comments

| Tag | Meaning | Not for |
|---|---|---|
| `em` | Stress emphasis (spoken stress) | Making text italic because it looks nice |
| `strong` | Strong importance | Making text bold because it looks nice |
| `small` | Side comment, fine print | “I want tiny type” as a layout tool |

```html
<p>Submit only after you <em>read</em> the hours.</p>
<p><strong>Warning:</strong> the branch is closed on Monday.</p>
<p><small>Hours last updated 12 August 2026.</small></p>
```

Default rendering is italic / bold / smaller. That is a convenience. You will restyle in Week 3. The tag is the meaning. If you only want smaller type with no “fine print” meaning, CSS on a `p` is honest. If you wrap everything in `strong`, nothing is important.

`b` and `i` exist. They are stylistic offsets without the emphasis semantics (`i` for a taxonomic name, `b` for a keyword in a list). Prefer `em` / `strong` when you mean emphasis or importance. Do not use `b` as a heading.

---

## 3. Quotes, code, time, abbreviations

### 3.1 `blockquote`

A quotation from another source. Include a citation when you have one (`cite` attribute is a URL; visible source can be a `<p>` or `<footer>` inside the blockquote, or a `<cite>` element).

```html
<blockquote cite="https://www.w3.org/TR/html/">
  <p>Authors are encouraged to use semantic elements.</p>
</blockquote>
```

Do not use `blockquote` to indent a note. That is an `aside` or a `p`.

### 3.2 `pre` and `code`

- `code` — a fragment of code, inline or as the only child of `pre`.
- `pre` — **preformatted** text: whitespace is kept. Terminal output, a poem with meaningful spaces, a code block.

```html
<p>The element is <code>&lt;main&gt;</code>.</p>
<pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;</code></pre>
```

Inside HTML, `<` and `&` in the **content** must be written as `&lt;` and `&amp;` or the browser will treat them as markup. That is not decoration. That is the first security lesson of the month.

### 3.3 `time`

A machine-readable datetime plus human text:

```html
<time datetime="2026-08-12">12 August 2026</time>
```

Use it for dates and times you care about as data. Do not wrap every number.

### 3.4 `abbr`

```html
<abbr title="HyperText Markup Language">HTML</abbr>
```

The `title` may show as a tooltip. Do not rely on hover alone; spell out the term on first use in the paragraph when the audience needs it.

---

## 4. Links

`<a href="...">` is a **hyperlink**. The content inside is the accessible name.

### 4.1 `href` shapes you will use

| Value | Meaning |
|---|---|
| `https://example.com/path` | Absolute URL |
| `library.html` | Relative file, same directory |
| `../day-01/index.html` | Relative, parent directory |
| `#hours` | Fragment on **this** page (`id="hours"`) |
| `mailto:you@example.com` | Opens a mail client — optional, often disappointing on machines with no mail app |
| `tel:+15555550100` | On phones, may start a call |

Prefer relative links between your own pages. Prefer `https://` for other sites.

### 4.2 Descriptive text

The link text must make sense **out of context**. Screen reader users jump from link to link.

- Defect: `Click here`, `Read more`, `Link`, `https://example.com/page/really/long`
- Correct: `Northside Branch hours`, `HTML element reference on MDN`

You may add extra context with surrounding sentence text; the `<a>` itself should still be understandable.

### 4.3 `target="_blank"` and `rel`

`target="_blank"` opens a new browsing context (a new tab). It is often unnecessary. If you use it:

```html
<a href="https://developer.mozilla.org/" target="_blank" rel="noopener noreferrer">MDN Web Docs</a>
```

`noopener` prevents the new page from getting `window.opener` (tabnabbing). `noreferrer` also omits the Referer header. Use both as a habit when `_blank` is required. Default: same tab.

### 4.4 Links vs buttons (preview)

If it **navigates**, it is a link. If it **does something on this page** (submit, open a widget), it is a `button` (Week 2). Do not use `<a href="#">` as a fake button. Do not use `<div onclick>` — you have no JavaScript yet, and you will not fake it with a `div`.

**Wrong belief:** “Blue underlined text is a link, so a `span` with CSS is the same.”  
**Correct:** a link is in the tab order, has a URL, and announces as a link. A `span` does none of that.

---

## 5. Images

```html
<img
  src="media/branch.svg"
  alt="Simple map pin icon for Northside Branch"
  width="400"
  height="225"
>
```

Void element: no `</img>`.

### 5.1 `src`

Path to the file. Relative paths are resolved against the page URL (another reason to use HTTP, not random `file://` habits). If `src` is wrong, you get a broken image. The `alt` still exists — that is the fallback.

### 5.2 `alt` — the job

`alt` is the **text equivalent** of the image, for:

- people who cannot see the image
- browsers that failed to load it
- search and other text consumers

Rules:

1. If the image **conveys information**, `alt` states that information. Not “image of a cat” — “Orange cat asleep on a keyboard,” if that is the point.
2. If the image is **decorative** (purely visual, no information), use `alt=""` — empty, not missing. Then assistive tech **skips** it.
3. Missing `alt` is worse than empty: many readers announce the filename.
4. Do not put the same sentence in `alt` and a caption beside the image; then it is read twice. Caption in a `<figcaption>` with `<figure>` when you have a caption.

### 5.3 `width` and `height`

Integer **pixel** dimensions of the image file (or the intended box). They let the browser reserve space before the file loads and reduce layout jump. They are not a substitute for responsive CSS (`max-width: 100%` is Week 4). Include them when you know the intrinsic size.

### 5.4 What not to put in `alt`

- `alt="image"`, `alt="photo"`, `alt="decorative image"`
- A novel. `alt` is equivalent content, not an essay — unless the image *is* a chart that must be described
- Keywords for SEO stuffing

**Wrong belief:** “Every image needs a long description in `alt`.”  
**Correct:** informative images need equivalent text. Decorative images need `alt=""`. Charts may need a text alternative nearby, not a 400-word `alt`.

---

## 6. Lists

If it is a list, use a list. Do not fake it with `<p>- item</p>`.

| Element | Meaning |
|---|---|
| `ul` | Unordered — order is not information (ingredients you can shuffle) |
| `ol` | Ordered — order is information (steps, ranking, numbered rules) |
| `li` | An item in `ul` or `ol` |
| `dl` | Description list: terms and descriptions |
| `dt` | Term |
| `dd` | Description of the preceding term |

```html
<ul>
  <li>HTML</li>
  <li>CSS</li>
</ul>

<ol>
  <li>Type the skeleton.</li>
  <li>Inspect the DOM.</li>
</ol>

<dl>
  <dt>Landmark</dt>
  <dd>A region assistive technology can jump to, such as <code>main</code>.</dd>
  <dt>DOM</dt>
  <dd>The tree the browser builds from markup.</dd>
</dl>
```

Nested lists: put a `ul`/`ol` **inside** an `li`, not beside it.

Do not use lists for layout (a row of buttons that are not a list of items). Navigation menus *are* lists of links — `nav` > `ul` > `li` > `a` is the usual pattern.

---

## 7. Security: text is text

This month you type your own HTML. Soon, **users** will type into forms (Week 2). Later, you will store that text and show it again.

**Rule:** user input is **data**. It is not markup. If someone types `<script>` or `<img src=x>` into a message field, you will eventually display that as **text**, never as HTML the browser should execute or parse as tags.

Today’s drill: when you show a snippet of HTML *as content*, escape `<` as `&lt;` and `&` as `&amp;`. That is the same mindset as “do not innerHTML untrusted strings” in Month 3.

You have no backend yet. Do not invent a “clever” contact form that writes the message into the page with JavaScript you copied. The form can exist; the message must not become tags.

**Wrong belief:** “If I trust myself, escaping is optional.”  
**Correct:** habits form on the first input. Treat every string that did not come from your static file as untrusted text.

---

## 8. Debugging HTML — a method

When the page is “wrong”:

1. **View Source** — did you save the file you think you opened?
2. **Elements** — what did the parser build? Mis-nested tags show up here.
3. **Console** — failed `src` / `href` often appear as 404 (Network tab).
4. **Accessibility pane** — is this a link, an image, a list? What is the name?

Name the failure: wrong path, wrong tag, missing attribute, parser repair. Do not change three things at once.

---

# Block B — Guided drills

Work in `~\fullstack-lab\month-02\week-01\day-02\`.

```powershell
cd ~\fullstack-lab\month-02\week-01
mkdir day-02
cd day-02
mkdir media
```

### Drill 1 — A local SVG image

Create `media/branch.svg` by typing:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225">
  <rect width="400" height="225" fill="#e6e2d9"/>
  <text x="200" y="120" text-anchor="middle" font-size="20" fill="#1a1a1a">Northside Branch</text>
</svg>
```

This is a real image file, not a CSS trick. You will use it in `index.html`.

### Drill 2 — Type the page

Create `index.html` with the Day 1 skeleton. Inside `body`:

- `header` / `nav` with two real links: this page and `../day-01/index.html` (descriptive text, not “click here”)
- `main` with `h1` “Text, links, images, lists”
- A `p` that uses `em`, `strong`, and `small` correctly
- A `blockquote` with one sentence you invent as a “citation” from your Day 1 notes
- A `pre`/`code` block showing a **one-line** HTML tag as text (escaped)
- A `p` with a `time` and an `abbr`
- An informative `img` pointing at `media/branch.svg` with `width`, `height`, and real `alt`
- A second `img` that is decorative (a tiny repeating motif — you may copy the SVG to `media/dot.svg` as a 16×16 grey circle). `alt=""`
- `ul` of three skills you are learning
- `ol` of the debugging method in section 8 (four steps)
- `dl` with two terms: `alt` and `href`
- `footer` with an external link to MDN’s `<img>` page, `rel="noopener noreferrer"` if you use `target="_blank"`

Serve:

```powershell
cd ~\fullstack-lab\month-02\week-01\day-02
python -m http.server 5500
```

Open `http://127.0.0.1:5500/`. Confirm the SVG renders. Confirm the relative link to Day 1 works (server root is `day-02`, so `../day-01/` is correct).

### Drill 3 — Break `alt` on purpose

Remove `alt` from the informative image. Inspect the image in the Accessibility pane. **Write in `notes.txt`:** what name is exposed?

Restore a proper `alt`.

Change decorative `alt=""` to `alt="decorative"`. **Write:** why that is worse than empty.

Restore `alt=""`.

### Drill 4 — Break a link on purpose

Change one in-page or relative `href` to `library-typo.html`. Click it. **Write:** the exact failure (404 in Network, or a browser file error). Restore.

### Drill 5 — Parser repair

Add this **temporarily** inside `main` (then remove after writing notes):

```html
<ul>
<li>One
<li>Two</li>
</ul>
```

Inspect. Did the browser close the first `li` for you? **Write:** “looks fine” is not validity. Restore proper `li` pairs.

---

# Block C — Independent debugging lab

Create `buggy.html` as a **deliberately bad** copy. Introduce **exactly these** defects (and no others):

1. Two `h1` elements.
2. One image with no `alt`.
3. A link whose text is `Click here`.
4. Paragraphs separated only by `<br><br>`.
5. A “list” written as three `p` tags starting with `- `.
6. `target="_blank"` without `rel`.
7. A `blockquote` used only to indent a warning that is not a quotation.

Write `DEBUG.md` with a table:

| Defect | How I found it | Fix |
|---|---|---|
| … | Elements / Accessibility / eyes | … |

Then create `repaired.html` that is the same content with all seven fixed. Do not add CSS. Do not add extra sections for decoration.

Serve and compare both files in the Accessibility pane. **Write:** two differences in the tree (landmarks, lists, images).

---

# Block D — Git

```powershell
cd ~\fullstack-lab
git add month-02/week-01/day-02
git commit -m "Month 2 Day 2: text, links, images, lists, and HTML debugging."
```

---

# Block E — Closed-book recall

1. `em` vs `strong` vs `small`.
2. When is `br` legitimate?
3. Why escape `<` inside a page that *shows* HTML as text?
4. What makes link text good?
5. Why `rel="noopener noreferrer"` with `target="_blank"`?
6. Informative `alt` vs `alt=""` vs missing `alt`.
7. Why `width` and `height` on `img`?
8. `ul` vs `ol` vs `dl`.
9. Link vs button (one sentence).

---

## Definition of done

- [ ] I can explain every text-level tag in today’s contract.
- [ ] I have a page with informative and decorative images, both correct `alt`.
- [ ] I have `ul`, `ol`, and `dl` used for real lists.
- [ ] I diagnosed seven defects in `DEBUG.md` and produced `repaired.html`.
- [ ] I can explain the user-text-is-not-HTML rule.
- [ ] I committed Day 2.
- [ ] I typed the markup; I did not paste a finished page from AI.

---

## Common failures on Day 2

| What happened | What it usually means |
|---|---|
| SVG does not show | Wrong `src` relative to the HTML file, or server started in the wrong folder |
| Day 1 link 404 | `href` does not match the real relative path from `day-02` |
| Decorative image still announced | `alt` missing or non-empty |
| Nested list looks wrong | Inner `ul` not inside `li` |

---

## Tomorrow — Day 3

**Week rhythm:** Implement from memory.

Day 1–2 textbook files stay closed. You will rebuild a document that uses today’s tags. No full solution in that file.

---

## Optional review links

Text, links, images, and lists are explained in this chapter. These pages are for later checking, not for first learning.

- [MDN: Text fundamentals](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Headings_and_paragraphs)
- [MDN: Emphasis and importance](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/em)
- [MDN: `<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a)
- [MDN: `<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)
- [MDN: Images in HTML](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_images)
- [MDN: Lists](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Lists)
- [MDN: `rel="noopener"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/noopener)
