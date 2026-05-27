import { findSnail } from "@/data";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Fin & Stem snail profile";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SnailOgImage({ params }: Props) {
  const { slug } = await params;
  const entry = findSnail(slug);
  if (!entry) {
    return renderOgImage({
      eyebrow: "Fin & Stem · Snail",
      title: "Fin & Stem",
      subtitle: "Aquarium snail profile",
    });
  }
  return renderOgImage({
    eyebrow: "Fin & Stem · Snail",
    title: entry.commonName,
    subtitle: entry.scientificName,
    meta: `${entry.adultSize} cm · Min tank ${entry.minTankSize} L · Temp ${entry.tempRange} °C`,
  });
}
