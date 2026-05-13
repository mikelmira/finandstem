# Fin & Stem — Project Brief & Claude Code Handoff

**Project:** A planted-aquarium catalogue + guide site.
**Owner:** Mike (mikee@dsg.co.za)
**Status:** Pre-build. Local development starts next; production deploy planned 2–3 weeks out.
**Audience:** Aquascapers struggling to find consolidated information on plants, fish, hardscape, and equipment when building tanks.

---

## 0. If you're Claude Code opening this for the first time, read this section first

You are picking up a project that has been planned but not yet scaffolded. Before writing any code:

1. Read this entire file.
2. Read `aquascaping-site-launch-plan.md` (sibling file) for the deeper research, competitor analysis, monetization, and SEO context.
3. Open `aquascaping-catalogue-seed.xlsx` to understand the data shape. Sheets: README, Fish (10), Plants (10), Shrimp (10), Mosses (10), Image Sources (40 consolidated).
4. Skim `scrape_images.py` — the Wikimedia Commons image scraper. Each image must capture `url, license, author, licenseUrl, sourceUrl` for legal attribution.
5. Confirm the tech stack with Mike before scaffolding (see §3). If anything in this file conflicts with what Mike says in chat, **Mike wins**.

**What to do first when scaffolding starts:**
1. `pnpm create next-app@latest finandstem --typescript --app --tailwind --eslint --import-alias "@/*"`
2. Install Payload 3 inside the same Next.js app (see §3.2 and the Payload 3 docs link in §10).
3. Define collections: `Plant`, `Fish`, `Shrimp`, `Moss`, `Hardscape`, `Equipment`, `Build`, `Guide`, `Media`. Schema in §5.
4. Write the spreadsheet → Payload import script. Schema in §5.
5. Extend `scrape_images.py` so it writes directly into the Payload `Media` collection.
6. Render catalogue list + detail pages with ISR. SEO metadata + JSON-LD schema.org markup per entry.
7. Pagefind for static search. No Algolia.

---

## 1. Brand

| Field | Value |
|---|---|
| Name | **Fin & Stem** |
| Domain (primary) | **finandstem.com** — to be registered via Cloudflare Registrar (~$11.25/yr) |
| Domain (local) | **finandstem.co.za** — register via Truehost (R89) or HostAfrica (R49 promo). 301 → .com. |
| Positioning | "The cross-referenced reference book for aquascapers — plants, fish, hardscape, and equipment with real compatibility data." |
| Tone | Practical, confident, friendly. Like a knowledgeable mate explaining things at his tank, not a textbook. |
| Visual direction | **Field-guide / herbarium aesthetic.** Warm cream parchment page background; deep forest-green text and CTAs; specimen photos sit on cream paper cards with subtle borders and soft shadows. Bold editorial serif (Fraunces) for headlines, sans for body. Numbered section eyebrows (`01·02·03 — DECISION`). Drop cap on long body prose. Pill-shaped CTAs in deep green. The whole thing should feel like a modern reprint of a 1920s botanical reference. |
| Anti-pattern | Forum-style. Cluttered ad-stuffed layouts. AI-generated stock fish art. Pure white backgrounds (too sterile — needs warmth). Dark mode as the default (rejected May 2026 in favour of the field-guide light theme). |

---

## 2. Product thesis (read this before changing any feature)

Existing aquascaping resources are siloed:
- **2HR Aquarist** owns methodology and dosing — but it's not a browsable catalogue.
- **Tropica Plant Database** is comprehensive but tied to what Tropica sells.
- **Flowgrow** has the best aquatic plant data but a dated UI and is German-first.
- **Seriously Fish** has the best fish profiles, but coverage is uneven and updates are slow.
- Hardscape (stones, wood, substrate) is barely catalogued anywhere with structured data.
- **Nothing cross-references plants + fish + hardscape + equipment for compatibility.**

