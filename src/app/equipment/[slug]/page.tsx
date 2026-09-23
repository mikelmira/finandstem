import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { site } from "@/lib/site";
import { EQUIPMENT, getEquipmentGuide } from "@/data/equipment";
import { DEFAULT_OG_IMAGE, equipmentPageJsonLd, longDescription } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Tldr } from "@/components/seo/tldr";
import { Faq } from "@/components/seo/faq";
import { GearCard } from "@/components/gear/gear-card";
import { featuredGear, gearCount, toCard } from "@/lib/gear";
import { GEAR_CATEGORIES } from "@/lib/gear/categories";
import type { GearCategory } from "@/types/gear";

/** Which gear catalogue category backs each equipment guide. */
const GUIDE_GEAR: Record<string, GearCategory> = {
  lighting: "lights",
  filtration: "filters",
  "co2-injection": "co2",
  heaters: "heaters",
  "circulation-and-flow": "pumps",
};

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return EQUIPMENT.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const guide = getEquipmentGuide(slug);
  if (!guide) return {};
  const title = `${guide.name}: How to Choose and Size It`;
  const description = longDescription(guide.spot, guide.tldr);
  const gc = GUIDE_GEAR[slug];
  const pick = gc ? featuredGear(gc, 1)[0]?.images[0] : undefined;
  const ogImage = pick ? `${site.url}${pick.src}` : DEFAULT_OG_IMAGE;
  const canonical = `${site.url}/equipment/${slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: site.name,
      title,
      description,
      locale: "en",
      authors: [`${site.url}/about`],
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
    keywords: [
      guide.name.toLowerCase(),
      `aquarium ${guide.name.toLowerCase()}`,
      `how to choose ${guide.name.toLowerCase()}`,
      "planted tank equipment",
    ],
    other: { "article:author": `${site.url}/about` },
  };
}

export default async function EquipmentPage({ params }: RouteParams) {
  const { slug } = await params;
  const guide = getEquipmentGuide(slug);
  if (!guide) notFound();

  const others = EQUIPMENT.filter((e) => e.slug !== guide.slug);
  const gearCat = GUIDE_GEAR[guide.slug];
  const gearPicks = gearCat ? featuredGear(gearCat, 3) : [];

  return (
    <>
      <JsonLd
        data={equipmentPageJsonLd({
          slug: guide.slug,
          name: guide.name,
          description: guide.spot,
          faqs: guide.faqs,
        })}
        id={`equipment-jsonld-${guide.slug}`}
      />

      <article className="mx-auto w-full max-w-3xl px-6 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Equipment", href: "/equipment" },
            { name: guide.name },
          ]}
          className="mb-8"
        />

        <header className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            Equipment guide
          </p>
          <h1 className="text-display-tight mt-3 text-balance text-3xl leading-[1.2] sm:text-4xl md:text-5xl">
            {guide.name}
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {guide.spot}
          </p>
        </header>

        <Tldr body={guide.tldr} subject={guide.name} />

        {guide.slug === "co2-injection" && (
          <figure className="mt-8">
            <Co2SystemDiagram />
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
              A pressurised CO2 system, in order of gas flow, from cylinder to
              the tank.
            </figcaption>
          </figure>
        )}

        {guide.quickRef && (
          <div className="mt-10 glass glass-edge rounded-2xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              {guide.quickRef.title}
            </h2>
            {guide.quickRef.note && (
              <p className="mt-1 text-sm text-muted-foreground">
                {guide.quickRef.note}
              </p>
            )}
            <dl className="mt-4 divide-y divide-border/50">
              {guide.quickRef.rows.map((r) => (
                <div
                  key={r.label}
                  className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                >
                  <dt className="text-sm font-medium text-foreground">
                    {r.label}
                  </dt>
                  <dd className="text-sm text-muted-foreground sm:text-right">
                    {r.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {guide.sections.map((s) => (
          <section key={s.heading} className="mt-10">
            <h2 className="text-display-tight mb-4 text-2xl sm:text-3xl">
              {s.heading}
            </h2>
            <p className="text-pretty leading-relaxed text-foreground/90">
              {s.body}
            </p>
          </section>
        ))}

        {gearCat && gearPicks.length > 0 && (
          <section className="mt-12">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-display-tight text-2xl sm:text-3xl">
                Compare real {GEAR_CATEGORIES[gearCat].label.toLowerCase()}
              </h2>
              <Link
                href={`/gear/${gearCat}`}
                className="text-sm font-medium text-[var(--brand)] hover:underline"
              >
                All {gearCount(gearCat)} in the catalogue
              </Link>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Our gear catalogue lists specs for every model and filters by your tank size.
            </p>
            <ul className="mt-5 grid gap-4 sm:grid-cols-3">
              {gearPicks.map((p) => (
                <li key={p.id}>
                  <GearCard card={toCard(p)} showCompare={false} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12">
          <Faq items={guide.faqs} />
        </section>

        {guide.related && guide.related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Keep going
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {guide.related.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="press inline-flex items-center gap-1.5 text-sm font-medium underline decoration-[var(--brand)]/40 underline-offset-4 transition-colors hover:text-[var(--brand)]"
                  >
                    {r.label}
                    <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-14">
          <h2 className="text-display-tight text-2xl sm:text-3xl">
            More equipment
          </h2>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {others.map((e) => (
              <li key={e.slug}>
                <Link
                  href={`/equipment/${e.slug}`}
                  className="press flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm backdrop-blur transition-colors hover:border-[var(--brand)]/40"
                >
                  <span>{e.name}</span>
                  <ArrowRight
                    className="size-4 flex-none text-muted-foreground"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12">
          <Link
            href="/equipment"
            className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/40"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All equipment guides
          </Link>
        </div>
      </article>
    </>
  );
}

/** Original diagram of a pressurised CO2 system, in order of gas flow. Theme-aware. */
function Co2SystemDiagram() {
  const nodes = [
    { label: "Cylinder", sub: "stores CO₂" },
    { label: "Regulator", sub: "+ solenoid" },
    { label: "Bubble counter", sub: "+ needle valve" },
    { label: "Check valve", sub: "one-way" },
  ];
  return (
    <svg
      viewBox="0 0 760 200"
      role="img"
      aria-label="A pressurised CO2 system in order: cylinder, regulator with solenoid, bubble counter with needle valve, check valve, then into the tank where a diffuser dissolves the gas and a drop checker shows the level."
      className="w-full rounded-2xl border border-border bg-background/60 p-3"
    >
      {nodes.map((n, i) => {
        const x = 12 + i * 132;
        return (
          <g key={n.label}>
            <rect x={x} y={62} width={112} height={62} rx={10} fill="var(--background)" stroke="var(--brand)" strokeWidth="1.5" />
            <text x={x + 56} y={90} textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--foreground)">
              {n.label}
            </text>
            <text x={x + 56} y={108} textAnchor="middle" fontSize="10.5" fill="var(--muted-foreground)">
              {n.sub}
            </text>
            <line x1={x + 112} y1={93} x2={x + 132 - 4} y2={93} stroke="var(--brand)" strokeWidth="2" markerEnd="url(#co2-arrow)" />
          </g>
        );
      })}

      {/* tank */}
      <rect x={540} y={40} width={208} height={120} rx={12} fill="var(--brand)" fillOpacity="0.06" stroke="var(--brand)" strokeWidth="1.5" />
      <text x={644} y={34} textAnchor="middle" fontSize="12" fill="var(--muted-foreground)">the tank</text>
      <circle cx={572} cy={128} r="4" fill="var(--brand)" />
      <text x={584} y={132} fontSize="12" fill="var(--foreground)">Diffuser dissolves it</text>
      <circle cx={572} cy={78} r="4" fill="var(--brand)" />
      <text x={584} y={82} fontSize="12" fill="var(--foreground)">Drop checker reads it</text>

      <defs>
        <marker id="co2-arrow" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--brand)" />
        </marker>
      </defs>
    </svg>
  );
}
