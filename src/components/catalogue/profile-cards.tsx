import * as React from "react";
import {
  ArrowUpDown,
  Beef,
  Heart,
  Leaf,
  MapPin,
  ShieldAlert,
  Sparkles,
  Sprout,
  Star,
  Users,
  Waves,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { parseRange } from "@/lib/range";
import {
  FishMark,
  MossMark,
  PlantMark,
  ShrimpMark,
} from "@/components/icons/species-icons";
import { getHabitat } from "@/data/habitats";
import type {
  FishEntry,
  MossEntry,
  PlantEntry,
  ShrimpEntry,
} from "@/types/catalogue";

/** Accepts both Lucide icons and our custom species marks. */
type IconLike = React.ComponentType<{
  className?: string;
  strokeWidth?: number | string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

/* ──────────────────────────────────────────────────────────────────
   Shared card wrapper.

   Each profile card has the same shell: muted eyebrow label at top,
   a graphic in the middle, value text and an optional helper at the
   bottom. This keeps the right column visually consistent across
   categories without forcing every card into the same shape.
   ────────────────────────────────────────────────────────────────── */

interface ProfileCardProps {
  label: string;
  value: string;
  helper?: string;
  /** Optional inline graphic. Renders above the value. */
  graphic?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

function ProfileCard({
  label,
  value,
  helper,
  graphic,
  className,
  ariaLabel,
}: ProfileCardProps) {
  return (
    <figure
      className={cn(
        "glass glass-edge animate-fade-up flex h-full flex-col gap-3 rounded-2xl p-4 transition-colors duration-300 hover:border-[var(--brand)]/35 sm:p-5",
        className,
      )}
      aria-label={ariaLabel ?? `${label}: ${value}`}
    >
      <figcaption className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </figcaption>
      {graphic && <div className="flex-1">{graphic}</div>}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold leading-tight text-foreground sm:text-base">
          {value}
        </p>
        {helper && (
          <p className="text-[11px] leading-snug text-muted-foreground/80">
            {helper}
          </p>
        )}
      </div>
    </figure>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Layout — uniform side-by-side grid shared across all four profile
   variants. Auto-fits columns based on a 200px min card width so the
   row stays single-line on wide screens and gracefully wraps to two
   rows on narrower ones. No card spans extra columns; every card
   reads the same.
   ────────────────────────────────────────────────────────────────── */
const PROFILE_GRID =
  "stagger grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4";

/* ──────────────────────────────────────────────────────────────────
   Atomic visualisations.
   ────────────────────────────────────────────────────────────────── */

/**
 * Habitat marker — a stylised waterway icon in a soft brand-tinted
 * pill. Used as the graphic on every Habitat card so the row gets a
 * consistent place-of-origin visual cue without needing a per-species
 * illustration.
 */
function HabitatHero() {
  return (
    <div className="flex items-center justify-center" aria-hidden>
      <span className="flex size-12 items-center justify-center rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 text-[var(--brand)]">
        <MapPin className="size-5" strokeWidth={1.75} />
      </span>
    </div>
  );
}

/**
 * Vertical tank cross-section with three swim zones (top / mid /
 * bottom). The active zone is filled with brand colour, the rest
 * stay muted. "All" highlights every zone.
 */
function WaterColumnViz({
  level,
}: {
  level: "top" | "mid" | "bottom" | "all";
}) {
  const zones: Array<"top" | "mid" | "bottom"> = ["top", "mid", "bottom"];
  return (
    <div className="flex items-center justify-center" aria-hidden>
      <div className="relative flex h-24 w-16 flex-col overflow-hidden rounded-md border border-border/70 bg-background/40">
        {/* Surface line */}
        <span className="absolute inset-x-0 top-1 h-px bg-foreground/15" />
        {zones.map((z) => {
          const active = level === "all" || level === z;
          return (
            <span
              key={z}
              className={cn(
                "flex-1 border-b border-border/30 last:border-b-0 transition-colors",
                active ? "bg-[var(--brand)]/60" : "bg-foreground/[0.04]",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Row of small fish silhouettes — caps at 10 with a "+" overflow
 * indicator beyond. Visually conveys "this species lives in a group
 * of N" at a glance.
 */
function SchoolingViz({
  minGroupSize,
  isSchooling,
}: {
  minGroupSize: number;
  isSchooling: boolean;
}) {
  if (!isSchooling || minGroupSize <= 1) {
    return (
      <div
        className="flex h-12 items-center justify-center"
        aria-hidden
      >
        <FishMark className="size-7 text-[var(--brand)]/80" />
      </div>
    );
  }
  const display = Math.min(minGroupSize, 10);
  const overflow = minGroupSize > 10;
  return (
    <div
      className="flex h-12 items-center justify-center gap-[3px]"
      aria-hidden
    >
      {Array.from({ length: display }).map((_, i) => (
        <FishMark
          key={i}
          className={cn(
            "size-3.5 text-[var(--brand)]/80",
            i % 2 === 1 && "-translate-y-1",
          )}
        />
      ))}
      {overflow && (
        <span className="ml-1 text-xs font-semibold text-[var(--brand)]">
          +
        </span>
      )}
    </div>
  );
}

/**
 * Four-segment temperament scale: peaceful → semi-aggressive →
 * aggressive → territorial. The active segment lights up, earlier
 * ones glow at reduced intensity to signal "where on the spectrum".
 */
function TemperamentScale({ raw }: { raw: string }) {
  const TEMPERAMENT_LEVELS: ReadonlyArray<{
    key: string;
    label: string;
    short: string;
    matchers: string[];
  }> = [
    {
      key: "peaceful",
      label: "Peaceful",
      short: "Peaceful",
      matchers: ["peaceful"],
    },
    {
      key: "semi",
      label: "Semi-aggressive",
      short: "Semi",
      matchers: ["semi"],
    },
    {
      key: "aggressive",
      label: "Aggressive",
      short: "Aggr",
      matchers: ["aggressive"],
    },
    {
      key: "territorial",
      label: "Territorial",
      short: "Territ",
      matchers: ["territorial"],
    },
  ];

  const lower = raw.toLowerCase();
  let activeIdx = TEMPERAMENT_LEVELS.findIndex((l) =>
    l.matchers.some((m) => lower.includes(m)),
  );
  if (activeIdx === -1) activeIdx = 0;

  return (
    <div className="flex flex-col gap-2" aria-hidden>
      <div className="flex items-center gap-1">
        {TEMPERAMENT_LEVELS.map((l, i) => {
          const active = i === activeIdx;
          const trailing = i < activeIdx;
          return (
            <span
              key={l.key}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                active
                  ? "bg-[var(--brand)] shadow-[0_0_10px_-2px_color-mix(in_oklab,var(--brand)_60%,transparent)]"
                  : trailing
                    ? "bg-[var(--brand)]/30"
                    : "bg-foreground/10",
              )}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60">
        {TEMPERAMENT_LEVELS.map((l, i) => (
          <span
            key={l.key}
            className={cn(i === activeIdx && "text-[var(--brand)]")}
          >
            {l.short}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Diet pictogram — two icon "slots" (plant matter and protein),
 * each filled when the species eats that type. Omnivore lights up
 * both, herbivore just leaf, carnivore just protein.
 */
function DietPictogram({ diet }: { diet: string }) {
  const lower = diet.toLowerCase();
  const eatsPlants =
    lower.includes("omnivor") ||
    lower.includes("herbivor") ||
    lower.includes("algae") ||
    lower.includes("biofilm") ||
    lower.includes("detrit");
  const eatsProtein =
    lower.includes("omnivor") ||
    lower.includes("carnivor") ||
    lower.includes("micropred") ||
    lower.includes("inver");

  return (
    <div
      className="flex items-center justify-center gap-3"
      aria-hidden
    >
      <DietSlot Icon={Leaf} active={eatsPlants} label="Plant matter" />
      <span className="text-[10px] font-medium text-muted-foreground/60">
        +
      </span>
      <DietSlot Icon={Beef} active={eatsProtein} label="Protein" />
    </div>
  );
}

function DietSlot({
  Icon,
  active,
  label,
}: {
  Icon: typeof Leaf;
  active: boolean;
  label: string;
}) {
  return (
    <span
      className={cn(
        "flex size-12 items-center justify-center rounded-full border transition-colors",
        active
          ? "border-[var(--brand)]/50 bg-[var(--brand)]/15 text-[var(--brand)]"
          : "border-border/50 bg-background/30 text-muted-foreground/40",
      )}
      title={label}
    >
      <Icon className="size-5" strokeWidth={1.75} />
    </span>
  );
}

/**
 * Horizontal lifespan timeline against a 0–15 year scale. Renders
 * the species' min–max range as a filled bar plus tick labels.
 */
function LifespanBar({
  raw,
  scaleMaxYears = 15,
}: {
  raw: string;
  scaleMaxYears?: number;
}) {
  const range = parseRange(raw);
  const ticks = [0, scaleMaxYears / 3, (scaleMaxYears * 2) / 3, scaleMaxYears];

  const clamp = (n: number) =>
    Math.max(0, Math.min(100, (n / scaleMaxYears) * 100));

  return (
    <div className="flex flex-col gap-1.5" aria-hidden>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-foreground/10">
        {range && (
          <span
            className="absolute inset-y-0 rounded-full bg-[var(--brand)]/80 shadow-[0_0_10px_-2px_color-mix(in_oklab,var(--brand)_55%,transparent)]"
            style={{
              left: `${clamp(range.min)}%`,
              width: `${Math.max(2, clamp(range.max) - clamp(range.min))}%`,
            }}
          />
        )}
        {ticks.map((t) => (
          <span
            key={t}
            className="absolute top-0 h-full w-px bg-foreground/15"
            style={{ left: `${clamp(t)}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between text-[9px] tabular-nums text-muted-foreground/70">
        {ticks.map((t) => (
          <span key={t}>{Math.round(t)}y</span>
        ))}
      </div>
    </div>
  );
}

/**
 * Star rating from N out of 5, used for algae-grazing intensity.
 */
function StarRating({
  value,
  max = 5,
}: {
  value: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4 transition-colors",
            i < value
              ? "fill-[var(--brand)] text-[var(--brand)]"
              : "text-foreground/15",
          )}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

/**
 * Small icon pill that hints at the taxonomic context. Family is
 * inherently text — the icon adds a touch of visual identity so it
 * doesn't look like a stranded label/value pair next to the richer
 * cards beside it.
 */
function FamilyHero({ icon: Icon }: { icon: IconLike }) {
  return (
    <div
      className="flex items-center justify-center"
      aria-hidden
    >
      <span className="flex size-12 items-center justify-center rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 text-[var(--brand)]">
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
    </div>
  );
}

/**
 * Plant position diagram — same tank cross-section as fish water
 * column but with foreground / midground / background layout
 * orientation. Highlights the planting zone.
 */
function PlantPositionViz({ raw }: { raw: string }) {
  const lower = raw.toLowerCase();
  const zones: Array<{
    key: "background" | "midground" | "foreground" | "floating";
    match: string[];
    label: string;
  }> = [
    {
      key: "floating",
      match: ["floating", "surface"],
      label: "Float",
    },
    {
      key: "background",
      match: ["background"],
      label: "Back",
    },
    {
      key: "midground",
      match: ["midground"],
      label: "Mid",
    },
    {
      key: "foreground",
      match: ["foreground"],
      label: "Front",
    },
  ];

  const isFloating = zones[0].match.some((m) => lower.includes(m));
  const activeZones = new Set<string>();
  if (isFloating) activeZones.add("floating");
  for (const z of zones) {
    if (z.key === "floating") continue;
    if (z.match.some((m) => lower.includes(m))) activeZones.add(z.key);
  }

  return (
    <div className="flex items-center justify-center" aria-hidden>
      <div className="relative flex h-24 w-28 flex-col overflow-hidden rounded-md border border-border/70 bg-background/40">
        <span
          className={cn(
            "h-3 border-b border-border/40 transition-colors",
            activeZones.has("floating")
              ? "bg-[var(--brand)]/60"
              : "bg-foreground/[0.04]",
          )}
          title="Floating"
        />
        <div className="grid flex-1 grid-cols-3 gap-px">
          {(["foreground", "midground", "background"] as const).map((k) => {
            const active = activeZones.has(k);
            return (
              <span
                key={k}
                className={cn(
                  "h-full transition-colors",
                  active
                    ? "bg-[var(--brand)]/60"
                    : "bg-foreground/[0.04]",
                )}
                title={k}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Plant-type icon picker — translates the freeform "Rhizome /
 * Epiphyte", "Stem", "Carpet", etc. label into a representative
 * silhouette so type reads as a visual badge.
 */
function PlantTypeIcon({ raw }: { raw: string }) {
  const lower = raw.toLowerCase();
  let Icon: typeof Sprout = Sprout;
  if (lower.includes("moss")) Icon = Leaf;
  else if (lower.includes("floating")) Icon = Waves;
  else if (lower.includes("carpet")) Icon = Sprout;
  else if (lower.includes("stem")) Icon = ArrowUpDown;
  else if (lower.includes("rosette")) Icon = Sparkles;
  else if (lower.includes("rhizome") || lower.includes("epiphyte"))
    Icon = Leaf;

  return (
    <div className="flex items-center justify-center" aria-hidden>
      <span className="flex size-12 items-center justify-center rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 text-[var(--brand)]">
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
    </div>
  );
}

/**
 * Mini "herd" of shrimp silhouettes scaled to colony-min.
 */
function ColonyShrimpViz({ count }: { count: number }) {
  const display = Math.min(count, 10);
  const overflow = count > 10;
  return (
    <div
      className="flex h-12 items-center justify-center gap-[2px]"
      aria-hidden
    >
      {Array.from({ length: display }).map((_, i) => (
        <ShrimpMark
          key={i}
          className={cn(
            "size-3 text-[var(--brand)]/80",
            i % 2 === 1 && "-translate-y-0.5",
          )}
        />
      ))}
      {overflow && (
        <span className="ml-1 text-xs font-semibold text-[var(--brand)]">
          +
        </span>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Per-category composed profile grids.
   ────────────────────────────────────────────────────────────────── */

export function ProfileCards({
  entry,
}: {
  entry: FishEntry | PlantEntry | ShrimpEntry | MossEntry;
}) {
  if (entry.category === "fish") return <FishProfile entry={entry} />;
  if (entry.category === "plants") return <PlantProfile entry={entry} />;
  if (entry.category === "shrimp") return <ShrimpProfile entry={entry} />;
  return <MossProfile entry={entry} />;
}

/**
 * Surface a stocking recommendation under the "Schooling" card so
 * the reader knows how many to add — regardless of whether the
 * species is technically a schooler. Examples:
 *   • Yes / Yes (loose shoal)        → "Group of 8+"
 *   • Pair                            → "Keep as a bonded pair"
 *   • Pair or trio                    → "Best as a pair or trio"
 *   • Harem (1 male, 2–3 females)     → "Harem · 1 male, 2–3 females"
 *   • Solitary or pair                → "Solo or a pair"
 *   • No (live in groups)             → "Small group of 4+"
 *   • No                              → "Can be kept solo"
 */
function recommendedGroupNote(
  raw: string,
  min: number,
  isSchooling: boolean,
): string | undefined {
  const r = raw.toLowerCase();
  // Schoolers — straight count
  if (isSchooling) return `Group of ${min}+`;
  // Harem — surface the breakdown when the spreadsheet wrote it in parens
  if (/harem/.test(r)) {
    const m = raw.match(/\(([^)]+)\)/);
    return m ? `Harem · ${m[1]}` : "Keep as a harem";
  }
  // Pair-bonders
  if (/\bpair\b/.test(r)) {
    if (/trio/.test(r)) return "Best as a pair or trio";
    if (/solitary|solo/.test(r)) return "Solo or a pair";
    return "Keep as a bonded pair";
  }
  // "Loose group" / "No (live in groups)" — small group recommended
  if (/group/.test(r) && min >= 3) return `Small group of ${min}+`;
  // Fall-through — multiple recommended even if "No" reads literally
  if (min >= 2) return `Keep ${min}+ together`;
  // Genuinely solo species
  return "Can be kept solo";
}

function FishProfile({ entry: f }: { entry: FishEntry }) {
  const schoolingYes = /\byes\b/i.test(f.schooling);
  return (
    <div className={PROFILE_GRID}>
      <ProfileCard
        label="Family"
        value={f.family}
        graphic={<FamilyHero icon={FishMark} />}
      />
      <ProfileCard
        label="Water column"
        value={cap(f.waterColumn)}
        graphic={<WaterColumnViz level={mapWaterColumn(f.waterColumn)} />}
      />
      <ProfileCard
        label="Schooling"
        value={schoolingYes ? "Yes" : "No"}
        helper={recommendedGroupNote(f.schooling, f.minGroupSize, schoolingYes)}
        graphic={
          <SchoolingViz
            minGroupSize={f.minGroupSize}
            isSchooling={schoolingYes}
          />
        }
      />
      <ProfileCard
        label="Temperament"
        value={cap(f.temperament)}
        graphic={<TemperamentScale raw={f.temperament} />}
      />
      <ProfileCard
        label="Diet"
        value={cap(f.diet)}
        helper={f.feedingNotes}
        graphic={<DietPictogram diet={f.diet} />}
      />
      <ProfileCard
        label="Lifespan"
        value={`${f.lifespan} yrs`}
        graphic={<LifespanBar raw={f.lifespan} scaleMaxYears={15} />}
      />
      <ProfileCard
        label="Breeding"
        value={cap(f.breedingDifficulty)}
        graphic={
          <BreedingDifficultyViz raw={f.breedingDifficulty} />
        }
      />
      <ProfileCard
        label="Habitat"
        value={getHabitat(f.slug, f.origin)}
        helper={f.origin}
        graphic={<HabitatHero />}
      />
    </div>
  );
}

function PlantProfile({ entry: p }: { entry: PlantEntry }) {
  return (
    <div className={PROFILE_GRID}>
      <ProfileCard
        label="Family"
        value={p.family}
        graphic={<FamilyHero icon={PlantMark} />}
      />
      <ProfileCard
        label="Type"
        value={p.plantType}
        graphic={<PlantTypeIcon raw={p.plantType} />}
      />
      <ProfileCard
        label="Position"
        value={p.position}
        graphic={<PlantPositionViz raw={p.position} />}
      />
      <ProfileCard
        label="Substrate"
        value={p.substrate}
        graphic={
          <div className="flex items-center justify-center" aria-hidden>
            <span className="flex size-12 items-center justify-center rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 text-[var(--brand)]">
              <Sprout className="size-5" strokeWidth={1.75} />
            </span>
          </div>
        }
      />
      <ProfileCard
        label="Propagation"
        value={p.propagation}
        graphic={
          <div className="flex items-center justify-center" aria-hidden>
            <span className="flex size-12 items-center justify-center rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 text-[var(--brand)]">
              <Sparkles className="size-5" strokeWidth={1.75} />
            </span>
          </div>
        }
      />
      <ProfileCard
        label="Habitat"
        value={getHabitat(p.slug, p.origin)}
        helper={p.origin}
        graphic={<HabitatHero />}
      />
    </div>
  );
}

function ShrimpProfile({ entry: s }: { entry: ShrimpEntry }) {
  return (
    <div className={PROFILE_GRID}>
      <ProfileCard
        label="Colony minimum"
        value={`${s.colonyMin}+`}
        graphic={<ColonyShrimpViz count={s.colonyMin} />}
      />
      <ProfileCard
        label="Diet"
        value={cap(s.diet)}
        helper={s.feedingNotes}
        graphic={<DietPictogram diet={s.diet} />}
      />
      <ProfileCard
        label="Algae grazing"
        value={`${s.algaeEaterRating} / 5`}
        graphic={
          <div className="flex justify-center">
            <StarRating value={s.algaeEaterRating} />
          </div>
        }
      />
      <ProfileCard
        label="Breeding"
        value={cap(s.breeding)}
        graphic={
          <div className="flex items-center justify-center" aria-hidden>
            <span className="flex size-12 items-center justify-center rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 text-[var(--brand)]">
              <Heart className="size-5" strokeWidth={1.75} />
            </span>
          </div>
        }
      />
      <ProfileCard
        label="Lifespan"
        value={`${s.lifespan} yrs`}
        graphic={<LifespanBar raw={s.lifespan} scaleMaxYears={5} />}
      />
      <ProfileCard
        label="Habitat"
        value={getHabitat(s.slug, s.origin)}
        helper={s.origin}
        graphic={<HabitatHero />}
      />
    </div>
  );
}

function MossProfile({ entry: m }: { entry: MossEntry }) {
  return (
    <div className={PROFILE_GRID}>
      <ProfileCard
        label="Family"
        value={m.family}
        graphic={<FamilyHero icon={MossMark} />}
      />
      <ProfileCard
        label="Type"
        value={m.type}
        graphic={<PlantTypeIcon raw={m.type} />}
      />
      <ProfileCard
        label="Attachment"
        value={m.attachment}
        graphic={
          <div className="flex items-center justify-center" aria-hidden>
            <span className="flex size-12 items-center justify-center rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 text-[var(--brand)]">
              <Sparkles className="size-5" strokeWidth={1.75} />
            </span>
          </div>
        }
      />
      <ProfileCard
        label="Typical use"
        value={m.typicalUse}
        graphic={
          <div className="flex items-center justify-center" aria-hidden>
            <span className="flex size-12 items-center justify-center rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 text-[var(--brand)]">
              <Users className="size-5" strokeWidth={1.75} />
            </span>
          </div>
        }
      />
      <ProfileCard
        label="Trimming"
        value={m.trimming}
        graphic={
          <div className="flex items-center justify-center" aria-hidden>
            <span className="flex size-12 items-center justify-center rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 text-[var(--brand)]">
              <Leaf className="size-5" strokeWidth={1.75} />
            </span>
          </div>
        }
      />
      <ProfileCard
        label="Habitat"
        value={getHabitat(m.slug, m.origin)}
        helper={m.origin}
        graphic={<HabitatHero />}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────────────────── */

function cap(s: string): string {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function mapWaterColumn(raw: string): "top" | "mid" | "bottom" | "all" {
  const lower = raw.toLowerCase();
  if (lower.includes("all") || lower.includes("entire")) return "all";
  if (lower.includes("top") || lower.includes("surface")) return "top";
  if (lower.includes("bottom")) return "bottom";
  return "mid";
}

/**
 * Visual "breeding difficulty" — same star scale as the algae
 * rating, mapped from textual labels.
 */
function BreedingDifficultyViz({ raw }: { raw: string }) {
  const lower = raw.toLowerCase();
  let stars = 3;
  if (lower.includes("very") && lower.includes("hard")) stars = 5;
  else if (lower.includes("hard") || lower.includes("difficult")) stars = 4;
  else if (lower.includes("medium") || lower.includes("moderate")) stars = 3;
  else if (lower.includes("easy")) stars = 2;
  else if (lower.includes("trivial") || lower.includes("prolific"))
    stars = 1;
  return (
    <div className="flex items-center justify-center gap-2" aria-hidden>
      <ShieldAlert
        className="size-4 text-[var(--brand)]/70"
        strokeWidth={1.5}
      />
      <StarRating value={stars} />
    </div>
  );
}
