/**
 * Guide loader, reads `.mdx` files from `src/content/guides/`, parses
 * YAML frontmatter, and exposes a typed list to the rest of the app.
 *
 * Runs at build time inside RSCs. Throws synchronously when a guide is
 * missing a required field, so CI catches editorial mistakes before they
 * reach production.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { GuideEntry, GuideFrontmatter } from "@/types/guide";

const GUIDES_DIR = path.join(process.cwd(), "src", "content", "guides");

const REQUIRED_FIELDS = [
  "slug",
  "title",
  "description",
  "publishedAt",
  "updatedAt",
  "kind",
  "targetQuery",
  "pillar",
  "relatedSpecies",
] as const;

/**
 * Files in the guides folder that are documentation rather than articles.
 * README, CHANGELOG, etc. live alongside the .mdx articles but should not
 * be parsed as guides. Match exact filenames (case-insensitive).
 */
const NON_GUIDE_FILES: ReadonlySet<string> = new Set([
  "readme.md",
  "readme.mdx",
  "changelog.md",
  "license.md",
]);

function readAllGuideFiles(): string[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  return fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .filter((f) => !NON_GUIDE_FILES.has(f.toLowerCase()));
}

function parseFile(filename: string): GuideEntry | null {
  const filePath = path.join(GUIDES_DIR, filename);
  const file = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(file);

  for (const key of REQUIRED_FIELDS) {
    if (data[key] === undefined || data[key] === null) {
      throw new Error(
        `Guide "${filename}" is missing required frontmatter field: ${key}`,
      );
    }
  }

  // Backfill defaults for optional fields so consumers don't need ??.
  // Spread the user data first so its values win; then fill in defaults
  // only when a field wasn't provided.
  const parsed = data as GuideFrontmatter;
  const frontmatter: GuideFrontmatter = {
    ...parsed,
    keywords: parsed.keywords ?? [],
    published: parsed.published ?? true,
  };

  // Sanity check: filename must match the slug. Catches copy-paste typos.
  const expectedFilename = `${frontmatter.slug}.mdx`;
  const expectedFilenameMd = `${frontmatter.slug}.md`;
  if (filename !== expectedFilename && filename !== expectedFilenameMd) {
    throw new Error(
      `Guide "${filename}" has slug "${frontmatter.slug}", filename must match.`,
    );
  }

  return { frontmatter, raw: content };
}

/** All guides flagged `published: true`, newest first. */
export function listGuides(): GuideFrontmatter[] {
  return readAllGuideFiles()
    .map((f) => parseFile(f))
    .filter((g): g is GuideEntry => Boolean(g))
    .map((g) => g.frontmatter)
    .filter((fm) => fm.published !== false)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** All guides including unpublished drafts and templates. */
export function listAllGuides(): GuideFrontmatter[] {
  return readAllGuideFiles()
    .map((f) => parseFile(f))
    .filter((g): g is GuideEntry => Boolean(g))
    .map((g) => g.frontmatter)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/**
 * Read one guide by slug. Returns `null` (rather than throwing) when the
 * file simply doesn't exist, that's how `/guides/[slug]` renders 404.
 */
export function getGuide(slug: string): GuideEntry | null {
  const mdx = `${slug}.mdx`;
  const md = `${slug}.md`;
  const filename = readAllGuideFiles().find(
    (f) => f === mdx || f === md,
  );
  return filename ? parseFile(filename) : null;
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}
