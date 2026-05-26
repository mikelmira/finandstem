# Fin & Stem — SEO + GEO Strategy

**Last updated:** May 2026
**Owner:** Mike (mikee@dsg.co.za)
**Status:** Pre-build strategy; implementation hooks distributed across the repo (see §13).

This file is the source of truth for how Fin & Stem earns organic traffic and AI citations. It is the longer companion to `CLAUDE.md` §8 (Content rollout) and `aquascaping-site-launch-plan.md` §4 (SEO & audience). When this file conflicts with those, **this file wins** — it's the most recent and most specific.

---

## 0. TL;DR

| Pillar | Where we win |
|---|---|
| **First-hand experience (E-E-A-T)** | Mike's actual tank builds + photos. Google's March 2026 core update made the *first* E the dominant ranking signal. |
| **Topical depth** | 40 deeply-detailed species at launch, growing to 300+ in 12 months. One subject covered exhaustively beats five subjects covered shallowly. |
| **Compatibility cross-reference** | Nobody else has structured plant×fish×shrimp×moss compatibility data. That's the canonical-answer source AI engines will cite. |
| **Long-tail capture** | ~94% of search volume is in tail queries. We mass-produce highly specific pages ("Anubias nana petite with shrimp 10L", "Otocinclus for new tank no algae yet") via the catalogue + filter URLs. |
| **AI-citable formatting** | TL;DR blocks, factual passages 100–300 words, comparison tables, FAQ blocks, named entities — the patterns that get cited in Google AI Overviews, ChatGPT, Perplexity. |
| **Schema-rich pages** | JSON-LD on every species page: Article + ImageObject (with CC license) + BreadcrumbList + FAQPage. Equipment pages add Product schema. |

**The thesis:** if Mike's tank journal photos plus 300 cross-referenced species profiles are the only place on the internet where a specific compatibility question can be answered, every AI assistant will eventually cite us, and the SEO follows.

---

## 1. Where we are today (audit)

Current state, pre-build:

- ✅ Niche thesis validated and unique — no current competitor combines all four categories with cross-references.
- ✅ Tech stack is SEO-friendly: Next.js 16 App Router with ISR, server-rendered filter pages with bookmarkable searchParams URLs, structured data via JSON-LD.
- ✅ 40-species deep-detail catalogue already authored — every species has 28–38 columns of reference content + 5 image slots ready.
- ✅ Image attribution data model already defined (license, author, descriptionUrl, attributionRequired).
- ✅ Pagefind decision made for site search (static, free, AI-extractable HTML).
- ⚠️ Author bio / E-E-A-T scaffolding not yet planned. **Fixed in §7.**
- ⚠️ llms.txt / AI-crawler treatment not yet planned. **Fixed in §6.**
- ⚠️ JSON-LD schema types not yet picked per page type. **Fixed in §5.**
- ⚠️ Topic cluster architecture (pillars vs. catalogue entries vs. guides) not yet drawn. **Fixed in §3.**
- ⚠️ GEO-specific content patterns (TL;DR position, comparison tables, FAQ blocks) not yet documented. **Fixed in §4.**
- ❌ No measurement plan. **Fixed in §11.**

---

## 2. Audience and query intent map

Aquascapers search for four distinct things. Each maps to a content type we'll produce.

| Intent | Example query | What we serve | Where it lives |
|---|---|---|---|
| **Identification** | "small red fish for planted tank" | Filter result + species card | `/fish?column=mid&maxAdult=4&difficulty=1,2&plantSafe=1` |
| **Compatibility** | "do neon tetras eat cherry shrimp" | Cross-reference badges on species page + compatibility tool | `/fish/neon-tetra` + `/compatibility` |
| **Setup / how-to** | "how to set up a 30L shrimp tank" | Build guide | `/guides/30-litre-shrimp-tank` |
| **Reference / spec** | "anubias nana light requirements" | Species detail page | `/plants/anubias-nana` |

For each intent type we'll match the *result format the user expects* (filtered list, table, narrative how-to, spec block) — Google rewards format-intent match heavily, and AI engines extract the corresponding format directly.

---

## 3. Topic cluster architecture

**Pillar pages** are deep, single-topic resources (3,000–5,000 words). **Cluster pages** are catalogue entries, build guides, and short focused articles that link up to the pillar and across to each other. Every cluster page links back to its pillar using descriptive anchor text. The pillar links out to every relevant cluster.

We'll launch **six pillars**, each anchoring a major content cluster:

### Pillar 1: `/planted-tank-guide` — "The Complete Planted Aquarium Guide"
Spokes: every plant species page, every plant-focused guide (CO₂ vs no-CO₂, substrate, lighting, dosing schedules, algae diagnosis, trimming techniques).

