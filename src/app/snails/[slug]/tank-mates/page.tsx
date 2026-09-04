import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { snails } from "@/data";
import { findNorm } from "@/lib/catalogue/normalize";
import { site } from "@/lib/site";
import {
  tankMatesTitle,
  tankMatesDescription,
} from "@/lib/catalogue/tank-mates";
import { TankMatesPageBody } from "@/components/catalogue/tank-mates-page";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return snails.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const anchor = findNorm("snails", slug);
  if (!anchor) return {};
  const title = tankMatesTitle(anchor);
  const description = tankMatesDescription(anchor);
  const canonical = `${site.url}/snails/${slug}/tank-mates`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: site.name,
      title,
      description,
      locale: "en",
      authors: [`${site.url}/about`],
    },
    twitter: { card: "summary_large_image", title, description },
    keywords: [
      `${anchor.commonName} tank mates`,
      `${anchor.commonName} compatibility`,
      `what can live with ${anchor.commonName}`,
      anchor.commonName,
      anchor.scientificName,
    ],
    other: { "article:author": `${site.url}/about` },
  };
}

export default async function SnailTankMatesPage({ params }: RouteParams) {
  const { slug } = await params;
  const anchor = findNorm("snails", slug);
  if (!anchor) notFound();
  return <TankMatesPageBody anchor={anchor} />;
}
