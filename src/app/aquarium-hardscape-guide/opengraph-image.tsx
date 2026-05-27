import { findPillar } from "@/lib/pillars";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Fin & Stem — Aquarium Hardscape Guide";

export default function OgImage() {
  const pillar = findPillar("aquarium-hardscape-guide");
  return renderOgImage({
    eyebrow: "Fin & Stem · Pillar Guide",
    title: pillar?.title ?? "Aquarium Hardscape",
    subtitle: "Stones, wood, and substrate",
    meta: "Chemistry · selection · scaping principles",
  });
}
