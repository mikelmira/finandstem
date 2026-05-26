# Fin & Stem — Page Structure Templates

These are the canonical content patterns for each page type. Every template is designed to:
1. Match the user's intent at a glance (above the fold).
2. Be extractable by AI engines (TL;DR + tables + FAQ format).
3. Earn E-E-A-T signals (named author, original photos, sources).
4. Cross-link aggressively into the topic cluster.

Implementation lives in `app/(site)/<route>/page.tsx`. Reusable section components live in `components/seo/`.

---

## Template 1: Species detail page

```
─────────────────────────────────────────────────
Breadcrumbs ▸ Home › Fish › Neon Tetra
─────────────────────────────────────────────────

<H1>Neon Tetra (Paracheirodon innesi)</H1>
By Mike · Updated 12 Aug 2026 · 6 min read

<lead-image with attribution>

<TLDR>
A 134–167 word self-contained summary including:
- Scientific name
- Adult size
- Min tank size
- Temperament + schooling
- Water parameters (temp/pH/dGH)
- Lifespan
- Difficulty
- One opinionated sentence from Mike
</TLDR>

<SpecTable>
A 2-column table covering every summary field from the catalogue:
common name, scientific name, family, origin, adult size, min tank,
water column, temperament, schooling, min group size, diet, temp,
pH, dGH, lifespan, difficulty, plant safe, shrimp safe, breeding.
</SpecTable>

<H2>Water Parameters</H2>
<RangeBar> for temp, pH, dGH — each with min/max labels.

<H2>Compatibility</H2>
<CompatibilityBlock>
Linked cards for compatible plants, fish, shrimp, mosses
with badges showing why (Temp ✓ / pH ✓ / Plant-safe ✓).
</CompatibilityBlock>

<H2>Care</H2>
The "Care Summary" paragraph from the spreadsheet, in Mike's voice.
Followed by the "Pro Tips" content with a "Mike's tip" callout.

<H2>Habitat</H2>
The "Habitat (Natural)" content from the spreadsheet.

<H2>Wild Diet</H2>
The "Wild Diet" content.

<H2>Sexing</H2>
The "Sexing" content. Add diagram if available.

<H2>Breeding</H2>
The "Breeding Detail" content.

<H2>Color Forms & Variants</H2>
The "Color Forms / Variants" content with photos where possible.

<H2>Diseases & Health</H2>
The "Common Diseases" content. Cross-link to a future
disease-encyclopedia page if/when written.

<H2>Recommended Tank Setup</H2>
The "Tank Setup" content. Link to compatible plants and hardscape.

<H2>Tank Mates</H2>
<GoodMatesList>
The "Good Tank Mates" content. Every named species is a hyperlink
to its catalogue page.
</GoodMatesList>
<BadMatesList>
The "Bad Tank Mates" content. Same linking rule.
</BadMatesList>

<H2>Quarantine</H2>
The "Quarantine" content.

<H2>Conservation Status</H2>
The "Conservation Status" content.

<H2>Price Range</H2>
The "Price Range (USD)" content. Add ZAR estimate.

<H2>Etymology</H2>
The "Etymology" content.

<H2>Common Misconceptions</H2>
The "Common Misconceptions" content.

<H2>Frequently Asked Questions</H2>
<FAQ> 4–6 questions per species, each with a 50–150 word answer.
Auto-emit FAQPage JSON-LD.

<H2>Featured in Builds</H2>
Card list of /builds/* pages that feature this species.
Each card has hero photo, title, summary, tank size.

<H2>Sources</H2>
Bulleted list of every external source cited:
- Wikipedia article URL
- FishBase URL
- GBIF URL
- Any peer-reviewed paper URLs
- "Personal observation in tank since [date]" where applicable

<H2>Photo Gallery</H2>
Up to 5 images, each with full attribution block below:
"Image: Author · CC-BY-SA 4.0 · Source"

<Pillar link callout>
"Read the Complete Planted Tank Guide" for the full topic context.
</Pillar link callout>
```

**Required component composition:**
`<Breadcrumbs />`, `<AuthorByline />`, `<Attribution />` (one per image), `<TLDR />`, `<SpecTable />`, `<RangeBar />`, `<CompatibilityBlock />`, `<FAQ />`, `<Sources />`, `<RelatedBuilds />`, `<PillarLink />`.

