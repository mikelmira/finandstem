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

/* ─── Fish body-type plates ────────────────────────────────────────────
   FishPlate above is the slim torpedo body — the default. Below are
   five additional silhouettes covering the catalogue's other body
   plans: stocky, gourami (laterally compressed), eel, catfish (bottom
   dweller), and livebearer (small fan-tail).
   ────────────────────────────────────────────────────────────────────── */

/**
 * Stocky / barb body — taller and shorter than the slim tetra plate.
 * Suits cherry barbs, dwarf cichlids (ram, apisto), dwarf puffer,
 * and other deep-bodied perciforms.
 */
export function FishPlateStocky(props: IconProps) {
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
      {/* Almond-shaped body — short and deep */}
      <path d="M40 55 C 44 18, 80 14, 110 22 C 130 28, 140 42, 142 55 C 140 68, 130 82, 110 88 C 80 96, 44 92, 40 55 Z" />
      {/* Tail fork */}
      <path d="M40 55 L 18 28 L 28 55 L 18 82 Z" />
      {/* Dorsal fin — tall triangular spine */}
      <path d="M70 18 Q 76 2, 96 8 L 92 22 Q 80 22, 70 24 Z" />
      {/* Anal fin */}
      <path d="M76 92 Q 82 102, 96 96 L 94 84 Q 84 84, 76 92 Z" />
      {/* Pectoral fin */}
      <path d="M64 62 Q 72 78, 84 72" opacity="0.75" />
      {/* Pelvic fin */}
      <path d="M86 78 Q 90 90, 96 82" opacity="0.6" />
      {/* Gill cover */}
      <path d="M104 28 Q 108 55, 104 82" opacity="0.6" />
      {/* Eye */}
      <circle cx="124" cy="44" r="3" />
      <circle cx="124" cy="44" r="1.2" fill="currentColor" />
      {/* Vertical bars suggesting barb / cichlid markings */}
      <path
        d="M72 28 L 72 82 M88 24 L 88 86 M104 28 L 104 82"
        opacity="0.45"
      />
      {/* Mouth */}
      <path d="M140 51 L 146 49 M140 59 L 146 61" />
    </svg>
  );
}

/**
 * Gourami / labyrinth fish — laterally compressed disk with thread-
 * like ventral fins trailing below. Covers sparkling/honey/pearl
 * gourami plates.
 */
export function FishPlateGourami(props: IconProps) {
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
      {/* Tall almond body — very deep */}
      <path d="M40 55 C 46 12, 90 6, 118 16 C 134 24, 142 38, 144 55 C 142 72, 134 86, 118 94 C 90 104, 46 98, 40 55 Z" />
      {/* Tail — narrow rounded fan at the rear */}
      <path d="M40 55 Q 30 38, 22 38 L 26 55 L 22 72 Q 30 72, 40 55 Z" />
      {/* Dorsal fin — long ridge along the top */}
      <path d="M68 12 Q 100 -2, 124 14 Q 110 20, 70 20 Z" />
      {/* Anal fin — long ridge along the bottom */}
      <path d="M68 98 Q 100 112, 124 96 Q 110 90, 70 90 Z" />
      {/* Thread-like ventral fins — the gourami signature */}
      <path d="M76 82 Q 70 100, 60 108" opacity="0.85" />
      <path d="M82 84 Q 78 102, 70 110" opacity="0.7" />
      {/* Gill cover */}
      <path d="M112 22 Q 116 55, 112 88" opacity="0.5" />
      {/* Eye */}
      <circle cx="128" cy="44" r="3" />
      <circle cx="128" cy="44" r="1.2" fill="currentColor" />
      {/* Lateral spot — pearl gourami detail */}
      <circle cx="90" cy="55" r="2.5" opacity="0.45" />
      {/* Mouth — small and forward */}
      <path d="M142 51 L 148 49 M142 59 L 148 61" />
    </svg>
  );
}

/**
 * Eel / loach body — elongated tube. Suits kuhli loaches and any
 * very-long, low-fin species.
 */
