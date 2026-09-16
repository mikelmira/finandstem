import type { Metadata } from "next";
import Link from "next/link";
import { geoNaturalEarth1, geoPath, geoGraticule10 } from "d3-geo";
import { feature } from "topojson-client";
import worldData from "world-atlas/countries-110m.json";
import type { FeatureCollection, Geometry } from "geojson";
import type { Topology, GeometryCollection } from "topojson-specification";

import { site } from "@/lib/site";
import { organizationRef } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { SpeciesMap, type MapPin } from "@/components/map/species-map";
import { regionsWithSpecies } from "@/lib/catalogue/species-index";

const PAGE_URL = `${site.url}/species-map`;
const WIDTH = 800;
const HEIGHT = 410;

const projection = geoNaturalEarth1()
  .scale(155)
  .translate([WIDTH / 2, HEIGHT / 2 + 4]);
const pathGen = geoPath(projection);

const topo = worldData as unknown as Topology<{ countries: GeometryCollection }>;
const countries = feature(
  topo,
  topo.objects.countries,
) as unknown as FeatureCollection<Geometry>;
const countriesPath = pathGen(countries) ?? "";
const graticulePath = pathGen(geoGraticule10()) ?? "";

function buildPins(): MapPin[] {
  return regionsWithSpecies()
    .map((rw) => {
      const xy = projection(rw.region.coords);
      if (!xy) return null;
      return {
        id: rw.region.id,
        label: rw.region.label,
        x: xy[0],
        y: xy[1],
        count: rw.species.length,
        species: rw.species.map((s) => ({
          slug: s.slug,
          category: s.category,
          categoryLabel: s.categoryLabel,
          commonName: s.commonName,
          scientificName: s.scientificName,
          href: s.href,
          image: s.image,
        })),
      } satisfies MapPin;
    })
    .filter((p): p is MapPin => p !== null);
}

export const metadata: Metadata = {
  title: "Aquarium Species World Map: Where Fish & Plants Come From",
  description:
    "An interactive world map of aquarium species origins. Pan the globe, click a region, and see which fish, plants, shrimp and snails come from that part of the world.",
  alternates: { canonical: PAGE_URL },
};

export default function SpeciesMapPage() {
  const pins = buildPins();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "@id": `${PAGE_URL}#app`,
              name: "Aquarium Species World Map",
              url: PAGE_URL,
              applicationCategory: "ReferenceApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              description:
                "Interactive world map of aquarium species origins. Click a region to see the fish, plants, shrimp and snails native to it.",
              publisher: organizationRef(),
              inLanguage: "en",
            },
          ],
        }}
        id="species-map-jsonld"
      />

      <PageHero
        eyebrow="Species world map"
        title="Where do aquarium species come from?"
        subtitle="Every fish, plant, shrimp and snail in the catalogue, mapped to its native waters. Drag to explore, scroll or pinch to zoom, and click a pin to see everything from that region, perfect for planning a biotope tank."
        breadcrumb={[{ label: "Species map" }]}
      />

      <SectionShell>
        <SpeciesMap
          width={WIDTH}
          height={HEIGHT}
          countriesPath={countriesPath}
          graticulePath={graticulePath}
          pins={pins}
        />

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Building a biotope? Use the{" "}
          <Link href="/species-finder" className="font-medium text-foreground underline decoration-[var(--brand)]/40 underline-offset-4 hover:text-[var(--brand)]">
            species finder
          </Link>{" "}
          to filter by water and region, then check compatibility in the{" "}
          <Link href="/planner" className="font-medium text-foreground underline decoration-[var(--brand)]/40 underline-offset-4 hover:text-[var(--brand)]">
            tank planner
          </Link>
          . For the water itself, see the{" "}
          <Link href="/water-chemistry" className="font-medium text-foreground underline decoration-[var(--brand)]/40 underline-offset-4 hover:text-[var(--brand)]">
            water chemistry guide
          </Link>{" "}
          and{" "}
          <Link href="/guides/blackwater-aquarium-guide" className="font-medium text-foreground underline decoration-[var(--brand)]/40 underline-offset-4 hover:text-[var(--brand)]">
            blackwater aquariums
          </Link>
          .
        </p>
      </SectionShell>
    </>
  );
}