**Metadata:**
- `<title>`: "{Common Name} ({Scientific Name}) — Care, Tank Mates, Compatibility | Fin & Stem"
- `<meta description>`: First sentence of the TL;DR, capped at 155 chars.
- OG image: Auto-generated via `opengraph-image.tsx` with hero photo, common name, scientific name.

---

## Template 2: Build journal page (`/builds/[slug]`)

```
Breadcrumbs ▸ Home › Builds › 30L Shrimp Nursery

<H1>30 Litre Shrimp Nursery — Low-Tech, Cherry + Java Moss</H1>
By Mike · Published 12 Aug 2026 · Updated 12 Aug 2026 · 12 min read

<hero photo of finished tank, full attribution>

<TLDR>
~150 words covering:
- Tank size + dimensions
- Style (low-tech jungle / Iwagumi / etc.)
- Tech level (no CO₂ / pressurized CO₂)
- Total cost (USD + ZAR)
- Time to "finished" look
- Final stocking list (with links)
- Final verdict: would you build it again
</TLDR>

<H2>What's in the Tank</H2>
<ItemList>
Linked cards for every plant, fish, shrimp, hardscape, equipment item used.
Each card: photo, name, quantity, why-chosen-here.
</ItemList>

<H2>Cost Breakdown</H2>
Itemised table: name, where bought, USD, ZAR. Total at bottom.

<H2>The Build, Step by Step</H2>
<HowToSteps>
Step 1: Layout — Mike's photo of bare tank with hardscape mockup.
Step 2: Substrate — photo of substrate layered.
Step 3: Hardscape placement — photo of stones/wood positioned.
Step 4: Plants — photo of newly planted tank.
Step 5: Initial fill — photo of cycling start.
Step 6: Adding livestock — photo of first additions.
Each step: 2–3 paragraphs, what was learned, what changed mid-build.
</HowToSteps>

<H2>Timeline</H2>
Week 1: photo + brief note.
Week 4: photo + brief note.
Month 3: photo + brief note.
Month 6: photo + brief note.

<H2>What I'd Do Differently</H2>
The single most valuable section for E-E-A-T. Mike's lessons.

<H2>Maintenance Routine</H2>
Weekly tasks, water-change schedule, dosing.

<H2>Frequently Asked Questions</H2>
4–6 FAQs specific to this build (e.g. "Can I scale this to 60 L?").

<H2>Sources & Inspiration</H2>
Any 2HR Aquarist articles, YouTube videos, or builds that influenced this one.
```

**Required component composition:**
`<Breadcrumbs />`, `<AuthorByline />`, `<Attribution />`, `<TLDR />`, `<ItemList />` (linking catalogue), `<CostTable />`, `<HowToSteps />`, `<Timeline />`, `<FAQ />`, `<Sources />`.

**Metadata:**
- `<title>`: "{Tank size + style + tech level} | Fin & Stem build journal"
- `<meta description>`: TL;DR first sentence.
- OG image: Auto-generated with hero photo + build title.

---

## Template 3: Pillar page (`/planted-tank-guide`, etc.)

```
Breadcrumbs ▸ Home › Planted Tank Guide

<H1>The Complete Planted Aquarium Guide</H1>
By Mike · Updated 12 Aug 2026 · 25 min read

<TLDR>
2–3 paragraphs (~250 words) summarizing the full scope of the guide
and who it's for.
</TLDR>

<TableOfContents>
Auto-generated from H2s.
</TableOfContents>

<H2>What is a planted aquarium?</H2>
~400–800 words.

<H2>Tank size and dimensions</H2>
~400 words + decision table.

<H2>Lighting</H2>
~600 words. Link to equipment pillar + relevant catalogue entries.

<H2>Substrate</H2>
~600 words. Link to hardscape catalogue.

<H2>CO₂</H2>
~800 words. Decision tree: do you need CO₂? When/why.

<H2>Fertilization</H2>
~600 words. Macro vs micro, dosing methods.

<H2>Plant selection</H2>
Sub-sections by position (foreground / midground / background).
Each sub-section has a comparison table of catalogue entries with
recommended species.

<H2>Common algae & diagnosis</H2>
~800 words. Each algae type linked to a sub-guide if/when written.

<H2>Maintenance routine</H2>
~400 words. Weekly, monthly, six-monthly.

<H2>Common mistakes</H2>
~400 words.

<H2>Frequently Asked Questions</H2>
10+ FAQs covering the most-Googled planted-tank questions.

<H2>Related builds</H2>
Linked cards for every /builds/* tagged planted-tank.

<H2>Related catalogue entries</H2>
Linked cards for top plants in the catalogue.

<H2>Sources</H2>
2HR Aquarist articles, ADA reference, peer-reviewed dosing papers.
```

