# POPIA and quantum-readiness checklist: Fin & Stem

| | |
| --- | --- |
| Project | Fin & Stem (finandstem.com), repository `mikelmira/finandstem` (public on GitHub) |
| Reviewed | 2026-11-05, on `main` at `206617c` (level with origin/main), plus the untracked `outreach/` folder |
| Reviewed by | Claude privacy-review, for Mike Elmira |
| Privacy owner | Mike Elmira (proposed; Confirm with 2.1-1) |
| Information Officer | Confirm (2.1-1): the responsible entity is not yet decided |
| Role | Undecided, for the Information Officer (2.1-1). The review was briefed that this is a client site, so the client would be the responsible party and Broadbrand its operator. The code points elsewhere: `src/lib/site.ts:10-13` names Mike Elmira, South Africa, as the site owner, and `outreach/store-outreach-list.md` describes it as Mike's own venture. If so, Mike Elmira (or his business) is the responsible party for every category below and there is no client. |

This is an engineering assessment, not legal advice. Items marked Confirm need
the named person to check them.

**What the site is.** An editorial reference site for planted freshwater
aquariums: species and gear catalogue pages, guides, calculators, a tank
planner and compare tools. Next.js 16.2.6, rendered statically and with ISR,
hosted on Vercel (commit `2c72d10` "Optimise ISR usage", and
`scripts/indexnow-submit.mjs:9`). It is in production: the IndexNow state file
`scripts/.indexnow-state.json` (git-ignored) was written on 23 Sep 2026 from the
live sitemap. There is no `.vercel/project.json` in this checkout and no
`vercel.json`, so the Vercel project is linked by Git integration and serverless
functions run in Vercel's default region, `iad1` (US East), unless the
dashboard says otherwise. `.env.example` declares one variable,
`NEXT_PUBLIC_SITE_URL`. The project `CLAUDE.md` describes an older plan to
self-host on Hetzner; the code and history show Vercel.

**It is not a shop.** There is no cart, checkout, payment provider, account,
database, contact form, server action or API route. The earlier "Stripe"
match was the word "stripes" in species descriptions (`src/data/fish.ts`,
`src/data/species-detail.ts` and generated data). Product pages link out to
retailers, some with an affiliate referral parameter (`src/data/products.ts:47`,
`src/app/gear/[category]/[id]/page.tsx:214-224`).

## Summary

| Severity | Gaps |
| --- | --- |
| High | 1 |
| Medium | 6 |
| Low | 3 |

**Do first**

1. Record the s72 basis for sending visitor and correspondent data to Google (Analytics, Gmail) and Vercel in the US. Closes G1. Owner: Vincent (Information Officer decision).
2. Load Google Analytics only after consent, with Consent Mode v2 defaulting to denied, or replace it with cookieless analytics (already proposed in `docs/TRACKING_PLAN.md`). Closes G2. Owner: Mike.
3. Hold the store outreach until the Information Officer decides whether it is direct marketing under s69 and which foreign anti-spam rules apply; keep a suppression list and one copy of the contact list in a business account. Closes G5. Owners: Vincent (decision), Mike (handling).
4. Rewrite `/legal/privacy` so it matches what the site does: no contact form, Google Analytics cookies, Vercel and Google as operators, transfers to the US, affiliate links, the responsible party's identity and the right to complain to the Information Regulator. Closes G3, after G1 and G4. Owner: Mike.
5. Move the site contact mailbox from a consumer Gmail account to a business mailbox with a data processing agreement and MFA. Closes G7. Owner: Mike.

**Waiting for confirmation**

- Vincent: which entity is the responsible party, and its Information Officer and registration (2.1-1).
- Mike: retention of Vercel logs, GA4 and the mailbox (2.3-3); the PAIA manual for that entity (2.6-3); MFA and the access list on Vercel, GitHub, Google Analytics and the mailbox (2.7-4); a security review schedule (2.7-14); the Vercel plan and operator terms with Vercel and Google Analytics (2.7-18); the breach procedure (2.7-21); whether any outreach emails have been sent and followed up (2.10-5); hybrid post-quantum key exchange at the Vercel edge (3.2-3).

