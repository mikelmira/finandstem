/**
 * Build journals — first-hand tank-build write-ups.
 *
 * Empty for now. Mike publishes the first journal when the photos and
 * notes are ready; until then the route renders an empty-state hub so
 * the URL is indexable and the sitemap is honest.
 */

import type { BuildJournal } from "@/types/builds";

export const builds: ReadonlyArray<BuildJournal> = [];

export function findBuild(slug: string): BuildJournal | undefined {
  return builds.find((b) => b.slug === slug);
}
