# Aquascaping Catalogue Site — Launch Plan & Research

**Stack:** Next.js (built with Claude Code) · **Goal:** Audience-first informational site · **Budget:** As cheap as possible for a custom build · **Audience focus:** Aquascapers who can't find good consolidated info on plants, fish, hardscape, and equipment.

---

## TL;DR — The Cheapest Viable Path

| Layer | Pick | Year 1 cost |
|---|---|---|
| Domain | `.com` via Cloudflare Registrar (at-cost) or `.co.za` via Truehost / HostAfrica | ~$10 / R89 |
| Hosting | Cloudflare Pages/Workers (free tier, unlimited bandwidth, commercial use OK) — or Hetzner CX22 VPS + Coolify if you outgrow it | $0 → ~€3.29/mo |
| Database | Turso (SQLite, 5 GB / 500M reads free) or Neon Postgres (0.5 GB free) | $0 |
| CMS / admin | Payload CMS 3 installed inside the same Next.js app, Postgres or SQLite backend | $0 |
| Image storage | Cloudflare R2 ($0.015/GB, zero egress) + Cloudflare Images transforms (5k/mo free) | <$1/mo |
| Email / newsletter | Buttondown free or Beehiiv free | $0 |
| Analytics | Plausible self-host, Umami, or Cloudflare Web Analytics | $0 |
| **Total year 1** | | **~$15–$50** if you stay on free tiers |

Realistically you can launch the entire thing for under $30 and only start paying when traffic actually shows up.

---

## 1. The Opportunity — Why this niche is winnable

**What already exists:**
- **2HR Aquarist** (Dennis Wong) — the gold standard for planted-tank methodology, dosing, CO₂, algae diagnosis. Strong opinionated guides; weaker as a browsable catalogue.
- **Tropica Plant Database** — high-quality but limited to plants Tropica sells, with a marketing slant.
- **Flowgrow** (German) — the most comprehensive aquatic plant database with detailed growth data; UI feels dated, English content is thinner, no fish/hardscape integration.
- **Seriously Fish** — best species profiles for freshwater fish (and the model to study), but coverage is uneven and updates are slow. No plant or hardscape side.
- **Aquarium Co-Op / Buce Plant blogs** — content marketing for shops; great for SEO inspiration but commercially biased.
- **UKAPS Plantbase, IWGS Plant Database, Aqua-Fish.net** — community-run, varying quality.

