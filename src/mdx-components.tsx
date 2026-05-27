/**
 * MDX component mapping — the single source of truth for what custom
 * React components MDX articles can use inline, plus the styling overrides
 * for built-in markdown elements (`h2`, `a`, `blockquote`, etc.).
 *
 * Next.js automatically picks up `src/mdx-components.tsx` for both the
 * `@next/mdx` and `next-mdx-remote` pipelines.
 */

import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import Image from "next/image";
import { SpeciesCard } from "@/components/mdx/species-card";
import { PillarLink } from "@/components/mdx/pillar-link";
import { ExternalLink } from "@/components/mdx/external-link";
import { Faq } from "@/components/seo/faq";
import { Sources } from "@/components/seo/sources";

export function useMDXComponents(
  components: MDXComponents = {},
): MDXComponents {
  return {
    // ─── Custom React components available inside MDX ──────────────
    SpeciesCard,
    PillarLink,
    ExternalLink,
    Faq,
    Sources,

    // ─── Markdown element overrides ────────────────────────────────
    h1: ({ children, ...props }) => (
      <h1
        className="text-display-tight mt-12 mb-6 text-balance text-3xl sm:text-4xl md:text-5xl"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="text-display-tight mt-12 mb-5 text-balance text-2xl sm:text-3xl"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className="mt-10 mb-3 text-xl font-semibold tracking-tight sm:text-2xl"
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 className="mt-8 mb-2 text-base font-semibold tracking-tight sm:text-lg" {...props}>
        {children}
      </h4>
    ),
    p: ({ children, ...props }) => (
      <p
        className="my-4 text-pretty text-base leading-relaxed text-foreground/90 sm:text-[17px] sm:leading-[1.7]"
        {...props}
      >
        {children}
      </p>
    ),
    a: ({ href, children, ...props }) => {
      const isExternal = typeof href === "string" && /^https?:\/\//.test(href);
      if (isExternal) {
        return (
          <ExternalLink href={href!}>
            {children as React.ReactNode}
          </ExternalLink>
        );
      }
      return (
        <Link
          href={href ?? "#"}
          className="text-[var(--brand)] underline decoration-[var(--brand)]/40 underline-offset-4 transition-colors hover:decoration-[var(--brand)]"
          {...props}
        >
          {children}
        </Link>
      );
    },
    ul: ({ children, ...props }) => (
      <ul
        className="my-5 ml-5 list-disc space-y-2 text-base leading-relaxed text-foreground/90 marker:text-[var(--brand)] sm:text-[17px]"
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol
        className="my-5 ml-5 list-decimal space-y-2 text-base leading-relaxed text-foreground/90 marker:text-[var(--brand)] sm:text-[17px]"
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="pl-1" {...props}>
        {children}
      </li>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="my-6 rounded-r-2xl border-l-4 border-[var(--brand)] bg-muted/30 px-5 py-4 text-base italic leading-relaxed text-foreground/85 sm:text-[17px]"
        {...props}
      >
        {children}
      </blockquote>
    ),
    code: ({ children, ...props }) => (
      <code
        className="rounded-md border border-border/60 bg-muted/60 px-1.5 py-0.5 text-[0.92em] font-mono text-foreground"
        {...props}
      >
        {children}
      </code>
    ),
    pre: ({ children, ...props }) => (
      <pre
        className="my-6 overflow-x-auto rounded-2xl border border-border/60 bg-muted/30 p-4 text-sm font-mono leading-relaxed"
        {...props}
      >
        {children}
      </pre>
    ),
    hr: (props) => (
      <hr className="my-12 border-border/60" {...props} />
    ),
    table: ({ children, ...props }) => (
      <div className="my-6 overflow-x-auto rounded-2xl border border-border/60">
        <table className="w-full border-collapse text-sm" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th
        className="border-b border-border/60 bg-muted/40 px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td
        className="border-b border-border/60 px-4 py-3 text-foreground/85"
        {...props}
      >
        {children}
      </td>
    ),
    img: ({ src, alt, ...rest }) => {
      // Cast away the various HTMLImageElement props next/image doesn't expose.
      const { width, height, ...props } = rest as {
        width?: number;
        height?: number;
      };
      if (typeof src !== "string") return null;
      return (
        <span className="my-6 block overflow-hidden rounded-2xl border border-border/60">
          <Image
            src={src}
            alt={alt ?? ""}
            width={width ?? 1200}
            height={height ?? 800}
            sizes="(max-width: 1024px) 100vw, 768px"
            className="h-auto w-full"
            {...props}
          />
        </span>
      );
    },

    ...components,
  };
}
