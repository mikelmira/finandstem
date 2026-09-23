"use client";

import * as React from "react";
import Link from "next/link";
import { NumberField, Segmented, Stat, num, round } from "./calc-ui";
import { gearHref, recommendedFlow, recommendedHeaterW } from "@/lib/gear/match";

type Unit = "cm" | "in";

/** Next step after the volume: gear sized for this tank. */
function GearLinks({ litres, lengthCm }: { litres: number; lengthCm: number }) {
  const flow = recommendedFlow(litres);
  const heat = recommendedHeaterW(litres);
  const links = [
    { label: `Filters rated ${flow.min}–${flow.max} L/h`, href: gearHref("filters", { tankL: litres }) },
    { label: `Heaters around ${heat.min}–${heat.max} W`, href: gearHref("heaters", { tankL: litres }) },
    { label: `Lights for a ${lengthCm} cm tank`, href: gearHref("lights", { lengthCm }) },
    { label: `Stands for ${lengthCm} cm`, href: gearHref("stands", { lengthCm }) },
  ];
  return (
    <div className="mt-6 border-t border-border/60 pt-5">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand)]">
        Gear sized for this tank
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="press rounded-full border border-border bg-background/60 px-3 py-1.5 text-sm transition-colors hover:border-[var(--brand)]/40"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function TankVolumeCalculator() {
  const [unit, setUnit] = React.useState<Unit>("cm");
  const [l, setL] = React.useState("");
  const [w, setW] = React.useState("");
  const [h, setH] = React.useState("");

  const toCm = (v: number) => (unit === "in" ? v * 2.54 : v);
  const L = num(l);
  const W = num(w);
  const H = num(h);

  let litres: number | null = null;
  if (L !== null && W !== null && H !== null && L > 0 && W > 0 && H > 0) {
    litres = (toCm(L) * toCm(W) * toCm(H)) / 1000;
  }

  return (
    <div className="glass glass-edge rounded-2xl p-6 sm:p-8">
      <div className="mb-5">
        <Segmented
          label="Measure in"
          value={unit}
          onChange={setUnit}
          options={[
            { value: "cm", label: "Centimetres" },
            { value: "in", label: "Inches" },
          ]}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <NumberField label="Length" value={l} onChange={setL} unit={unit} placeholder="60" />
        <NumberField label="Width (depth)" value={w} onChange={setW} unit={unit} placeholder="30" />
        <NumberField label="Height" value={h} onChange={setH} unit={unit} placeholder="36" />
      </div>

      {litres !== null && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat label="Full glass volume" value={`${round(litres)} L`} emphasis />
          <Stat
            label="US / Imperial gallons"
            value={`${round(litres / 3.785)} / ${round(litres / 4.546)}`}
            hint="US gal / imp gal"
          />
          <Stat
            label="Realistic water volume"
            value={`~${round(litres * 0.85)} L`}
            hint="After substrate, hardscape and headspace, roughly 85%"
          />
        </div>
      )}
      {litres !== null && L !== null ? (
        <GearLinks litres={Math.round(litres)} lengthCm={Math.round(toCm(L))} />
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Enter all three inside dimensions to see the volume. Measure the glass
          internally, not the outer footprint.
        </p>
      )}
    </div>
  );
}