### Pillar 2: `/aquarium-fish-guide` — "Choosing Aquarium Fish — The Compatibility-First Guide"
Spokes: every fish species page, schooling guidance, water parameter compatibility, biotope planning.

### Pillar 3: `/freshwater-shrimp-guide` — "Freshwater Aquarium Shrimp — Complete Care Reference"
Spokes: every shrimp species page, Neocaridina vs Caridina, water parameter guides, breeding guides.

### Pillar 4: `/aquatic-moss-guide` — "Aquarium Mosses — Identification, Attachment, Care"
Spokes: every moss species page, attachment techniques, moss-tree guides, shrimp-tank moss guides.

### Pillar 5: `/aquarium-hardscape-guide` — "Aquarium Hardscape — Stones, Wood, Substrate"
Spokes: every hardscape entry (when collection launches), composition guides, pH effects, scaping principles.

### Pillar 6: `/aquarium-equipment-guide` — "Aquarium Equipment — Lighting, Filtration, CO₂"
Spokes: every equipment entry, comparison reviews, sizing calculators.

**Linking rules:**
- Every species page must link up to its category pillar with anchor text including the pillar keyword (e.g. "→ Full planted tank guide").
- Every species page must link sideways to at least 3 compatible species (across categories) using their common+scientific name as anchor.
- Every guide must link to every catalogue entry it mentions, and from each entry's "Featured in builds" section back to the guide.
- The `/compatibility` tool gets a contextual link from every species page ("→ Find compatible plants/fish/shrimp for [species]").

---

## 4. On-page content pattern (GEO-optimized)

Every species page follows the same structure. This isn't arbitrary — it matches what AI engines extract.

### 4.1 The species page template

```
<H1>Common Name (Scientific Name)</H1>

<!-- Position 1: AI-extractable TL;DR — 134–167 words is the AI Overview sweet spot -->
<section class="tldr">
  <p><strong>{Common Name}</strong> ({Scientific Name}) is a {type} from {origin}.
  Adult size: {min}–{max} cm. Minimum tank: {minTankL} L. Water column: {position}.
  Temperament: {temperament}. Diet: {diet}. Temperature: {tempMin}–{tempMax} °C.
  pH: {phMin}–{phMax}. Lifespan: {lifeMin}–{lifeMax} years. Difficulty: {1–5}/5.
  {One sentence of opinionated guidance from Mike — what most keepers get wrong.}</p>
</section>

<!-- Position 2: Spec table — comparison-table format AI engines love -->
<section class="specs">
  <h2>Quick Specs</h2>
  <table>{all summary fields as 2-column table}</table>
</section>

<!-- Position 3: Range bars — visual + semantic for entity extraction -->
<section class="parameters">
  <h2>Water Parameters</h2>
  {RangeBar for temp, pH, dGH — each a labelled entity with min/max}
</section>

<!-- Position 4: Compatibility block — the cross-reference moat -->
<section class="compatibility">
  <h2>Works With</h2>
  {Compatible plants, fish, shrimp, mosses — each linked with reason badges}
</section>

<!-- Position 5: Care narrative — Mike's voice, first-hand experience -->
<section class="care">
  <h2>Care</h2>
  <p>{Care summary from spreadsheet}</p>
  <p>{Mike's first-hand pro tip from spreadsheet}</p>
</section>

<!-- Position 6: Deep reference — the 11+ detail columns from the spreadsheet -->
<section class="reference">
  <h2>Habitat</h2><p>...</p>
  <h2>Sexing</h2><p>...</p>
  <h2>Breeding</h2><p>...</p>
  <h2>Color forms / Variants</h2><p>...</p>
  <h2>Diseases & Health</h2><p>...</p>
  <h2>Recommended Tank Setup</h2><p>...</p>
  <h2>Good & Bad Tank Mates</h2><p>...</p>
  <h2>Etymology</h2><p>...</p>
  <h2>Common Misconceptions</h2><p>...</p>
</section>

<!-- Position 7: FAQ — schema.org FAQPage format, AI loves these -->
<section class="faq">
  <h2>Frequently Asked Questions</h2>
  <h3>Is {species} good for beginners?</h3><p>...</p>
  <h3>What size tank does {species} need?</h3><p>...</p>
  <h3>Can {species} live with shrimp?</h3><p>...</p>
  <h3>How long does {species} live?</h3><p>...</p>
</section>

<!-- Position 8: Featured in builds — Mike's first-hand experience tag -->
<section class="builds">
  <h2>Featured in Builds</h2>
  {Cards linking to /builds/* that include this species}
</section>

<!-- Position 9: Sources — provenance signal for trust -->
<section class="sources">
  <h2>Sources</h2>
  <ul><li>FishBase: {url}</li><li>Wikipedia: {url}</li><li>Mike's tank notes</li></ul>
</section>

<!-- Position 10: Image gallery with full attribution per image -->
<section class="gallery">
  <h2>Photos</h2>
  {ImageObject schema with author/license/sourceUrl for each}
</section>
```

