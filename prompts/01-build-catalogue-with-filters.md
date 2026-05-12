# Claude Code Prompt: Build the Fin & Stem catalogue with category filters

> Copy everything below the divider into Claude Code at the root of the `finandstem/` repo. Open it as the first task of the session.

---

You are picking up the Fin & Stem project. Before writing any code, read these files in order:

1. `CLAUDE.md` at the repo root — full project brief, locked tech stack, data schema, deployment plan.
2. `aquascaping-site-launch-plan.md` — research context (only skim — it's reference, not blocking).
3. `aquascaping-catalogue-seed.xlsx` — open the sheets to understand the data shape (Fish, Plants, Shrimp, Mosses, Image Sources).
4. `scrape_images.py` — the Python prototype of the Wikimedia Commons scraper that you'll port to TypeScript.

If any decision in this prompt conflicts with `CLAUDE.md`, prefer `CLAUDE.md`. If both conflict with what the user says in chat, the user wins.

**Operating rules for this build:**
- Use Plan Mode first to lay out the multi-file work, then execute.
- Make small, verifiable steps. Don't gold-plate. Don't introduce libraries that aren't already in §3 of `CLAUDE.md`.
- After each section is done, run the dev server and confirm the listed acceptance criteria render correctly before moving on.
- If you find the schema doesn't match the spreadsheet, ask before changing the schema.

---

## Goal of this session

Stand up the local-dev version of Fin & Stem with:
1. Next.js 16 (App Router, TypeScript, Tailwind) scaffold, pnpm.
2. Payload CMS 3 installed into the same app, Postgres backend (via `docker-compose.dev.yml`).
3. Five collections live: `Plants`, `Fish`, `Shrimp`, `Mosses`, `Media` (full schemas in `CLAUDE.md` §5).
4. An XLSX → Payload import script that loads the 40 seed records.
5. A TypeScript port of the Wikimedia Commons image scraper that writes into the Payload `Media` collection with full attribution metadata.
6. **Catalogue list pages with per-category filter UIs** (see "Filter spec" below).
7. Detail pages for each catalogue entry with proper image attribution rendering.
8. A **cross-category compatibility page** that lets a user pick a fish and see plants/shrimp/mosses that overlap on water parameters and safety flags.

Everything must work locally with `pnpm dev` against a Postgres dev container — no production deploy this session.

---

## Stack reminders (locked — see `CLAUDE.md` §3)

- Next.js 16 App Router, TypeScript, Tailwind CSS, pnpm.
- Payload CMS 3 in the same app (`payload.config.ts` at the root).
- Postgres 15 via Payload's Postgres adapter.
- Pagefind for search (later — not blocking this session).
- No Algolia. No Sanity. No Drizzle hand-written queries unless asked.

---

## Filter spec — per category

The filter UIs are the catalogue's headline feature. Every list page (`/plants`, `/fish`, `/shrimp`, `/mosses`) gets a left-side filter rail (collapsing to a top sheet on mobile). Filter state lives in the URL via `searchParams` so it's bookmarkable and shareable. When any filter changes, reset pagination to page 1.

**Implementation pattern (all categories):**
- `app/(site)/<category>/page.tsx` is a server component. It receives `searchParams` and queries Payload directly via the Local API (`payload.find({ collection, where })`).
- Build the `where` clause from `searchParams` using a helper in `lib/filters.ts` (one builder per collection).
- The filter UI is a client component (`components/filters/<Category>Filters.tsx`) that reads current URL state and pushes updates via `router.replace` with `scroll: false` to keep position.
- Range-overlap filtering pattern: a record matches when its `*Min` is `less_than_equal` to the user's max AND its `*Max` is `greater_than_equal` to the user's min. Wrap this in `lib/filters.ts` as `overlapWhere(field, [userMin, userMax])`.
- Always wrap any `useSearchParams` use in a `<Suspense>` boundary.

### Fish filters (`/fish`)

| Filter | Type | URL key | Notes |
|---|---|---|---|
| Min tank size | number input (L) | `tankL` | Show fish whose `minTankL <= userTankL`. |
| Water column | multi-select chips: Top / Mid / Bottom | `column` | OR within filter, comma-separated. |
| Temperament | multi-select: Peaceful / Semi-aggressive / Aggressive / Territorial when breeding | `temperament` | |
| Schooling only | toggle | `schooling` | `1` to require schooling=true. |
| Min group size ≤ | number input | `groupMax` | Helpful when small-tank planning. |
| Diet | multi-select: Omnivore / Micropredator / Herbivore / Filter feeder | `diet` | |
| Temp range (°C) | dual-handle slider 15–32 | `temp` | `temp=22-28`. Use range-overlap. |
| pH range | dual-handle slider 4.0–8.5 | `ph` | Range-overlap. |
| dGH range | dual-handle slider 0–25 | `dgh` | Range-overlap. |
| Difficulty | multi-select chips 1–5 | `difficulty` | |
| Plant-safe | toggle | `plantSafe` | |
| Shrimp-safe | tri-select: Any / Yes / Adults only | `shrimpSafe` | |
| Lifespan ≥ | number input (years) | `lifespan` | Filters on `lifespanMaxYears >= n`. |

### Plant filters (`/plants`)

| Filter | Type | URL key | Notes |
|---|---|---|---|
| Position | multi-select: Foreground / Midground / Background / Floating | `position` | |
| Plant type | multi-select: Stem / Rosette / Rhizome / Carpet / Floating / Epiphyte | `type` | "Moss" lives on its own page. |
| Light | multi-select: Low / Medium / High | `light` | A plant with "Low to Medium" matches when either is selected — store as `lightMin`/`lightMax` ordinal at import. |
| CO₂ | multi-select: None / Optional / Recommended / Required | `co2` | Same multi-match pattern as light. |
| Growth rate | multi-select: Slow / Medium / Fast / Very fast | `growth` | |
| Max height ≤ | number input (cm) | `heightMax` | Useful for nano tanks. |
| Temp range | dual-handle slider | `temp` | Range-overlap. |
| pH range | dual-handle slider | `ph` | Range-overlap. |
| dGH range | dual-handle slider | `dgh` | Range-overlap. |
| Difficulty | multi-select 1–5 | `difficulty` | |

### Shrimp filters (`/shrimp`)

| Filter | Type | URL key | Notes |
|---|---|---|---|
| Lineage | multi-select: Neocaridina / Caridina / Other | `lineage` | Derived field — set during import based on scientific name prefix. |
| Min tank size | number input (L) | `tankL` | |
| Difficulty | multi-select 1–5 | `difficulty` | |
| Algae eater rating ≥ | slider 1–5 | `algae` | |
| Breeding | multi-select: Very easy / Easy / Medium / Hard / Larvae need brackish | `breeding` | |
| Temp range | dual-handle slider | `temp` | Range-overlap. |
| pH range | dual-handle slider | `ph` | Range-overlap. |
| dGH range | dual-handle slider | `dgh` | Range-overlap. |
| TDS range | dual-handle slider 50–500 | `tds` | Range-overlap. |

### Moss filters (`/mosses`)

| Filter | Type | URL key | Notes |
|---|---|---|---|
| Attachment | multi-select: Wood / Stone / Mesh / Floating | `attach` | Parse from "Attachment" cell at import time. |
| Typical use | multi-select: Carpet / Wall / Tree / Bonsai / Crevice / Cave / Shrimp tank | `use` | Derived at import — comma-split. |
| Light | multi-select: Low / Medium / High | `light` | |
| CO₂ | multi-select: None / Optional / Recommended / Required | `co2` | |
| Growth rate | multi-select | `growth` | |
| Difficulty | multi-select 1–5 | `difficulty` | |
| Temp range | dual-handle slider | `temp` | Range-overlap. |
| pH range | dual-handle slider | `ph` | Range-overlap. |

### Universal filter UI behaviour

- A "Clear all" button resets to `/<category>` with no query string.
- Each filter shows the active value as a removable chip above the result grid.
- When zero results match, show: *"No matches. Try widening one of: [active filter chips]."*
- Show the active filter count on the mobile filter toggle button.
- Persist the filter rail's "open/closed" state to `localStorage`, not the URL.

---

## Cross-category compatibility page (`/compatibility`)

This is the differentiator — build a v1 that works for the four collections we have today.

- The user picks **one anchor entry** (a fish, plant, shrimp, or moss) from a typeahead.
- The page lists the other three categories, each showing entries whose:
  1. Temp range overlaps the anchor's temp range.
  2. pH range overlaps the anchor's pH range.
  3. dGH range overlaps the anchor's dGH range.
  4. If anchor is a fish: also require `plantSafe === true` for plants, and `shrimpSafe !== 'no'` for shrimp.
  5. If anchor is a shrimp: filter fish to those whose `shrimpSafe === 'yes'`.
- URL is `/compatibility?anchor=fish:neon-tetra` (category prefix + slug).
- Show why each match was included — small badges like *"Temp ✓"*, *"pH ✓"*, *"Plant-safe ✓"*.

---

## Data import script (`scripts/import-from-xlsx.ts`)

- Reads `../aquascaping-catalogue-seed.xlsx` (path passed via CLI arg, default `./seed/aquascaping-catalogue-seed.xlsx`).
- Use `xlsx` or `exceljs` npm package — pick one and stick to it.
- For each sheet (Fish, Plants, Shrimp, Mosses), call Payload's Local API to upsert by `id` (use the spreadsheet's `fish-001` etc. as the external `id` field).
- Helper `lib/range.ts` exports `parseRange("22–28")` → `{min: 22, max: 28}`. Handle the en-dash `–` AND the hyphen `-`. Handle single values like `"5"` → `{min: 5, max: 5}`.
- Derived fields at import:
  - `lineage` for shrimp — Neocaridina vs Caridina vs Other from scientific name prefix.
  - Comma-split `typicalUse` for mosses.
  - Comma-split `attachment` for mosses.
