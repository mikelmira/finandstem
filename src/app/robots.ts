import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * robots.ts, mirror of /seo/robots.txt.
 *
 * We explicitly allow major AI-training and AI-search crawlers (GPTBot, ClaudeBot,
 * PerplexityBot, Google-Extended, Applebot-Extended, etc.) so Fin & Stem content is
 * discoverable inside AI assistants. Trade-off accepted per seo-geo-strategy.md §6.1.
 */
export default function robots(): MetadataRoute.Robots {
  const aiCrawlers = [
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "ClaudeBot",
    "Claude-Web",
    "Anthropic-AI",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "GoogleOther",
    "CCBot",
    "Bytespider",
    "Applebot",
    "Applebot-Extended",
    "Amazonbot",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/*?_payload=*"],
      },
      ...aiCrawlers.map((userAgent) => ({
        userAgent,
        allow: "/",
      })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
