# Claude Code Prompt: Ship Tier 1 SEO + AEO fixes

> Copy everything below the divider into Claude Code at the root of the `finandstem/` repo. Open it as the first task of the session.

---

You are picking up the Fin & Stem project. The site is deployed at https://finandstem.com but not yet indexed by Google. Read these files first:

1. `seo-audit-2026.md` — the audit you are now executing on
2. `seo-geo-strategy.md` — strategy doc that defines the patterns
3. `seo/page-templates.md` — page-section templates
4. `seo/internal-linking-rules.md` — linking rules
5. `CLAUDE.md` — full project brief

If anything in this prompt conflicts with what Mike says in chat, **Mike wins**.

**Operating rules:**
- Use Plan Mode first to lay out the multi-file work, then execute.
- Make small, verifiable steps. Don't introduce libraries that aren't already in `package.json`.
- Run `pnpm typecheck` (or `pnpm build`) after each major change.
- Don't gold-plate. The audit prescribed specific edits; do those and stop.

---

## Goal of this session

Ship the Tier 1 critical fixes from `seo-audit-2026.md §4` so the site can start earning rankings and AI citations. Specifically:

1. **Render the auto-generated TL;DR block visibly on every species page.** Currently it lives only in metadata.
2. **Replace the hardcoded `PUBLISHED_AT = "2025-11-01"` with real per-entry timestamps.**
3. **Add a `keptByAuthor` flag and "Mike's tank" first-hand callout** to entries Mike has actually kept.
4. **Set canonical URLs to bare paths on the four category landing pages** so filter combinations don't fragment crawl budget.
5. **Render a visible "Updated [date] · [N] min read" near the author byline** on every species, pillar, and guide page.
6. **Add HSTS + security headers in `next.config.ts`.**
7. **Scaffold the `/builds` route** (page only, no first journal yet — content is Mike's separate task).

All changes are local-dev verifiable. Do not deploy.

---

## Implementation tasks

### Task 1 — Render the TL;DR block visibly on species pages (CRITICAL)

The single highest-impact change in the audit.

**Current state.** `src/lib/species-faq.ts:36` exports `buildTldr(entry)`. The full 150–280-word output flows into JSON-LD `description` and `<meta description>` only. The visible page leads with `entry.careSummary` (often 80–120 words) — too short to be an AI-Overviews-extractable lead.

**The component already exists.** `src/components/seo/tldr.tsx` exports a `<Tldr body={...} subject={...} />` component built specifically for this content. It's just not wired up.

**The fix.** In `src/components/catalogue/entry-detail.tsx`, render `<Tldr />` immediately after the hero section, before "Care at a glance" / `HeroKeyFacts`. The `tldr` variable is already computed on line ~113.

```tsx
import { Tldr } from "@/components/seo/tldr";

// inside the JSX, between the hero <section> and the "Intro band" <section>:
<section className="border-b border-border/60">
  <div className="mx-auto w-full max-w-6xl px-6 pt-12 pb-0 sm:px-8 sm:pt-16">
    <Tldr body={tldr} subject={entry.commonName} />
  </div>
</section>
```

Keep the existing "Care at a glance" card with `entry.careSummary` below it as the editorial summary — both should render. The order on the rendered page should be:
1. Hero (full-bleed photo + H1)
2. **NEW: TL;DR block (auto-generated structured fact paragraph)**
3. HeroKeyFacts (parameter pills)
4. "Care at a glance" (editorial `careSummary`)
5. Everything else (tank fit → tank mates → etc.)

**Acceptance:** View `/fish/ember-tetra` locally. The visible page contains a TL;DR section showing the full 150–250-word fact paragraph. View the page source — the same text is present in HTML, not just in JSON-LD.

---

### Task 2 — Replace hardcoded publish/update dates

**Current state.** `src/lib/seo.ts:22` defines `const PUBLISHED_AT = "2025-11-01T00:00:00.000Z";` used for every species, pillar, and metadata block. `src/lib/species-metadata.ts:58–59` hardcodes the same date for `publishedTime` and `modifiedTime`.

**The fix.**

Step 2a: Add timestamp fields to the entry types. Edit `src/types/catalogue.ts`:

```typescript
interface CatalogueEntryBase {
  // … existing fields
  /** ISO 8601 string. When the entry was first published. */
  publishedAt: string;
  /** ISO 8601 string. When the entry was last meaningfully updated. */
  updatedAt: string;
}
```

Step 2b: Add timestamps to each entry in `src/data/fish.ts`, `plants.ts`, `shrimp.ts`, `mosses.ts`. For seed entries use realistic dates spread across the actual authoring period — even if they're all close to the same week, varying them by a day or two each is much better than all identical. Order them so the first authored entry has the earliest date.

If the data files are too tedious to edit by hand, instead add a sibling map in `src/data/timestamps.ts`:

```typescript
export const entryTimestamps: Record<string, { publishedAt: string; updatedAt: string }> = {
  "neon-tetra": { publishedAt: "2026-04-12T09:00:00.000Z", updatedAt: "2026-05-20T14:00:00.000Z" },
  "cardinal-tetra": { publishedAt: "2026-04-13T09:00:00.000Z", updatedAt: "2026-05-21T14:00:00.000Z" },
  // … one entry per slug
};
```

…and look it up by slug in the helpers below.

Step 2c: Refactor `src/lib/seo.ts`:

- Remove the `PUBLISHED_AT` constant.
- Change `speciesPageJsonLd` to take `entry` (which now has the dates) and use `entry.publishedAt` / `entry.updatedAt`.
- Same for `pillarPageJsonLd` — pass the pillar's authored date and last-updated date.

Step 2d: Refactor `src/lib/species-metadata.ts:58–59` to use the entry's dates.

Step 2e: Add a `publishedAt` / `updatedAt` constant per pillar in `src/lib/pillar-metadata.ts` or wherever pillar metadata lives, and pass through to schema.

**Acceptance:** Inspect the JSON-LD of `/fish/ember-tetra` and `/fish/neon-tetra` in the rendered HTML — each shows distinct `datePublished` and `dateModified` values. No remaining occurrences of the string `"2025-11-01"` in the codebase (grep verifies).

---

### Task 3 — `keptByAuthor` flag and "Mike's tank" callout

**The fix.**

Step 3a: Add optional fields to the entry type in `src/types/catalogue.ts`:

```typescript
interface CatalogueEntryBase {
  // … existing
  /** True if Mike has personally kept this species. */
  keptByAuthor?: boolean;
  /** Optional first-hand observation from Mike. ~100–200 words. */
  firstHandNote?: string;
}
```

Step 3b: For now, set `keptByAuthor: true` and write a placeholder `firstHandNote` on **just three species** Mike has actually kept. Mike can fill in real notes later. Use these three to start (or whichever Mike confirms via chat):

- `cherry-shrimp`
- `java-fern`
- `neon-tetra`

Use a placeholder like: `firstHandNote: "I've kept this species since [year] in [tank size] — TODO: Mike to fill in observed behaviour, surprises, and lessons. This callout exists so the E-E-A-T signal is wired before content is final."` Mark these with a `// TODO(mike):` comment so they're easy to find.

Step 3c: Add a callout component at `src/components/seo/first-hand-note.tsx`:

```tsx
import { Sparkles } from "lucide-react";
import { site } from "@/lib/site";

interface FirstHandNoteProps {
  note: string;
  speciesName: string;
}

export function FirstHandNote({ note, speciesName }: FirstHandNoteProps) {
  return (
    <aside
      aria-labelledby="first-hand-heading"
      className="glass glass-edge rounded-2xl p-6 sm:p-7 border-l-4 border-[var(--brand)]"
    >
      <header className="flex items-center gap-2">
        <Sparkles className="size-4 text-[var(--brand)]" aria-hidden />
        <h2
          id="first-hand-heading"
          className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--brand)]"
        >
          {site.owner.name.split(" ")[0]}'s tank
        </h2>
      </header>
      <p className="mt-4 text-base leading-relaxed text-foreground/90">{note}</p>
      <p className="mt-3 text-xs text-muted-foreground">
        First-hand observation from keeping {speciesName} — not a research summary.
      </p>
    </aside>
  );
}
```

Step 3d: In `src/components/catalogue/entry-detail.tsx`, render the callout inside the "Pro tips" section header or as a sibling block when `entry.keptByAuthor && entry.firstHandNote`. Place it BETWEEN the TL;DR (Task 1) and HeroKeyFacts — visible immediately, signals experience early.

Step 3e: Add a small badge on the entry card grid (`src/components/catalogue/entry-card.tsx`) for `keptByAuthor` entries — a discreet "Mike keeps this" pill. Makes them visually distinct in the catalogue.

Step 3f: Update the species JSON-LD in `src/lib/seo.ts` to add a `reviewedBy` property when `keptByAuthor`:

```typescript
// inside speciesPageJsonLd's Article entity, conditionally:
...(entry.keptByAuthor && {
  reviewedBy: authorRef(),
  // signal additional first-hand context
}),
```

**Acceptance:** `/fish/neon-tetra`, `/plants/java-fern`, `/shrimp/cherry-shrimp` render the "Mike's tank" callout. Other species pages render normally (no empty callout). Entry cards for those three species show the "Mike keeps this" badge.

---

### Task 4 — Canonical URLs on category landings

**The fix.** Edit each of `src/app/fish/page.tsx`, `src/app/plants/page.tsx`, `src/app/shrimp/page.tsx`, `src/app/mosses/page.tsx` to export `Metadata` with explicit canonical:

```typescript
import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: `${site.url}/fish`, // adjust per category
  },
};
```

**Acceptance:** View source of `/fish?temp=22-26` (if filters are wired up to URL params) — the `<link rel="canonical">` points at `https://finandstem.com/fish`, not the filtered variant.

---

### Task 5 — "Updated [date] · [N] min read" visible

**The fix.** Extend `src/components/seo/author-byline.tsx` to accept and render an `updatedAt` ISO string and a reading-time estimate.

```tsx
import { site } from "@/lib/site";

interface AuthorBylineProps {
  updatedAt?: string;
  readingTimeMin?: number;
}

export function AuthorByline({ updatedAt, readingTimeMin }: AuthorBylineProps) {
  const updated = updatedAt
    ? new Date(updatedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : undefined;

  return (
    <p className="text-sm text-muted-foreground">
      By{" "}
      <a
        href="/about"
        rel="author"
        className="font-medium text-foreground underline decoration-[var(--brand)]/40 underline-offset-4 transition-colors hover:text-[var(--brand)] hover:decoration-[var(--brand)]"
      >
        {site.owner.name}
      </a>
      {updated && (
        <>
          {" · Updated "}
          <time dateTime={updatedAt}>{updated}</time>
        </>
      )}
      {readingTimeMin && <> · {readingTimeMin} min read</>}
    </p>
  );
}
```

For species detail, compute reading time from the rendered prose. Quick heuristic in `entry-detail.tsx`:

```typescript
const wordCount =
  entry.careSummary.split(/\s+/).length +
  tldr.split(/\s+/).length +
  sections.reduce((acc, s) => acc + (s.body?.split(/\s+/).length ?? 0), 0);
const readingTimeMin = Math.max(1, Math.round(wordCount / 220));

<AuthorByline updatedAt={entry.updatedAt} readingTimeMin={readingTimeMin} />
```

**Acceptance:** Every catalogue detail page and pillar page shows "By Mike Elmira · Updated [date] · [N] min read" beneath the title block.

---

### Task 6 — Security headers in `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // … existing remotePatterns
  },
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
        ],
      },
    ];
  },
};

