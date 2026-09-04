/**
 * Fin & Stem, JSON-LD schema builders.
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

/**
 * Resolve a crumb's `href` to an absolute URL.
 *
 * Google's BreadcrumbList rich-result spec requires `item` on EVERY
 * `ListItem` — including the last (current) breadcrumb. Previously
 * the last crumb omitted `item` because it's the current page, but
 * that trips a "Missing field 'item'" error in Search Console.
 *
 * If a crumb has no `href`, we fall back to `currentUrl` (when the
 * caller supplied it), then to the site root.
 */
function resolveCrumbHref(
  href: string | undefined,
  currentUrl: string | undefined,
): string {
  if (href) {
    return href.startsWith("http") ? href : `${site.url}${href}`;
  }
  if (currentUrl) {
    return currentUrl.startsWith("http") ? currentUrl : `${site.url}${currentUrl}`;
  }
  return site.url;
}

/**
 * Emit a BreadcrumbList JSON-LD block.
 *
 * `currentUrl` should be the page's own canonical URL, used to fill in
 * `item` on the last (current page) crumb. Callers that don't pass it
 * get the site-root fallback, which is valid but less useful for Google.
 */
export function breadcrumbsJsonLd(crumbs: CrumbItem[], currentUrl?: string) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: resolveCrumbHref(c.href, currentUrl),
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
        headline: `${entry.commonName} (${entry.scientificName}), Care, Tank Mates, Compatibility`,
        description: tldr,
        image: imageList.length > 0 ? imageList : undefined,
        datePublished: publishedAt,
        dateModified: updatedAt,
        inLanguage: "en",
        author: personEntity(),
        publisher: organizationEntity(),
        about: {
          "@type": "Thing",
          name: entry.scientificName,
          alternateName: [entry.commonName],
        },
        keywords: (keywords ?? defaultKeywords(entry)).join(", "),
        articleSection: meta.label,
      },
      breadcrumbsJsonLd(
        [
          { name: "Home", href: "/" },
          { name: meta.label, href: meta.path },
          { name: entry.commonName },
        ],
        url,
      ),
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
    case "snails":
      return [...base, `${entry.commonName} algae`, `${entry.commonName} breeding`];
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
      breadcrumbsJsonLd(
        [
          { name: "Home", href: "/" },
          { name: title },
        ],
        url,
      ),
      {
        "@type": "ItemList",
        name: `${title}, cluster pages`,
        itemListElement: cluster.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.name,
          item: p.url.startsWith("http") ? p.url : `${site.url}${p.url}`,
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
        name: `${meta.label}, Fin & Stem catalogue`,
        description: `Browse Fin & Stem's full catalogue of ${entries.length} ${meta.label.toLowerCase()} profiles, each cross-referenced for compatibility with plants, fish, shrimp, and mosses.`,
        publisher: organizationRef(),
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
      },
      breadcrumbsJsonLd(
        [
          { name: "Home", href: "/" },
          { name: meta.label },
        ],
        url,
      ),
      {
        "@type": "ItemList",
        itemListElement: entries.slice(0, 100).map((e, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: e.commonName,
          item: `${site.url}${meta.path}/${e.slug}`,
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
      breadcrumbsJsonLd(
        [
          { name: "Home", href: "/" },
          { name: "Compatibility" },
        ],
        `${site.url}/compatibility`,
      ),
    ],
  };
}

/* ─── Guides (MDX articles) ───────────────────────────────────────────── */

import type { GuideFrontmatter } from "@/types/guide";

export interface GuideSchemaInput {
  guide: GuideFrontmatter;
  /** Falls back to `guide.description` if empty. */
  tldr: string;
  faqs: ReadonlyArray<FaqItem>;
  /** Computed at render time so the schema mirrors the rendered body. */
  wordCount: number;
}