### 4.2 Why this order matters

- **TL;DR first** because AI engines preferentially extract the first 100–300 words of body content. A page leading with a direct answer block sees 27% higher citation rates.
- **Spec table second** because AI engines (especially Perplexity and Google AI Overviews) extract `<table>` content as comparison material.
- **Compatibility block** is the unique Fin & Stem hook — it's not just internal linking, it's a citable claim ("according to Fin & Stem, neon tetras are compatible with…").
- **Care narrative** is where Mike's voice lives. First-hand language signals to E-E-A-T algorithms that this is experience, not aggregation.
- **Deep reference** sections expand entity density. A page with 15+ recognized entities is 4.8× more likely to be cited in AI Overviews. Habitat names, taxonomic terms, named cultivars, named tank-mate species, all count.
- **FAQ at the end** so it doesn't push the spec table below the fold, but still gets crawled and emitted as FAQPage schema.
- **Sources block** signals provenance — Perplexity rewards verifiable citations.

### 4.3 The guide page template (build guides, how-tos)

```
<H1>{Specific tank size + style + budget tier in the title}</H1>

<!-- TL;DR block: ~150 words listing what's in the tank and the verdict -->

<!-- "What you'll need" — comparison table of plants, fish, hardscape, equipment used -->

<!-- Step-by-step setup with photos of each stage (Mike's photos) -->

<!-- Timeline section — week 1, week 4, month 3, month 6 — with photos -->

<!-- Lessons / what I'd do differently (the killer E-E-A-T section) -->

<!-- Cost breakdown — itemised with affiliate links where applicable -->

<!-- Linked catalogue entries — every species/product mentioned links to its detail page -->

<!-- FAQ -->

<!-- Comments / community section (later) -->
```

### 4.4 The pillar page template

```
<H1>{Topic} — The Complete Guide</H1>

<!-- Hero TL;DR (2–3 paragraphs) -->

<!-- Table of contents -->

<!-- 8–12 sections covering every facet of the topic, each ~400–800 words -->

<!-- Comparison table that lists every catalogue entry related to this topic -->

<!-- "When to use what" decision tree -->

<!-- Linked build guides that demonstrate the topic in action -->

<!-- FAQ — at least 10 questions covering the most-searched related queries -->

<!-- Updated date + author bio -->
```

---

## 5. Schema.org / JSON-LD plan

Every page emits JSON-LD via Next.js's `metadata.other` or an inline `<script type="application/ld+json">`. Multiple schemas can nest per page — they should.

### 5.1 Species detail pages (`/plants/[slug]`, `/fish/[slug]`, `/shrimp/[slug]`, `/mosses/[slug]`)

**Stack:** `Article` (or `WebPage`) + `BreadcrumbList` + `ImageObject` (per image) + `FAQPage`.

