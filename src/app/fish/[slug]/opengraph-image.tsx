import { findFish } from "@/data";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Fin & Stem fish profile";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function FishOgImage({ params }: Props) {
  const { slug } = await params;
  const entry = findFish(slug);
  if (!entry) {
    return renderOgImage({
      eyebrow: "Fin & Stem · Fish",
      title: "Fin & Stem",
      subtitle: "Planted-tank fish profile",
    });
  }
  return renderOgImage({
    eyebrow: "Fin & Stem · Fish",
    title: entry.commonName,
    subtitle: entry.scientificName,
    meta: `Min tank ${entry.minTankSize} · ${entry.tempRange} °C · pH ${entry.phRange}`,
  });
}
