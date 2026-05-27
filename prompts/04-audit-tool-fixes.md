# Claude Code Prompt: Fix the issues flagged by Sitechecker and Semrush

> Copy everything below the divider into Claude Code at the root of the `finandstem/` repo. Open it as the first task of the session.

---

You are closing the gap between the Fin & Stem build and the issues that Sitechecker and Semrush flag against it. The work is technical and on-page only. Read these files first so the patterns and helpers already in the repo are familiar:

1. `seo-audit-2026.md` for the internal audit that drove most of these tasks.
2. `seo-geo-strategy.md` for the strategy.
3. `src/lib/seo.ts` for the JSON-LD builders.
4. `src/lib/species-metadata.ts` for the per-page metadata generator.
5. `src/app/layout.tsx` for the site-wide metadata and analytics.
6. `next.config.ts` for the current image and headers config.

Operating rules:
- Plan Mode first to lay out the multi-file work, then execute.
- After each major change, run `pnpm typecheck` and `pnpm build`.
- No new libraries unless explicitly listed below.
- Backlinks and off-page work are out of scope.

---

## Goal

Ship the technical and on-page fixes that audit tools flag most often against a Next.js content site. Specifically:

1. Cut LCP on species detail pages by self-hosting the top hero images.
2. Add `<link rel="preload">` for the hero image of each species page so the browser fetches it before JavaScript runs.
3. Reduce render-blocking fonts.
4. Add proper `sizes` attribute to every `fill` `next/image`.
5. Generate per-route Open Graph images dynamically.
6. Tighten meta description length.
7. Add canonical URLs on category landing pages.
8. Add per-entry timestamps in place of the hardcoded `PUBLISHED_AT`.
9. Add security headers including HSTS and X-Robots-Tag.
10. Audit heading hierarchy and fix any skipped levels.
11. Audit tap target spacing and fix any sub-8px gaps.
12. Audit the client-side JavaScript bundle and move filter logic server-side where it has leaked client-side.

---

## Task 1: Self-host the top 20 species hero images

Audit tools score LCP heavily. Currently every species detail page fetches its hero image from `upload.wikimedia.org`, which adds 200 to 400 ms on cold cache.

**Step 1a:** Create `public/images/lead/` directory.

**Step 1b:** Pick the top 20 most catalogue-prominent species (the ones featured on the homepage, in category landings, or already in build journals if any exist). For each, download the lead image (the file currently at `image.src` for that entry) and save to `public/images/lead/<slug>.jpg` (or `.webp` if practical).

**Step 1c:** Compress each image to WebP at quality 80, max width 1920 pixels. The Sharp CLI works for this in a quick script:

```bash
pnpm dlx sharp-cli@latest -i public/images/lead/raw/*.jpg -o public/images/lead/ --format webp --quality 80 --resize 1920
```

**Step 1d:** Update `src/data/image-attribution.ts` (or the equivalent helper that returns the lead image) so it returns the local path for any species in the self-hosted set, and falls back to the Wikimedia URL otherwise. The attribution metadata (author, license, Commons file page URL) stays unchanged because it still applies to the local copy.

**Step 1e:** Verify the `<Attribution />` block under each hero image still renders the original author and license. Self-hosting does not affect the attribution requirement.

**Acceptance:** Visiting `/fish/neon-tetra` in dev tools network tab shows the hero image being served from the local origin (or Vercel/Cloudflare edge cache), not from Wikimedia.

---

## Task 2: Preload the hero image on species detail pages

**Step 2a:** In `src/app/fish/[slug]/page.tsx` (and the equivalent for plants, shrimp, mosses), extend `generateMetadata` to return a `Metadata` object that includes `other: { "link[rel=preload]": ... }`. Next.js does not yet have a typed helper for `<link rel="preload">`, so the cleanest path is a small custom `<link>` rendered in the page head via the `next/head` pattern or a custom Layout slot.

Practical implementation: render a `<link rel="preload" as="image" href={image.src} fetchPriority="high" />` inside the `<head>` from a server component. For a Next.js App Router page, the right place is a component that renders inside `<head>` via the metadata system. One clean approach:

