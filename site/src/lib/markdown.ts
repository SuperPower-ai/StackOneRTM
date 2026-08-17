import path from "node:path";
import { toString } from "hast-util-to-string";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export type TocItem = {
  depth: number;
  id: string;
  text: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function withBase(base: string, slug: string): string {
  const prefix = base.endsWith("/") ? base : `${base}/`;
  const clean = slug.replace(/^\/+/, "").replace(/\/+$/, "");
  return clean ? `${prefix}${clean}/` : prefix;
}

function rewriteHref(fromRel: string, href: string, base: string): string {
  if (!href || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href;
  }
  if (href.startsWith("#")) return href;

  const [rawPath, hash] = href.split("#");
  const suffix = hash ? `#${hash}` : "";
  if (!rawPath) return href;

  const decoded = decodeURI(rawPath);
  const fromDir = path.posix.dirname(fromRel.replaceAll("\\", "/"));
  const resolved = path.posix.normalize(path.posix.join(fromDir, decoded));

  if (resolved.includes("full_stack_mastery_roadmap")) {
    return `${withBase(base, "roadmap")}${suffix}`;
  }
  if (resolved.includes("full_stack_project_requirements_2026")) {
    const file = path.posix.basename(resolved).replace(/\.md$/i, "");
    if (file.toLowerCase() === "readme" || file === "all_project_requirements_combined") {
      return `${withBase(base, "projects")}${suffix}`;
    }
    return `${withBase(base, `projects/${file}`)}${suffix}`;
  }

  if (resolved.includes("project_guidance")) {
    let studio = resolved.replace(/^.*?project_guidance\//, "").replace(/\.md$/i, "");
    studio = studio.replace(/\/README$/i, "").replace(/^README$/i, "");
    const refAt = studio.search(/\/reference(?:\/|$)/);
    if (refAt !== -1) {
      let rest = studio.slice(refAt).replace(/^\/reference\/?/, "");
      rest = rest.replace(/(?:^|\/)index\.html$/i, "").replace(/\/$/, "");
      if (rest.toLowerCase() === "index.html") rest = "";
      const ext = path.posix.extname(rest).toLowerCase();
      const slug = `studio/preview/project-01${rest ? `/${rest}` : ""}`;
      if (ext && ext !== ".html" && ext !== ".md") {
        const prefix = base.endsWith("/") ? base : `${base}/`;
        return `${prefix}${slug}${suffix}`;
      }
      return `${withBase(base, slug.replace(/\.html$/i, ""))}${suffix}`;
    }
    if (!studio || studio === ".") return `${withBase(base, "studio")}${suffix}`;
    return `${withBase(base, `studio/${studio}`)}${suffix}`;
  }

  let slug = resolved.replace(/\.md$/i, "");
  slug = slug.replace(/\/README$/i, "").replace(/^README$/i, "");
  slug = slug.replace(/^textbook\//, "");
  if (slug === "." || slug === "") return `${withBase(base, "")}${suffix}`;
  if (slug.startsWith("../")) return href;
  return `${withBase(base, slug)}${suffix}`;
}

function remarkRewriteLinks(fromRel: string, base: string) {
  return (tree: { children: unknown[] }) => {
    visit(tree as never, "link", (node: { url: string }) => {
      node.url = rewriteHref(fromRel, node.url, base);
    });
  };
}

function remarkMermaid() {
  return (tree: { children: unknown[] }) => {
    visit(tree as never, "code", (node: { lang?: string; value: string }, index: number | undefined, parent: { children: unknown[] } | undefined) => {
      if (node.lang !== "mermaid" || !parent || index == null) return;
      const html = `<figure class="diagram"><pre class="mermaid">${escapeHtml(node.value)}</pre></figure>`;
      parent.children[index] = {
        type: "html",
        value: html,
      };
    });
  };
}

function rehypeCollectToc(items: TocItem[]) {
  return (tree: { children: unknown[] }) => {
    visit(tree as never, "element", (node: { tagName: string; properties?: { id?: string } }) => {
      if ((node.tagName === "h2" || node.tagName === "h3") && node.properties?.id) {
        items.push({
          depth: node.tagName === "h2" ? 2 : 3,
          id: String(node.properties.id),
          text: toString(node as never).trim(),
        });
      }
    });
  };
}

export async function renderMarkdown(
  markdown: string,
  fromRel: string,
  base: string,
): Promise<{ html: string; toc: TocItem[] }> {
  const toc: TocItem[] = [];
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMermaid)
    .use(() => remarkRewriteLinks(fromRel, base))
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(() => rehypeCollectToc(toc))
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      properties: { className: ["heading-anchor"], ariaLabel: "Link to this section" },
      content: {
        type: "text",
        value: "¶",
      },
    })
    .use(rehypePrettyCode, {
      theme: "github-dark-dimmed",
      keepBackground: false,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return { html: String(file), toc };
}
