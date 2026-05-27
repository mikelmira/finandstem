import Link from "next/link";
import { ArrowUpRight, Beaker } from "lucide-react";
import type { SubstrateEntry } from "@/types/substrate";
import {
  SUBSTRATE_CATEGORY_LABEL,
  PH_EFFECT_LABEL,
  AMMONIA_RELEASE_LABEL,
} from "@/types/substrate";

interface SubstrateCardProps {
  entry: SubstrateEntry;
}

/**
 * Catalogue-style card for a substrate. Mirrors the rhythm of
 * EntryCard for livestock species but without a hero photo, since
 * substrates are products (bags of soil / sand) and we don't carry
 * product imagery in this collection. The card leads with brand +
 * product name, then a spec strip showing the three numbers
 * aquascapers actually decide on: pH effect, ammonia release,
 * shrimp-safe.
 */
export function SubstrateCard({ entry }: SubstrateCardProps) {
  return (
    <Link
      href={`/substrates/${entry.slug}`}
      className="glass glass-edge lift group relative flex h-full w-full flex-col gap-4 overflow-hidden rounded-2xl p-6 transition-colors duration-300 hover:border-[var(--brand)]/40"
    >
      {/* Stamp row, category + arrow */}
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          <Beaker className="size-3.5 text-[var(--brand)]" />
          {SUBSTRATE_CATEGORY_LABEL[entry.category]}
        </span>
        <ArrowUpRight
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand)]"
          aria-hidden
        />
      </div>

      {/* Title block */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand)]">
          {entry.brand}
        </p>
        <h3 className="text-display-tight text-xl leading-snug sm:text-2xl">
          {entry.name}
        </h3>
      </div>

      {/* Spec strip */}
      <dl className="mt-1 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border/50 pt-4 text-xs">
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            pH effect
          </dt>
          <dd className="mt-0.5 font-medium text-foreground">
            {PH_EFFECT_LABEL[entry.phEffect]}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Ammonia
          </dt>
          <dd className="mt-0.5 font-medium text-foreground">
            {AMMONIA_RELEASE_LABEL[entry.ammoniaRelease]}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Grain
          </dt>
          <dd className="mt-0.5 font-medium text-foreground">
            {entry.grainSize}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Shrimp-safe
          </dt>
          <dd className="mt-0.5 font-medium text-foreground">
            {entry.shrimpSafe ? "Yes" : "No"}
          </dd>
        </div>
      </dl>

      {/* Care summary */}
      <p className="line-clamp-3 text-sm leading-relaxed text-foreground/80">
        {entry.careSummary}
      </p>
    </Link>
  );
}