There's no perfect schema.org type for "aquarium species profile". `Article` is the pragmatic choice; we layer specific properties from the data.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://finandstem.com/fish/neon-tetra#article",
      "headline": "Neon Tetra (Paracheirodon innesi) — Care, Tank Mates, Breeding",
      "description": "Complete care guide for the neon tetra: tank size, water parameters, compatibility with plants and shrimp, breeding, diseases, and first-hand keeping notes.",
      "image": ["https://finandstem.com/uploads/fish-001-lead.jpg"],
      "datePublished": "2026-06-01",
      "dateModified": "2026-08-12",
      "author": {
        "@type": "Person",
        "@id": "https://finandstem.com/about#mike",
        "name": "Mike",
        "url": "https://finandstem.com/about"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Fin & Stem",
        "logo": "https://finandstem.com/logo.png"
      },
      "about": {
        "@type": "Thing",
        "name": "Paracheirodon innesi",
        "alternateName": ["Neon Tetra"]
      },
      "keywords": "neon tetra, Paracheirodon innesi, planted tank fish, schooling fish, blackwater, soft water"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://finandstem.com/"},
        {"@type": "ListItem", "position": 2, "name": "Fish", "item": "https://finandstem.com/fish"},
        {"@type": "ListItem", "position": 3, "name": "Neon Tetra"}
      ]
    },
    {
      "@type": "ImageObject",
      "contentUrl": "https://finandstem.com/uploads/fish-001-lead.jpg",
      "license": "https://creativecommons.org/licenses/by-sa/4.0/",
      "creditText": "Author Name",
      "creator": {"@type": "Person", "name": "Author Name"},
      "copyrightNotice": "CC BY-SA 4.0"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is neon tetra good for beginners?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes — neon tetras are one of the most beginner-friendly schooling fish..."
          }
        }
      ]
    }
  ]
}
```

### 5.2 Build/guide pages (`/builds/[slug]`, `/guides/[slug]`)

**Stack:** `HowTo` (for step-by-step builds) or `Article` (for narrative guides) + `BreadcrumbList` + `ImageObject` + `FAQPage` + `ItemList` (for the species/equipment list).

`HowTo` schema entries include `step` arrays, `totalTime`, `estimatedCost`, `tool` and `supply` lists — perfect for setup guides.

### 5.3 Equipment pages (`/equipment/[slug]`, when launched)

**Stack:** `Product` + `Review` + `AggregateRating` (when we have ratings) + `BreadcrumbList` + `FAQPage`.

### 5.4 Pillar pages

**Stack:** `Article` + `BreadcrumbList` + `FAQPage` + `ItemList` (linking every catalogue entry in the cluster).

### 5.5 Compatibility tool page

**Stack:** `WebApplication` + `Article` describing what the tool does + `Dataset` referencing the compatibility data model.

### 5.6 Author / about page

**Stack:** `Person` + `WebSite` + `Organization`. The `Person` block lists `knowsAbout` topics (planted tanks, freshwater shrimp, biotope aquascaping, etc.) — this builds the E-E-A-T entity graph.

---

## 6. AI crawler / GEO setup

### 6.1 robots.txt — block nothing, signal welcoming

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: https://finandstem.com/sitemap.xml
```

Rationale: even though AI engines mostly skip /llms.txt, they DO respect robots.txt user-agent directives. Explicitly allowing each named bot signals our content is available for indexing AND for AI training. The trade-off: our content may be used to train models without direct attribution. We accept that in exchange for citation/visibility — at our scale, the benefit dwarfs the cost.

### 6.2 llms.txt — implement even though adoption is low

```
# Fin & Stem

> The cross-referenced catalogue for aquascapers — plants, fish, shrimp, mosses, hardscape, and equipment with real compatibility data and first-hand tank build journals.

## Catalogue

- [Plants](https://finandstem.com/plants): 50+ aquatic plant species profiles with light/CO₂/temperature requirements, growth rates, and compatible species.
- [Fish](https://finandstem.com/fish): 30+ freshwater fish profiles with tank-size, water parameters, temperament, and tank-mate compatibility.
- [Shrimp](https://finandstem.com/shrimp): Neocaridina and Caridina species with breeding, color grades, and lineage-specific care.
- [Mosses](https://finandstem.com/mosses): Aquatic mosses with attachment techniques and aquascaping uses.

## Guides

- [Planted tank guide](https://finandstem.com/planted-tank-guide): Complete reference for setting up and maintaining planted aquariums.
- [Fish compatibility guide](https://finandstem.com/aquarium-fish-guide): How to choose fish that work with your plants, shrimp, and water parameters.
- [Shrimp keeping guide](https://finandstem.com/freshwater-shrimp-guide): Neocaridina vs Caridina, water chemistry, breeding.

## Tools

- [Compatibility cross-reference](https://finandstem.com/compatibility): Pick any plant, fish, shrimp or moss and see what's compatible across all four categories.

## Build journals

- [Builds](https://finandstem.com/builds): First-hand tank-build journals with photos, costs, timelines, and lessons.

## About

- [Author](https://finandstem.com/about): Mike — aquascaper, builder of the catalogue. Tank-building since [year]; located in South Africa.
```

Adoption may be low today but the file is free to ship and useful for developer-facing AI tools (Cursor, Copilot) right now.

### 6.3 AI-citable content patterns (apply to every page)

These are concrete formatting rules drawn from research on what Google AI Overviews, ChatGPT, and Perplexity extract most:

