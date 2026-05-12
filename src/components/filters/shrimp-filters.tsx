"use client";

import * as React from "react";
import {
  FilterGroup,
  MultiChips,
  DifficultyChips,
  NumberInput,
  RangePair,
} from "./filter-primitives";
import { FilterRail, FilterEmptyState } from "./filter-rail";
import { useFilterUrl } from "./use-filter-url";
import {
  RANGE_BOUNDS,
  type ShrimpFilterState,
  type ActiveChip,
} from "@/lib/catalogue/filters";
import type {
  ShrimpLineage,
  ShrimpBreeding,
} from "@/lib/catalogue/normalize";

const LINEAGE_OPTIONS: ReadonlyArray<{
  value: ShrimpLineage;
  label: string;
}> = [
  { value: "Neocaridina", label: "Neocaridina" },
  { value: "Caridina", label: "Caridina" },
  { value: "Other", label: "Other" },
];

const BREEDING_OPTIONS: ReadonlyArray<{
  value: ShrimpBreeding;
  label: string;
}> = [
  { value: "Very easy", label: "Very easy" },
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
  { value: "Larvae need brackish", label: "Brackish larvae" },
];

interface Props {
  filters: ShrimpFilterState;
  chips: ActiveChip[];
  resultCount: number;
  totalCount: number;
  children: React.ReactNode;
}

export function ShrimpFilters({
  filters,
  chips,
  resultCount,
  totalCount,
  children,
}: Props) {
  const { setParams } = useFilterUrl();
  const formatRange = (v: { min: number; max: number } | null) =>
    v ? `${v.min}-${v.max}` : null;

  const removeChip = (key: string) => {
    if (key === "tankL") return setParams({ tankL: null });
    if (key === "algae") return setParams({ algae: null });
    if (key === "temp") return setParams({ temp: null });
    if (key === "ph") return setParams({ ph: null });
    if (key === "dgh") return setParams({ dgh: null });
    if (key === "tds") return setParams({ tds: null });
    const [field, value] = key.split(":");
    if (field === "lineage")
      setParams({ lineage: filters.lineage.filter((v) => v !== value) });
    else if (field === "breeding")
      setParams({
        breeding: filters.breeding.filter((v) => v !== value),
      });
    else if (field === "difficulty")
      setParams({
        difficulty: filters.difficulty
          .filter((v) => v !== Number(value))
          .map(String),
      });
  };

  const rail = (
    <>
      <FilterGroup label="Lineage">
        <MultiChips
          options={LINEAGE_OPTIONS}
          values={filters.lineage}
          onChange={(v) => setParams({ lineage: v })}
        />
      </FilterGroup>

      <FilterGroup label="Min tank size">
        <NumberInput
          value={filters.tankL}
          onChange={(v) => setParams({ tankL: v })}
          placeholder="e.g. 20"
          unit="L"
          min={0}
        />
      </FilterGroup>

      <FilterGroup label="Difficulty">
        <DifficultyChips
          values={filters.difficulty}
          onChange={(v) => setParams({ difficulty: v.map(String) })}
        />
      </FilterGroup>

      <FilterGroup label="Algae eater rating ≥">
        <NumberInput
          value={filters.algae}
          onChange={(v) => setParams({ algae: v })}
          min={1}
          max={5}
          step={1}
          placeholder="1–5"
        />
      </FilterGroup>

      <FilterGroup label="Breeding">
        <MultiChips
          options={BREEDING_OPTIONS}
          values={filters.breeding}
          onChange={(v) => setParams({ breeding: v })}
        />
      </FilterGroup>

      <FilterGroup label="Temperature">
        <RangePair
          value={filters.temp}
          onChange={(v) => setParams({ temp: formatRange(v) })}
          bounds={RANGE_BOUNDS.temp}
          unit="°C"
        />
      </FilterGroup>

      <FilterGroup label="pH">
        <RangePair
          value={filters.ph}
          onChange={(v) => setParams({ ph: formatRange(v) })}
          bounds={RANGE_BOUNDS.ph}
          precision={1}
        />
      </FilterGroup>

      <FilterGroup label="dGH">
        <RangePair
          value={filters.dgh}
          onChange={(v) => setParams({ dgh: formatRange(v) })}
          bounds={RANGE_BOUNDS.dgh}
        />
      </FilterGroup>

      <FilterGroup label="TDS">
        <RangePair
          value={filters.tds}
          onChange={(v) => setParams({ tds: formatRange(v) })}
          bounds={RANGE_BOUNDS.tds}
          unit="ppm"
        />
      </FilterGroup>
    </>
  );

  return (
    <FilterRail
      rail={rail}
      chips={chips}
      onClearChip={removeChip}
      resultCount={resultCount}
      totalCount={totalCount}
      category="shrimp"
    >
      {resultCount === 0 ? (
        <FilterEmptyState chips={chips} onClearChip={removeChip} />
      ) : (
        children
      )}
    </FilterRail>
  );
}
