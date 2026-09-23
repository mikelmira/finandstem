import type { GearModel } from "@/types/gear";
import { DISPLAY_LABEL, displayValue, type DisplayField } from "@/lib/gear/fields";

/** Every model of a product in one table: sizes down, specs across. */
export function GearModelTable({
  models,
  fields,
}: {
  models: GearModel[];
  fields: DisplayField[];
}) {
  const cols = fields.filter((f) => models.some((m) => displayValue(m, f)));
  const extraKeys = Array.from(
    new Set(models.flatMap((m) => Object.keys(m.extra ?? {}))),
  ).slice(0, 6);
  if (cols.length === 0 && extraKeys.length === 0 && models.length <= 1) return null;
  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr className="bg-foreground/[0.03] text-left">
            <th scope="col" className="px-4 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Model
            </th>
            {cols.map((f) => (
              <th key={f} scope="col" className="px-4 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {DISPLAY_LABEL[f]}
              </th>
            ))}
            {extraKeys.map((k) => (
              <th key={k} scope="col" className="px-4 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {models.map((m) => (
            <tr key={m.name} className="border-t border-border/60 align-top">
              <th scope="row" className="px-4 py-3 text-left font-medium text-foreground">
                {m.name}
                {m.sku && <span className="block text-[11px] font-normal text-muted-foreground">{m.sku}</span>}
              </th>
              {cols.map((f) => (
                <td key={f} className="px-4 py-3 text-foreground/90">
                  {displayValue(m, f) ?? <span className="text-muted-foreground/60">–</span>}
                </td>
              ))}
              {extraKeys.map((k) => (
                <td key={k} className="px-4 py-3 text-foreground/90">
                  {m.extra?.[k] ?? <span className="text-muted-foreground/60">–</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
