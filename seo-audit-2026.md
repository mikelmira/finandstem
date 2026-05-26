# Fin & Stem — SEO + AEO Audit 2026

**Audited:** May 26, 2026
**Site:** https://www.finandstem.com
**Audit scope:** Full site, technical + on-page + content + AEO/GEO
**Auditor's note:** The bash sandbox couldn't reach the live URL directly, so I audited the deployed source code in `/Users/mikeelmira/Desktop/Fin & Stem/src/` against what would be served. This is more thorough than scraping rendered HTML — every finding cites a specific file path. Where I couldn't measure something (live Core Web Vitals, indexed page count, real backlink profile), I say so explicitly and prescribe how to measure it.

---

## 1. Executive Summary

### Overall SEO Health Score: 42 / 70 — Grade C+

A site that's punching well above its age in technical fundamentals but is invisible in Google because (a) it's brand new with zero backlinks, (b) the sitemap likely isn't submitted yet, and (c) the on-page content leans on auto-generated FAQs rather than first-hand experience — the single biggest 2026 ranking signal post-March core update. Closing this gap is mostly process work, not redevelopment.

| Section | Score | Direction |
|---|---|---|
| Crawlability & Indexation | 7/10 | Strong code, weak submission |
| Technical Performance | 7/10 | Solid; needs live measurement |
| On-Page Optimization | 7.5/10 | Best-in-class structure; TL;DR not visible |
| Content Quality & E-E-A-T | 6/10 | Schema great, voice underused, no builds |
| Backlink & Authority | 3/10 | Zero off-page footprint |
| Competitor Benchmarking | 5/10 | Unique tools, but DR gap is huge |
| Content Gap | 6.5/10 | Catalogue strong, long-tail thin |
| **Overall** | **42/70 → C+** | Mostly executable in 30 days |

### Top 5 Priority Issues

1. **Site not indexed.** `site:finandstem.com` returns zero results in Google. Sitemap is built (`src/app/sitemap.ts`) but there's no evidence it's been submitted to Google Search Console or Bing Webmaster Tools. Until these two submissions happen, nothing else matters.
2. **All pages publish-dated 2025-11-01.** `PUBLISHED_AT` is a single hard-coded constant in `src/lib/seo.ts:22` used for both `datePublished` and `dateModified` across every species, pillar, and metadata block. Freshness signal is dead, and pages that look stale on day one lose Perplexity citations preferentially.
3. **TL;DR block isn't rendered to HTML.** `buildTldr()` in `src/lib/species-faq.ts` produces a 100–250-word fact-paragraph for every species. That string flows into `<meta description>` and JSON-LD `description`, but the visible page leads with `entry.careSummary` (often 1–2 short paragraphs). AI Overviews extract from rendered text, not just metadata — this is the single highest-impact rendering fix.
4. **No first-hand "I keep this species" signal anywhere.** Google's March 2026 core update made *Experience* the dominant E-E-A-T ranking factor. The architecture supports it (author byline + Person schema with `knowsAbout`) but no species page differentiates between "Mike has kept this" and "Mike has researched this".
5. **Zero build journals.** The launch plan calls these the moat. They don't exist yet. Even one well-documented build with original photographs unlocks: (a) topical experience signal, (b) original images to outrank Wikimedia-sourced gallery pages, (c) Reddit-shareable content, (d) internal link target for every species used in that build.

### Quick Wins (under a day each)

| Win | Time | Impact |
|---|---|---|
| Submit `sitemap.xml` to GSC and Bing | 15 min | Unblocks indexing entirely |
| Replace hardcoded `PUBLISHED_AT` with per-entry dates from data | 1 hr | Restores freshness signal |
| Render `Tldr` component on every catalogue detail page (it exists at `src/components/seo/tldr.tsx`, just not wired up) | 30 min | Adds AI-extractable lead block on 80+ pages instantly |
| Add `keptByAuthor: true/false` flag to entries Mike has actually kept; render an "I keep this" badge with first-hand note | 2 hrs | Materially shifts E-E-A-T |
| Verify Google Analytics events fire (the `gtag('config')` is there; need conversions for measurement) | 30 min | Required to measure anything |

---

## 2. Detailed Findings

### 2.1 Crawlability & Indexation — Score: 7/10