## 1. Personal information inventory

No database, file store or form exists in the deployed app, so the inventory is
short. Values were not read; files and categories only.

| Category | Whose | Special or child? | Stored where | Shared with (country) | Purpose | Justification (s11) | Retention |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Request metadata: IP address, user agent, URL, referrer | Site visitors, worldwide including South Africa | No | Vercel edge and function logs | Vercel (US; global edge network; functions default `iad1`) | Hosting, security, abuse handling | Not recorded (G4). Proposed: legitimate interest, s11(1)(f) | Vercel plan default; Confirm (2.3-3) |
| Analytics identifiers and events: `_ga` cookies, client ID, device and browser, approximate location, pages viewed | Site visitors | No (a general audience may include children; nothing identifies them) | Visitor's browser; Google Analytics 4 property (`src/app/layout.tsx:11`, `:120-131`) | Google (US) | Learn which pages are useful | Not recorded (G4). Consent or legitimate interest, for the IO | GA4 property setting; Confirm (2.3-3) |
| Correspondence: email address, name, message content | Readers, brand representatives asking for logo removal (`src/app/about/page.tsx:169-174`), anyone making a privacy request | No by design; free text can contain anything | Contact mailbox, a consumer Gmail account (`src/lib/site.ts:15-17`; linked from `src/components/sections/footer.tsx:73`, `src/app/about/page.tsx:172`, `:231`) | Google (US) | Reply to enquiries, takedowns, privacy requests | Not recorded (G4) | Notice promises deletion 12 months after last reply (`src/content/legal.ts:18`); not enforced (G6) |
| Store outreach contacts: store name, city, website, "likely" contact email, positioning note | Juristic persons (88 specialist stores in South Africa, the UK, US, Germany, Canada, Australia and elsewhere); about 4 of 89 addresses look like named individuals rather than role addresses | No | `outreach/store-outreach-list.md` and `outreach/store-outreach-list.pdf`, untracked, in an iCloud-synced Desktop folder. `outreach/affiliate-programs.md`, `store-urls.md` and `store-urls.pdf` hold no contact addresses. Not part of the deployed app | Apple iCloud (US). The plan in the file is to send from a Gmail or Workspace account and track replies in Google Sheets (US) | Cold outreach for links, citations and partnerships | Not recorded; s69 question open (G5) | None set (G5) |
| Image attribution: photographer names and usernames, licence credits | Natural persons who published images on Wikimedia Commons and iNaturalist | No | `src/data/image-gallery.ts`, `src/data/image-attribution.ts`; published on every species page and in the public repository | Public website (Vercel), GitHub (US) | Licence-required attribution (CC BY, CC BY-SA) | Not recorded (G4). Proposed: s12(2)(a) deliberately made public, and the licence terms | As long as the image is used |
| Named people in editorial content | Public figures in the history of aquascaping | No | `src/content/history.ts` | Public website | Editorial history page | Not recorded (G4). Proposed: s12(2)(a), journalistic and literary purpose (s7) for the IO | Indefinite (published content) |
| Staff identity and contact: site owner's name, public contact address, staff work and personal addresses used as crawler contact in User-Agent strings | Staff (Broadbrand and DSG) | No | `src/lib/site.ts:10-17`, `src/content/legal.ts:22`, `:34`; User-Agent strings in 12 committed scraper scripts under `scripts/` and `scrape_images.py:31` | Public GitHub repository (US); sent to Wikimedia and iNaturalist APIs (US) when scrapers run | Public contact; crawler identification required by Wikimedia's User-Agent policy | Staff supplied them deliberately; see G9 | Indefinite (git history) |
| Browser storage: compare, planner and filter state | Site visitors | Not personal information: species and gear ids and UI state only, no identifier | Visitor's `localStorage` only (`src/lib/compare-storage.ts:18-19`, `src/lib/planner-storage.ts:15`, `src/lib/gear/compare-storage.ts:13`, `src/components/filters/filter-rail.tsx:9`) | Nobody | Remember selections between pages | N/A | Until the visitor clears it |
| Affiliate click-through | Visitors who click a sponsored link | No | Nothing kept by Fin & Stem | The retailer (2Hr Aquarist, UK) sets its own tracking after the click (`src/data/products.ts:47`, `:117`, `:127`; `affiliateUrl` in `src/data/gear.generated.json`) | Affiliate commission | The retailer is its own responsible party; disclose it in the notice (G3) | Retailer's policy |

