# Fin & Stem — JSON-LD Schema Templates

Copy each template into `lib/seo/json-ld.ts` as a TypeScript builder function. Every page emits its JSON-LD via a single `<script type="application/ld+json">` block in the page's metadata. Multiple schemas combine inside `@graph`.

Always validate via:
- https://validator.schema.org/
- https://search.google.com/test/rich-results

---

## Species detail page (Plant / Fish / Shrimp / Moss)

```typescript
export function speciesPageJsonLd(species: Species, attribution: ImageAttribution[]) {
  const url = `https://finandstem.com/${species.category}/${species.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        "mainEntityOfPage": url,
        "headline": `${species.commonName} (${species.scientificName}) — Care, Tank Mates, Compatibility`,
        "description": species.tldr,
        "image": species.gallery.map(img => img.url),
        "datePublished": species.publishedAt,
        "dateModified": species.updatedAt,
        "inLanguage": "en",
        "author": {
          "@type": "Person",
          "@id": "https://finandstem.com/about#mike",
          "name": "Mike",
          "url": "https://finandstem.com/about"
        },
        "publisher": {
          "@type": "Organization",
          "@id": "https://finandstem.com/#org",
          "name": "Fin & Stem",
          "url": "https://finandstem.com/",
          "logo": {
            "@type": "ImageObject",
            "url": "https://finandstem.com/logo.png"
          }
        },
        "about": {
          "@type": "Thing",
          "name": species.scientificName,
          "alternateName": [species.commonName, ...(species.alternateNames || [])],
          "sameAs": species.externalIds // Wikidata Q-id, GBIF id, FishBase id if available
        },
        "keywords": species.keywords.join(", "),
        "articleSection": species.category
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://finandstem.com/" },
          { "@type": "ListItem", "position": 2, "name": species.categoryLabel, "item": `https://finandstem.com/${species.category}` },
          { "@type": "ListItem", "position": 3, "name": species.commonName }
        ]
      },
      ...attribution.map(img => ({
        "@type": "ImageObject",
        "contentUrl": img.url,
        "license": img.licenseUrl,
        "acquireLicensePage": img.descriptionUrl,
        "creditText": img.author,
        "creator": { "@type": "Person", "name": img.author },
        "copyrightNotice": img.license
      })),
      {
        "@type": "FAQPage",
        "mainEntity": species.faqs.map(q => ({
          "@type": "Question",
          "name": q.question,
          "acceptedAnswer": { "@type": "Answer", "text": q.answer }
        }))
      }
    ]
  };
}
```

---

## Build journal (`/builds/[slug]`)

```typescript
export function buildJournalJsonLd(build: Build) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        "name": build.title,
        "description": build.tldr,
        "image": build.heroImage,
        "totalTime": build.totalTimeISO, // e.g. "P3M" for 3 months
        "estimatedCost": {
          "@type": "MonetaryAmount",
          "currency": "USD",
          "value": build.totalCostUSD
        },
        "supply": build.supplies.map(s => ({ "@type": "HowToSupply", "name": s.name })),
        "tool": build.tools.map(t => ({ "@type": "HowToTool", "name": t.name })),
        "step": build.steps.map((step, i) => ({
          "@type": "HowToStep",
          "position": i + 1,
          "name": step.title,
          "text": step.description,
          "image": step.image
        })),
        "datePublished": build.publishedAt,
        "dateModified": build.updatedAt,
        "author": { "@type": "Person", "@id": "https://finandstem.com/about#mike" }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://finandstem.com/" },
          { "@type": "ListItem", "position": 2, "name": "Builds", "item": "https://finandstem.com/builds" },
          { "@type": "ListItem", "position": 3, "name": build.title }
        ]
      }
    ]
  };
}
```

---

## Pillar page

```typescript
export function pillarPageJsonLd(pillar: Pillar) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://finandstem.com${pillar.path}#article`,
        "headline": pillar.title,
        "description": pillar.description,
        "datePublished": pillar.publishedAt,
        "dateModified": pillar.updatedAt,
        "author": { "@type": "Person", "@id": "https://finandstem.com/about#mike" },
        "publisher": { "@type": "Organization", "@id": "https://finandstem.com/#org" }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://finandstem.com/" },
          { "@type": "ListItem", "position": 2, "name": pillar.title }
        ]
      },
      {
        "@type": "ItemList",
        "name": `Species and resources in the ${pillar.title} cluster`,
        "itemListElement": pillar.clusterPages.map((p, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "url": `https://finandstem.com${p.path}`,
          "name": p.title
        }))
      },
      {
        "@type": "FAQPage",
        "mainEntity": pillar.faqs.map(q => ({
          "@type": "Question",
          "name": q.question,
          "acceptedAnswer": { "@type": "Answer", "text": q.answer }
        }))
      }
    ]
  };
}
```

---

## Equipment page (Product)

```typescript
export function equipmentPageJsonLd(item: Equipment) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `https://finandstem.com/equipment/${item.slug}#product`,
        "name": `${item.brand} ${item.model}`,
        "description": item.description,
        "image": item.images.map(i => i.url),
        "brand": { "@type": "Brand", "name": item.brand },
        "category": item.category,
        "review": {
          "@type": "Review",
          "author": { "@type": "Person", "@id": "https://finandstem.com/about#mike" },
          "datePublished": item.reviewDate,
          "reviewBody": item.reviewBody,
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": item.rating,
            "bestRating": 5
          }
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://finandstem.com/" },
          { "@type": "ListItem", "position": 2, "name": "Equipment", "item": "https://finandstem.com/equipment" },
          { "@type": "ListItem", "position": 3, "name": item.brand + " " + item.model }
        ]
      }
    ]
  };
}
```

---

## Author page (`/about`)

```typescript
export const authorPageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://finandstem.com/about#mike",
      "name": "Mike",
      "url": "https://finandstem.com/about",
      "image": "https://finandstem.com/mike-portrait.jpg",
      "jobTitle": "Aquascaper and catalogue author",
      "knowsAbout": [
        "Aquascaping",
        "Planted aquariums",
        "Freshwater shrimp keeping",
        "Aquarium fish compatibility",
        "Biotope aquariums",
        "Aquatic plant cultivation",
        "Aquascape hardscape"
      ],
      "sameAs": [
        // Add real social/profile URLs once they exist
        // "https://www.instagram.com/mike-finandstem",
        // "https://www.reddit.com/user/mike-finandstem"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://finandstem.com/#website",
      "url": "https://finandstem.com/",
      "name": "Fin & Stem",
      "publisher": { "@id": "https://finandstem.com/#org" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://finandstem.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://finandstem.com/#org",
      "name": "Fin & Stem",
      "url": "https://finandstem.com/",
      "logo": "https://finandstem.com/logo.png",
      "founder": { "@id": "https://finandstem.com/about#mike" }
    }
  ]
};
```

---

## Compatibility tool page (`/compatibility`)

```typescript
export const compatibilityToolJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Fin & Stem Compatibility Cross-Reference",
      "url": "https://finandstem.com/compatibility",
      "applicationCategory": "ReferenceApplication",
      "operatingSystem": "Any (web)",
      "description": "Pick any plant, fish, shrimp, or moss and see what is compatible across all four categories based on water parameter overlap and safety flags."
    },
    {
      "@type": "Dataset",
      "name": "Fin & Stem freshwater aquarium compatibility dataset",
      "description": "Cross-reference dataset of compatibility between freshwater plants, fish, shrimp, and mosses, based on water parameter overlap, predation safety, and care similarity.",
      "creator": { "@id": "https://finandstem.com/#org" },
      "license": "https://finandstem.com/about/data-license"
    }
  ]
};
```

---

## Notes for the Claude Code session

- All schema must be emitted server-side (in `generateMetadata` or as inline `<script>` in the layout) so it's visible to crawlers without JS execution.
- Use stable `@id` values per entity — these de-duplicate across pages and help Google build the entity graph.
- Validate every template type once via the validator URLs above before going live with the catalogue.
- The Article schema's `keywords` field is informational only — modern Google ignores it but Bing and AI engines parse it for entity hints.
