import { cn } from "@/lib/utils";

interface TankSizeBadgeProps {
  /** Litres value, e.g. 60. */
  litres: number;
  /** Free-form size note shown beneath the badge (e.g. "Pair", "Harem"). */
  note?: string;
  className?: string;
}

interface Tier {
  label: string;
  min: number;
  /** SVG viewBox proportions (width, height), taller for bigger tanks. */
  ratio: [number, number];
}

const TIERS: Tier[] = [
  { label: "Nano", min: 0, ratio: [32, 24] },
  { label: "Small", min: 30, ratio: [42, 28] },
  { label: "Medium", min: 75, ratio: [54, 34] },
  { label: "Large", min: 150, ratio: [66, 40] },
  { label: "Extra large", min: 300, ratio: [78, 46] },
];

function tierFor(litres: number): Tier {
  return [...TIERS].reverse().find((t) => litres >= t.min) ?? TIERS[0];
}

export function TankSizeBadge({ litres, note, className }: TankSizeBadgeProps) {
  const tier = tierFor(litres);
  const [w, h] = tier.ratio;

  return (
    <figure
      className={cn("flex items-center gap-3", className)}
      aria-label={`Minimum tank size ${litres} litres (${tier.label})`}
    >
      <span className="relative shrink-0">
        <svg
          width={68}
          height={48}
          viewBox="0 0 80 48"
          fill="none"
          aria-hidden
        >
          {/* Stand / shadow */}
          <rect
            x={(80 - w) / 2 - 2}
            y={48 - 3}
            width={w + 4}
            height={3}
            rx={1.5}
            className="fill-foreground/15"
          />
          {/* Tank glass body */}
          <rect
            x={(80 - w) / 2}
            y={48 - h - 3}
            width={w}
            height={h}
            rx={2}
            className="fill-[color-mix(in_oklab,var(--brand)_18%,transparent)] stroke-[var(--brand)]"
            strokeWidth={1.5}
          />
          {/* Water line */}
          <rect
            x={(80 - w) / 2 + 1.5}
            y={48 - h - 1}
            width={w - 3}
            height={h - 5}
            rx={1.5}
            className="fill-[color-mix(in_oklab,var(--leaf)_22%,transparent)]"
          />
          {/* Surface highlight */}
          <line
            x1={(80 - w) / 2 + 2}
            y1={48 - h + 1}
            x2={(80 - w) / 2 + w - 2}
            y2={48 - h + 1}
            className="stroke-[var(--leaf)]/80"
            strokeWidth={1}
          />
          {/* Substrate */}
          <rect
            x={(80 - w) / 2 + 1.5}
            y={48 - 5}
            width={w - 3}
            height={2}
            rx={0.5}
            className="fill-[var(--moss)]/65"
          />
        </svg>
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="text-base font-semibold leading-tight text-foreground">
          {litres} L
          <span className="ml-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {tier.label}
          </span>
        </span>
        <span className="text-xs text-muted-foreground">
          {note ?? `Minimum tank size`}
        </span>
      </div>
    </figure>
  );
}