- Skip rows where required fields are missing; log a warning with the spreadsheet row number.
- Idempotent — running twice doesn't create duplicates.

---

## Image scraper port (`scripts/scrape-commons-images.ts`)

Port `scrape_images.py` to TypeScript. Same behaviour, with one upgrade:
- Instead of writing JSON to disk, call Payload's Local API to create a `Media` record per image with these fields:
  - `filename` (e.g. `fish-001.jpg`)
  - `url` (Wikimedia Commons direct URL)
  - `commonsFileTitle` (`File:Xxx.jpg`)
  - `descriptionUrl`
  - `licenseShortName` (e.g. `CC BY-SA 4.0`)
  - `licenseUrl`
  - `author` (raw `Artist` HTML from Commons — keep the link tags)
  - `credit`
  - `attributionRequired` (boolean)
- Download the file into Payload's media folder so `next/image` can serve it locally.
- Set `User-Agent: FinAndStem/0.1 (contact: mikee@dsg.co.za)` on every Wikimedia API call.
- Rate-limit: 500 ms between calls.
- Idempotent — skip records that already have a `Media` row.

---

## Detail page must-haves (per catalogue entry)

- Lead image with attribution block beneath it: *"Image: [author] · [license] · [Source](descriptionUrl)"*. If `attributionRequired === false`, still show the credit because it's cheap good karma.
- Common name (H1), scientific name italicised (H2).
- Care summary (rich text).
- Spec table built from the schema fields — temp/pH/dGH rendered as horizontal range bars with min/max ticks (component: `<RangeBar />`).
- Compatibility section: same logic as `/compatibility` but anchored to this entry.
- JSON-LD `Article` schema in `<head>` for SEO.
- Open Graph image via `opengraph-image.tsx` route handler.

