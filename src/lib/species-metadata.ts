/**
 * Generate Next.js Metadata for a catalogue entry page.
 *
 * Centralises title / description / canonical / OG / Twitter so every fish,
 * plant, shrimp, and moss page emits the same SEO surface without each route
 * re-implementing it.
 */

import type { Metadata } from "next";
import { site } from "@/lib/site";
import { getImage } from "@/data";
import { CATEGORY_META, type CatalogueEntry } from "@/types/catalogue";
import { buildTldr } from "@/lib/species-faq";

/** Trim text to ≤160 chars on a word boundary for meta description. */
function trim(text: string, max = 160): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

export function speciesMetadata(entry: CatalogueEntry): Metadata {
  const meta = CATEGORY_META[entry.category];
  const path = `${meta.path}/${entry.slug}`;
  const canonical = `${site.url}${path}`;

  const headline = `${entry.commonName} (${entry.scientificName}) — Care, Tank Mates & Compatibility`;
  const tldr = buildTldr(entry);
  const description = trim(tldr, 160);

  const image = getImage(entry.slug);
  const ogImage = image
    ? {
        url: image.src.startsWith("http") ? image.src : `${site.url}${image.src}`,
        width: image.width,
        height: image.height,
        alt: image.alt,
      }
    : undefined;

  return {
    title: headline,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: site.name,
      title: headline,
      description,
      locale: "en",
      images: ogImage ? [ogImage] : undefined,
      authors: [`${site.url}/about`],
      publishedTime: "2025-11-01T00:00:00.000Z",
      modifiedTime: "2025-11-01T00:00:00.000Z",
      section: meta.label,
    },
    twitter: {
      card: "summary_large_image",
      title: headline,
      description,
      images: ogImage ? [ogImage.url] : undefined,
    },
    keywords: [
      entry.commonName,
      entry.scientificName,
      `${entry.commonName} care`,
      `${entry.commonName} tank mates`,
      `${entry.commonName} aquarium`,
      `planted tank ${entry.category}`,
    ],
    other: {
      "article:author": `${site.url}/about`,
    },
  };
}
