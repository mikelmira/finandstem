"use client";

import { useSearchParams } from "next/navigation";
import { EntryGrid } from "@/components/catalogue/entry-grid";
import { MossFilters } from "@/components/filters/moss-filters";
import { mossNorm } from "@/lib/catalogue/normalize";
import {
  parseMossFilters,
  applyMossFilters,
  mossChips,
  type SearchParamsLike,
} from "@/lib/catalogue/filters";

/** Client-side moss filtering over a fully static page. See FishIndexClient. */
export function MossIndexClient() {
  const searchParams = useSearchParams();
  const sp = (
    searchParams ? Object.fromEntries(searchParams.entries()) : {}
  ) as SearchParamsLike;
  const filters = parseMossFilters(sp);
  const chips = mossChips(filters);
  const entries = applyMossFilters(mossNorm, filters).map((n) => n.raw);
  return (
    <MossFilters
      filters={filters}
      chips={chips}
      resultCount={entries.length}
      totalCount={mossNorm.length}
    >
      <EntryGrid entries={entries} />
    </MossFilters>
  );
}
