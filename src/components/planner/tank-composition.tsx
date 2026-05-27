"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  ImageOff,
  Fish,
  Leaf,
  Minus,
  Plus,
  Shell,
  Sprout,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CATEGORY_META, type CatalogueEntry } from "@/types/catalogue";
import { IMAGE_ATTRIBUTION } from "@/data/image-attribution";
import { cn } from "@/lib/utils";

export interface TankCompositionItem {
  entry: CatalogueEntry;
  /** Currently resolved stocking count for this species. */
  count: number;
  /** Species default count (always 1 — what new species start at). */
  defaultCount: number;
  /** Recommended stocking — schooling fish at their school minimum,
   *  shrimp at colony minimum, plants/mosses at 1. Used to show the
   *  "below school min N" tip while letting users start at 1. */
  recommendedCount: number;
  /** Whether the user has manually picked a count. */
  hasCustomCount: boolean;
}

interface TankCompositionProps {
  items: TankCompositionItem[];
}

const CAT_ICON: Record<CatalogueEntry["category"], LucideIcon> = {
  fish: Fish,
  plants: Leaf,
  shrimp: Shell,
  mosses: Sprout,
};

/** Category pill tones — picked for legibility on the cream
 *  paper ground (darker text, slightly richer fill than the
 *  dark-theme originals). */
const CAT_TONE: Record<CatalogueEntry["category"], string> = {
  fish: "border-sky-500/45 bg-sky-500/15 text-sky-800",
  plants: "border-[var(--brand)]/45 bg-[var(--brand)]/15 text-[var(--brand)]",
  shrimp: "border-rose-500/40 bg-rose-500/12 text-rose-800",
  mosses: "border-emerald-600/40 bg-emerald-600/12 text-emerald-800",
};

/** Categories whose stocking the user can scale up or down. */
const COUNTABLE: Record<CatalogueEntry["category"], boolean> = {
  fish: true,
  shrimp: true,
  plants: true,
  mosses: true,
};

/** What "one count" represents for each category — surfaced in the
 *  picker's helper text so the user knows what they're stocking. */
const COUNT_UNIT: Record<CatalogueEntry["category"], string> = {
  fish: "fish",
  shrimp: "shrimp",
  plants: "bunch/specimen",
  mosses: "portion",
};

