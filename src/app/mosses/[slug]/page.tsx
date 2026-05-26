import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mosses, findMoss } from "@/data";
import { EntryDetail } from "@/components/catalogue/entry-detail";
import type { Stat } from "@/components/catalogue/stat-grid";
import { speciesMetadata } from "@/lib/species-metadata";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return mosses.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const entry = findMoss(slug);
  if (!entry) return {};
  return speciesMetadata(entry);
}

export default async function MossDetailPage({ params }: RouteParams) {
  const { slug } = await params;
  const entry = findMoss(slug);
  if (!entry) notFound();

  const stats: ReadonlyArray<Stat> = [
    { label: "Type", value: entry.type },
    { label: "Growth rate", value: entry.growthRate },
    { label: "Light", value: entry.light },
    { label: "CO₂", value: entry.co2 },
    { label: "Temperature", value: `${entry.tempRange} °C` },
    { label: "pH", value: entry.phRange },
  ];

  const details = [
    { heading: "Family", body: entry.family },
    { heading: "Attachment", body: entry.attachment },
    { heading: "Typical use", body: entry.typicalUse },
    { heading: "Trimming", body: entry.trimming },
  ];

  return <EntryDetail entry={entry} stats={stats} details={details} />;
}