Not found: special personal information, children's information, identity
numbers, location, payment data, accounts, AI model calls, agent memory,
push tokens, crash reporting. The committed catalogue workbook
`aquascaping-catalogue-seed.xlsx` (sheets README, Fish, Plants, Shrimp, Mosses,
Images) contains no email addresses; it was profiled, not read.

## 2. POPIA conditions

Status is Met, Gap, Confirm or N/A. Evidence is `path:line`, or the document
or person that confirms it. Every Gap has an ID (`G1`, `G2`...); a root cause
that shows up in several sections is recorded once and referred to by its ID
elsewhere.

### 2.1 Accountability

| ID | Check | Status | Severity | Evidence | What must happen | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| 2.1-1 | An Information Officer is named for the responsible party and registered | Confirm | | `src/lib/site.ts:10-13` names Mike Elmira as owner; `src/content/legal.ts` names no entity; review brief called it a client site | Decide which entity is the responsible party (Mike Elmira or his business, Broadbrand, or a client) and whether Broadbrand is an operator; record that entity's Information Officer and registration date | Vincent |
| 2.1-2 | Deputy Information Officers designated where needed | Confirm | | As 2.1-1 | Record with 2.1-1 | Vincent |
| 2.1-3 | A named person owns this project's privacy compliance | Confirm | | Header of this checklist | Confirm Mike Elmira as privacy owner | Vincent |

### 2.2 Processing limitation

| ID | Check | Status | Severity | Evidence | What must happen | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| 2.2-1 | Each field collected is needed for a stated purpose | Met | | No form, route handler, server action or middleware in `src/` (`git grep "use server"`, `NextResponse`, `<form` return nothing); the site collects no fields | Keep it so; re-review if a form is added | Mike |
| 2.2-2 | Forms ask for no more than the purpose needs | N/A | | No forms; contact is by `mailto:` link only | | |
| 2.2-3 | Identity numbers only where required | N/A | | None collected | | |
| 2.2-4 | Each purpose has a recorded s11 justification | Gap G4 | Medium | Section 1: no basis recorded for hosting logs, analytics, correspondence, image attribution, editorial names or outreach | Information Officer records the s11 basis for each purpose in section 1, and the s12(2)(a) exception for attribution names and public figures | Vincent |
| 2.2-5 | Where consent is the basis, it is specific, informed and recorded | Gap G2 | Medium | `src/app/layout.tsx:120-131` loads gtag.js and calls `gtag('config')` for every visitor on page load; no consent banner, no `gtag('consent','default',...)`, no record of a choice. `src/content/legal.ts:14` says GA4 runs in consent mode | Either set Consent Mode v2 with analytics and ad storage denied by default, show a choice, store it with a timestamp and wording version, and only then grant; or replace GA4 with cookieless analytics (Vercel Web Analytics or Cloudflare Web Analytics, as `docs/TRACKING_PLAN.md` proposes) | Mike |
| 2.2-6 | Consent can be withdrawn as easily as given | Gap, see G2 | | No choice exists to withdraw | Add a "cookie settings" link in the footer that revokes consent and deletes `_ga` cookies | Mike |
| 2.2-7 | Objection is possible where processing rests on legitimate interest | Gap, see G2 | | `src/content/legal.ts:14` tells visitors to use an ad blocker or Do-Not-Track; GA4 does not honour Do-Not-Track | Covered by the G2 fix and the G3 notice rewrite | Mike |
| 2.2-8 | Information is collected from the data subject, or an exception is recorded | Gap, see G4 | | Attribution names and history figures come from public sources; outreach contacts from stores' public contact pages (`outreach/store-outreach-list.md`, "How this list was built") | Record the s12(2)(a) exception under G4 | Vincent |

### 2.3 Purpose specification and retention