export default nextConfig;
```

**Acceptance:** After `pnpm build && pnpm start`, `curl -I http://localhost:3000` shows the new headers.

---

### Task 7 — Scaffold `/builds` route (no content yet)

Create the route structure so Mike can drop in his first build journal as data. Files to create:

- `src/types/builds.ts` — types for a `BuildJournal`
- `src/data/builds.ts` — empty array `export const builds: BuildJournal[] = [];`
- `src/app/builds/page.tsx` — index page listing builds (empty state when no entries: "First build journal coming soon")
- `src/app/builds/[slug]/page.tsx` — detail page (404 when slug not found)
- `src/lib/seo.ts` — add `buildJournalJsonLd` per `seo/json-ld-templates.md` (HowTo + BreadcrumbList)

Use the page-template skeleton from `seo/page-templates.md` Template 2 — but stub out the photo gallery and HowTo steps until Mike supplies real content.

Add `/builds` to `src/lib/site.ts` `nav` array and `footer.columns` if not already.

Add `/builds` static path to `src/app/sitemap.ts`.

**Acceptance:** `/builds` renders an empty-state page. `/builds/some-slug` 404s gracefully. Sitemap includes `/builds`. No TypeScript errors.

---

## Site-wide acceptance criteria

Before you stop, verify:

