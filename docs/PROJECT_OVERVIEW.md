# PROJECT OVERVIEW

## What this site is

**Fin & Stem** is a proposal / informational website for an aquascaping catalogue
brand. The build is positioned as *"the Wikipedia for aquascapers"* — a
single, consolidated reference for plants, fish, hardscape, and equipment with
cross-referenced compatibility and real build guides.

The current scope is a **proposal site** — a directional, audience-facing
artifact that communicates the offer, the vision, and the launch path. It is
not the production catalogue itself. The catalogue (Payload CMS + Postgres /
SQLite) is a follow-on phase.

## Target audience

- **Primary:** Aquascapers (planted-tank hobbyists) frustrated by fragmented
  information across Tropica, Flowgrow, Seriously Fish, YouTube, and forum
  threads.
- **Secondary:** Hobby shops, equipment vendors, and aquascaping educators
  considering partnerships or content contributions.
- **Tertiary:** Investors / stakeholders evaluating the opportunity.

Tone: practical, opinionated, low-marketing. The audience trusts evidence and
specifics, not slogans.

## Deployment environment

- **Framework:** Next.js 16 (App Router) on Node 22.
- **Default host:** Vercel (preview deployments per branch, production on
  `main`). The site is structured to remain portable — the Next.js Adapter API
  means a future move to Cloudflare Workers (OpenNext) or Hetzner + Coolify
  stays cheap.
- **Domain:** TBD — `.com` via Cloudflare Registrar is the at-cost default;
  `.co.za` via Truehost / HostAfrica is the local option.
- **Analytics:** Vercel Web Analytics or Plausible (self-host) — see
  `TRACKING_PLAN.md`.

## Owner

- **Owner / sponsor:** Mike Elmira (`mikee@dsg.co.za`).
- **Build & maintenance:** Claude Code, supervised by the owner.
- **Editorial direction:** Owner — content review and approval before launch.

## Repository

This is a **self-contained** Next.js application. No monorepo, no external
workspace dependencies. Everything required to build, run, and deploy the site
lives in this folder.
