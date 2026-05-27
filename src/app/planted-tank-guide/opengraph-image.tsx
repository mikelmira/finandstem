import { findPillar } from "@/lib/pillars";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Fin & Stem — Planted Aquarium Guide";

export default function OgImage() {
  const pillar = findPillar("planted-tank-guide");
  return renderOgImage({
    eyebrow: "Fin & Stem · Pillar Guide",
    title: pillar?.title ?? "The Planted Aquarium",
    subtitle: "Complete reference",
    meta: "Lighting · CO₂ · substrate · dosing · plants",
  });
}
