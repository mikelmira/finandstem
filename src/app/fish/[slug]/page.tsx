import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fish, findFish } from "@/data";
import { EntryDetail } from "@/components/catalogue/entry-detail";
import type { Stat } from "@/components/catalogue/stat-grid";
import { speciesMetadata } from "@/lib/species-metadata";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return fish.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const entry = findFish(slug);
  if (!entry) return {};
  return speciesMetadata(entry);
}

export default async function FishDetailPage({ params }: RouteParams) {
  const { slug } = await params;
  const entry = findFish(slug);
  if (!entry) notFound();

  const stats: ReadonlyArray<Stat> = [
    { label: "Adult size", value: entry.adultSize },
    { label: "Min tank", value: entry.minTankSize },
    { label: "Min group", value: `${entry.minGroupSize}+` },
    { label: "Water column", value: entry.waterColumn },
    { label: "Temperature", value: `${entry.tempRange} °C` },
    { label: "pH", value: entry.phRange },
    { label: "Hardness", value: `${entry.dghRange} dGH` },
    { label: "Lifespan", value: `${entry.lifespan} yrs` },
  ];

  const details = [
    { heading: "Family", body: entry.family },
    { heading: "Temperament", body: entry.temperament },
    { heading: "Schooling", body: entry.schooling },
    { heading: "Diet", body: entry.diet },
    { heading: "Feeding", body: entry.feedingNotes },
    { heading: "Breeding difficulty", body: entry.breedingDifficulty },
  ];

  const pairings = [
    { label: "Plant safe", value: entry.plantSafe },
    { label: "Shrimp safe", value: entry.shrimpSafe },
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
