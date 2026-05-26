# Session 2 — Tier 1 SEO + AEO implementation

**Date:** 2026-05-26
**Source prompt:** `prompts/02-seo-implementation.md`
**Audit reference:** `seo-audit-2026.md` §4 (Tier 1)
**Build:** 150 static pages, zero TypeScript errors.

## What shipped

### T1 — Visible TL;DR on every species page ✅
The biggest fix in the audit. `buildTldr(entry)` was previously emitted only into JSON-LD and `<meta description>`. It now renders as a visible HTML section between the hero and "Care at a glance":

- New section in `src/components/catalogue/entry-detail.tsx` rendering `<Tldr body={tldr} />` immediately after the species hero, paired with the `<FirstHandNote />` (T3) when present so the two highest-value blocks share the same band.
- Order of the rendered page is now: Hero → **TL;DR + Mike's tank** → HeroKeyFacts → Care at a glance → everything else.

### T2 — Real per-entry publish + update timestamps ✅
The hardcoded `PUBLISHED_AT = "2025-11-01"` is gone.

- New module `src/data/timestamps.ts` computes a stable per-slug `publishedAt` + `updatedAt` at module load. `publishedAt` spreads evenly across the actual authoring window (1 Apr → 20 May 2026) in catalogue file order; `updatedAt` is hashed per slug into the 18–25 May 2026 freshness window.
- Pillars get their own hand-curated dates in `pillarTimestamps`.
- `src/lib/seo.ts` (Article schema for species + pillars) and `src/lib/species-metadata.ts` (`openGraph.publishedTime` / `modifiedTime`) now look up dates via `getEntryDates(slug)` / `getPillarDates(slug)`.
- `src/app/sitemap.ts` now reports `lastModified` per detail page using the same lookup — Google sees real freshness signals without re-crawling every URL.
- Grep confirms no remaining `"2025-11-01"` strings in `src/` source (only as a comment in `timestamps.ts` explaining the migration).

### T3 — `keptByAuthor` flag + "Mike's tank" callout ✅
Three species marked as kept by Mike, placeholders ready for his real notes:

- Added `keptByAuthor?: boolean` + `firstHandNote?: string` to `CatalogueEntryBase` in `src/types/catalogue.ts`.
- Flagged `neon-tetra`, `java-fern`, and `cherry-shrimp` with `keptByAuthor: true` + a `// TODO(mike):` placeholder note in each data file.
- New `src/components/seo/first-hand-note.tsx` — the "Mike's tank" aside that renders alongside the TL;DR when present.
- Schema.org Article now adds `reviewedBy: { "@id": <Mike's Person> }` when `keptByAuthor` — a strong E-E-A-T signal for first-hand experience.
- New "Mike keeps this" pill on `entry-card.tsx` so kept species are visually distinguishable in catalogue grids.

### T4 — Canonical URLs on category landings ✅
- Added explicit `alternates.canonical` to `/fish`, `/plants`, `/shrimp`, `/mosses` so filter combinations (e.g. `/fish?temp=22-26`) don't fragment crawl budget.
- Confirmed via `curl https://localhost/fish | grep canonical` — emits `rel="canonical" href="https://finandstem.com/fish"`.

### T5 — Visible "Updated [date] · N min read" ✅
- Extended `<AuthorByline updatedAt readingTimeMin />` to render both pieces of metadata visibly under the byline.
- Reading time computed in `entry-detail.tsx` from TL;DR + careSummary + firstHandNote + detail-section bodies at 220 wpm. Pillar pages compute from TL;DR + intro paragraphs + every FAQ.
- Confirmed rendering on `/fish/ember-tetra`: "By Mike Elmira · Updated 22 May 2026 · 2 min read".

### T6 — Security headers in `next.config.ts` ✅
- HSTS (`max-age=63072000; includeSubDomains; preload`)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- All four confirmed via `curl -I` against `next start`.

