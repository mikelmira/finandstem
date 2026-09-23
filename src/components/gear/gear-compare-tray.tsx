"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useGearTray } from "@/components/gear/gear-compare-button";
import {
  GEAR_COMPARE_MAX,
  compareHref,
  writeGearTray,
} from "@/lib/gear/compare-storage";
import { GEAR_CATEGORIES } from "@/lib/gear/categories";

/** Floating bar listing the products picked for comparison. */
export function GearCompareTray() {
  const tray = useGearTray();
  if (!tray.category || tray.items.length === 0) return null;
  const cat = GEAR_CATEGORIES[tray.category];
  const ids = tray.items.map((i) => i.id);
  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="glass glass-edge flex w-full max-w-3xl items-center gap-3 rounded-2xl border border-border bg-card/95 p-3 shadow-2xl">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
          <span className="hidden flex-none text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:inline">
            {cat.label} {tray.items.length}/{GEAR_COMPARE_MAX}
          </span>
          {tray.items.map((i) => (
            <span
              key={i.id}
              className="flex flex-none items-center gap-1.5 rounded-full border border-border bg-background/80 py-1 pl-1 pr-2 text-xs"
            >
              {i.thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={i.thumb} alt="" className="size-6 rounded-full bg-white object-contain" />
              ) : null}
              <span className="max-w-[9rem] truncate">{i.name}</span>
              <button
                type="button"
                aria-label={`Remove ${i.name}`}
                onClick={() => {
                  const items = tray.items.filter((x) => x.id !== i.id);
                  writeGearTray({ category: items.length ? tray.category : null, items });
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" aria-hidden />
              </button>
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => writeGearTray({ category: null, items: [] })}
          className="hidden flex-none text-xs text-muted-foreground hover:text-foreground sm:inline"
        >
          Clear
        </button>
        <Link
          href={compareHref(tray.category, ids)}
          className="press inline-flex flex-none items-center gap-1.5 rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white"
        >
          Compare
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
