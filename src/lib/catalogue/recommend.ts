/**
 * Tank-aware fish recommender.
 *
 * Given the planner's current selection + tank-size + stocking
 * report, score every fish in the catalogue against the running
 * tank state and return the top N candidates with a one-line
 * "why this fits" rationale.
 *
 * Scoring (higher is better):
 *   • +12  fits comfortably in the remaining stocking headroom
 *   • +8   overlaps the target temp window
 *   • +8   overlaps the target pH window
 *   • +6   overlaps the target hardness window (or both have none)
 *   • +5   adds a different water-column zone than what's already there
 *   • +4   the species' minTankL fits the chosen tank
 *   • +3   shrimp-safe when shrimp are in the tank
 *   • +3   plant-safe when plants are in the tank
 *
 * Disqualifiers (return null, candidate excluded):
 *   • already in the tank
 *   • parameter range doesn't overlap any of temp / pH at all
 *   • minTankL exceeds the chosen tank
 *   • would push bioload past the "full" 1 cm/L threshold
 *   • shrimpSafe === "no" when shrimp are in the tank
 */

import { parseRange, overlaps } from "@/lib/range";
import { fishNorm, type FishNorm, type WaterColumn } from "@/lib/catalogue/normalize";
import type { TankBuilderResult } from "@/lib/catalogue/tank-builder";

export interface FishRecommendation {
  fish: FishNorm;
  score: number;
  reasons: string[];
  /** Total cm of fish this species would add at its school minimum. */
  contributionCm: number;
}

export function recommendFish(
  result: TankBuilderResult,
  tankL: number | undefined,
  limit = 4,
): FishRecommendation[] {
  const { selection, requirements, stocking } = result;
  const haveShrimp = selection.shrimp.length > 0;
  const havePlants = selection.plants.length > 0;
  const existingSlugs = new Set(selection.fish.map((f) => f.slug));

  // Resolved tank windows (intersection of every selected species' range).
  const tankTemp = requirements.temp;
  const tankPh = requirements.ph;
  const tankDgh = requirements.dgh;

  // Existing water-column zones — we want recommendations that fill gaps.
  const existingZones = new Set<WaterColumn>();
  for (const f of selection.fish) {
    for (const z of f.waterColumn) existingZones.add(z);
  }

  // Headroom in cm — how much more bioload the tank can take before
  // tipping into the "full" band (1 cm/L).
  const headroomCm =
    tankL !== undefined && stocking.headroomCm !== null
      ? stocking.headroomCm
      : null;

  const candidates: FishRecommendation[] = [];

  for (const f of fishNorm) {
    if (existingSlugs.has(f.slug)) continue;

    // Disqualifiers
    if (tankL !== undefined && f.minTankL !== null && f.minTankL > tankL) {
      continue;
    }
    if (haveShrimp && f.shrimpSafe === "no") continue;
    // Need at least temperature data; if no overlap with the current
    // tank window the recommendation is meaningless.
    if (tankTemp && !overlaps(f.tempRange, tankTemp)) continue;
    if (tankPh && !overlaps(f.phRange, tankPh)) continue;
    if (tankDgh && f.dghRange && !overlaps(f.dghRange, tankDgh)) continue;

    // Compute the bioload this species would add at its school minimum.
    const adultRange = parseRange(f.raw.adultSize);
    const adult = adultRange ? adultRange.max : 0;
    const group = Math.max(1, f.minGroupSize);
    const contributionCm = Number((adult * group).toFixed(1));

    // Stocking disqualifier — won't add a species that would overflow
    // the comfortable capacity. Only enforced when tank size is known.
    if (headroomCm !== null && contributionCm > headroomCm) continue;

    // Score
    let score = 0;
    const reasons: string[] = [];

    if (tankTemp && overlaps(f.tempRange, tankTemp)) {
      score += 8;
    }
    if (tankPh && overlaps(f.phRange, tankPh)) {
      score += 8;
    }
    if (tankDgh) {
      if (f.dghRange && overlaps(f.dghRange, tankDgh)) score += 6;
      else if (!f.dghRange) score += 3; // No data is neutral — small bonus
    }

    if (tankL !== undefined && f.minTankL !== null && f.minTankL <= tankL) {
      score += 4;
    }

    if (haveShrimp && f.shrimpSafe === "yes") {
      score += 3;
      reasons.push("shrimp-safe");
    } else if (haveShrimp && f.shrimpSafe === "adults-only") {
      score += 1;
      reasons.push("safe with adult shrimp");
    }

    if (havePlants && f.plantSafe) {
      score += 3;
      reasons.push("plant-safe");
    }

    // Headroom reason — gives the user the "this fits in your tank"
    // explanation directly.
    if (headroomCm !== null) {
      if (contributionCm <= headroomCm && contributionCm > 0) {
        score += 12;
        const fits = Math.round((contributionCm / headroomCm) * 100);
        reasons.unshift(
          `${group} × ${f.commonName.toLowerCase()} = ${contributionCm} cm (${fits}% of your remaining headroom)`,
        );
      }
    } else if (selection.fish.length > 0) {
      // Without an explicit tank size, still surface the school cost.
      reasons.unshift(
        `${group} × ${f.commonName.toLowerCase()} adds ${contributionCm} cm of fish`,
      );
    }

    // Variety bonus — recommend species that occupy a different swim
    // zone than what's already in the tank.
    if (existingZones.size > 0) {
      const adds = f.waterColumn.filter((z) => !existingZones.has(z));
      if (adds.length > 0) {
        score += 5;
        reasons.push(`uses the ${adds.join(" + ").toLowerCase()} of the tank`);
      }
    }

    candidates.push({ fish: f, score, reasons, contributionCm });
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, limit);
}
