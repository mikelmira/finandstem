import { findPillar } from "@/lib/pillars";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Fin & Stem — Aquatic Moss Guide";

export default function OgImage() {
  const pillar = findPillar("aquatic-moss-guide");
  return renderOgImage({
    eyebrow: "Fin & Stem · Pillar Guide",
    title: pillar?.title ?? "Aquatic Mosses",
    subtitle: "Complete aquascaping guide",
    meta: "Attachment · trimming · biofilm · scape detail",
  });
}