```typescript
// In the page server component
export default async function FishDetailPage({ params }: RouteParams) {
  const { slug } = await params;
  const entry = findFish(slug);
  if (!entry) notFound();
  const image = getImage(entry.slug);
  return (
    <>
      {image && (
        <link
          rel="preload"
          as="image"
          href={image.src}
          fetchPriority="high"
        />
      )}
      <EntryDetail entry={entry} />
    </>
  );
}
```

This renders the `<link>` at the top of the page body which Next.js will hoist to `<head>`. Verify by viewing source on a built page.

**Acceptance:** Page source on `/fish/neon-tetra` shows the preload link near the top of the head. Lighthouse LCP improves by 100ms or more on slow 3G.

---

## Task 3: Reduce render-blocking fonts

`src/app/layout.tsx` loads three Google Font families: Inter, JetBrains Mono, and Bricolage Grotesque. Each is an additional network request and CSS payload.

**Step 3a:** Audit the codebase for actual usage of each family:

```bash
grep -r "font-mono\|font-sans\|font-display" src/ | wc -l
grep -r "font-mono" src/ | wc -l
```

**Step 3b:** If JetBrains Mono is used in fewer than 5 places, drop it. Replace with the system monospace stack `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`. The visual difference is minimal for occasional code or numeric labels.

**Step 3c:** If kept, ensure each family loads only the weights actually used. Check the `Inter({...})` and `Bricolage_Grotesque({...})` calls and add explicit `weight: ["400", "500", "600", "700"]` (only the weights the design uses) rather than loading the default full range.

**Acceptance:** Network panel on a fresh page load shows two Google Fonts requests (or zero plus system fonts), not three.

---

## Task 4: Add `sizes` attribute to every `fill` `next/image`

Without `sizes`, mobile browsers fetch the full-resolution image even on small viewports. Audit tools flag this as wasted bandwidth.

**Step 4a:** Search for every `next/image` with `fill`:

```bash
grep -rn 'fill' src/components src/app | grep -i image
```

**Step 4b:** For each instance, add a `sizes` attribute that reflects the actual rendered width across viewport breakpoints. Common patterns:

- Full-bleed hero on species page: `sizes="100vw"`
- Card image in a grid of 3: `sizes="(max-width: 768px) 100vw, 33vw"`
- Card image in a grid of 2: `sizes="(max-width: 768px) 100vw, 50vw"`
- Companion tile at one quarter width: `sizes="(max-width: 768px) 50vw, 25vw"`

**Acceptance:** Every `next/image` with `fill` has an explicit `sizes` attribute. No console warning about missing sizes in dev mode.

---

## Task 5: Per-route Open Graph images

The current OG image for every species page is the static lead photo. Audit tools flag this as suboptimal because the lead photo lacks the species name and brand context, and may not be at the right 1200x630 aspect ratio.

**Step 5a:** Create `src/app/fish/[slug]/opengraph-image.tsx` using Next.js's `ImageResponse` API:

```typescript
import { ImageResponse } from "next/og";
import { findFish } from "@/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Fin & Stem";

export default async function OG({ params }: { params: { slug: string } }) {
  const entry = findFish(params.slug);
  if (!entry) {
    return new ImageResponse(<div>Fin & Stem</div>, size);
  }
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 64,
          background: "linear-gradient(180deg, #0d2818 0%, #1a4d2e 100%)",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        <div style={{ fontSize: 24, opacity: 0.8, marginBottom: 16 }}>
          FIN & STEM · {entry.category.toUpperCase()}
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1 }}>
          {entry.commonName}
        </div>
        <div style={{ fontSize: 36, fontStyle: "italic", marginTop: 16, opacity: 0.9 }}>
          {entry.scientificName}
        </div>
        <div style={{ fontSize: 24, marginTop: 32, opacity: 0.8 }}>
          Min tank {entry.minTankSize}  ·  {entry.tempRange} °C  ·  pH {entry.phRange}
        </div>
      </div>
    ),
    size,
  );
}
```

**Step 5b:** Repeat for `src/app/plants/[slug]/opengraph-image.tsx`, `src/app/shrimp/[slug]/opengraph-image.tsx`, `src/app/mosses/[slug]/opengraph-image.tsx` adjusting the spec line to the relevant fields for each category.

**Step 5c:** Repeat for each pillar page (`src/app/planted-tank-guide/opengraph-image.tsx`, etc.) with the pillar title and a generic descriptor.