| ID | Check | Status | Severity | Evidence | What must happen | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| 2.3-1 | The purpose of each collection is specific and recorded | Gap, see G4 | | Purposes are now written in section 1; `src/content/legal.ts:10-18` states purposes for a contact form that does not exist | Information Officer approves section 1's purposes with G4 | Vincent |
| 2.3-2 | A retention period is set for each category and enforced | Gap G6 | Medium | `src/content/legal.ts:18` promises deletion of enquiries 12 months after the last reply; nothing records or enforces it in the mailbox; outreach list has no period | Write a short procedure: retention for mailbox threads (with a monthly or quarterly purge), the outreach list and its tracker, and how a privacy request is verified, answered, logged and carried out across the mailbox, the outreach files, GA4 (user deletion) and Vercel logs | Mike |
| 2.3-3 | Retention covers backups, logs, analytics and third parties | Confirm | | Vercel log retention depends on plan; GA4 event retention is a property setting (2 or 14 months); Gmail keeps mail until deleted | Record the Vercel plan's log retention, set and record GA4 data retention, and record the mailbox retention | Mike |
| 2.3-4 | Records kept longer for a law name the law and period | N/A | | No RICA, FICA or tax records | | |
| 2.3-5 | Deletion is destruction or irreversible de-identification | Gap, see G6 | | No deletion process exists | Covered by G6 | Mike |

### 2.4 Further processing

| ID | Check | Status | Severity | Evidence | What must happen | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| 2.4-1 | Data is not reused for an incompatible purpose | Met | | No data store or export in the code; analytics is the GA4 default page view only (`src/app/layout.tsx:129`, no custom events or user ids). Google signals and ads linking are console settings, covered under 2.7-18 | Keep GA4 unlinked from Google Ads and Google signals off unless the notice says otherwise | Mike |
| 2.4-2 | Production personal information is not copied to dev or test | N/A | | No database or production data | | |
| 2.4-3 | Nothing is sent to an AI model provider | N/A | | No model calls in the code (`src/app/robots.ts` only sets crawler access to public pages) | | |

### 2.5 Information quality

| ID | Check | Status | Severity | Evidence | What must happen | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| 2.5-1 | Data subjects can correct their details | Gap, see G6 | | Only by email (`src/content/legal.ts:22`); no procedure or record | Covered by G6 | Mike |
| 2.5-2 | Data used for decisions is validated at entry | N/A | | No inputs and no decisions | | |

### 2.6 Openness

| ID | Check | Status | Severity | Evidence | What must happen | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| 2.6-1 | A privacy notice at or before collection covers what, why, who it is shared with, transfers abroad and the right to complain to the Regulator | Gap G3 | Medium | `src/content/legal.ts:1-37` (served at `/legal/privacy`, linked from the footer). It does not name the responsible party or its address, the operators (Vercel, Google), the transfer to the US, the affiliate links, or the right to complain to the Information Regulator | Rewrite the notice after G1 and G4: name the responsible party and contact; list Vercel, Google Analytics and the mailbox provider; say data goes to the US and on what basis; describe analytics cookies and the consent choice; disclose sponsored links; add the Information Regulator complaint right and a PAIA link | Mike |
| 2.6-2 | The notice matches what the code does | Gap, see G3 | | `src/content/legal.ts:10` and `:17-18` describe a contact form that does not exist; `:10` says no data is shared with third parties (Google and Vercel receive it); `:14` says consent mode is used (it is not, see G2); `:26` says no tracking cookies are set (GA4 sets `_ga` cookies) | Covered by G3 | Mike |
| 2.6-3 | A PAIA manual exists for the entity and is published | Confirm | | None linked | Confirm the PAIA manual of the entity decided in 2.1-1 and link it from the notice | Mike |

### 2.7 Security safeguards, operators and breaches

