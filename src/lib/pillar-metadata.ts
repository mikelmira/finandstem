import type { Metadata } from "next";
import { site } from "@/lib/site";
import type { Pillar } from "@/lib/pillars";

/** Generate page metadata for a pillar route. */
export function pillarMetadata(pillar: Pillar): Metadata {
  const url = `${site.url}${pillar.path}`;
  return {
    title: pillar.title,
    description: pillar.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: site.name,
      title: pillar.title,
      description: pillar.description,
      locale: "en",
      authors: [`${site.url}/about`],
      section: pillar.heroEyebrow,
    },
    twitter: {
      card: "summary_large_image",
      title: pillar.title,
      description: pillar.description,
    },
    other: {
      "article:author": `${site.url}/about`,
    },
  };
}
