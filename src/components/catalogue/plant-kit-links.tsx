import Link from "next/link";
import { ArrowRight, CloudFog, FlaskRound, Lightbulb, Sprout } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * "Kit for this plant": links from a plant or moss profile into the gear
 * catalogue, based on the plant's own light, CO2 and planting needs.
 */
export function PlantKitLinks({
  name,
  light,
  co2,
  plantType,
}: {
  name: string;
  light?: string;
  co2?: string;
  plantType?: string;
}) {
  const rows: { icon: LucideIcon; label: string; note: string; href: string }[] = [];
  const l = (light ?? "").toLowerCase();
  const c = (co2 ?? "").toLowerCase();
  const t = (plantType ?? "").toLowerCase();

  // Care fields read like "Low to High": the plant's minimum is the first word.
  const minLight = l.startsWith("high") ? "high" : l.startsWith("medium") ? "medium" : l ? "low" : "";
  if (minLight) {
    rows.push({
      icon: Lightbulb,
      label: "Lights",
      note:
        minLight === "high"
          ? `${name} wants strong light: pick a light made for your tank length`
          : minLight === "medium"
            ? "Needs at least medium light: most planted-tank LEDs manage it"
            : "Low light is enough: almost any planted-tank LED will do",
      href: "/gear/lights",
    });
  }
  if (c.startsWith("required")) {
    rows.push({ icon: CloudFog, label: "CO2 gear", note: "Injected CO2 is required for good growth", href: "/gear/co2" });
  } else if (c.startsWith("recommended")) {
    rows.push({ icon: CloudFog, label: "CO2 gear", note: "Injected CO2 is recommended", href: "/gear/co2" });
  } else if (c.includes("recommended")) {
    rows.push({ icon: CloudFog, label: "CO2 gear", note: "Optional, but CO2 helps it grow faster", href: "/gear/co2" });
  }
  if (/rosette|root|bulb|carpet|runner|stem/.test(t)) {
    rows.push({
      icon: FlaskRound,
      label: "Fertilisers",
      note: "An all-in-one liquid keeps growth steady",
      href: "/gear/fertilisers?type=all-in-one",
    });
  }
  if (/rosette|root feeder|bulb/.test(t)) {
    rows.push({
      icon: Sprout,
      label: "Root tabs",
      note: "Feeds the roots of heavy root feeders",
      href: "/gear/fertilisers?type=root-feed",
    });
  }
  if (/epiphyte|moss/.test(t) && !rows.some((r) => r.label === "Fertilisers")) {
    rows.push({
      icon: FlaskRound,
      label: "Fertilisers",
      note: "Feeds from the water, so a light liquid dose helps",
      href: "/gear/fertilisers?type=all-in-one",
    });
  }
  if (rows.length === 0) return null;

  return (
    <div className="mt-6 rounded-2xl border border-border/60 bg-background/60 p-5">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand)]">Kit for this plant</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {rows.map((r) => (
          <li key={r.label}>
            <Link
              href={r.href}
              className="press group flex items-center gap-3 rounded-xl border border-border bg-background/70 px-3 py-2.5 transition-colors hover:border-[var(--brand)]/40"
            >
              <r.icon className="size-4 flex-none text-[var(--brand)]" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{r.label}</span>
                <span className="block text-[11px] text-muted-foreground">{r.note}</span>
              </span>
              <ArrowRight className="size-4 flex-none text-muted-foreground" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
