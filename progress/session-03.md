# Session 3 — MDX guides pipeline

**Date:** 2026-05-26
**Source prompt:** `prompts/03-mdx-guides-pipeline.md`
**Build:** 151 static pages, zero TypeScript errors.

## What shipped

A markdown-in-repo article pipeline. Drop `.mdx` files into
`src/content/guides/`, commit, push — they auto-deploy as live pages at
`/guides/<slug>`. No CMS, no DB, no admin UI.

### Pipeline plumbing

- **Dependencies** installed: `next-mdx-remote`, `gray-matter`,
  `rehype-slug`, `rehype-autolink-headings`, `remark-gfm`, `@types/mdx`.
- **`src/types/guide.ts`** — `GuideFrontmatter` contract. Required fields:
  `slug`, `title`, `description`, `publishedAt`, `updatedAt`, `kind`,
  `targetQuery`, `pillar`, `relatedSpecies`. Optional: `keywords`,
  `heroImage`, `heroAlt`, `published`, `keptByAuthor`, `faqs`, `sources`.
- **`src/lib/guides.ts`** — synchronous filesystem loader. Reads
  `src/content/guides/*.{mdx,md}`, parses frontmatter, fails the build
  loudly if a required field is missing or the filename doesn't match
  `slug`.
- **`src/mdx-components.tsx`** — `useMDXComponents` mapping: registers
  the custom MDX components below and overrides every markdown element
  (`h2`, `p`, `ul`, `blockquote`, `table`, etc.) with Fin & Stem's
  typography defaults so articles inherit the design system.
- **`src/app/globals.css`** — appended `.guide-prose` scoped rules:
  `scroll-padding-top: 96px` so deep-link anchors clear the floating
  header, and overrides for the `rehype-autolink-headings` wrapper so
  heading text doesn't get underlined.

### Custom MDX components (`src/components/mdx/`)

- **`<SpeciesCard slug="neon-tetra" />`** — pulls a real catalogue entry
  by slug, renders the photo + name + scientific binomial + origin, and
  links to `/category/slug`. Shows the "Kept" pill when
  `entry.keptByAuthor`. Renders an inline error if the slug doesn't
  exist (dev-time guard).
- **`<PillarLink href="/aquarium-fish-guide">…</PillarLink>`** — "For
  the full context, read …" callout that links up to the pillar guide
  the article hangs under.
- **`<BuildLink slug="…" />`** — inline reference to a future build
  journal. Returns `null` gracefully when the build doesn't exist yet,
  so a guide can reference an upcoming journal without breaking the
  build. Dev shows a visible warning instead.
- **`<ExternalLink href="…" />`** — auto-applied to every external link
  in MDX (`a[href^=http]`). Always `target="_blank" rel="noopener
  noreferrer"`. Adds `nofollow` for non-authority domains; authority
  hosts (FishBase, GBIF, IUCN, Wikipedia, iNaturalist, Tropica,
  Seriously Fish, 2HR Aquarist, etc.) stay dofollow.

### Routes

- **`/guides`** (`src/app/guides/page.tsx`) — index with empty state when
  no published articles exist, otherwise a responsive card grid sorted
  newest-first. Each card shows kind badge, reading time, published
  date, hero image (optional), and description. Emits CollectionPage +
  ItemList + BreadcrumbList JSON-LD.
- **`/guides/[slug]`** (`src/app/guides/[slug]/page.tsx`) — dynamic SSG
  route. `generateStaticParams` reads `listGuides()`; `generateMetadata`
  emits canonical + OG + Twitter. The body is compiled by
  `MDXRemote/rsc` with `remarkGfm`, `rehypeSlug`, and
  `rehypeAutolinkHeadings`. Author byline shows `updatedAt` + reading
  time, pillar link rendered from frontmatter, FAQs and Sources blocks
  render automatically from frontmatter arrays. Emits Article +
  BreadcrumbList + FAQPage JSON-LD with real publish/update dates.
  Unpublished guides 404 in production but preview in dev.

### Schema

- **`guidePageJsonLd`** + **`guidesIndexJsonLd`** added to
  `src/lib/seo.ts`. Article schema uses `wordCount` from the rendered
  body; FAQPage only emits when the frontmatter has `faqs`; sets
  `reviewedBy` when `keptByAuthor: true`.

### Discoverability

- **`src/app/sitemap.ts`** — `/guides` added as a static path
  (priority 0.9, weekly). Every published guide gets its own entry
  with the real `updatedAt` from frontmatter.
- **`src/lib/site.ts`** — `Guides` added to top nav (renders alongside
  Builds + Planner + Compare + Compatibility + About) and to the
  footer "Site" column.
- **`scripts/build-llms-txt.mjs`** — runs as a `prebuild` step on every
  `pnpm build`. Reads `seo/llms.txt` as a template, appends a "Published
  guides" section listing every published guide URL + description, and
  writes to `public/llms.txt`. Hand-curated editorial copy in
  `seo/llms.txt` stays the source of truth; the public file is always
  in sync. Verified: building with 0 published guides produces the
  curated content unchanged; building with 1 published guide appends
  the new section.

