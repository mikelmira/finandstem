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
      viewBox="0 0 200 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Body + forked caudal fin in one continuous path. The tail
          notch at (28, 50) draws the V-cut between the two tail lobes. */}
      <path d="
        M 14 24
        L 52 44
        C 70 22, 132 18, 170 30
        C 184 34, 192 42, 196 52
        C 192 62, 184 70, 170 74
        C 132 86, 70 82, 52 60
        L 14 80
        L 28 52
        Z
      " />

      {/* Dorsal fin — single triangular fin set at the body midpoint */}
      <path d="M 88 22 Q 100 8, 124 18 L 120 28 Q 100 28, 88 22 Z" />

      {/* Pectoral fin — behind the operculum, swept back */}
      <path d="M 142 60 Q 132 74, 118 74 L 132 60 Z" />

      {/* Pelvic fin — small, on the belly mid-way back */}
      <path d="M 106 70 Q 100 80, 90 76 L 100 70 Z" opacity="0.85" />

      {/* Anal fin — mirrors the dorsal, slightly behind it */}
      <path d="M 74 72 Q 64 84, 50 76 L 70 66 Z" opacity="0.85" />

      {/* Operculum (gill cover) curve */}
      <path d="M 158 36 C 156 50, 156 56, 158 70" opacity="0.5" />

      {/* Eye — outline plus filled pupil */}
      <circle cx="172" cy="46" r="4.5" />
      <circle cx="172" cy="46" r="2" fill="currentColor" />

      {/* Mouth — single short line at the snout */}
      <path d="M 195 51 L 198 50" />

      {/* Lateral stripe — the tetra/rasbora midline signature */}
      <path d="M 52 52 C 88 51, 130 50, 156 49" opacity="0.45" />
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
      viewBox="0 0 200 110"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Body + tail — deeper, almond profile with a more compact tail */}
      <path d="
        M 16 26
        L 54 46
        C 68 14, 134 10, 170 24
        C 184 32, 192 42, 196 55
        C 192 68, 184 78, 170 86
        C 134 100, 68 96, 54 64
        L 16 84
        L 28 55
        Z
      " />

      {/* Dorsal fin — tall, leaning slightly forward (barb / cichlid signature) */}
      <path d="M 76 14 Q 92 -2, 124 6 L 120 22 Q 96 22, 76 18 Z" />

      {/* Anal fin — mirror of dorsal, prominent on stocky fish */}
      <path d="M 78 92 Q 92 108, 124 100 L 120 86 Q 96 86, 78 92 Z" />

      {/* Pelvic fin */}
      <path d="M 102 80 Q 96 92, 86 86 L 96 78 Z" opacity="0.85" />

      {/* Pectoral fin */}
      <path d="M 140 64 Q 130 80, 116 80 L 128 62 Z" />

      {/* Operculum */}
      <path d="M 158 30 C 156 55, 156 60, 158 82" opacity="0.55" />

      {/* Eye */}
      <circle cx="172" cy="42" r="5" />
      <circle cx="172" cy="42" r="2.2" fill="currentColor" />

      {/* Mouth — slightly upturned */}
      <path d="M 194 50 L 198 49" />

      {/* Subtle vertical bars — barb / dwarf-cichlid marking */}
      <path d="M 84 24 C 82 55, 82 64, 84 90" opacity="0.32" />
      <path d="M 108 18 C 106 55, 106 65, 108 96" opacity="0.32" />
      <path d="M 132 20 C 130 55, 130 65, 132 94" opacity="0.32" />
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
      viewBox="0 0 200 140"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Body — very deep oval with a small rounded caudal fan */}
      <path d="
        M 28 60
        Q 38 30, 52 36
        C 64 4, 134 0, 170 16
        C 184 26, 192 40, 196 60
        C 192 80, 184 94, 170 104
        C 134 120, 64 116, 52 84
        Q 38 90, 28 60
        Z
      " />
      {/* Caudal peduncle separator */}
      <path d="M 52 36 Q 56 60, 52 84" opacity="0.3" />

      {/* Long dorsal fin — runs the full length of the back */}
      <path d="M 60 14 C 90 -6, 156 -2, 178 16 C 156 24, 100 26, 60 22 Z" />

      {/* Long anal fin — mirrors the dorsal */}
      <path d="M 60 106 C 90 126, 156 122, 178 106 C 156 98, 100 96, 60 100 Z" />

      {/* THREAD VENTRAL FINS — the gourami signature, two long filaments
          trailing well below the body */}
      <path d="M 96 96 Q 86 122, 64 138" strokeWidth="1.6" />
      <path d="M 104 96 Q 100 126, 78 140" opacity="0.85" strokeWidth="1.6" />

      {/* Pectoral fin */}
      <path d="M 144 72 Q 134 88, 120 86 L 134 70 Z" opacity="0.75" />

      {/* Operculum */}
      <path d="M 158 22 C 156 60, 156 60, 158 98" opacity="0.5" />

      {/* Eye */}
      <circle cx="172" cy="46" r="4.5" />
      <circle cx="172" cy="46" r="2" fill="currentColor" />

      {/* Mouth — small terminal mouth */}
      <path d="M 194 56 L 197 55" />

      {/* Pearl-spot — characteristic of pearl gouramis */}
      <circle cx="110" cy="62" r="3" opacity="0.4" />
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
      viewBox="0 0 200 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Wavy elongated body — taper to a small caudal fan at the left
          and a rounded head at the right. Smooth S-curve through the
          middle. */}
      <path d="
        M 12 38
        Q 22 30, 48 36
        Q 80 48, 110 38
        Q 146 22, 178 28
        Q 192 32, 196 40
        Q 192 48, 178 52
        Q 146 58, 110 48
        Q 80 56, 48 46
        Q 22 50, 12 44
        Z
      " />

      {/* Caudal fan — small rounded tail at the left tip */}
      <path d="M 12 38 Q 4 30, 4 40 Q 4 50, 12 44" />

      {/* Body bands — kuhli-loach signature alternating dark bars,
          drawn as soft saddles across the upper body */}
      <path d="M 38 33 C 40 36, 40 44, 38 47" opacity="0.4" fill="currentColor" stroke="none" />
      <path d="M 62 38 C 64 42, 64 50, 62 54" opacity="0.4" fill="currentColor" stroke="none" />
      <path d="M 88 44 C 90 48, 90 54, 88 57" opacity="0.4" fill="currentColor" stroke="none" />
      <path d="M 116 40 C 118 44, 118 50, 116 53" opacity="0.4" fill="currentColor" stroke="none" />
      <path d="M 146 30 C 148 34, 148 42, 146 45" opacity="0.4" fill="currentColor" stroke="none" />
      <path d="M 172 28 C 174 32, 174 40, 172 43" opacity="0.4" fill="currentColor" stroke="none" />

      {/* Small dorsal fin — barely a bump */}
      <path d="M 80 42 Q 88 36, 98 42" opacity="0.55" />

      {/* Eye */}
      <circle cx="186" cy="36" r="2.4" />
      <circle cx="186" cy="36" r="1" fill="currentColor" />

      {/* Mouth + barbels — kuhli loaches have 4 short barbels */}
      <path d="M 195 42 L 198 41" />
      <path d="M 195 44 Q 199 47, 200 51" opacity="0.7" />
      <path d="M 193 45 Q 197 48, 198 52" opacity="0.7" />
      <path d="M 191 46 Q 194 50, 196 54" opacity="0.65" />
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
      viewBox="0 0 200 110"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Body + forked caudal fin — humped back, flat belly. The body
          arches up over the back and runs flat along the belly, with
          the head ending in a blunt rounded snout. */}
      <path d="
        M 14 36
        L 36 64
        C 40 24, 100 18, 156 28
        C 174 32, 188 42, 194 56
        C 194 66, 188 76, 176 80
        L 38 80
        L 14 88
        L 26 62
        Z
      " />

      {/* Flat-belly emphasis line */}
      <path d="M 38 80 L 176 80" opacity="0.35" />

      {/* Tall triangular dorsal fin — the cory's banner */}
      <path d="M 70 22 L 86 2 L 100 22 Z" />

      {/* Adipose fin — small triangular bump behind the dorsal */}
      <path d="M 124 22 L 132 12 L 138 22 Z" />

      {/* Pectoral fin — large, set low and forward */}
      <path d="M 152 80 L 168 102 L 174 82 Z" />

      {/* Pelvic fin */}
      <path d="M 106 80 L 116 96 L 124 80 Z" opacity="0.85" />

      {/* Bony plate suggestion — corys have armored side plates */}
      <path d="M 60 30 C 58 50, 58 65, 60 80" opacity="0.32" />
      <path d="M 90 24 C 88 50, 88 68, 90 80" opacity="0.32" />
      <path d="M 124 24 C 122 50, 122 68, 124 80" opacity="0.32" />
      <path d="M 154 28 C 152 50, 152 65, 154 80" opacity="0.32" />

      {/* Eye — set high on the head */}
      <circle cx="172" cy="42" r="3.5" />
      <circle cx="172" cy="42" r="1.5" fill="currentColor" />

      {/* Mouth — downturned at the front of the snout */}
      <path d="M 188 58 Q 192 64, 188 70" opacity="0.7" />

      {/* Barbels — four whiskers fanning out from the mouth */}
      <path d="M 186 64 Q 194 66, 200 68" opacity="0.7" />
      <path d="M 184 66 Q 192 70, 199 72" opacity="0.7" />
      <path d="M 184 68 Q 190 74, 195 78" opacity="0.65" />
      <path d="M 184 70 Q 188 76, 192 82" opacity="0.6" />
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
      viewBox="0 0 200 110"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Body — small ovoid sitting on the right side of the canvas,
          leaving room for the dramatic fan tail to flare out left. */}
      <path d="
        M 74 55
        C 84 30, 140 26, 168 34
        C 184 38, 192 46, 196 55
        C 192 64, 184 72, 168 76
        C 140 84, 84 80, 74 55
        Z
      " />

      {/* Fan tail — wide flowing flag from the caudal peduncle. Drawn
          as a single rounded fan shape that arches above and below the
          body's vertical centre. */}
      <path d="
        M 74 55
        L 22 14
        Q 8 28, 4 50
        L 22 55
        L 4 60
        Q 8 82, 22 96
        L 74 55
        Z
      " />

      {/* Tail rays — subtle radiating lines from the caudal peduncle */}
      <path d="M 74 55 L 24 20" opacity="0.45" />
      <path d="M 74 55 L 14 32" opacity="0.45" />
      <path d="M 74 55 L 6 45" opacity="0.45" />
      <path d="M 74 55 L 6 65" opacity="0.45" />
      <path d="M 74 55 L 14 78" opacity="0.45" />
      <path d="M 74 55 L 24 90" opacity="0.45" />

      {/* Dorsal fin — small triangular fin on the back */}
      <path d="M 112 28 Q 122 12, 138 22 L 134 30 Q 122 30, 112 28 Z" />

      {/* Anal fin / gonopodium — the male livebearer's pointed fin */}
      <path d="M 124 76 L 134 92 L 134 78 Z" opacity="0.9" />

      {/* Pectoral fin */}
      <path d="M 152 64 Q 144 76, 132 76 L 144 64 Z" opacity="0.75" />

      {/* Operculum */}
      <path d="M 158 38 C 156 55, 156 55, 158 72" opacity="0.55" />

      {/* Eye — large and forward */}
      <circle cx="172" cy="48" r="4" />
      <circle cx="172" cy="48" r="1.8" fill="currentColor" />

      {/* Mouth */}
      <path d="M 194 53 L 197 52" />

      {/* Lateral spot — characteristic of Endler's male body */}
      <circle cx="124" cy="56" r="2.2" opacity="0.4" />
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
  guppy: "livebearer",
  platy: "livebearer",
  "sailfin-molly": "livebearer",
  swordtail: "livebearer",

  // Slim cyprinids / characins from the SA-hobby additions
  "zebra-danio": "slim",
  "black-skirt-tetra": "slim",
  "red-tail-shark": "slim",

  // Stocky community fish
  "tiger-barb": "stocky",

  // Catfish family
  "bronze-corydoras": "catfish",

  // Laterally compressed
  angelfish: "gourami",
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
