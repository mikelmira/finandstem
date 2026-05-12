import Link from "next/link";
import { Wand2 } from "lucide-react";
import { site } from "@/lib/site";
import { WaveMark } from "@/components/wave-mark";
import { GlobalSearch, type SearchOption } from "@/components/search/global-search";
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

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6">
      <div className="glass glass-edge mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 rounded-full px-3 pl-4 pr-3 sm:h-16 sm:pl-6 sm:pr-3">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label={`${site.name} home`}
        >
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-[14deg] group-hover:scale-110 group-hover:bg-[var(--brand)]/25">
            <WaveMark className="size-4" />
          </span>
          <span className="text-base font-semibold tracking-tight transition-colors duration-300 group-hover:text-[var(--brand)]">
            {site.name}
          </span>
        </Link>

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
        </div>
      </div>
    </header>
  );
}
