"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FishMark,
  PlantMark,
  ShrimpMark,
  MossMark,
  SnailMark,
} from "@/components/icons/species-icons";

/**
 * Livestock dropdown — groups the four catalogue categories
 * (Fish · Plants · Shrimp · Mosses) into a single hover/click menu on
 * desktop. The dropdown opens on hover for fast browsing on pointer
 * devices, falls back to a click toggle on keyboard / touch.
 *
 * Accessibility: <button> + popup pattern with aria-expanded /
 * aria-controls, escape to close, focus-out auto-closes. The trigger
 * also handles keyboard activation (Space / Enter).
 */

interface LivestockItem {
  label: string;
  href: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const ITEMS: ReadonlyArray<LivestockItem> = [
  {
    label: "Fish",
    href: "/fish",
    description: "Schoolers, centrepieces, dwarf cichlids, algae crew.",
    Icon: FishMark,
  },
  {
    label: "Plants",
    href: "/plants",
    description: "Carpets, midground, stems, floaters and bulbs.",
    Icon: PlantMark,
  },
  {
    label: "Shrimp",
    href: "/shrimp",
    description: "Neocaridina, Caridina, and the filter-feeders.",
    Icon: ShrimpMark,
  },
  {
    label: "Mosses",
    href: "/mosses",
    description: "Java, Christmas, Flame, Fissidens and more.",
    Icon: MossMark,
  },
  {
    label: "Snails",
    href: "/snails",
    description: "Nerites, mystery snails, assassins and the algae crew.",
    Icon: SnailMark,
  },
];

export function LivestockDropdown() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = ITEMS.some((item) => pathname.startsWith(item.href));

  // Close on Esc
  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Close on focus leaving the dropdown subtree
  function onBlurCapture(e: React.FocusEvent<HTMLDivElement>) {
    const next = e.relatedTarget as Node | null;
    if (!next || !rootRef.current?.contains(next)) {
      setOpen(false);
    }
  }

  // Hover with a tiny grace period so wiggling between trigger and panel
  // doesn't flicker the dropdown closed.
  function openImmediately() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  // Auto-close when route changes
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openImmediately}
      onMouseLeave={scheduleClose}
      onBlurCapture={onBlurCapture}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="livestock-menu"
        onClick={() => setOpen((v) => !v)}
        onFocus={openImmediately}
        className={cn(
          "nav-pill inline-flex items-center gap-1 px-3 py-1.5 text-sm transition-colors duration-200",
          isActive
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        Livestock
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {/* Panel */}
      <div
        id="livestock-menu"
        role="menu"
        className={cn(
          "absolute left-1/2 top-full z-50 mt-3 w-[20rem] -translate-x-1/2 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        {/* Hover bridge — invisible strip between the trigger and panel
            so the cursor can travel without closing the menu */}
        <div aria-hidden className="h-3 w-full" />
        <div className="glass glass-edge rounded-2xl p-2 shadow-2xl shadow-[var(--abyss)]/15">
          <ul className="flex flex-col">
            {ITEMS.map(({ label, href, description, Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    role="menuitem"
                    className={cn(
                      "press group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150",
                      active
                        ? "bg-[var(--brand-soft)]/60 text-foreground"
                        : "hover:bg-foreground/5",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 inline-flex size-7 flex-none items-center justify-center rounded-lg",
                        active
                          ? "bg-[var(--brand)] text-white"
                          : "bg-[var(--brand-soft)] text-[var(--brand)]",
                      )}
                    >
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-foreground">
                        {label}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                        {description}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
