# Claude Code Prompt: MDX guides pipeline

> Copy everything below the divider into Claude Code at the root of the `finandstem/` repo. Open it as the first task of the session.

---

You are wiring up an MDX-based guides pipeline for Fin & Stem so Mike can write articles as markdown files in the repo, commit, and have them auto-deploy. No CMS. Read these files first:

1. `seo-geo-strategy.md` — the strategy doc
2. `seo-audit-2026.md` — the audit (especially §2.7 content-gap table)
3. `seo/page-templates.md` — Template 4 (Guide / Long-tail article) defines the on-page structure
4. `seo/internal-linking-rules.md` — the linking rules every guide must follow
5. `seo/json-ld-templates.md` — Article + FAQPage schema
6. `CLAUDE.md` — full project brief
7. `skills/content-research-writer/SKILL.md` — the writing workflow Mike will use

Operating rules:
- Use Plan Mode first to lay out the multi-file work, then execute.
- Run `pnpm typecheck` (or `pnpm build`) after each major change.
- Don't introduce libraries not listed below.
- Don't deploy.

---

## Goal

Ship a working markdown-in-the-repo article pipeline with these properties:

1. **A new `.mdx` file in `src/content/guides/<slug>.mdx` auto-becomes a live page** at `/guides/<slug>` after `git push`.
2. Each article inherits the full SEO/AEO scaffold — TL;DR block, FAQ, sources, author byline, JSON-LD, breadcrumbs — without per-article wiring.
3. Articles can drop in `<SpeciesCard slug="neon-tetra" />`, `<PillarLink href="/aquarium-fish-guide" />`, `<BuildLink slug="30l-shrimp-nursery" />`, `<ExternalLink href="https://fishbase.se/..." />`, `<Faq items={...} />`, and `<Sources items={...} />` directly inside the markdown.
4. A `/guides` index page lists all published articles, newest first.
5. The sitemap and llms.txt include every published guide automatically.
6. Frontmatter is strongly-typed; a missing required field fails the build.

---

## Implementation tasks

### Task 1 — Install dependencies

```bash
pnpm add @next/mdx @mdx-js/loader @mdx-js/react @types/mdx gray-matter
pnpm add -D rehype-slug rehype-autolink-headings remark-gfm
```

These are stable, mainstream, zero-config-headache packages. No alternatives — just install them.

### Task 2 — Add MDX support to `next.config.ts`

Update `next.config.ts` to wrap with `withMDX`:

```typescript
import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    // … existing remotePatterns
  },
  async headers() {
    // … existing security headers from prompt 02
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        { behavior: "wrap", properties: { className: "anchor-link" } },
      ],
    ],
  },
});

export default withMDX(nextConfig);
```

### Task 3 — Frontmatter types

Create `src/types/guide.ts`:

```typescript
import type { CatalogueCategory } from "@/types/catalogue";

export type GuideKind = "compatibility" | "comparison" | "list" | "setup" | "faq" | "biotope";

export interface GuideFrontmatter {
  /** URL slug. Must match the filename. */
  slug: string;
  /** H1 + <title>. ≤60 chars. */
  title: string;
  /** Meta description. ≤155 chars. */
  description: string;
  /** ISO 8601. */
  publishedAt: string;
  /** ISO 8601. */
  updatedAt: string;
  /** What kind of guide. Drives schema variants. */
  kind: GuideKind;
  /** Target search query. */
  targetQuery: string;
  /** Free-form keyword list for metadata. */
  keywords: string[];
  /** Pillar this guide belongs under. Required — see internal-linking-rules.md Rule 7. */
  pillar:
    | "/planted-tank-guide"
    | "/aquarium-fish-guide"
    | "/freshwater-shrimp-guide"
    | "/aquatic-moss-guide"
    | "/aquarium-hardscape-guide"
    | "/aquarium-equipment-guide";
  /** "category:slug" identifiers — at least 3 per internal-linking-rules.md Rule 6. */
  relatedSpecies: string[];
  /** Optional. Path under public/, e.g. /images/guides/neon-cherry.jpg */
  heroImage?: string;
  /** Optional. Alt text for hero. */
  heroAlt?: string;
  /** Optional. Set false to keep the file in the repo but exclude from listing/sitemap. */
  published?: boolean;
  /** Optional. True if Mike has first-hand experience on this topic. */
  keptByAuthor?: boolean;
}

export interface Guide {
  frontmatter: GuideFrontmatter;
  /** Compiled React node (the MDX body). */
  body: React.ReactNode;
  /** Estimated reading time in minutes. */
  readingTimeMin: number;
  /** Approximate word count. */
  wordCount: number;
}
```

