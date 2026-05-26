---
name: content-research-writer
description: Assists in writing high-quality content by conducting research, adding citations, improving hooks, iterating on outlines, and providing real-time feedback on each section. Transforms your writing process from solo effort to collaborative partnership. Use when writing blog posts, articles, guides, build journals, or any long-form content for Fin & Stem.
---

# Content Research Writer

This skill acts as a writing partner — research, outline, draft, and refine content while preserving the author's voice. Adapted from [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills/blob/master/content-research-writer/SKILL.md) and tuned for the Fin & Stem aquascaping site.

## When to Use This Skill

- Writing long-tail FAQ articles for Fin & Stem ("Can neon tetras live with cherry shrimp?")
- Authoring build journals from Mike's tank notes
- Drafting pillar-page expansions (planted tank guide, fish guide, etc.)
- Writing species-vs-species comparison articles
- Creating biotope content (Amazon, SE Asia, West Africa, etc.)
- Producing technical setup tutorials
- Any other long-form content for the site

## Fin & Stem house style (apply this whenever using the skill on this project)

- Voice: practical, confident, friendly — like a knowledgeable mate at his tank, not a textbook. Mike's first-hand observations are the differentiator.
- Format every article per `seo/page-templates.md` Template 4 (Guide / Long-tail article): TL;DR direct answer (100–150 words) → short answer paragraph → what the science says → what Mike has observed → practical recommendation → linked catalogue entries → FAQ → cross-links.
- Internal-linking rules from `seo/internal-linking-rules.md` are non-negotiable: every article links up to the relevant pillar, sideways to ≥3 catalogue entries, and out to at least one build journal where applicable.
- Cite primary sources inline (FishBase, GBIF, 2HR Aquarist, peer-reviewed papers) — Perplexity especially rewards verifiable citations.
- Render images with full attribution (author, license, Commons file link) per existing `<Attribution />` component.
- Length: 800–1500 words for long-tail FAQ articles; 2,500+ for pillar expansions; 1,500–3,000 for build journals.

## What This Skill Does

1. **Collaborative outlining** — turns a topic into a coherent outline keyed to search intent.
2. **Research assistance** — surfaces primary sources, statistics, expert quotes, and adds inline citations.
3. **Hook improvement** — strengthens the opening so it captures attention (and AI-engine extraction).
4. **Section-by-section feedback** — reviews each section while you write rather than after.
5. **Voice preservation** — maintains Mike's writing style, not generic AI prose.
6. **Citation management** — formats references in your chosen style.
7. **Iterative refinement** — multi-pass review until the piece is publish-ready.

## Workflow

### 1. Set up the writing space

```bash
mkdir -p src/content/guides/<slug>
cd src/content/guides/<slug>
touch outline.md research.md draft-v1.md
```

Open Claude Code at the repo root and reference these paths.

### 2. Brief

Before drafting, gather:
- Topic and primary target query
- Search intent type (identification / compatibility / setup / reference / spec — see `seo-geo-strategy.md` §2)
- Target audience (beginner / intermediate / expert)
- Desired length
- Existing knowledge / sources already in `aquascaping-catalogue-seed.xlsx` or `src/data/species-detail.ts`
- Tone preference (always: practical-confident-friendly for Fin & Stem)

### 3. Collaborative outlining

```
# Article Outline: [Title]

## Hook
- [Opening line/story/statistic]
- [Why reader should care in one sentence]

## TL;DR (100–150 words)
- Self-contained direct answer to the target query
- Includes ≥2 named entities (scientific names, brand names, region names)

## Main Sections
### Section 1: [The short answer]
- Key point A
- Key point B
- Linked catalogue entry: /[category]/[slug]

### Section 2: [What the science says]
- Citation needed: [topic]
- Linked source: [FishBase / GBIF / 2HR]

### Section 3: [What Mike has observed] ← Fin & Stem differentiator
- First-hand note
- Original photo if available

### Section 4: [Practical recommendation]
- Decision tree or comparison table

### Section 5: [Better alternatives — if applicable]
- Linked catalogue cards

## FAQ (4–6 questions)
- Each Q + A pair: 50–150 words

## Internal links to verify
- Pillar link up: /[pillar]
- Sideways links: /[cat1]/[slug1], /[cat2]/[slug2], /[cat3]/[slug3]
- Build journal cross-link if applicable

## Research to-do
- [ ] Find data on [topic]
- [ ] Get scientific name and Wikidata ID for [species]
- [ ] Verify citation for [claim]
```

