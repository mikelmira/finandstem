import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SectionShell, SectionHeading } from "@/components/sections/section-shell";
import { EntryCard } from "@/components/catalogue/entry-card";
import { Difficulty } from "@/components/catalogue/difficulty";
import { PillButton } from "@/components/ui/pill-button";
import { fish, plants, shrimp, mosses, getImage } from "@/data";
import { CATEGORY_META, type CatalogueEntry } from "@/types/catalogue";

/**
 * Asymmetric bento — one feature plate on the left + a stacked
 * "field-notes" list on the right. Mirrors the editorial-spread
 * pattern from the reference set rather than the uniform 4-up grid
 * we used before.
 */
export function FeaturedEntries() {
  const featured = fish.find((f) => f.slug === "chili-rasbora") ?? fish[0];
  const sidebar: CatalogueEntry[] = [
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
        <PillButton href="/fish" variant="ghost" size="sm">
          Browse all
        </PillButton>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
        {/* Feature plate — left column, larger card */}
        <div className="lg:col-span-7">
          <EntryCard entry={featured} />
        </div>

        {/* Field-notes list — right column, stacked compact rows */}
        <ul className="flex flex-col gap-4 lg:col-span-5">
          {sidebar.map((e) => (
            <li key={`${e.category}-${e.slug}`} className="h-full">
              <FieldNoteRow entry={e} />
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}

/**
 * Compact horizontal entry — square specimen photo on the left, name
 * + scientific name + meta on the right, hover arrow tucked at the
 * far right. Designed to stack vertically and fill column height.
 */
function FieldNoteRow({ entry }: { entry: CatalogueEntry }) {
  const meta = CATEGORY_META[entry.category];
  const image = getImage(entry.slug);
  return (
    <Link
      href={`${meta.path}/${entry.slug}`}
      className="glass glass-edge lift group relative flex h-full items-stretch overflow-hidden rounded-2xl"
    >
      <div className="relative aspect-square w-32 shrink-0 overflow-hidden sm:w-36">
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="160px"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            {meta.singular}
          </span>
          <ArrowUpRight
            className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand)]"
            aria-hidden
          />
        </div>
        <div>
          <h3 className="text-display-tight text-base leading-tight sm:text-lg">
            {entry.commonName}
          </h3>
          <p className="mt-0.5 text-xs italic text-muted-foreground sm:text-sm">
            {entry.scientificName}
          </p>
        </div>
        <div className="mt-auto pt-2">
          <Difficulty level={entry.difficulty} />
        </div>
      </div>
    </Link>
  );
}
