import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { about } from "@/content/about";
import { atmosphere } from "@/data/atmosphere";
import { PageHero } from "@/components/sections/page-hero";
import {
  SectionShell,
  SectionHeading,
} from "@/components/sections/section-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { aboutPageJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "What Fin & Stem is and how it's sourced. A working planted-aquarium reference for aquascapers anywhere in the world.",
  alternates: { canonical: `${site.url}/about` },
  openGraph: {
    type: "profile",
    url: `${site.url}/about`,
    title: `About, ${site.name}`,
    description:
      "Mike Elmira on why Fin & Stem exists, how the catalogue is sourced, and what gets fact-checked before it ships.",
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutPageJsonLd()} id="about-jsonld" />
      <PageHero
        {...about.hero}
        backgroundImage={atmosphere.nanoTank}
        breadcrumb={[{ label: "About" }]}
      />

      {/* Ethos */}
      <SectionShell>
        <SectionHeading
          eyebrow={about.ethos.eyebrow}
          title={about.ethos.title}
          subtitle={about.ethos.body}
        />
        <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/60 md:grid-cols-2">
          {about.ethos.points.map((item, i) => (
            <li
              key={item.title}
              className="glass flex flex-col gap-2.5 bg-background p-6 md:p-7"
            >
              <span className="font-mono text-xs text-[var(--brand)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-base font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </SectionShell>

      {/* References */}
      <SectionShell className="border-t border-border/60 bg-muted/30">
        <SectionHeading
          eyebrow={about.references.eyebrow}
          title={about.references.title}
          subtitle={about.references.body}
        />
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {about.references.items.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass glass-edge lift group flex flex-col gap-2 rounded-2xl p-6 no-underline transition-colors hover:border-[var(--brand)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <h3 className="text-base font-semibold tracking-tight transition-colors group-hover:text-[var(--brand)]">
                {item.name}
              </h3>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand)]">
                {item.role}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.note}
              </p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[var(--brand)] transition-colors group-hover:text-foreground">
                Visit website
                <ArrowUpRight
                  className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </span>
            </a>
          ))}
        </div>
      </SectionShell>

    </>
  );
}
