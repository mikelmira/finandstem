import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { PlannerClient } from "@/components/planner/planner-client";

export const metadata: Metadata = {
  title: "Tank Planner",
  description:
    "Build your tank species by species. Add fish, plants, shrimp, and mosses, we cross-reference parameters and flag every compatibility issue.",
};

// Fully static: the whole analysis runs client-side from the URL (see
// PlannerClient), so the page is CDN-served with no per-request function cost.
export default function PlannerPage() {
  return (
    <>
      <PageHero
        eyebrow="Tank Planner"
        title="Build your tank, species by species."
        subtitle="Pick the tank, pick the filter, then add the fish, plants, shrimp, and mosses you're considering. We cross-reference every parameter, check stocking against best-practice rules, and tell you what light, CO₂, and substrate the combined tank actually needs."
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
