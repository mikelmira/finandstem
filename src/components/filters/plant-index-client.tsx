"use client";

import { useSearchParams } from "next/navigation";
import { EntryGrid } from "@/components/catalogue/entry-grid";
import { PlantFilters } from "@/components/filters/plant-filters";
import { plantNorm } from "@/lib/catalogue/normalize";
import {
  parsePlantFilters,
  applyPlantFilters,
  plantChips,
  type SearchParamsLike,
} from "@/lib/catalogue/filters";

/** Client-side plant filtering over a fully static page. See FishIndexClient. */
export function PlantIndexClient() {
  const searchParams = useSearchParams();
  const sp = (
    searchParams ? Object.fromEntries(searchParams.entries()) : {}
  ) as SearchParamsLike;
  const filters = parsePlantFilters(sp);
  const chips = plantChips(filters);
  const entries = applyPlantFilters(plantNorm, filters).map((n) => n.raw);
  return (
    <PlantFilters
      filters={filters}
      chips={chips}
      resultCount={entries.length}
      totalCount={plantNorm.length}
    >
      <EntryGrid entries={entries} />
    </PlantFilters>
  );
}
