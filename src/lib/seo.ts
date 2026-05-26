/**
 * Fin & Stem — JSON-LD schema builders.
 *
 * Every public page emits structured data so search engines and answer
 * engines (ChatGPT, Perplexity, Claude, Google AI Overviews) can parse
 * the catalogue as an entity graph. Builders follow seo/json-ld-templates.md.
 *
 * Conventions
 *  - Use stable `@id` URLs so entities de-duplicate across pages.
 *  - All schemas combine inside a single `@graph` per page.
 *  - Render via the <JsonLd /> component (server-rendered <script>).
 */

import { site } from "@/lib/site";
import type {
  CatalogueCategory,
  CatalogueEntry,
  ImageAttribution,
} from "@/types/catalogue";
import { CATEGORY_META } from "@/types/catalogue";
import { getEntryDates, getPillarDates } from "@/data/timestamps";

const PERSON_ID = `${site.url}/about#mike`;
const ORG_ID = `${site.url}/#org`;
const WEBSITE_ID = `${site.url}/#website`;

/** Author Person (Mike). Reused everywhere we cite an author. */
export function authorRef() {
  return { "@id": PERSON_ID };
}

export function organizationRef() {
  return { "@id": ORG_ID };
}

export function personEntity() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: site.owner.name,
    url: `${site.url}/about`,
    jobTitle: "Aquascaper and catalogue author",
    knowsAbout: [
      "Aquascaping",
      "Planted aquariums",
      "Freshwater shrimp keeping",
      "Aquarium fish compatibility",
      "Biotope aquariums",
      "Aquatic plant cultivation",
      "Aquarium hardscape",
    ],
    sameAs: [] as string[],
  };
}

export function organizationEntity() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    url: site.url,
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/fin-and-stem-logo.png`,
    },
    founder: authorRef(),
  };
}

export function websiteEntity() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: site.url,
    name: site.name,
    description: site.description,
    publisher: organizationRef(),
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/* ─── Breadcrumbs ─────────────────────────────────────────────────────── */

export interface CrumbItem {
  name: string;
  href?: string;
}

export function breadcrumbsJsonLd(crumbs: CrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: c.href.startsWith("http") ? c.href : `${site.url}${c.href}` } : {}),
    })),
  };
}

/* ─── Catalogue entry (species) ───────────────────────────────────────── */

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SourceItem {
  label: string;
  url: string;
}

export interface SpeciesSchemaInput {
  entry: CatalogueEntry;
  tldr: string;
  faqs: ReadonlyArray<FaqItem>;
  images: ReadonlyArray<ImageAttribution>;
  keywords?: ReadonlyArray<string>;
}

export function speciesPageJsonLd({
  entry,
  tldr,
  faqs,
  images,
  keywords,
}: SpeciesSchemaInput) {
  const meta = CATEGORY_META[entry.category];
  const url = `${site.url}${meta.path}/${entry.slug}`;
  const imageList = images
    .map((i) => (i.src.startsWith("http") ? i.src : `${site.url}${i.src}`))
    .slice(0, 6);
  const { publishedAt, updatedAt } = getEntryDates(entry.slug);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        mainEntityOfPage: url,
        url,
        headline: `${entry.commonName} (${entry.scientificName}) — Care, Tank Mates, Compatibility`,
        description: tldr,
        image: imageList.length > 0 ? imageList : undefined,
        datePublished: publishedAt,
        dateModified: updatedAt,
        inLanguage: "en",
        author: personEntity(),
        publisher: organizationEntity(),
        // When Mike has personally kept this species, signal first-hand
        // review — a strong E-E-A-T cue for both Google and AI Overviews.
        ...(entry.keptByAuthor && { reviewedBy: authorRef() }),
        about: {
          "@type": "Thing",
          name: entry.scientificName,
          alternateName: [entry.commonName],
        },
        keywords: (keywords ?? defaultKeywords(entry)).join(", "),
        articleSection: meta.label,
      },
      breadcrumbsJsonLd([
        { name: "Home", href: "/" },
        { name: meta.label, href: meta.path },
        { name: entry.commonName },
      ]),
      ...images.map((img) => ({
        "@type": "ImageObject",
        contentUrl: img.src.startsWith("http") ? img.src : `${site.url}${img.src}`,
        license: img.licenseUrl,
        acquireLicensePage: img.descriptionUrl,
        creditText: img.author,
        creator: img.author ? { "@type": "Person", name: img.author } : undefined,
        copyrightNotice: img.license,
      })),
      faqs.length > 0
        ? {
            "@type": "FAQPage",
            "@id": `${url}#faq`,
            mainEntity: faqs.map((q) => ({
              "@type": "Question",
              name: q.question,
              acceptedAnswer: { "@type": "Answer", text: q.answer },
            })),
          }
        : null,
    ].filter(Boolean),
  };
}