### Task 4 — Guide loader

Create `src/lib/guides.ts`:

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { GuideFrontmatter } from "@/types/guide";

const GUIDES_DIR = path.join(process.cwd(), "src", "content", "guides");

function readAllGuideFiles(): string[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  return fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
}

function parseFile(filename: string): { frontmatter: GuideFrontmatter; raw: string } | null {
  const filePath = path.join(GUIDES_DIR, filename);
  const file = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(file);

  // Required fields — fail the build loudly if missing.
  const required = [
    "slug", "title", "description", "publishedAt", "updatedAt",
    "kind", "targetQuery", "pillar", "relatedSpecies",
  ] as const;
  for (const key of required) {
    if (data[key] === undefined || data[key] === null) {
      throw new Error(`Guide ${filename} is missing required frontmatter: ${key}`);
    }
  }

  return { frontmatter: data as GuideFrontmatter, raw: content };
}

export function listGuides(): GuideFrontmatter[] {
  return readAllGuideFiles()
    .map((f) => parseFile(f))
    .filter((g): g is { frontmatter: GuideFrontmatter; raw: string } => Boolean(g))
    .map((g) => g.frontmatter)
    .filter((fm) => fm.published !== false)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getGuideBySlug(slug: string): GuideFrontmatter | null {
  const fileMdx = path.join(GUIDES_DIR, `${slug}.mdx`);
  const fileMd = path.join(GUIDES_DIR, `${slug}.md`);
  const target = fs.existsSync(fileMdx) ? `${slug}.mdx` : fs.existsSync(fileMd) ? `${slug}.md` : null;
  if (!target) return null;
  const parsed = parseFile(target);
  return parsed?.frontmatter ?? null;
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}
```

### Task 5 — MDX components

Create `src/mdx-components.tsx` (Next.js convention — auto-detected):

```typescript
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { SpeciesCard } from "@/components/mdx/species-card";
import { PillarLink } from "@/components/mdx/pillar-link";
import { BuildLink } from "@/components/mdx/build-link";
import { ExternalLink } from "@/components/mdx/external-link";
import { Faq } from "@/components/seo/faq";
import { Sources } from "@/components/seo/sources";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Style every link
    a: ({ href, children, ...props }) => {
      const isExternal = href?.startsWith("http");
      if (isExternal) {
        return <ExternalLink href={href!} {...props}>{children}</ExternalLink>;
      }
      return (
        <Link href={href ?? "#"} className="text-[var(--brand)] underline decoration-[var(--brand)]/40 underline-offset-4 hover:decoration-[var(--brand)]" {...props}>
          {children}
        </Link>
      );
    },
    // Custom MDX components
    SpeciesCard,
    PillarLink,
    BuildLink,
    ExternalLink,
    Faq,
    Sources,
    ...components,
  };
}
```

Create each component under `src/components/mdx/`:

**`species-card.tsx`** — inline catalogue card that pulls from `src/data` by slug, renders the photo, common name, scientific name italicised, and a one-line spec callout. Must link to `/category/slug`.

```tsx
import Link from "next/link";
import Image from "next/image";
import { allEntries, getImage } from "@/data";
import { CATEGORY_META } from "@/types/catalogue";

interface SpeciesCardProps {
  slug: string;
  category?: "fish" | "plants" | "shrimp" | "mosses";
  size?: "sm" | "md";
}