**The actual gap (consistent with your own frustration):**
1. **No single site combines plants + fish + hardscape + equipment** with cross-references ("plants that work in a 20-gallon, 6500K low-tech with neocaridina shrimp"). Everything is siloed.
2. **Compatibility / system-level guidance is weak.** Most sites profile one species in isolation. People struggle to answer "does X work with Y water parameters and Z equipment?"
3. **Hardscape coverage is almost non-existent as structured data.** Seiryu vs. Dragon Stone vs. Ohko — buoyancy, pH effects, scaping principles, sizes you actually need for tank L — barely catalogued anywhere.
4. **Equipment is fragmented across YouTube reviews and forum threads.** Specs aren't normalized (PAR/PUR for lights, flow rates that match tank length, CO₂ working pressures).
5. **The 2026 trend is biotope / naturalistic / minimalist** ([Reefco 2026 trends](https://reefcoaquariums.com/blogs/news/2026-aquascaping-trends-biotope-naturalistic-and-minimalist-designs)) — there's a content opening around region-accurate biotope setups.

**Your positioning candidate:** *"The Wikipedia for aquascapers — every plant, fish, stone, and piece of equipment cross-referenced for compatibility, with build guides that show real setups."*

---

## 2. Tech Stack — The Custom-but-Cheap Build

### 2.1 Framework: Next.js (App Router)

You're already committed. Good choice for a catalogue site because:
- Static generation (ISR) for thousands of plant/fish/equipment pages — Google-fast, near-zero compute cost.
- App Router + RSCs let you do server-rendered filtering/search without a JS-heavy client.
- Next.js 16.2 introduced a stable **Adapter API** with first-class support for Cloudflare, Netlify, AWS, Vercel ([Next.js across platforms](https://nextjs.org/blog/nextjs-across-platforms)) — you're not locked to one host.

### 2.2 Hosting — Two real choices

**Option A: Cloudflare Workers/Pages via OpenNext adapter (Recommended start)**
- **Free tier is genuinely unlimited bandwidth, 500 builds/mo, 100 sites, commercial use allowed** ([Hosting free tier comparison 2026](https://agentdeals.dev/hosting-free-tier-comparison-2026)).
- Deploy with `@opennextjs/cloudflare` — Cloudflare's own [OpenNext adapter](https://opennext.js.org/cloudflare) replaces the deprecated `next-on-pages`.
- Cloudflare Workers free: 100K requests/day — fine for early traffic.
- You get global edge by default, which matters from South Africa.
- Caveat: some Next.js features (ISR with on-demand revalidation, certain image-loader paths) need adapter-aware setup.

**Option B: Vercel Hobby**
- Easiest possible Next.js deploy; everything works.
- **The Hobby plan prohibits commercial use** ([Hosting free tier comparison 2026](https://agentdeals.dev/hosting-free-tier-comparison-2026)) — fine while you have zero affiliate links/ads, but the moment you monetize you must upgrade to Pro (~$20/mo).

**Option C: Hetzner CX22 (€3.29/mo) + Coolify (free, self-hosted)**
- Run Next.js, Payload CMS, and Postgres on a single €3.29/mo VPS using [Coolify on Hetzner](https://blixamo.com/blog/deploy-nextjs-coolify-hetzner) (Vercel-style git-push deploys, free SSL, preview URLs).
- Best long-term value once traffic is real, but Hetzner's German data centers add latency from SA — fine for an SEO/content site, less ideal for interactive apps.
- South-Africa-local alternative: Truehost VPS from ~R80/mo.

**Recommendation:** Start on **Cloudflare** (free, commercial-friendly, edge-fast). Migrate to Hetzner+Coolify only if/when you hit a wall. The Next.js Adapter API means the migration is real but not painful.

### 2.3 CMS / Data Layer — Payload 3 inside your Next.js app

Payload 3 installs **directly into your Next.js `/app` folder** — same server, same routes, same build, same auth ([Payload 3.0 announcement](https://payloadcms.com/posts/blog/payload-30-the-first-cms-that-installs-directly-into-any-nextjs-app)). For a catalogue site this is exactly what you want because:

- Type-safe collections (Plant, Fish, Hardscape, Equipment, Build) — Claude Code can scaffold these in TypeScript.
- A real admin UI you can log into to add species, with rich text, image uploads, relationships ("this plant is compatible with these fish").
- Full GraphQL + REST APIs auto-generated.
- Self-hosted, open source, no per-record pricing — Sanity charges past their free tier; Payload doesn't.
- Postgres or SQLite backend, your choice.

**Alternatives you can ignore for now:**
- **Sanity** — great DX, generous free tier, but you'd run a separate studio and pay once you outgrow it. Their pricing starts at $99/mo for growth ([Headless CMS 2026 comparison](https://gmweb.pl/en/blog/headless-cms)).
- **Directus / Strapi** — good if you needed a separate backend service, but Payload-in-Next.js is the cleaner single-deploy story.
- **MDX in git** — fine for blog posts; brutal for a catalogue you want to filter and cross-reference.

### 2.4 Database — Turso (SQLite) or Neon (Postgres)

| | Turso | Neon |
|---|---|---|
| Type | SQLite (LibSQL) | Postgres |
| Free tier | 5 GB storage, 500M row reads/mo | 0.5 GB storage, 100 compute-hours |
| Best for | Read-heavy content APIs, edge latency | Relational complexity, branching, mature ecosystem |
| Catalogue-site fit | Excellent (mostly reads, edge replicas are zero-hop) | Excellent if you want Postgres comfort |

For a content site that's 99% reads, **Turso + Drizzle ORM** is the modern stack ([SQLite Renaissance 2026](https://dev.to/pockit_tools/the-sqlite-renaissance-why-the-worlds-most-deployed-database-is-taking-over-production-in-2026-3jcc)). Pair with embedded replicas and your read latency from anywhere is sub-millisecond. Payload supports both — pick Postgres on Neon if you'd rather stay in Postgres-land.

### 2.5 Images — R2 for storage, Cloudflare Images for transforms

You'll have **thousands of images** (plant photos at multiple sizes, fish, hardscape, equipment). The cheapest path:

- **Store originals in Cloudflare R2:** $0.015/GB/month, **zero egress** ([R2 pricing](https://developers.cloudflare.com/r2/pricing/)). A 10 GB photo library costs ~$0.15/mo.
- **Resize/optimize with Cloudflare Image Transforms:** 5,000 transforms/month free, then $0.50 / 1,000 ([Image CDN cost math](https://theimagecdn.com/docs/cloudflare-images-pricing)).
- **Crossover point:** if you exceed ~5,000 images × 3 sizes = 15K transforms, switch to **BunnyCDN Optimizer at $9.50/mo flat** ([BunnyCDN vs Cloudflare](https://affinco.com/bunny-cdn-vs-cloudflare/)).
- **Anti-pattern:** do **not** put originals in Cloudflare Images itself — storage + delivery fees compound and add 25–50% to your bill for no benefit ([Image CDN cost math](https://theimagecdn.com/docs/cloudflare-images-pricing)).

Wire `next/image` to a custom loader pointing at your R2/Cloudflare or Bunny endpoint.

### 2.6 Search

For a catalogue you'll quickly want faceted filter + free-text search. Options:
- **Pagefind** (free, static) — generates a search index at build time; perfect if your data is mostly static.
- **MeiliSearch / Typesense self-hosted** — drop on your VPS when you migrate.
- **Algolia free tier** — generous but switches to paid quickly.

Start with Pagefind. It's a Claude Code build away.

### 2.7 Domain

- **`.com` via Cloudflare Registrar** — wholesale price, no renewal markup (~$10/yr). Recommended for international reach.
- **`.co.za`** via Truehost (R89), HostAfrica (~R49 promo), or Domains.co.za ([Cheapest .co.za 2026](https://truehost.co.za/cheapest-co-za-domain-registration-south-africa/)). Watch out for hidden renewal jumps with international registrars.
- Common pattern: register both, redirect `.co.za` → `.com`.

---

## 3. Content & Data — The Real Hard Part

A catalogue site lives and dies by its data. You can't just scrape competitors — that's both legally risky and gets you crushed in search for thin content. Here's the legal, sustainable playbook.

### 3.1 Species data (fish + plants)

**Open / commercial-use friendly sources:**

| Source | Coverage | License | Notes |
|---|---|---|---|
| **FishBase** (via [fishbase.ropensci.org](https://fishbase.ropensci.org/fishbase) S3 API or [rfishbase](https://docs.ropensci.org/rfishbase/)) | 35,000+ fish species, biology, ecology, photos | Mixed — check per-table; foundational research data | The single best fish dataset on Earth. Cite explicitly. |
| **GBIF Species API** ([techdocs](https://techdocs.gbif.org/en/openapi/v1/species)) | Taxonomy, occurrences, ranges | CC0, CC BY, or CC BY-NC per dataset ([GBIF licensing](https://www.gbif.org/terms)) | Use the CC0/CC BY datasets only if you'll have ads/affiliates. |
| **Wikimedia Commons** | Images of nearly every aquarium species | CC-BY-SA, CC-BY, CC0 (per file) — commercial use allowed with attribution ([Commons:Reusing](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)) | Best source for legal launch imagery. |
| **iNaturalist API** | Photos + observations | **Default CC BY-NC** — *not* commercial-use friendly ([iNat licensing](https://help.inaturalist.org/en/support/solutions/articles/151000169918-can-i-use-the-photos-and-sounds-that-are-posted-on-inaturalist-)). You'd need to filter to CC BY / CC0 licensed photos only. | Treat as a filtered fallback, not a primary source. |
| **Wikipedia / Wikidata** | Structured species facts | CC-BY-SA | Great for taxonomy, common names, native ranges. |

**Aquatic-plant-specific:**
- **Tropica** and **Dennerle** have public plant lists but their *content* is copyrighted. Don't copy — use them as a checklist of species you should profile.
- **Flowgrow** has rich data but it's a competitor; same rule.

**Your job is value-add, not duplication.** The defensible plan:
1. Use FishBase + GBIF + Wikidata as raw structured backbone (taxonomy, range, basic biology).
2. Pull Wikimedia Commons images with proper attribution.
3. **Write your own care guidance in your own voice**, informed by your tank-building experience, 2HR Aquarist methodology, and community sources. This is the moat.
4. Cross-reference everything: every fish profile links to compatible plants, suitable hardscape, recommended equipment for that species' bioload.

### 3.2 Equipment data

No equivalent open dataset. Build it manually:
- Pick the 50–100 most-asked-about products (Fluval, Eheim, Chihiros, Twinstar, Oase, ADA, JBL, Seachem).
- Pull spec sheets from manufacturers (factual specs aren't copyrightable; copy is).
- Write your own normalized review schema: PAR/PUR for lights, GPH and head loss for filters, working pressure for regulators, etc.

### 3.3 Hardscape data

Currently the biggest content gap. Catalogue:
- Stones (Seiryu, Dragon, Ohko/Ryuoh, Frodo, lava, manten) — composition, pH/KH effect, surface texture, sizing math.
- Wood (Spider, Manzanita, Mopani, Redmoor, Cholla) — tannin level, sinking behavior, longevity.
- Substrates (ADA Aqua Soil variants, UNS Controsoil, Tropica Soil, Fluval Stratum, inert + root tab combos).

This is fully original content — write from experience and a couple of strong reference photos per item.

### 3.4 Build guides ("setups")

This is what you can do that competitors don't:
- Each guide ties to specific catalogue entries (the plants, fish, hardscape, equipment used).
- Filter by: tank size, tech level (low/med/high), CO₂ yes/no, budget tier, scape style (Iwagumi, Dutch, Nature, Jungle, Biotope).
- Use your own tanks as the first 5–10 guides. Photos of *your* builds are your most defensible asset.

### 3.5 Information architecture (URL structure)

```
/plants/[slug]                 // Hygrophila polysperma
/plants/category/[slug]        // foreground, midground, stem, epiphyte, moss
/fish/[slug]                   // Paracheirodon innesi (Neon Tetra)
/fish/category/[slug]          // tetra, rasbora, cichlid, catfish, shrimp
/hardscape/stones/[slug]
/hardscape/wood/[slug]
/equipment/lighting/[slug]
/equipment/filtration/[slug]
/equipment/co2/[slug]
/builds/[slug]                 // "30L low-tech jungle for shrimp"
/guides/[slug]                 // long-form how-tos
/compatibility?fish=...&plant=...  // the killer feature
```

Topic clusters with strong internal linking is how niche sites beat domain authority — long-tail KD<25 keywords are wide open in this hobby ([Long-tail SEO 2026](https://keywordseverywhere.com/blog/long-tail-seo-secrets-to-explosive-traffic/)).

---

## 4. SEO & Audience Strategy

**The thesis:** ~94% of search queries have volume ≤10/mo. Aquascaping is full of these. You win by covering thousands of long-tail queries comprehensively.

**Practical plan:**
1. **Seed keywords** from your own struggle: literally write down every question you Googled while building your tanks. Those *are* your titles.
2. **Expand via Google autocomplete, "People Also Ask," and Reddit/r/Aquascape, r/PlantedTank** — mine the questions that get answered badly.
3. **Filter to KD <25** in Ahrefs / Semrush free trials, or use Keywords Everywhere.
4. **Cluster** long-tail terms into single pages — e.g. *Anubias nana petite* page covers "anubias nana petite care," "anubias nana petite vs anubias nana," "anubias nana petite on driftwood."
5. **Internal linking** every catalogue entry to compatibility partners is your secret weapon.

**Content cadence for year 1:**
- Months 1–2: 50 plant profiles + 50 fish profiles + 20 hardscape entries (Wikimedia images + your writing). This is the catalogue baseline.
- Months 3–6: 1 high-quality build guide per week (your own tanks, then friends', then commissioned).
- Months 6–12: Equipment reviews + comparison pages (these convert to affiliate revenue).

**Distribution:**
- Post every build guide as a thread on r/Aquascape, r/PlantedTank, ScapeCrunch, UKAPS — *with* a free version in the post and a link to your deeper guide.
- YouTube companion videos for top guides — even rough phone-camera builds outrank text in this niche.
- Newsletter from day one (Buttondown free up to 100 subs, Beehiiv free to ~2.5K). Capture every visitor.

---

## 5. Monetization (You asked) — What pays in this niche

You said audience-first; the good news is that **the aquarium hobby has unusually good affiliate economics** because gear is expensive and hobbyists research deeply before buying.

| Channel | Realistic income | Threshold to start |
|---|---|---|
| **Amazon Associates** (Pets category = 3% commission) ([Amazon rates 2026](https://earnifyhub.com/blog/affiliate/amazon-associates-commission-rates-all-categories.php)) | Low per-click but huge breadth; covers any product mention | Approval requires 3 qualifying sales in 180 days. |
| **Bulk Reef Supply** — 5% commission, 7-day cookie, high AOV ([BRS Affiliate](https://www.bulkreefsupply.com/affiliate-program)) | Strong for saltwater content | Apply directly via email. |
| **2HR Aquarist** — 10% reward via Aquasabi affiliate ([Commission Academy roundup](https://commission.academy/blog/best-fishkeeping-affiliate-programs/)) | Excellent for planted-tank methodology audience | Open program. |
| **Bantam.earth** — 10% commission on terrarium/aquarium supplies | Niche relevant | Open program. |
| **Local SA shops** (Aquarium Depot, The Fish Room, etc.) | Often willing to do informal affiliate / sponsored content | Direct outreach. |
| **Display ads — Ezoic** | Best entry-level network: **no minimum traffic**, ~$5–$15 RPM ([Mediavine/Raptive/Ezoic comparison](https://eastondev.com/blog/en/posts/media/20260110-adsense-alternatives-comparison/)) | 3K+ monthly visits is the practical floor. |
| **Display ads — Raptive (ex-AdThrive)** | 25K pageviews/mo minimum (lowered Oct 2025 from 100K) ([Raptive requirements](https://monetizehelper.com/blog/adthrive-requirements-guide)) | Realistic 12–18 months out. |
| **Display ads — Mediavine Journey tier** | 10K monthly sessions ([Mediavine requirements 2026](https://bloggingexplorer.com/mediavine-requirements/)) | Realistic 9–15 months out. |
| **Premium content / Patreon** | Build guides, downloadable scape plans, dosing calculators | Once you have ~1K newsletter subs. |
| **Sponsored content** | Plant nurseries, equipment brands | Once you have ~10K monthly visits. |

**Order to implement:**
1. Month 0: Amazon SA + Amazon US Associates apply (use SA cookie + US split).
2. Month 3: Apply for niche affiliates (2HR Aquarist/Aquasabi, BRS, Bantam).
3. Month 6: Ezoic ads if you're past 3K visits.
4. Month 12+: Mediavine Journey → Raptive as traffic grows.

**The honest take on revenue:** A well-run niche hobby site doing 25K monthly pageviews can realistically clear $500–$1,500/mo blended (ads + affiliates). The path to that is content quality and patience, not tricks.

---

## 6. Year-1 Cost Sheet

| Item | Provider | Cost |
|---|---|---|
| Domain `.com` | Cloudflare Registrar | ~$10 |
| Domain `.co.za` (optional) | Truehost / HostAfrica | R89 (~$5) |
| Hosting | Cloudflare Pages/Workers free | $0 |
| Database | Turso free or Neon free | $0 |
| CMS | Payload self-hosted | $0 |
| Image storage | Cloudflare R2 (~10 GB) | ~$2/yr |
| Image transforms | Cloudflare free tier | $0 (until ~5K transforms/mo) |
| Search | Pagefind | $0 |
| Email | Buttondown / Beehiiv free | $0 |
| Analytics | Cloudflare Web Analytics / Plausible self-host | $0 |
| Logo/branding | Claude + Figma free | $0 |
| Backup VPS (optional, if you migrate) | Hetzner CX22 | €40/yr |
| **Year-1 total (Cloudflare path)** | | **~$15–$50** |
| **Year-1 total (VPS path)** | | **~$50–$100** |

Buffer ~$100 for unexpected — paid SEO tool month, stock photography to fill gaps, sponsored Reddit ad to test the audience.

---

## 7. Launch Checklist — 90-Day Plan

### Days 1–14: Foundations
- [ ] Register `.com` (Cloudflare) and `.co.za` (Truehost) domains.
- [ ] Set up Cloudflare account: R2 bucket, Pages project, Workers, Web Analytics.
- [ ] Set up Turso DB (or Neon) and connect Drizzle ORM.
- [ ] `npx create-next-app@latest` → Next.js 16 App Router project.
- [ ] Install Payload CMS 3 into the same Next.js app (follow [Payload + Next.js 16 guide](https://www.buildwithmatija.com/blog/deploy-payload-cms-nextjs-16-self-hosted)).
- [ ] Define collections: Plant, Fish, Hardscape, Substrate, Equipment, Build, Guide, with relationships.
- [ ] Deploy a placeholder homepage to Cloudflare via OpenNext.
- [ ] Newsletter signup on the landing page (Buttondown form embed).

### Days 15–30: Catalogue seed
- [ ] Script to ingest taxonomy + basic data from GBIF Species API into Payload.
- [ ] Script to fetch CC-BY / CC-0 / CC-BY-SA images from Wikimedia Commons API with attribution metadata stored on each image.
- [ ] Build catalogue list + detail pages (server-rendered/ISR).
- [ ] Build the cross-reference / compatibility schema.
- [ ] Author your first 20 plant profiles by hand on top of the seeded data — your voice, your moat.

### Days 31–60: Real content + first builds
- [ ] 50 plants + 50 fish profiles live.
- [ ] 20 hardscape items live (your photos + written analysis).
- [ ] 3 build guides documenting your own tanks (photos at every stage).
- [ ] Pagefind search wired up.
- [ ] On-page SEO pass: schema.org markup (`Article`, `Product` where relevant), Open Graph images via Next.js `opengraph-image`, sitemap, robots.txt.
- [ ] Apply for Amazon Associates SA + US.

### Days 61–90: Distribute + iterate
- [ ] Post each build guide to r/Aquascape, r/PlantedTank, UKAPS, ScapeCrunch.
- [ ] Submit sitemap to Google Search Console + Bing Webmaster Tools.
- [ ] First newsletter blast.
- [ ] Apply for 2HR Aquarist / Aquasabi, BRS, Bantam affiliates.
- [ ] Add affiliate disclosure page (required by FTC + most affiliate ToS).
- [ ] Set up automated weekly check on Google Search Console — which long-tail queries are surfacing? Write to those.

---

## 8. Risks & How to De-Risk

| Risk | Mitigation |
|---|---|
| Content thinness ("just another aquascaping blog") | Original photos of your own tanks; cross-reference compatibility is the differentiator; never paraphrase a competitor. |
| Image licensing slip-up | Store `license`, `author`, `sourceUrl`, `attributionHtml` fields on every image record; never display an image without rendering the attribution. |
| Cloudflare free-tier surprises | Monitor Workers requests + transform counts; the migration path to Hetzner+Coolify is documented and well-trodden. |
| Vercel Hobby commercial-use trap | If you start on Vercel, move off the moment you add an affiliate link — switch to Cloudflare or upgrade to Pro. |
| SEO competition from 2HR Aquarist / Tropica | Target *long tail* and *combinations* (e.g. "Anubias nana petite + amano shrimp + low-tech 30L"), not head terms. |
| Burnout | One build guide a week is a year of content. Don't try to launch with 500 profiles. Launch with 100 great ones and grow. |

---

## 9. Building with Claude Code — Practical Notes

- Use Claude Code in your local Next.js repo. Treat each subsystem as a focused session: "scaffold Payload collection for Plant", "write the GBIF ingest script", "build the compatibility page".
- Keep a `CLAUDE.md` at the repo root with your architectural decisions (Cloudflare + Payload + Turso + R2) so the model has context every session.
- Have Claude generate JSON Schemas for your collections first, then implement Payload configs from those — keeps types consistent across DB, CMS, and frontend.
- For the species ingest, ask Claude Code to write idempotent scripts that you can re-run as GBIF / Wikimedia data changes.
- Lean on Claude for SEO grunt work: generating `<title>`, `<meta description>`, and `schema.org` JSON-LD for every catalogue entry based on its data.

---

## 10. Sources

- [2HR Aquarist](https://www.2hraquarist.com/)
- [Aquasabi aquascaping wiki](https://www.aquasabi.com/aquascaping-wiki_aquatic-plants)
- [Flowgrow Aquatic Plant Database](https://www.flowgrow.de/db/aquaticplants)
- [UK Aquatic Plant Society](https://www.ukaps.org/)
- [Aqua-Fish.net](https://en.aqua-fish.net/)
- [2026 Aquascaping Trends — Reefco](https://reefcoaquariums.com/blogs/news/2026-aquascaping-trends-biotope-naturalistic-and-minimalist-designs)
- [Hosting & PaaS Free Tier Comparison 2026](https://agentdeals.dev/hosting-free-tier-comparison-2026)
- [Next.js Across Platforms (Adapter API)](https://nextjs.org/blog/nextjs-across-platforms)
- [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare)
- [Cloudflare Pages Next.js docs](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Deploy Next.js on Hetzner with Coolify](https://blixamo.com/blog/deploy-nextjs-coolify-hetzner)
- [Headless CMS Guide 2026 — GMWEB](https://gmweb.pl/en/blog/headless-cms)
- [Payload 3.0 announcement](https://payloadcms.com/posts/blog/payload-30-the-first-cms-that-installs-directly-into-any-nextjs-app)
- [Deploy Payload CMS with Next.js 16 (self-hosted)](https://www.buildwithmatija.com/blog/deploy-payload-cms-nextjs-16-self-hosted)
- [Turso Pricing](https://turso.tech/pricing)
- [Database Free Tier Comparison 2026](https://agentdeals.dev/database-free-tier-comparison-2026)
- [SQLite Renaissance 2026](https://dev.to/pockit_tools/the-sqlite-renaissance-why-the-worlds-most-deployed-database-is-taking-over-production-in-2026-3jcc)
- [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/)
- [Cloudflare Images pricing 2026](https://theimagecdn.com/docs/cloudflare-images-pricing)
- [Bunny CDN vs Cloudflare](https://affinco.com/bunny-cdn-vs-cloudflare/)
- [FishBase API (rOpenSci)](https://fishbase.ropensci.org/fishbase)
- [rfishbase docs](https://docs.ropensci.org/rfishbase/)
- [GBIF Species API](https://techdocs.gbif.org/en/openapi/v1/species)
- [GBIF Terms of Use](https://www.gbif.org/terms)
- [Wikimedia Commons reusing content](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)
- [Wikimedia Commons licensing](https://commons.wikimedia.org/wiki/Commons:Licensing)
- [iNaturalist photo licensing](https://help.inaturalist.org/en/support/solutions/articles/151000169918-can-i-use-the-photos-and-sounds-that-are-posted-on-inaturalist-)
- [Amazon Associates commission rates 2026](https://earnifyhub.com/blog/affiliate/amazon-associates-commission-rates-all-categories.php)
- [Bulk Reef Supply Affiliate Program](https://www.bulkreefsupply.com/affiliate-program)
- [11 Best Fishkeeping Affiliate Programs — Commission Academy](https://commission.academy/blog/best-fishkeeping-affiliate-programs/)
- [Mediavine vs Raptive vs Ezoic 2026](https://eastondev.com/blog/en/posts/media/20260110-adsense-alternatives-comparison/)
- [Mediavine requirements 2026](https://bloggingexplorer.com/mediavine-requirements/)
- [Raptive (AdThrive) requirements](https://monetizehelper.com/blog/adthrive-requirements-guide)
- [Long-Tail SEO secrets 2026](https://keywordseverywhere.com/blog/long-tail-seo-secrets-to-explosive-traffic/)
- [Cheapest .co.za domain registration 2026](https://truehost.co.za/cheapest-co-za-domain-registration-south-africa/)
