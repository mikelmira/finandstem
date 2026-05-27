import { findPillar } from "@/lib/pillars";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Fin & Stem, Aquarium Fish Guide";

export default function OgImage() {
  const pillar = findPillar("aquarium-fish-guide");
  return renderOgImage({
    eyebrow: "Fin & Stem · Pillar Guide",
    title: pillar?.title ?? "Aquarium Fish for the Planted Tank",
    subtitle: "Complete reference",
    meta: "Schoolers · centrepieces · parameters · safety",
  });
}
