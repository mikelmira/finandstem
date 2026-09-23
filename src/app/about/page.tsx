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
import Link from "next/link";
import { GEAR_BRANDS, GEAR_RETAILERS, LOGO_NOTICE } from "@/data/suppliers";
import { BrandLogo } from "@/components/gear/brand-logo";
import { GEAR } from "@/lib/gear";
import { GEAR_CATEGORIES } from "@/lib/gear/categories";
import type { GearCategory } from "@/types/gear";

/** Product count and biggest category per brand, from the live catalogue. */
function brandStats(brand: string) {
  const mine = GEAR.filter((p) => p.brand === brand);
  const byCat = new Map<GearCategory, number>();
  for (const p of mine) byCat.set(p.category, (byCat.get(p.category) ?? 0) + 1);
  const top = [...byCat.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  return { count: mine.length, top, categories: [...byCat.keys()] };
}

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
      "Why Fin & Stem exists, how the catalogue is sourced, and the references, brands and retailers behind it.",
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
        {about.references.groups.map((group) => (
          <div key={group.title} className="mt-12">
            <h3 className="text-display-tight text-xl sm:text-2xl">{group.title}</h3>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass glass-edge lift group flex flex-col gap-2 rounded-2xl p-6 no-underline transition-colors hover:border-[var(--brand)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <h4 className="text-base font-semibold tracking-tight transition-colors group-hover:text-[var(--brand)]">
                    {item.name}
                  </h4>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand)]">
                    {item.role}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.note}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-medium text-[var(--brand)] transition-colors group-hover:text-foreground">
                    Visit website
                    <ArrowUpRight
                      className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </SectionShell>

      {/* Brands and retailers behind the gear catalogue */}
      <SectionShell id="suppliers" className="border-t border-border/60">
        <SectionHeading
          eyebrow="Suppliers"
          title="Brands in our gear catalogue."
          subtitle={`The ${GEAR.length} products in the gear catalogue come from these brands. Specs come from the makers' own published figures or a major retailer's listing, and product photos are supplied by the brands and their distributors. Fin & Stem is not a shop and is not paid to feature anyone.`}
        />
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GEAR_BRANDS.map((b) => {
            const stats = brandStats(b.brand);
            if (stats.count === 0) return null;
            return (
              <div
                key={b.brand}
                className="glass glass-edge flex flex-col gap-2 rounded-2xl p-6"
              >
                <div className="flex min-h-10 items-center justify-between gap-3">
                  <BrandLogo brand={b.brand} className="h-9 max-w-[9.5rem]" />
                  <span className="ml-auto text-xs text-muted-foreground">{b.country}</span>
                </div>
                <h3 className="text-base font-semibold tracking-tight">{b.brand}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{b.note}</p>
                <p className="text-xs text-foreground/80">
                  {stats.count} {stats.count === 1 ? "product" : "products"} in{" "}
                  {stats.categories.map((c) => GEAR_CATEGORIES[c].label).join(", ")}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-4 pt-2 text-xs font-medium">
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[var(--brand)] hover:text-foreground"
                  >
                    {b.linkLabel ?? `${b.brand} website`}
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </a>
                  {stats.top && (
                    <Link
                      href={`/gear/${stats.top}?brand=${encodeURIComponent(b.brand)}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      See {b.brand} {GEAR_CATEGORIES[stats.top].label}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {LOGO_NOTICE}{" "}Logos are taken from each brand&rsquo;s own website. If you represent a brand and
          would like yours changed or removed,{" "}
          <a href={`mailto:${site.contact.email}`} className="underline underline-offset-2 hover:text-foreground">
            email us
          </a>
          .
        </p>
        <h3 className="text-display-tight mt-14 text-xl sm:text-2xl">Retailers we took specs from</h3>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {GEAR_RETAILERS.map((r) => (
            <a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass glass-edge group flex items-start justify-between gap-3 rounded-2xl p-5 no-underline transition-colors hover:border-[var(--brand)]/40"
            >
              <span>
                <span className="block text-sm font-semibold group-hover:text-[var(--brand)]">{r.name}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{r.note}</span>
              </span>
              <ArrowUpRight className="mt-0.5 size-4 flex-none text-[var(--brand)]" aria-hidden />
            </a>
          ))}
        </div>
      </SectionShell>

      {/* How we rate gear */}
      <SectionShell id="ratings" className="border-t border-border/60 bg-muted/30">
        <SectionHeading
          eyebrow="Ratings"
          title="How we rate gear."
          subtitle="Every product in the gear catalogue shows two quick 1 to 5 ratings so you can see what kind of product you are looking at. They are our estimates, not lab tests, and they are meant as a rough guide alongside the specs."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="glass glass-edge rounded-2xl p-6">
            <h3 className="text-base font-semibold">Price (1 to 5 coins)</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Where a product sits against others in the same category, from 1 (budget) to 5
              (premium). Where we know a typical retail price, it is blended with the brand&rsquo;s
              positioning in the hobby; otherwise we use the brand and product line. Prices differ a
              lot by country, retailer and size, so this shows the type of product, not what you will
              pay.
            </p>
          </div>
          <div className="glass glass-edge rounded-2xl p-6">
            <h3 className="text-base font-semibold">The second rating (1 to 5 dots)</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Whatever matters most for that kind of product. Filters, pumps, CO2 gear and UV units
              show build quality. Tanks, stands and lily pipes show build and finish. Lights show
              plant growth power, worked out from watts per centimetre of fixture. Heaters show
              control and safety features, air pumps show quietness, coolers show cooling power,
              fertilisers show ease of use, and hardscape shows soft-water safety (5 is inert, 1
              raises hardness and pH).
            </p>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Ratings are Fin &amp; Stem estimates based on typical retail prices, brand positioning and
          published specs. We are not paid to rate anything higher, and we adjust ratings when readers
          point out something we got wrong. If you think a rating is off, email{" "}
          <a href={`mailto:${site.contact.email}`} className="underline underline-offset-2 hover:text-foreground">
            {site.contact.email}
          </a>
          .
        </p>
      </SectionShell>
    </>
  );
}
