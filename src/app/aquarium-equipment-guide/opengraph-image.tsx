import { findPillar } from "@/lib/pillars";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Fin & Stem, Aquarium Equipment Guide";

export default function OgImage() {
  const pillar = findPillar("aquarium-equipment-guide");
  return renderOgImage({
    eyebrow: "Fin & Stem · Pillar Guide",
    title: pillar?.title ?? "Aquarium Equipment",
    subtitle: "Lighting · filtration · CO₂ · heating",
    meta: "How to size and choose every component",
  });
}