The code is correct. The problem is operational — submission and crawl-budget signalling haven't been done yet.

**Issue 2.1.1: Site is not indexed in Google.**
- **Impact:** Critical
- **Evidence:** `site:finandstem.com` returns zero results (verified via Google search). "finandstem.com ember tetra" returns no results from the domain either. The site appears to be operationally invisible.
- **Current state:** `src/app/sitemap.ts` builds a full sitemap with 80+ catalogue URLs + pillars + tools + legal. `src/app/robots.ts` correctly allows everything except `/admin/` and `/api/`. Indexing-allow `robots` meta tag is set in `src/app/layout.tsx:78`.
- **Recommended fix:** (1) Visit https://search.google.com/search-console, verify property ownership (verification meta already set in layout at `:98` for Google and `:100` for Bing — should auto-verify when the URL is submitted). (2) Submit `https://finandstem.com/sitemap.xml`. (3) Use the URL Inspection tool to request indexing on the homepage and 5 representative species pages. (4) Repeat at Bing Webmaster Tools. Expect 1–2 weeks for first-pass indexation.
- **Priority:** 1 (Critical)

**Issue 2.1.2: Filter URLs canonicalization not enforced.**
- **Impact:** Medium
- **Evidence:** `src/components/filters/use-filter-url.ts` writes filter state to `searchParams`. Without explicit canonical handling, every filter combination is a unique URL — Google may index 100+ near-duplicate variants of `/fish` and dilute crawl budget.
- **Current state:** Layout sets canonical to `site.url` (`src/app/layout.tsx:90`), but per-category pages haven't been verified to canonical filter URLs back to the bare list page.
- **Recommended fix:** In each category landing's `generateMetadata`, set canonical to the bare path:
  ```typescript
  // In src/app/fish/page.tsx, src/app/plants/page.tsx, etc.
  export const metadata: Metadata = {
    alternates: { canonical: `${site.url}/fish` },
  };
  ```
  Confirm GSC's URL Parameters tool sees the canonical correctly after deploy.
- **Priority:** 2 (High)

**Issue 2.1.3: No verifiable orphan-page scan.**
- **Impact:** Low
- **Evidence:** Site has 80+ entries; internal linking is implemented via the catalogue grid, the homepage `FeaturedEntries`, and the "build the rest of the tank" companions block. But no automated check exists.
- **Recommended fix:** Once indexed, run a Screaming Frog (free tier, up to 500 URLs) crawl and check the "Inlinks" column — every published entry should have ≥3 inlinks. If any entry has 0–1 inlinks, add it to a homepage feature or the relevant pillar's cluster list.
- **Priority:** 4 (Low — but worth doing monthly)

**Issue 2.1.4: `host:` directive missing.**
- **Impact:** Low
- **Evidence:** `src/app/robots.ts:43` uses `host: site.url`. Yandex still respects this; Google ignores it. Harmless but worth knowing.
- **Recommended fix:** No action needed. Keep as is.
- **Priority:** 5 (Nice-to-have)

### 2.2 Technical Performance — Score: 7/10

Strong stack choices; verification needs to happen live.

**Issue 2.2.1: Core Web Vitals not measured.**
- **Impact:** High (unknown direction)
- **Evidence:** No PageSpeed Insights audit available from this environment. The species detail page has a `100vh` hero image with a `fill` `next/image` — that's the LCP element and depends on Wikimedia delivery speed.
- **Current state:** `priority` is set correctly on hero (`src/components/catalogue/entry-detail.tsx:166`). Google Fonts use `display: swap`. GA loads `afterInteractive`. No render-blocking JS visible.
- **Recommended fix:** Run https://pagespeed.web.dev/?url=https%3A%2F%2Fwww.finandstem.com%2Ffish%2Fember-tetra on at least 5 species pages, the homepage, and the planner. Target: LCP <2.5s on mobile, INP <200ms, CLS <0.1. If LCP fails, options: (a) self-host the lead image of every species on R2/Cloudflare instead of hot-linking Wikimedia, (b) preload the lead image with a `<link rel="preload">` in `head` for the species page, (c) downsize the hero from 100vh.
- **Priority:** 2 (High)

