import { findMoss } from "@/data";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Fin & Stem moss profile";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function MossOgImage({ params }: Props) {
  const { slug } = await params;
  const entry = findMoss(slug);
  if (!entry) {
    return renderOgImage({
      eyebrow: "Fin & Stem · Moss",
      title: "Fin & Stem",
      subtitle: "Aquatic moss profile",
    });
  }
  return renderOgImage({
    eyebrow: "Fin & Stem · Moss",
    title: entry.commonName,
    subtitle: entry.scientificName,
    meta: `${entry.typicalUse} · Light ${entry.light} · CO₂ ${entry.co2}`,
  });
}