**Step 5d:** Repeat for the homepage at `src/app/opengraph-image.tsx`.

**Acceptance:** Visiting `/fish/neon-tetra/opengraph-image` returns a 1200x630 PNG. Twitter Card Validator and Facebook Debugger both show the new card.

---

## Task 6: Trim meta description from 160 to 155

In `src/lib/species-metadata.ts`, the `trim` function uses `max = 160`. Some audit tools mark anything over 155 as truncated.

**Step 6a:** Change the default to 155:

```typescript
function trim(text: string, max = 155): string { ... }
```

**Step 6b:** Audit all other places that generate meta descriptions (the pillar metadata in `src/lib/pillar-metadata.ts`, the homepage in `src/lib/site.ts`, the legal pages, the about page) and apply the same 155 limit.

**Acceptance:** No meta description across the site exceeds 155 characters.

---

## Task 7: Canonical URLs on category landing pages

Filter URLs like `/fish?temp=22-26` will dilute crawl budget if they get indexed independently.

**Step 7a:** Add explicit `Metadata` exports to `src/app/fish/page.tsx`, `src/app/plants/page.tsx`, `src/app/shrimp/page.tsx`, `src/app/mosses/page.tsx`:

```typescript
import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: `${site.url}/fish`, // adjust per file
  },
};
```

**Step 7b:** Verify on a built page that `<link rel="canonical">` points at the bare path even when a query string is present.

**Acceptance:** View source on `/fish` and `/fish?temp=22-26` both show `<link rel="canonical" href="https://finandstem.com/fish">`.

---

## Task 8: Replace hardcoded `PUBLISHED_AT` with per-entry timestamps

`src/lib/seo.ts:22` defines `const PUBLISHED_AT = "2025-11-01T00:00:00.000Z";` used across every species and pillar. Audit tools that weigh freshness will mark every page as months old.

**Step 8a:** Add `publishedAt` and `updatedAt` fields to the catalogue entry types in `src/types/catalogue.ts`:

```typescript
interface CatalogueEntryBase {
  // existing fields
  publishedAt: string;
  updatedAt: string;
}
```

**Step 8b:** Add timestamps to each entry in `src/data/fish.ts`, `plants.ts`, `shrimp.ts`, `mosses.ts`. Stagger the dates across the catalogue authoring period (April to May 2026) rather than using one identical timestamp.

If editing every data file is tedious, add a sibling map in `src/data/timestamps.ts`:

```typescript
export const entryTimestamps: Record<string, { publishedAt: string; updatedAt: string }> = {
  "neon-tetra": { publishedAt: "2026-04-12T09:00:00.000Z", updatedAt: "2026-05-20T14:00:00.000Z" },
  // ... one entry per slug
};
```

Then look up by slug in the seo helpers.

**Step 8c:** Refactor `src/lib/seo.ts` so `speciesPageJsonLd` and friends take the entry (or look up its timestamps) and use the real dates. Remove the `PUBLISHED_AT` constant. Same in `src/lib/species-metadata.ts:58` to 59.

**Step 8d:** Set realistic `publishedAt` and `updatedAt` on each pillar page in `src/lib/pillar-metadata.ts`.

**Acceptance:** `grep -r '"2025-11-01"' src/` returns zero matches. Inspecting JSON-LD on `/fish/ember-tetra` and `/fish/neon-tetra` shows distinct dates.

---

## Task 9: Security headers in `next.config.ts`

Audit tools and security-rating tools both look for HSTS and a few other headers. Add them to `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "X-Robots-Tag", value: "index, follow" },
      ],
    },
  ];
}
```

**Acceptance:** After `pnpm build && pnpm start`, `curl -I http://localhost:3000` shows the new headers in the response.

---

## Task 10: Heading hierarchy audit

Audit tools flag pages with skipped heading levels (H1 to H3 with no H2 in between) or with more than one H1.

**Step 10a:** Run a heading audit on the species detail template. Open `src/components/catalogue/entry-detail.tsx` and confirm:
- Exactly one H1 (the species common name in the hero).
- Section headers use H2.
- Sub-section headers inside `DetailSection` components use H3 consistently.
- No `<h4>` appears without a parent `<h3>` first.

