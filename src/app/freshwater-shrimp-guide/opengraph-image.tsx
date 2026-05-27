import { findPillar } from "@/lib/pillars";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Fin & Stem — Freshwater Shrimp Guide";

export default function OgImage() {
  const pillar = findPillar("freshwater-shrimp-guide");
  return renderOgImage({
    eyebrow: "Fin & Stem · Pillar Guide",
    title: pillar?.title ?? "Freshwater Shrimp",
    subtitle: "Complete keeping guide",
    meta: "Neocaridina · Caridina · TDS · breeding",
  });
}
