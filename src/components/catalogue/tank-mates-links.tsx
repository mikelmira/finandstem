import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORY_META, type CatalogueEntry } from "@/types/catalogue";

/**
 * A discoverable strip of tank-mate guides for an animal category page.
 * Links to a handful of species' /tank-mates pages so the generated pages
 * have an obvious front door beyond the individual species pages.
 */
export function TankMatesLinks({
  entries,
  limit = 10,
}: {
  entries: ReadonlyArray<CatalogueEntry>;
  limit?: number;
}) {
  const picks = entries.slice(0, limit);
  if (picks.length === 0) return null;
  const meta = CATEGORY_META[picks[0].category];
  const noun = meta.singular.toLowerCase();
  return (
    <section className="glass glass-edge rounded-2xl p-6 sm:p-7">
      <h2 className="text-display-tight text-xl sm:text-2xl">
        {meta.singular} tank-mate guides
      </h2>
      <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
        Every {noun} here has its own tank-mate list, matched from the catalogue
        on water and temperament. Open any species and check &ldquo;Who it lives
        with&rdquo;, or start with one of these.
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {picks.map((e) => (
          <li key={e.slug}>
            <Link
              href={`${meta.path}/${e.slug}/tank-mates`}
              className="press inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-3 py-1.5 text-sm backdrop-blur transition-colors hover:border-[var(--brand)]/40"
            >
              {e.commonName} tank mates
              <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
