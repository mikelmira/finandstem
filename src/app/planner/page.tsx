import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { PlannerForm } from "@/components/planner/planner-form";
import { PlanResult } from "@/components/planner/plan-result";
import {
  buildTankPlan,
  type Style,
  type Experience,
} from "@/lib/catalogue/tank-plan";

export const metadata: Metadata = {
  title: "Tank Planner",
  description:
    "Tell us your tank size, style, and experience level — we'll suggest a stocking plan from the Fin & Stem catalogue that actually fits together. Fish, plants, shrimp, and moss picks cross-referenced for compatibility.",
};

const VALID_STYLES: Style[] = [
  "low-tech",
  "high-tech",
  "community",
  "shrimp",
  "biotope-amazon",
  "biotope-asian",
];

const VALID_EXPERIENCE: Experience[] = ["beginner", "intermediate", "advanced"];

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function PlannerPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const tankParam = Number(first(sp.tank));
  const tankL = Number.isFinite(tankParam) && tankParam >= 10 ? tankParam : 60;

  const styleParam = first(sp.style) as Style | undefined;
  const style: Style =
    styleParam && VALID_STYLES.includes(styleParam) ? styleParam : "community";

  const expParam = first(sp.experience) as Experience | undefined;
  const experience: Experience =
    expParam && VALID_EXPERIENCE.includes(expParam) ? expParam : "beginner";

  // Only render results if the user has submitted (recognised by the
  // tank query param being explicitly present).
  const hasSubmitted = first(sp.tank) !== undefined;
  const plan = hasSubmitted
    ? buildTankPlan({ tankL, style, experience })
    : null;

  return (
    <>
      <PageHero
        eyebrow="Tank Planner"
        title="Help me plan a tank."
        subtitle="Tell us the tank size, the style you're going for, and how confident you are. We'll cross-reference the catalogue and suggest a stocking plan that actually fits together — fish, plants, shrimp, and moss that share water, temperament, and compatibility."
      />

      <SectionShell>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-10">
          {/* Left — form */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Suspense fallback={null}>
              <PlannerForm
                initial={{ tankL, style, experience }}
              />
            </Suspense>
          </div>

          {/* Right — result */}
          <div>
            {plan ? (
              <PlanResult plan={plan} />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </SectionShell>
    </>
  );
}

function EmptyState() {
  return (
    <div className="glass glass-edge animate-rise flex flex-col items-start gap-4 rounded-2xl p-8 sm:p-10">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
        Ready when you are
      </span>
      <h2 className="text-display-tight text-2xl sm:text-3xl">
        Pick a size, style, and experience level
      </h2>
      <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
        We&rsquo;ll cross-reference 88 catalogued species to recommend a
        complete stocking plan — schooler, centrepiece, bottom dweller,
        algae crew, foreground / midground / background plants, a floater,
        plus shrimp and moss. Every pick links to its full profile.
      </p>
      <ul className="grid grid-cols-1 gap-2 text-sm text-foreground/85 sm:grid-cols-2">
        <li className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[var(--brand)]" aria-hidden />
          Tank-size aware — won&rsquo;t suggest a pleco for a 20 L
        </li>
        <li className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[var(--brand)]" aria-hidden />
          Difficulty-capped to your experience
        </li>
        <li className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[var(--brand)]" aria-hidden />
          Biotope-aware origin filtering
        </li>
        <li className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[var(--brand)]" aria-hidden />
          Plant- and shrimp-safety enforced
        </li>
      </ul>
    </div>
  );
}