---

## Acceptance criteria for this session

Before you stop, verify all of these on `pnpm dev`:

- [ ] `pnpm dev` boots without errors. Admin UI loads at `/admin`. Public site loads at `/`.
- [ ] `pnpm tsx scripts/import-from-xlsx.ts ./seed/aquascaping-catalogue-seed.xlsx` exits with no warnings and creates 10 fish + 10 plants + 10 shrimp + 10 mosses.
- [ ] `pnpm tsx scripts/scrape-commons-images.ts` creates a `Media` record with non-null `licenseShortName` and `author` for every species, and the image file lands on disk.
- [ ] `/plants` renders 10 plant cards. Every filter listed in the spec narrows the result set correctly. Toggling a filter updates the URL. Clearing filters returns to 10 results.
- [ ] `/fish`, `/shrimp`, `/mosses` do the same.
- [ ] `/plants/anubias-nana` renders the detail page with image attribution showing real `author` and `license` text (not placeholders).
- [ ] `/compatibility?anchor=fish:neon-tetra` returns at least one plant, one shrimp, and one moss, each with reason-badges shown.
- [ ] Zero TypeScript errors. Zero unhandled promise rejections in the dev console.
- [ ] Every page has a unique `<title>` and `<meta name="description">`.

---

## What NOT to do this session

- Don't introduce Algolia, MeiliSearch, tRPC, Drizzle direct queries, React Query, Zustand, or any state library beyond URL state. Pagefind is fine but not required this session.
- Don't write a custom auth system. Payload's built-in admin auth is sufficient.
- Don't build the Hardscape, Equipment, Build, or Guide collections yet — stubs only (mention them in `payload.config.ts` as commented-out imports).
- Don't deploy. Don't touch `docker-compose.yml` for production. Only `docker-compose.dev.yml` for the local Postgres.
- Don't paraphrase competitor content for the care summaries — the seed file's `Care Summary` column is the source of truth; render it verbatim. If Mike asks for changes, change the spreadsheet, not the database.
- Don't gold-plate the design. Tailwind defaults are fine. The catalogue's value is data + filters, not visuals — visual polish comes after structural work.

---

## When you finish

Append a short *"Session 1 — what shipped, what's open"* note to a new file `progress/session-01.md` with:
1. What works end-to-end.
2. Anything that's stubbed or skipped.
3. Any schema or behaviour decisions you had to make without asking, so Mike can review them.

Then stop and wait for Mike.
