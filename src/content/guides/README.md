# Fin & Stem Guides

This folder holds the long-form articles for the site. Each file is an MDX article that renders at `/guides/<slug>` once the MDX pipeline from `prompts/03-mdx-guides-pipeline.md` is in place.

## How to add a new article

1. Pick a brief from `content-plan-q1.md` (or start a new one).
2. Open a content-research-writer session using `skills/content-research-writer/SKILL.md`.
3. Save the result as `<slug>.mdx` in this folder.
4. Verify the article locally with `pnpm dev` and visit `/guides/<slug>`.
5. Commit and push. The deploy pipeline picks it up and the new page goes live.

## Required frontmatter

Every article begins with YAML frontmatter. Missing required fields fail the build (per the schema in `src/types/guide.ts`):

```yaml
---
slug: "your-slug"
title: "Your Title Under 60 Characters"
description: "Your meta description under 155 characters. Mirrors the first sentence of the TL;DR."
publishedAt: "2026-05-26T09:00:00.000Z"
updatedAt: "2026-05-26T09:00:00.000Z"
kind: "compatibility" # one of: compatibility, comparison, list, setup, faq, biotope
targetQuery: "the search query this article is built to answer"
keywords: ["keyword one", "keyword two", "keyword three"]
pillar: "/aquarium-fish-guide" # one of the six pillar URLs
relatedSpecies: ["fish:neon-tetra", "shrimp:cherry-shrimp", "mosses:java-moss"]
heroImage: "/images/guides/your-slug.jpg" # optional, in public/images/guides/
heroAlt: "Description of the hero image" # optional
faqs:
  - question: "Question text?"
    answer: "Answer text in plain prose, 50 to 150 words."
  - question: "Another question?"
    answer: "Another answer."
---
```

## Voice rules

Write the way a working aquascaper talks to another aquascaper. Friendly, confident, practical. Not academic, not corporate. Specifically:

- Use first person when Mike has done the thing himself. Use third person or generic phrasing when reporting from sources.
- Short sentences in the TL;DR. Longer ones in the body when context is needed.
- No hedging unless the science is genuinely uncertain. Cut "might", "could possibly", "in some cases" when you have data.
- No em dashes. Use commas, parentheses, colons, semicolons, or two sentences instead.
- Avoid: delve, tapestry, harness, navigate the complexities, in today's world, foster, elevate, leverage, robust, comprehensive (when describing your own work).

## Internal linking rules

Every article must include:

- One pillar link via `<PillarLink href="/...">anchor text</PillarLink>`.
- At least three catalogue cards via `<SpeciesCard slug="..." />`.
- At least one link to a tool: `/compatibility`, `/planner`, or `/compare`.
- At least one cross-link to another guide in this folder (when one exists).

## External linking rules

Every article must include at least two external links to authority sources. The authority allow-list (links to these do not get `rel="nofollow"`):

- `fishbase.se`
- `gbif.org`
- `en.wikipedia.org`
- `seriouslyfish.com`
- `tropica.com`
- `flowgrow.de`
- `2hraquarist.com`
- `aquasabi.com`
- `projectpiaba.org`
- `iucnredlist.org`
- `aquariumcoop.com`

## Image attribution

If an article uses an image from Wikimedia Commons, the attribution block must render directly underneath it, showing author, license, and a link to the Commons file page. Use the existing `<Attribution />` component pattern, or write the credit inline in plain markdown.

## Current articles

The 9 articles in this folder were drafted from `content-plan-q1.md`. Publish them in order, one per week. Each article forward-links to articles published later in the sequence, so the internal link graph completes as the set rolls out.

| Order | Slug | Type |
|---|---|---|
| 1 | `can-neon-tetras-live-with-cherry-shrimp` | compatibility FAQ |
| 2 | `neon-tetra-vs-cardinal-tetra` | comparison |
| 3 | `best-fish-for-30-litre-planted-tank` | list |
| 4 | `java-moss-vs-christmas-moss` | comparison |
| 5 | `neocaridina-vs-caridina-shrimp` | comparison |
| 6 | `do-otocinclus-eat-algae` | misconception FAQ |
| 7 | `how-many-ember-tetras-to-keep-together` | species FAQ |
| 8 | `low-light-aquarium-plants-no-co2` | list |
| 9 | `stocking-a-60-litre-community-planted-tank` | setup |