Fin & Stem's edge is that cross-reference: every entry knows what it works with, every guide is built from catalogue entries, every catalogue entry shows up in real builds. The defensible content moat is original tank photos and tank-build journals from Mike's own builds.

---

## 3. Tech stack (locked unless Mike changes it)

### 3.1 Framework

- **Next.js 16 (App Router)** in TypeScript. Static generation (ISR) for catalogue and guide pages.
- **Tailwind CSS** for styling. No design-system library at this stage — bespoke components.
- **pnpm** as the package manager.

### 3.2 Backend / CMS

- **Payload CMS 3** installed directly into the same Next.js app (in `/app`, sharing the build).
- Payload owns: collections, auth for the admin UI, REST + GraphQL endpoints, media handling.
- Mike logs in at `/admin` to add/edit species, builds, and guides.

### 3.3 Database

- **PostgreSQL 15** during local dev (Docker) and in production (Docker container on the Hetzner VPS — see §4).
- Use Payload's Postgres adapter. Drizzle is the underlying ORM Payload uses; we don't write Drizzle directly unless we need a custom query.

> If we hit edge cases that prefer SQLite + Turso, we can switch — but Postgres aligns with the existing Garden Solutions box and is the safer default.

### 3.4 Image storage + delivery

- **Storage:** local filesystem volume during dev. On the VPS, mount a Docker volume `finandstem_media`. Optional later: Cloudflare R2 with the `@payloadcms/plugin-cloud-storage-r2` adapter.
- **Optimization:** Next.js `<Image>` with Sharp on the server. Cloudflare in front of the domain for caching + image transforms when traffic grows.

### 3.5 Search

- **Pagefind** — static, builds an index at build time. Free, no external service, perfect for a content-heavy catalogue.

### 3.6 Analytics

- **Cloudflare Web Analytics** (free, privacy-respecting) once the domain is on Cloudflare.

### 3.7 Email / newsletter

- **Buttondown** (free up to 100 subs) or **Beehiiv** (free to ~2.5K). Add an embedded signup form post-launch.

---

## 4. Deployment plan (Hetzner — sharing the Garden Solutions box)

