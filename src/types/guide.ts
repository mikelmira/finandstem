/**
 * Guide frontmatter contract.
 *
 * Every `.mdx` file in `src/content/guides/` must include valid YAML
 * frontmatter at the top. The loader (`src/lib/guides.ts`) parses it and
 * throws at build time if a required field is missing — so a typo in
 * a single article fails CI rather than silently shipping broken JSON-LD.
 *
 * Add new optional fields freely. Add new required fields only when every
 * existing guide can be updated in the same commit.
 */

export type GuideKind =
  | "compatibility"
  | "comparison"
  | "list"
  | "setup"
  | "faq"
  | "biotope";

export type GuidePillarHref =
  | "/planted-tank-guide"
  | "/aquarium-fish-guide"
  | "/freshwater-shrimp-guide"
  | "/aquatic-moss-guide"
  | "/aquarium-hardscape-guide"
  | "/aquarium-equipment-guide";

export interface GuideFaqItem {
  question: string;
  answer: string;
}

export interface GuideFrontmatter {
  /** URL slug. MUST match the filename (minus extension). */
  slug: string;
  /** H1 + <title>. Keep ≤ 60 chars for clean SERPs. */
  title: string;
  /** Meta description. Keep ≤ 155 chars. */
  description: string;
  /** ISO 8601 timestamp the article was first published. */
  publishedAt: string;
  /** ISO 8601 timestamp the article was last meaningfully updated. */
  updatedAt: string;
  /** Article shape — drives layout hints + schema variants. */
  kind: GuideKind;
  /** The single search query this article is written for. */
  targetQuery: string;
  /** Free-form keyword list for `<meta keywords>` + schema. */
  keywords: ReadonlyArray<string>;
  /** Pillar this guide hangs under (see seo/internal-linking-rules.md §7). */
  pillar: GuidePillarHref;
  /**
   * "category:slug" identifiers — at least 3 per the linking rules.
   * Used to render sideways links + populate JSON-LD related entities.
   */
  relatedSpecies: ReadonlyArray<string>;
  /** Optional. Path under `/public`, e.g. `/images/guides/neon-cherry.webp`. */
  heroImage?: string;
  /** Optional. Alt text for the hero image. */
  heroAlt?: string;
  /**
   * Optional. Set `false` to keep the file in the repo (e.g. drafts,
   * templates) but exclude it from /guides listing, sitemap, and llms.txt.
   * Defaults to `true`.
   */
  published?: boolean;
  /**
   * Optional. FAQ pairs surfaced both visually and in `FAQPage` JSON-LD.
   * Encourage 4+ per article. Authors can also add an `## FAQ` heading
   * to the markdown body — the schema only sees what's in frontmatter.
   */
  faqs?: ReadonlyArray<GuideFaqItem>;
  /**
   * Optional. Sources for the "Sources & further reading" block at the
   * end of the article. Authors can render the `<Sources />` component
   * directly in the body if they prefer.
   */
  sources?: ReadonlyArray<{ label: string; url: string }>;
}

export interface GuideEntry {
  frontmatter: GuideFrontmatter;
  /** Raw markdown body, no frontmatter. */
  raw: string;
}
