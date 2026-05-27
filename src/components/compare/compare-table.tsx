import Link from "next/link";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { CATEGORY_META, type CatalogueEntry } from "@/types/catalogue";
import { getImage } from "@/data";
import { parseRange, overlaps } from "@/lib/range";
import { cn } from "@/lib/utils";

interface CompareTableProps {
  entries: CatalogueEntry[];
}

interface Row {
  label: string;
  /** Returns text content per entry. */
  value: (entry: CatalogueEntry) => React.ReactNode;
  /** For range-based rows, returns the parsed range used for overlap detection. */
  rangeOf?: (entry: CatalogueEntry) => { min: number; max: number } | null;
}

const ROWS: Row[] = [
  {
    label: "Category",
    value: (e) => CATEGORY_META[e.category].singular,
  },
  {
    label: "Origin",
    value: (e) => e.origin,
  },
  {
    label: "Family",
    value: (e) => ("family" in e ? (e.family as string) : ", "),
  },
  {
    label: "Temperature",
    value: (e) =>
      "tempRange" in e ? `${e.tempRange as string} °C` : ", ",
    rangeOf: (e) =>
      "tempRange" in e ? parseRange(e.tempRange as string) : null,
  },
  {
    label: "pH",
    value: (e) => ("phRange" in e ? (e.phRange as string) : ", "),
    rangeOf: (e) =>
      "phRange" in e ? parseRange(e.phRange as string) : null,
  },
  {
    label: "Hardness (dGH)",
    value: (e) =>
      "dghRange" in e && e.dghRange ? `${e.dghRange as string}` : ", ",
    rangeOf: (e) =>
      "dghRange" in e && e.dghRange
        ? parseRange(e.dghRange as string)
        : null,
  },
  {
    label: "Flow rate",
    value: (e) => ("flowRate" in e && e.flowRate ? (e.flowRate as string) : ", "),
  },
  {
    label: "Min tank",
    value: (e) =>
      "minTankSize" in e ? (e.minTankSize as string) : ", ",
  },
  {
    label: "Adult size",
    value: (e) => ("adultSize" in e ? (e.adultSize as string) : ", "),
  },
  {
    label: "Max height",
    value: (e) =>
      "maxHeight" in e ? `${e.maxHeight as string} cm` : ", ",
  },
  {
    label: "Difficulty",
    value: (e) => `${e.difficulty} / 5`,
  },
  {
    label: "Lifespan",
    value: (e) =>
      "lifespan" in e ? `${e.lifespan as string} yrs` : ", ",
  },
  {
    label: "Diet",
    value: (e) => ("diet" in e ? (e.diet as string) : ", "),
  },
  {
    label: "Light",
    value: (e) => ("light" in e ? (e.light as string) : ", "),
  },
  {
    label: "CO₂",
    value: (e) => ("co2" in e ? (e.co2 as string) : ", "),
  },
  {
    label: "Growth rate",
    value: (e) => ("growthRate" in e ? (e.growthRate as string) : ", "),
  },
  {
    label: "Water column",
    value: (e) => ("waterColumn" in e ? (e.waterColumn as string) : ", "),
  },
  {
    label: "Schooling",
    value: (e) => ("schooling" in e ? (e.schooling as string) : ", "),
  },
  {
    label: "Plant safe",
    value: (e) => ("plantSafe" in e ? (e.plantSafe as string) : ", "),
  },
  {
    label: "Shrimp safe",
    value: (e) => ("shrimpSafe" in e ? (e.shrimpSafe as string) : ", "),
  },
];

/**
 * For range rows, compute whether every selected entry has overlapping
 * ranges (i.e. compatible water for that parameter).
 */
function allOverlap(entries: CatalogueEntry[], row: Row): boolean | null {
  if (!row.rangeOf) return null;
  const ranges = entries
    .map(row.rangeOf)
    .filter((r): r is { min: number; max: number } => r !== null);
  if (ranges.length < 2) return null;
  // Every pair must overlap
  for (let i = 0; i < ranges.length; i++) {
    for (let j = i + 1; j < ranges.length; j++) {
      if (!overlaps(ranges[i], ranges[j])) return false;
    }
  }
  return true;
}

export function CompareTable({ entries }: CompareTableProps) {
  // Skip rows where no entry has data for them — keeps the table compact
  const visibleRows = ROWS.filter((r) =>
    entries.some((e) => {
      const v = r.value(e);
      return v !== ", " && v !== undefined && v !== null;
    }),
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 w-44 bg-background/95 px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground backdrop-blur">
              Parameter
            </th>
            {entries.map((e) => {
              const meta = CATEGORY_META[e.category];
              const img = getImage(e.slug);
              return (
                <th
                  key={`${e.category}-${e.slug}`}
                  className="min-w-[200px] px-4 py-3 text-left align-bottom"
                >
                  <Link
                    href={`${meta.path}/${e.slug}`}
                    className="group flex flex-col gap-2"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
                      {img ? (
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          sizes="200px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageOff
                            className="size-6 text-muted-foreground/40"
                            aria-hidden
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--brand)]">
                        {meta.singular}
                      </span>
                      <span className="font-semibold leading-tight transition-colors group-hover:text-[var(--brand)]">
                        {e.commonName}
                      </span>
                      <span className="text-xs italic text-muted-foreground">
                        {e.scientificName}
                      </span>
                    </div>
                  </Link>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row, i) => {
            const overlap = allOverlap(entries, row);
            return (
              <tr
                key={row.label}
                className={cn(
                  i % 2 === 0 ? "bg-background/0" : "bg-foreground/[0.025]",
                )}
              >
                <th
                  scope="row"
                  className="sticky left-0 z-10 w-44 bg-background/95 px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground backdrop-blur"
                >
                  <span className="flex items-center gap-2">
                    {row.label}
                    {overlap !== null && (
                      <span
                        className={cn(
                          "inline-flex size-1.5 rounded-full",
                          overlap ? "bg-[var(--brand)]" : "bg-rose-400",
                        )}
                        aria-label={
                          overlap
                            ? "All selected species overlap on this parameter"
                            : "At least one species mismatches on this parameter"
                        }
                      />
                    )}
                  </span>
                </th>
                {entries.map((e) => (
                  <td
                    key={`${e.category}-${e.slug}-${row.label}`}
                    className="border-t border-border/40 px-4 py-3 align-top text-foreground/90"
                  >
                    {row.value(e)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
