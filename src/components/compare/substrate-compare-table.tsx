import Link from "next/link";
import type { SubstrateEntry } from "@/types/substrate";
import {
  SUBSTRATE_CATEGORY_LABEL,
  PH_EFFECT_LABEL,
  KH_EFFECT_LABEL,
  AMMONIA_RELEASE_LABEL,
} from "@/types/substrate";

interface SubstrateCompareTableProps {
  entries: ReadonlyArray<SubstrateEntry>;
}

/**
 * Substrate-mode comparison table. Renders the substrate-relevant
 * columns: brand, product name, category, colour, grain, pH, KH,
 * ammonia, nutrient content, lifespan, recommended water, price,
 * shrimp-safe, difficulty.
 *
 * Built to mirror the visual rhythm of the livestock compare table
 * but typed strictly to SubstrateEntry, livestock entries cannot
 * pass through this component.
 */
export function SubstrateCompareTable({
  entries,
}: SubstrateCompareTableProps) {
  if (entries.length === 0) return null;

  const rows: ReadonlyArray<{
    label: string;
    render: (e: SubstrateEntry) => React.ReactNode;
  }> = [
    {
      label: "Brand",
      render: (e) => e.brand,
    },
    {
      label: "Product",
      render: (e) => (
        <Link
          href={`/substrates/${e.slug}`}
          className="font-medium underline decoration-[var(--brand)]/40 underline-offset-4 transition-colors hover:text-[var(--brand)]"
        >
          {e.name}
        </Link>
      ),
    },
    {
      label: "Category",
      render: (e) => SUBSTRATE_CATEGORY_LABEL[e.category],
    },
    { label: "Country of origin", render: (e) => e.countryOfOrigin },
    { label: "Colour", render: (e) => e.colour },
    { label: "Grain size", render: (e) => e.grainSize },
    { label: "pH target", render: (e) => e.phTarget },
    { label: "pH effect", render: (e) => PH_EFFECT_LABEL[e.phEffect] },
    { label: "KH effect", render: (e) => KH_EFFECT_LABEL[e.khEffect] },
    {
      label: "Ammonia release",
      render: (e) => AMMONIA_RELEASE_LABEL[e.ammoniaRelease],
    },
    { label: "Nutrient content", render: (e) => e.nutrientContent },
    {
      label: "Buffering longevity",
      render: (e) => e.bufferingLongevity,
    },
    { label: "Recommended water", render: (e) => e.recommendedWater },
    {
      label: "Shrimp-safe",
      render: (e) => (
        <span
          className={
            e.shrimpSafe
              ? "font-medium text-[var(--brand)]"
              : "font-medium text-amber-700"
          }
        >
          {e.shrimpSafe ? "Yes" : "No"}
        </span>
      ),
    },
    {
      label: "Difficulty",
      render: (e) => `${e.difficulty} / 5`,
    },
  ];

  return (
    <div className="glass glass-edge overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-foreground/5">
            <tr>
              <th className="sticky left-0 z-10 w-44 bg-background/95 px-5 py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Field
              </th>
              {entries.map((e) => (
                <th
                  key={e.slug}
                  className="min-w-[180px] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-foreground"
                >
                  {e.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.label}
                className={
                  i % 2 === 0
                    ? "border-t border-border/40"
                    : "border-t border-border/40 bg-foreground/5/30"
                }
              >
                <th
                  scope="row"
                  className="sticky left-0 z-10 w-44 bg-background/95 px-5 py-3 text-xs font-medium text-muted-foreground"
                >
                  {row.label}
                </th>
                {entries.map((e) => (
                  <td
                    key={e.slug}
                    className="px-5 py-3 align-top text-sm text-foreground"
                  >
                    {row.render(e)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
