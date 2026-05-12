import type { Metadata } from "next";
import { MapPin, ExternalLink } from "lucide-react";
import { about } from "@/content/about";
import { atmosphere } from "@/data/atmosphere";
import { PageHero } from "@/components/sections/page-hero";
import {
  SectionShell,
  SectionHeading,
  Eyebrow,
} from "@/components/sections/section-shell";

export const metadata: Metadata = {
  title: "About",
  description:
    "What Fin & Stem is, how it's sourced, and who runs it. A working planted-aquarium reference, built to help aquascapers anywhere in the world stock and care for the tank they imagined.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero {...about.hero} backgroundImage={atmosphere.nanoTank} />

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
            <article
              key={item.name}
              className="glass glass-edge flex flex-col gap-2 rounded-2xl p-6"
            >
              <h3 className="text-base font-semibold tracking-tight">
                {item.name}
              </h3>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand)]">
                {item.role}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.note}
              </p>
            </article>
          ))}
        </div>
      </SectionShell>

      {/* Author */}
      <SectionShell className="border-t border-border/60">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="glass glass-edge relative aspect-[4/5] overflow-hidden rounded-2xl">
            <div aria-hidden className="brand-aurora absolute inset-0 opacity-70" />
            <div className="absolute inset-0 flex items-end p-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
                <MapPin className="size-3.5" aria-hidden />
                {about.founder.location}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <Eyebrow>{about.founder.eyebrow}</Eyebrow>
            <h2 className="text-display-tight mt-4 text-balance text-3xl sm:text-4xl">
              {about.founder.title}
            </h2>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {about.founder.body}
            </p>
            <a
              href="mailto:mikee@dsg.co.za"
              className="mt-7 inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/40"
            >
              mikee@dsg.co.za
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </div>
        </div>
      </SectionShell>
    </>
  );
}
