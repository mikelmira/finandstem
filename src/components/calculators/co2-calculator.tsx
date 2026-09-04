"use client";

import * as React from "react";
import { NumberField, Stat, num, round } from "./calc-ui";
import { cn } from "@/lib/utils";

interface Verdict {
  label: string;
  tone: string;
  note: string;
}

function verdictFor(ppm: number): Verdict {
  if (ppm < 15)
    return {
      label: "Low",
      tone: "text-sky-700 dark:text-sky-400",
      note: "Below what most demanding plants want. Fine for a low-tech tank, but carpets and reds will struggle.",
    };
  if (ppm <= 35)
    return {
      label: "In the sweet spot",
      tone: "text-emerald-700 dark:text-emerald-400",
      note: "Around the 25 to 30 ppm most high-tech planted tanks aim for. A drop checker should sit green here.",
    };
  if (ppm <= 45)
    return {
      label: "High, watch the fish",
      tone: "text-amber-700 dark:text-amber-400",
      note: "Getting strong. Watch for fish gasping at the surface, and make sure CO2 turns off before lights out.",
    };
  return {
    label: "Dangerous",
    tone: "text-rose-700 dark:text-rose-400",
    note: "Too much. This risks suffocating livestock. Cut the injection back and add surface agitation.",
  };
}

export function Co2Calculator() {
  const [ph, setPh] = React.useState("");
  const [kh, setKh] = React.useState("");

  const pH = num(ph);
  const KH = num(kh);

  let ppm: number | null = null;
  if (pH !== null && KH !== null && pH > 0 && KH > 0) {
    // Standard aquarium approximation: CO2 (mg/L) = 3 x dKH x 10^(7 - pH).
    ppm = 3.0 * KH * Math.pow(10, 7.0 - pH);
  }
  const verdict = ppm !== null ? verdictFor(ppm) : null;

  return (
    <div className="glass glass-edge rounded-2xl p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Tank pH" value={ph} onChange={setPh} placeholder="6.6" step="0.1" />
        <NumberField label="Carbonate hardness" value={kh} onChange={setKh} unit="dKH" placeholder="4" step="0.1" />
      </div>

      {ppm !== null && verdict ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Stat label="Dissolved CO2" value={`~${round(ppm)} ppm`} emphasis />
          <div className="rounded-2xl border border-border bg-background/60 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Verdict
            </p>
            <p className={cn("text-display-tight mt-1 text-xl font-semibold sm:text-2xl", verdict.tone)}>
              {verdict.label}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{verdict.note}</p>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Enter your tank&rsquo;s pH and carbonate hardness (KH) to estimate the
          dissolved CO2.
        </p>
      )}

      <div className="mt-6 rounded-2xl border border-border/60 bg-background/40 p-4 text-sm leading-relaxed text-muted-foreground">
        <p className="font-medium text-foreground">A caveat worth knowing</p>
        <p className="mt-1">
          This uses your tank&rsquo;s own KH, which is only accurate if carbonate
          is the main buffer. Tannins, phosphate buffers and some substrates
          throw it off. That&rsquo;s exactly why a drop checker filled with 4 dKH
          reference fluid is more reliable: blue means too little CO2, green is
          the target, and yellow means too much. Use this number as a guide and
          trust the green drop checker plus how your fish behave.
        </p>
      </div>
    </div>
  );
}
