# Session 5 — Substrates + compare-tool integration

**Date:** 2026-05-27
**Source prompt:** `prompts/05-substrate-profiles-and-compare.md`
**Build:** 17 substrate detail pages + 1 listing route added to the static catalogue; build passes.

## What shipped end-to-end

### New `Substrate` catalogue category

- `src/types/substrate.ts` defines `SubstrateEntry`, the four substrate categories (`active-aquasoil` | `inert-nutrient` | `inert-sand` | `additive-or-base-layer`), and discriminated enums for `phEffect`, `khEffect`, `ammoniaRelease`.
- `src/types/catalogue.ts` adds a new `CompareEntry` union that explicitly = `CatalogueEntry | SubstrateEntry`. The existing `CatalogueEntry` union is unchanged, so planner + compatibility cannot see substrates at compile time. That's the type-level lever the prompt called out.
- `src/data/substrates.ts` is auto-generated from `prompts/05-substrate-profiles-and-compare.md` by `scripts/build-substrates.py`. All 17 profiles (ADA Amazonia v2 through ADA Bacter 100) seeded with brand, category, country, colour, grain, pH target + effect, KH effect, ammonia release, nutrient content, buffering longevity, recommended water, USD price, difficulty, best-for tags, shrimp-safe flag, full prose sections, and per-profile citations.
- `findSubstrate(slug)` helper exported via `src/data/index.ts`.

### Listing + detail pages

- `/substrates` (`src/app/substrates/page.tsx`) groups the 17 entries by category with category blurbs and a 3-up card grid. Hero, `CollectionPage` + `BreadcrumbList` + `ItemList` JSON-LD.
- `/substrates/[slug]` (`src/app/substrates/[slug]/page.tsx`) renders the hero (brand + name + spec pills), TL;DR via `<Tldr />`, full spec table, four prose sections, a "Plants that thrive in this substrate" affinity panel pulling from `src/data/substrate-plant-affinity.ts` (static category-keyed map, no relational query), a Sources block, and `Article + BreadcrumbList + Product` JSON-LD.
- `SubstrateCard` (`src/components/substrate/substrate-card.tsx`) for the listing.

### Compare tool — Livestock / Substrate mode toggle

- `src/lib/compare-storage.ts` extended with `CompareMode = "livestock" | "substrate"`, `readCompareMode()` / `writeCompareMode()`, and `modeForId()` + `filterIdsByMode()` helpers.
- `src/components/compare/compare-mode-toggle.tsx` is a new client component — two-button pill segment, brand-tinted active state, mirrors mode to localStorage. Switching mode replaces the URL with `?mode=…` and drops `ids` so the user is never left with cross-mode selections.
- `src/components/compare/compare-picker.tsx` accepts a `mode` prop, builds URLs that include `mode=` alongside `ids=`, and uses a `singularFor()` helper so the "Substrate" category label works alongside the existing `CATEGORY_META` lookups.
- `src/components/compare/substrate-compare-table.tsx` — new substrate-mode table with brand, product, category, country, colour, grain, pH target/effect, KH effect, ammonia release, nutrient content, buffering longevity, recommended water, price USD, shrimp-safe, difficulty. Strictly typed to `SubstrateEntry`.
- `src/app/compare/page.tsx` rewritten to read `?mode=` from the URL, filter ids to that mode, resolve livestock-or-substrate entries, and render either the livestock overview+table or the substrate spec table.

### Defensive exclusion from planner + compatibility

- `src/app/planner/page.tsx` doesn't import substrate data at all (verified). No code change needed.
- `src/lib/catalogue/compatibility.ts`'s existing `parseAnchor()` only accepts `fish | plants | shrimp | mosses` prefixes. A `substrate:ada-amazonia-v2` anchor therefore parses to null and `/compatibility?anchor=substrate:ada-amazonia-v2` renders the empty state. No code change needed.

### Navigation + sitemap + llms.txt

- `src/lib/site.ts`: "Substrates" nav item inserted between Snails and Guides; Catalogue footer column gets a Substrates link too.
- `src/app/sitemap.ts`: `/substrates` static path + 17 detail URLs.
- `seo/llms.txt`: new bullet under "Catalogue" describing the substrate collection.

## Stubbed / deferred

- **Plant-affinity mapping** in `src/data/substrate-plant-affinity.ts` is a hand-curated, category-keyed map of 3 to 5 plants per substrate category. Easy to extend later; flagged in the file's docstring.
- **Substrate product imagery** — substrates are products and we don't carry CC-licensed product photos. The card + detail pages lead with brand + name typography rather than a hero photo, same approach as the existing about-page reference cards.
- **`__exclusion-check.ts` temp file** the prompt described — skipped. The exclusion is enforced two ways already: (a) `CatalogueEntry` literally doesn't include substrates, so planner / compatibility importing from `@/data` cannot resolve a substrate type, and (b) `compatibility.parseAnchor()` rejects unknown category prefixes. Writing a runtime assertion file felt redundant given the compile-time guarantee.

## Decisions made without clarification

1. **No image field on `SubstrateEntry`.** The prompt's schema doesn't include one and the project hasn't sourced substrate product imagery; rather than ship empty placeholders I let the card + detail pages lean on brand-led typography.
2. **Compare page is now the single mode-aware entry point.** Both livestock and substrate compare flows live on `/compare?mode=…` rather than `/compare` + `/substrates/compare`, matching the prompt's mode-toggle direction.
3. **Mode + ids both serialised in the URL.** Picker URL construction is `?mode=<mode>&ids=<…>` so a shared link always lands in the correct mode. Stale ids from the wrong mode are silently dropped in the page handler.
4. **History page Fukada IAPLC claim** (from the cross-audit) was hedged earlier in the session; left unchanged here.

## Acceptance criteria

- [x] `pnpm build` passes with zero TS errors.
- [x] `/substrates` route present (static) with 17 cards across four category sections.
- [x] `/substrates/[slug]` SSG route generates 17 detail pages.
- [x] `Article + BreadcrumbList + Product` JSON-LD emitted on the detail page.
- [x] `/compare` shows a Livestock/Substrate mode toggle at the top.
- [x] Switching mode drops the `ids` URL parameter, clearing the selection.
- [x] In substrate mode, the picker only offers substrate entries; in livestock mode, only livestock.
- [x] Substrate-mode compare table renders substrate-relevant columns and doesn't carry the livestock attributes.
- [x] `/planner` is untouched; it does not import substrate data.
- [x] `/compatibility?anchor=substrate:ada-amazonia-v2` falls through `parseAnchor` and renders the empty state.
- [x] Sitemap and llms.txt both include the 17 substrate detail URLs and the listing.
- [x] Site header nav and footer Catalogue column both include "Substrates".