1. **Lead with the answer.** First paragraph contains a self-contained 100–300 word answer to the page's core query. 27% higher citation rate.
2. **Use tables for comparisons.** Spec tables, parameter tables, comparison-of-three-species tables. AI engines extract `<table>` content disproportionately.
3. **Use FAQ blocks with `<h3>` questions and `<p>` answers.** FAQPage schema + plain-text Q&A format = double extraction surface.
4. **Use named entities aggressively.** Scientific names, cultivar names, brand names (ADA Aqua Soil, Tropica, Chihiros), region names (Rio Negro, Lake Tanganyika). Each named entity strengthens the page's place in the knowledge graph. Target 15+ recognized entities per page.
5. **Cite sources inline.** "According to FishBase…" or "Project Piaba documents…" — Perplexity especially rewards this.
6. **Include statistics/numbers in text.** "Adult neon tetras average 3.5–4 cm; minimum tank 60 L; school size 10+." Numerical data extracts cleanly.
7. **Include the publication and update date prominently** — "Updated August 2026" near the H1. Freshness signal for both Google and Perplexity.
8. **Multimodal: every important section gets an image.** Pages with text+image+structured-data combinations are 156% more likely to be selected by AI Overviews.

---

## 7. E-E-A-T scaffolding

The March 2026 core update made first-hand experience the dominant ranking factor. Fin & Stem is positioned to dominate here because Mike is *actually keeping tanks*. The site needs to make that legible to algorithms.

### 7.1 Author page (`/about`)

A single dedicated page at `/about` with:
- Full name, photo of Mike (not stock).
- Aquascaping bio: years in hobby, types of tanks kept, biggest learnings.
- Photos of current tanks.
- Schema.org `Person` with `knowsAbout` listing every topic cluster.
- Links to external presence: Instagram tank photos, Reddit profile, any forum profile.

### 7.2 Author byline on every article

```html
<a href="/about" rel="author">By Mike</a> · Updated 2026-08-12 · {readingTime} min read
```

The `rel="author"` plus internal link to the Person schema page builds the author entity.

### 7.3 First-hand language patterns

Every species profile that Mike has personally kept gets a "I keep this species" callout with photo of his actual specimen. For species he hasn't kept, the language stays neutral and cites primary sources. Never claim experience that doesn't exist — this gets penalised heavily.

### 7.4 Build journals as the moat

The `/builds` collection is the strongest E-E-A-T asset on the site. Each build journal includes:
- Original photographs at every stage with timestamps.
- Cost itemisation (receipts where possible).
- What went wrong and what was changed.
- Linked species/equipment used.

Three build journals at launch is the bare minimum. Target: one new build journal per month thereafter.

### 7.5 Sources on every page

Every page that uses external information cites it. FishBase, GBIF, peer-reviewed papers where appropriate, 2HR Aquarist (where Mike has read and is referencing methodology). This is both a trust signal for algorithms and good practice.

---

## 8. Technical SEO checklist

| Item | Where it lives | Acceptance |
|---|---|---|
| Sitemap.xml | Auto-generated from Payload collections via Next.js `sitemap.ts` | Includes every published catalogue entry, guide, and pillar. Updated on every build. |
| robots.txt | `app/robots.ts` per §6.1 | All AI bots explicitly allowed. /admin and /api disallowed. |
| llms.txt | `public/llms.txt` per §6.2 | Updated on every release. |
| Canonical URLs | Auto via Next.js metadata | Every page has a single canonical URL. Filter pages canonical to the base list (`/fish` for `/fish?temp=22-26`). |
| Mobile-first | Tailwind responsive utilities | All pages render correctly at 360px. |
| Core Web Vitals | Cloudflare Pages + ISR + next/image | LCP <2.5s, INP <200ms, CLS <0.1 on every page. Verified via Vercel/Cloudflare analytics + Google Search Console. |
| Image optimization | next/image + Cloudflare Image Transforms | WebP/AVIF served by default. Lazy-loaded below the fold. Width/height set to prevent CLS. |
| OG / Twitter Card | `opengraph-image.tsx` route per page | Every page has unique OG image with title + thumbnail. |
| Hreflang | Single-language for now (en) | Add `<link rel="alternate" hreflang="en-za" />` for SA targeting. |
| HTTPS | Cloudflare auto-cert | Forced redirect from http. HSTS header. |
| 404 page | Custom `not-found.tsx` | Includes search and links to top pillars — turns lost traffic into engaged traffic. |
| Internal 301s | Use Next.js redirects in `next.config.mjs` | Slug changes preserve link equity via 301. |
| Schema validation | Schema Markup Validator + Google Rich Results Test | Zero errors on every template type before merge. |
| Page speed budget | Hard cap | <100 KB JS shipped per route (Pagefind index is loaded only on /search). |

---

## 9. Long-tail keyword strategy

We chase tail queries aggressively because they have low competition and high intent. The catalogue + filter UI is built for this.

### 9.1 Auto-generated long-tail surface area