**Step 10b:** Repeat on `src/components/pillar/pillar-page.tsx`, the homepage sections, and the guide pages.

**Step 10c:** If any skipped levels exist, fix them by either promoting a heading or inserting a missing intermediate heading.

**Acceptance:** Lighthouse Accessibility audit on five representative pages shows zero "Heading elements are not in a sequentially-descending order" warnings.

---

## Task 11: Tap target spacing audit

Audit tools and Lighthouse flag interactive elements that are closer than 8 pixels to neighbouring tap targets. Common culprits:

- Filter chips in the filter rail.
- Breadcrumb chevrons.
- Footer link rows.
- Header navigation on mobile.

**Step 11a:** Open `src/components/filters/filter-primitives.tsx` and verify chip padding and inter-chip gap totals at least 8 pixels on mobile.

**Step 11b:** Check `src/components/sections/breadcrumb.tsx` for the chevron spacing.

**Step 11c:** Check `src/components/sections/footer.tsx` for the link row spacing on mobile.

**Step 11d:** Verify each tap target has a minimum 48x48 pixel hit area on mobile. Tailwind classes `min-h-12 min-w-12` or padding to that effect.

**Acceptance:** Lighthouse Mobile audit shows zero "Tap targets are not sized appropriately" warnings on the homepage, category landings, and a species detail page.

---

## Task 12: JavaScript bundle audit

Audit tools flag pages that ship excessive JavaScript. Common cause on a content site: filter logic or catalogue data leaking to the client.

**Step 12a:** Run a production build and inspect the bundle:

```bash
pnpm build
```

Note the per-route JavaScript sizes in the build output table. Anything over 200 kB on a route raises suspicion.

**Step 12b:** Check that `src/components/filters/*.tsx` filter components are split into a small client component (the UI that needs interactivity) and a server component (the result list). The result list should run on the server with the filter applied to the data array, and only the filter controls themselves should be `"use client"`.

**Step 12c:** Check that the full catalogue (`fish`, `plants`, `shrimp`, `mosses` arrays from `src/data`) is not imported into any client component. If it is, the entire data file ships to the browser. Move the data dependency server-side and pass only the filtered slice down as props.

**Step 12d:** Check `src/components/search/global-search.tsx`. Site search often imports the whole catalogue for client-side filtering. If the site search ships the full dataset, consider replacing with a server-side search route or with Pagefind (mentioned in `CLAUDE.md` §3.5).

**Acceptance:** Each route's first-load JavaScript stays under 200 kB. The catalogue data files are not imported into any client component.

---

## Acceptance criteria for the session

Before stopping, verify:

- [ ] `pnpm typecheck` and `pnpm build` both pass with zero errors.
- [ ] `pnpm dev` boots without runtime errors.
- [ ] `/fish/neon-tetra` source contains a `<link rel="preload">` for the hero image.
- [ ] `/fish/neon-tetra/opengraph-image` returns a 1200x630 PNG with the species name and key spec line.
- [ ] `/fish?temp=22-26` source contains `<link rel="canonical" href="https://finandstem.com/fish">`.
- [ ] `grep -r '"2025-11-01"' src/` returns zero matches.
- [ ] `curl -I` on the dev server shows HSTS, X-Content-Type-Options, Referrer-Policy, and X-Robots-Tag headers.
- [ ] Lighthouse Mobile audit on the homepage and one species page shows Performance >= 80, Accessibility >= 90, SEO >= 95.
- [ ] No `next/image` with `fill` in the codebase is missing a `sizes` attribute.
- [ ] No client component imports the full catalogue from `src/data`.

---

## What NOT to do this session

- Do not change article content in `src/content/guides/`. The article rewrites are already done.
- Do not change the visual design or component layout. Only the technical attributes and behaviour need adjustment.
- Do not add new third-party services or analytics tools.
- Do not deploy.
- Do not touch backlinks, off-site, or marketing channels. Out of scope for this session.

---

## When you finish

Append a `Session 4 — audit-tool fixes` note to `progress/session-04.md` listing:

1. Which tasks shipped and which were partial.
2. Before-and-after Lighthouse scores on the homepage and one species page.
3. The first-load JavaScript size for each route before and after.
4. Any decisions made without clarification so Mike can review.

Then stop.
