# Fin & Stem — Content Brief Template

Use this template when writing any new piece of content. It enforces the patterns that earn AI citations and organic rankings. Copy-paste into a new file under `briefs/` for each piece.

---

## Brief: [Piece title]

**URL:** `/category/slug`
**Type:** [Species page / Build journal / Guide / Pillar / FAQ]
**Author:** Mike
**Status:** [Idea / In progress / Drafted / Reviewed / Published]
**Target publish date:**

---

## 1. Search intent

**Primary target query:** "..."
**Search volume / KD:** (note from Ahrefs / Keywords Everywhere / Google Trends — KD <25 ideal)
**Intent type:** [Identification / Compatibility / Setup / Reference / Spec]
**Why we win:** What makes Fin & Stem better-positioned to answer this than the current top result?

## 2. Audience

Who is searching this? What problem are they trying to solve?

## 3. The "answer in one paragraph"

(150 words max. This becomes the TL;DR block. Lead with the direct answer to the primary query.)

## 4. Outline (H2 sections in order)

1. ...
2. ...
3. ...
4. ... (10–15 sections for pillars; 6–10 for guides; 12–18 for species pages — predefined in §4.1 of seo-geo-strategy.md)

## 5. Named entities to include

(Aim for 15+ recognized entities. Scientific names, cultivar names, region names, brand names, taxonomic terms.)

- Entity 1:
- Entity 2:
- Entity 3:
- ...

## 6. Internal links to include

- Pillar this links up to: `/...`
- Sibling catalogue entries to link sideways: `/...`, `/...`, `/...`
- Build journals to link to: `/builds/...`
- Guides to link to: `/guides/...`

## 7. External sources cited

- [Source 1 name](url) — what we're citing it for
- [Source 2 name](url) — what we're citing it for
- "Personal observation in tank since [date]" (where applicable)

## 8. Photos / media needed

- Hero photo: [Mike's photo / Wikimedia Commons file / placeholder needed]
- Section photos: [list each]
- Diagrams: [if any]

## 9. FAQs (at least 4)

1. Q: ...
   A: (50–150 words)
2. Q: ...
   A:
3. Q: ...
   A:
4. Q: ...
   A:

## 10. Schema.org block

[Article / HowTo / Product / Person / WebApplication] — see seo/json-ld-templates.md for the exact JSON-LD.

## 11. Metadata

- `<title>`: (60 chars max, includes primary keyword)
- `<meta description>`: (155 chars max, mirrors TL;DR opening)
- OG image: (auto-gen via `opengraph-image.tsx` — confirm hero photo is set)

## 12. Acceptance check (do before publishing)

- [ ] TL;DR is 100–300 words and self-contained
- [ ] At least 1 spec table or comparison table
- [ ] At least 4 FAQ entries with FAQPage schema
- [ ] At least 3 internal links to catalogue entries
- [ ] At least 1 link up to the relevant pillar
- [ ] At least 1 link to a related build journal
- [ ] At least 15 recognized named entities in the body
- [ ] Author byline visible with link to /about
- [ ] Updated date visible (ISO + human-readable)
- [ ] Every image has visible attribution if attributionRequired
- [ ] JSON-LD validates in https://validator.schema.org/
- [ ] Page loads at <2.5s LCP on slow 4G
- [ ] No CLS from images (width/height set)

## 13. Promotion plan (first 7 days post-publish)

- [ ] Reddit post — which subreddit? r/Aquascape / r/PlantedTank / r/shrimptank
- [ ] Newsletter mention — yes/no
- [ ] Cross-link from existing pillar — done?
- [ ] Cross-link from existing build journals — list which
- [ ] Submit to Google Search Console "Request Indexing" — done?