export function guidePageJsonLd({ guide, tldr, faqs, wordCount }: GuideSchemaInput) {
  const url = `${site.url}/guides/${guide.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        mainEntityOfPage: url,
        url,
        headline: guide.title,
        description: guide.description || tldr,
        datePublished: guide.publishedAt,
        dateModified: guide.updatedAt,
        inLanguage: "en",
        wordCount,
        author: personEntity(),
        publisher: organizationEntity(),
        keywords: guide.keywords.join(", "),
        articleSection: "Guides",
        ...(guide.heroImage
          ? {
              image: [
                guide.heroImage.startsWith("http")
                  ? guide.heroImage
                  : `${site.url}${guide.heroImage}`,
              ],
            }
          : {}),
      },
      breadcrumbsJsonLd(
        [
          { name: "Home", href: "/" },
          { name: "Guides", href: "/guides" },
          { name: guide.title },
        ],
        url,
      ),
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

export interface ComparisonSchemaInput {
  title: string;
  description: string;
  /** versus slug, e.g. "neon-tetra-vs-ember-tetra" */
  slug: string;
  faqs: ReadonlyArray<FaqItem>;
  aSlug: string;
  bSlug: string;
  aName: string;
  bName: string;
}

/** Article + BreadcrumbList + FAQPage for a /compare/[versus] page. */
export function comparisonPageJsonLd({
  title,
  description,
  slug,
  faqs,
  aSlug,
  bSlug,
  aName,
  bName,
}: ComparisonSchemaInput) {
  const url = `${site.url}/compare/${slug}`;
  const a = getEntryDates(aSlug);
  const b = getEntryDates(bSlug);
  const datePublished =
    [a.publishedAt, b.publishedAt].sort().at(-1) ?? a.publishedAt;
  const dateModified = [a.updatedAt, b.updatedAt].sort().at(-1) ?? a.updatedAt;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        mainEntityOfPage: url,
        url,
        headline: title,
        description,
        datePublished,
        dateModified,
        inLanguage: "en",
        author: personEntity(),
        publisher: organizationEntity(),
        articleSection: "Comparisons",
        about: [aName, bName],
      },
      breadcrumbsJsonLd(
        [
          { name: "Home", href: "/" },
          { name: "Compare", href: "/compare" },
          { name: title },
        ],
        url,
      ),
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

export interface TankMatesSchemaInput {
  anchorSlug: string;
  anchorName: string;
  anchorCategory: CatalogueCategory;
  title: string;
  description: string;
  faqs: ReadonlyArray<FaqItem>;
}

/** Article + BreadcrumbList + FAQPage for a /{category}/[slug]/tank-mates page. */
export function tankMatesPageJsonLd({
  anchorSlug,
  anchorName,
  anchorCategory,
  title,
  description,
  faqs,
}: TankMatesSchemaInput) {
  const cat = CATEGORY_META[anchorCategory];
  const speciesUrl = `${site.url}${cat.path}/${anchorSlug}`;
  const url = `${speciesUrl}/tank-mates`;
  const { publishedAt, updatedAt } = getEntryDates(anchorSlug);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        mainEntityOfPage: url,
        url,
        headline: title,
        description,
        datePublished: publishedAt,
        dateModified: updatedAt,
        inLanguage: "en",
        author: personEntity(),
        publisher: organizationEntity(),
        articleSection: "Tank mates",
        about: anchorName,
      },
      breadcrumbsJsonLd(
        [
          { name: "Home", href: "/" },
          { name: cat.label, href: cat.path },
          { name: anchorName, href: `${cat.path}/${anchorSlug}` },
          { name: "Tank mates" },
        ],
        url,
      ),
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

export interface TankGuideSchemaInput {
  litres: number;
  slug: string; // e.g. "20-litres"
  title: string;
  description: string;
  faqs: ReadonlyArray<FaqItem>;
}

/** Article + BreadcrumbList + FAQPage for a /tanks/[size] page. */
export function tankGuidePageJsonLd({
  litres,
  slug,
  title,
  description,
  faqs,
}: TankGuideSchemaInput) {
  const url = `${site.url}/tanks/${slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        mainEntityOfPage: url,
        url,
        headline: title,
        description,
        inLanguage: "en",
        author: personEntity(),
        publisher: organizationEntity(),
        articleSection: "Tank guides",
        about: `${litres} litre aquarium`,
      },
      breadcrumbsJsonLd(
        [
          { name: "Home", href: "/" },
          { name: "Tank sizes", href: "/tanks" },
          { name: `${litres} litre tank` },
        ],
        url,
      ),
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

export function guidesIndexJsonLd(items: ReadonlyArray<GuideFrontmatter>) {
  const url = `${site.url}/guides`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        url,
        name: "Guides, Fin & Stem",
        description:
          "Long-form articles answering the specific questions aquascapers ask, compatibility, comparisons, setups, biotopes, and FAQ deep-dives.",
        publisher: organizationRef(),
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
      },
      breadcrumbsJsonLd(
        [{ name: "Home", href: "/" }, { name: "Guides" }],
        url,
      ),
      ...(items.length > 0
        ? [
            {
              "@type": "ItemList",
              itemListElement: items.map((g, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: g.title,
                item: `${site.url}/guides/${g.slug}`,
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
        name: `${site.name}, ${site.tagline}`,
        description: site.description,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        publisher: organizationRef(),
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${site.url}/fin-and-stem-logo.png`,
        },
      },
      breadcrumbsJsonLd([{ name: "Home", href: "/" }], `${site.url}/`),
    ],
  };
}