function defaultKeywords(entry: CatalogueEntry): string[] {
  const base = [
    entry.commonName,
    entry.scientificName,
    `${entry.commonName} care`,
    `${entry.commonName} tank mates`,
    `${entry.commonName} aquarium`,
    `planted tank ${entry.category}`,
  ];
  switch (entry.category) {
    case "fish":
      return [...base, `${entry.commonName} minimum tank size`, `${entry.commonName} water parameters`];
    case "plants":
      return [...base, `${entry.commonName} CO2`, `${entry.commonName} light requirements`];
    case "shrimp":
      return [...base, `${entry.commonName} breeding`, `${entry.commonName} TDS`];
    case "mosses":
      return [...base, `${entry.commonName} attachment`, `${entry.commonName} aquascape`];
  }
}

/* ─── Pillar pages ────────────────────────────────────────────────────── */

export interface PillarItem {
  name: string;
  url: string;
}

export interface PillarSchemaInput {
  path: string;
  title: string;
  description: string;
  tldr: string;
  faqs: ReadonlyArray<FaqItem>;
  cluster: ReadonlyArray<PillarItem>;
  /** Slug used to look up per-pillar publish + update timestamps. */
  slug: string;
}

export function pillarPageJsonLd({
  path,
  title,
  description,
  tldr,
  faqs,
  cluster,
  slug,
}: PillarSchemaInput) {
  const url = `${site.url}${path}`;
  const { publishedAt, updatedAt } = getPillarDates(slug);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        mainEntityOfPage: url,
        url,
        headline: title,
        description: tldr || description,
        datePublished: publishedAt,
        dateModified: updatedAt,
        inLanguage: "en",
        author: personEntity(),
        publisher: organizationEntity(),
      },
      breadcrumbsJsonLd([
        { name: "Home", href: "/" },
        { name: title },
      ]),
      {
        "@type": "ItemList",
        name: `${title} — cluster pages`,
        itemListElement: cluster.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: p.url.startsWith("http") ? p.url : `${site.url}${p.url}`,
          name: p.name,
        })),
      },
      faqs.length > 0
        ? {
            "@type": "FAQPage",
            "@id": `${url}#faq`,
            mainEntity: faqs.map((q) => ({
              "@type": "Question",
              name: q.question,
              acceptedAnswer: { "@type": "Answer", text: q.answer },
            })),
          }
        : null,
    ].filter(Boolean),
  };
}

/* ─── Category index pages (CollectionPage) ───────────────────────────── */

export function categoryIndexJsonLd(category: CatalogueCategory, entries: ReadonlyArray<CatalogueEntry>) {
  const meta = CATEGORY_META[category];
  const url = `${site.url}${meta.path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        url,
        name: `${meta.label} — Fin & Stem catalogue`,
        description: `Browse Fin & Stem's full catalogue of ${entries.length} ${meta.label.toLowerCase()} profiles, each cross-referenced for compatibility with plants, fish, shrimp, and mosses.`,
        publisher: organizationRef(),
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
      },
      breadcrumbsJsonLd([
        { name: "Home", href: "/" },
        { name: meta.label },
      ]),
      {
        "@type": "ItemList",
        itemListElement: entries.slice(0, 100).map((e, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${site.url}${meta.path}/${e.slug}`,
          name: e.commonName,
        })),
      },
    ],
  };
}

/* ─── /about ──────────────────────────────────────────────────────────── */

export function aboutPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [personEntity(), websiteEntity(), organizationEntity()],
  };
}

/* ─── /compatibility ──────────────────────────────────────────────────── */

export function compatibilityToolJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${site.url}/compatibility#app`,
        name: "Fin & Stem Compatibility Cross-Reference",
        url: `${site.url}/compatibility`,
        applicationCategory: "ReferenceApplication",
        operatingSystem: "Any (web)",
        description:
          "Pick any plant, fish, shrimp, or moss and see what is compatible across all four categories based on water-parameter overlap and safety flags.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        publisher: organizationRef(),
      },
      {
        "@type": "Dataset",
        "@id": `${site.url}/compatibility#dataset`,
        name: "Fin & Stem freshwater aquarium compatibility dataset",
        description:
          "Cross-reference dataset of compatibility between freshwater plants, fish, shrimp, and mosses, based on water parameter overlap, predation safety, and care similarity.",
        creator: organizationRef(),
        license: `${site.url}/legal/terms`,
        keywords: [
          "freshwater aquarium",
          "compatibility",
          "planted tank",
          "aquascaping",
          "fish",
          "plants",
          "shrimp",
          "moss",
        ].join(", "),
      },
      breadcrumbsJsonLd([
        { name: "Home", href: "/" },
        { name: "Compatibility" },
      ]),
    ],
  };
}

