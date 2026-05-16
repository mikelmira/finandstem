import { AtAGlance } from "@/components/catalogue/at-a-glance";
import { ProfileCards } from "@/components/catalogue/profile-cards";
import type { CatalogueEntry } from "@/types/catalogue";

interface TankFitPanelProps {
  entry: CatalogueEntry;
}

/**
 * Two-row decision panel for the species detail page.
 *
 * Top ("Parameters"): the numeric ranges that decide whether the
 * species fits in a given tank — temperature, pH, hardness, size,
 * tank capacity, light/CO2/flow demand. These are the charts that
 * already lived in <AtAGlance>.
 *
 * Bottom ("Profile"): the categorical facts about the species —
 * family, water column, schooling, temperament, diet, lifespan,
 * habitat — laid out side-by-side as a full-width row of small
 * visual cards so the section reads as a quick-glance dashboard
 * rather than a definition list.
 */
export function TankFitPanel({ entry }: TankFitPanelProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
          Parameters
        </h3>
        <AtAGlance entry={entry} />
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
