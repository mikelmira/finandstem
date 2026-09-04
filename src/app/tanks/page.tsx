import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { generatedTanks, tankSizeSlug } from "@/lib/catalogue/tank-picks";

export const metadata: Metadata = {
  title: "Aquarium Stocking by Tank Size",
  description:
    "What fish, shrimp and plants suit each tank size, from pico to show tanks. Pick your volume and see the species that fit without overstocking.",
  alternates: { canonical: `${site.url}/tanks` },
};

// Sizes with a dedicated hand-written guide instead of a generated page.
const GUIDE_LINKS = [
  { label: "Best fish for a 30 litre tank", href: "/guides/best-fish-for-30-litre-planted-tank" },
  { label: "Stocking a 60 litre community tank", href: "/guides/stocking-a-60-litre-community-planted-tank" },
];

export default function TanksIndexPage() {
  const tanks = generatedTanks();
  return (
    <article className="mx-auto w-full max-w-4xl px-6 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
      <Breadcrumbs
        items={[{ name: "Home", href: "/" }, { name: "Tank sizes" }]}
        className="mb-8"
      />
      <header className="mb-10 max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
          Stocking by size
        </p>
        <h1 className="text-display-tight mt-3 text-balance text-3xl leading-[1.2] sm:text-4xl md:text-5xl">
          What fits your tank size
        </h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          Every tank size wants a different stocking plan. Pick your volume and
          see the fish, shrimp and plants that suit it, scaled so you can build
          a community without crowding it.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {tanks.map((t) => (
          <li key={t.litres}>
            <Link
              href={`/tanks/${tankSizeSlug(t.litres)}`}
              className="press group flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/60 p-5 backdrop-blur transition-colors hover:border-[var(--brand)]/40"
            >
              <span>
                <span className="block font-medium">
                  {t.litres} litre tank
                </span>
                <span className="block text-sm text-muted-foreground">
                  {t.blurb}
                </span>
              </span>
              <ArrowRight
                className="size-5 flex-none text-muted-foreground transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
          In-depth guides
        </h2>
        <ul className="mt-4 flex flex-col gap-2">
          {GUIDE_LINKS.map((g) => (
            <li key={g.href}>
              <Link
                href={g.href}
                className="press inline-flex items-center gap-1.5 text-sm font-medium underline decoration-[var(--brand)]/40 underline-offset-4 transition-colors hover:text-[var(--brand)]"
              >
                {g.label}
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
