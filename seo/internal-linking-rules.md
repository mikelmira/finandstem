# Fin & Stem — Internal Linking Rules

Internal linking is the "rim" that holds the topic-cluster wheel together. Every page links into the cluster. Every cluster page links to the pillar. Every pillar links to the catalogue.

These rules are non-negotiable for catalogue and guide pages. Implement them in helper functions under `lib/seo/internal-links.ts` so they're automatic, not manual.

---

## Rule 1: Every species page must link to the pillar

In the body content, exactly once near the top (after the spec table) and once near the bottom (after FAQs):

> "For the full context, read **[the Complete Planted Aquarium Guide](/planted-tank-guide)**."

Anchor text **must** contain the pillar's target keyword.

## Rule 2: Every species page must link sideways to ≥3 compatible species

In the "Compatibility" section. Anchor text uses both common and scientific name:

> "…compatible with **[cherry shrimp (*Neocaridina davidi*)](/shrimp/cherry-shrimp)**, **[pygmy corydoras (*Corydoras pygmaeus*)](/fish/pygmy-corydoras)**, and **[Java moss (*Taxiphyllum barbieri*)](/mosses/java-moss)**."

This is auto-generated from the `compatibleWith` field on the species record. Never less than 3 links per species page.

## Rule 3: Every species page must link to ≥1 build journal that features it

In the "Featured in Builds" section. If no build features the species yet, omit the section (don't write a placeholder).

## Rule 4: Every build journal must link to every catalogue item it uses

In the "What's in the Tank" section. Each species/plant/equipment item is a linked card with common name, scientific name italicised, and a small image.

## Rule 5: Every pillar page must list every catalogue entry in its cluster

In an `ItemList` at the bottom of the pillar. This is the canonical "spokes" inventory. Pillar pages with fewer than 10 spokes are not yet pillars — keep adding content.

## Rule 6: Every guide page must link to ≥1 species in the catalogue

If a guide mentions a species without linking to its catalogue page, it's an error. Make these links inline within prose, not just at the bottom.

## Rule 7: Every guide page must link up to ≥1 pillar

Same rule as species pages. Pillar link near the top OR bottom of the guide.

## Rule 8: The compatibility tool gets a link from every species page

In the "Compatibility" section, after the listed compatible species, a single sentence:

> "→ **[Find all compatible plants, fish, and shrimp for this species](/compatibility?anchor=fish:neon-tetra)**"

## Rule 9: Anchor text variety, not exact repeats

Don't link to the same target page from the same source page more than twice with the same anchor text. Vary it. (Google's algorithms flag exact-match-anchor patterns as manipulative when overused.)

| Same target, different anchors |
|---|
| "Read more about [neon tetras](/fish/neon-tetra)" |
| "[*Paracheirodon innesi*](/fish/neon-tetra) prefers soft acidic water" |
| "the [neon tetra care guide](/fish/neon-tetra) covers feeding in detail" |

## Rule 10: Breadcrumb is mandatory, schema.org-marked, and visible

Every page below the homepage has a visible breadcrumb at the top AND emits `BreadcrumbList` JSON-LD. See `seo/json-ld-templates.md` for the schema.

## Rule 11: External links open in same tab unless they're affiliate / sponsored

Internal links: always same tab.
External non-affiliate: same tab.
External affiliate / sponsored: `rel="sponsored noopener"` + `target="_blank"`.
External author social profiles (Mike's): `rel="me"` for relmeauth signals.

## Rule 12: Never orphan a page

Every published page must be reachable from at least 2 other pages within 3 clicks of the homepage. Run a monthly audit using `next sitemap` output or Screaming Frog free tier.

---

## Helper function signature (TypeScript)

```typescript
// lib/seo/internal-links.ts

export function pillarLinkFor(category: SpeciesCategory): InternalLink {
  switch (category) {
    case 'plants': return { href: '/planted-tank-guide', anchor: 'Complete Planted Aquarium Guide' };
    case 'fish': return { href: '/aquarium-fish-guide', anchor: 'Aquarium Fish Compatibility Guide' };
    case 'shrimp': return { href: '/freshwater-shrimp-guide', anchor: 'Freshwater Shrimp Keeping Guide' };
    case 'mosses': return { href: '/aquatic-moss-guide', anchor: 'Aquatic Moss Guide' };
  }
}

export function compatibilityToolLinkFor(species: Species): InternalLink {
  return {
    href: `/compatibility?anchor=${species.category}:${species.slug}`,
    anchor: `Find compatible species for ${species.commonName}`
  };
}

export function compatibleSpeciesLinks(species: Species, limit = 6): InternalLink[] {
  // Pull from species.compatibleWith (polymorphic relationship)
  // Build "Common Name (Scientific Name)" anchor text per link
  // Return up to `limit` links across categories
}

export function buildsFeaturing(species: Species): InternalLink[] {
  // Query Builds collection where this species is in plantsUsed/fishUsed/etc.
}
```

These helpers are called by each page template so the linking happens automatically — no manual error opportunities.
