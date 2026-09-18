"use client";

import { useSearchParams } from "next/navigation";
import { EntryGrid } from "@/components/catalogue/entry-grid";
import { ShrimpFilters } from "@/components/filters/shrimp-filters";
import { shrimpNorm } from "@/lib/catalogue/normalize";
import {
  parseShrimpFilters,
  applyShrimpFilters,
  shrimpChips,
  type SearchParamsLike,
} from "@/lib/catalogue/filters";

/** Client-side shrimp filtering over a fully static page. See FishIndexClient. */
export function ShrimpIndexClient() {
  const searchParams = useSearchParams();
  const sp = (
    searchParams ? Object.fromEntries(searchParams.entries()) : {}
  ) as SearchParamsLike;
  const filters = parseShrimpFilters(sp);
  const chips = shrimpChips(filters);
  const entries = applyShrimpFilters(shrimpNorm, filters).map((n) => n.raw);
  return (
    <ShrimpFilters
      filters={filters}
      chips={chips}
      resultCount={entries.length}
      totalCount={shrimpNorm.length}
    >
      <EntryGrid entries={entries} />
    </ShrimpFilters>
  );
}
