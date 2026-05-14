import { Thermometer, Droplet, FlaskConical, Sun, Box, Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TankSizeBadge } from "@/components/charts/tank-size-badge";
import { RangeBar } from "@/components/charts/range-bar";
import {
  lightTo5,
  co2To3,
  LIGHT_SCALE_LABELS,
  CO2_SCALE_LABELS,
} from "@/lib/catalogue/tank-standards";
import type { TankRequirements } from "@/lib/catalogue/tank-builder";

interface TankRequirementsPanelProps {
  requirements: TankRequirements;
  tankL?: number;
}

export function TankRequirementsPanel({
  requirements,
  tankL,
}: TankRequirementsPanelProps) {
  const r = requirements;

  return (
    <section
      className="flex flex-col gap-5"
      aria-labelledby="tank-requirements"
    >
      <header className="flex flex-col gap-1">
        <h2
          id="tank-requirements"
          className="text-display-tight text-2xl sm:text-3xl"
        >
          Your tank should be…
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          The intersection of every species&rsquo; care range — the window where
          everything in your tank actually thrives.
        </p>
      </header>

      <div className="stagger grid grid-cols-1 gap-3 md:grid-cols-2">
        <RequirementCard
          icon={Box}
          label="Minimum tank size"
          index={0}
          chip={
            r.minTankL !== null
              ? tankL !== undefined && tankL < r.minTankL
                ? {
                    text: `Your ${tankL} L is too small`,
                    tone: "danger",
                  }
                : tankL !== undefined
                  ? {
                      text: `Your ${tankL} L fits`,
                      tone: "good",
                    }
                  : null
              : null
          }
        >
          {r.minTankL !== null ? (
            <TankSizeBadge litres={r.minTankL} note="Largest minimum among selected species" />
          ) : (
            <NoData />
          )}
        </RequirementCard>

        <RequirementCard
          icon={Thermometer}
          label="Temperature"
          index={1}
        >
          {r.temp ? (
            <RangeBar
              label="Target window"
              unit="°C"
              scale={{ min: 15, max: 32 }}
              range={r.temp}
              precision={0}
              ticks={[15, 20, 25, 30]}
            />
          ) : (
            <Conflict label="No overlapping temperature window" />
          )}
        </RequirementCard>

        <RequirementCard icon={Droplet} label="pH" index={2}>
          {r.ph ? (
            <RangeBar
              label="Target window"
              scale={{ min: 4, max: 8.5 }}
              range={r.ph}
              precision={1}
              ticks={[4, 5, 6, 7, 8]}
              tone="blue"
            />
          ) : (
            <Conflict label="No overlapping pH window" />
          )}
        </RequirementCard>

        <RequirementCard icon={FlaskConical} label="Hardness" index={3}>
          {r.dgh ? (
            <RangeBar
              label="Target window"
              unit="dGH"
              scale={{ min: 0, max: 25 }}
              range={r.dgh}
              precision={0}
              ticks={[0, 5, 10, 15, 20, 25]}
            />
          ) : (
            <NoData label="No hardness data among the selection" />
          )}
        </RequirementCard>
      </div>

      {/* Light + CO2 — shown as 1–5 / 1–3 visual scales. */}
      {(r.light || r.co2) && (
        <div className="glass glass-edge animate-fade-up grid grid-cols-1 gap-4 rounded-2xl p-5 sm:grid-cols-2 sm:p-6">
          {r.light && (
            <LightScaleBar value={lightTo5(r.light) ?? 1} />
          )}
          {r.co2 && (
            <Co2ScaleBar value={co2To3(r.co2) ?? 1} />
          )}
        </div>
      )}

      {(r.substrateNotes.length > 0 || r.equipmentNotes.length > 0) && (
        <div className="glass glass-edge animate-fade-up flex flex-col gap-4 rounded-2xl p-5 sm:p-6">
          <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand)]">
            Equipment & substrate
          </h3>
          {r.substrateNotes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {r.substrateNotes.map((n) => (
                <Chip key={n} icon={Layers}>
                  {n}
                </Chip>
              ))}
            </div>
          )}
          {r.equipmentNotes.length > 0 && (
            <ul className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/85">
              {r.equipmentNotes.map((n) => (
                <li key={n} className="flex items-start gap-2">
                  <span
                    aria-hidden
                    className="mt-1.5 size-1 shrink-0 rounded-full bg-[var(--brand)]"
                  />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

/* ─── Scale bars ────────────────────────────────────────────────────────
   Render a 1-of-N segmented bar with the active segment lit. Used
   to convert our internal Low/Medium/High and None…Required strings
   into the 1–5 / 1–3 user-facing scales requested.
   ────────────────────────────────────────────────────────────────────── */

function LightScaleBar({ value }: { value: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--brand)]/15 text-[var(--brand)]"
        >
          <Sun className="size-4" strokeWidth={1.85} />
        </span>
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Light demand
          </span>
          <span className="text-sm font-semibold">
            {LIGHT_SCALE_LABELS[value]}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {value} / 5
            </span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5" aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={cn(
              "h-2 flex-1 rounded-full transition-colors",
              n <= value
                ? "bg-[var(--brand)] shadow-[0_0_8px_-2px_color-mix(in_oklab,var(--brand)_60%,transparent)]"
                : "bg-foreground/10",
            )}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
        <span>Very low</span>
        <span>Low</span>
        <span>Med</span>
        <span>Med–hi</span>
        <span>High</span>
      </div>
    </div>
  );
}

function Co2ScaleBar({ value }: { value: 1 | 2 | 3 }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--brand)]/15 text-[var(--brand)]"
        >
          <FlaskConical className="size-4" strokeWidth={1.85} />
        </span>
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            CO₂ demand
          </span>
          <span className="text-sm font-semibold">
            {CO2_SCALE_LABELS[value]}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {value} / 3
            </span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5" aria-hidden>
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={cn(
              "h-2 flex-1 rounded-full transition-colors",
              n <= value
                ? "bg-[var(--brand)] shadow-[0_0_8px_-2px_color-mix(in_oklab,var(--brand)_60%,transparent)]"
                : "bg-foreground/10",
            )}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
        <span>Optional</span>
        <span>Recommended</span>
        <span>Required</span>
      </div>
    </div>
  );
}

