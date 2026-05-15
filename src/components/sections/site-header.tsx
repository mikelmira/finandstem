import Link from "next/link";
import { Wand2 } from "lucide-react";
import { site } from "@/lib/site";
import { GlobalSearch, type SearchOption } from "@/components/search/global-search";
import { MobileNav } from "@/components/sections/mobile-nav";
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

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6">
      <div className="glass glass-edge mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 rounded-full px-3 pl-4 pr-3 sm:h-16 sm:pl-6 sm:pr-3">
        {/* Wordmark logo — same display family + weight as the giant
            footer watermark, sized for the header. No icon. */}
        <Link
          href="/"
          className="group flex items-center"
          aria-label={`${site.name} home`}
        >
          <span
            className="font-display text-xl font-bold leading-none tracking-tight text-foreground transition-colors duration-200 group-hover:text-[var(--brand)] sm:text-2xl"
            style={{
              fontVariationSettings: '"opsz" 96, "wdth" 100',
              letterSpacing: "-0.035em",
            }}
          >
            {site.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1 text-sm">
            {site.nav.map((item) => (
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
