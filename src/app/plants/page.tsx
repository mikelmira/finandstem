import type { Metadata } from "next";
import { plants } from "@/data";
import { atmosphere } from "@/data/atmosphere";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { EntryGrid } from "@/components/catalogue/entry-grid";

export const metadata: Metadata = {
  title: "Plants",
  description:
    "Aquatic plants for the planted aquarium — foreground carpets, midground epiphytes, background stems and rosettes, with light, CO₂ and substrate guidance.",
};

export default function PlantsIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Plants"
        title="Plants for the planted tank."
        subtitle={`${plants.length} species profiled — from beginner Anubias and Java Fern through Cryptocoryne, sword plants, carpets, and high-tech stems. Light, CO₂, substrate, and propagation in one place.`}
        backgroundImage={atmosphere.plantMacro}
      />
      <SectionShell>
        <EntryGrid entries={plants} />
      </SectionShell>
    </>
  );
}