Every filter combination on `/fish`, `/plants`, `/shrimp`, `/mosses` is a unique URL with unique meta. Examples that will all become indexable:
- `/fish?tankL=30&plantSafe=1&shrimpSafe=yes&difficulty=1,2` — "small peaceful fish for 30L planted shrimp tank"
- `/plants?light=low&co2=none&position=foreground` — "low light no CO₂ foreground plants"
- `/shrimp?lineage=neocaridina&difficulty=1` — "easy Neocaridina shrimp"

We canonicalize these to the base list page (so we don't dilute authority), but we DO render unique `<title>` and `<meta description>` based on the active filters AND we link to them from other pages. Internal linking + crawlable URLs = these get indexed and rank for their specific query.

### 9.2 Manual long-tail content

Beyond filter URLs, we author dedicated articles for tail queries that filters can't capture:
- "Does Anubias nana need CO₂?"
- "Can neon tetras live with cherry shrimp?"
- "What temperature do German blue rams need?"
- "How many otocinclus per tank?"

Each lives at `/guides/[slug]` and follows the guide page template. Target: 1 per week starting month 2.

### 9.3 Question-pattern targets

Long-tail SEO research shows ~94% of queries have ≤10 monthly searches. We chase these via the spreadsheet's "Common Misconceptions" and "Pro Tips" columns — they're a goldmine of questions real keepers Google. Each Misconception becomes a dedicated `/guides/myth-...` page or a FAQ entry on the species page.

---

## 10. Local + international targeting (South Africa)

Mike is in SA. We optimize for global English search but with SA-specific signals where they help.

- `<html lang="en">` (not en-ZA — Google handles localisation by IP+behaviour and en-ZA limits global discoverability).
- Mention SA-specific suppliers and shipping considerations in build journals (Aquarium Depot, The Fish Room) — these earn SA-organic search.
- Register and verify Google Business Profile for "Fin & Stem" as an aquascaping reference (not a physical business) — helps with brand searches.
- Price callouts include both USD (global benchmark) and ZAR (local relevance) where relevant.
- Time-of-update timestamps use ISO 8601 UTC, displayed in local English readable form.

---

## 11. Measurement plan

What we measure, where, and the cadence.

| Metric | Tool | Cadence | Target by month 12 |
|---|---|---|---|
| Organic sessions | GA4 or Cloudflare Web Analytics | Weekly | 25,000/mo |
| Indexed pages | Google Search Console | Weekly | 500+ |
| Average position | GSC | Monthly | Top 20 on 200+ queries |
| AI Overview citations | Manual + monthly tracking with [llmrefs.com](https://llmrefs.com) or similar | Monthly | Tracked from month 3 |
| ChatGPT citations | Manual sample of 20 queries/month | Monthly | Cited on 5+ queries |
| Perplexity citations | Manual sample of 20 queries/month | Monthly | Cited on 10+ queries |
| Newsletter subscribers | Buttondown | Weekly | 1,000 |
| Backlinks | Ahrefs (free tier) or GSC Links report | Monthly | 100+ unique domains |
| Domain authority | Moz / Ahrefs free check | Monthly | DR/DA 20+ |
| Core Web Vitals pass rate | GSC | Weekly | 100% pass |

### 11.1 The 20-query AI-citation tracking method

Once a month, ask each of ChatGPT, Perplexity, and Gemini the same 20 questions that should plausibly cite us. Examples:
- "What's the smallest peaceful fish for a 30 litre planted tank?"
- "Are neon tetras safe with cherry shrimp?"
- "What's the easiest moss to grow in a low-tech tank?"
- "How do I tell male and female Crystal Red Shrimp apart?"

Record whether Fin & Stem is cited, and which page. Over time, this is the single best signal of whether GEO is working.

---

## 12. Off-page / link-building strategy

Niche hobby sites rank on topical depth + earned links from the hobby community. We don't buy links.

### 12.1 Community participation (the only sustainable path)

- **Reddit r/Aquascape, r/PlantedTank, r/shrimptank.** Post every build journal as a thread with photos. Include the build link only if the discussion organically warrants it. Drive-by link drops get banned; genuine participation gets goodwill.
- **UKAPS, ScapeCrunch, AquaSnack forums.** Same approach.
- **Reddit AMAs.** After 5+ build journals are live, do an AMA on r/Aquascape framed as "I'm cataloguing every aquarium species with cross-references — AMA."
- **YouTube companion content.** Phone-camera tank tours of each build. Embed the videos on the corresponding build journal page; cross-link both ways.
- **Comment on related YouTube videos with substance.** Not spam — actual contributions to discussion. Pick 3 channels (e.g. MD Fish Tanks, Father Fish, George Farmer) and follow for 6 months.

### 12.2 Resource-link earning

- The compatibility tool will earn natural links because nothing else like it exists. Once it's live, we share it once on Reddit, once on UKAPS, once via Twitter/X aquascaping accounts. Done well, this seeds the link cycle.
- The species catalogue's deep-detail pages will be cited by smaller blogs and YouTubers in their show notes once they discover us. We accelerate this by reaching out to 20 selected creators in month 6 with a "would you cite us?" email plus links to specifically relevant entries.

### 12.3 What we don't do

- No guest-posting on PBN-style sites.
- No paid link insertions.
- No reciprocal link schemes.
- No directory submissions (waste of time in 2026).

---

## 13. Implementation hooks (where each item lives in the repo)

When Claude Code scaffolds the project, these are the files and patterns to create:

| Strategy item | Repo file |
|---|---|
| robots.txt | `app/robots.ts` (Next.js dynamic robots) |
| sitemap.xml | `app/sitemap.ts` (auto-generated from Payload) |
| llms.txt | `public/llms.txt` (static) — also auto-generated on build for accuracy |
| JSON-LD templates | `lib/seo/json-ld.ts` — helpers per page type |
| Page metadata generator | `lib/seo/metadata.ts` — `generateMetadata()` helpers |
| OG image generator | `app/(site)/<route>/opengraph-image.tsx` per page type |
| TL;DR component | `components/seo/TLDR.tsx` — wraps the lead paragraph and matches AI-extractable formatting |
| Spec table component | `components/seo/SpecTable.tsx` |
| FAQ block + schema | `components/seo/FAQ.tsx` — also emits FAQPage JSON-LD |
| Sources block | `components/seo/Sources.tsx` |
| Author byline | `components/seo/AuthorByline.tsx` |
| Breadcrumbs | `components/seo/Breadcrumbs.tsx` — visible + JSON-LD |
| Range bars | `components/RangeBar.tsx` |
| Internal-link helpers | `lib/seo/internal-links.ts` — generates "related species" and "featured in builds" link lists |
| Pillar page template | `app/(site)/[pillar]/page.tsx` pattern |
| Build journal template | `app/(site)/builds/[slug]/page.tsx` |
| Author / about page | `app/(site)/about/page.tsx` with Person schema |
| Compatibility page | `app/(site)/compatibility/page.tsx` with WebApplication schema |
| Image attribution | `components/Attribution.tsx` — renders below every image, must include author + license + Commons file link |
| GSC + analytics | Cloudflare Web Analytics tag in `app/layout.tsx`; GSC verified via DNS or HTML meta |

Templates for each of these are listed below in §14.

---

## 14. Quick-reference templates

### 14.1 TL;DR opening paragraph (species page)

> The **Neon Tetra** (*Paracheirodon innesi*) is a 3.5–4 cm freshwater schooling fish from the upper Amazon basin. A 60 litre minimum tank with soft, slightly acidic water (20–26 °C, pH 5.5–7.0, dGH 1–8) suits a group of 10 or more. Peaceful with most community fish and safe with adult cherry shrimp; will eat shrimplets. Lifespan 5–8 years with proper care. Difficulty 2/5 — beginner-friendly once the tank is mature, but cheap mass-bred stock is prone to Neon Tetra Disease, so source from a reputable breeder and quarantine for four weeks before introduction.

(146 words — inside the 134–167 AI-Overview sweet spot, includes scientific name, all key spec entities, opinionated guidance, named disease entity.)

### 14.2 FAQ block (species page)

```
Is the neon tetra good for beginners?
Yes. Neon tetras are among the most beginner-friendly tropical fish provided the tank is cycled and at least 60 L. They prefer groups of 10+, soft slightly acidic water, and dim lighting. Avoid them if your tap water is very hard (>15 dGH).

How many neon tetras should I keep together?
A minimum of 10. Neon tetras are obligate schoolers and show stress (faded colour, hiding, fin-clamping) in groups smaller than 6. A school of 15–20 in a 75 L planted tank is the visual sweet spot.

Are neon tetras safe with cherry shrimp?
Adults will not bother adult cherry shrimp, but they will eat shrimplets. If breeding shrimp is the goal, choose otocinclus or pygmy corydoras instead — neither preys on shrimplets.

What's the difference between neon tetras and cardinal tetras?
The neon tetra's red stripe runs from mid-body to tail. The cardinal tetra's red runs the full length from snout to tail. Cardinals are larger, more demanding (softer, more acidic water), and usually more expensive.
```

### 14.3 Internal link patterns

When mentioning another catalogue entry in body text, link with both common and scientific name in the anchor:

> "…compatible with [cherry shrimp (*Neocaridina davidi*)](/shrimp/cherry-shrimp) and [pygmy corydoras (*Corydoras pygmaeus*)](/fish/pygmy-corydoras)."

When linking from a species page to its pillar:

> "Read the [complete planted tank setup guide](/planted-tank-guide) for the lighting, CO₂, and substrate basics."

When linking from a species page to a build journal that features it:

> "See [The 30 L Shrimp Nursery build](/builds/30l-shrimp-nursery) for this species in a real tank."

### 14.4 Author byline

```html
<a href="/about" rel="author">
  <img src="/mike-avatar.jpg" alt="Mike" width="32" height="32" />
  By Mike
</a>
· Updated <time datetime="2026-08-12">12 August 2026</time>
· {readingTime} min read
```

### 14.5 Image attribution (renders below every image)

```html
<figcaption class="attribution">
  Image: <span class="author">Author Name</span> ·
  <a href="LICENSE_URL" rel="license">CC BY-SA 4.0</a> ·
  <a href="COMMONS_DESCRIPTION_URL">Source</a>
</figcaption>
```

This is non-negotiable for legal compliance and signals provenance.

---

## 15. Phased rollout

### Phase 1 — Pre-launch (weeks 1–3, local dev)

- All technical SEO scaffolding implemented (sitemap.ts, robots.ts, JSON-LD helpers, OG image generator).
- TL;DR + spec table + FAQ components built and used on every species page.
- All 40 seed species pages render with full schema markup.
- 6 pillar pages drafted (even if short — they can grow).
- Author page live with photo and bio.
- Mike's first 3 build journals authored with photos.

### Phase 2 — Launch (week 4)

- Domain pointed, HTTPS verified, GSC + Bing Webmaster verified.
- Sitemap submitted.
- llms.txt published.
- First Reddit post in r/Aquascape with one of the build journals.

### Phase 3 — Months 2–6

- 1 build journal per week.
- 1 long-tail article per week (FAQ-style).
- Add 5–10 species per week to the catalogue.
- Begin monthly AI-citation tracking (§11.1).
- Pillar pages expanded from "drafted" to "comprehensive 3,000-word resource".

### Phase 4 — Months 7–12

- Hardscape and Equipment collections launched.
- Build journals total 50+.
- Compatibility tool refined based on usage data.
- Mid-tier display ads (Ezoic) added once at 3K monthly visits.
- Direct creator outreach for cross-citation.

---

## 16. Risks and how we de-risk

| Risk | Mitigation |
|---|---|
| Compatibility cross-references get copied wholesale by competitors. | The data structure is the moat. Copying surface content doesn't replicate the relationships. Plus original photos can't be copied. |
| Wikipedia-sourced images aren't visually distinctive enough. | Build journals fill this gap with original photos. Over time, original photography replaces Commons images on top-traffic species. |
| Google AI Overviews kill click-through to the source site. | We optimise for both citation AND click-through. The compatibility tool is the click-magnet — AI engines can't answer "show me all plants compatible with this fish" without sending users to the tool. |
| llms.txt has near-zero adoption today. | Cost to implement is 30 minutes. Upside if/when adoption rises is significant. |
| Mike is the single point of failure for E-E-A-T. | The author page makes that clear and authentic. If Mike onboards collaborators, each gets their own author page. |
| March 2026 core update emphasis on "experience" punishes catalogue-style sites with limited first-hand content. | Every species page that Mike has actually kept gets an "I keep this species" callout. The catalogue's foundation is data + first-hand build journals — not aggregation. |

---

## 17. Sources

- [Generative Engine Optimization 2026 — Complete Guide](https://llmrefs.com/generative-engine-optimization)
- [ChatGPT vs Perplexity vs Gemini citation factors](https://pixis.ai/blog/chatgpt-vs-perplexity-vs-gemini-how-each-ai-engine-cites-differently-and-how-to-optimize-for-each/)
- [Google AI Overviews ranking factors 2026](https://wellows.com/blog/google-ai-overviews-ranking-factors/)
- [llms.txt complete guide 2026](https://codersera.com/blog/llms-txt-complete-guide-2026/)
- [E-E-A-T March 2026 core update](https://www.digitalapplied.com/blog/e-e-a-t-march-2026-google-rewards-experience-content-guide)
- [Topic clusters + pillar pages 2026](https://www.digitalapplied.com/blog/seo-content-clusters-2026-topic-authority-guide)
- [Schema.org JSON-LD best practices 2026](https://www.incremys.com/en/resources/blog/schema-seo)
- [How AI engines source information in 2026](https://www.leapd.ai/blog/ai-visibility/how-chatgpt-google-ai-overviews-and-perplexity-source-information-in-2026)
