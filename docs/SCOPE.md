# SCOPE

This document defines what is in and out of scope for the **proposal site**
build. The follow-on production catalogue is tracked separately.

## In scope — Pages

- `/` — Home / landing
- `/about` — Vision, audience, founder, philosophy
- `/catalogue` — Overview of the four pillars (plants, fish, hardscape,
  equipment) — directional only, not the real catalogue
- `/approach` — How the site is built and maintained; editorial standards
- `/roadmap` — Launch phases and what comes next
- `/contact` — Inbound interest, partnership requests, newsletter signup
- `/legal/privacy`
- `/legal/terms`

## In scope — Sections (composable, live in `src/components/sections/`)

- `Hero` — primary positioning, single CTA
- `Problem` — the four gaps this site closes
- `ValueProps` — what makes Fin & Stem different
- `AudienceFit` — who this is for, who it isn't
- `Pillars` — high-level overview of the four catalogue pillars
- `ApproachTeaser` — methodology, sourcing, editorial standards
- `Roadmap` — phased launch milestones
- `SocialProof` — references and citations (placeholder until real reviews)
- `Faq` — accordion of common objections
- `Cta` — closing call-to-action with signup form
- `SiteHeader` / `SiteFooter`

Sections are reused across pages. Pages are thin compositions of sections
plus page-specific copy from `src/content/`.

## In scope — Functional

- Responsive layout (mobile-first), light & dark mode (system-preferred)
- shadcn UI primitives (button, card, badge, accordion, tabs, separator,
  dialog, dropdown-menu) built on Base UI
- Static content via TypeScript modules in `src/content/`
- Inbound newsletter / interest form (placeholder endpoint at `/api/signup`)
- Inbound partnership / press form (placeholder endpoint at `/api/contact`)
- Analytics + event tracking placeholder helper at `src/lib/analytics.ts`
- SEO basics: `<title>`, meta description, OG tags, sitemap, robots
- Accessibility: keyboard nav, semantic landmarks, contrast targets

## Out of scope (this phase)

- The real catalogue (plants / fish / hardscape / equipment records)
- Payload CMS / admin UI / authenticated routes
- Database schema, ORM, ingest scripts
- Search, filtering, faceting, compatibility queries
- User accounts, saved builds, comments
- E-commerce, affiliate links, monetization
- Multi-language / i18n
- Native mobile app
- Image transforms / CDN pipeline (placeholders only)
- Email automation beyond a single signup form

These are deferred to the production catalogue phase and tracked in
`docs/roadmap` once that phase begins.

## Launch milestones

| Milestone | Definition of done |
|---|---|
| **M0 — Scaffold** | Next.js + Tailwind + shadcn + docs in place; dev server runs clean. *Complete.* |
| **M1 — Proposal site** | All proposal-site pages composed from sections; preview on Vercel. *Complete (this commit).* |
| **M2 — Content review** | Stakeholder sign-off on copy, claims, imagery; tracked changes resolved. |
| **M3 — Visual polish** | Real brand palette, type, photography in place; accessibility + Lighthouse pass. |
| **M4 — Analytics & forms** | Real analytics property, consent flow, signup form connected to ESP. |
| **M5 — Public launch** | Custom domain, production deploy, sitemap submitted, monitoring on. |
