import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";

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
              className="inline-flex items-center"
              aria-label={`${site.name} home`}
            >
              <Image
                src="/fin-and-stem-logo.png"
                alt={`${site.name} logo`}
                width={1344}
                height={386}
                className="h-8 w-auto dark:invert"
              />
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

        {/* Disclaimer + contact strip, image takedown requests,
            corrections, suggestions all funnel to one address. */}
        <div className="mt-14 border-t border-border/60 pt-6 text-xs leading-relaxed text-muted-foreground">
          <p className="max-w-3xl">
            If you&rsquo;d like an image removed, spot information that needs
            correcting, or have suggestions for the catalogue, please contact{" "}
            <a
              href={`mailto:${site.contact.email}`}
              className="font-medium text-foreground transition-colors hover:text-[var(--brand)]"
            >
              {site.contact.email}
            </a>
            .
          </p>
          <p className="mt-4 text-muted-foreground/80">
            © {new Date().getFullYear()} {site.name}. {site.owner.location}.
          </p>
        </div>
      </div>

      {/* Mega wordmark, Terrava / Botany reference */}
      <div className="relative mt-12 select-none overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border/60"
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