- [ ] `pnpm typecheck` (or `pnpm build`) passes with zero errors.
- [ ] `pnpm dev` boots without runtime errors.
- [ ] `/fish/ember-tetra` renders a visible TL;DR block, an "Updated [date] · N min read" line, and the proper JSON-LD with non-default dates.
- [ ] `/fish/neon-tetra` shows a "Mike's tank" first-hand callout (with placeholder text).
- [ ] `/builds` renders an empty-state. `/builds/test` 404s.
- [ ] `grep -r '"2025-11-01"' src/` returns zero matches.
- [ ] Inspecting `/fish` source shows canonical URL `https://finandstem.com/fish`.
- [ ] Lighthouse on the homepage and one species page: SEO ≥95, Accessibility ≥90 (run on the dev server).

## What NOT to do this session

- Don't write actual build journal content — Mike does that. Just scaffold the route.
- Don't fill in real `firstHandNote` content — Mike will write that. Placeholder text is fine.
- Don't rewrite the auto-generated FAQs. That's a future session.
- Don't touch the Wikimedia scrapers or data files outside the timestamp/firstHandNote additions.
- Don't deploy.

## Operational tasks for Mike (you cannot do these in code)

After Claude Code finishes:

- Mike: visit https://search.google.com/search-console, verify ownership (verification meta is already set in `src/app/layout.tsx`), submit `https://finandstem.com/sitemap.xml`, and use URL Inspection to request indexing on the homepage + 5 representative species pages.
- Mike: repeat at https://www.bing.com/webmasters/.
- Mike: run https://pagespeed.web.dev/?url=https%3A%2F%2Fwww.finandstem.com%2Ffish%2Fember-tetra on 5 species pages, the homepage, and the planner. Report LCP / INP / CLS. If LCP >3s on any page, that's the next session.

## When you finish

Append a short *"Session 2 — what shipped, what's open"* note to `progress/session-02.md` with:

1. Which Tier 1 fixes from `seo-audit-2026.md §4` are now live.
2. Anything stubbed (e.g. `firstHandNote` placeholders awaiting Mike's content, `/builds` data file empty).
3. Any decisions you made without asking — so Mike can sanity check.

Then stop and wait for Mike.