| ID | Check | Status | Severity | Evidence | What must happen | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| 2.7-1 | Routes require authentication by default | N/A | | No authenticated routes, admin or API; every route is a public page | | |
| 2.7-2 | Identity from the token, ownership checked | N/A | | No users or records | | |
| 2.7-3 | Secrets have no defaults and are not in the repository | Met | | `.gitignore:33-35` ignores `.env*` except `.env.example`, which holds one public variable name. The GA measurement id, search-console verification tokens and the IndexNow key in source are public by design (`scripts/indexnow-submit.mjs:17-19`) | | |
| 2.7-4 | Staff and admin accounts use MFA | Confirm | | The public repository deploys on push; the Vercel project, GA4 property and mailbox are the only privileged accounts | Confirm MFA on GitHub (`mikelmira`), the Vercel account or team, the Google account that owns GA4, and the contact mailbox; record who owns each | Mike |
| 2.7-5 | Sessions expire | N/A | | No sessions | | |
| 2.7-6 | Databases and internal services on loopback or private network | N/A | | None | | |
| 2.7-7 | Personal information is encrypted in transit | Met | | HSTS with preload on every path (`next.config.ts:80-91`); www redirects to the https apex (`next.config.ts:67-75`); GA loads over https (`src/app/layout.tsx:121`); no outbound server calls at runtime (no `fetch(` in `src/`) | | |
| 2.7-8 | Personal information is encrypted at rest | N/A | | The project keeps no store; Vercel logs and GA4 are provider-managed (see 2.7-18) | | |
| 2.7-9 | Special personal information has stronger control | N/A | | None | | |
| 2.7-10 | Staff access is limited by role, logged and reviewed | Confirm, see 2.7-4 | | As 2.7-4 | Keep a list of who can reach the Vercel project, GA4 property and mailbox, and review it twice a year | Mike |
| 2.7-11 | Personal information does not appear in logs, error reports or analytics events | Met | | No `console.*` calls in `src/`; GA4 sends default page views only (`src/app/layout.tsx:129`); URLs are catalogue slugs with no personal data | | |
| 2.7-12 | Object storage holding personal information is private | N/A | | `public/` holds site assets only | | |
| 2.7-13 | Backups are tested by restoring | N/A | | No database; source is in GitHub | | |
| 2.7-14 | Security is reviewed on a schedule | Confirm | | No record | Set a review schedule (yearly, and when a form, account or shop is added) | Mike |
| 2.7-15 | Cryptography assessed against quantum risk | Met | | Section 3 of this checklist, 2026-11-05 | | |
| 2.7-16 | Response headers limit which scripts can run | Gap G8 | Low | `next.config.ts:80-104` sets HSTS, nosniff, Referrer-Policy and Permissions-Policy but no Content-Security-Policy; GA is injected as an inline script (`src/app/layout.tsx:124-131`) | Add a CSP allowing self and the Google Analytics hosts, with a nonce or hash for the inline GA snippet | Mike |
| 2.7-17 | Staff personal information is not exposed in the public repository | Gap G9 | Low | Staff work and personal email addresses are committed as crawler contact in User-Agent strings in 12 scraper scripts (`scripts/scrape-images*.py`, `scripts/fix-*-images.py`, `scrape_images.py:31`), and the owner's work address is in `CLAUDE.md:4`; repository is public | Replace them with the site contact address or a role address; ask the staff members whether they want them removed from git history | Mike |
| 2.7-18 | Each operator has a written contract with s19 safeguards and confidentiality | Confirm | | See 2.12. Vercel's Hobby plan is for non-commercial use only; the site carries affiliate links | Confirm the Vercel plan and account owner (move to Pro if Hobby), that Vercel's DPA applies, and that the Google Analytics data processing terms are accepted in the GA4 admin | Mike |
| 2.7-19 | Each operator must notify a security compromise | Confirm, see 2.7-18 | | | Record the breach-notice clause with 2.7-18 | Mike |
| 2.7-20 | Where the project is an operator for a client, that contract carries the same | Confirm, see 2.1-1 | | Depends on who the responsible party is | If a client is the responsible party, record a written agreement with s21 operator terms and a breach-notice clause | Vincent |
| 2.7-21 | A written breach procedure exists | Confirm | | None in the repository | Confirm the DSG breach procedure covers this site, its mailbox and the outreach list, including who notifies the Regulator | Mike |
| 2.7-22 | The project can tell which data subjects a compromise affected | Confirm, see 2.7-21 | | The only stores are the mailbox, the outreach files and provider logs | Covered by 2.7-21 | Mike |
| 2.7-23 | The project can contact affected data subjects | Met | | Correspondents and outreach contacts are identified by their email addresses; visitors are not identifiable to the project | | |
| 2.7-24 | A written notification template exists | Confirm, see 2.7-21 | | | Covered by 2.7-21 | Mike |

