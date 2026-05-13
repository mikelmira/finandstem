import * as React from "react";

/* ─── Category marks ─────────────────────────────────────────────────────
   Compact silhouettes for the four catalogue pillars — used as the
   identity glyph in eyebrow rows, profile cards, hero pills, and
   planner chips. All draw with `currentColor` so the parent controls
   tint; `aria-hidden` because the eyebrow text supplies the name.

   Designed to read at 16–32px against either cream or dark surfaces.
   ────────────────────────────────────────────────────────────────────── */

type IconProps = React.SVGProps<SVGSVGElement>;

/**
 * Slim profile-view fish — body taper into a forked tail, single dorsal
 * fin, eye dot. The default silhouette across the catalogue's fish
 * pages and chips.
 */
export function FishMark(props: IconProps) {
  return (
    <svg
      viewBox="0 0 32 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Body */}
      <path d="M5 11 C 7 6, 12 4, 18 4 C 23 4, 26 7, 27 11 C 26 15, 23 18, 18 18 C 12 18, 7 16, 5 11 Z" />
      {/* Tail fork — left of body, two strokes meeting at the body */}
      <path d="M5 11 L 1 6 M5 11 L 1 16" />
      {/* Dorsal fin */}
      <path d="M14 4 Q 15 1 18 3" />
      {/* Eye */}
      <circle cx="22" cy="9" r="0.9" fill="currentColor" stroke="none" />
      {/* Gill arc */}
      <path d="M20 6 Q 19 11 20 16" opacity="0.55" />
    </svg>
  );
}

/**
 * Aquatic stem plant — vertical rhizome line rising from a substrate
 * mark with alternating teardrop leaves. Reads as "stem plant /
 * rosette" rather than a generic land-plant leaf.
 */
export function PlantMark(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Substrate */}
      <path d="M4 28 L 20 28" opacity="0.6" />
      {/* Substrate stipple */}
      <path d="M7 30 L 7.5 30 M11 30 L 11.5 30 M15 30 L 15.5 30" opacity="0.45" />
      {/* Main stem */}
      <path d="M12 28 V 4" />
      {/* Leaves — alternating, larger lower, smaller higher */}
      <path
        d="M12 24 Q 6 23, 5 18 Q 9 18, 12 22 Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M12 18 Q 19 17, 20 12 Q 15 12, 12 16 Z"
        fill="currentColor"
      />
      <path
        d="M12 13 Q 7 12, 6.5 8 Q 10 8, 12 11 Z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* Top bud */}
      <path
        d="M12 7 Q 15 5, 12 3 Q 9 5, 12 7 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Curved C-shape shrimp — segmented body, two long antennae sweeping
 * forward from the head, three tail fan strokes at the rear.
 */
