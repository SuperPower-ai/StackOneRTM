import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

const siteDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(siteDir, "..");

const fixturesSrc = path.join(repoRoot, "textbook", "month-04", "fixtures");
const fixturesDest = path.join(siteDir, "public", "textbook", "month-04", "fixtures");
if (fs.existsSync(fixturesSrc)) {
  fs.mkdirSync(path.dirname(fixturesDest), { recursive: true });
  fs.cpSync(fixturesSrc, fixturesDest, { recursive: true });
}

const previewSrc = path.join(
  repoRoot,
  "project_guidance",
  "project-01-accessible-responsive-portfolio",
  "reference",
);
const previewDest = path.join(siteDir, "public", "studio", "preview", "project-01");
if (fs.existsSync(previewSrc)) {
  fs.mkdirSync(path.dirname(previewDest), { recursive: true });
  fs.cpSync(previewSrc, previewDest, { recursive: true });
}

const repo = process.env.GITHUB_REPOSITORY || "";
const repoName = repo.split("/")[1] || "";
const isUserSite = repoName.endsWith(".github.io");
const base =
  process.env.BASE_PATH ||
  (repoName && !isUserSite ? `/${repoName}/` : "/");

export default defineConfig({
  site: process.env.SITE_URL || "http://localhost:4321",
  base,
  trailingSlash: "always",
  output: "static",
  compressHTML: true,
  prefetch: true,
  integrations: [sitemap()],
  vite: {
    server: {
      fs: {
        allow: [siteDir, repoRoot],
      },
    },
  },
});
