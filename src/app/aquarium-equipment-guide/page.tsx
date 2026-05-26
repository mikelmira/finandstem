import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PillarPage } from "@/components/pillar/pillar-page";
import { findPillar } from "@/lib/pillars";
import { pillarMetadata } from "@/lib/pillar-metadata";

const SLUG = "aquarium-equipment-guide";

export function generateMetadata(): Metadata {
  const pillar = findPillar(SLUG);
  return pillar ? pillarMetadata(pillar) : {};
}

export default function Page() {
  const pillar = findPillar(SLUG);
  if (!pillar) notFound();
  return <PillarPage pillar={pillar} />;
}
