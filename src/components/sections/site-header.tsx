import Link from "next/link";
import Image from "next/image";
import { Wand2 } from "lucide-react";
import { site } from "@/lib/site";
import { GlobalSearch, type SearchOption } from "@/components/search/global-search";
import { MobileNav } from "@/components/sections/mobile-nav";
import { LivestockDropdown } from "@/components/sections/livestock-dropdown";
import { allNorm } from "@/lib/catalogue/normalize";

const SEARCH_OPTIONS: SearchOption[] = allNorm
  .map((n) => ({
    category: n.category,
    slug: n.slug,
    commonName: n.commonName,
    scientificName: n.scientificName,
    origin: n.origin,
  }))
  .sort((a, b) => a.commonName.localeCompare(b.commonName));

const MOBILE_LINKS = [...site.nav];

/**
 * Slugs grouped under the desktop "Livestock" dropdown — surfaced
 * individually in the mobile drawer for one-tap navigation.
 */
const LIVESTOCK_HREFS = new Set([
  "/fish",
  "/plants",
  "/shrimp",
  "/mosses",
  "/snails",
]);

/**
 * Desktop nav items that sit alongside the Livestock dropdown.
 * Filtered from site.nav so the source of truth stays in lib/site.ts.
 */
const FLAT_NAV = site.nav.filter((item) => !LIVESTOCK_HREFS.has(item.href));

export function SiteHeader() {
  return (
    /**
     * Header floats over the hero rather than reserving vertical space
     * above it. `fixed` keeps it visible on scroll; pointer-events-none
     * on the outer wrapper lets the photo behind it stay interactive
     * outside the pill itself.
     */
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6">
      <div className="glass glass-edge pointer-events-auto mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 rounded-full px-3 pl-4 pr-3 sm:h-16 sm:pl-6 sm:pr-3">
        {/* Logo — image lockup, replaces the previous text wordmark. */}
        <Link
          href="/"
          className="group flex items-center"
          aria-label={`${site.name} home`}
        >
          <Image
            src="/fin-and-stem-logo.png"
            alt={`${site.name} logo`}
            width={1344}
            height={386}
            priority
            className="h-7 w-auto transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.04] sm:h-8 dark:invert"
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1 text-sm">
            <li>
              <LivestockDropdown />
            </li>
            {FLAT_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="nav-pill inline-flex items-center px-3 py-1.5 text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <GlobalSearch options={SEARCH_OPTIONS} />

          <Link
            href="/planner"
            className="glass-pill press group hidden h-9 items-center gap-1.5 rounded-full px-4 text-xs font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-10px_color-mix(in_oklab,var(--brand)_45%,transparent)] sm:inline-flex sm:text-sm"
          >
            <Wand2
              className="size-3.5 transition-transform duration-300 group-hover:rotate-[14deg]"
              aria-hidden
            />
            Plan a tank
          </Link>

          <MobileNav
            links={MOBILE_LINKS}
            primaryCta={{ label: "Plan a tank", href: "/planner" }}
          />
        </div>
      </div>
    </header>
  );
}
