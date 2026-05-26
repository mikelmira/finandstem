/**
 * Build journals — long-form first-hand tank-build write-ups.
 *
 * Each journal is the editorial moat: photos of Mike's own tanks, parts
 * lists, week-by-week timelines, lessons. Catalogue entries link out to
 * builds where they were used; builds link back to the catalogue.
 *
 * The data file `src/data/builds.ts` starts empty — Mike publishes the
 * first journal once he has the photos and notes ready. The route lives
 * already so the site can index `/builds` as a hub URL from day one.
 */

import type { CatalogueCategory } from "./catalogue";

export interface BuildJournalSupply {
  /** Display name — "Twinstar S Light", "ADA Aquasoil Amazonia" etc. */
  name: string;
  /** Optional category label (lighting, substrate, hardscape, fertiliser…). */
  category?: string;
  /** Optional manufacturer link. Opens in new tab. */
  url?: string;
}

export interface BuildJournalStep {
  /** Short step title — used as the `name` in HowTo JSON-LD. */
  title: string;
  /** Long-form description in markdown-light prose. */
  description: string;
  /**
   * Optional cover photo for the step. Path relative to /public.
   * Stored on Mike's machine; later moved to Wikimedia / R2 if needed.
   */
  image?: string;
  /** Optional ISO 8601 day this step happened on. */
  date?: string;
}

export interface BuildJournalRelated {
  category: CatalogueCategory;
  slug: string;
}

export interface BuildJournal {
  /** URL slug — `/builds/{slug}`. */
  slug: string;
  /** Page title + HowTo `name`. */
  title: string;
  /** Short tagline shown beneath the title and in OG cards. */
  tagline: string;
  /** 150–250-word TL;DR for the visible block + JSON-LD description. */
  tldr: string;
  /** ISO 8601 — when the build was first published. */
  publishedAt: string;
  /** ISO 8601 — last meaningful update. */
  updatedAt: string;
  /** Tank litres (volume). Optional — some scapes are nano hex etc. */
  tankSizeL?: number;
  /** Tank footprint as "LxWxH cm" or similar freeform. */
  dimensions?: string;
  /** "Low tech", "Medium tech", "High tech" — light + CO₂ tier. */
  techLevel?: string;
  /** Aquascape style — "Iwagumi", "Dutch", "Nature", "Biotope", etc. */
  style?: string;
  /**
   * ISO 8601 duration — used as the HowTo.totalTime property. E.g.
   * `P3M` (3 months), `PT4H` (4 hours).
   */
  totalTimeIso?: string;
  /** Estimated total cost in USD. Optional. */
  estimatedCostUsd?: number;
  /** Hero image — Cover photo for the journal. Path relative to /public. */
  heroImage?: string;
  /** Supplies / tools used. Drives the HowTo.supply schema array. */
  supplies: ReadonlyArray<BuildJournalSupply>;
  /** Week-by-week or step-by-step timeline. */
  steps: ReadonlyArray<BuildJournalStep>;
  /** Catalogue cross-references — what's actually in the tank. */
  related: ReadonlyArray<BuildJournalRelated>;
}
