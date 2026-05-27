/**
 * Substrate → plant affinity mapping.
 *
 * This is a small, hand-curated static mapping used by the substrate
 * detail page's "Plants that thrive in this substrate" panel. It is
 * deliberately NOT a relational compatibility query against the
 * plants catalogue, that would couple the substrate collection to
 * livestock parameters and re-introduce the very integration the
 * substrate-vs-livestock separation is supposed to prevent.
 *
 * The mapping is keyed by substrate category. The plant slugs listed
 * are existing entries in `src/data/plants.ts`.
 */

import type { SubstrateCategory } from "@/types/substrate";

export interface PlantAffinity {
  /** Existing slug in src/data/plants.ts */
  slug: string;
  /** One-line reason this pairing makes sense. */
  note: string;
}

export const PLANT_AFFINITY: Record<SubstrateCategory, ReadonlyArray<PlantAffinity>> = {
  "active-aquasoil": [
    {
      slug: "cryptocoryne-wendtii",
      note: "Heavy root feeder, thrives on the strong ammonia and nutrients leaching from new aquasoil.",
    },
    {
      slug: "amazon-sword",
      note: "Background rosette with extensive root system, builds tall on the rich substrate.",
    },
    {
      slug: "rotala-rotundifolia",
      note: "Stem plant that colours strongest under low pH + high nutrient soil conditions.",
    },
    {
      slug: "monte-carlo",
      note: "Carpeting plant that pearls quickly when rooted directly into aquasoil with CO2.",
    },
    {
      slug: "ludwigia-super-red",
      note: "Reds deepen on active aquasoil thanks to the consistent micro-nutrient release.",
    },
  ],
  "inert-nutrient": [
    {
      slug: "vallisneria-spiralis",
      note: "Long-runner background grass that pulls iron and trace minerals from Flourite/Eco-Complete.",
    },
    {
      slug: "amazon-sword",
      note: "Tolerates inert nutrient substrates well if root tabs are dosed every 3 to 6 months.",
    },
    {
      slug: "cryptocoryne-wendtii",
      note: "Adapts to inert substrates with the help of root tabs at planting time.",
    },
    {
      slug: "bacopa-caroliniana",
      note: "Stem plant that draws most of its nutrients from the water column anyway, so inert is fine.",
    },
  ],
  "inert-sand": [
    {
      slug: "anubias-nana",
      note: "Rhizome plant attached to hardscape, never touches the substrate so sand is perfect.",
    },
    {
      slug: "java-fern",
      note: "Another epiphyte, ties to wood or stone above the substrate.",
    },
    {
      slug: "vallisneria-spiralis",
      note: "Tolerates pure sand if root tabs are dosed near each crown every couple of months.",
    },
    {
      slug: "amazon-sword",
      note: "Heavy root feeder, needs root tabs every 2 to 3 months to thrive in plain sand.",
    },
  ],
  "additive-or-base-layer": [
    {
      slug: "cryptocoryne-wendtii",
      note: "ADA Power Sand + Bacter 100 stack supercharges Cryptocoryne root systems.",
    },
    {
      slug: "amazon-sword",
      note: "The premium ADA stack is canonical for large background swords.",
    },
    {
      slug: "rotala-rotundifolia",
      note: "Stems colour faster on the full ADA additive stack than on plain aquasoil alone.",
    },
  ],
};