export function FishPlateEel(props: IconProps) {
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
      {/* Wavy elongated body — taper to both ends */}
      <path d="M10 60 Q 24 36, 50 46 Q 78 60, 100 48 Q 126 30, 150 38 Q 152 42, 152 48 Q 130 60, 102 64 Q 78 70, 50 60 Q 28 52, 14 66 Q 10 64, 10 60 Z" />
      {/* Body bands — kuhli-loach stripes */}
      <path d="M40 46 Q 42 56, 38 60" opacity="0.5" />
      <path d="M62 56 Q 64 64, 60 68" opacity="0.5" />
      <path d="M84 58 Q 86 66, 82 70" opacity="0.5" />
      <path d="M108 50 Q 110 60, 106 64" opacity="0.5" />
      <path d="M128 42 Q 130 52, 126 56" opacity="0.5" />
      {/* Tiny dorsal fin */}
      <path d="M68 50 Q 74 42, 84 50" opacity="0.65" />
      {/* Eye near head */}
      <circle cx="144" cy="42" r="1.8" />
      <circle cx="144" cy="42" r="0.8" fill="currentColor" />
      {/* Barbels */}
      <path d="M150 44 Q 156 46, 158 50 M150 46 Q 156 50, 158 54" opacity="0.7" />
      {/* Tail tip — small fan */}
      <path d="M10 60 L 2 52 M10 60 L 2 68" />
    </svg>
  );
}

/**
 * Catfish / bottom dweller — flat belly, downturned mouth with
 * barbels, prominent pectoral fins, adipose fin. Suits corydoras,
 * otocinclus, plecos, hillstream loaches.
 */
export function FishPlateCatfish(props: IconProps) {
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
      {/* Body — top arch with flat belly */}
      <path d="M24 70 L 24 60 Q 28 28, 70 22 Q 110 18, 132 30 L 142 30 L 144 44 Q 144 56, 138 64 L 138 76 L 130 76 Q 110 80, 70 80 Q 32 80, 24 76 Z" />
      {/* Belly line */}
      <path d="M28 78 L 132 78" opacity="0.4" />
      {/* Bony plates — vertical hatches across the body */}
      <path
        d="M46 28 L 46 76 M62 24 L 62 78 M80 22 L 80 78 M98 22 L 98 78 M116 24 L 116 78"
        opacity="0.45"
      />
      {/* Dorsal fin — tall triangular, leaning back */}
      <path d="M62 22 L 72 4 L 82 22 Z" />
      {/* Adipose fin — small bump behind dorsal */}
      <path d="M96 22 Q 102 14, 108 22" />
      {/* Tail fork */}
      <path d="M144 50 L 158 32 L 152 50 L 158 68 L 144 60 Z" />
      {/* Pectoral fin — large, low and forward */}
      <path d="M40 76 Q 46 96, 60 92 L 58 78 Z" />
      {/* Pelvic fin */}
      <path d="M86 80 Q 92 96, 102 92 L 100 80 Z" opacity="0.85" />
      {/* Eye — set on top of head */}
      <circle cx="130" cy="40" r="2.4" />
      <circle cx="130" cy="40" r="1" fill="currentColor" />
      {/* Mouth + barbels — downturned, with 4 short whiskers */}
      <path d="M138 50 L 144 54" />
      <path
        d="M138 54 Q 142 60, 146 62 M140 56 Q 144 62, 150 64 M136 56 Q 140 64, 144 68 M138 58 Q 142 66, 148 70"
        opacity="0.75"
      />
    </svg>
  );
}

/**
 * Livebearer — small ovoid body, prominent fan tail, modest fins.
 * Suits Endler's, guppies, and similar.
 */
export function FishPlateLivebearer(props: IconProps) {
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
      {/* Body — short slim ovoid */}
      <path d="M50 55 C 54 32, 78 26, 100 30 C 116 34, 124 44, 126 55 C 124 66, 116 76, 100 80 C 78 84, 54 78, 50 55 Z" />
      {/* Large fan tail — flares wide and arches above/below the body */}
      <path d="M50 55 L 14 24 Q 8 36, 6 50 L 18 55 L 6 60 Q 8 74, 14 86 L 50 55 Z" />
      {/* Tail rays */}
      <path
        d="M50 55 L 16 28 M50 55 L 12 38 M50 55 L 10 50 M50 55 L 10 60 M50 55 L 12 72 M50 55 L 16 82"
        opacity="0.55"
      />
      {/* Dorsal fin — small triangular */}
      <path d="M78 30 Q 84 16, 96 26 Z" />
      {/* Anal fin — pointed (suggesting gonopodium) */}
      <path d="M90 80 L 100 92 L 102 82 Z" opacity="0.85" />
      {/* Eye */}
      <circle cx="118" cy="48" r="2.6" />
      <circle cx="118" cy="48" r="1.1" fill="currentColor" />
      {/* Mouth */}
      <path d="M134 52 L 140 50 M134 58 L 140 60" />
      {/* Lateral spot */}
      <circle cx="82" cy="55" r="2" opacity="0.4" />
    </svg>
  );
}

