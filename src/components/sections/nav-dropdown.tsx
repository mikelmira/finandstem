"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_GROUPS, navActive } from "@/lib/nav";

/**
 * One desktop dropdown for a nav group. Opens on hover for pointer users
 * (with a short grace period so moving to the panel doesn't close it) and
 * on click / focus for keyboard and touch. Esc and focus-out close it.
 * Groups with more than five items render as a two-column panel.
 */
export function NavDropdown({
  groupId,
  align = "center",
}: {
  /** Id of a group in NAV_GROUPS. Passed as a string because the icons in
   *  the config are components and can't cross the server/client boundary. */
  groupId: string;
  align?: "left" | "center" | "right";
}) {
  const group = NAV_GROUPS.find((g) => g.id === groupId) ?? NAV_GROUPS[0];
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = `nav-menu-${group.id}`;

  // Close on route change (state adjustment during render, not an effect).
  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function onBlurCapture(e: React.FocusEvent<HTMLDivElement>) {
    const next = e.relatedTarget as Node | null;
    if (!next || !rootRef.current?.contains(next)) setOpen(false);
  }
  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function closeSoon() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  const isActive = group.items.some((i) => navActive(pathname, i.href));
  const wide = group.items.length > 5;

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onBlurCapture={onBlurCapture}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        onFocus={openNow}
        className={cn(
          "nav-pill inline-flex items-center gap-1 whitespace-nowrap px-3 py-1.5 text-sm transition-colors duration-200",
          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        {group.label}
        <ChevronDown
          className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      </button>

      <div
        id={menuId}
        role="menu"
        className={cn(
          "absolute top-full z-50 mt-3 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
          wide ? "w-[36rem]" : "w-[20rem]",
          align === "center" && "left-1/2 -translate-x-1/2",
          align === "left" && "left-0",
          align === "right" && "right-0",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        {/* Hover bridge between trigger and panel */}
        <div aria-hidden className="h-3 w-full" />
        <div className="glass glass-edge rounded-2xl p-2 shadow-2xl shadow-[var(--abyss)]/15">
          <ul className={cn("grid gap-0.5", wide ? "grid-cols-2" : "grid-cols-1")}>
            {group.items.map(({ label, href, description, Icon }) => {
              const active = navActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    role="menuitem"
                    tabIndex={open ? 0 : -1}
                    className={cn(
                      "press group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150",
                      active ? "bg-[var(--brand-soft)]/60 text-foreground" : "hover:bg-foreground/5",
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
          {group.footer && (
            <Link
              href={group.footer.href}
              tabIndex={open ? 0 : -1}
              className="mt-1 flex items-center justify-between rounded-xl border-t border-border/50 px-3 py-2.5 text-xs font-medium text-[var(--brand)] hover:bg-foreground/5"
            >
              {group.footer.label}
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
