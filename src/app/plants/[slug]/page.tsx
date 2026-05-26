import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { plants, findPlant } from "@/data";
import { EntryDetail } from "@/components/catalogue/entry-detail";
import type { Stat } from "@/components/catalogue/stat-grid";
import { speciesMetadata } from "@/lib/species-metadata";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return plants.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const entry = findPlant(slug);
  if (!entry) return {};
  return speciesMetadata(entry);
}

export default async function PlantDetailPage({ params }: RouteParams) {
  const { slug } = await params;
  const entry = findPlant(slug);
  if (!entry) notFound();

  const stats: ReadonlyArray<Stat> = [
    { label: "Type", value: entry.plantType },
    { label: "Position", value: entry.position },
    { label: "Max height", value: `${entry.maxHeight} cm` },
    { label: "Growth rate", value: entry.growthRate },
    { label: "Light", value: entry.light },
    { label: "CO₂", value: entry.co2 },
    { label: "Temperature", value: `${entry.tempRange} °C` },
    { label: "pH", value: entry.phRange },
    { label: "Hardness", value: `${entry.dghRange} dGH` },
  ];

  const details = [
    { heading: "Family", body: entry.family },
    { heading: "Substrate", body: entry.substrate },
    { heading: "Propagation", body: entry.propagation },
  ];

  return (
    <EntryDetail entry={entry} stats={stats} details={details} />
  );
}
