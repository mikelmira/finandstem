"use client";

import * as React from "react";
import { NumberField, Segmented, Stat, num, round } from "./calc-ui";

/**
 * Dry-salt dosing. Element yields are mg of element per gram of salt, from the
 * molar masses (e.g. KNO3 is 61.3% NO3 and 38.7% K by mass), so ppm rise is
 * simply (mg per gram x grams) / tank litres.
 */
interface Salt {
  id: string;
  name: string;
  primary: string;
  elements: Record<string, number>;
}

const SALTS: ReadonlyArray<Salt> = [
  { id: "kno3", name: "Potassium nitrate (KNO3)", primary: "NO3", elements: { NO3: 613.3, K: 386.8 } },
  { id: "khpo4", name: "Mono-potassium phosphate (KH2PO4)", primary: "PO4", elements: { PO4: 697.9, K: 287.3 } },
  { id: "k2so4", name: "Potassium sulfate (K2SO4)", primary: "K", elements: { K: 448.7 } },
  { id: "mgso4", name: "Epsom salt (MgSO4.7H2O)", primary: "Mg", elements: { Mg: 98.6 } },
];

type Mode = "toPpm" | "toGrams";

export function DosingCalculator() {
  const [mode, setMode] = React.useState<Mode>("toPpm");
  const [saltId, setSaltId] = React.useState(SALTS[0].id);
  const [volume, setVolume] = React.useState("");
  const [grams, setGrams] = React.useState("");
  const [targetPpm, setTargetPpm] = React.useState("");

  const salt = SALTS.find((s) => s.id === saltId) ?? SALTS[0];
  const V = num(volume);

  let usedGrams: number | null = null;
  if (V !== null && V > 0) {
    if (mode === "toPpm") {
      usedGrams = num(grams);
    } else {
      const t = num(targetPpm);
      if (t !== null) usedGrams = (t * V) / salt.elements[salt.primary];
    }
  }

  const results =
    V !== null && V > 0 && usedGrams !== null
      ? Object.entries(salt.elements).map(([el, mgPerG]) => ({
          el,
          ppm: (mgPerG * (usedGrams as number)) / V,
        }))
      : null;

  return (
    <div className="glass glass-edge rounded-2xl p-6 sm:p-8">
      <div className="mb-5 flex flex-wrap gap-6">
        <Segmented
          label="I want to"
          value={mode}
          onChange={setMode}
          options={[
            { value: "toPpm", label: "Grams to ppm" },
            { value: "toGrams", label: "ppm to grams" },
          ]}
        />
      </div>

      <label className="mb-4 flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Dry salt
        </span>
        <select
          value={saltId}
          onChange={(e) => setSaltId(e.target.value)}
          className="rounded-xl border border-border bg-background/60 px-3 py-2 text-base outline-none focus:border-[var(--brand)]/50"
        >
          {SALTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Tank water volume" value={volume} onChange={setVolume} unit="L" placeholder="120" />
        {mode === "toPpm" ? (
          <NumberField label="Salt added" value={grams} onChange={setGrams} unit="g" placeholder="5" step="0.1" />
        ) : (
          <NumberField
            label={`Target ${salt.primary}`}
            value={targetPpm}
            onChange={setTargetPpm}
            unit="ppm"
            placeholder="10"
            step="0.1"
          />
        )}
      </div>

      {results ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {mode === "toGrams" && usedGrams !== null && (
            <Stat label="Salt to add" value={`${round(usedGrams, 2)} g`} emphasis />
          )}
          {results.map((r) => (
            <Stat
              key={r.el}
              label={`${r.el} added`}
              value={`+${round(r.ppm, 2)} ppm`}
              emphasis={mode === "toPpm" && r.el === salt.primary}
            />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Enter your tank&rsquo;s water volume and{" "}
          {mode === "toPpm" ? "how much salt you're adding" : "the level you want to hit"}.
          Use the realistic water volume, not the full glass size.
        </p>
      )}

      <div className="mt-6 rounded-2xl border border-border/60 bg-background/40 p-4 text-sm leading-relaxed text-muted-foreground">
        <p className="font-medium text-foreground">Rough weekly targets (EI)</p>
        <p className="mt-1">
          As a starting point, many planted tanks aim for roughly 10 to 30 ppm
          NO3, 1 to 3 ppm PO4, 10 to 30 ppm K and 5 to 10 ppm Mg across a week,
          split over several doses with a big water change at week&rsquo;s end.
          These are ballpark figures, adjust to what your plants and algae tell
          you.
        </p>
      </div>
    </div>
  );
}