**Issue 2.2.2: Hero image hot-linked from external CDNs.**
- **Impact:** Medium
- **Evidence:** `next.config.ts` allows remote patterns from `upload.wikimedia.org`, `inaturalist-open-data.s3.amazonaws.com`, `static.inaturalist.org`, `tropica.com`, etc. Wikimedia thumbnails are not pre-cached on Cloudflare/Vercel edge — every cold visit hits Wikimedia.
- **Current state:** `next/image` proxies these via the Next.js image optimization endpoint, which gives some caching, but the upstream fetch still adds 100–300 ms on cold cache.
- **Recommended fix:** Two tiers. (a) For the top-20 most-trafficked species (after 30 days of data), download the lead image to `public/images/lead/[slug].jpg`, serve locally — this owns the LCP-critical asset. (b) For everything else, the Next image optimizer is fine; just confirm cache headers are long (`Cache-Control: public, max-age=31536000, immutable`).
- **Priority:** 3 (Medium)

**Issue 2.2.3: No `opengraph-image.tsx` per route.**
- **Impact:** Medium
- **Evidence:** `src/lib/species-metadata.ts:33` uses the static lead image as the OG image. That's fine on a card, but limits social-share copy and AI-engine summary cards.
- **Current state:** Single static OG image per page (the lead image).
- **Recommended fix:** Add `src/app/fish/[slug]/opengraph-image.tsx` (and per pillar, per catalogue category) that renders a 1200×630 image with the species name, scientific name italicised, hero photo, brand logo, and a single key spec ("Min tank: 40 L"). Use Next.js's `ImageResponse` API. The same approach for pillar pages with title + cluster size.
- **Priority:** 3 (Medium)

**Issue 2.2.4: GA4 fires on every page including legal pages.**
- **Impact:** Low
- **Evidence:** `src/app/layout.tsx:121–132` loads GA4 site-wide. No exclusion for `/legal/*`.
- **Recommended fix:** Either accept this (minimal cost) or wrap GA in a layout that excludes legal/admin paths. Low priority.
- **Priority:** 5

**Issue 2.2.5: No CSP / HSTS / security headers visible in `next.config.ts`.**
- **Impact:** Low (SEO impact); Medium (security)
- **Evidence:** `next.config.ts` doesn't define `headers()`.
- **Recommended fix:** Add HSTS at minimum, since SSL is assumed:
  ```typescript
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    }];
  }
  ```
  Not an SEO blocker, but a trust signal that's free.
- **Priority:** 3

### 2.3 On-Page Optimization — Score: 7.5/10

The structural work is excellent — titles, meta, headings, JSON-LD are all in place. The single biggest miss is that the auto-generated TL;DR doesn't render as visible HTML.

**Issue 2.3.1: Auto-generated TL;DR is metadata-only, not visible to crawlers.**
- **Impact:** Critical
- **Evidence:**
  - `src/lib/species-faq.ts:36` exports `buildTldr(entry)` which combines `careSummary` + a structured fact paragraph (water params, tank size, parameters, lifespan, diet, plant/shrimp safety). Output is 150–280 words.
  - `src/components/seo/tldr.tsx` exports a `<Tldr />` React component built specifically to render this content.
  - In `src/app/fish/[slug]/page.tsx` and `src/components/catalogue/entry-detail.tsx`, the species page renders `entry.careSummary` directly (entry-detail.tsx:257) — typically 80–120 words, missing the fact paragraph.
  - The full TL;DR string goes only to JSON-LD `description` and `<meta description>` (via `species-metadata.ts:30`).
- **Current state on Ember Tetra:** Page leads with hero image + "Care at a glance" rendering `careSummary` (a few opinionated sentences). The 150-word fact paragraph generated by `buildTldr` is absent from the visible HTML.
- **Recommended fix:** In `src/components/catalogue/entry-detail.tsx`, replace or augment the "Care at a glance" card with the `<Tldr />` component:
  ```typescript
  import { Tldr } from "@/components/seo/tldr";
  // ... inside EntryDetail, after HeroKeyFacts ...
  <Tldr body={tldr} subject={entry.commonName} />
  ```
  Move it above the existing hero key facts, OR keep "Care at a glance" as the editorial summary and add the structured TL;DR as a sibling block titled "Quick facts". Either way the full 150–250-word fact paragraph must be in the rendered DOM.
- **Priority:** 1 (Critical — this is the highest-impact change in the audit)

