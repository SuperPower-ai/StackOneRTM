export type DocMeta = Record<string, string>;

export type ParsedDoc = {
  kicker?: string;
  title: string;
  description: string;
  meta: DocMeta;
  body: string;
};

function stripMd(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
}

export function parseMarkdownDoc(markdown: string): ParsedDoc {
  const lines = markdown.replace(/^\uFEFF/, "").split(/\r?\n/);
  const headings: string[] = [];
  const meta: DocMeta = {};
  let i = 0;

  while (i < lines.length && lines[i].startsWith("# ")) {
    headings.push(lines[i].slice(2).trim());
    i += 1;
    while (i < lines.length && lines[i].trim() === "") i += 1;
  }

  while (i < lines.length) {
    const line = lines[i];
    const m = line.match(/^\*\*(.+?):\*\*\s*(.*)$/);
    if (m) {
      meta[m[1]] = stripMd(m[2]);
      i += 1;
      continue;
    }
    if (line.trim() === "") {
      i += 1;
      continue;
    }
    break;
  }

  if (lines[i]?.trim() === "---") i += 1;
  while (i < lines.length && lines[i].trim() === "") i += 1;

  const body = lines.slice(i).join("\n").trim();
  const title = headings[1] || headings[0] || "Untitled";
  const kicker = headings.length > 1 ? headings[0] : undefined;

  const descSource =
    meta["This month’s job"] ||
    meta["This month's job"] ||
    meta["Student state"] ||
    meta["Week rhythm today"] ||
    body
      .split("\n")
      .find((line) => line.trim() && !line.startsWith("#") && !line.startsWith("```")) ||
    title;

  return {
    kicker,
    title,
    description: stripMd(descSource).slice(0, 220),
    meta,
    body: body || markdown,
  };
}

export function parseMonthWeekDay(rel: string): {
  month?: number;
  week?: number;
  day?: number;
} {
  const month = rel.match(/month-(\d+)/i);
  const week = rel.match(/week-(\d+)/i);
  const day = rel.match(/day-(\d+)/i);
  return {
    month: month ? Number(month[1]) : undefined,
    week: week ? Number(week[1]) : undefined,
    day: day ? Number(day[1]) : undefined,
  };
}
