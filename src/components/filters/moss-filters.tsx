"use client";

import * as React from "react";
import {
  FilterGroup,
  MultiChips,
  DifficultyChips,
  RangePair,
} from "./filter-primitives";
import { FilterRail, FilterEmptyState } from "./filter-rail";
import { useFilterUrl } from "./use-filter-url";
import {
  RANGE_BOUNDS,
  type MossFilterState,
  type ActiveChip,
} from "@/lib/catalogue/filters";
import type {
  MossAttachment,
  MossUse,
  Light,
  CO2,
  GrowthRate,
} from "@/lib/catalogue/normalize";

const ATTACH_OPTIONS: ReadonlyArray<{ value: MossAttachment; label: string }> =
  [
    { value: "Wood", label: "Wood" },
    { value: "Stone", label: "Stone" },
    { value: "Mesh", label: "Mesh" },
    { value: "Floating", label: "Floating" },
  ];

const USE_OPTIONS: ReadonlyArray<{ value: MossUse; label: string }> = [
  { value: "Carpet", label: "Carpet" },
  { value: "Wall", label: "Wall" },
  { value: "Tree", label: "Tree" },
  { value: "Bonsai", label: "Bonsai" },
  { value: "Crevice", label: "Crevice" },
  { value: "Cave", label: "Cave" },
  { value: "Shrimp tank", label: "Shrimp tank" },
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
  filters: MossFilterState;
  chips: ActiveChip[];
  resultCount: number;
  children: React.ReactNode;
}

export function MossFilters({ filters, chips, resultCount, children }: Props) {
  const { setParams } = useFilterUrl();
  const formatRange = (v: { min: number; max: number } | null) =>
    v ? `${v.min}-${v.max}` : null;

  const removeChip = (key: string) => {
    if (key === "temp") return setParams({ temp: null });
    if (key === "ph") return setParams({ ph: null });
    const [field, value] = key.split(":");
    if (field === "attach")
      setParams({ attach: filters.attach.filter((v) => v !== value) });
    else if (field === "use")
      setParams({ use: filters.use.filter((v) => v !== value) });
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
      <FilterGroup label="Attachment">
        <MultiChips
          options={ATTACH_OPTIONS}
          values={filters.attach}
          onChange={(v) => setParams({ attach: v })}
        />
      </FilterGroup>

      <FilterGroup label="Typical use">
        <MultiChips
          options={USE_OPTIONS}
          values={filters.use}
          onChange={(v) => setParams({ use: v })}
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

      <FilterGroup label="Difficulty">
        <DifficultyChips
          values={filters.difficulty}
          onChange={(v) => setParams({ difficulty: v.map(String) })}
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
    </>
  );

  return (
    <FilterRail
      rail={rail}
      chips={chips}
      onClearChip={removeChip}
      resultCount={resultCount}
      category="mosses"
    >
      {resultCount === 0 ? (
        <FilterEmptyState chips={chips} onClearChip={removeChip} />
      ) : (
        children
      )}
    </FilterRail>
  );
}