### 2.8 Data subject participation

| ID | Check | Status | Severity | Evidence | What must happen | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| 2.8-1 | A data subject can get a copy of what is held | Gap, see G6 | | `src/content/legal.ts:22` offers requests by email within 14 days; no procedure covers the mailbox, outreach files or GA4 | Covered by G6 | Mike |
| 2.8-2 | Deletion reaches every store and operator | Gap, see G6 | | Stores: mailbox, `outreach/` files and their iCloud copies, any outreach tracker, GA4, Vercel logs | Covered by G6 | Mike |
| 2.8-3 | Requests are verified | Gap, see G6 | | No procedure | Covered by G6 | Mike |
| 2.8-4 | Requests are answered in time and recorded | Gap, see G6 | | No log | Covered by G6 | Mike |

### 2.9 Special personal information and children

| ID | Check | Status | Severity | Evidence | What must happen | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| 2.9-1 | Each special category has a recorded authorisation | N/A | | No special personal information collected; health content on the site is about fish and plants | | |
| 2.9-2 | Biometric data stored separately and encrypted | N/A | | None | | |
| 2.9-3 | Biometric data not sent abroad without a basis | N/A | | None | | |
| 2.9-4 | The project knows whether it collects children's information | N/A | | No sign-up, form or age field; a general hobby reference site collects nothing that identifies a child | Re-review if accounts, comments or uploads are added (`src/content/legal.ts:62` says they are not enabled) | |
| 2.9-5 | Parental consent collected where needed | N/A | | As 2.9-4 | | |
| 2.9-6 | Age gate enforced on the server | N/A | | As 2.9-4 | | |

### 2.10 Prior authorisation, direct marketing, automated decisions, cross-border

| ID | Check | Status | Severity | Evidence | What must happen | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| 2.10-1 | No s57 prior authorisation is needed, or it is obtained | N/A | | No unique identifiers linked, no criminal, credit, special or children's information | | |
| 2.10-2 | Electronic marketing goes only to people who opted in, or customers offered an opt-out | Gap G5 | Medium | `outreach/store-outreach-list.md` (untracked): 88 stores, none of them customers, planned cold email from a Gmail or Workspace account, 15 to 25 a day, with a day-14 follow-up; opt-out only by replying STOP. Juristic persons are data subjects under POPIA, and about 4 addresses look like named individuals. Whether this is direct marketing under s69 (promoting a free site, affiliate links and partnerships) is not recorded. If the Information Officer decides it is, each first email to a non-customer must be the single permitted consent request and the follow-up is not allowed; sending otherwise would be High | Information Officer decides whether s69 applies and which foreign rules apply (CASL in Canada, PECR in the UK, UWG in Germany, ECTA s45 and CPA s11 at home) before any further sends | Vincent |
| 2.10-3 | Every message identifies the sender and has a working opt-out | Met | | The template in `outreach/store-outreach-list.md` ("Outreach email template") names the sender and the site and offers a reply-STOP opt-out. Untracked, not deployed | Keep both if G5 allows sending | |
| 2.10-4 | Opt-out is honoured across every channel and system | Gap, see G5 | Medium | No suppression list exists; the contact list sits in two copies (`.md` and `.pdf`) in an iCloud-synced Desktop folder | Hold sends until 2.10-2 is decided; keep one copy of the list in a business account, delete the PDF copy, and keep a suppression list of anyone who replies STOP, checked before every send | Mike |
| 2.10-5 | Consent requests to non-customers are made once only | Confirm | | The plan includes a day-14 follow-up; whether any emails have gone out is not recorded | Confirm whether outreach emails have been sent, from which account, whether follow-ups went out, and whether anyone opted out | Mike |
| 2.10-6 | Every automated decision about a person is listed | N/A | | None; ratings on gear pages describe products | | |
| 2.10-7 | Each automated decision has a human review path | N/A | | None | | |
| 2.10-8 | Every operator has a recorded processing country | Met | | Recorded in section 1 and 2.12 by this review. No `vercel.json` and no `preferredRegion`, so any function runs in `iad1` (US) by default; pages are served from Vercel's global edge | Covered by G1 | |
| 2.10-9 | Each foreign transfer has a recorded basis | Gap G1 | High | Visitor IP and device data go to Vercel (US) and Google Analytics (US) on every page view (`src/app/layout.tsx:120-131`); correspondence sits in Gmail (US); the outreach list sits in iCloud (US). No s72 basis is recorded anywhere | Information Officer records the s72 basis for Vercel, Google Analytics, Gmail and iCloud (adequate law or binding agreement, consent, or contract), or the transfer stops | Vincent |
| 2.10-10 | The notice says information goes abroad, and where | Gap, see G3 | | `src/content/legal.ts` says nothing about transfers | Covered by G3 | Mike |

