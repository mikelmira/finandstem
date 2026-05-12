import type { Metadata } from "next";
import { shrimp } from "@/data";
import { atmosphere } from "@/data/atmosphere";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { EntryGrid } from "@/components/catalogue/entry-grid";

export const metadata: Metadata = {
  title: "Shrimp",
  description:
    "Freshwater shrimp species — Neocaridina, Caridina, Amano and bamboo. Colony sizes, water parameters, breeding notes and what they can be kept with.",
};

export default function ShrimpIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Shrimp"
        title="Shrimp for the planted tank."
        subtitle={`${shrimp.length} species profiled — Neocaridina colour morphs through Caridina specialists like Crystal Red and Blue Bolt. Colony minimums, TDS targets, and tank-mate safety.`}
        backgroundImage={atmosphere.amanoMacro}
      />
      <SectionShell>
        <EntryGrid entries={shrimp} />
      </SectionShell>
    </>
  );
}
