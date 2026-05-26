/**
 * scripts/build-llms-txt.mjs
 *
 * Reads `seo/llms.txt` (the curated source of truth) and, when published
 * guides exist in `src/content/guides/`, appends a "## Published guides"
 * section listing each guide URL + title. Writes the result to
 * `public/llms.txt` which the site serves at /llms.txt.
 *
 * Runs as a prebuild step (see package.json `build` script). No external
 * runtime — uses native fs + gray-matter (already installed).
 *
 * Idempotent: re-running with the same input produces the same output.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const TEMPLATE_PATH = path.join(ROOT, "seo", "llms.txt");
const OUTPUT_PATH = path.join(ROOT, "public", "llms.txt");
const GUIDES_DIR = path.join(ROOT, "src", "content", "guides");

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://finandstem.com";

// README, CHANGELOG, etc. live alongside the .mdx articles. Skip them.
const NON_GUIDE_FILES = new Set([
  "readme.md",
  "readme.mdx",
  "changelog.md",
  "license.md",
]);

function readPublishedGuides() {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  return fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .filter((f) => !NON_GUIDE_FILES.has(f.toLowerCase()))
    .map((filename) => {
      const file = fs.readFileSync(path.join(GUIDES_DIR, filename), "utf8");
      const { data } = matter(file);
      return data;
    })
    .filter((fm) => fm.published !== false && fm.slug)
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

function buildGuidesSection(guides) {
  if (guides.length === 0) return "";
  const lines = [
    "",
    "## Published guides",
    "",
    "Long-form articles answering specific aquascaping queries — each one cross-references catalogue entries and links up to its pillar guide.",
    "",
    ...guides.map(
      (g) => `- [${g.title}](${SITE_URL}/guides/${g.slug}): ${g.description ?? ""}`.trim(),
    ),
    "",
  ];
  return lines.join("\n");
}

function main() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.warn(
      `[build-llms-txt] Template not found at ${TEMPLATE_PATH} — skipping`,
    );
    return;
  }
  const template = fs.readFileSync(TEMPLATE_PATH, "utf8").trimEnd();
  const guides = readPublishedGuides();
  const generated = template + buildGuidesSection(guides) + "\n";
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, generated, "utf8");
  console.log(
    `[build-llms-txt] Wrote ${OUTPUT_PATH} — ${guides.length} published guide(s)`,
  );
}

main();
