import Link from "next/link";
import { ArrowUpRight, NotebookPen } from "lucide-react";
import { findBuild } from "@/data/builds";

interface BuildLinkProps {
  /** Build journal slug — must exist in src/data/builds.ts. */
  slug: string;
}

/**
 * Inline build-journal reference for MDX guides. When the matching build
 * exists in `src/data/builds.ts`, renders a small card linking to
 * `/builds/<slug>`. When it doesn't (the journal isn't published yet),
 * returns `null` silently — so a guide can reference a future build
 * without breaking before that build ships.
 *
 * Dev-time guard: in development mode the missing-build path renders a
 * visible warning instead so authors notice the dangling reference.
 */
export function BuildLink({ slug }: BuildLinkProps) {
  const build = findBuild(slug);

  if (!build) {
    if (process.env.NODE_ENV === "development") {
      return (
        <span className="my-2 inline-block rounded-md border border-amber-500/40 bg-amber-500/5 px-2 py-1 text-xs text-amber-600">
          BuildLink: no journal yet for slug &quot;{slug}&quot;
        </span>
      );
    }
    return null;
  }

  return (
    <Link
      href={`/builds/${build.slug}`}
      data-mdx="build-link"
      className="glass glass-edge lift group my-6 flex items-center gap-4 rounded-2xl p-4 no-underline transition-colors hover:border-[var(--brand)]/40 sm:p-5"
    >
      <span className="inline-flex size-11 flex-none items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
        <NotebookPen className="size-5" aria-hidden />
      </span>
      <span className="flex-1">
        <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--brand)]">
          Build journal
        </span>
        <span className="text-display-tight mt-0.5 block text-base leading-tight sm:text-lg">
          {build.title}
        </span>
        <span className="block text-xs text-muted-foreground">
          {build.tagline}
        </span>
      </span>
      <ArrowUpRight
        className="size-4 flex-none text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand)]"
        aria-hidden
      />
    </Link>
  );
}
