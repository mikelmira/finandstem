"use client";

import { useSearchParams } from "next/navigation";
import { EntryGrid } from "@/components/catalogue/entry-grid";
import { FishFilters } from "@/components/filters/fish-filters";
import { fishNorm } from "@/lib/catalogue/normalize";
import {
  parseFishFilters,
  applyFishFilters,
  fishChips,
  type SearchParamsLike,
} from "@/lib/catalogue/filters";

/**
 * Client-side fish filtering. The page is fully static (served from the CDN);
 * this component reads the filter state from the URL, applies the same pure
 * filter functions the server used, and renders the results, so filtering costs
 * no server function invocations.
 */
export function FishIndexClient() {
  const searchParams = useSearchParams();
  const sp = (
    searchParams ? Object.fromEntries(searchParams.entries()) : {}
  ) as SearchParamsLike;
  const filters = parseFishFilters(sp);
  const chips = fishChips(filters);
  const entries = applyFishFilters(fishNorm, filters).map((n) => n.raw);
  return (
    <FishFilters
      filters={filters}
      chips={chips}
      resultCount={entries.length}
      totalCount={fishNorm.length}
    >
      <EntryGrid entries={entries} />
    </FishFilters>
  );
}