export function SpeciesCard({ slug, category, size = "md" }: SpeciesCardProps) {
  const entry =
    category != null
      ? allEntries.find((e) => e.slug === slug && e.category === category)
      : allEntries.find((e) => e.slug === slug);

  if (!entry) {
    return (
      <span className="text-sm text-destructive">
        [SpeciesCard: no entry for slug &quot;{slug}&quot;]
      </span>
    );
  }

  const meta = CATEGORY_META[entry.category];
  const image = getImage(entry.slug);

  return (
    <Link
      href={`${meta.path}/${entry.slug}`}
      className="glass glass-edge lift my-6 flex items-stretch overflow-hidden rounded-2xl no-underline"
      data-mdx="species-card"
    >
      <div className="relative aspect-square w-32 shrink-0 overflow-hidden">
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="160px"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1 p-4">
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
          {meta.singular}
        </span>
        <span className="text-display-tight text-lg leading-tight">
          {entry.commonName}
        </span>
        <span className="text-xs italic text-muted-foreground">
          {entry.scientificName}
        </span>
      </div>
    </Link>
  );
}
```

**`pillar-link.tsx`** — clearly-marked CTA linking up to a pillar page:

```tsx
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface PillarLinkProps {
  href: string;
  children: React.ReactNode;
}

export function PillarLink({ href, children }: PillarLinkProps) {
  return (
    <aside className="my-6 flex items-center gap-3 rounded-2xl border-l-4 border-[var(--brand)] bg-muted/30 p-5">
      <ArrowUpRight className="size-5 text-[var(--brand)]" aria-hidden />
      <p className="text-sm">
        For the full context, read{" "}
        <Link href={href} className="font-medium text-foreground underline decoration-[var(--brand)]/40 underline-offset-4 hover:text-[var(--brand)]">
          {children}
        </Link>
        .
      </p>
    </aside>
  );
}
```

**`build-link.tsx`** — placeholder for now (no builds yet); resolves slug to `/builds/<slug>` and renders a small card. Gracefully returns `null` if the build doesn't exist.

**`external-link.tsx`** — wraps every external link with `rel="noopener noreferrer"`, `target="_blank"`, and a small external-link icon. Adds `rel="nofollow"` for non-authority domains (configurable allow-list of authority domains like fishbase.se, gbif.org, en.wikipedia.org, seriouslyfish.com, 2hraquarist.com, etc.).

### Task 6 — JSON-LD for guides

Extend `src/lib/seo.ts` with `guidePageJsonLd`:

```typescript
import type { GuideFrontmatter } from "@/types/guide";
import type { FaqItem } from "@/lib/seo";

export interface GuideSchemaInput {
  guide: GuideFrontmatter;
  tldr: string;
  faqs: ReadonlyArray<FaqItem>;
  wordCount: number;
}

export function guidePageJsonLd({ guide, tldr, faqs, wordCount }: GuideSchemaInput) {
  const url = `${site.url}/guides/${guide.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        mainEntityOfPage: url,
        url,
        headline: guide.title,
        description: guide.description || tldr,
        datePublished: guide.publishedAt,
        dateModified: guide.updatedAt,
        inLanguage: "en",
        wordCount,
        author: personEntity(),
        publisher: organizationEntity(),
        keywords: guide.keywords.join(", "),
        articleSection: "Guides",
        ...(guide.heroImage ? { image: [`${site.url}${guide.heroImage}`] } : {}),
      },
      breadcrumbsJsonLd([
        { name: "Home", href: "/" },
        { name: "Guides", href: "/guides" },
        { name: guide.title },
      ]),
      faqs.length > 0
        ? {
            "@type": "FAQPage",
            "@id": `${url}#faq`,
            mainEntity: faqs.map((q) => ({
              "@type": "Question",
              name: q.question,
              acceptedAnswer: { "@type": "Answer", text: q.answer },
            })),
          }
        : null,
    ].filter(Boolean),
  };
}
```

### Task 7 — Dynamic guide route

Create `src/app/guides/[slug]/page.tsx`:

```typescript
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { useMDXComponents } from "@/mdx-components";
import { listGuides, getGuideBySlug, countWords } from "@/lib/guides";
import { guidePageJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { AuthorByline } from "@/components/seo/author-byline";
import { Breadcrumb } from "@/components/sections/breadcrumb";
import type { GuideFrontmatter } from "@/types/guide";

// Note: this prompt uses next-mdx-remote/rsc since it's simpler for one-off
// dynamic loading. If @next/mdx static compilation is preferred, switch to
// importing the .mdx file directly. Either works; remote is more flexible.

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return listGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const fm = getGuideBySlug(slug);
  if (!fm) return {};
  return {
    title: fm.title,
    description: fm.description,
    alternates: { canonical: `${site.url}/guides/${slug}` },
    openGraph: {
      type: "article",
      url: `${site.url}/guides/${slug}`,
      title: fm.title,
      description: fm.description,
      publishedTime: fm.publishedAt,
      modifiedTime: fm.updatedAt,
    },
    twitter: { card: "summary_large_image", title: fm.title, description: fm.description },
    keywords: fm.keywords,
  };
}

