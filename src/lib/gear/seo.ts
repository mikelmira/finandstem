import { site } from "@/lib/site";
import { breadcrumbsJsonLd, organizationEntity, organizationRef } from "@/lib/seo";
import type { GearProduct } from "@/types/gear";
import type { GearCategoryMeta } from "@/lib/gear/categories";
import { DISPLAY_LABEL, displayValue } from "@/lib/gear/fields";
import { GEAR_UPDATED, gearPath, gearTitle } from "@/lib/gear";
import type { Metadata } from "next";
import type { GearCategory } from "@/types/gear";

/** The root layout appends ", Fin & Stem" (12 characters) to every title. */
const SUFFIX = 12;
const MAX = 60;

/**
 * Pick the most descriptive title that still fits in ~60 characters with
 * the site suffix; fall back to an absolute title without the suffix.
 */
export function fitTitle(candidates: string[]): Metadata["title"] {
  for (const c of candidates) if (c.length + SUFFIX <= MAX) return c;
  const short = candidates[candidates.length - 1];
  return { absolute: short };
}

/** Search-intent titles for category pages (template adds the site name). */
export const CATEGORY_SEO_TITLE: Record<GearCategory, string> = {
  aquariums: "Aquariums compared by size and volume",
  filters: "Aquarium filters compared by tank size",
  lights: "Planted tank lights compared by tank length",
  co2: "Aquarium CO2 regulators, diffusers and kits",
  fertilisers: "Aquarium plant fertilisers and treatments compared",
  heaters: "Aquarium heaters compared by tank size",
  cooling: "Aquarium chillers and cooling fans compared",
  pumps: "Aquarium pumps and wavemakers compared",
  "air-pumps": "Aquarium air pumps compared by tank size",
  sterilisers: "Aquarium UV sterilisers compared",
  plumbing: "Lily pipes and surface skimmers compared",
  stands: "Aquarium stands and cabinets compared",
  paludarium: "Paludarium gear",
  tools: "Aquascaping tools",
  feeders: "Aquarium feeders",
  hardscape: "Aquascaping stone, wood and bonsai trees",
};

function faqJsonLd(url: string, faqs: ReadonlyArray<{ question: string; answer: string }>) {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export const GEAR_HUB_FAQS: { question: string; answer: string }[] = [
  {
    question: "What equipment do I need for a planted aquarium?",
    answer:
      "A tank and a stand that can carry it, a filter rated at about 5 to 10 times the tank volume per hour, a light made for the tank's length, and a heater of roughly 1 watt per litre if you keep tropical fish. Add pressurised CO2 only if you want high light and demanding plants, and choose hardscape and substrate that suit the water you want.",
  },
  {
    question: "How do I know which filter fits my tank?",
    answer:
      "Multiply your tank volume by 5 and by 10: a filter rated inside that range per hour suits a planted tank. A 60 litre tank wants about 300 to 600 L/h. The filter page's tank-size matcher does this for you and shows which model of each filter fits.",
  },
  {
    question: "What size light do I need?",
    answer:
      "One made for your tank length, the same length or a little shorter. Then match the output to your plants: low light for ferns, anubias and crypts, medium for most stem plants, and high light only alongside injected CO2.",
  },
  {
    question: "Can I compare aquarium products side by side?",
    answer:
      "Yes. Tap Compare on up to four products in the same category, then open the compare table. Every published spec lines up in one table, and you can pick the size of each product.",
  },
  {
    question: "Where do the product specs come from?",
    answer:
      "From the makers' published specifications or a major retailer's listing, checked where we could. Fin & Stem is not a shop and is not paid to rank anything in the catalogue. Makers revise products, so confirm figures before you buy.",
  },
];

export const GEAR_COMPARE_FAQS: { question: string; answer: string }[] = [
  {
    question: "How many products can I compare at once?",
    answer:
      "Up to four, all from the same category, so every row in the table measures the same thing.",
  },
  {
    question: "How do I compare different sizes of the same product?",
    answer:
      "Each column with several sizes has a model picker. Choose the size you would buy and the specs update. You can also add the same product line twice if the maker sells it as separate products.",
  },
  {
    question: "Why is there a dash in some cells?",
    answer:
      "A dash means the maker does not publish that figure. It does not mean zero, so check the product page or ask the retailer if that spec matters to you.",
  },
  {
    question: "Is the rated filter flow what I will actually get?",
    answer:
      "No. Rated flow is measured with an empty filter and no hoses. With media, hoses and height to the tank, real flow is often 30 to 50 percent lower, so compare filters against each other and use the category matcher for your tank size.",
  },
];

export function gearHubJsonLd(
  categories: ReadonlyArray<{ meta: GearCategoryMeta; count: number }>,
) {
  const url = `${site.url}/gear`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        url,
        name: "Aquarium gear catalogue",
        description:
          "Planted-aquarium equipment and hardscape with real specs: filters, lights, CO2, heaters, tanks and more, matched to your tank size.",
        publisher: organizationRef(),
        inLanguage: "en",
      },
      {
        "@type": "ItemList",
        itemListElement: categories.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.meta.label,
          item: `${site.url}/gear/${c.meta.id}`,
        })),
      },
      faqJsonLd(url, GEAR_HUB_FAQS),
    ],
  };
}