/* ─── Build journals ──────────────────────────────────────────────────── */

import type { BuildJournal } from "@/types/builds";

/**
 * Build journal — emits HowTo + BreadcrumbList per seo/json-ld-templates.md.
 *
 * Build journals are the editorial moat: first-hand multi-week tank
 * builds with photos, parts lists, and timelines. HowTo gives Google
 * the steps-and-supplies rich-result eligibility.
 */
export function buildJournalJsonLd(build: BuildJournal) {
  const url = `${site.url}/builds/${build.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        "@id": `${url}#howto`,
        name: build.title,
        description: build.tldr,
        image: build.heroImage
          ? build.heroImage.startsWith("http")
            ? build.heroImage
            : `${site.url}${build.heroImage}`
          : undefined,
        totalTime: build.totalTimeIso,
        estimatedCost: build.estimatedCostUsd
          ? {
              "@type": "MonetaryAmount",
              currency: "USD",
              value: build.estimatedCostUsd,
            }
          : undefined,
        supply: build.supplies.map((s) => ({
          "@type": "HowToSupply",
          name: s.name,
        })),
        step: build.steps.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.title,
          text: step.description,
          image: step.image
            ? step.image.startsWith("http")
              ? step.image
              : `${site.url}${step.image}`
            : undefined,
        })),
        datePublished: build.publishedAt,
        dateModified: build.updatedAt,
        author: personEntity(),
        publisher: organizationEntity(),
        inLanguage: "en",
      },
      breadcrumbsJsonLd([
        { name: "Home", href: "/" },
        { name: "Build journals", href: "/builds" },
        { name: build.title },
      ]),
    ],
  };
}

/**
 * /builds index page JSON-LD — CollectionPage + ItemList for the hub URL.
 */
export function buildsIndexJsonLd(items: ReadonlyArray<BuildJournal>) {
  const url = `${site.url}/builds`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        url,
        name: "Build journals — Fin & Stem",
        description:
          "First-hand tank-build journals from Fin & Stem — week-by-week timelines, parts lists, and photographs of real planted aquariums under construction and after they've matured.",
        publisher: organizationRef(),
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
      },
      breadcrumbsJsonLd([
        { name: "Home", href: "/" },
        { name: "Build journals" },
      ]),
      ...(items.length > 0
        ? [
            {
              "@type": "ItemList",
              itemListElement: items.map((b, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${site.url}/builds/${b.slug}`,
                name: b.title,
              })),
            },
          ]
        : []),
    ],
  };
}

/* ─── Site-wide (root layout) ─────────────────────────────────────────── */

export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [websiteEntity(), organizationEntity()],
  };
}

/* ─── Homepage ────────────────────────────────────────────────────────── */

/**
 * Homepage-specific JSON-LD. Adds a WebPage entity (ties this URL into
 * the WebSite graph already emitted from the layout) plus a top-level
 * BreadcrumbList so Google can render the home crumb in SERPs.
 */
export function homePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${site.url}/#webpage`,
        url: `${site.url}/`,
        name: `${site.name} — ${site.tagline}`,
        description: site.description,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        publisher: organizationRef(),
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${site.url}/fin-and-stem-logo.png`,
        },
      },
      breadcrumbsJsonLd([{ name: "Home" }]),
    ],
  };
}
