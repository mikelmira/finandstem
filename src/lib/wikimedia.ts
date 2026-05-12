import type { GalleryImage } from "@/data/image-gallery";

const TAG_RE = /<[^>]*>/g;
const WS_RE = /\s+/g;

export function stripHtml(input: string | undefined | null): string {
  if (!input) return "";
  return input
    .replace(TAG_RE, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(WS_RE, " ")
    .trim();
}

export function cleanAuthor(input: string | undefined | null): string {
  const text = stripHtml(input);
  return text || "Unknown";
}

export interface PreparedImage {
  url: string;
  descriptionUrl: string;
  fileTitle: string;
  license: string;
  licenseUrl: string;
  author: string;
  authorRaw: string;
  alt: string;
  attributionRequired: boolean;
}

export function prepareImage(
  img: GalleryImage,
  commonName: string,
  scientificName: string,
): PreparedImage {
  return {
    url: img.url,
    descriptionUrl: img.descriptionUrl,
    fileTitle: img.fileTitle,
    license: img.license,
    licenseUrl: img.licenseUrl,
    author: cleanAuthor(img.author),
    authorRaw: img.author,
    alt: `${commonName} (${scientificName})`,
    attributionRequired: img.attributionRequired,
  };
}
