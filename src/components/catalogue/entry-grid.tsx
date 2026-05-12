import type { CatalogueEntry } from "@/types/catalogue";
import { EntryCard } from "@/components/catalogue/entry-card";

interface EntryGridProps {
  entries: ReadonlyArray<CatalogueEntry>;
}

export function EntryGrid({ entries }: EntryGridProps) {
  return (
    <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((e, i) => (
        <div
          key={`${e.category}-${e.slug}`}
          className="animate-fade-up"
          style={{ ["--i" as string]: Math.min(i, 11) }}
        >
          <EntryCard entry={e} />
        </div>
      ))}
    </div>
  );
}
