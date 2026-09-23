import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GearCard } from "@/components/gear/gear-card";
import { getGear, toCard } from "@/lib/gear";
import { GEAR_LINKS, gearCategoryHref } from "@/lib/gear/links";

/**
 * "Compare options" block that links a content page (a deficiency, an algae,
 * a calculator) into the relevant corner of the gear catalogue.
 */
export function GearLinks({ linkKey, className }: { linkKey: string; className?: string }) {
  const set = GEAR_LINKS[linkKey];
  if (!set) return null;
  const products = set.products.map(getGear).filter((p): p is NonNullable<typeof p> => Boolean(p));
  if (products.length === 0 && set.categories.length === 0) return null;
  return (
    <section className={className}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-display-tight text-2xl sm:text-3xl">{set.heading}</h2>
        <span className="text-xs text-muted-foreground">From our gear catalogue</span>
      </div>
      {products.length > 0 && (
        <ul className="mt-5 grid gap-4 sm:grid-cols-3">
          {products.map((p) => (
            <li key={p.id}>
              <GearCard card={toCard(p)} showCompare={false} showRatings={false} />
            </li>
          ))}
        </ul>
      )}
      {set.categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {set.categories.map((c) => (
            <Link
              key={c.label}
              href={gearCategoryHref(c)}
              className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-sm transition-colors hover:border-[var(--brand)]/40"
            >
              {c.label}
              <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
