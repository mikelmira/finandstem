import { cn } from "@/lib/utils";

const LABELS: Record<number, string> = {
  1: "Beginner",
  2: "Easy",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

interface DifficultyProps {
  level: number;
  className?: string;
  showLabel?: boolean;
  /** Render with light colours for use over dark hero gradients. */
  tone?: "light" | "dark";
}

export function Difficulty({
  level,
  className,
  showLabel = true,
  tone = "dark",
}: DifficultyProps) {
  const safe = Math.max(1, Math.min(5, Math.round(level)));
  const isLight = tone === "light";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs",
        isLight ? "text-white/85" : "text-muted-foreground",
        className,
      )}
      aria-label={`Difficulty ${safe} of 5 — ${LABELS[safe]}`}
    >
      <span className="flex gap-[3px]" aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={cn(
              "h-1.5 w-3 rounded-full transition-colors",
              n <= safe
                ? "bg-[var(--brand)]"
                : isLight
                  ? "bg-white/25"
                  : "bg-muted-foreground/20",
            )}
          />
        ))}
      </span>
      {showLabel && (
        <span
          className={cn(
            "font-medium",
            isLight ? "text-white" : "text-foreground/80",
          )}
        >
          {LABELS[safe]}
        </span>
      )}
    </span>
  );
}