/* ─── Plant body-type plates ──────────────────────────────────────────
   PlantPlate above is the stem-plant silhouette — the default. Below
   are five additional silhouettes covering the catalogue's other
   plant body plans: rosette (broad leaves from a crown), rhizome
   (creeping rhizome with broad upright leaves), carpet (short
   ground-cover), floating, and grass (long strap blades).
   ────────────────────────────────────────────────────────────────────── */

/** Rosette — broad ovate leaves radiating outward from a central crown. */
export function PlantPlateRosette(props: IconProps) {
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
      {/* Substrate */}
      <path d="M10 144 L 110 144" />
      <path
        d="M22 148 L 24 148 M36 148 L 40 148 M54 148 L 56 148 M70 148 L 74 148 M86 148 L 90 148 M100 148 L 104 148"
        opacity="0.55"
      />
      {/* Root crown */}
      <path d="M52 144 Q 60 152, 68 144" opacity="0.55" />
      {/* Crown point */}
      <path d="M60 138 Q 56 144, 60 148 Q 64 144, 60 138 Z" fill="currentColor" />

      {/* Outer ring of leaves — long lanceolate blades radiating outward */}
      {/* Far left */}
      <path d="M60 138 Q 14 110, 6 60 Q 28 70, 60 130 Z" />
      <path d="M14 100 Q 28 92, 50 124" opacity="0.4" />
      {/* Left mid */}
      <path d="M60 138 Q 24 80, 28 24 Q 46 50, 60 130 Z" />
      <path d="M30 60 Q 38 80, 56 122" opacity="0.4" />
      {/* Centre upright */}
      <path d="M60 138 Q 56 60, 60 8 Q 64 60, 60 138 Z" />
      <path d="M60 24 L 60 132" opacity="0.4" />
      {/* Right mid */}
      <path d="M60 138 Q 96 80, 92 24 Q 74 50, 60 130 Z" />
      <path d="M90 60 Q 82 80, 64 122" opacity="0.4" />
      {/* Far right */}
      <path d="M60 138 Q 106 110, 114 60 Q 92 70, 60 130 Z" />
      <path d="M106 100 Q 92 92, 70 124" opacity="0.4" />
    </svg>
  );
}

/**
 * Rhizome epiphyte — horizontal rhizome at the substrate with broad
 * leaves rising from it at intervals. Suits anubias, java fern,
 * bucephalandra, bolbitis.
 */
export function PlantPlateRhizome(props: IconProps) {
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
      {/* Rock / wood — a soft hump along the bottom (this plant
          typically grows attached to hardscape, not buried). */}
      <path d="M6 140 Q 30 116, 60 120 Q 92 124, 114 138 L 114 152 L 6 152 Z" />
      <path d="M16 132 Q 30 122, 46 122" opacity="0.4" />
      <path d="M70 128 Q 88 124, 104 132" opacity="0.4" />
      {/* Horizontal rhizome on top of the rock */}
      <path d="M14 128 Q 30 116, 60 118 Q 92 120, 110 130" strokeWidth="2" />
      {/* Roots gripping the rock — short hatches under the rhizome */}
      <path
        d="M22 124 L 22 132 M34 118 L 34 130 M48 116 L 48 128 M62 116 L 62 128 M76 116 L 76 128 M88 118 L 88 130 M100 122 L 100 132"
        opacity="0.6"
      />
      {/* Broad leaves rising at intervals — leaf 1 (left) */}
      <path d="M28 120 Q 8 100, 12 64 Q 30 78, 32 116 Z" />
      <path d="M14 84 Q 22 96, 28 114" opacity="0.4" />
      {/* Leaf 2 */}
      <path d="M48 118 Q 30 84, 38 36 Q 54 60, 52 114 Z" />
      <path d="M40 56 Q 44 80, 50 112" opacity="0.4" />
      {/* Leaf 3 — centre, tallest */}
      <path d="M62 118 Q 50 70, 60 8 Q 70 70, 64 118 Z" />
      <path d="M62 22 L 62 116" opacity="0.4" />
      {/* Leaf 4 */}
      <path d="M76 118 Q 90 84, 86 36 Q 70 60, 74 114 Z" />
      <path d="M84 56 Q 80 80, 74 112" opacity="0.4" />
      {/* Leaf 5 */}
      <path d="M96 120 Q 116 100, 112 64 Q 94 78, 92 116 Z" />
      <path d="M110 84 Q 102 96, 96 114" opacity="0.4" />
    </svg>
  );
}

