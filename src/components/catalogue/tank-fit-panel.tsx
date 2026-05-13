import { AtAGlance } from "@/components/catalogue/at-a-glance";
import { ProfileCards } from "@/components/catalogue/profile-cards";
import type { CatalogueEntry } from "@/types/catalogue";

interface TankFitPanelProps {
  entry: CatalogueEntry;
}

/**
 * Two-column decision panel for the species detail page.
 *
 * Left ("Parameters"): the numeric ranges that decide whether the
 * species fits in a given tank — temperature, pH, hardness, size,
 * tank capacity, light/CO2/flow demand. These are the charts that
 * already lived in <AtAGlance>.
 *
 * Right ("Profile"): the categorical facts about the species —
 * family, water column, schooling, temperament, diet, lifespan —
 * each rendered as a small visual card by <ProfileCards> so the
 * column reads as data, not a definition list.
 *
 * On narrow screens the two stack; on lg+ they sit side-by-side.
 */
export function TankFitPanel({ entry }: TankFitPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-6">
      <div className="flex flex-col">
        <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
          Parameters
        </h3>
        <AtAGlance entry={entry} className="h-full" />
      </div>

      <div className="flex flex-col">
        <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
          Profile
        </h3>
        <ProfileCards entry={entry} />
      </div>
    </div>
  );
}