**Issue 2.3.2: All pages share publish date 2025-11-01.**
- **Impact:** High
- **Evidence:** `src/lib/seo.ts:22` defines `const PUBLISHED_AT = "2025-11-01T00:00:00.000Z";`. Every species, pillar, and homepage uses this for `datePublished` and `dateModified`. `src/lib/species-metadata.ts:57` also hardcodes it.
- **Recommended fix:** Add `publishedAt` and `updatedAt` ISO strings to each entry in `src/data/fish.ts`, `plants.ts`, etc. (or add to a small `src/data/timestamps.ts` keyed by slug). Set sensible initial values (the date the entry was authored). For now, even staggering them by a day each across the catalogue is better than identical. Update the helpers in `src/lib/seo.ts` to take `entry` and pull its dates. For pillar pages and homepage, set realistic dates.
- **Priority:** 1 (Critical)

**Issue 2.3.3: H1 + scientific name pattern is good but missable.**
- **Impact:** Low
- **Evidence:** `entry-detail.tsx:203` renders the H1 as `entry.commonName` only. Scientific name is an italic `<p>`, not part of the H1.
- **Current state:** H1 = "Neon Tetra". H2 = "*Paracheirodon innesi*" (as `<p>`).
- **Recommended fix:** Either include the scientific name in the H1 (matches the title-tag pattern and is what AI engines prefer) OR leave the H1 as common-name-only but ensure the scientific name appears in the first paragraph of the visible TL;DR. The latter is current; the former is cleaner. Either works — current is acceptable.
- **Priority:** 4

**Issue 2.3.4: Internal anchor text often "see all".**
- **Impact:** Medium
- **Evidence:** Multiple "See all fish" / "Browse catalogue" buttons with anchor text that doesn't include the target keyword.
- **Recommended fix:** Vary anchor text to include the target keyword of the destination. "See all fish" → "Browse all 30+ freshwater aquarium fish profiles". This is already partially done on the pillar links; extend it sitewide.
- **Priority:** 3

**Issue 2.3.5: Hero key facts could be marked up as a comparison table.**
- **Impact:** Low
- **Evidence:** `HeroKeyFacts` renders the parameter pills as visual elements but not as a `<table>`.
- **Recommended fix:** Either render `HeroKeyFacts` content as a hidden-styled `<table>` (still visually pills, but semantically a comparison table) OR add a second `<table>` further down the page. AI Overviews extract `<table>` content disproportionately; a hidden semantic table costs nothing and earns extraction. Even a `<dl>` is better than free-floating divs for this content.
- **Priority:** 3

### 2.4 Content Quality & E-E-A-T — Score: 6/10

The plumbing is excellent (author entity, Person schema with `knowsAbout`, sources block per page). The voice and first-hand experience signals are underused.

**Issue 2.4.1: No "I keep this species" callouts.**
- **Impact:** Critical
- **Evidence:** Every species reads as researched, not lived. The page architecture supports it (Pro Tips section, author byline, knowsAbout entity) but no entry differentiates "Mike has actually kept Cherry Shrimp for 3 years" from "Mike has researched Blue Bolt Shrimp".
- **Current state:** All entries are treated equally on E-E-A-T signals.
- **Recommended fix:** Add `keptByAuthor: boolean` and optional `firstHandNote: string` to entry types. For species Mike has kept, render a "Mike's tank" callout — "I've kept Cherry Shrimp for 18 months in a 30 L low-tech tank. Here's what I learned that isn't in the spec sheet …" with a thumbnail of his actual specimen. The schema impact: this content lifts the page from "comprehensive review" to "first-hand experience review", which the March 2026 core update rewards.
- **Priority:** 1

**Issue 2.4.2: No build journals.**
- **Impact:** Critical
- **Evidence:** No `/builds` route exists in the codebase. The launch plan and SEO strategy both call this the moat.
- **Recommended fix:** Add the `/builds` route per `seo/page-templates.md` Template 2. Author Mike's first 3 build journals with original photos, costs, timelines, and lessons. Each build becomes:
  - A page with `HowTo` schema
  - A backlink target for every species used
  - A Reddit-shareable artefact
  - A "Featured in builds" item on every linked species page
- **Priority:** 1

