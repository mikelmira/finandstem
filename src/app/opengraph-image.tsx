import { site } from "@/lib/site";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${site.name} — ${site.tagline}`;

export default function OgImage() {
  return renderOgImage({
    eyebrow: "Fin & Stem",
    title: "Build the planted tank you imagined.",
    subtitle:
      "A working reference for aquascapers anywhere in the world.",
    meta: "Fish · plants · shrimp · mosses · cross-referenced for compatibility",
  });
}
