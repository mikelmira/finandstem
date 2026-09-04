import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { CATEGORY_META } from "@/types/catalogue";
import { getEntryDates } from "@/data/timestamps";
import type { NormalizedEntry } from "@/lib/catalogue/normalize";
import type { CompatibilityMatch } from "@/lib/catalogue/compatibility";
import {
  tankMatesData,
  tankMatesTitle,
  tankMatesDescription,
  tankMatesTldr,
  tankMatesFaqs,
} from "@/lib/catalogue/tank-mates";
import { tankMatesPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { AuthorByline } from "@/components/seo/author-byline";
import { Tldr } from "@/components/seo/tldr";
import { Faq } from "@/components/seo/faq";

type MatchGroupKey = "fish" | "plants" | "shrimp" | "mosses";

const GROUPS: ReadonlyArray<{ key: MatchGroupKey; label: string }> = [
  { key: "fish", label: "Compatible fish" },
  { key: "plants", label: "Compatible plants" },
  { key: "shrimp", label: "Compatible shrimp" },
  { key: "mosses", label: "Compatible mosses" },
];

export function TankMatesPageBody({ anchor }: { anchor: NormalizedEntry }) {
  const { ranked } = tankMatesData(anchor);
  const title = tankMatesTitle(anchor);
  const description = tankMatesDescription(anchor);
  const tldr = tankMatesTldr(anchor, ranked);
  const faqs = tankMatesFaqs(anchor, ranked);
  const meta = CATEGORY_META[anchor.category];
  const { updatedAt } = getEntryDates(anchor.slug);
  const speciesPath = `${meta.path}/${anchor.slug}`;

  return (
    <>
      <JsonLd
        data={tankMatesPageJsonLd({
          anchorSlug: anchor.slug,
          anchorName: anchor.commonName,
          anchorCategory: anchor.category,
          title,
          description,
          faqs,
        })}
        id={`tank-mates-jsonld-${anchor.category}-${anchor.slug}`}
      />

      <article className="mx-auto w-full max-w-4xl px-6 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: meta.label, href: meta.path },
            { name: anchor.commonName, href: speciesPath },
            { name: "Tank mates" },
          ]}
          className="mb-8"
        />

        <header className="mb-10 max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            Tank mates
          </p>
          <h1 className="text-display-tight mt-3 text-balance text-3xl leading-[1.2] sm:text-4xl md:text-5xl">
            {anchor.commonName} tank mates
          </h1>
          <p className="mt-2 text-base italic text-muted-foreground">
            {anchor.scientificName}
          </p>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
          <div className="mt-6 border-t border-border/50 pt-5">
            <AuthorByline updatedAt={updatedAt} />
          </div>
        </header>

        <Tldr body={tldr} subject={`${anchor.commonName} tank mates`} />

        <div className="mt-12 flex flex-col gap-12">
          {GROUPS.map(({ key, label }) => {
            const matches = ranked[key] as CompatibilityMatch<NormalizedEntry>[];
            if (matches.length === 0) return null;
            const total = ranked.totals[key];
            return (
              <section key={key} className="flex flex-col gap-4">
                <header className="flex items-baseline justify-between gap-3">
                  <h2 className="text-display-tight text-2xl sm:text-3xl">
                    {label}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {matches.length < total
                      ? `Showing ${matches.length} of ${total}`
                      : `${total} match${total === 1 ? "" : "es"}`}
                  </span>
                </header>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {matches.map((m) => (
                    <MateCard key={m.entry.slug} match={m} />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <section className="mt-12 flex flex-wrap gap-3">
          <Link
            href={speciesPath}
            className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/40"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {anchor.commonName} care profile
          </Link>
          <Link
            href={`/compatibility?anchor=${anchor.category}:${anchor.slug}`}
            className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/40"
          >
            Build the full stocking list
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </section>

        <section className="mt-12">
          <Faq items={faqs} />
        </section>
      </article>
    </>
  );
}

function MateCard({
  match,
}: {
  match: CompatibilityMatch<NormalizedEntry>;
}) {
  const { entry, reasons } = match;
  const meta = CATEGORY_META[entry.category];
  return (
    <li>
      <Link
        href={`${meta.path}/${entry.slug}`}
        className="press group flex h-full flex-col gap-3 rounded-2xl border border-border bg-background/60 p-4 backdrop-blur transition-colors hover:border-[var(--brand)]/40"
      >
        <div className="flex items-start justify-between gap-2">
          <span>
            <span className="block font-medium leading-tight">
              {entry.commonName}
            </span>
            <span className="block text-sm italic text-muted-foreground">
              {entry.scientificName}
            </span>
          </span>
          <ArrowRight
            className="mt-0.5 size-4 flex-none text-muted-foreground transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </div>
        {reasons.length > 0 && (
          <span className="flex flex-wrap gap-1.5">
            {reasons.slice(0, 4).map((r) => (
              <span
                key={r.badge}
                className="rounded-full bg-[var(--brand)]/12 px-2 py-0.5 text-[11px] font-medium text-[var(--brand)]"
              >
                {r.badge}
              </span>
            ))}
          </span>
        )}
      </Link>
    </li>
  );
}