function RequirementCard({
  icon: Icon,
  label,
  index,
  chip,
  children,
}: {
  icon: LucideIcon;
  label: string;
  index: number;
  chip?: { text: string; tone: "good" | "danger" } | null;
  children: React.ReactNode;
}) {
  return (
    <article
      style={{ ["--i" as string]: index }}
      className="glass glass-edge animate-fade-up flex flex-col gap-3 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--brand)]/15 text-[var(--brand)]"
          >
            <Icon className="size-4" strokeWidth={1.85} />
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </span>
        </div>
        {chip && (
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]",
              chip.tone === "good"
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                : "border-rose-400/45 bg-rose-400/12 text-rose-200",
            )}
          >
            {chip.text}
          </span>
        )}
      </div>
      <div>{children}</div>
    </article>
  );
}

function NoData({ label }: { label?: string }) {
  return (
    <p className="text-sm italic text-muted-foreground">
      {label ?? "Add a species to see this requirement."}
    </p>
  );
}

function Conflict({ label }: { label: string }) {
  return (
    <p className="text-sm text-rose-300">
      <span className="font-semibold">Conflict:</span> {label}. See the
      warnings below.
    </p>
  );
}

function Chip({
  icon: Icon,
  tone,
  children,
}: {
  icon?: LucideIcon;
  tone?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        tone === "brand"
          ? "border-[var(--brand)]/45 bg-[var(--brand)]/12 text-foreground"
          : tone
            ? tone
            : "border-border bg-background/60 text-foreground/85",
      )}
    >
      {Icon && <Icon className="size-3.5" strokeWidth={1.85} aria-hidden />}
      {children}
    </span>
  );
}
