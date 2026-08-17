const base = import.meta.env.BASE_URL;

function currentTheme(): "light" | "dark" {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function setTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("fsm-theme", theme);
  void renderMermaid(true);
}

function wrapCodeBlocks() {
  document.querySelectorAll(".content pre").forEach((pre) => {
    if (pre.classList.contains("mermaid") || pre.parentElement?.classList.contains("code-wrap")) return;
    const wrap = document.createElement("div");
    wrap.className = "code-wrap";
    pre.parentElement?.insertBefore(wrap, pre);
    wrap.appendChild(pre);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-btn";
    button.textContent = "Copy";
    button.addEventListener("click", async () => {
      await navigator.clipboard.writeText(pre.textContent || "");
      button.textContent = "Copied";
      setTimeout(() => {
        button.textContent = "Copy";
      }, 1400);
    });
    wrap.appendChild(button);
  });
}

async function renderMermaid(force = false) {
  const nodes = [...document.querySelectorAll<HTMLElement>("pre.mermaid")];
  if (!nodes.length) return;
  const { default: mermaid } = await import("mermaid");
  nodes.forEach((node) => {
    if (!node.dataset.source) node.dataset.source = node.textContent || "";
    if (force) {
      node.textContent = node.dataset.source;
      node.removeAttribute("data-processed");
    }
  });
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    theme: currentTheme() === "dark" ? "dark" : "neutral",
  });
  await mermaid.run({ nodes });
}

function bindProgress() {
  const bar = document.querySelector<HTMLElement>("[data-progress]");
  const article = document.querySelector("article.article");
  if (!bar || !article) return;
  const onScroll = () => {
    const total = article.scrollHeight - window.innerHeight;
    const passed = Math.min(Math.max(-article.getBoundingClientRect().top, 0), Math.max(total, 1));
    bar.style.width = `${total > 0 ? (passed / total) * 100 : 0}%`;
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function bindToc() {
  const links = [...document.querySelectorAll<HTMLAnchorElement>(".toc a")];
  const headings = links
    .map((link) => document.getElementById(link.getAttribute("href")?.slice(1) || ""))
    .filter((node): node is HTMLElement => Boolean(node));
  if (!headings.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)[0];
      if (!visible?.target.id) return;
      links.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    { rootMargin: "-18% 0px -70% 0px" },
  );
  headings.forEach((heading) => observer.observe(heading));
}

function bindNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const overlay = document.querySelector("[data-nav-overlay]");
  const close = () => {
    document.body.classList.remove("nav-open");
    toggle?.setAttribute("aria-expanded", "false");
  };
  toggle?.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  overlay?.addEventListener("click", close);
}

type Hit = { title: string; kicker?: string; href: string; kind: string };

function bindSearch() {
  const dialog = document.querySelector<HTMLDialogElement>("[data-search-dialog]");
  const input = document.querySelector<HTMLInputElement>("[data-search-input]");
  const list = document.querySelector("[data-search-hits]");
  const raw = document.querySelector("#search-catalog")?.textContent || "[]";
  const catalog = JSON.parse(raw) as Hit[];
  if (!dialog || !input || !list) return;

  const render = (query: string) => {
    const q = query.trim().toLowerCase();
    const hits = (
      q
        ? catalog.filter((item) => `${item.title} ${item.kicker || ""} ${item.href}`.toLowerCase().includes(q))
        : catalog.filter((item) => item.kind === "month")
    ).slice(0, 18);
    const kindLabel: Record<string, string> = {
      month: "Month",
      day: "Day",
      project: "Spec",
      "projects-index": "Projects",
      workshop: "Workshop",
      "workshop-step": "Studio",
      "workshop-index": "Studio",
    };
    list.innerHTML = hits
      .map(
        (hit) =>
          `<li><a href="${base}${hit.href}/"><strong>${hit.title}</strong><small>${hit.kicker || kindLabel[hit.kind] || hit.kind}</small></a></li>`,
      )
      .join("") || `<li class="search-empty">Nothing matches yet. Try “postgres”, “session”, or “Month 14”.</li>`;
  };

  const open = () => {
    dialog.showModal();
    render(input.value);
    input.focus();
  };

  document.querySelectorAll("[data-search-open]").forEach((button) => {
    button.addEventListener("click", open);
  });
  input.addEventListener("input", () => render(input.value));
  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
    if (event.key === "/" && !typing) {
      event.preventDefault();
      open();
    }
  });
}

function bindTheme() {
  document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
    setTheme(currentTheme() === "dark" ? "light" : "dark");
  });
}

wrapCodeBlocks();
void renderMermaid();
bindProgress();
bindToc();
bindNav();
bindSearch();
bindTheme();
rememberPlace();
showContinue();

function rememberPlace() {
  const article = document.querySelector<HTMLElement>("[data-read-slug]");
  if (!article?.dataset.readSlug) return;
  localStorage.setItem(
    "fsm-continue",
    JSON.stringify({
      slug: article.dataset.readSlug,
      title: article.dataset.readTitle || article.dataset.readSlug,
    }),
  );
}

function showContinue() {
  const links = document.querySelectorAll<HTMLAnchorElement>("[data-continue-link], [data-home-continue]");
  const resumeTitle = document.querySelector("[data-resume-title]");
  links.forEach((link) => {
    link.hidden = false;
    link.removeAttribute("hidden");
    link.removeAttribute("aria-disabled");
    link.removeAttribute("disabled");
  });
  try {
    const raw = localStorage.getItem("fsm-continue");
    if (!raw) return;
    const saved = JSON.parse(raw) as { slug: string; title: string };
    if (!saved.slug) return;
    const href = `${base}${saved.slug.replace(/^\/+/, "")}/`;
    links.forEach((link) => {
      link.href = href;
    });
    if (resumeTitle) resumeTitle.textContent = saved.title;
  } catch {
    /* keep the Day 1 fallback */
  }
}