Mike already runs **Garden Solutions** on a Hetzner CX22 VPS:
- Ubuntu 24.04, Docker + Docker Compose
- Caddy as reverse proxy container (auto Let's Encrypt SSL)
- Postgres + FastAPI + Next.js stack
- Domain: `gsoperations.co.za`

Fin & Stem will piggyback on the same box. The chosen pattern:

### 4.1 Shared-Caddy, separate-Compose architecture

1. **Promote Caddy to its own `~/infra/docker-compose.yml`** that runs only the Caddy container and owns ports 80/443.
2. **Create a Docker network `web-proxy`** as external. Caddy joins it.
3. **Garden Solutions' `web` and `api` services** add `networks: [web-proxy]` and declare it external.
4. **Fin & Stem lives in its own repo and its own `docker-compose.yml`**, joins the same `web-proxy` network. Service names `finandstem-web`, `finandstem-db` (won't collide with `web`/`api`).
5. **The Caddyfile** gets a second block routing `finandstem.com` (and `www`) → `finandstem-web:3000`. Caddy auto-provisions a Let's Encrypt cert on first request.
6. **DNS:** add an A record for `finandstem.com` and `www.finandstem.com` pointing at the same Hetzner IP.

### 4.2 Caddyfile (target state)

```caddy
gsoperations.co.za {
    handle /api/* { reverse_proxy api:8000 }
    handle /health { reverse_proxy api:8000 }
    handle /uploads/* { reverse_proxy api:8000 }
    handle /static/* { reverse_proxy api:8000 }
    handle { reverse_proxy web:3000 }
}

finandstem.com, www.finandstem.com {
    handle { reverse_proxy finandstem-web:3000 }
}
```

### 4.3 Fin & Stem `docker-compose.yml` (target state, abridged)

```yaml
services:
  finandstem-db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: finandstem
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - finandstem_pgdata:/var/lib/postgresql/data
    networks: [internal]

  finandstem-web:
    build: .
    restart: always
    env_file: .env
    depends_on:
      - finandstem-db
    networks: [internal, web-proxy]
    volumes:
      - finandstem_media:/app/media

volumes:
  finandstem_pgdata:
  finandstem_media:

networks:
  internal:
  web-proxy:
    external: true
```

### 4.4 Resource check

Garden Solutions idles at ~600 MB–1 GB. Fin & Stem will add ~500–700 MB (Next.js + Payload + Postgres). Total ~1.2–1.7 GB on a 4 GB CX22 — comfortable. Add a 2 GB swapfile if not already present, because builds spike. Next step up if needed: CX32 (4 vCPU / 8 GB) at ~€6/mo, same Hetzner line.

### 4.5 Pre-deploy security note (do before adding Fin & Stem)

Garden Solutions' `docker-compose.prod.yml` exposes Postgres port 5432 to the host. The live deployment uses `docker-compose.live.yml` which does not — but confirm with `docker compose ls` on the server that the *live* file is the one actually running before stacking Fin & Stem on top.

---

## 5. Data schema (Payload collections)

The seed data (`aquascaping-catalogue-seed.xlsx`) was authored with this schema in mind. Numeric ranges are stored in the spreadsheet as `"22–28"` strings for readability — split them into two numeric fields at import time so we can build range-overlap filters.

### 5.1 Common base fields (every catalogue collection)

| Field | Type | Notes |
|---|---|---|
| `id` | text | Spreadsheet ID (`fish-001`, `plant-001`, etc.). Stable, used as Payload's external reference. |
| `slug` | text | URL slug (`neon-tetra`). Unique, indexed. |
| `commonName` | text | Display name. |
| `scientificName` | text | Italicised in the UI. |
| `family` | text | Taxonomic family. Plants/fish only. |
| `origin` | text | Native range. |
| `image` | upload (relation to `Media`) | Lead image. |
| `gallery` | uploads[] (relations to `Media`) | Additional images. |
| `careSummary` | richText | The voice/personality field. Always Mike-written, never paraphrased from competitors. |
| `sources` | array<{label, url}> | Provenance for fact-checking. |
| `difficulty` | number (1–5) | Beginner → Expert. |
| `compatibleWith` | relationship[] | Polymorphic to other species — the cross-reference engine. |
| `tags` | text[] | Free-form for now (`low-tech`, `nano`, `biotope-south-america`, etc.). |
| `createdAt` / `updatedAt` | timestamps | Payload default. |

### 5.2 Fish-specific fields

| Field | Type | Spreadsheet column |
|---|---|---|
| `adultSizeMinCm` / `adultSizeMaxCm` | number | "Adult Size (cm)" |
| `minTankL` | number | "Min Tank Size (L)" |
| `waterColumn` | select: top / mid / bottom / all | "Water Column" |
| `temperament` | select: peaceful / semi-aggressive / aggressive / territorial-when-breeding | "Temperament" |
| `schooling` | boolean | "Schooling" |
| `minGroupSize` | number | "Min Group Size" |
| `diet` | select + notes | "Diet" + "Feeding Notes" |
| `tempMinC` / `tempMaxC` | number | "Temp (°C)" |
| `phMin` / `phMax` | number | "pH" |
| `dghMin` / `dghMax` | number | "dGH" |
| `lifespanMinYears` / `lifespanMaxYears` | number | "Lifespan (yrs)" |
| `plantSafe` | boolean + notes | "Plant Safe" |
| `shrimpSafe` | select: yes / adults-only / no + notes | "Shrimp Safe" |
| `breedingDifficulty` | select: easy / medium / hard / very-hard | "Breeding Difficulty" |

### 5.3 Plant-specific fields

| Field | Type | Spreadsheet column |
|---|---|---|
| `plantType` | select: stem / rosette / rhizome / carpet / floating / moss / epiphyte | "Plant Type" |
| `position` | select: foreground / midground / background / floating | "Position" |
| `maxHeightCm` | number | "Max Height (cm)" |
| `light` | select: low / medium / high | "Light" |
| `co2` | select: none / optional / recommended / required | "CO2" |
| `growthRate` | select: slow / medium / fast / very-fast | "Growth Rate" |
| `tempMinC` / `tempMaxC` / `phMin` / `phMax` / `dghMin` / `dghMax` | numbers | Range fields. |
| `substrate` | text | "Substrate" |
| `propagation` | text | "Propagation" |

### 5.4 Shrimp-specific fields

| Field | Type | Spreadsheet column |
|---|---|---|
| `adultSizeMinCm` / `adultSizeMaxCm` | number | "Adult Size (cm)" |
| `minTankL` | number | "Min Tank Size (L)" |
| `colonyMin` | number | "Colony Min" |
| `tdsMin` / `tdsMax` | number | "TDS (ppm)" |
| `algaeEaterRating` | number (1–5) | "Algae Eater Rating" |
| `tempMinC` / `tempMaxC` / `phMin` / `phMax` / `dghMin` / `dghMax` / `lifespanMinYears` / `lifespanMaxYears` | numbers | |
| `breedingDifficulty` | select | |
| `compatibleFish` | relationship[] (to Fish) | |

### 5.5 Moss-specific fields

| Field | Type | Spreadsheet column |
|---|---|---|
| `attachment` | text | "Attachment" |
| `typicalUse` | text | "Typical Use" |
| `light` / `co2` / `growthRate` | selects (same as plants) | |
| `tempMinC` / `tempMaxC` / `phMin` / `phMax` | numbers | |
| `trimming` | text | "Trimming" |

### 5.6 Future collections (stubs only for now)

- **Hardscape** — fields: type (stone / wood / substrate / botanical), composition, phEffect, khEffect, sizeRangeCm, buoyancy, tanninLevel, scapingNotes.
- **Equipment** — fields: category (lighting / filtration / co2 / heating / pump / misc), brand, model, specsJson, parRating, gphRating, priceUSD, priceZAR, brandUrl.
- **Build** — fields: tankSizeL, dimensions, techLevel, style, plantsUsed (rel), fishUsed (rel), hardscapeUsed (rel), equipmentUsed (rel), photos[], timeline (array of {date, title, photos, notes}).
- **Guide** — long-form how-tos with richText body, relatedSpecies (rel), heroImage.
- **Media** — Payload upload type, extended with `licenseShortName`, `licenseUrl`, `attributionHtml`, `sourceFileUrl`, `commonsFileTitle`. **Every render of a Media item must show attribution if `attributionRequired` is true.**

---

## 6. Repository layout (target)

```
finandstem/
  app/
    (admin)/                 ← Payload admin UI (auto-generated)
    api/                     ← Payload API routes (auto-generated)
    (site)/                  ← Public site routes
      page.tsx               ← Homepage
      plants/page.tsx
      plants/[slug]/page.tsx
      fish/page.tsx
      fish/[slug]/page.tsx
      shrimp/...
      mosses/...
      builds/...
      guides/...
      compatibility/page.tsx ← Killer feature: cross-reference UI
    layout.tsx
    globals.css
  payload.config.ts          ← Collection definitions
  collections/
    Plants.ts
    Fish.ts
    Shrimp.ts
    Mosses.ts
    Hardscape.ts
    Equipment.ts
    Builds.ts
    Guides.ts
    Media.ts
  scripts/
    import-from-xlsx.ts      ← Reads aquascaping-catalogue-seed.xlsx → Payload
    scrape-commons-images.ts ← Port of scrape_images.py into the repo
    seo-jsonld.ts            ← Helpers for schema.org markup
  lib/
    payload.ts               ← Payload client
    seo.ts                   ← Title/description/OG generators
    range.ts                 ← Parse "22–28" → {min: 22, max: 28}
    compatibility.ts         ← Filter logic
  components/
    SpeciesCard.tsx
    SpeciesProfile.tsx
    CompatibilityBadge.tsx
    Attribution.tsx          ← MUST render on every image with attributionRequired
    RangeBar.tsx
  public/
  Dockerfile
  docker-compose.yml         ← For VPS deploy (§4.3)
  docker-compose.dev.yml     ← For local dev (just Postgres in Docker)
  .env.example
  pnpm-lock.yaml
  package.json
  next.config.mjs
  tsconfig.json
  CLAUDE.md                  ← This file (copy)
```

---

## 7. Local dev workflow

Once scaffolded, daily dev looks like:

```bash
# Boot Postgres
docker compose -f docker-compose.dev.yml up -d

# Install + dev
pnpm install
pnpm dev

# Site: http://localhost:3000
# Admin: http://localhost:3000/admin
```

Required env vars (`.env.local`):

```
DATABASE_URI=postgres://admin:password@localhost:5433/finandstem
PAYLOAD_SECRET=GENERATE_A_LONG_RANDOM_STRING
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Initial data import (run after first migration):

```bash
pnpm tsx scripts/import-from-xlsx.ts ../aquascaping-catalogue-seed.xlsx
pnpm tsx scripts/scrape-commons-images.ts
```

---

## 8. Content rollout plan

**Phase 1 (local dev, weeks 1–3): Build the engine.**
- Scaffold Next.js + Payload + Postgres.
- Import the 40 seed species. Verify list + detail pages render.
- Build the Compatibility filter UI.
- Image scraper writes into Payload Media with attribution.
- Author Mike's first 3 build guides from his existing tanks.

**Phase 2 (deploy, week 4): Get it live.**
- Register `finandstem.com` (Cloudflare) and `finandstem.co.za` (Truehost).
- Promote Caddy to `~/infra` on the Hetzner box; add `web-proxy` network.
- Deploy Fin & Stem container alongside Garden Solutions.
- Submit sitemap to Google Search Console + Bing Webmaster Tools.
- Newsletter signup live (Buttondown).

**Phase 3 (post-launch, months 2–3): Grow the catalogue + distribute.**
- Expand catalogue to 30+ species per category.
- 1 build guide per week.
- Post each guide to r/Aquascape, r/PlantedTank, UKAPS, ScapeCrunch.
- Apply for Amazon Associates (SA + US), 2HR Aquarist / Aquasabi affiliate, Bulk Reef Supply, Bantam.

**Phase 4 (months 4–12): Monetize.**
- Ezoic ads once at 3K+ monthly visits.
- Mediavine Journey at 10K monthly sessions.
- Raptive at 25K monthly pageviews.

---

## 9. Legal must-do — image attribution

Every image scraped from Wikimedia Commons carries a license. The `scrape_images.py` script (and its TS port) MUST store:

- `url` — original Commons URL
- `license` — e.g. `CC BY-SA 4.0`
- `licenseUrl`
- `author`
- `credit`
- `attributionRequired` (boolean)
- `descriptionUrl` — Commons file page

On every page that renders the image, render a small attribution block:
> "Image: [Author] · [License] · [Source]"

For CC-BY-SA, if the image is modified (cropped, recoloured), the modified version must also be CC-BY-SA. Note this in the Media collection if a modified version is uploaded.

**Never use iNaturalist's default (CC BY-NC) images** — that license prohibits commercial use, which would break the moment ads or affiliates are added. Only use iNat images explicitly licensed CC BY or CC0.

---

## 10. Reference links

**Stack docs (use these when implementing):**
- Payload 3 + Next.js: https://payloadcms.com/posts/blog/payload-30-the-first-cms-that-installs-directly-into-any-nextjs-app
- Payload self-host guide (Next.js 16): https://www.buildwithmatija.com/blog/deploy-payload-cms-nextjs-16-self-hosted
- Next.js 16 Adapter API: https://nextjs.org/blog/nextjs-across-platforms
- Pagefind: https://pagefind.app/
- Hetzner + Coolify reference (if we ever migrate): https://blixamo.com/blog/deploy-nextjs-coolify-hetzner

**Data sources:**
- FishBase API (rOpenSci): https://fishbase.ropensci.org/fishbase
- GBIF Species API: https://techdocs.gbif.org/en/openapi/v1/species
- Wikimedia Commons reuse rules: https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia
- iNaturalist licensing rules: https://help.inaturalist.org/en/support/solutions/articles/151000169918-can-i-use-the-photos-and-sounds-that-are-posted-on-inaturalist-

**Hosting + image CDN reference:**
- Cloudflare R2 pricing: https://developers.cloudflare.com/r2/pricing/
- Cloudflare Pages free tier (commercial-use OK): https://developers.cloudflare.com/pages/

**Companion files in this folder:**
- `aquascaping-site-launch-plan.md` — full research, competitors, SEO, monetization deep-dive.
- `aquascaping-catalogue-seed.xlsx` — 40 species × full attribute matrix.
- `build_catalogue.py` — script that generated the seed (in case columns need to change).
- `scrape_images.py` — Wikimedia Commons image fetcher with attribution metadata.

---

## 11. Pickup checklist — what to do when you return

Use this as the literal Day-1 to-do list when re-opening the project:

- [ ] Re-read this file end to end.
- [ ] Register `finandstem.com` via Cloudflare Registrar (~$11.25/yr).
- [ ] Register `finandstem.co.za` via Truehost or HostAfrica (~R49–R89/yr).
- [ ] In a new GitHub repo `finandstem`, scaffold: `pnpm create next-app@latest finandstem --typescript --app --tailwind --eslint --import-alias "@/*"`.
- [ ] Install Payload 3: follow the [official Payload + Next.js install](https://payloadcms.com/docs/getting-started/installation).
- [ ] Add Postgres dev container (`docker-compose.dev.yml`).
- [ ] Create Payload collections per §5 (start with Plant, Fish, Shrimp, Moss, Media).
- [ ] Write `scripts/import-from-xlsx.ts` — port logic from the spreadsheet structure into Payload create calls. Split range strings into `min` / `max` numbers via `lib/range.ts`.
- [ ] Run the import; verify 40 records load with proper relationships.
- [ ] Port `scrape_images.py` to TypeScript (`scripts/scrape-commons-images.ts`) and have it write to Payload `Media`.
- [ ] Build catalogue list + detail pages with ISR. Tailwind for styling. JSON-LD schema.org markup.
- [ ] Build the Compatibility cross-reference page (`/compatibility?fish=…&plant=…`).
- [ ] Add Pagefind, sitemap, robots.txt, Open Graph images via `opengraph-image.tsx`.
- [ ] Author 3 build guides from Mike's existing tanks. These are the moat.
- [ ] Add Buttondown newsletter signup to the homepage footer.
- [ ] When ready to deploy: see §4. Promote Caddy → infra repo, add `web-proxy` network, deploy Fin & Stem container, point DNS, done.

---

## 12. Open questions to revisit before deploy

- Should the catalogue have user accounts (favourites / "my tank" lists) at launch, or is that v2?
- Do we want a "submit a build" community feature, or stay editorial-only until traffic justifies moderation?
- Affiliate disclosure copy: where lives it? Footer or dedicated page? (FTC requires it before any affiliate link goes live.)
- Image fallback strategy if Wikimedia doesn't have a usable image — request from r/Aquascape with a CC-BY-SA grant? Pay for stock?
- Do we run a Mailchimp/Buttondown signup form even pre-launch as a coming-soon page during the 2–3 week local-dev gap?

---

*Updated: May 12, 2026. Maintained by Mike. If Claude Code is reading this, your job is to be helpful, not impressive — ship working catalogue pages before any feature gold-plating.*