Iterate until logical and complete. Identify research gaps explicitly.

### 4. Research

For each research item, surface:
- 2–3 credible sources
- Key facts, quotes, data points
- Pre-formatted citation
- Suggested anchor text and target URL when linking

Example:

```
## Research: Cherry shrimp + neon tetra predation

Key findings:
1. Adult neon tetras (~3.5 cm) and adult cherry shrimp (~2.5 cm) coexist
   in planted tanks without predation [FishBase 2024].
2. Newly hatched shrimplets (~1 mm) are within neon tetra prey size and
   are routinely eaten [Aquarium Co-Op observational].
3. Heavy moss cover (Java Moss, Christmas Moss) provides shrimplet
   refuge sufficient for colony growth at low neon densities.

Sources:
[FishBase 2024] https://www.fishbase.se/summary/Paracheirodon-innesi
[ACOOP 2023] https://www.aquariumcoop.com/blogs/aquarium/cherry-shrimp-and-tetras

Added to outline under Section 2.
```

### 5. Improve the hook

When user shares an introduction, analyze and suggest 2–3 alternatives:

**Original**: "Neon tetras and cherry shrimp are both popular in planted tanks. Can they live together?"

**Option 1 — bold direct answer**: "Yes, neon tetras and cherry shrimp coexist in planted tanks. But your shrimp colony won't grow unless you give the shrimplets somewhere to hide."

**Option 2 — counterintuitive**: "I added neons to my shrimp tank expecting carnage. Three months later, my Neocaridina colony had doubled."

**Option 3 — data**: "Adult cherry shrimp survive neon tetras 100% of the time. Newly hatched shrimplets — barely 30%."

Each option matches a different reader posture. Pick based on the article's distribution channel.

### 6. Section-by-section feedback

When the writer shares a section, return:

```
# Feedback: [Section name]

## What works ✓
- [Concrete strength]
- [Concrete strength]

## Suggestions

### Clarity
- "[Original sentence]" → "[Shorter, sharper version]"

### Evidence
- [Generic claim] → add citation or first-hand observation

### Flow
- [Transition issue] → [Better connection]

### Voice
- [Off-tone phrase] → [Fin & Stem-tone alternative]

### Internal links
- This section mentions [species] but doesn't link to /[cat]/[slug] — add the link.

## Specific line edits
Original: "[exact text]"
Suggested: "[improved text]"
Why: [one-sentence rationale]

## Pre-publish checks for this section
- [ ] Named entities ≥3 in this section
- [ ] One link to catalogue entry or pillar
- [ ] At least one piece of evidence (data, source, or first-hand observation)

Ready for the next section.
```

### 7. Voice preservation

Mike's voice is **practical, confident, friendly** — not academic. When in doubt:
- Cut hedging ("might", "could possibly", "in some cases") unless the data is genuinely uncertain.
- Use "I" or "Mike" for first-hand observations; never use a generic "you" when Mike has actually done the thing.
- Short sentences in the TL;DR; longer ones in the body when explaining context.
- Avoid "delve", "tapestry", "harness", "in today's world", "navigate the complexities".

Periodically ask: "Does this still sound like Mike?" If a paragraph reads like generic AI prose, rewrite it shorter and more direct.

### 8. Citation style for Fin & Stem

Inline references with linked source:

```markdown
Adult neon tetras coexist with adult cherry shrimp ([FishBase](https://www.fishbase.se/summary/Paracheirodon-innesi)),
but shrimplets are routinely eaten in tanks with sparse cover.
```

A Sources block at the bottom of every article, repeated as a `<Sources />` component for SEO. Format:

```markdown
## Sources

- FishBase — [Paracheirodon innesi species page](https://www.fishbase.se/summary/Paracheirodon-innesi)
- GBIF — [Neocaridina davidi occurrence](https://www.gbif.org/species/...)
- 2HR Aquarist — [Cherry shrimp keeping](https://www.2hraquarist.com/...)
- Mike's tank notes — [build journal: 30L shrimp nursery](/builds/30l-shrimp-nursery)
```

### 9. Final review

Before declaring done:

