# STRUCTURE

How this codebase is organised and the conventions every contributor (human or
AI) is expected to follow.

## Folder structure

```
aqua-joy/
├── docs/                       Project documentation (this folder)
├── public/
│   └── images/                 Static images served at /images/*
├── src/
│   ├── app/                    Next.js App Router — routes, layouts, metadata
│   │   ├── layout.tsx          Root layout, fonts, providers, header/footer
│   │   ├── page.tsx            Home page composition
│   │   ├── globals.css         Tailwind v4 + shadcn theme tokens + brand
│   │   ├── sitemap.ts          /sitemap.xml generator
│   │   ├── robots.ts           /robots.txt generator
│   │   ├── api/
│   │   │   ├── signup/         POST /api/signup (placeholder)
│   │   │   └── contact/        POST /api/contact (placeholder)
│   │   ├── about/page.tsx
│   │   ├── catalogue/page.tsx
│   │   ├── approach/page.tsx
│   │   ├── roadmap/page.tsx
│   │   ├── contact/page.tsx
│   │   └── legal/
│   │       ├── privacy/page.tsx
│   │       └── terms/page.tsx
│   ├── components/
│   │   ├── ui/                 shadcn primitives — DO NOT edit directly,
│   │   │                        re-add with `pnpm dlx shadcn@latest add ...`
│   │   ├── sections/           Page sections (Hero, FAQ, Pillars, etc.)
│   │   └── wave-mark.tsx       Inline brand mark SVG
│   ├── content/                Typed content modules — copy lives here,
│   │                            not inside components
│   │   ├── home.ts
│   │   ├── about.ts
│   │   ├── catalogue.ts
│   │   ├── approach.ts
│   │   ├── roadmap.ts
│   │   ├── contact.ts
│   │   └── legal.ts
│   └── lib/
│       ├── utils.ts            shadcn `cn()` helper
│       ├── site.ts             Site config (name, nav, footer)
│       └── analytics.ts        Placeholder event tracker
├── components.json             shadcn config
├── next.config.ts              Next.js config
├── tsconfig.json               TypeScript config (path alias: @/* → src/*)
├── eslint.config.mjs           ESLint flat config
├── postcss.config.mjs          PostCSS (Tailwind v4 plugin)
└── package.json
```

## Section composition rules

Sections are the only unit a page is allowed to render. Pages compose
sections — they don't define layout or styling themselves.

1. **One section = one file** in `src/components/sections/<section>.tsx`.
   Kebab-case file names: `hero.tsx`, `value-props.tsx`, `faq.tsx`.
2. **Sections own their layout** (container width, vertical spacing, grid),
   not the page. Use `<SectionShell>` from `section-shell.tsx` for consistency.
3. **Sections accept content as props** — never hardcode marketing copy
   inside a section. Copy comes from `src/content/`.
4. **No data fetching inside sections** at this phase. Sections are pure
   presentation. If a future section needs server data, fetch in the page
   (a server component) and pass it down.
5. **shadcn primitives only** for interactive controls (buttons, cards,
   accordions, dialogs, etc.). If a primitive doesn't exist, add it with
   `pnpm dlx shadcn@latest add <name>`, don't hand-roll one.
6. **Use semantic landmarks** (`<section>`, `<header>`, `<nav>`, `<footer>`)
   so screen readers can navigate.
7. **Brand colour is a CSS variable** (`--brand`, `--brand-soft`), never a
   hex literal. Use the theme tokens in `globals.css` (`bg-background`,
   `text-foreground`, `bg-[var(--brand)]`, etc.).
8. **Client components are opt-in.** Mark `"use client"` only when a section
   needs interactivity (forms, accordions handled by shadcn already, etc.).

## Content management approach

Content lives in **`src/content/`** as plain TypeScript modules, one file per
page or domain area (e.g. `home.ts`, `about.ts`, `faq.ts`). Each module
exports a typed `as const` object that sections consume as props.

Why TypeScript modules (not Markdown / MDX / a headless CMS) at this phase:

- **One-deploy story.** Editing copy means editing source — no extra service
  to host, no separate auth.
- **Type safety.** A section's prop shape and its content shape are checked
  at build time. Renaming a field surfaces the rename everywhere.
- **AI-friendly.** Claude Code can rewrite copy in-place without learning a
  new authoring surface.
- **No premature CMS.** The real CMS (Payload) lands with the catalogue
  phase, not the proposal site.

When the catalogue phase begins, structured records (plants, fish,
hardscape, equipment) will move into Payload — but the marketing copy on
proposal-site pages will likely stay in `src/content/`.

## Naming conventions

- **Files:** kebab-case (`value-props.tsx`, `audience-fit.tsx`).
- **Components:** PascalCase (`ValueProps`, `AudienceFit`).
- **Content modules:** lowercase noun matching the page (`home.ts`).
- **Routes:** kebab-case path segments.

## Import paths

Use the `@/` alias for everything inside `src/`:

```tsx
import { Button, buttonVariants } from "@/components/ui/button";
import { Hero } from "@/components/sections/hero";
import { home } from "@/content/home";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
```

Never use deep relative paths (`../../../`).

## shadcn / Base UI note

This shadcn install is on the new **`base-nova`** preset, which uses
[Base UI](https://base-ui.com/) underneath instead of Radix. Two consequences
worth knowing:

- `<Button>` does **not** accept `asChild`. To render a button-styled `<Link>`,
  call `buttonVariants(...)` and apply it to the `<Link>` directly (see
  `site-header.tsx` and `hero.tsx`).
- `<Accordion>` does **not** accept `type="single" / "multiple" / collapsible`.
  Use `value` / `defaultValue` (an array of expanded item values) instead.
