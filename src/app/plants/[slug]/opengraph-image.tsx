import { findPlant } from "@/data";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Fin & Stem plant profile";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PlantOgImage({ params }: Props) {
  const { slug } = await params;
  const entry = findPlant(slug);
  if (!entry) {
    return renderOgImage({
      eyebrow: "Fin & Stem · Plant",
      title: "Fin & Stem",
      subtitle: "Planted-aquarium plant profile",
    });
  }
  return renderOgImage({
    eyebrow: "Fin & Stem · Plant",
    title: entry.commonName,
    subtitle: entry.scientificName,
    meta: `${entry.position} · Light ${entry.light} · CO₂ ${entry.co2}`,
  });
}