```
# Full Draft Review

## Strengths
- [Three top strengths]

## Structure & flow
- [Pacing, ordering, transitions]

## E-E-A-T signals
- [ ] At least one first-hand observation from Mike
- [ ] Author byline present with rel="author"
- [ ] Visible "Updated [date]" line
- [ ] ≥3 inline citations to primary sources
- [ ] ≥3 internal links (1 pillar, 2 catalogue)

## AEO/GEO checklist
- [ ] TL;DR block 100–300 words at top
- [ ] ≥15 named entities total
- [ ] ≥1 comparison table or spec table
- [ ] FAQ block with FAQPage JSON-LD potential (4+ questions)
- [ ] H1 unique; H2 hierarchy logical
- [ ] Title ≤60 chars, includes target keyword near front
- [ ] Meta description ≤155 chars, mirrors TL;DR opening

## Final polish
1. [Specific edit]
2. [Specific edit]

## Pre-publish checklist
- [ ] All claims cited or marked first-hand
- [ ] Images attributed
- [ ] Internal links resolve (no 404s)
- [ ] Spell-check
- [ ] Read aloud once

Ready to publish.
```

## Fin & Stem content workflows

### Long-tail FAQ article workflow (~800–1500 words, 1 session)

1. Pick target query from `seo-audit-2026.md §2.7` content-gap table
2. Confirm KD <25 in Ahrefs / Keywords Everywhere
3. Outline (15 min) → research (30–45 min) → hook (15 min) → draft (60–90 min) → review (30 min)
4. Save to `src/content/guides/<slug>/draft-v1.md`
5. When approved, convert to `src/app/guides/[slug]/page.tsx` per Template 4

### Build journal workflow (~1500–3000 words, 2–3 sessions)

1. Mike supplies: tank size, style, full stocking list, hardscape used, equipment used, photos at multiple stages, total cost
2. Outline build journal per `seo/page-templates.md` Template 2
3. Section by section: layout → substrate → hardscape → plants → fill/cycle → livestock → timeline (week 1, week 4, month 3, month 6) → lessons → maintenance
4. Add `HowTo` JSON-LD with steps, supplies, tools, estimated cost
5. Link every species/product mentioned to its catalogue page
6. Save to `src/data/builds.ts` and render via `/builds/[slug]`

### Species-vs-species comparison workflow (~800 words, 1 session)

1. Pick two species often confused (e.g. neon vs cardinal, java vs christmas moss)
2. Outline: TL;DR ("they look similar but differ in [X, Y, Z]") → key differences table → which to choose when → linked catalogue entries
3. Render as `/guides/[slug]` or `/compare/<a>-vs-<b>` route

### Pillar expansion workflow (~2,500+ words, 2 sessions)

1. Open the existing pillar page (e.g. `src/app/planted-tank-guide/page.tsx`)
2. Audit current word count and section coverage
3. Add missing sections per `seo/page-templates.md` Template 3
4. Expand each section to 400–800 words
5. Add comparison tables for catalogue entries within the pillar
6. Add 10+ FAQ entries
7. Verify every cluster page links back to the pillar

## File organisation

```
src/content/
├── guides/
│   └── [slug]/
│       ├── outline.md
│       ├── research.md
│       ├── draft-v1.md
│       ├── draft-v2.md
│       └── final.md
└── builds/
    └── [slug]/
        ├── outline.md
        ├── research.md
        ├── timeline.md
        └── final.md
```

When the draft hits `final.md`, port the content into TypeScript via `src/data/guides.ts` or `src/data/builds.ts`. The draft file stays as the editorial record.

## Pro tips

1. **Work in VS Code** with the repo open. Better than browser for long-form.
2. **One section at a time.** Get feedback incrementally; resist the urge to draft the whole article in one pass.
3. **Separate research file.** Keep a `research.md` per article so citations don't get lost.
4. **Version drafts.** `draft-v1.md`, `draft-v2.md`, etc. Easier to A/B feedback.
5. **Read aloud once.** Catches clunky sentences that pass a silent read.
6. **Hold to the linking minimums.** ≥3 internal + ≥3 citations is the floor, not the ceiling.
7. **Cross-reference the catalogue.** Every species mentioned must link to its page; that's how topical authority compounds.
8. **Send to Mike for the first-hand pass** before publishing. Even if the article is research-heavy, Mike adds the "I tried this" sentence that elevates it from review to experience.

## Related skills and files

- `seo-geo-strategy.md` — overall SEO + AEO strategy
- `seo/page-templates.md` — per-page structure templates
- `seo/internal-linking-rules.md` — link patterns
- `seo/content-brief-template.md` — pre-write brief template
- `seo/json-ld-templates.md` — schema for Article + HowTo + FAQPage
- `seo-audit-2026.md §2.7` — prioritised content-gap table (what to write next)