export function TankComposition({ items }: TankCompositionProps) {
  const router = useRouter();
  const search = useSearchParams();

  /** Read current ids from URL and rebuild with a modified entry. */
  function updateIds(
    transform: (ids: string[]) => string[],
  ) {
    const sp = new URLSearchParams(search?.toString() ?? "");
    const current = (sp.get("species") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const next = transform(current);
    if (next.length === 0) sp.delete("species");
    else sp.set("species", next.join(","));
    const qs = sp.toString();
    router.replace(qs ? `/planner?${qs}` : "/planner", { scroll: false });
  }

  function remove(category: string, slug: string) {
    updateIds((ids) =>
      ids.filter((id) => {
        const parts = id.split(":");
        return !(parts[0] === category && parts[1] === slug);
      }),
    );
  }

  function setCount(category: string, slug: string, count: number) {
    const clamped = Math.max(1, Math.min(999, Math.round(count)));
    updateIds((ids) =>
      ids.map((id) => {
        const parts = id.split(":");
        if (parts[0] !== category || parts[1] !== slug) return id;
        return `${category}:${slug}:${clamped}`;
      }),
    );
  }

  if (items.length === 0) {
    return (
      <div className="glass rounded-2xl border border-dashed border-border/60 p-8 text-center">
        <p className="text-sm font-medium text-foreground">
          Your tank is empty.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Use the search above to add fish, plants, shrimp, or mosses. As
          soon as anything&rsquo;s in the tank, we&rsquo;ll show the parameters
          and equipment needed to keep it happy.
        </p>
      </div>
    );
  }

  return (
    <ul className="stagger flex flex-col gap-3">
      {items.map((item, i) => {
        const { entry, count, defaultCount, recommendedCount, hasCustomCount } =
          item;
        const meta = CATEGORY_META[entry.category];
        const img = IMAGE_ATTRIBUTION[entry.slug];
        const Icon = CAT_ICON[entry.category];
        const tone = CAT_TONE[entry.category];
        const countable = COUNTABLE[entry.category];

        // Flag when the user is stocked below the species' recommended
        // minimum (school for fish, colony for shrimp).
        const belowRecommended =
          countable && count < recommendedCount && recommendedCount > 1;

        return (
          <li
            key={`${entry.category}-${entry.slug}`}
            style={{ ["--i" as string]: Math.min(i, 8) }}
            className="animate-fade-up glass glass-edge group relative flex gap-3 overflow-hidden rounded-2xl p-3 transition-colors duration-300 hover:border-[var(--brand)]/40"
          >
            <Link
              href={`${meta.path}/${entry.slug}`}
              className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl bg-muted"
              aria-label={`Open ${entry.commonName} profile`}
            >
              {img ? (
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="80px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ImageOff
                    className="size-5 text-muted-foreground/40"
                    aria-hidden
                  />
                </div>
              )}
            </Link>

            <div className="flex min-w-0 flex-1 flex-col gap-1 py-0.5 pr-9">
              <span
                className={cn(
                  "inline-flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]",
                  tone,
                )}
              >
                <Icon className="size-3" strokeWidth={2} aria-hidden />
                {meta.singular}
              </span>
              <Link
                href={`${meta.path}/${entry.slug}`}
                className="truncate text-sm font-semibold leading-tight transition-colors duration-200 hover:text-[var(--brand)]"
              >
                {entry.commonName}
              </Link>
              <span className="truncate text-xs italic text-muted-foreground">
                {entry.scientificName}
              </span>

              {/* Count picker — fish stock at group, shrimp at colony,
                  plants by bunch/specimen, mosses by portion */}
              {countable && (
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="inline-flex items-stretch rounded-full border border-border bg-background/60">
                    <button
                      type="button"
                      onClick={() =>
                        setCount(entry.category, entry.slug, count - 1)
                      }
                      disabled={count <= 1}
                      aria-label={`Decrease ${entry.commonName} count`}
                      className="press flex size-7 items-center justify-center rounded-l-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Minus className="size-3.5" aria-hidden />
                    </button>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={999}
                      value={count}
                      onChange={(e) => {
                        const n = Number(e.target.value);
                        if (!Number.isNaN(n) && n >= 1)
                          setCount(entry.category, entry.slug, n);
                      }}
                      aria-label={`${entry.commonName} count`}
                      className="w-10 border-x border-border/60 bg-transparent px-1 text-center text-xs font-semibold tabular-nums text-foreground [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setCount(entry.category, entry.slug, count + 1)
                      }
                      aria-label={`Increase ${entry.commonName} count`}
                      className="press flex size-7 items-center justify-center rounded-r-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                    >
                      <Plus className="size-3.5" aria-hidden />
                    </button>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-[0.14em]",
                      belowRecommended
                        ? "text-amber-700"
                        : "text-muted-foreground/70",
                    )}
                  >
                    {countLabel({
                      category: entry.category,
                      count,
                      recommendedCount,
                      hasCustomCount,
                      belowRecommended,
                    })}
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => remove(entry.category, entry.slug)}
              aria-label={`Remove ${entry.commonName} from your tank`}
              className="press absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:rotate-90 hover:bg-foreground/5 hover:text-foreground"
            >
              <X className="size-4" aria-hidden />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Pick the helper text that sits under the count picker.
 *   • Fish / shrimp below the species' recommended group get a
 *     coloured "below school min N" / "below colony min N"
 *     callout — visible until the user dials up to the recommended
 *     count. New species start at 1, so this tip fires immediately
 *     for any schooling fish or shrimp.
 *   • Once at or above the recommendation, fish/shrimp show
 *     "recommended N+" so the user knows what's a healthy minimum.
 *   • Plants / mosses read as a unit count ("3 bunches",
 *     "1 portion").
 */
function countLabel(opts: {
  category: CatalogueEntry["category"];
  count: number;
  recommendedCount: number;
  hasCustomCount: boolean;
  belowRecommended: boolean;
}): string {
  const { category, count, recommendedCount, belowRecommended } = opts;
  if (belowRecommended) {
    return category === "fish"
      ? `below school min ${recommendedCount}`
      : `below colony min ${recommendedCount}`;
  }
  if (category === "plants" || category === "mosses") {
    const unit = COUNT_UNIT[category];
    return `${count} × ${unit}${count === 1 ? "" : "s"}`;
  }
  // Fish / shrimp at-or-above the recommended group
  if (recommendedCount > 1) {
    return `${count} stocked · recommended ${recommendedCount}+`;
  }
  return `${count} stocked`;
}