export function gearCategoryJsonLd(meta: GearCategoryMeta, products: ReadonlyArray<GearProduct>) {
  const url = `${site.url}/gear/${meta.id}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        url,
        name: CATEGORY_SEO_TITLE[meta.id],
        description: meta.intro,
        dateModified: GEAR_UPDATED,
        publisher: organizationRef(),
        inLanguage: "en",
      },
      breadcrumbsJsonLd(
        [
          { name: "Home", href: "/" },
          { name: "Gear", href: "/gear" },
          { name: meta.label },
        ],
        url,
      ),
      {
        "@type": "ItemList",
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: gearTitle(p),
          item: `${site.url}${gearPath(p)}`,
        })),
      },
      faqJsonLd(url, meta.faqs),
    ],
  };
}

export function gearProductJsonLd(
  p: GearProduct,
  meta: GearCategoryMeta,
  faqs: ReadonlyArray<{ question: string; answer: string }>,
) {
  const url = `${site.url}${gearPath(p)}`;
  const props: { "@type": "PropertyValue"; name: string; value: string }[] = [];
  if (p.models.length === 1) {
    for (const f of meta.tableFields) {
      const v = displayValue(p.models[0], f);
      if (v) props.push({ "@type": "PropertyValue", name: DISPLAY_LABEL[f], value: v });
    }
  } else {
    props.push({
      "@type": "PropertyValue",
      name: "Models",
      value: p.models.map((m) => m.name).join(", "),
    });
  }
  for (const [k, v] of Object.entries(p.specs)) {
    props.push({ "@type": "PropertyValue", name: k, value: v });
  }
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: `${gearTitle(p)} specs and sizes`,
        description: p.summary,
        inLanguage: "en",
        isPartOf: { "@id": `${site.url}/#website` },
        author: organizationRef(),
        publisher: organizationEntity(),
        mainEntity: { "@id": `${url}#product` },
        dateModified: GEAR_UPDATED,
        primaryImageOfPage: p.images[0] ? `${site.url}${p.images[0].src}` : undefined,
      },
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: gearTitle(p),
        brand: { "@type": "Brand", name: p.brand },
        category: meta.label,
        description: p.summary,
        image: p.images.map((i) => `${site.url}${i.src}`),
        additionalProperty: props,
      },
      breadcrumbsJsonLd(
        [
          { name: "Home", href: "/" },
          { name: "Gear", href: "/gear" },
          { name: meta.label, href: `/gear/${meta.id}` },
          { name: gearTitle(p) },
        ],
        url,
      ),
      faqJsonLd(url, faqs),
    ],
  };
}
