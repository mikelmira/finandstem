import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { fish, plants, shrimp, mosses, snails, substrates } from "@/data";
import { getEntryDates } from "@/data/timestamps";
import { listGuides } from "@/lib/guides";
import { comparisonPairs } from "@/lib/catalogue/comparisons";
import { generatedTanks, tankSizeSlug } from "@/lib/catalogue/tank-picks";
import { ALGAE } from "@/data/algae";
import { HARDSCAPE } from "@/data/hardscape";

/**
 * sitemap.ts, mirror of /seo/sitemap-plan.md.
 *
 * Priority ladder:
 *  1.0  Homepage
 *  0.95 Pillar guides (highest-value editorial)
 *  0.9  Category index pages
 *  0.8  Catalogue detail pages
 *  0.7  Tools (compatibility, planner, compare)
 *  0.6  About
 *  0.5  Contact
 *  0.3  Legal
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

  const staticPaths: ReadonlyArray<{
    path: string;
    priority: number;
    freq: Freq;
  }> = [
    { path: "", priority: 1, freq: "weekly" },

    // Pillar guides
    { path: "/planted-tank-guide", priority: 0.95, freq: "monthly" },
    { path: "/aquarium-fish-guide", priority: 0.95, freq: "monthly" },
    { path: "/freshwater-shrimp-guide", priority: 0.95, freq: "monthly" },
    { path: "/aquatic-moss-guide", priority: 0.95, freq: "monthly" },
    { path: "/aquarium-hardscape-guide", priority: 0.95, freq: "monthly" },
    { path: "/aquarium-equipment-guide", priority: 0.95, freq: "monthly" },

    // Catalogue indexes
    { path: "/fish", priority: 0.9, freq: "weekly" },
    { path: "/plants", priority: 0.9, freq: "weekly" },
    { path: "/shrimp", priority: 0.9, freq: "weekly" },
    { path: "/mosses", priority: 0.9, freq: "weekly" },
    { path: "/snails", priority: 0.9, freq: "weekly" },
    { path: "/substrates", priority: 0.9, freq: "weekly" },

    // Long-form guides hub
    { path: "/guides", priority: 0.9, freq: "weekly" },

    // History feature page — single editorial reference piece
    { path: "/history-of-aquascaping", priority: 0.85, freq: "yearly" },

    // Tools
    { path: "/compatibility", priority: 0.7, freq: "weekly" },
    { path: "/planner", priority: 0.7, freq: "weekly" },
    { path: "/compare", priority: 0.7, freq: "weekly" },

    // Org / footer
    { path: "/about", priority: 0.6, freq: "monthly" },
    { path: "/legal/privacy", priority: 0.3, freq: "yearly" },
    { path: "/legal/terms", priority: 0.3, freq: "yearly" },
  ];

  // Catalogue detail pages with real per-entry lastModified timestamps so
  // Google can detect freshness without re-crawling every URL.
  type CatalogueSitemapEntry = MetadataRoute.Sitemap[number];
  const cataloguePages: CatalogueSitemapEntry[] = [
    ...fish.map((f) => ({ path: `/fish/${f.slug}`, slug: f.slug })),
    ...plants.map((p) => ({ path: `/plants/${p.slug}`, slug: p.slug })),
    ...shrimp.map((s) => ({ path: `/shrimp/${s.slug}`, slug: s.slug })),
    ...mosses.map((m) => ({ path: `/mosses/${m.slug}`, slug: m.slug })),
    ...snails.map((s) => ({ path: `/snails/${s.slug}`, slug: s.slug })),
    ...substrates.map((s) => ({
      path: `/substrates/${s.slug}`,
      slug: s.slug,
    })),
  ].map(({ path, slug }) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(getEntryDates(slug).updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const guidePages = listGuides().map((g) => ({
    url: `${site.url}/guides/${g.slug}`,
    lastModified: new Date(g.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  // Programmatic "X vs Y" comparison pages, generated from the catalogue.
  // Freshness tracks the more recently updated of the two species.
  const comparisonPages = comparisonPairs().map((p) => {
    const a = getEntryDates(p.a.slug).updatedAt;
    const b = getEntryDates(p.b.slug).updatedAt;
    const latest = [a, b].sort().at(-1) ?? a;
    return {
      url: `${site.url}/compare/${p.versus}`,
      lastModified: new Date(latest),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    };
  });

  // "Tank mates for X" pages, generated for the animal categories where the
  // query exists (fish, shrimp, snails).
  const tankMatePages = [
    ...fish.map((f) => ({ path: `/fish/${f.slug}/tank-mates`, slug: f.slug })),
    ...shrimp.map((s) => ({
      path: `/shrimp/${s.slug}/tank-mates`,
      slug: s.slug,
    })),
    ...snails.map((s) => ({
      path: `/snails/${s.slug}/tank-mates`,
      slug: s.slug,
    })),
  ].map(({ path, slug }) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(getEntryDates(slug).updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // "Best fish/plants/shrimp for an N litre tank" pages plus their index.
  const tankGuidePages = [
    {
      url: `${site.url}/tanks`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    ...generatedTanks().map((t) => ({
      url: `${site.url}/tanks/${tankSizeSlug(t.litres)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  // Algae identification hub plus a fix page per algae type.
  const algaePages = [
    {
      url: `${site.url}/algae`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    ...ALGAE.map((a) => ({
      url: `${site.url}/algae/${a.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  // Hardscape database, stone and wood.
  const hardscapePages = [
    {
      url: `${site.url}/hardscape`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    ...HARDSCAPE.map((h) => ({
      url: `${site.url}/hardscape/${h.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return [
    ...staticPaths.map((p) => ({
      url: `${site.url}${p.path}`,
      lastModified: now,
      changeFrequency: p.freq,
      priority: p.priority,
    })),
    ...cataloguePages,
    ...guidePages,
    ...comparisonPages,
    ...tankMatePages,
    ...tankGuidePages,
    ...algaePages,
    ...hardscapePages,
  ];
}
