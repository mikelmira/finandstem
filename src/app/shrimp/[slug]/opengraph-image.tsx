import { findShrimp } from "@/data";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Fin & Stem shrimp profile";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ShrimpOgImage({ params }: Props) {
  const { slug } = await params;
  const entry = findShrimp(slug);
  if (!entry) {
    return renderOgImage({
      eyebrow: "Fin & Stem · Shrimp",
      title: "Fin & Stem",
      subtitle: "Freshwater shrimp profile",
    });
  }
  return renderOgImage({
    eyebrow: "Fin & Stem · Shrimp",
    title: entry.commonName,
    subtitle: entry.scientificName,
    meta: `Min tank ${entry.minTankSize} · ${entry.tempRange} °C · TDS ${entry.tdsRange} ppm`,
  });
}
