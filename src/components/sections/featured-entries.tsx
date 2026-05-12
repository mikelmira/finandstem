import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionShell, SectionHeading } from "@/components/sections/section-shell";
import { EntryCard } from "@/components/catalogue/entry-card";
import { fish, plants, shrimp, mosses } from "@/data";

export function FeaturedEntries() {
  // One signature entry from each pillar
  const featured = [
    fish.find((f) => f.slug === "chili-rasbora") ?? fish[0],
    plants.find((p) => p.slug === "anubias-nana") ?? plants[0],
    shrimp.find((s) => s.slug === "cherry-shrimp") ?? shrimp[0],
    mosses.find((m) => m.slug === "java-moss") ?? mosses[0],
  ];

  return (
    <SectionShell className="relative isolate border-t border-border/60">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Start here"
          title="Beginner-friendly classics."
          subtitle="Five species that almost always work in a first planted tank. Click through to the full profile."
        />
        <Link
          href="/fish"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/50"
        >
          Browse all 40
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((e) => (
          <EntryCard key={`${e.category}-${e.slug}`} entry={e} />
        ))}
      </div>
    </SectionShell>
  );
}