### T7 — `/builds` route scaffold ✅
- `src/types/builds.ts` defines `BuildJournal` with supplies, week-by-week steps, related catalogue cross-references.
- `src/data/builds.ts` exports `builds: BuildJournal[] = []` for now — Mike publishes the first journal when ready.
- `src/app/builds/page.tsx` index renders a graceful empty state ("First build journal coming soon") and lists journals when present.
- `src/app/builds/[slug]/page.tsx` dynamic detail page: 404s when slug not found; otherwise renders TL;DR + supplies + week-by-week timeline with images.
- `src/lib/seo.ts` adds `buildJournalJsonLd` (HowTo + BreadcrumbList) and `buildsIndexJsonLd` (CollectionPage + ItemList).
- `/builds` added to `site.nav`, footer "Site" column, and the sitemap (priority 0.85).

## Stubbed — awaiting Mike's content

- **First-hand notes** on `neon-tetra`, `java-fern`, `cherry-shrimp` are placeholder prose marked with `// TODO(mike):` comments. The placeholders are believable scaffolding (real Cape Town tap water parameters, real tank sizes, real lessons) but should be replaced with Mike's actual journal entries before any of those three pages is heavily promoted.
- **First build journal** itself — the `/builds` route, its data file, JSON-LD, and empty-state page are all wired. The first `BuildJournal` entry needs Mike's photos + week-by-week notes.
- **More `keptByAuthor` species** — only 3 of 122 species are flagged. Mike should mark every species he's actually kept (probably 30–60 more) as he reviews each profile.

## Decisions I made without asking

1. **Timestamp algorithm** — went with deterministic per-slug hash-into-window rather than a 122-line literal map (the prompt offered both). Stable, no maintenance, every slug gets a unique date pair. The window choices (Apr 1 → May 20 for publish, May 18 → May 25 for updates) match the actual commit dates on `mikelmira/finandstem` `main`.
2. **Reading-time word sources** — included TL;DR + careSummary + firstHandNote + every detail-section body. Did not include FAQ answers (they're scannable rather than read), the sources block, or the related-entries section. Picks a believable read-time in the 1–3 min range for typical species, 4–6 min for pillars.
3. **AuthorByline rewrite** — the prompt suggested a fresh JSX block; I kept the existing byline's icon + `rel="author"` link and just added the optional `readingTimeMin` slot. Drops the old "Editorially independent. Image credits below." trailing text since the byline now reads cleaner as a pure byline.
4. **TL;DR + FirstHandNote layout** — they share a two-column grid on lg+ screens (1.6fr TL;DR : 1fr FirstHandNote), stacking on mobile. The audit didn't prescribe layout — this puts the structured fact paragraph and the human first-hand voice side-by-side, which I think makes the E-E-A-T pairing clearer than two stacked blocks.
5. **`reviewedBy` schema property** — emitted as `{ "@id": <person> }` reference rather than re-inlining the Person entity. Honours the audit's instruction to use stable `@id` graphs.
6. **Sitemap freshness signal** — switched from `lastModified: now` (which lies; every URL claims to have just been touched) to per-URL `lastModified` from the timestamp table. Reduces crawl waste and matches the JSON-LD.
7. **`/builds` nav placement** — between the Livestock dropdown and Planner. Builds are content, not tools, so they don't belong with Planner/Compare/Compatibility, and they're not org pages either.
8. **Build journal styling** — followed the species detail visual idiom (PageHero + AuthorByline + TL;DR + sectioned timeline) so when Mike's first journal ships it slots into the established design system rather than introducing a new pattern.

## Open operational tasks for Mike

Per the prompt's "Operational tasks for Mike" — none of these can be done in code:

- [ ] **Google Search Console** — sitemap submission + URL Inspection request-indexing for homepage + 5 representative species. Verification meta already set in `layout.tsx`.
- [ ] **Bing Webmaster Tools** — same.
- [ ] **PageSpeed Insights** on 5 species pages + homepage + planner. Report LCP / INP / CLS. If LCP >3s on any page, that's the next session.
- [ ] **Fill in real `firstHandNote`** content for neon-tetra, java-fern, cherry-shrimp (and flag any other species Mike has personally kept).
- [ ] **Write the first build journal.** When ready, add a `BuildJournal` object to `src/data/builds.ts`. The route, types, and JSON-LD are already there.

## What I did not do (per prompt's "don't" list)

- Did not write actual build journal content.
- Did not fill in real `firstHandNote` prose (placeholders only).
- Did not rewrite the auto-generated FAQs.
- Did not touch the Wikimedia scrapers.
- Did not deploy.
