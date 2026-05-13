"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  ImageOff,
  Fish,
  Leaf,
  Shell,
  Sprout,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CATEGORY_META, type CatalogueEntry } from "@/types/catalogue";
import { getImage } from "@/data";
import { cn } from "@/lib/utils";

interface TankCompositionProps {
  entries: CatalogueEntry[];
}

const CAT_ICON: Record<CatalogueEntry["category"], LucideIcon> = {
  fish: Fish,
  plants: Leaf,
  shrimp: Shell,
  mosses: Sprout,
};

const CAT_TONE: Record<CatalogueEntry["category"], string> = {
  fish: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  plants: "border-[var(--brand)]/40 bg-[var(--brand)]/12 text-foreground",
  shrimp: "border-rose-400/35 bg-rose-400/10 text-rose-200",
  mosses: "border-emerald-400/35 bg-emerald-400/10 text-emerald-200",
};

export function TankComposition({ entries }: TankCompositionProps) {
  const router = useRouter();
  const search = useSearchParams();

  function remove(category: string, slug: string) {
    const sp = new URLSearchParams(search?.toString() ?? "");
    const ids = (sp.get("species") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((id) => id !== `${category}:${slug}`);
    if (ids.length === 0) sp.delete("species");
    else sp.set("species", ids.join(","));
    const qs = sp.toString();
    router.replace(qs ? `/planner?${qs}` : "/planner", { scroll: false });
  }

  if (entries.length === 0) {
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
    <ul className="stagger grid grid-cols-1 gap-3 sm:grid-cols-2">
      {entries.map((entry, i) => {
        const meta = CATEGORY_META[entry.category];
        const img = getImage(entry.slug);
        const Icon = CAT_ICON[entry.category];
        const tone = CAT_TONE[entry.category];
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
            <div className="flex min-w-0 flex-1 flex-col gap-1 py-0.5">
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
