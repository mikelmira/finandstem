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
import { getEntryDates } from "@/data/timestamps";

/** Trim text to ≤155 chars on a word boundary for meta description.
 *  Some audit tools (Semrush, Sitechecker) flag descriptions over 155
 *  as truncated, so this is the safer cap. */
function trim(text: string, max = 155): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

/**
 * Normalise a name for redundancy comparison: lowercase, drop infraspecific
 * rank markers (var. / ssp. / sp. / cf.), quotes, parens and other
 * punctuation, collapse whitespace. Lets "Anubias barteri var. nana" and the
 * common name "Anubias Barteri Nana" compare equal.
 */
function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b(var|ssp|subsp|sp|cf)\.?\b/g, " ")
    .replace(/[“”"'‘’()]/g, " ")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function speciesMetadata(entry: CatalogueEntry): Metadata {
  const meta = CATEGORY_META[entry.category];
  const path = `${meta.path}/${entry.slug}`;
  const canonical = `${site.url}${path}`;

  // Show the scientific name in the <title> only when it is a distinct search
  // term (e.g. fish: "Neon Tetra (Paracheirodon innesi)"). For entries whose
  // common name already *is* the binomial (most plants, e.g. "Bacopa
  // Caroliniana"), repeating it just truncates the title, so drop it — the
  // scientific name still lives in the H1, description, body and keywords.
  const sciRedundant =
    normalizeName(entry.commonName) === normalizeName(entry.scientificName);
  const namePart = sciRedundant
    ? entry.commonName
    : `${entry.commonName} (${entry.scientificName})`;
  const headline = `${namePart} Care & Tank Mates`;
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
  const { publishedAt, updatedAt } = getEntryDates(entry.slug);

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
      publishedTime: publishedAt,
      modifiedTime: updatedAt,
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
