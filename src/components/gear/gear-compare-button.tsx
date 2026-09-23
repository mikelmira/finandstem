"use client";

import * as React from "react";
import { Check, Columns3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GearCategory } from "@/types/gear";
import {
  getGearTrayServerSnapshot,
  getGearTraySnapshot,
  subscribeGearTray,
  toggleGearTray,
  writeGearTray,
  type GearTrayItem,
} from "@/lib/gear/compare-storage";

export function useGearTray() {
  return React.useSyncExternalStore(
    subscribeGearTray,
    getGearTraySnapshot,
    getGearTrayServerSnapshot,
  );
}

/** Add/remove a product from the gear compare tray. */
export function GearCompareButton({
  category,
  item,
  size = "sm",
  className,
}: {
  category: GearCategory;
  item: GearTrayItem;
  size?: "sm" | "md";
  className?: string;
}) {
  const tray = useGearTray();
  const selected =
    tray.category === category && tray.items.some((i) => i.id === item.id);
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        writeGearTray(toggleGearTray(tray, category, item));
      }}
      className={cn(
        "press inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors",
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-4 py-2 text-sm",
        selected
          ? "border-[var(--brand)]/60 bg-[var(--brand)]/15 text-foreground"
          : "border-border bg-background/70 text-muted-foreground hover:border-[var(--brand)]/40 hover:text-foreground",
        className,
      )}
    >
      {selected ? (
        <Check className={size === "sm" ? "size-3" : "size-4"} aria-hidden />
      ) : (
        <Columns3 className={size === "sm" ? "size-3" : "size-4"} aria-hidden />
      )}
      {selected ? "In compare" : "Compare"}
    </button>
  );
}
