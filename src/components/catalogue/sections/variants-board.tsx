import { Palette, ShieldAlert, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DetailSection } from "@/data/species-detail";

interface VariantsBoardProps {
  sections: DetailSection[];
  className?: string;
}

const PRIMARY_KEYS = new Set([
  "colorForms",
  "colorGrades",
  "variants",
]);

const ID_KEYS = new Set([
  "misidentification",
  "identificationNotes",
  "sisterSpecies",
]);

/**
 * Parse a short variant text into pills if it reads like a list of named
 * cultivars (lots of capitalised quoted names separated by commas or
 * 'and'). Falls back to plain prose otherwise.
 */
function extractNames(body: string): string[] | null {
  // Look for quoted ('Foo' or 'Foo Bar') or Title-Case multi-word groups
  const matches = body.match(/'[^']{2,40}'|"[^"]{2,40}"/g);
  if (matches && matches.length >= 3) {
    return matches.map((m) => m.replace(/['"]/g, ""));
  }
  return null;
}

export function VariantsBoard({ sections, className }: VariantsBoardProps) {
  if (sections.length === 0) return null;

  const primary = sections.filter((s) => PRIMARY_KEYS.has(s.key));
  const idNotes = sections.filter((s) => ID_KEYS.has(s.key));

  return (
    <section
      className={cn("flex flex-col gap-6", className)}
      aria-labelledby="group-variants"
    >
      <header className="flex flex-col gap-1">
        <h2
          id="group-variants"
          className="text-display-tight text-2xl sm:text-3xl"
        >
          Variants &amp; identification
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          The named cultivars and the lookalikes worth flagging.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr] lg:gap-6">
        {/* Primary: variants feature card */}
        {primary.map((s, i) => {
          const names = extractNames(s.body);
          return (
            <article
              key={s.key}
              style={{ ["--i" as string]: i }}
              className="animate-fade-up glass glass-edge group relative overflow-hidden rounded-2xl p-6 sm:p-7 lg:row-span-2"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-12 -left-12 size-48 rounded-full bg-[var(--brand)]/12 blur-3xl"
              />

              <div className="relative flex items-center gap-2">
                <Palette
                  className="size-4 text-[var(--brand)]"
                  aria-hidden
                  strokeWidth={1.75}
                />
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
                  {s.label}
                </span>
              </div>

              {names && (
                <div className="relative mt-5 flex flex-wrap gap-1.5">
                  {names.map((n) => (
                    <span
                      key={n}
                      className="press inline-flex items-center rounded-full border border-[var(--brand)]/35 bg-[var(--brand)]/12 px-3 py-1 text-xs font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--brand)]/65 hover:bg-[var(--brand)]/18"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              )}

              <p className="relative mt-5 text-sm leading-relaxed text-foreground/85 whitespace-pre-line">
                {s.body}
              </p>
            </article>
          );
        })}

        {/* Side: ID notes / sister species / misidentification */}
        {idNotes.length > 0 && (
          <div className="stagger flex flex-col gap-3">
            {idNotes.map((s, i) => (
              <article
                key={s.key}
                style={{ ["--i" as string]: i + 1 }}
                className="animate-fade-up glass glass-edge rounded-2xl p-5"
              >
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="inline-flex size-7 items-center justify-center rounded-full bg-amber-500/18 text-amber-700"
                  >
                    {s.key === "sisterSpecies" ? (
                      <Layers className="size-3.5" strokeWidth={2} />
                    ) : (
                      <ShieldAlert className="size-3.5" strokeWidth={2} />
                    )}
                  </span>
                  <h3 className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/85">
                    {s.label}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/85 whitespace-pre-line">
                  {s.body}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
