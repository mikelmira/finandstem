"use client";

import * as React from "react";
import { NumberField, Segmented, Stat, num, round } from "./calc-ui";

type Unit = "cm" | "in";
type Material = "aquasoil" | "sand" | "gravel";

// Approximate bulk density in kg per litre.
const DENSITY: Record<Material, number> = {
  aquasoil: 0.9,
  sand: 1.5,
  gravel: 1.6,
};

export function SubstrateCalculator() {
  const [unit, setUnit] = React.useState<Unit>("cm");
  const [material, setMaterial] = React.useState<Material>("aquasoil");
  const [l, setL] = React.useState("");
  const [w, setW] = React.useState("");
  const [depth, setDepth] = React.useState("6");

  const toCm = (v: number) => (unit === "in" ? v * 2.54 : v);
  const L = num(l);
  const W = num(w);
  const D = num(depth);

  let litres: number | null = null;
  if (L !== null && W !== null && D !== null && L > 0 && W > 0 && D > 0) {
    // Depth is always entered in cm for clarity, footprint in the chosen unit.
    litres = (toCm(L) * toCm(W) * D) / 1000;
  }
  const kg = litres !== null ? litres * DENSITY[material] : null;

  return (
    <div className="glass glass-edge rounded-2xl p-6 sm:p-8">
      <div className="mb-5 flex flex-wrap gap-6">
        <Segmented
          label="Footprint in"
          value={unit}
          onChange={setUnit}
          options={[
            { value: "cm", label: "Centimetres" },
            { value: "in", label: "Inches" },
          ]}
        />
        <Segmented
          label="Material"
          value={material}
          onChange={setMaterial}
          options={[
            { value: "aquasoil", label: "Aquasoil" },
            { value: "sand", label: "Sand" },
            { value: "gravel", label: "Gravel" },
          ]}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <NumberField label="Tank length" value={l} onChange={setL} unit={unit} placeholder="60" />
        <NumberField label="Tank width (depth)" value={w} onChange={setW} unit={unit} placeholder="30" />
        <NumberField label="Substrate depth" value={depth} onChange={setDepth} unit="cm" placeholder="6" />
      </div>

      {litres !== null && kg !== null ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Stat label="Substrate needed" value={`~${round(litres)} L`} emphasis />
          <Stat
            label="Approximate weight"
            value={`~${round(kg)} kg`}
            hint={`At about ${DENSITY[material]} kg per litre for ${material}`}
          />
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Enter the tank footprint and how deep you want the substrate. A planted
          tank usually wants 5 to 8 cm at the front, sloping deeper toward the
          back, so round up and add a bag for the slope.
        </p>
      )}
    </div>
  );
}
