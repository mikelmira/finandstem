# ASSUMPTIONS

Everything on the live site at this stage is **directional**. It reflects the
best available external research and the owner's domain judgment — not
validated internal data. Treat every claim, number, persona, and roadmap item
as a working hypothesis until reviewed and approved.

## Data & access

- **No internal data access.** The build team has no access to private
  analytics, CRM records, customer interview transcripts, supplier pricing, or
  unpublished operational data.
- **No proprietary catalogue feed.** Plant / fish / hardscape / equipment data
  in this proposal is illustrative only. The real catalogue will be ingested
  in a later phase (Payload CMS + structured schema).
- **No verified market sizing.** TAM / SAM / SOM figures and audience counts,
  if present, are externally sourced estimates.

## Content & claims

- **Directional strategy only.** Positioning, messaging, page narratives, and
  category framing are starting points — they need a stakeholder pass before
  going live.
- **External sources.** Where competitor analysis or trend data appears (e.g.
  2HR Aquarist, Tropica, Flowgrow, Seriously Fish, 2026 biotope trends), it
  reflects publicly available sources at the time of writing.
- **Pricing & hosting costs** quoted in supporting docs reflect free / paid
  tiers as observed today; pricing pages change.

## Design & UX

- Visual style draws on **shadcn UI primitives** with a neutral base. Brand
  colour, typography, and photography direction are **placeholders** to be
  replaced by the approved brand system.
- Imagery in `public/images/` is placeholder until the real visual library
  (photography, illustration, hardscape stills) is delivered.

## Technical

- All forms, integrations, and tracking are wired as **placeholders** — they
  do not yet send to a real CRM, ESP, or analytics endpoint. See
  `TRACKING_PLAN.md` for the wiring plan.
- Performance, accessibility, and SEO budgets are targeted but not yet
  audited against real device / network conditions.

## Required validation post-approval

Before this site is treated as more than a directional proposal, the
following must happen:

1. **Stakeholder review** of every section's claims and tone.
2. **Brand sign-off** on colour, type, voice, and imagery.
3. **Legal / compliance pass** on any quantitative claims, comparisons, or
   third-party trademarks.
4. **Analytics & consent** wiring against the production property and a
   cookie-consent flow that meets the audience's jurisdiction.
5. **Catalogue data review** before any product / plant / fish listings are
   published as fact.

If a section can't survive that review unchanged, mark it as draft in the
content layer (`src/content/`) and gate it from production rendering.
