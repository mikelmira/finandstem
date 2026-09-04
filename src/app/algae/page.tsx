import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { JsonLd } from "@/components/seo/json-ld";
import {
  AlgaeIdentifier,
  type AlgaeCard,
} from "@/components/algae/algae-identifier";
import { ALGAE } from "@/data/algae";
import { site } from "@/lib/site";
import { organizationRef } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Aquarium Algae ID: Identify and Fix Every Type",
  description:
    "Not sure what algae you've got? Pick the colour, texture and where it's growing to identify it, then get the fix that actually works, and the clean-up crew that helps.",
  alternates: { canonical: `${site.url}/algae` },
};

const ITEMS: AlgaeCard[] = ALGAE.map((a) => ({
  slug: a.slug,
  name: a.name,
  spot: a.spot,
  color: a.color,
  forms: a.forms,
  locations: a.locations,
  severity: a.severity,
}));

export default function AlgaeHubPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${site.url}/algae#collection`,
              url: `${site.url}/algae`,
              name: "Aquarium Algae ID",
              description:
                "Identify common aquarium algae by colour, texture and location, with the fix for each type.",
              publisher: organizationRef(),
              inLanguage: "en",
            },
            {
              "@type": "ItemList",
              itemListElement: ALGAE.map((a, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: a.name,
                item: `${site.url}/algae/${a.slug}`,
              })),
            },
          ],
        }}
        id="algae-hub-jsonld"
      />

      <PageHero
        eyebrow="Algae ID"
        title="What algae have you got?"
        subtitle="Green fuzz, black tufts, brown dust, a slimy sheet, they all mean different things and want different fixes. Tell us the colour, the texture and where it's growing, and we'll narrow it down, then give you the fix that works and the clean-up crew that helps."
        breadcrumb={[{ label: "Algae ID" }]}
      />

      <SectionShell>
        <AlgaeIdentifier items={ITEMS} />

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Most algae is a symptom, not a disease. It shows up when light,
          CO<sub>2</sub> and nutrients fall out of step, or when a new tank is
          still settling. Fixing the balance matters more than scrubbing, and a
          good clean-up crew keeps the last of it in check. Each type above links
          to a full fix, including what causes it and which fish, shrimp or
          snails graze it.
        </p>
      </SectionShell>
    </>
  );
}
