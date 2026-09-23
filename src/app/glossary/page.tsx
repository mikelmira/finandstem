import type { Metadata } from "next";
import Link from "next/link";

import { site } from "@/lib/site";
import { breadcrumbsJsonLd, organizationRef } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";

const PAGE_PATH = "/glossary";
const PAGE_URL = `${site.url}${PAGE_PATH}`;

export const metadata: Metadata = {
  title: "Aquascaping Glossary: Aquarium and Planted-Tank Terms Explained",
  description:
    "Plain-English definitions of the aquascaping and planted-aquarium terms you'll meet, from aquasoil and biofilm to Iwagumi, KH and the nitrogen cycle.",
  alternates: { canonical: PAGE_URL },
};

interface Term {
  term: string;
  def: string;
  href?: string;
}

const TERMS: Term[] = [
  { term: "Aquascaping", def: "The craft of arranging plants, stone, wood and substrate into a designed underwater landscape, not just a stocked tank.", href: "/aquascaping-design" },
  { term: "Aquasoil", def: "An active, nutrient-rich soil substrate that feeds plant roots and gently softens and acidifies the water for the first year or so.", href: "/substrates" },
  { term: "Ammonia (NH₃)", def: "The first and most toxic nitrogen waste from fish and rotting food. Should read zero in a cycled tank.", href: "/aquarium-cycling" },
  { term: "Biofilm", def: "The thin, natural layer of microbes and bacteria that coats surfaces in a tank. Food for shrimp and fry, and a sign of a maturing tank.", href: "/guides/cherry-shrimp-care-guide" },
  { term: "Biotope", def: "A layout that faithfully recreates one real habitat, using only the species, hardscape and water that place would actually have.", href: "/aquascaping-design" },
  { term: "Blackwater", def: "Soft, acidic, tea-stained water created by tannins from wood and leaf litter, mimicking Amazon and Southeast Asian streams.", href: "/guides/blackwater-aquarium-guide" },
  { term: "Bioload", def: "The total waste your livestock produces, which the biofilter and plants must process. Overstocking raises it past what the tank can handle.", href: "/guides/how-many-fish-in-a-tank" },
  { term: "Caridina", def: "A genus of shrimp, including crystal and bee shrimp, that wants soft, acidic, low-mineral water. Fussier than neocaridina.", href: "/guides/neocaridina-vs-caridina-shrimp" },
  { term: "Carpet plant", def: "A low, spreading plant grown to cover the foreground like a lawn, such as Monte Carlo or dwarf hairgrass.", href: "/guides/how-to-grow-aquarium-carpet" },
  { term: "CO₂ injection", def: "Adding carbon dioxide gas to the water so plants can photosynthesise faster. The biggest lever in a high-tech planted tank.", href: "/equipment/co2-injection" },
  { term: "Cycling", def: "Growing the bacteria that turn toxic ammonia into nitrite and then into far less toxic nitrate, before adding livestock.", href: "/aquarium-cycling" },
  { term: "Deficiency", def: "A plant symptom, such as yellowing or pinholes, caused by a shortage of a specific nutrient like nitrogen, iron or potassium.", href: "/deficiencies" },
  { term: "Dosing", def: "Adding fertiliser to the water on a schedule to supply the nutrients plants need beyond what the substrate and fish provide.", href: "/calculators/fertiliser-dosing" },
  { term: "Drop checker", def: "A small glass indicator with a coloured solution that shows, by turning lime green, whether CO₂ is at a good level.", href: "/equipment/co2-injection" },
  { term: "Dry start", def: "Growing carpet plants emersed (out of water) in a humid, shallow-filled tank before flooding it, to establish them faster.", href: "/guides/how-to-grow-aquarium-carpet" },
  { term: "Emersed", def: "Grown with leaves above the waterline, in humid air rather than submerged. Many aquarium plants are farmed this way.", href: "/guides/why-are-my-aquarium-plants-melting" },
  { term: "Epiphyte", def: "A plant like anubias or java fern that attaches to wood or rock rather than rooting in substrate. Its rhizome must stay uncovered.", href: "/guides/attaching-plants-to-driftwood-and-rock" },
  { term: "Estimative Index (EI)", def: "A dosing method that supplies generous, non-limiting nutrients and resets with a large weekly water change.", href: "/calculators/fertiliser-dosing" },
  { term: "GH (general hardness)", def: "The dissolved calcium and magnesium in the water, the minerals plants and shrimp need. Measured in dGH.", href: "/water-chemistry" },
  { term: "Hardscape", def: "The non-living structure of a scape: stone, wood and the way they're arranged.", href: "/hardscape" },
  { term: "Ich (white spot)", def: "A common parasite that appears as salt-like white spots on fish, usually after a chill or stress.", href: "/diseases/ich" },
  { term: "Iwagumi", def: "A minimalist style using only stone (no wood) over a single carpeting plant, where all the drama is in rock placement.", href: "/aquascaping-design" },
  { term: "KH (carbonate hardness)", def: "The carbonate buffer that keeps pH stable. Low KH means an unstable pH that can crash overnight.", href: "/water-chemistry" },
  { term: "Melt", def: "When a plant, often a crypt, sheds its leaves after being moved or after a parameter change, then regrows from the roots.", href: "/guides/why-are-my-aquarium-plants-melting" },
  { term: "Molt", def: "How shrimp grow, shedding the old shell for a new one. Failed molts point to a general-hardness or mineral problem.", href: "/diseases/shrimp-failed-molt" },
  { term: "Neocaridina", def: "A genus of hardy shrimp, including cherry shrimp, that tolerates a wide range of harder, neutral water. The beginner's shrimp.", href: "/guides/neocaridina-vs-caridina-shrimp" },
  { term: "Nitrate (NO₃⁻)", def: "The least toxic end of the nitrogen cycle, removed by water changes and taken up by plants. A stress and algae driver when high.", href: "/aquarium-cycling" },
  { term: "Nitrite (NO₂⁻)", def: "The toxic middle stage of the nitrogen cycle. Should read zero in a cycled tank.", href: "/aquarium-cycling" },
  { term: "Nitrogen cycle", def: "The bacterial process that converts ammonia to nitrite to nitrate, making a tank safe for fish.", href: "/aquarium-cycling" },
  { term: "PAR", def: "Photosynthetically active radiation, a measure of the usable light reaching your plants. It drives how demanding a plant you can grow.", href: "/equipment/lighting" },
  { term: "Photoperiod", def: "How long the lights are on each day. Too long or too bright for the plant mass invites algae.", href: "/equipment/lighting" },
  { term: "pH", def: "How acidic or alkaline the water is. Stability matters more than hitting an exact number.", href: "/water-chemistry" },
  { term: "Remineraliser", def: "A product that adds calcium, magnesium and other minerals back into RO water to a target GH, for plants and shrimp.", href: "/water-chemistry" },
  { term: "Rhizome", def: "The horizontal stem of epiphytes like anubias and ferns, from which leaves and roots grow. It must not be buried.", href: "/guides/attaching-plants-to-driftwood-and-rock" },
  { term: "RO / RODI water", def: "Reverse-osmosis water stripped of minerals, used as a blank slate to build soft or precisely controlled water.", href: "/water-chemistry" },
  { term: "Root tabs", def: "Nutrient capsules pushed into inert substrate to feed heavy root feeders like swords and crypts.", href: "/substrates" },
  { term: "Rule of thirds", def: "A composition guide: place the focal point on a line a third of the way across, not centred, for a more natural layout.", href: "/aquascaping-design" },
  { term: "Silent cycle", def: "Cycling a heavily planted tank where fast plants absorb ammonia directly, so the toxic spike barely shows.", href: "/aquarium-cycling" },
  { term: "Stem plant", def: "A fast-growing plant grown from cut stems, replanted and trimmed to shape. The backbone of Dutch and background planting.", href: "/guides/how-to-trim-and-propagate-aquarium-plants" },
  { term: "Substrate", def: "The material on the tank floor, from inert sand and gravel to active aquasoil, that anchors plants and shapes water chemistry.", href: "/substrates" },
  { term: "Tannins", def: "Compounds leached by wood and leaves that tint water amber, soften it slightly and lower pH. Harmless and often desirable.", href: "/guides/blackwater-aquarium-guide" },
  { term: "TDS", def: "Total dissolved solids, a rough ppm measure of everything dissolved in the water. Useful for tracking shrimp-tank stability.", href: "/water-chemistry" },
  { term: "Walstad method", def: "A low-tech approach using soil and heavy planting to balance a tank with no CO₂ and minimal filtration.", href: "/guides/low-tech-vs-high-tech-planted-tank" },
  { term: "Water column", def: "The open water between substrate and surface, and where in it a fish or plant lives or feeds (top, middle, bottom).", href: "/fish" },
];

