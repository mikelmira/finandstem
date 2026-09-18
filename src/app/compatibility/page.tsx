import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { CompatibilityClient } from "@/components/compatibility/compatibility-client";
import { JsonLd } from "@/components/seo/json-ld";
import { compatibilityToolJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Compatibility, Plant + Fish + Shrimp + Moss Cross-Reference",
  description:
    "Cross-reference fish, plants, shrimp, and mosses by water-parameter overlap and tank-mate safety. Pick any species, see what else fits the same tank.",
  alternates: { canonical: `${site.url}/compatibility` },
  openGraph: {
    type: "website",
    url: `${site.url}/compatibility`,
    title: "Compatibility cross-reference",
    description:
      "Pick a fish, plant, shrimp, or moss, see what's compatible across all four categories by parameter overlap and safety flags.",
  },
};

// Fully static: the cross-reference is computed client-side from the URL anchor
// (see CompatibilityClient), so the page is CDN-served with no function cost.
export default function CompatibilityPage() {
  return (
    <>
      <JsonLd data={compatibilityToolJsonLd()} id="compat-jsonld" />
      <PageHero
        eyebrow="Compatibility"
        title="What else fits this tank?"
        subtitle="Pick any fish, plant, shrimp, or moss. We cross-reference temperature, pH, hardness, and tank-mate safety to show what works alongside it. Built to help aquascapers anywhere plan a tank that actually holds together."
        breadcrumb={[{ label: "Compatibility" }]}
      />
      <SectionShell>
        <Suspense fallback={<PickerFallback />}>
          <CompatibilityClient />
        </Suspense>
      </SectionShell>
    </>
  );
}

function PickerFallback() {
  return (
    <div className="glass glass-edge mb-10 rounded-2xl p-5 sm:p-6">
      <div className="h-12 animate-pulse rounded-xl bg-muted/60" />
    </div>
  );
}