### 2.11 AI models and agents

| ID | Check | Status | Severity | Evidence | What must happen | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| 2.11-1 | Model calls listed with the personal information they send | N/A | | No model provider SDK or call in the code | | |
| 2.11-2 | Agent memory, profiles and transcripts inventoried | N/A | | No agent | | |
| 2.11-3 | Agents that email people use a business account and say they are automated | N/A | | Outreach is manual, by a person (see G5) | | |

### 2.12 Operators

| ID | Operator | Processes | Country | Contract with s21 terms | Breach notice clause | Status | Severity |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2.12-1 | Vercel | Hosting; edge and function request logs (IP, user agent, URL) | US, global edge; functions default `iad1` | Confirm: plan unknown; Hobby is non-commercial and the site carries affiliate links | Confirm | Confirm (2.7-18) | |
| 2.12-2 | Google Analytics 4 | Visitor identifiers, device data, page views | US | Confirm: GA data processing terms accepted in the property admin | Confirm | Confirm (2.7-18) | |
| 2.12-3 | Google Gmail (consumer account) | Correspondence with readers, brands and privacy requests; outreach sending is planned from Gmail or Workspace | US | No: consumer Gmail terms are not operator terms | No | Gap G7: move the contact mailbox to a business account with a DPA (for example Google Workspace) and MFA | Medium |
| 2.12-4 | Apple iCloud (Desktop sync) | Store outreach contact list | US | No: consumer account | No | Gap, see G5 (2.10-4) | |
| 2.12-5 | GitHub | Public source code, including staff contact addresses (G9) | US | Not an operator for visitor data | N/A | N/A | |
| 2.12-6 | 2Hr Aquarist (affiliate) | Its own tracking after a visitor clicks a sponsored link | UK | Not an operator: it is its own responsible party | N/A | N/A; disclose in the notice (G3) | |

## 3. Quantum-security readiness

### 3.1 Cryptography inventory

Dated 2026-11-05. The code chooses no cryptography: no JWT, password hashing,
signing, cipher or hash call in `src/` or the scripts (searched with the
patterns in QUANTUM.md; the only matches were names in image credits). All
cryptography is TLS supplied by the platforms.

| Where | Algorithm and size | Library and version | Protects | Data lifetime | Quantum risk | Action |
| --- | --- | --- | --- | --- | --- | --- |
| Visitor to Vercel edge (finandstem.com) | TLS 1.2/1.3, key exchange chosen by Vercel; hybrid `X25519MLKEM768` not verified | Vercel edge (provider-managed) | Page requests: IP, user agent, URL | Short: browsing of a hobby site | Low (Medium if classical-only, as other personal information) | Verify the negotiated group in a current browser (3.2-3) |
| Visitor to Google Analytics (googletagmanager.com, google-analytics.com) | TLS 1.3; Google offers hybrid post-quantum key exchange to current browsers | Google front end (provider-managed) | Analytics identifiers and page views | Up to the GA4 retention setting | Low | Record Google's position (3.2-10) |
| Correspondents to the contact mailbox | TLS between mail servers, opportunistic; Gmail web TLS 1.3 | Google (provider-managed) | Email content | Up to 12 months by the notice | Low | Record with 3.2-10; moves with G7 |
| Vercel functions and ISR rendering | No outbound calls at runtime (no `fetch(` in `src/`) | Node version unpinned (no `engines`, `.nvmrc` or `.node-version`); Vercel default | Nothing personal leaves the server | None | None | None |
| Build and maintenance scripts (`scripts/indexnow-submit.mjs`, scrapers) | TLS from the local Node runtime (Node 22.20.0, OpenSSL 3.5.2 on the developer machine) | Node `fetch`, Python `requests` | Public URLs and images; staff contact address in User-Agent | None | None | None |
| Data at rest | Provider-managed (Vercel logs, GA4, Gmail, iCloud) | Providers | Logs, analytics, mail, outreach list | As above | None to Low | None; the project keeps no store of its own |

