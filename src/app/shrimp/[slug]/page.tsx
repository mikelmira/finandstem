import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { shrimp, findShrimp } from "@/data";
import { EntryDetail } from "@/components/catalogue/entry-detail";
import type { Stat } from "@/components/catalogue/stat-grid";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return shrimp.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const entry = findShrimp(slug);
  if (!entry) return {};
  return {
    title: `${entry.commonName} (${entry.scientificName})`,
    description: entry.careSummary,
  };
}

export default async function ShrimpDetailPage({ params }: RouteParams) {
  const { slug } = await params;
  const entry = findShrimp(slug);
  if (!entry) notFound();

  const stats: ReadonlyArray<Stat> = [
    { label: "Adult size", value: entry.adultSize },
    { label: "Min tank", value: entry.minTankSize },
    { label: "Min colony", value: `${entry.colonyMin}+` },
    { label: "Temperature", value: `${entry.tempRange} °C` },
    { label: "pH", value: entry.phRange },
    { label: "Hardness", value: `${entry.dghRange} dGH` },
    { label: "TDS", value: `${entry.tdsRange} ppm` },
    { label: "Lifespan", value: `${entry.lifespan} yrs` },
  ];

  const details = [
    { heading: "Diet", body: entry.diet },
    { heading: "Feeding", body: entry.feedingNotes },
    { heading: "Breeding", body: entry.breeding },
    {
      heading: "Algae grazing",
      body: `${entry.algaeEaterRating}/5 — ${algaeLabel(entry.algaeEaterRating)}`,
    },
  ];

  const pairings = [
    { label: "Plant safe", value: entry.plantSafe },
    { label: "Tank-mate safe with", value: entry.fishTankSafeWith },
  ];

  return (
    <EntryDetail
      entry={entry}
      stats={stats}
      details={details}
      pairings={pairings}
    />
  );
}

function algaeLabel(rating: number): string {
  if (rating >= 5) return "Exceptional grazer";
  if (rating >= 4) return "Strong grazer";
  if (rating >= 3) return "Reliable contributor";
  if (rating >= 2) return "Occasional grazer";
  return "Mostly scavenger";
}