export function ShrimpMark(props: IconProps) {
  return (
    <svg
      viewBox="0 0 32 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Body — a hooked C lying horizontally */}
      <path d="M7 16 Q 4 11, 9 7 Q 16 4, 22 7 Q 26 10, 25 14 Q 23 18, 18 18 Q 12 18, 9 16" />
      {/* Segments — three short hatches across the body */}
      <path
        d="M13 7.5 L 13.5 11 M16 6.5 L 16.5 11 M19 7 L 19 11"
        opacity="0.55"
      />
      {/* Head — slight cap */}
      <path d="M22 7 Q 24 7, 25 9" />
      {/* Antennae — two long curves sweeping from the head forward */}
      <path d="M25 8 Q 29 3, 30 1" opacity="0.85" />
      <path d="M24 6 Q 28 2, 30 3" opacity="0.7" />
      {/* Tail fan */}
      <path d="M9 17 L 5 19 M9 16 L 4 17 M9 15 L 5 13" />
      {/* Eye */}
      <circle cx="23" cy="9.5" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Moss tuft — clustered short fronds rising from a substrate mark.
 * Reads as "cushion of vegetation" rather than a single leaf.
 */
export function MossMark(props: IconProps) {
  return (
    <svg
      viewBox="0 0 32 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Substrate */}
      <path d="M3 20 L 29 20" opacity="0.55" />
      {/* Fronds — short branching strokes */}
      <path d="M7 20 L 7 14 M5.5 16 L 7 14 M8.5 16 L 7 14" />
      <path d="M11 20 L 11 11 M9.5 13 L 11 11 M12.5 13 L 11 11 M10 15 L 11 13" />
      <path d="M16 20 L 16 8 M14 11 L 16 8 M18 11 L 16 8 M14.5 14 L 16 11.5 M17.5 14 L 16 11.5" />
      <path d="M21 20 L 21 11 M19.5 13 L 21 11 M22.5 13 L 21 11" />
      <path d="M25 20 L 25 14 M23.5 16 L 25 14 M26.5 16 L 25 14" />
    </svg>
  );
}

/* ─── Scientific plates ──────────────────────────────────────────────────
   Larger silhouettes — drawn at ~120px for use as a margin annotation
   next to a species hero photo. One template per category; the
   intent is that they read as a hand-drawn field sketch beside the
   actual specimen photograph. Stroke-only so they layer cleanly on
   cream paper.

   These are deliberately generic — every species in a category shares
   its plate. To replace with per-species line art later, swap the
   silhouette path passed to the wrapper.
   ────────────────────────────────────────────────────────────────────── */

/**
 * Tetra-style fish plate — slim torpedo body, single eye, hatched
 * shading along the back. The default silhouette beside any fish
 * detail page hero.
 */
export function FishPlate(props: IconProps) {
  return (
    <svg
      viewBox="0 0 160 110"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Body */}
      <path d="M28 55 C 36 28, 70 22, 102 28 C 124 32, 138 44, 144 55 C 138 66, 124 78, 102 82 C 70 88, 36 82, 28 55 Z" />
      {/* Tail fork */}
      <path d="M28 55 L 8 32 L 16 55 L 8 78 Z" />
      {/* Lateral line */}
      <path d="M40 55 Q 80 56, 134 55" opacity="0.45" strokeDasharray="2 4" />
      {/* Dorsal fin */}
      <path d="M70 28 Q 78 14, 92 24 Q 86 28, 70 28 Z" />
      {/* Anal fin */}
      <path d="M70 82 Q 78 96, 92 86" />
      {/* Pectoral fin */}
      <path d="M56 60 Q 62 72, 70 64" opacity="0.7" />
      {/* Gill cover */}
      <path d="M104 35 Q 106 55, 104 75" opacity="0.6" />
      {/* Eye */}
      <circle cx="122" cy="48" r="3" />
      <circle cx="122" cy="48" r="1.2" fill="currentColor" />
      {/* Hatched shading on the back — short parallel strokes */}
      <path
        d="M50 38 L 53 34 M58 36 L 61 32 M66 34 L 69 30 M74 33 L 77 29 M82 33 L 85 29 M90 34 L 93 30 M98 36 L 101 32 M106 38 L 109 34"
        opacity="0.6"
      />
      {/* Mouth */}
      <path d="M138 51 L 144 53 M138 59 L 144 57" />
    </svg>
  );
}

/**
 * Aquatic stem plate — substrate at the base, a central stem rising,
 * paired leaves at four levels, finer veining lines on the leaves.
 */
export function PlantPlate(props: IconProps) {
  return (
    <svg
      viewBox="0 0 120 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Substrate line + grain */}
      <path d="M10 144 L 110 144" />
      <path
        d="M18 148 L 19 148 M28 148 L 30 148 M44 148 L 48 148 M58 148 L 60 148 M72 148 L 74 148 M88 148 L 92 148 M100 148 L 104 148"
        opacity="0.55"
      />
      {/* Root system — three short tapered roots below the substrate */}
      <path d="M60 144 L 56 156 M60 144 L 60 158 M60 144 L 64 156" opacity="0.6" />
      {/* Main stem */}
      <path d="M60 144 V 18" />
      {/* Leaf level 1 — large at the bottom */}
      <path d="M60 128 Q 22 122, 14 96 Q 38 96, 60 118 Z" />
      <path d="M60 128 Q 98 122, 106 96 Q 82 96, 60 118 Z" />
      {/* Vein on leaf 1 */}
      <path d="M60 124 Q 38 116, 20 100 M60 124 Q 82 116, 100 100" opacity="0.5" />
      {/* Leaf level 2 */}
      <path d="M60 96 Q 26 90, 20 70 Q 42 70, 60 86 Z" />
      <path d="M60 96 Q 94 90, 100 70 Q 78 70, 60 86 Z" />
      <path d="M60 94 Q 42 86, 24 74 M60 94 Q 78 86, 96 74" opacity="0.5" />
      {/* Leaf level 3 */}
      <path d="M60 70 Q 32 64, 28 48 Q 46 48, 60 60 Z" />
      <path d="M60 70 Q 88 64, 92 48 Q 74 48, 60 60 Z" />
      {/* Leaf level 4 — small at the top */}
      <path d="M60 48 Q 42 42, 40 30 Q 52 30, 60 40 Z" />
      <path d="M60 48 Q 78 42, 80 30 Q 68 30, 60 40 Z" />
      {/* Top bud */}
      <path d="M60 26 Q 66 18, 60 12 Q 54 18, 60 26 Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Shrimp plate — segmented body in a C-curve, two long antennae,
 * walking legs hatched along the underside, tail fan at the rear.
 */
export function ShrimpPlate(props: IconProps) {
  return (
    <svg
      viewBox="0 0 160 110"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Body outline — hooked C */}
      <path d="M40 70 Q 22 50, 40 32 Q 70 18, 108 26 Q 130 32, 136 50 Q 134 72, 116 80 Q 80 88, 50 78 Q 42 76, 40 70 Z" />
      {/* Segments */}
      <path d="M48 32 Q 50 56, 56 78" opacity="0.6" />
      <path d="M62 26 Q 64 56, 70 80" opacity="0.6" />
      <path d="M78 22 Q 80 56, 86 82" opacity="0.6" />
      <path d="M94 22 Q 96 54, 102 82" opacity="0.55" />
      <path d="M110 24 Q 112 52, 116 78" opacity="0.5" />
      {/* Head cap separation */}
      <path d="M118 28 Q 122 48, 120 72" opacity="0.7" />
      {/* Eye */}
      <circle cx="124" cy="42" r="2.4" />
      <circle cx="124" cy="42" r="1" fill="currentColor" />
      {/* Antennae — two long sweeps forward */}
      <path d="M132 36 Q 148 22, 156 12" />
      <path d="M134 42 Q 152 32, 158 28" opacity="0.8" />
      {/* Walking legs — hatches under the body */}
      <path
        d="M52 80 L 50 100 M64 84 L 62 102 M76 86 L 75 104 M88 86 L 88 104 M100 84 L 102 102"
        opacity="0.7"
      />
      {/* Swimmerets */}
      <path
        d="M58 76 L 56 88 M70 78 L 70 90 M82 78 L 84 90 M94 78 L 96 90"
        opacity="0.5"
      />
      {/* Tail fan — three blades at the rear */}
      <path d="M40 70 L 22 84 M40 60 L 20 60 M40 50 L 22 36" />
      <path d="M40 70 Q 28 78, 22 84 Q 18 70, 20 60 Q 22 48, 22 36" opacity="0.5" />
      {/* Rostrum (forward spike from head) */}
      <path d="M134 34 L 144 32" />
    </svg>
  );
}

/**
 * Moss plate — substrate strip with a dense cluster of branching
 * fronds rising from it. No single dominant shape; reads as a
 * mass of vegetation.
 */
export function MossPlate(props: IconProps) {
  return (
    <svg
      viewBox="0 0 160 110"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Substrate strip */}
      <path d="M10 88 L 150 88" />
      <path
        d="M20 94 L 24 94 M34 94 L 38 94 M50 94 L 52 94 M62 94 L 66 94 M78 94 L 80 94 M90 94 L 96 94 M108 94 L 112 94 M124 94 L 128 94 M138 94 L 142 94"
        opacity="0.55"
      />
      {/* Frond cluster — each frond is a stem with three pairs of
          short angled sub-branches, plus a tip pair. Drawn taller in
          the middle to give the cluster a soft dome silhouette. */}
      {[
        { x: 20, h: 30 },
        { x: 32, h: 46 },
        { x: 44, h: 56 },
        { x: 56, h: 66 },
        { x: 70, h: 74 },
        { x: 84, h: 70 },
        { x: 98, h: 62 },
        { x: 112, h: 52 },
        { x: 126, h: 40 },
        { x: 140, h: 28 },
      ].map(({ x, h }, i) => (
        <g key={i}>
          {/* Stem */}
          <path d={`M${x} 88 L ${x} ${88 - h}`} />
          {/* Three pairs of branches climbing the stem */}
          <path
            d={`M${x - 4} ${88 - h * 0.25} L ${x} ${88 - h * 0.35} L ${x + 4} ${88 - h * 0.25}`}
            opacity="0.85"
          />
          <path
            d={`M${x - 5} ${88 - h * 0.55} L ${x} ${88 - h * 0.65} L ${x + 5} ${88 - h * 0.55}`}
            opacity="0.85"
          />
          <path
            d={`M${x - 3} ${88 - h * 0.85} L ${x} ${88 - h * 0.92} L ${x + 3} ${88 - h * 0.85}`}
            opacity="0.85"
          />
          {/* Tip dot */}
          <circle
            cx={x}
            cy={88 - h}
            r="0.9"
            fill="currentColor"
            stroke="none"
          />
        </g>
      ))}
    </svg>
  );
}

/* ─── Resolver ──────────────────────────────────────────────────────────
   Convenience: get the right mark or plate for a category string.
   Lets components stay declarative without case-switching.
   ────────────────────────────────────────────────────────────────────── */

import type { CatalogueCategory } from "@/types/catalogue";

export const CATEGORY_MARK: Record<
  CatalogueCategory,
  React.ComponentType<IconProps>
> = {
  fish: FishMark,
  plants: PlantMark,
  shrimp: ShrimpMark,
  mosses: MossMark,
};

export const CATEGORY_PLATE: Record<
  CatalogueCategory,
  React.ComponentType<IconProps>
> = {
  fish: FishPlate,
  plants: PlantPlate,
  shrimp: ShrimpPlate,
  mosses: MossPlate,
};
