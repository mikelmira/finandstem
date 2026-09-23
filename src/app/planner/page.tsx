import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { PlannerClient } from "@/components/planner/planner-client";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aquarium tank planner: stocking, water and gear",
  description:
    "Plan a planted tank: add fish, plants and shrimp, choose your filter, light, heater and CO2, and we check parameters, stocking and whether the gear fits.",
  alternates: { canonical: `${site.url}/planner` },
};

// Fully static: the whole analysis runs client-side from the URL (see
// PlannerClient), so the page is CDN-served with no per-request function cost.
export default function PlannerPage() {
  return (
    <>
      <PageHero
        eyebrow="Tank Planner"
        title="Build your tank, species by species."
        subtitle="Pick the tank, add the fish, plants and shrimp you're considering, then choose your filter, light, heater and CO2. We cross-reference every parameter, check stocking against best-practice rules, and tell you whether your equipment suits the tank and the plants."
        breadcrumb={[{ label: "Planner" }]}
      />

      <SectionShell>
        <Suspense fallback={<div className="h-96" />}>
          <PlannerClient />
        </Suspense>
      </SectionShell>
    </>
  );
}