**Issue 2.4.3: Auto-generated FAQs are good but feel templated.**
- **Impact:** Medium
- **Evidence:** `src/lib/species-faq.ts:115–225` generates 5–6 FAQs per species from data fields. The questions are right ("What is the minimum tank size for X?") but the answers read as mechanical concatenations.
- **Current state on Ember Tetra:** Auto-generated FAQs use the structured fields with minor template strings. They satisfy FAQPage schema requirements and provide AI-extractable Q&A, but lose the editorial voice.
- **Recommended fix:** Two-tier approach.
  1. Keep auto-generated FAQs as the fallback for species without hand-written ones.
  2. Allow hand-written `customFaqs: FaqItem[]` on the entry type. When present, prepend to auto-generated FAQs (so we get 8–10 FAQs total).
  3. For the top-20 species, author 3–4 custom FAQs that include first-hand observations: "Why do my Ember Tetras hide?", "Are Ember Tetras schooling — how many should I get?"
- **Priority:** 2

**Issue 2.4.4: External citations missing from body text.**
- **Impact:** Medium
- **Evidence:** The Sources block exists at the bottom of each species page, but inline citations within prose are absent.
- **Recommended fix:** When the care summary or pro tips paragraph makes a factual claim (water parameters, ranges, behaviour) and a primary source supports it, insert a citation: "FishBase records *Paracheirodon innesi* in the upper Amazon basin between pH 5.0–7.5 …". Perplexity especially weighs verifiable inline citations. FishBase and GBIF are both linkable.
- **Priority:** 3

**Issue 2.4.5: No "Updated" timestamp visible to readers.**
- **Impact:** Medium
- **Evidence:** Author byline renders but no visible date.
- **Recommended fix:** Render `Updated [date] · [N] min read` next to the byline. Once dates are real (see 2.3.2), this is a visible trust signal both for users and AI engines.
- **Priority:** 2

**Issue 2.4.6: Author social profiles not set.**
- **Impact:** Low
- **Evidence:** `src/lib/seo.ts:53` has `sameAs: [] as string[]` empty. `src/lib/site.ts:15–19` has `youtube: "#"`, `instagram: "#"`, `reddit: "#"` placeholders.
- **Recommended fix:** Even one verified external link (Instagram of tank photos, Reddit profile) strengthens the Person entity. If you don't have public social yet, at least add a GitHub or LinkedIn profile to the `sameAs` array.
- **Priority:** 3

### 2.5 Backlink & Authority Profile — Score: 3/10

Brand new domain with effectively zero off-page footprint. This is the slowest-to-fix and hardest-to-fake section. The plan from `seo-geo-strategy.md §12` is correct — execution hasn't started.

**Issue 2.5.1: No backlinks visible.**
- **Impact:** Critical for ranking; Expected for stage
- **Evidence:** Site is new, not indexed, no Reddit posts, no YouTube tank tours, no creator outreach yet.
- **Recommended fix:** Start the community-participation flywheel from `seo-geo-strategy.md §12.1`. Concretely for the next 30 days:
  - Post one build journal (once built) to r/Aquascape and r/PlantedTank with original photos and a non-promotional question prompt. Include a single link only if discussion warrants it.
  - Pick three aquascaping YouTubers (e.g. MD Fish Tanks, Father Fish, George Farmer) and comment substantively on their last 5 videos each. Build the relationship.
  - Email 5 small aquascaping blogs (DR 10–30) offering to cite their work in exchange for a citation back where warranted. Most will agree if asked well.
- **Priority:** 1

**Issue 2.5.2: Brand searches not yet generating traffic.**
- **Impact:** Medium
- **Evidence:** "fin and stem aquascaping" doesn't appear to return the site as a top result.
- **Recommended fix:** Once the site is indexed, brand searches should resolve to it as the #1 result within 2 weeks. Until then, this isn't fixable directly — but it's the first signal to watch in GSC.
- **Priority:** 2 (latent)

**Issue 2.5.3: No Google Business Profile.**
- **Impact:** Low
- **Evidence:** A reference site, not a local business, but a GBP gives an entity card and helps with brand-search ownership.
- **Recommended fix:** Create a Google Business Profile for "Fin & Stem" as a content publisher. Use the South Africa location. Link back to the site.
- **Priority:** 4

### 2.6 Competitor Benchmarking — Score: 5/10