/**
 * Carpet — short ground-cover with many small upright shoots from a
 * horizontal runner. Suits HC cuba, monte carlo, dwarf hairgrass,
 * glossostigma, lilaeopsis, marsilea.
 */
export function PlantPlateCarpet(props: IconProps) {
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
      {/* Substrate */}
      <path d="M4 140 L 116 140" />
      <path
        d="M10 144 L 14 144 M22 144 L 24 144 M36 144 L 38 144 M50 144 L 54 144 M62 144 L 66 144 M80 144 L 84 144 M96 144 L 98 144 M108 144 L 112 144"
        opacity="0.55"
      />
      {/* Runner — horizontal stem just above substrate */}
      <path d="M8 134 Q 36 130, 60 134 Q 92 138, 112 132" opacity="0.7" />
      {/* Upright shoots — many short tufts with tiny leaves on top */}
      {[
        { x: 12, h: 38 },
        { x: 22, h: 50 },
        { x: 30, h: 36 },
        { x: 40, h: 56 },
        { x: 48, h: 42 },
        { x: 58, h: 60 },
        { x: 66, h: 44 },
        { x: 74, h: 54 },
        { x: 84, h: 48 },
        { x: 92, h: 60 },
        { x: 100, h: 46 },
        { x: 108, h: 50 },
      ].map(({ x, h }, i) => (
        <g key={i}>
          {/* Stem */}
          <path d={`M${x} 134 L ${x} ${134 - h}`} />
          {/* Tiny pair of leaves at the top */}
          <path
            d={`M${x - 3} ${134 - h + 4} Q ${x} ${134 - h - 3}, ${x + 3} ${134 - h + 4}`}
            fill="currentColor"
            opacity="0.85"
          />
        </g>
      ))}
    </svg>
  );
}

/**
 * Floating — leaves resting on the water surface with feathery roots
 * dangling below. Suits salvinia, frogbit, duckweed.
 */