**Required component composition:**
`<Breadcrumbs />`, `<AuthorByline />`, `<TLDR />`, `<TableOfContents />`, `<ComparisonTable />` (multiple), `<FAQ />`, `<Sources />`, `<RelatedBuilds />`, `<CatalogueLinkCards />`.

**Update cadence:** Pillars are living documents. Re-update `dateModified` whenever any spoke is added to the cluster. Re-publish with a quarterly review.

---

## Template 4: Guide / Long-tail article (`/guides/[slug]`)

```
Breadcrumbs ▸ Home › Guides › Can neon tetras live with cherry shrimp

<H1>Can Neon Tetras Live with Cherry Shrimp?</H1>
By Mike · Updated 12 Aug 2026 · 5 min read

<TLDR>
Lead with the direct answer in 1 paragraph (100–150 words).
"Adult neon tetras and adult cherry shrimp coexist safely in
a planted tank, but neons will eat newly hatched shrimplets…"
</TLDR>

<H2>The short answer</H2>
1 paragraph clarification.

<H2>What the science says</H2>
2–3 paragraphs citing FishBase / observational evidence.

<H2>What Mike has actually seen</H2>
First-hand observation paragraph — the E-E-A-T killer section.

<H2>If you want shrimp to breed</H2>
What to do (denser moss, fewer neons, alternative fish).

<H2>Better fish for shrimp tanks</H2>
Linked cards from the catalogue: otocinclus, pygmy corydoras, chili rasbora.

<H2>FAQ</H2>
3–5 related questions.

<Related catalogue cross-links>
Neon tetra page, cherry shrimp page, otocinclus page.
```

**Metadata:**
- `<title>`: "Can {X} Live With {Y}? — Fin & Stem"
- `<meta description>`: First sentence of TL;DR.

---

## Template 5: Category landing page (`/plants`, `/fish`, etc.)

```
Breadcrumbs ▸ Home › Plants

<H1>Aquarium Plants — Browse & Filter</H1>

<Intro>
Brief 50-word intro to the category + link to the pillar guide.
</Intro>

<Filters>
Per the Claude Code prompt's filter spec.
</Filters>

<Grid>
Species cards — image, common name, scientific name italicised,
key spec callouts (difficulty badge, light icon, CO₂ icon).
</Grid>

<Pagination>
</Pagination>

<H2>Why use the Fin & Stem plant catalogue?</H2>
~200 words explaining the cross-reference value.

<H2>Pillar link</H2>
"For the complete planted-tank reference, read the Complete Planted Aquarium Guide."
```

**Metadata when filters are active:**
- Filter combinations canonical to the base list page (`/plants`).
- `<title>` still updates per active filters for context (e.g. "Low-light foreground plants — Fin & Stem").
- `<meta description>` updates similarly.

---

## Template 6: Compatibility tool (`/compatibility`)

```
Breadcrumbs ▸ Home › Compatibility

<H1>Aquarium Compatibility Cross-Reference</H1>

<Intro>
~150 words explaining what the tool does and how it works.
</Intro>

<AnchorPicker>
Typeahead for any species in the catalogue.
</AnchorPicker>

<ResultsGrid>
Linked cards by category (plants / fish / shrimp / mosses) of
compatible entries. Each card shows reason badges
("Temp ✓ pH ✓ Plant-safe ✓").
</ResultsGrid>

<H2>How compatibility is calculated</H2>
~300 words explaining the algorithm:
- Temp/pH/dGH range overlap
- Plant-safe + shrimp-safe boolean flags
- Anchor-specific rules (fish anchors need plant-safe;
  shrimp anchors need fish that are shrimp-safe)

<H2>FAQ</H2>
6–8 FAQs about the tool.

<H2>Limitations</H2>
~200 words on what the tool doesn't capture (individual personality,
local water chemistry, tank size mismatch, etc.).
```

**This is a critical link-magnet page.** Every species page links to it. Other sites will link to it. AI engines will cite it. Make the URL stable and never change it.
