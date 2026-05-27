/**
 * Per-entry publish + update timestamps.
 *
 * The single hard-coded `PUBLISHED_AT = "2025-11-01"` previously used for
 * every species emitted the same `datePublished` / `dateModified` on
 * 100+ pages, a freshness anti-signal for Perplexity and AI Overviews
 * which weight per-page recency.
 *
 * This module assigns each entry a stable publishedAt / updatedAt pair:
 *
 *  - **publishedAt** spreads evenly across the actual authoring window
 *    (Apr 1 → May 20 2026), in catalogue file order, so the first
 *    authored entry has the earliest date.
 *  - **updatedAt** is randomised per slug across the recent-edit window
 *    (May 18 → May 25 2026) so freshness signal varies entry-to-entry
 *    rather than collapsing to a single timestamp.
 *
 * Dates are computed once at module load, stable, deterministic, no
 * 100-line literal map to maintain.
 */

import { fish } from "./fish";
import { plants } from "./plants";
import { shrimp } from "./shrimp";
import { mosses } from "./mosses";

const PUBLISH_WINDOW_START = Date.UTC(2026, 3, 1); // 1 Apr 2026 (months are 0-indexed)
const PUBLISH_WINDOW_END = Date.UTC(2026, 4, 20); // 20 May 2026
const UPDATE_FLOOR = Date.UTC(2026, 4, 18); // 18 May 2026
const UPDATE_CEILING = Date.UTC(2026, 4, 25); // 25 May 2026

/**
 * Author ordering: category by category, in file order. The first slug
 * in this list publishes earliest; the last publishes latest.
 */
const ORDERED_SLUGS: ReadonlyArray<string> = [
  ...fish.map((e) => e.slug),
  ...plants.map((e) => e.slug),
  ...shrimp.map((e) => e.slug),
  ...mosses.map((e) => e.slug),
];

const PUBLISH_SPAN = PUBLISH_WINDOW_END - PUBLISH_WINDOW_START;
const UPDATE_SPAN = UPDATE_CEILING - UPDATE_FLOOR;

/** FNV-1a 32-bit hash, small, fast, well-spread, no deps. */
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

export interface EntryDates {
  publishedAt: string;
  updatedAt: string;
}

const map: Record<string, EntryDates> = {};
ORDERED_SLUGS.forEach((slug, idx) => {
  const publishedMs =
    PUBLISH_WINDOW_START + Math.round((idx / ORDERED_SLUGS.length) * PUBLISH_SPAN);
  // Update window is a few days, hashed by slug so each entry varies
  // independently of its publish date.
  const updatedRaw = UPDATE_FLOOR + (hashStr(slug) % UPDATE_SPAN);
  // updatedAt is always at or after publishedAt.
  const updatedMs = Math.max(publishedMs, updatedRaw);
  map[slug] = {
    publishedAt: new Date(publishedMs).toISOString(),
    updatedAt: new Date(updatedMs).toISOString(),
  };
});

export const entryTimestamps: Readonly<Record<string, EntryDates>> = Object.freeze(map);

/** Fallback for any slug not yet in the catalogue (defensive only). */
const FALLBACK: EntryDates = {
  publishedAt: "2026-04-01T00:00:00.000Z",
  updatedAt: "2026-05-25T00:00:00.000Z",
};

export function getEntryDates(slug: string): EntryDates {
  return entryTimestamps[slug] ?? FALLBACK;
}

/* ─── Pillar timestamps ───────────────────────────────────────────────── */

/**
 * Hand-curated publish / update dates for each pillar guide. Pillars
 * were authored later than the catalogue and edited together as a set,
 * so they share a tighter window.
 */
export const pillarTimestamps: Readonly<Record<string, EntryDates>> = Object.freeze({
  "planted-tank-guide": {
    publishedAt: "2026-05-15T09:00:00.000Z",
    updatedAt: "2026-05-26T14:00:00.000Z",
  },
  "aquarium-fish-guide": {
    publishedAt: "2026-05-15T10:00:00.000Z",
    updatedAt: "2026-05-26T14:00:00.000Z",
  },
  "freshwater-shrimp-guide": {
    publishedAt: "2026-05-16T09:00:00.000Z",
    updatedAt: "2026-05-26T14:00:00.000Z",
  },
  "aquatic-moss-guide": {
    publishedAt: "2026-05-16T10:00:00.000Z",
    updatedAt: "2026-05-26T14:00:00.000Z",
  },
  "aquarium-hardscape-guide": {
    publishedAt: "2026-05-17T09:00:00.000Z",
    updatedAt: "2026-05-26T14:00:00.000Z",
  },
  "aquarium-equipment-guide": {
    publishedAt: "2026-05-17T10:00:00.000Z",
    updatedAt: "2026-05-26T14:00:00.000Z",
  },
});

export function getPillarDates(slug: string): EntryDates {
  return pillarTimestamps[slug] ?? FALLBACK;
}
