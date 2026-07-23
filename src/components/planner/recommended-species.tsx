"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus, Sparkles } from "lucide-react";
import { CATEGORY_META } from "@/types/catalogue";
import { FishMark } from "@/components/icons/species-icons";
import { Difficulty } from "@/components/catalogue/difficulty";
import { IMAGE_ATTRIBUTION } from "@/data/image-attribution";
import type { FishRecommendation } from "@/lib/catalogue/recommend";

interface RecommendedSpeciesProps {
  recommendations: FishRecommendation[];
}

/**
 * Recommended-next strip, the planner's "you could add…" panel.
 * Each card shows a candidate fish with a specimen photo, the
 * scored rationale, and an "Add to tank" pill that writes the
 * species back into the URL.
 *
 * Each card's link to its catalogue profile is separate from the
 * "Add" button so the user can pick either path.
 */
export function RecommendedSpecies({ recommendations }: RecommendedSpeciesProps) {
  const router = useRouter();
  const search = useSearchParams();

  function addToTank(slug: string) {
    const sp = new URLSearchParams(search?.toString() ?? "");
    const current = (sp.get("species") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const id = `fish:${slug}`;
    // Don't double-add if the species is already present (with any count).
    if (
      current.some((c) => {
        const parts = c.split(":");
        return parts[0] === "fish" && parts[1] === slug;
      })
    ) {
      return;
    }
    const next = [...current, id];
    sp.set("species", next.join(","));
    router.replace(`/planner?${sp.toString()}`, { scroll: false });
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section
      className="flex flex-col gap-5"
      aria-labelledby="recommendations"
    >
      <header className="flex items-baseline justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2
            id="recommendations"
            className="text-display-tight flex items-center gap-2 text-2xl sm:text-3xl"
          >
            <Sparkles
              className="size-5 text-[var(--brand)]"
              strokeWidth={1.85}
              aria-hidden
            />
            Recommended next
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Fish that fit your tank’s parameters, stocking headroom, and
            already-selected species, scored against the running state.
          </p>
        </div>
      </header>

      <ul className="stagger grid grid-cols-1 gap-3 md:grid-cols-2">
        {recommendations.map((rec, i) => (
          <li
            key={rec.fish.slug}
            style={{ ["--i" as string]: Math.min(i, 6) }}
          >
            <RecommendationCard rec={rec} onAdd={() => addToTank(rec.fish.slug)} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function RecommendationCard({
  rec,
  onAdd,
}: {
  rec: FishRecommendation;
  onAdd: () => void;
}) {
  const { fish } = rec;
  const meta = CATEGORY_META.fish;
  const image = IMAGE_ATTRIBUTION[fish.slug];

  return (
    <article className="glass glass-edge animate-fade-up group relative flex h-full flex-col overflow-hidden rounded-2xl">
      <div className="flex flex-1 gap-3 p-4">
        <Link
          href={`${meta.path}/${fish.slug}`}
          className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-muted"
          aria-label={`Open ${fish.commonName} profile`}
        >
          {image && (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="96px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            />
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--brand)]">
              <FishMark className="size-3.5 text-[var(--brand)]" />
              {meta.singular}
            </span>
            <Link
              href={`${meta.path}/${fish.slug}`}
              aria-label={`Open ${fish.commonName} profile`}
              className="press text-muted-foreground transition-colors hover:text-[var(--brand)]"
            >
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
          <Link
            href={`${meta.path}/${fish.slug}`}
            className="truncate text-sm font-semibold leading-tight transition-colors hover:text-[var(--brand)]"
          >
            {fish.commonName}
          </Link>
          <span className="truncate text-xs italic text-muted-foreground">
            {fish.scientificName}
          </span>
          <Difficulty level={fish.difficulty} className="mt-0.5" />
        </div>
      </div>

      {/* Reasons */}
      {rec.reasons.length > 0 && (
        <ul className="border-t border-foreground/8 px-4 pb-3 pt-3">
          {rec.reasons.slice(0, 3).map((r, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-[11px] leading-snug text-foreground/80"
            >
              <span
                aria-hidden
                className="mt-1.5 size-1 shrink-0 rounded-full bg-[var(--brand)]"
              />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-foreground/8 bg-foreground/[0.02] px-4 py-3">
        <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Adds {rec.contributionCm} cm
        </span>
        <button
          type="button"
          onClick={onAdd}
          className="press group/btn inline-flex items-center gap-2 rounded-full bg-[var(--brand)] py-1.5 pl-3.5 pr-1.5 text-xs font-medium text-[var(--brand-foreground)] transition-colors hover:bg-[color-mix(in_oklab,var(--brand)_90%,black)]"
          aria-label={`Add ${fish.commonName} to your tank`}
        >
          Add to tank
          <span className="flex size-6 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--brand-foreground)_18%,transparent)] transition-transform duration-200 group-hover/btn:rotate-90">
            <Plus className="size-3.5" strokeWidth={2} aria-hidden />
          </span>
        </button>
      </div>
    </article>
  );
}