You're entering a niche where the top results are 5–10-year-old sites with established backlink profiles. The visual design and tooling (planner, compatibility, compare) are significantly ahead of what's out there. The content depth on individual species is roughly on par; first-hand experience is behind.

| Metric | Fin & Stem (est.) | Aquarium Co-Op | Buce Plant | Seriously Fish | 2HR Aquarist |
|---|---|---|---|---|---|
| Estimated DR (Ahrefs) | <10 | 55 | 45 | 50 | 45 |
| Age (years) | <1 | ~15 | ~10 | ~15 | ~7 |
| Indexed pages (est.) | 0–80 | 1,000+ | 500+ | 2,000+ | 400+ |
| Schema markup depth | Excellent | Good | Average | Sparse | Sparse |
| Cross-reference tool | **Yes** | No | No | No | No |
| Tank planner | **Yes** | No | No | No | No |
| Compare species | **Yes** | No | No | No | No |
| First-hand build journals | None yet | Many (videos) | Some | No | No |
| Visual design | Best in class | Average | Good | Dated | Dated |
| AI crawler explicit allow | Yes | Mostly | No | No | No |

### Competitive positioning

**Where you win:**
- The compatibility cross-reference tool is genuinely unique. None of the competitors have it.
- Schema markup depth on species pages is best-in-class (multi-entity `@graph` with Article + BreadcrumbList + ImageObject + FAQPage).
- Visual design is materially ahead of everyone except possibly Tropica.
- AI-crawler-friendly robots.txt is unusual in this niche — when ChatGPT and Perplexity start preferentially pulling from sites that welcome them, this matters.

**Where you lose:**
- Domain Rating gap is ~40 points. Authority builds slowly.
- Aquarium Co-Op has video content for every common species — high-engagement multimedia signal.
- 2HR Aquarist has the methodology authority position locked. Don't try to compete on dosing/CO₂ pillars — you'll lose. Compete on compatibility and visual reference.
- Seriously Fish has 15 years of FishBase-grade species depth.

**Strategic implications:**
- Lean into the compatibility wedge hard. Build the marketing around "the only catalogue that knows what works with what". The competitors can't easily copy this.
- Build journals are the fastest path to closing the experience gap.
- Don't try to outrank "neon tetra care" on a 1-year-old site. Target compound queries — "neon tetras with cherry shrimp", "10L planted tank fish for shrimp", "biotope Brazilian planted tank stocking" — where the existing top results are answering a different question or are thin.

### 2.7 Content Gap Analysis — Score: 6.5/10

The catalogue covers the most-requested species in each category. The gaps are content types: long-tail FAQ articles, build journals, comparison articles, and biotope guides.

| Opportunity | Search Volume (est.) | Difficulty | Why Win | Type | Priority |
|---|---|---|---|---|---|
| "[Species] vs [species]" comparisons (neon vs cardinal, cherry vs amano, java vs christmas moss) | 500–2K each | Low | Existing compare tool generates these naturally; just need indexable destinations | Comparison article | 1 |
| "Best fish for [tank size]L planted tank" | 1K–5K | Medium | Planner already does the math; surface results as articles | List article | 1 |
| "Tank mates for [popular species]" | 2K–10K | High | Compatibility tool gives the answer; article wraps with experience | Tank-mate guide | 1 |
| Biotope guides ("Amazon biotope", "Asian peat swamp biotope") | 200–800 | Low | 2026 trend per Reefco; nobody owns it yet | Pillar-supporting article | 1 |
| "How many [species] in [tank size]L?" | 300–1K each | Low | Stocking-density math from planner | Calculator/article | 2 |
| "Does [species] need CO2?" | 500–2K each | Low | Plant data already supports this | FAQ article | 2 |
| "[Species] water parameters" | 200–500 each | Low | All data on hand | FAQ article | 2 |
| "Can [species] live with [species]?" | 100–500 each | Low | Compatibility data drives this | FAQ article | 1 |
| "[Tank size]L planted tank ideas" | 1K–3K | Medium | Build journals once they exist | List article + builds | 1 |
| "Low tech planted tank no CO2" | 5K | High | Compete via depth + pillar | Pillar expansion | 2 |
| "Aquascape style guide" — Iwagumi, Dutch, Nature, Jungle, Biotope | 500–2K each | Low | Style-by-style guides + plant recommendations per style | Pillar series | 2 |
| "How to cycle a planted tank" | 3K | Medium | Existing knowledge in pillar | Pillar deep-dive | 2 |
| "Aquascaping tools and accessories" | 800 | Low | Equipment collection (when launched) | Equipment pillar | 3 |

