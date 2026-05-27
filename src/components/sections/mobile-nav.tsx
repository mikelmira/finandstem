"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FishMark,
  PlantMark,
  ShrimpMark,
  MossMark,
} from "@/components/icons/species-icons";

export interface MobileNavLink {
  label: string;
  href: string;
}

interface MobileNavProps {
  links: ReadonlyArray<MobileNavLink>;
  primaryCta?: MobileNavLink;
}

/**
 * Mirrors the desktop Livestock dropdown — the four catalogue routes
 * are grouped at the top of the drawer under a "Livestock" header
 * (with the same PNG icons used on desktop), and the remaining nav
 * items render below a divider.
 */
const LIVESTOCK_META: Record<
  string,
  { description: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  "/fish": {
    description: "Schoolers, centrepieces, dwarf cichlids, algae crew.",
    Icon: FishMark,
  },
  "/plants": {
    description: "Carpets, midground, stems, floaters and bulbs.",
    Icon: PlantMark,
  },
  "/shrimp": {
    description: "Neocaridina, Caridina, and the filter-feeders.",
    Icon: ShrimpMark,
  },
  "/mosses": {
    description: "Java, Christmas, Flame, Fissidens and more.",
    Icon: MossMark,
  },
};

const LIVESTOCK_ORDER = ["/fish", "/plants", "/shrimp", "/mosses"];

export function MobileNav({ links, primaryCta }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll while open
  React.useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Esc to close
  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const drawer = open ? (
    <div
      id="mobile-nav-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-[100] md:hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
          {/* Backdrop — palette-based dark overlay, no white */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[var(--abyss)]/70 backdrop-blur-sm animate-fade-up"
          />

          {/* Sheet */}
          <aside
            className="animate-drop-in absolute right-0 top-0 flex h-full w-80 max-w-[88vw] flex-col gap-0 border-l border-border bg-background/95 shadow-2xl"
            style={{ transformOrigin: "right" }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-border/50 px-5 py-4">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="press inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <nav
              aria-label="Primary"
              className="stagger flex flex-col gap-1 overflow-y-auto p-3"
            >
              {/* Livestock — grouped at the top, mirroring desktop dropdown */}
              <div className="px-2 pb-1 pt-2">
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--brand)]">
                  Livestock
                </p>
              </div>
              {LIVESTOCK_ORDER.map((href, i) => {
                const item = links.find((l) => l.href === href);
                if (!item) return null;
                const meta = LIVESTOCK_META[href];
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(item.href));
                const Icon = meta.Icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    style={{ ["--i" as string]: Math.min(i, 9) }}
                    className={cn(
                      "press animate-fade-up group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200",
                      active
                        ? "bg-[var(--brand)]/15 text-foreground"
                        : "text-foreground/85 hover:bg-foreground/5",
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
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                        {meta.description}
                      </span>
                    </span>
                  </Link>
                );
              })}

              {/* Divider + other nav items */}
              <div className="my-3 h-px bg-border/60" aria-hidden />
              <div className="px-2 pb-1">
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Explore
                </p>
              </div>
              {links
                .filter((item) => !(item.href in LIVESTOCK_META))
                .map((item, i) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/" && pathname?.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      style={{ ["--i" as string]: Math.min(i + 4, 9) }}
                      className={cn(
                        "press animate-fade-up group inline-flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200",
                        active
                          ? "bg-[var(--brand)]/15 text-foreground"
                          : "text-foreground/85 hover:bg-foreground/5",
                      )}
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight
                        className={cn(
                          "size-4 transition-transform duration-300",
                          active
                            ? "text-[var(--brand)]"
                            : "text-muted-foreground/50 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand)]",
                        )}
                        aria-hidden
                      />
                    </Link>
                  );
                })}
            </nav>

            {primaryCta && (
              <div className="mt-auto border-t border-border/50 p-4">
                <Link
                  href={primaryCta.href}
                  onClick={() => setOpen(false)}
                  className="press group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-[var(--brand-foreground)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-10px_color-mix(in_oklab,var(--brand)_55%,transparent)]"
                >
                  {primaryCta.label}
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </div>
            )}
          </aside>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        className="press inline-flex size-9 items-center justify-center rounded-full border border-border bg-background/60 text-foreground transition-colors duration-200 hover:border-[var(--brand)]/40 md:hidden"
      >
        <Menu className="size-4" aria-hidden />
      </button>
      {mounted && drawer ? createPortal(drawer, document.body) : null}
    </>
  );
}