async function readGuideContent(slug: string): Promise<{ frontmatter: GuideFrontmatter; raw: string } | null> {
  const base = path.join(process.cwd(), "src", "content", "guides");
  const mdxPath = path.join(base, `${slug}.mdx`);
  const mdPath = path.join(base, `${slug}.md`);
  const file = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;
  if (!file) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { frontmatter: data as GuideFrontmatter, raw: content };
}

export default async function GuidePage({ params }: RouteParams) {
  const { slug } = await params;
  const parsed = await readGuideContent(slug);
  if (!parsed) notFound();

  const wordCount = countWords(parsed.raw);
  const readingTimeMin = Math.max(1, Math.round(wordCount / 220));

  const { content } = await compileMDX({
    source: parsed.raw,
    components: useMDXComponents({}),
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
      },
    },
  });

  const fm = parsed.frontmatter;

  // FAQs come from a frontmatter field OR a body section. For schema we want
  // them programmatically; encourage authors to add `faqs: []` in frontmatter.
  const faqs = ((fm as unknown as { faqs?: { question: string; answer: string }[] }).faqs) ?? [];

  return (
    <>
      <JsonLd
        data={guidePageJsonLd({ guide: fm, tldr: fm.description, faqs, wordCount })}
        id={`guide-jsonld-${fm.slug}`}
      />
      <article className="mx-auto w-full max-w-3xl px-6 pt-12 pb-16 sm:px-8 sm:pt-16">
        <Breadcrumb items={[{ label: "Guides", href: "/guides" }, { label: fm.title }]} />
        <header className="mt-6 mb-10">
          <h1 className="text-display-tight text-balance text-4xl sm:text-5xl md:text-6xl">{fm.title}</h1>
          <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">{fm.description}</p>
          <div className="mt-6 border-t border-border/50 pt-5">
            <AuthorByline updatedAt={fm.updatedAt} readingTimeMin={readingTimeMin} />
          </div>
        </header>
        <div className="prose prose-lg max-w-none">{content}</div>
      </article>
    </>
  );
}
```

You may need to `pnpm add next-mdx-remote` for `compileMDX`. That's a one-line install if so.

### Task 8 — `/guides` index page

Create `src/app/guides/page.tsx` that lists every published guide newest-first. Each entry is a card with title, description, kind badge, published date, reading time. Include a hero block at the top and link up to the relevant pillar (since most guides hang off one). Emit `CollectionPage` JSON-LD.

### Task 9 — Sitemap integration

Extend `src/app/sitemap.ts` to include every guide:

```typescript
import { listGuides } from "@/lib/guides";
// … existing imports