export function PlantPlateFloating(props: IconProps) {
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
      {/* Water surface line — undulating, near the top */}
      <path d="M4 36 Q 16 32, 28 36 Q 40 40, 52 36 Q 64 32, 76 36 Q 88 40, 100 36 Q 112 32, 116 36" />
      {/* Leaves on top of water — 3 rounded leaves */}
      <ellipse cx="32" cy="26" rx="14" ry="9" />
      <path d="M22 24 Q 32 18, 42 24" opacity="0.4" />
      <ellipse cx="60" cy="22" rx="16" ry="10" />
      <path d="M50 20 Q 60 14, 70 20" opacity="0.4" />
      <ellipse cx="90" cy="26" rx="13" ry="8" />
      <path d="M80 24 Q 90 18, 100 24" opacity="0.4" />
      {/* Veining on the centre leaf */}
      <path d="M60 14 L 60 30" opacity="0.45" />
      <path d="M52 18 Q 60 22, 68 18" opacity="0.4" />
      {/* Hanging roots — feathery tendrils descending from each leaf */}
      {[
        { x: 32, branches: 3 },
        { x: 60, branches: 4 },
        { x: 90, branches: 3 },
      ].map(({ x, branches }, leafIdx) => (
        <g key={leafIdx}>
          {/* Main root */}
          <path d={`M${x} 36 Q ${x - 2} 80, ${x + 2} 140`} opacity="0.75" />
          {/* Side rootlets */}
          {Array.from({ length: branches }).map((_, i) => {
            const y = 60 + i * 22;
            const side = i % 2 === 0 ? -1 : 1;
            return (
              <path
                key={i}
                d={`M${x + side * 0.5} ${y} Q ${x + side * 8} ${y + 8}, ${x + side * 14} ${y + 20}`}
                opacity="0.5"
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}

/**
 * Grass — long narrow strap blades arching outward from a tight
 * crown. Suits vallisneria, sagittaria, and similar tall strap
 * plants.
 */
export function PlantPlateGrass(props: IconProps) {
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
      {/* Substrate */}
      <path d="M10 144 L 110 144" />
      <path
        d="M22 148 L 26 148 M40 148 L 44 148 M58 148 L 62 148 M76 148 L 80 148 M92 148 L 96 148"
        opacity="0.55"
      />
      {/* Crown — tight base where all blades originate */}
      <path d="M52 144 Q 60 150, 68 144" opacity="0.6" />
      {/* Blades — long, narrow, slightly curving outward. Each blade
          is a single stroke with two parallel edges. */}
      {[
        { tipX: 6, tipY: 24 },
        { tipX: 14, tipY: 12 },
        { tipX: 30, tipY: 4 },
        { tipX: 48, tipY: 0 },
        { tipX: 60, tipY: -2 },
        { tipX: 72, tipY: 0 },
        { tipX: 90, tipY: 4 },
        { tipX: 106, tipY: 12 },
        { tipX: 114, tipY: 24 },
      ].map(({ tipX, tipY }, i) => {
        const midX = (tipX + 60) / 2;
        const midY = (tipY + 144) / 2 - 12;
        return (
          <g key={i}>
            <path
              d={`M60 142 Q ${midX} ${midY}, ${tipX} ${Math.max(tipY, 0)}`}
              opacity="0.85"
            />
            {/* A second parallel stroke just to the side, giving the
                blade visible width without filling. */}
            {i % 2 === 1 && (
              <path
                d={`M60.6 142 Q ${midX + 1} ${midY + 1}, ${tipX + 1} ${Math.max(tipY + 1, 1)}`}
                opacity="0.35"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Resolver ──────────────────────────────────────────────────────────
   Convenience: get the right mark or plate for a category or species.
   Per-species body type is derived from slug (fish) or the plantType
   string (plants); shrimp + moss have one plate each for now.
   ────────────────────────────────────────────────────────────────────── */

import type { CatalogueCategory, CatalogueEntry } from "@/types/catalogue";

export const CATEGORY_MARK: Record<
  CatalogueCategory,
  React.ComponentType<IconProps>
> = {
  fish: FishMark,
  plants: PlantMark,
  shrimp: ShrimpMark,
  mosses: MossMark,
};

/** Legacy default plate per category — kept for callers that don't
 *  have a full entry handy. New code should prefer
 *  `getSpeciesPlate(entry)` so each species gets its body-type plate. */
export const CATEGORY_PLATE: Record<
  CatalogueCategory,
  React.ComponentType<IconProps>
> = {
  fish: FishPlate,
  plants: PlantPlate,
  shrimp: ShrimpPlate,
  mosses: MossPlate,
};

export type FishBodyType =
  | "slim"
  | "stocky"
  | "gourami"
  | "eel"
  | "catfish"
  | "livebearer";

export type PlantBodyType =
  | "stem"
  | "rosette"
  | "rhizome"
  | "carpet"
  | "floating"
  | "grass";

const FISH_BODY_TYPES: Record<string, FishBodyType> = {
  // Slim torpedo (default — only listed where slug isn't obvious from name)
  "neon-tetra": "slim",
  "cardinal-tetra": "slim",
  "ember-tetra": "slim",
  "chili-rasbora": "slim",
  "harlequin-rasbora": "slim",
  "celestial-pearl-danio": "slim",
  "rummynose-tetra": "slim",
  "white-cloud-mountain-minnow": "slim",
  "diamond-tetra": "slim",
  "lemon-tetra": "slim",
  "black-neon-tetra": "slim",
  "dwarf-pencilfish": "slim",
  "black-phantom-tetra": "slim",
  "glowlight-tetra": "slim",
  "threadfin-rainbowfish": "slim",
  "forktail-blue-eye": "slim",
  "clown-killifish": "slim",
  "siamese-algae-eater": "slim",

  // Stocky / deep-bodied perciforms
  "cherry-barb": "stocky",
  "ram-cichlid": "stocky",
  "apistogramma-cacatuoides": "stocky",
  "apistogramma-agassizii": "stocky",
  "dwarf-puffer": "stocky",
  "marbled-hatchetfish": "stocky",

  // Gourami / labyrinth
  "sparkling-gourami": "gourami",
  "honey-gourami": "gourami",
  "pearl-gourami": "gourami",

  // Eel / loach
  "kuhli-loach": "eel",

  // Catfish / bottom dwellers
  otocinclus: "catfish",
  "pygmy-corydoras": "catfish",
  "sterbai-corydoras": "catfish",
  "bristlenose-pleco": "catfish",
  "reticulated-hillstream-loach": "catfish",

  // Livebearer
  "endler-livebearer": "livebearer",
};

const FISH_PLATE_BY_TYPE: Record<FishBodyType, React.ComponentType<IconProps>> =
  {
    slim: FishPlate,
    stocky: FishPlateStocky,
    gourami: FishPlateGourami,
    eel: FishPlateEel,
    catfish: FishPlateCatfish,
    livebearer: FishPlateLivebearer,
  };

const PLANT_PLATE_BY_TYPE: Record<
  PlantBodyType,
  React.ComponentType<IconProps>
> = {
  stem: PlantPlate,
  rosette: PlantPlateRosette,
  rhizome: PlantPlateRhizome,
  carpet: PlantPlateCarpet,
  floating: PlantPlateFloating,
  grass: PlantPlateGrass,
};

/**
 * Map a fish slug to its body type. Defaults to "slim" — the most
 * common silhouette across the catalogue.
 */
export function getFishBodyType(slug: string): FishBodyType {
  return FISH_BODY_TYPES[slug] ?? "slim";
}

/**
 * Parse the plantType string into a body-type key. The plantType
 * field is freeform-ish (`"Rhizome / Epiphyte"`, `"Carpet / Stem"`,
 * etc.) so we keyword-match the parts.
 *
 * Specific slug overrides handle the few cases where the type string
 * alone doesn't capture the visual shape — e.g. vallisneria has
 * `Rosette / Runner` but reads as a grass-blade plant.
 */
const PLANT_TYPE_SLUG_OVERRIDES: Record<string, PlantBodyType> = {
  "vallisneria-spiralis": "grass",
  "sagittaria-subulata": "grass",
  "needle-hairgrass": "grass",
  "dwarf-hairgrass": "grass",
};

export function getPlantBodyType(
  slug: string,
  plantType: string,
): PlantBodyType {
  if (slug in PLANT_TYPE_SLUG_OVERRIDES) return PLANT_TYPE_SLUG_OVERRIDES[slug];
  const t = plantType.toLowerCase();
  if (t.includes("floating")) return "floating";
  if (t.includes("carpet")) return "carpet";
  if (t.includes("rhizome") || t.includes("epiphyte")) return "rhizome";
  if (t.includes("rosette") || t.includes("bulb")) return "rosette";
  if (t.includes("grass")) return "grass";
  // Default — most stem variants and creeping forms
  return "stem";
}

/**
 * Resolve the right plate component for a specific entry. Returns a
 * tuple of `[component, label]` so the caller can show the body type
 * name beside the drawing.
 */
export function getSpeciesPlate(entry: CatalogueEntry): {
  Plate: React.ComponentType<IconProps>;
  label: string;
} {
  if (entry.category === "fish") {
    const type = getFishBodyType(entry.slug);
    return {
      Plate: FISH_PLATE_BY_TYPE[type],
      label: FISH_BODY_LABELS[type],
    };
  }
  if (entry.category === "plants") {
    const type = getPlantBodyType(entry.slug, entry.plantType);
    return {
      Plate: PLANT_PLATE_BY_TYPE[type],
      label: PLANT_BODY_LABELS[type],
    };
  }
  if (entry.category === "shrimp") {
    return { Plate: ShrimpPlate, label: "Shrimp" };
  }
  return { Plate: MossPlate, label: "Moss tuft" };
}

const FISH_BODY_LABELS: Record<FishBodyType, string> = {
  slim: "Slim tetra",
  stocky: "Stocky perciform",
  gourami: "Gourami",
  eel: "Eel-form loach",
  catfish: "Catfish",
  livebearer: "Livebearer",
};

const PLANT_BODY_LABELS: Record<PlantBodyType, string> = {
  stem: "Stem plant",
  rosette: "Rosette",
  rhizome: "Rhizome epiphyte",
  carpet: "Carpet",
  floating: "Floating",
  grass: "Strap-leaf grass",
};
