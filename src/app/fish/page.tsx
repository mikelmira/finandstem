import type { Metadata } from "next";
import { fish } from "@/data";
import { atmosphere } from "@/data/atmosphere";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { EntryGrid } from "@/components/catalogue/entry-grid";

export const metadata: Metadata = {
  title: "Fish",
  description:
    "Freshwater fish for the planted tank — schoolers, micropredators, dwarf cichlids and centrepiece species, with care, parameters, and tank-mate guidance.",
};

export default function FishIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Fish"
        title="Fish for the planted tank."
        subtitle={`${fish.length} species profiled — schoolers, micropredators, algae crew and centrepieces. Parameters, group sizes, plant and shrimp safety, and the catch in plain English.`}
        backgroundImage={atmosphere.angelfish}
      />
      <SectionShell>
        <EntryGrid entries={fish} />
      </SectionShell>
    </>
  );
}
