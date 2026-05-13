import { AtAGlance } from "@/components/catalogue/at-a-glance";
import { QuickFacts, type QuickFact } from "@/components/catalogue/quick-facts";
import type { CatalogueEntry } from "@/types/catalogue";

interface TankFitPanelProps {
  entry: CatalogueEntry;
  facts: ReadonlyArray<QuickFact>;
}

/**
 * Merges what used to be two separate sections (At-a-glance parameter
 * charts + Quick facts key-value cards) into one decision-support panel.
 *
 * Reading flow: charts on the left (the numbers that decide whether the
 * species fits a given tank), categorical facts on the right (everything
 * else — family, water column, diet, schooling, etc).
 *
 * On narrow screens the two stack; on lg+ they sit side-by-side.
 */
export function TankFitPanel({ entry, facts }: TankFitPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-6">
      <div className="flex flex-col">
        <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
          Parameters
        </h3>
        <AtAGlance entry={entry} className="h-full" />
      </div>

      {facts.length > 0 && (
        <div className="flex flex-col">
          <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            Profile
          </h3>
          <QuickFacts facts={facts} className="!grid-cols-2" />
        </div>
      )}
    </div>
  );
}
