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
  type PlantFilterState,
  type ActiveChip,
} from "@/lib/catalogue/filters";
import type {
  PlantPosition,
  PlantTypeNorm,
  Light,
  CO2,
  GrowthRate,
} from "@/lib/catalogue/normalize";

const POSITION_OPTIONS: ReadonlyArray<{ value: PlantPosition; label: string }> =
  [
    { value: "Foreground", label: "Foreground" },
    { value: "Midground", label: "Midground" },
    { value: "Background", label: "Background" },
    { value: "Floating", label: "Floating" },
  ];

const TYPE_OPTIONS: ReadonlyArray<{ value: PlantTypeNorm; label: string }> = [
  { value: "Stem", label: "Stem" },
  { value: "Rosette", label: "Rosette" },
  { value: "Rhizome", label: "Rhizome" },
  { value: "Carpet", label: "Carpet" },
  { value: "Floating", label: "Floating" },
  { value: "Epiphyte", label: "Epiphyte" },
];

const LIGHT_OPTIONS: ReadonlyArray<{ value: Light; label: string }> = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

const CO2_OPTIONS: ReadonlyArray<{ value: CO2; label: string }> = [
  { value: "None", label: "None" },
  { value: "Optional", label: "Optional" },
  { value: "Recommended", label: "Recommended" },
  { value: "Required", label: "Required" },
];

const GROWTH_OPTIONS: ReadonlyArray<{ value: GrowthRate; label: string }> = [
  { value: "Slow", label: "Slow" },
  { value: "Medium", label: "Medium" },
  { value: "Fast", label: "Fast" },
  { value: "Very Fast", label: "Very fast" },
];

interface Props {
  filters: PlantFilterState;
  chips: ActiveChip[];
  resultCount: number;
  totalCount: number;
  children: React.ReactNode;
}

export function PlantFilters({
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
    if (key === "heightMax") return setParams({ heightMax: null });
    if (key === "temp") return setParams({ temp: null });
    if (key === "ph") return setParams({ ph: null });
    if (key === "dgh") return setParams({ dgh: null });
    const [field, value] = key.split(":");
    if (field === "position")
      setParams({ position: filters.position.filter((v) => v !== value) });
    else if (field === "type")
      setParams({ type: filters.type.filter((v) => v !== value) });
    else if (field === "light")
      setParams({ light: filters.light.filter((v) => v !== value) });
    else if (field === "co2")
      setParams({ co2: filters.co2.filter((v) => v !== value) });
    else if (field === "growth")
      setParams({ growth: filters.growth.filter((v) => v !== value) });
    else if (field === "difficulty")
      setParams({
        difficulty: filters.difficulty
          .filter((v) => v !== Number(value))
          .map(String),
      });
  };

  const rail = (
    <>
      <FilterGroup label="Position">
        <MultiChips
          options={POSITION_OPTIONS}
          values={filters.position}
          onChange={(v) => setParams({ position: v })}
        />
      </FilterGroup>

      <FilterGroup label="Plant type">
        <MultiChips
          options={TYPE_OPTIONS}
          values={filters.type}
          onChange={(v) => setParams({ type: v })}
        />
      </FilterGroup>

      <FilterGroup label="Light">
        <MultiChips
          options={LIGHT_OPTIONS}
          values={filters.light}
          onChange={(v) => setParams({ light: v })}
        />
      </FilterGroup>

      <FilterGroup label="CO₂">
        <MultiChips
          options={CO2_OPTIONS}
          values={filters.co2}
          onChange={(v) => setParams({ co2: v })}
        />
      </FilterGroup>

      <FilterGroup label="Growth rate">
        <MultiChips
          options={GROWTH_OPTIONS}
          values={filters.growth}
          onChange={(v) => setParams({ growth: v })}
        />
      </FilterGroup>

      <FilterGroup label="Max height ≤">
        <NumberInput
          value={filters.heightMax}
          onChange={(v) => setParams({ heightMax: v })}
          placeholder="e.g. 30"
          unit="cm"
          min={0}
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

      <FilterGroup label="Difficulty">
        <DifficultyChips
          values={filters.difficulty}
          onChange={(v) => setParams({ difficulty: v.map(String) })}
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
      category="plants"
    >
      {resultCount === 0 ? (
        <FilterEmptyState chips={chips} onClearChip={removeChip} />
      ) : (
        children
      )}
    </FilterRail>
  );
}
