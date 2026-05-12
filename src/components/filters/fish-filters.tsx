"use client";

import * as React from "react";
import {
  FilterGroup,
  MultiChips,
  DifficultyChips,
  ToggleSwitch,
  NumberInput,
  RangePair,
  TriSelect,
} from "./filter-primitives";
import { FilterRail, FilterEmptyState } from "./filter-rail";
import { useFilterUrl } from "./use-filter-url";
import {
  RANGE_BOUNDS,
  type FishFilterState,
  type ActiveChip,
} from "@/lib/catalogue/filters";
import type { WaterColumn, Temperament, Diet } from "@/lib/catalogue/normalize";

const COLUMN_OPTIONS: ReadonlyArray<{ value: WaterColumn; label: string }> = [
  { value: "Top", label: "Top" },
  { value: "Mid", label: "Mid" },
  { value: "Bottom", label: "Bottom" },
];

const TEMPERAMENT_OPTIONS: ReadonlyArray<{ value: Temperament; label: string }> =
  [
    { value: "Peaceful", label: "Peaceful" },
    { value: "Semi-aggressive", label: "Semi-aggressive" },
    { value: "Aggressive", label: "Aggressive" },
    { value: "Territorial when breeding", label: "Territorial breeding" },
  ];

const DIET_OPTIONS: ReadonlyArray<{ value: Diet; label: string }> = [
  { value: "Omnivore", label: "Omnivore" },
  { value: "Micropredator", label: "Micropredator" },
  { value: "Herbivore", label: "Herbivore" },
  { value: "Filter feeder", label: "Filter feeder" },
];

interface Props {
  filters: FishFilterState;
  chips: ActiveChip[];
  resultCount: number;
  children: React.ReactNode;
}

export function FishFilters({ filters, chips, resultCount, children }: Props) {
  const { setParams } = useFilterUrl();
  const formatRange = (v: { min: number; max: number } | null) =>
    v ? `${v.min}-${v.max}` : null;

  const removeChip = (key: string) => {
    if (key === "tankL") return setParams({ tankL: null });
    if (key === "schooling") return setParams({ schooling: null });
    if (key === "groupMax") return setParams({ groupMax: null });
    if (key === "temp") return setParams({ temp: null });
    if (key === "ph") return setParams({ ph: null });
    if (key === "dgh") return setParams({ dgh: null });
    if (key === "plantSafe") return setParams({ plantSafe: null });
    if (key === "shrimpSafe") return setParams({ shrimpSafe: null });
    if (key === "lifespan") return setParams({ lifespan: null });
    const [field, value] = key.split(":");
    if (field === "column") {
      setParams({ column: filters.column.filter((v) => v !== value) });
    } else if (field === "temperament") {
      setParams({
        temperament: filters.temperament.filter((v) => v !== value),
      });
    } else if (field === "diet") {
      setParams({ diet: filters.diet.filter((v) => v !== value) });
    } else if (field === "difficulty") {
      setParams({
        difficulty: filters.difficulty
          .filter((v) => v !== Number(value))
          .map(String),
      });
    }
  };

  const rail = (
    <>
      <FilterGroup label="Min tank size">
        <NumberInput
          value={filters.tankL}
          onChange={(v) => setParams({ tankL: v })}
          placeholder="e.g. 60"
          unit="L"
          min={0}
        />
      </FilterGroup>

      <FilterGroup label="Water column">
        <MultiChips
          options={COLUMN_OPTIONS}
          values={filters.column}
          onChange={(v) => setParams({ column: v })}
        />
      </FilterGroup>

      <FilterGroup label="Temperament">
        <MultiChips
          options={TEMPERAMENT_OPTIONS}
          values={filters.temperament}
          onChange={(v) => setParams({ temperament: v })}
        />
      </FilterGroup>

      <FilterGroup label="Schooling">
        <ToggleSwitch
          label="Schooling only"
          selected={filters.schooling}
          onChange={(v) => setParams({ schooling: v ? "1" : null })}
        />
        <NumberInput
          value={filters.groupMax}
          onChange={(v) => setParams({ groupMax: v })}
          placeholder="Min group ≤ …"
          min={1}
        />
      </FilterGroup>

      <FilterGroup label="Diet">
        <MultiChips
          options={DIET_OPTIONS}
          values={filters.diet}
          onChange={(v) => setParams({ diet: v })}
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

      <FilterGroup label="Plant & shrimp safety">
        <ToggleSwitch
          label="Plant-safe"
          selected={filters.plantSafe}
          onChange={(v) => setParams({ plantSafe: v ? "1" : null })}
        />
        <TriSelect
          options={[
            { value: "any", label: "Any shrimp" },
            { value: "yes", label: "Shrimp-safe" },
            { value: "adults-only", label: "Adults only" },
          ]}
          value={filters.shrimpSafe}
          onChange={(v) =>
            setParams({ shrimpSafe: v === "any" ? null : v })
          }
        />
      </FilterGroup>

      <FilterGroup label="Lifespan ≥">
        <NumberInput
          value={filters.lifespan}
          onChange={(v) => setParams({ lifespan: v })}
          unit="years"
          min={0}
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
      category="fish"
    >
      {resultCount === 0 ? (
        <FilterEmptyState chips={chips} onClearChip={removeChip} />
      ) : (
        children
      )}
    </FilterRail>
  );
}
