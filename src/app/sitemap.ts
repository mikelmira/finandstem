import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { fish, plants, shrimp, mosses } from "@/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths: ReadonlyArray<{
    path: string;
    priority: number;
    freq: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "", priority: 1, freq: "weekly" },
    { path: "/fish", priority: 0.9, freq: "weekly" },
    { path: "/plants", priority: 0.9, freq: "weekly" },
    { path: "/shrimp", priority: 0.9, freq: "weekly" },
    { path: "/mosses", priority: 0.9, freq: "weekly" },
    { path: "/about", priority: 0.6, freq: "monthly" },
    { path: "/contact", priority: 0.5, freq: "monthly" },
    { path: "/legal/privacy", priority: 0.3, freq: "yearly" },
    { path: "/legal/terms", priority: 0.3, freq: "yearly" },
  ];

  const entryPaths = [
    ...fish.map((f) => `/fish/${f.slug}`),
    ...plants.map((p) => `/plants/${p.slug}`),
    ...shrimp.map((s) => `/shrimp/${s.slug}`),
    ...mosses.map((m) => `/mosses/${m.slug}`),
  ];

  return [
    ...staticPaths.map((p) => ({
      url: `${site.url}${p.path}`,
      lastModified: now,
      changeFrequency: p.freq,
      priority: p.priority,
    })),
    ...entryPaths.map((p) => ({
      url: `${site.url}${p}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