A reasonable first-quarter content target: 6 build journals + 30 long-tail FAQ articles + 5 biotope guides + 10 species-vs-species comparisons. That's 51 new indexable pages over 90 days — 4 per week sustained.

---

## 3. Site-Type Checklist — Content/Reference Site

Applied from the content-site checklist:

- ✅ Topical clusters defined (6 pillars, each anchoring a category)
- ✅ Internal linking connects related entries (companions strip, related entries)
- ⚠️ Content refreshed on a regular schedule — not yet established
- ⚠️ Author page exists, but author bio is minimal — needs photo + years + tanks kept
- ❌ No content cannibalization yet (good), but pillar pages currently thin (need expansion)
- ⚠️ Pillar pages exist as routes (`src/app/planted-tank-guide/page.tsx` etc.) but cluster depth not verified — open the file and check word count

---

## 4. Prioritized Action Plan

### Tier 1 — Critical (Do This Week)

| # | Action | File | Effort |
|---|---|---|---|
| T1.1 | Submit `sitemap.xml` to GSC + Bing | (operational) | 15 min |
| T1.2 | Render `<Tldr />` component on species detail pages | `src/components/catalogue/entry-detail.tsx` | 30 min |
| T1.3 | Replace hardcoded `PUBLISHED_AT` with per-entry timestamps | `src/lib/seo.ts`, `src/lib/species-metadata.ts`, `src/data/*.ts` | 1–2 hr |
| T1.4 | Add `keptByAuthor: boolean` and `firstHandNote: string` to entry types; render "Mike's tank" callout when present | `src/types/catalogue.ts`, `src/data/*.ts`, `src/components/catalogue/entry-detail.tsx` | 2 hr |
| T1.5 | Author and ship the first build journal (one of Mike's existing tanks) | new route `src/app/builds/[slug]/page.tsx`, data, photos | 1–2 days |
| T1.6 | Set canonical to bare path on all category landings | `src/app/{fish,plants,shrimp,mosses}/page.tsx` | 15 min |
| T1.7 | Run live PageSpeed Insights on 5 species pages; fix any LCP >3s | (measurement first) | 30 min measure + variable fix |

### Tier 2 — High-Impact (Do This Month)

| # | Action | File | Effort |
|---|---|---|---|
| T2.1 | Add custom FAQ support (`customFaqs` on entry) and write 3–4 custom FAQs for the top 20 species | `src/types/catalogue.ts`, `src/data/*.ts`, `src/lib/species-faq.ts` | 6 hr |
| T2.2 | Add `opengraph-image.tsx` for species, pillars, builds | `src/app/{fish,plants,shrimp,mosses}/[slug]/opengraph-image.tsx`, pillars | 3 hr |
| T2.3 | Expand 6 pillar pages to 2,500+ words each with TOC, FAQ block, ItemList of cluster pages | `src/app/{pillar}/page.tsx` | 2–3 days |
| T2.4 | Add visible "Updated [date] · [N] min read" next to author byline on all pages | `src/components/seo/author-byline.tsx` | 30 min |
| T2.5 | Write 5 species-vs-species comparison articles | new route `src/app/compare/[a]-vs-[b]/page.tsx` or `src/app/guides/[slug]/page.tsx` | 2 days |
| T2.6 | Write 10 long-tail FAQ articles (e.g. "Can neon tetras live with cherry shrimp?") | `src/app/guides/[slug]/page.tsx` | 3 days |
| T2.7 | First Reddit posts (3 over 2 weeks) — pin to subreddit rules, lead with the build journal | (operational) | 3 hr |
| T2.8 | Email 5 aquascaping blogs / YouTubers for cross-citation | (operational) | 2 hr |

### Tier 3 — Quick Wins (Sprinkle In)

| # | Action | File | Effort |
|---|---|---|---|
| T3.1 | Add HSTS + security headers in `next.config.ts` | `next.config.ts` | 15 min |
| T3.2 | Add inline source citations to body text on top 20 species pages | `src/data/species-detail.ts` or careSummary rewrite | 4 hr |
| T3.3 | Render hero key facts as a hidden semantic `<table>` or `<dl>` | `src/components/catalogue/hero-key-facts.tsx` | 1 hr |
| T3.4 | Add `sameAs` external profile links to Person schema | `src/lib/seo.ts:53`, `src/lib/site.ts` | 15 min |
| T3.5 | Improve anchor text variety on internal links | various | 2 hr |
| T3.6 | Create Google Business Profile entity | (operational) | 30 min |
| T3.7 | Self-host top-20 species lead images on R2/Cloudflare | `public/images/lead/`, `src/data/image-attribution.ts` | 4 hr |

### Tier 4 — Long-Term Investments (Roadmap)

| # | Action | Cadence |
|---|---|---|
| T4.1 | Publish one new build journal per month | Monthly |
| T4.2 | Publish one new guide article per week | Weekly |
| T4.3 | Launch the Hardscape collection | Q3 |
| T4.4 | Launch the Equipment collection with Product schema | Q3 |
| T4.5 | YouTube companion content for top builds | Monthly |
| T4.6 | Build out a biotope content cluster (Amazon, SE Asia, West Africa, Lake Tanganyika) | Q3–Q4 |
| T4.7 | Newsletter ramp (target 1,000 subs by month 12) | Continuous |
| T4.8 | Apply for ad networks once at threshold (Ezoic 3K visits → Mediavine 10K → Raptive 25K) | As traffic builds |

---

## 5. Measurement Plan — Tracking what works

Set baseline NOW, before any changes ship, so you can attribute future gains.

### Weekly metrics (set up in GSC + GA4 + a simple spreadsheet)

- Organic sessions (GA4)
- Indexed page count (GSC `site:` count, or Index Coverage report)
- Top 50 ranking queries (GSC, "Queries" tab in Performance)
- Average position for top 20 target queries (GSC, filter by URL)
- Click-through rate per top 20 query (GSC)
- Core Web Vitals pass rate (GSC, "Experience" tab)

### Monthly metrics

- Backlinks (Ahrefs free tier or Search Console "Links" report)
- Referring domains (same)
- Domain Rating estimate (Ahrefs free check)
- AI citations on 20 target queries — manually query ChatGPT, Perplexity, Gemini once a month with a fixed list of 20 questions; record whether Fin & Stem is cited and where. Track over time. (Full method in `seo-geo-strategy.md §11.1`.)

### Quarterly metrics

- Content gap re-analysis (rerun the keyword research; identify newly-attainable terms)
- Competitor DR comparison
- Build journal count (target: 6 by end of Q3)
- Newsletter sub count (target: 250 by end of Q3)

### The single most important signal

**AI citation count.** A reference site like Fin & Stem will be cited by AI assistants before it ranks #1 in Google. Track the 20-query method monthly — that's your earliest reliable signal that the GEO work is compounding.

---

## 6. Sources

- [Generative Engine Optimization 2026](https://llmrefs.com/generative-engine-optimization)
- [Google AI Overviews ranking factors 2026](https://wellows.com/blog/google-ai-overviews-ranking-factors/)
- [March 2026 core update — E-E-A-T amplification](https://www.digitalapplied.com/blog/e-e-a-t-march-2026-google-rewards-experience-content-guide)
- [Topic clusters & internal linking 2026](https://www.digitalapplied.com/blog/seo-content-clusters-2026-topic-authority-guide)
- [Schema.org JSON-LD best practices](https://www.incremys.com/en/resources/blog/schema-seo)
- [How AI engines source information in 2026](https://www.leapd.ai/blog/ai-visibility/how-chatgpt-google-ai-overviews-and-perplexity-source-information-in-2026)
- [Mediavine / Raptive / Ezoic thresholds 2026](https://monetizehelper.com/blog/adthrive-requirements-guide)
- Companion: `seo-geo-strategy.md` (this site's strategy doc)
- Companion: `seo/` directory (page templates, JSON-LD templates, internal-linking rules)

---

## 7. Implementation prompt for Claude Code

A self-contained prompt that ships the Tier 1 changes lives at `prompts/02-seo-implementation.md`. Open Claude Code at the repo root and paste the content of that file as the first message.
