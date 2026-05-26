import { ExternalLink as ExternalLinkIcon } from "lucide-react";

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
}

/**
 * External-link wrapper used by the MDX `a` override.
 *
 * - Always opens in a new tab with `rel="noopener noreferrer"`.
 * - Adds `rel="nofollow"` for non-authority domains so we don't pass
 *   crawl equity to random outbound links.
 * - Renders a tiny external-link icon so readers see they're leaving the
 *   site before they click.
 *
 * The authority allow-list is intentionally short: scientific databases,
 * Wikipedia, and the canonical aquascaping references Fin & Stem cites.
 * Any domain outside the list gets `nofollow`.
 */
const AUTHORITY_DOMAINS: ReadonlySet<string> = new Set([
  "fishbase.se",
  "fishbase.org",
  "gbif.org",
  "iucnredlist.org",
  "wikipedia.org",
  "en.wikipedia.org",
  "wikidata.org",
  "wikimedia.org",
  "commons.wikimedia.org",
  "inaturalist.org",
  "tropica.com",
  "seriouslyfish.com",
  "2hraquarist.com",
  "aquasabi.com",
  "buceplant.com",
  "nature.com",
  "sciencedirect.com",
  "ncbi.nlm.nih.gov",
]);

function hostname(href: string): string | null {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function isAuthority(href: string): boolean {
  const host = hostname(href);
  if (!host) return false;
  // Match exact host or any subdomain of an authority host.
  return Array.from(AUTHORITY_DOMAINS).some(
    (auth) => host === auth || host.endsWith(`.${auth}`),
  );
}

export function ExternalLink({ href, children }: ExternalLinkProps) {
  const authority = isAuthority(href);
  const rel = authority ? "noopener noreferrer" : "noopener noreferrer nofollow";

  return (
    <a
      href={href}
      target="_blank"
      rel={rel}
      data-mdx="external-link"
      className="inline-flex items-baseline gap-1 text-[var(--brand)] underline decoration-[var(--brand)]/40 underline-offset-4 transition-colors hover:decoration-[var(--brand)]"
    >
      {children}
      <ExternalLinkIcon
        className="size-3 translate-y-px text-muted-foreground/80"
        aria-hidden
      />
    </a>
  );
}