export default function sitemap(): MetadataRoute.Sitemap {
  // … existing static + entry paths
  const guides = listGuides();
  const guideEntries = guides.map((g) => ({
    url: `${site.url}/guides/${g.slug}`,
    lastModified: new Date(g.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));
  return [...staticPaths.map(...), ...entryPaths.map(...), ...guideEntries];
}
```

Also add `{ path: "/guides", priority: 0.9, freq: "weekly" }` to the static paths array.

### Task 10 — llms.txt update

Since llms.txt currently has a single `/guides` index entry, update the file to list each published guide URL under the Guides section. Best approach: regenerate llms.txt on build. Add `scripts/build-llms-txt.ts` that reads `listGuides()` and writes `public/llms.txt`. Wire into the build step in `package.json`:

```json
"scripts": {
  "build": "pnpm tsx scripts/build-llms-txt.ts && next build",
  ...
}
```

### Task 11 — Sample placeholder article

Create `src/content/guides/_sample.mdx` with the frontmatter and section structure filled in but the body left as TODO. Mike uses this as a copy-paste template for the next article. Set `published: false` so it doesn't go live.

```mdx
---
slug: "_sample"
title: "Sample Guide: How to Use This Template"
description: "Internal template for new MDX guides. Do not publish."
publishedAt: "2026-05-26T00:00:00.000Z"
updatedAt: "2026-05-26T00:00:00.000Z"
kind: "faq"
targetQuery: "sample"
keywords: ["sample"]
pillar: "/planted-tank-guide"
relatedSpecies: ["fish:neon-tetra", "shrimp:cherry-shrimp", "mosses:java-moss"]
published: false
faqs:
  - question: "Sample question?"
    answer: "Sample answer."
---

## The short answer

This is the TL;DR — lead with the direct answer in 100–150 words.

## Background

Use `<SpeciesCard slug="neon-tetra" />` to embed a catalogue card:

<SpeciesCard slug="neon-tetra" />

Use `<PillarLink href="/aquarium-fish-guide">complete guide to aquarium fish</PillarLink>` for pillar callouts:

<PillarLink href="/aquarium-fish-guide">complete guide to aquarium fish</PillarLink>

## What I've observed

Mike's first-hand notes go here.

## Sources

<Sources items={[
  { label: "FishBase — Paracheirodon innesi", url: "https://www.fishbase.se/summary/Paracheirodon-innesi" },
  { label: "GBIF — Paracheirodon innesi", url: "https://www.gbif.org/species/2360882" },
]} />
```

### Task 12 — Update CLAUDE.md

Append a section to `CLAUDE.md` documenting the new pipeline:

```markdown
## 13. MDX guides pipeline

Articles live as `.mdx` files in `src/content/guides/`. Each file has YAML
frontmatter typed by `src/types/guide.ts`. A new file becomes a live page at
`/guides/<slug>` after deploy. Sitemap and llms.txt are auto-generated. Inline
React components available in MDX: `<SpeciesCard />`, `<PillarLink />`,
`<BuildLink />`, `<ExternalLink />`, `<Faq />`, `<Sources />`.

Author articles using the content-research-writer skill — see
`skills/content-research-writer/SKILL.md`.

Priority article briefs are in `content-plan-q1.md`.
```

---

## Acceptance criteria

Before you stop, verify:

- [ ] `pnpm typecheck` and `pnpm build` pass with zero errors.
- [ ] `pnpm dev` boots without runtime errors.
- [ ] `/guides` renders an index page (empty state OK if `_sample` is unpublished and no real articles yet).
- [ ] Dropping `src/content/guides/test.mdx` with valid frontmatter makes `/guides/test` resolve and render.
- [ ] `<SpeciesCard slug="neon-tetra" />` inside an MDX file renders a real card linking to `/fish/neon-tetra`.
- [ ] `<PillarLink href="/aquarium-fish-guide">complete fish guide</PillarLink>` inside an MDX file renders the callout.
- [ ] External links inside MDX get `rel="noopener noreferrer"` and `target="_blank"` automatically.
- [ ] Inspecting `/guides/test` source shows `Article` + `BreadcrumbList` + `FAQPage` JSON-LD with real dates.
- [ ] `public/llms.txt` regenerates on build with every published guide listed.
- [ ] Sitemap includes every published guide.
- [ ] A guide with `published: false` does NOT appear in the listing, sitemap, or llms.txt.

## What NOT to do

- Don't write actual article content — that's Mike's task using the content-research-writer skill.
- Don't add a CMS, admin UI, or database.
- Don't add comments, likes, or social features.
- Don't change anything about the existing catalogue, pillars, or tools.

## When you finish

Append a *"Session 3 — what shipped"* note to `progress/session-03.md` listing what's live and any decisions made. Then stop.
