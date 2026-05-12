# TRACKING PLAN

What we will measure, where it lives, and how it's wired. Everything in this
document is currently a **placeholder** — no live properties exist yet. Wire
the real values during milestone **M4 — Analytics & forms** (see `SCOPE.md`).

## Goals — What we are trying to learn

1. **Demand signal.** Does the audience self-identify and convert (newsletter
   signup, contact form, early-access request)?
2. **Content fit.** Which sections / pages hold attention; where do people
   bounce?
3. **Channel performance.** Which inbound sources actually send qualified
   traffic (organic, social, referral, direct)?
4. **Funnel health.** From landing → page exploration → form submit, where
   does the drop happen?

## Conversion goals (placeholder)

| Goal | Event | Definition of done |
|---|---|---|
| **Primary — Early access signup** | `signup_submit` | User submits the newsletter / interest form successfully |
| **Secondary — Contact form** | `contact_submit` | User submits the partnership / contact form |
| **Engagement — Section view** | `section_view` | A named section enters the viewport for ≥ 1s |
| **Engagement — Roadmap view** | `page_view` (`/roadmap`) | Roadmap page reached |
| **Outbound — External link** | `outbound_click` | Click on any link with an external host |

These are starting hypotheses. Owner-approved goals replace them at M4.

## Provider stack (placeholder)

| Layer | Default pick | Alternative | Status |
|---|---|---|---|
| **Web analytics** | **Vercel Web Analytics** (zero-config on Vercel deploy) | Plausible (self-host or cloud), Cloudflare Web Analytics | Not wired |
| **Product / event analytics** | **Google Analytics 4** (GA4) | PostHog (self-host or cloud) | Not wired |
| **Consent management** | Cookie banner with GA / GTM gating | Klaro, Cookiebot | Not wired |
| **Form delivery** | API route → ESP (Buttondown / Beehiiv / Resend) | Direct ESP form endpoint | Not wired |
| **Error monitoring** | Sentry (free tier) | — | Not wired |

### Why this mix

- **Vercel Analytics** gives free, privacy-friendly pageview + Web-Vitals data
  with one env var, and it's the cheapest way to get a usable baseline on day
  one.
- **GA4** is overkill for a proposal site but stakeholders expect it. Gate it
  behind consent so the cookie banner only fires when meaningful.
- **No third-party heatmap / session-replay** at this phase — privacy cost is
  high, signal is low until traffic is real.

## Placeholders to replace at M4

These IDs are explicit placeholders — find-and-replace them once real
properties exist.

| Placeholder | Replace with |
|---|---|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX` | Real GA4 measurement ID |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=example.com` | Real domain (if using Plausible) |
| `NEXT_PUBLIC_VERCEL_ANALYTICS=1` | Toggle for Vercel Web Analytics |
| `NEXT_PUBLIC_SITE_URL=http://localhost:3000` | Canonical production URL |
| `RESEND_API_KEY=` / `BUTTONDOWN_API_KEY=` | ESP API key for the signup endpoint |
| `SENTRY_DSN=` | Sentry project DSN |

All env vars live in `.env.local` (gitignored) for development and in the
Vercel project settings for preview / production.

## Event tracking — Schema (placeholder)

Each event has a stable name and a small, documented payload. Avoid free-form
properties; prefer enums. The current implementation lives in
[`src/lib/analytics.ts`](../src/lib/analytics.ts).

```ts
type AnalyticsEvent =
  | { name: "signup_submit"; source: "hero" | "footer" | "contact" }
  | { name: "contact_submit"; topic: "partnership" | "press" | "other" }
  | { name: "section_view"; section: string }
  | { name: "outbound_click"; href: string }
  | { name: "cta_click"; cta: string; section: string };
```

Rules:

- **Names are `snake_case`** and verb-second (`signup_submit`, not
  `submit_signup`).
- **Properties are bounded enums** where possible — keeps the schema small
  enough to actually use.
- **Never log PII.** Email and form free-text never enter the event payload;
  they go only to the form endpoint.
- **One helper, one place.** `src/lib/analytics.ts` exposes `track(event)`
  and is the only allowed call site for analytics. Components do not import
  the provider SDK directly.

## Form submission tracking

The signup / contact forms post to Next.js Route Handlers
(`/api/signup`, `/api/contact`) which today:

1. Validate input server-side.
2. Log to the server (placeholder).
3. Return a normalized success / error response to the client.

At M4, they will additionally:

1. Forward to the chosen ESP (Buttondown / Beehiiv / Resend).
2. Emit `signup_submit` / `contact_submit` events on success.

The forms do not depend on third-party JS to function — server-side handling
is the source of truth so the conversion still records if the analytics
script is blocked.

## Vercel Analytics option

Vercel Web Analytics is the **default** for this site because:

- Zero-config on a Vercel deploy.
- Free on Hobby up to a generous monthly event budget.
- Privacy-friendly (no cookies, no client-side IDs) — no consent banner
  required for it.
- Includes Core Web Vitals out of the box.

To enable:

1. In the Vercel project, turn on **Web Analytics** and **Speed Insights**.
2. Install the packages and mount the providers in `src/app/layout.tsx`
   (deferred to M4 so we don't pull in untracked deps now).

If we migrate off Vercel later, swap to **Plausible self-hosted** on the
chosen VPS — same dashboard semantics, similar cost profile, fully owned data.

## Privacy & consent

- Default to **cookieless** analytics (Vercel / Plausible / Cloudflare).
- If GA4 ships, gate the script behind explicit opt-in via the consent
  banner. No GA loads pre-consent.
- Honour Do-Not-Track and the regional rules of the audience (POPIA for
  South Africa, GDPR if EU traffic is meaningful).
- Document the data-flow in `/legal/privacy` before the site goes public.

## Open questions for stakeholder review

- What is the *primary* conversion we're optimising for at launch — signup,
  contact form, or something else?
- Which ESP will accept the signup? (Buttondown is cheapest; Beehiiv has
  better growth tooling.)
- Is GA4 required for stakeholder reporting, or can we live with Vercel +
  Plausible?
- What's the retention policy on form submissions and event data?