### 3.2 Readiness checks

| ID | Check | Status | Severity | Evidence | What must happen | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| 3.2-1 | A cryptography inventory exists and is kept current | Met | | Section 3.1, dated 2026-11-05 | Update at each review | Mike |
| 3.2-2 | Long-lived sensitive data is identified and its transport ranked first | Met | | Section 1: no identity numbers, biometrics, health, financial or special information on any path | | |
| 3.2-3 | Hybrid post-quantum key exchange is enabled at the edge | Confirm | | Vercel-managed; not verified | Verify `X25519MLKEM768` is negotiated on finandstem.com in a current browser's security panel | Mike |
| 3.2-4 | Hybrid key exchange from edge to origin and between internal services | N/A | | No origin or internal service of the project's own; functions make no outbound calls | | |
| 3.2-5 | SSH to servers uses post-quantum key exchange | N/A | | No servers | | |
| 3.2-6 | Symmetric encryption at rest uses 256-bit keys | N/A | | No project-managed store; providers hold everything | | |
| 3.2-7 | No algorithm in the "Broken now" row is in use | Met | | No cryptography in code; HSTS forces HTTPS (`next.config.ts:86-87`); TLS versions are provider-managed | | |
| 3.2-8 | Cryptography is configurable, not hard-coded | N/A | | The project chooses no algorithms; it inherits TLS from Vercel and Google, and the Node runtime is unpinned, so it follows Vercel's current default | | |
| 3.2-9 | Mobile certificate pinning will not block a change | N/A | | No mobile app | | |
| 3.2-10 | Third-party providers asked about their post-quantum plans | Gap G10 | Low | No record for Vercel or Google | Record Vercel's and Google's post-quantum positions in the group register (phase6-pack/12) | Mike |
| 3.2-11 | A target date to retire classical-only key exchange is set | Met | | Group date 30 June 2029, confirmed by Vincent on 31 October 2026 (phase6-pack/11) | | |

## 4. Related law to confirm

- **RICA**: does not apply; no SIM or communications records. No one to confirm.
- **FICA**: does not apply; no accountable institution or customer due diligence. No one to confirm.
- **Cybercrimes Act**: the site is not an electronic communications service provider or financial institution, so the 72-hour reporting duty does not apply. Vincent to confirm.
- **ECTA**: s45 (unsolicited commercial communications: opt-out and source identification) applies to the store outreach; the template has both. s43 disclosures apply only if the site starts selling. Vincent to confirm, with G5.
- **Consumer Protection Act**: s11 direct-marketing opt-out and the pre-emptive block register may apply to outreach aimed at smaller juristic persons. Vincent to confirm, with G5.
- **Foreign law**: the outreach list covers Canada (CASL), the UK (PECR, UK GDPR), Germany and the EU (UWG, GDPR and ePrivacy); GA4 serves EU visitors and the notice already claims GDPR rights. Vincent to confirm which apply.
- **Sector regulator**: none.

## History

| Date | Reviewer | High | Medium | Low | Notes |
| --- | --- | --- | --- | --- | --- |
| 2026-11-05 | Claude privacy-review, for Mike Elmira | 1 | 6 | 3 | First review, on `main` at `206617c` plus untracked `outreach/`. 9 items to confirm. Static Next.js site on Vercel, no forms, accounts, payments or AI; Stripe match was "stripes". 3.2-11 Met by group date. Live Vercel and GA4 settings not inspected. |
