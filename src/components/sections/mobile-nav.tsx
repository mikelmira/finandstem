"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/client-hooks";
import { NAV_FLAT, NAV_GROUPS, navActive } from "@/lib/nav";

export interface MobileNavLink {
  label: string;
  href: string;
}

interface MobileNavProps {
  primaryCta?: MobileNavLink;
}

/**
 * Mobile drawer. Uses the same grouped config as the desktop dropdowns
 * (lib/nav.ts); each group is a collapsible section, and the group holding
 * the current page starts open.
 */
export function MobileNav({ primaryCta }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const mounted = useHydrated();
  const activeGroup =
    NAV_GROUPS.find((g) => g.items.some((i) => navActive(pathname, i.href)))?.id ?? "species";
  const [expanded, setExpanded] = React.useState<string>(activeGroup);

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
          {/* Backdrop, palette-based dark overlay, no white */}
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

            <nav aria-label="Primary" className="flex flex-col gap-1 overflow-y-auto p-3">
              {NAV_GROUPS.map((group) => {
                const isOpen = expanded === group.id;
                const hasActive = group.items.some((i) => navActive(pathname, i.href));
                return (
                  <div key={group.id} className="rounded-xl">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`m-${group.id}`}
                      onClick={() => setExpanded(isOpen ? "" : group.id)}
                      className={cn(
                        "press flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                        hasActive ? "text-foreground" : "text-foreground/85",
                        "hover:bg-foreground/5",
                      )}
                    >
                      {group.label}
                      <ChevronDown
                        className={cn("size-4 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")}
                        aria-hidden
                      />
                    </button>
                    {isOpen && (
                      <ul id={`m-${group.id}`} className="animate-fade-up flex flex-col gap-0.5 pb-2">
                        {group.items.map(({ label, href, description, Icon }) => {
                          const active = navActive(pathname, href);
                          return (
                            <li key={href}>
                              <Link
                                href={href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                  "press flex items-start gap-3 rounded-xl px-3 py-2 transition-colors duration-200",
                                  active ? "bg-[var(--brand)]/15 text-foreground" : "text-foreground/85 hover:bg-foreground/5",
                                )}
                              >
                                <span
                                  className={cn(
                                    "mt-0.5 inline-flex size-7 flex-none items-center justify-center rounded-lg",
                                    active ? "bg-[var(--brand)] text-white" : "bg-[var(--brand-soft)] text-[var(--brand)]",
                                  )}
                                >
                                  <Icon className="size-4" aria-hidden />
                                </span>
                                <span className="flex-1">
                                  <span className="block text-sm font-medium text-foreground">{label}</span>
                                  <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                                    {description}
                                  </span>
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
              <div className="my-2 h-px bg-border/60" aria-hidden />
              {NAV_FLAT.map((item) => {
                const active = navActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "press group inline-flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors duration-200",
                      active ? "bg-[var(--brand)]/15 text-foreground" : "text-foreground/85 hover:bg-foreground/5",
                    )}
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="size-4 text-muted-foreground/50" aria-hidden />
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