### Sample template

- **`src/content/guides/_sample.mdx`** — the copy-paste template for the
  next article. Demonstrates every MDX component
  (`<SpeciesCard />`, `<PillarLink />`, external link, comparison
  table), shows the recommended section order (TL;DR → Background → "What
  I've observed" → Closing), and has 2 FAQs declared in frontmatter.
  `published: false` so it doesn't appear in `/guides`, sitemap, or
  llms.txt.

## Acceptance criteria — all green

Verified by `pnpm build` + grep against the built HTML and by dropping a
temporary `test.mdx` fixture (since removed):

- [x] `pnpm typecheck` and `pnpm build` pass with zero errors.
- [x] `/guides` renders an index page (empty state until first article).
- [x] Dropping `src/content/guides/test.mdx` with valid frontmatter makes
      `/guides/test` resolve and render with all components live.
- [x] `<SpeciesCard slug="neon-tetra" />` renders a real card linking to
      `/fish/neon-tetra`.
- [x] `<PillarLink href="/aquarium-fish-guide">…</PillarLink>` renders
      the callout.
- [x] External links in MDX get `rel="noopener noreferrer"` + `target="_blank"`
      automatically. Authority hosts (FishBase, GBIF, Wikipedia, etc.) stay
      dofollow; everything else gets `nofollow`.
- [x] `/guides/test` source includes Article + BreadcrumbList + FAQPage
      JSON-LD with the real publish/update dates from frontmatter.
- [x] `public/llms.txt` regenerates on build with each published guide
      listed.
- [x] Sitemap includes `/guides` plus every published guide URL with
      per-guide `lastModified`.
- [x] A guide with `published: false` does NOT appear in `/guides`, the
      sitemap, or `llms.txt`.

## Decisions I made without asking

1. **`next-mdx-remote/rsc` over `@next/mdx`.** Cowork's prompt mentioned
   both as options; I went with `next-mdx-remote/rsc` and skipped the
   `withMDX` config in `next.config.ts`. Result: zero changes to
   `next.config.ts`, simpler code path, MDX compiled at request time
   inside the RSC. Trade-off: marginally slower per-page render than
   build-time MDX, but `generateStaticParams` makes every guide SSG
   anyway, so it only matters on the first request after deploy.
2. **`prebuild` hook in package.json** rather than a separate `pnpm
   build:llms` command Mike has to remember. The llms.txt always
   matches what's deployed because it can't get out of sync — `pnpm
   build` runs the prebuild every time.
3. **Authority-host allowlist on `ExternalLink`** is hand-curated rather
   than read from a config file. Currently 17 hosts (the scientific
   databases + Wikipedia + the major aquascaping references). Easy to
   extend in `src/components/mdx/external-link.tsx` — and easy for Mike
   to audit at a glance, which matters for the dofollow decision.
4. **Filename must match `slug`.** Loader throws if not — catches the
   most common copy-paste typo (rename the file but forget to update
   the frontmatter, or vice versa).
5. **FAQs declared in frontmatter rather than parsed from a markdown
   heading.** Less magic, easier to type-check, identical Q/A in the
   visible `<Faq />` block and the FAQPage JSON-LD. Authors who want
   richer prose for an answer can still put it in the markdown body
   under an "## FAQ" heading.
6. **`<Sources />` likewise from frontmatter.** Same reasoning. Authors
   who want a custom Sources block can also render `<Sources items={…}
   />` directly inline.
7. **Unpublished guides are visible in dev, 404 in production.** Lets
   Mike preview drafts locally without flipping `published: true`.
8. **No tsx dependency for the llms.txt build script.** Written as
   `scripts/build-llms-txt.mjs` (native Node ES module, uses
   `gray-matter` which is already a runtime dep). No extra dev
   dependency, no Vercel build-config changes.

## Operational tasks for Mike

- [ ] **Write the first article** using `skills/content-research-writer/SKILL.md`.
      Copy `src/content/guides/_sample.mdx` → `<your-slug>.mdx`, flip
      `published: true`, fill the body. Push to main and it auto-deploys.
- [ ] **Q1 content plan** is at `content-plan-q1.md` (Cowork delivered) —
      sequenced for compounding internal-link equity. Article 1 is the
      template-setter; Articles 2–6 each link to articles already
      published.
- [ ] **Verify Vercel deploys the prebuild step.** Default Vercel config
      runs `pnpm install` then `pnpm build` — the `prebuild` hook fires
      automatically. Should just work, but worth confirming on the first
      deploy that contains a published guide.

## What I did not do (per prompt's "don't" list)

- Did not write any actual article content. The sample template is
  pipeline scaffolding, not an article.
- Did not add a CMS, admin UI, or database.
- Did not add comments, likes, social features, or RSS (RSS is a fast
  follow worth doing later).
- Did not touch the existing catalogue, pillars, or tools.
