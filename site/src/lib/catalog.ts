import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MONTHS } from "../data/months";
import { parseMarkdownDoc, parseMonthWeekDay } from "./parse";

const libDir = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(libDir, "../../..");
export const TEXTBOOK_DIR = path.join(REPO_ROOT, "textbook");
export const PROJECTS_DIR = path.join(REPO_ROOT, "full_stack_project_requirements_2026");
export const ROADMAP_FILE = path.join(REPO_ROOT, "full_stack_mastery_roadmap_expert_2026.md");

export type DocKind = "month" | "day" | "project" | "projects-index" | "roadmap";

export type DocRecord = {
  kind: DocKind;
  slug: string;
  rel: string;
  file: string;
  title: string;
  kicker?: string;
  description: string;
  month?: number;
  week?: number;
  day?: number;
  meta: Record<string, string>;
  body: string;
};

export type NavDay = {
  day: number;
  title: string;
  slug: string;
};

export type NavWeek = {
  week: number;
  days: NavDay[];
};

export type NavMonth = {
  number: number;
  slug: string;
  title: string;
  status: "published" | "forthcoming";
  weeks: NavWeek[];
};

export type SearchHit = {
  title: string;
  kicker?: string;
  href: string;
  kind: DocKind;
};

function walkMarkdown(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "fixtures" || entry.name === "node_modules") continue;
      out.push(...walkMarkdown(full));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
}

function toPosix(rel: string): string {
  return rel.replaceAll("\\", "/");
}

function fileToDoc(file: string, kind: DocKind, slug: string, rel: string): DocRecord {
  const markdown = fs.readFileSync(file, "utf8");
  const parsed = parseMarkdownDoc(markdown);
  const loc = parseMonthWeekDay(rel);
  return {
    kind,
    slug,
    rel: toPosix(rel),
    file,
    title: parsed.title,
    kicker: parsed.kicker,
    description: parsed.description,
    month: loc.month,
    week: loc.week,
    day: loc.day,
    meta: parsed.meta,
    body: parsed.body,
  };
}

let cache: DocRecord[] | null = null;

export function loadAllDocs(): DocRecord[] {
  if (cache) return cache;
  const docs: DocRecord[] = [];

  for (const file of walkMarkdown(TEXTBOOK_DIR)) {
    const rel = toPosix(path.relative(TEXTBOOK_DIR, file));
    if (rel.toLowerCase() === "readme.md") continue;
    const parts = rel.split("/");
    const base = parts.at(-1) || "";
    if (base.toLowerCase() === "readme.md" && parts.length === 2) {
      const slug = parts[0];
      docs.push(fileToDoc(file, "month", slug, rel));
      continue;
    }
    if (/^day-\d+\.md$/i.test(base)) {
      const slug = rel.replace(/\.md$/i, "");
      docs.push(fileToDoc(file, "day", slug, rel));
    }
  }

  if (fs.existsSync(path.join(PROJECTS_DIR, "README.md"))) {
    docs.push(
      fileToDoc(
        path.join(PROJECTS_DIR, "README.md"),
        "projects-index",
        "projects",
        "full_stack_project_requirements_2026/README.md",
      ),
    );
  }

  for (const file of walkMarkdown(PROJECTS_DIR)) {
    const name = path.basename(file);
    if (name.toLowerCase() === "readme.md") continue;
    if (name === "all_project_requirements_combined.md") continue;
    const slug = `projects/${name.replace(/\.md$/i, "")}`;
    docs.push(
      fileToDoc(file, "project", slug, `full_stack_project_requirements_2026/${name}`),
    );
  }

  if (fs.existsSync(ROADMAP_FILE)) {
    docs.push(
      fileToDoc(ROADMAP_FILE, "roadmap", "roadmap", "full_stack_mastery_roadmap_expert_2026.md"),
    );
  }

  cache = docs;
  return docs;
}

export function getDoc(slug: string): DocRecord | undefined {
  return loadAllDocs().find((doc) => doc.slug === slug);
}

export function readingOrder(): DocRecord[] {
  const docs = loadAllDocs();
  const months = docs
    .filter((d) => d.kind === "month")
    .sort((a, b) => (a.month || 0) - (b.month || 0));
  const days = docs
    .filter((d) => d.kind === "day")
    .sort((a, b) => {
      const am = a.month || 0;
      const bm = b.month || 0;
      if (am !== bm) return am - bm;
      const aw = a.week || 0;
      const bw = b.week || 0;
      if (aw !== bw) return aw - bw;
      return (a.day || 0) - (b.day || 0);
    });

  const ordered: DocRecord[] = [];
  for (const month of months) {
    ordered.push(month);
    ordered.push(...days.filter((d) => d.month === month.month));
  }
  return ordered;
}

export function neighbors(slug: string): { prev?: DocRecord; next?: DocRecord } {
  const order = readingOrder();
  const i = order.findIndex((d) => d.slug === slug);
  if (i < 0) return {};
  return { prev: order[i - 1], next: order[i + 1] };
}

export function buildNav(): NavMonth[] {
  const docs = loadAllDocs();
  return MONTHS.map((info) => {
    const weeks: NavWeek[] = [];
    for (let w = 1; w <= 4; w += 1) {
      const days = docs
        .filter((d) => d.kind === "day" && d.month === info.number && d.week === w)
        .sort((a, b) => (a.day || 0) - (b.day || 0))
        .map((d) => ({
          day: d.day || 0,
          title: d.title,
          slug: d.slug,
        }));
      if (days.length) weeks.push({ week: w, days });
    }
    return {
      number: info.number,
      slug: info.slug,
      title: info.title,
      status: info.status,
      weeks,
    };
  });
}

export function searchIndex(): SearchHit[] {
  return loadAllDocs()
    .filter((d) => d.kind !== "roadmap")
    .map((d) => ({
      title: d.title,
      kicker: d.kicker,
      href: d.slug,
      kind: d.kind,
    }));
}

export function firstDaySlug(): string {
  return "month-01/week-01/day-01";
}
