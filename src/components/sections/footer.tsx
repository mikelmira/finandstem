import Link from "next/link";
import { site } from "@/lib/site";
import { WaveMark } from "@/components/wave-mark";

export function SiteFooter() {
  return (
    <footer className="relative isolate mt-auto overflow-hidden border-t border-border/60">
      <div
        className="brand-aurora absolute inset-0 -z-20 opacity-70"
        aria-hidden
      />
      <div className="mx-auto w-full max-w-6xl px-6 pt-20 sm:px-8 sm:pt-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_2fr] lg:gap-20">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
              aria-label={`${site.name} home`}
            >
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                <WaveMark className="size-4" />
              </span>
              <span className="text-base font-semibold tracking-tight">
                {site.name}
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {site.description}
            </p>
            <p className="mt-6 max-w-xs text-xs leading-relaxed text-muted-foreground/80">
              {site.footer.note}
            </p>
          </div>

          <nav aria-label="Footer">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {site.footer.columns.map((col) => (
                <div key={col.title}>
                  <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {col.title}
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm">
                    {col.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-foreground/80 transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {site.name}. {site.owner.location}.
          </p>
          <p>
            Built with Next.js · Tailwind · shadcn ·{" "}
            <a
              href={`mailto:${site.owner.email}`}
              className="hover:text-foreground"
            >
              {site.owner.email}
            </a>
          </p>
        </div>
      </div>

      {/* Mega wordmark — Terrava / Botany reference */}
      <div className="relative mt-12 select-none overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        />
        <div
          aria-hidden
          className="bg-grid absolute inset-0 opacity-30"
        />
        <p className="wordmark-bleed -mb-[4vw] px-2 text-center text-[28vw] leading-none tracking-tighter sm:-mb-[3vw] sm:text-[26vw] md:text-[20vw] lg:text-[18vw]">
          Fin&nbsp;&amp;&nbsp;Stem
        </p>
      </div>
    </footer>
  );
}
