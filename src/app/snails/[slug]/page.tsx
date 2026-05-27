import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { snails, findSnail } from "@/data";
import { EntryDetail } from "@/components/catalogue/entry-detail";
import type { Stat } from "@/components/catalogue/stat-grid";
import { speciesMetadata } from "@/lib/species-metadata";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return snails.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const entry = findSnail(slug);
  if (!entry) return {};
  return speciesMetadata(entry);
}

export default async function SnailDetailPage({ params }: RouteParams) {
  const { slug } = await params;
  const entry = findSnail(slug);
  if (!entry) notFound();

  const stats: ReadonlyArray<Stat> = [
    { label: "Adult size", value: `${entry.adultSize} cm` },
    { label: "Min tank", value: `${entry.minTankSize} L` },
    { label: "Temperature", value: `${entry.tempRange} °C` },
    { label: "pH", value: entry.phRange },
    { label: "dGH", value: entry.dghRange },
    { label: "Algae rating", value: `${entry.algaeEaterRating} / 5` },
  ];

  const details = [
    { heading: "Family", body: entry.family },
    { heading: "Diet", body: `${entry.diet}. ${entry.feedingNotes}` },
    { heading: "Breeding", body: entry.breeding },
    { heading: "Shell calcium demand", body: entry.shellCalciumDemand },
    { heading: "Plant safety", body: entry.plantSafe },
    { heading: "Tank mates", body: entry.fishTankSafeWith },
  ];

  return <EntryDetail entry={entry} stats={stats} details={details} />;
}
