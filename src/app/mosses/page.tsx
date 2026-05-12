import type { Metadata } from "next";
import { mosses } from "@/data";
import { atmosphere } from "@/data/atmosphere";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { EntryGrid } from "@/components/catalogue/entry-grid";

export const metadata: Metadata = {
  title: "Mosses",
  description:
    "Aquatic mosses for hardscape and shrimp tanks — Java, Christmas, Flame, Weeping, Phoenix and more. Attachment, trimming, and what each one is actually for.",
};

export default function MossesIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Mosses"
        title="Mosses for the planted tank."
        subtitle={`${mosses.length} species profiled — Java and Christmas through Fissidens, Süßwassertang, and Riccia. Attachment, trimming cadence, and the shapes each one forms.`}
        backgroundImage={atmosphere.driftwoodMoss}
      />
      <SectionShell>
        <EntryGrid entries={mosses} />
      </SectionShell>
    </>
  );
}