export default function GlossaryPage() {
  const sorted = [...TERMS].sort((a, b) => a.term.localeCompare(b.term));
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "DefinedTermSet",
              "@id": `${PAGE_URL}#glossary`,
              name: "Aquascaping Glossary",
              url: PAGE_URL,
              publisher: organizationRef(),
              inLanguage: "en",
              hasDefinedTerm: sorted.map((t) => ({
                "@type": "DefinedTerm",
                name: t.term,
                description: t.def,
                inDefinedTermSet: `${PAGE_URL}#glossary`,
              })),
            },
            breadcrumbsJsonLd(
              [
                { name: "Home", href: "/" },
                { name: "Glossary" },
              ],
              PAGE_URL,
            ),
          ],
        }}
        id="glossary-jsonld"
      />

      <PageHero
        eyebrow="Glossary"
        title="Aquascaping terms, in plain English"
        subtitle="Every bit of jargon you'll meet in the hobby, defined simply. Where a term has a full guide, the definition links to it."
        breadcrumb={[{ label: "Glossary" }]}
      />

      <SectionShell>
        <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {sorted.map((t) => (
            <div key={t.term} className="border-t border-border/60 pt-4">
              <dt className="font-medium text-foreground">
                {t.href ? (
                  <Link
                    href={t.href}
                    className="underline decoration-[var(--brand)]/40 underline-offset-4 transition-colors hover:text-[var(--brand)]"
                  >
                    {t.term}
                  </Link>
                ) : (
                  t.term
                )}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {t.def}
              </dd>
            </div>
          ))}
        </dl>
      </SectionShell>
    </>
  );
}
