import * as React from "react";

/* ─── Category marks ─────────────────────────────────────────────────────
   Compact silhouettes for the four catalogue pillars — used as the
   identity glyph in eyebrow rows, profile cards, hero pills, the
   Livestock dropdown, and planner chips.

   These render the branded PNG icons in /public via `mask-image`, so
   the PNG's alpha channel becomes the silhouette and `currentColor`
   from the parent paints the fill. That preserves the
   `text-[var(--brand)]` tinting convention every consumer already uses
   (className-only contract) without forcing each PNG to ship in a
   pre-tinted colour.

   Designed to read cleanly at 16–32px against either cream or dark
   surfaces.
   ────────────────────────────────────────────────────────────────────── */

/**
 * Props accepted by the smaller `CATEGORY_MARK` mask icons.
 * Span-based because they render via mask-image.
 */
type MarkProps = React.HTMLAttributes<HTMLSpanElement>;

/**
 * Props accepted by the larger scientific-plate SVG icons further down
 * in this file. SVG-based — kept unchanged so all the plate components
 * (FishPlate, PlantPlateRosette, …) compile against the original signature.
 */
type IconProps = React.SVGProps<SVGSVGElement>;

/** Shared base styles for every PNG-masked category icon. */
const MARK_BASE_CLASS =
  "inline-block shrink-0 align-middle bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain]";

function mergeClass(className: string | undefined, extra: string): string {
  return className ? `${extra} ${className}` : extra;
}

/**
 * Render a category mark by masking the given PNG with `currentColor`.
 * The alpha channel of the PNG becomes the silhouette; the parent's
 * text colour paints the silhouette.
 */
function MaskIcon({
  src,
  className,
  style,
  ...rest
}: MarkProps & { src: string }) {
  return (
    <span
      aria-hidden
      role="img"
      className={mergeClass(className, MARK_BASE_CLASS)}
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        ...style,
      }}
      {...rest}
    />
  );
}

/** Fish silhouette mark (line-art PNG, /fish.png). */
export function FishMark(props: MarkProps) {
  return <MaskIcon src="/fish.png" {...props} />;
}

/** Plant silhouette mark — twin-leaf line-art PNG (/leaf.png). */
export function PlantMark(props: MarkProps) {
  return <MaskIcon src="/leaf.png" {...props} />;
}

/** Shrimp silhouette mark (line-art PNG, /shrimp.png). */
export function ShrimpMark(props: MarkProps) {
  return <MaskIcon src="/shrimp.png" {...props} />;
}

/** Moss silhouette mark — clustered fronds line-art PNG (/grass.png). */
export function MossMark(props: MarkProps) {
  return <MaskIcon src="/grass.png" {...props} />;
}

/**
 * Snail silhouette mark — inline SVG spiral shell + slug body. Drawn
 * directly rather than via PNG mask because we don't have a /snail.png
 * asset; SVG with `currentColor` fill gives us the same parent-tinted
 * behaviour as the masked PNGs.
 */
export function SnailMark({ className, ...rest }: MarkProps) {
  return (
    <span
      aria-hidden
      role="img"
      className={mergeClass(
        className,
        "inline-block shrink-0 align-middle text-current",
      )}
      {...rest}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-full"
      >
        {/* Slug body — gentle arch resting on a baseline */}
        <path d="M 2.5 18 Q 3 14 6 13.5 L 17 13.5 Q 22 13.5 22 18 L 2.5 18 Z" />
        {/* Antennae */}
        <path d="M 4 13.5 L 3 10" />
        <path d="M 5.5 13.5 L 5 10.5" />
        {/* Shell — spiral coil */}
        <circle cx="14" cy="11" r="5.5" />
        <path d="M 14 11 m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0" />
        <path d="M 14 11 m -1 0 a 1 1 0 1 0 2 0 a 1 1 0 1 0 -2 0" />
      </svg>
    </span>
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
 * Tetra-style fish plate — slim torpedo body with engraved hatching
 * along the shaded back, lateral-line dash, ray-detailed forked tail.
 * The default silhouette beside any fish detail page hero.
 */
export function FishPlate(props: IconProps) {
  return (
    <svg
      viewBox="0 0 240 110"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Body — slim fusiform tapering into the caudal peduncle */}
      <path d="
        M 56 38
        C 80 18, 152 12, 200 24
        C 222 30, 234 40, 236 55
        C 234 70, 222 80, 200 86
        C 152 98, 80 92, 56 72
        Z
      " />

      {/* Caudal peduncle → forked tail. Drawn as a separate triangle pair
          so the fork V can sit cleanly inside the silhouette. */}
      <path d="M 56 38 L 14 12 L 30 55 L 14 98 L 56 72" />
      <g opacity="0.5">
        <path d="M 50 40 L 22 22" />
        <path d="M 44 48 L 18 34" />
        <path d="M 42 55 L 14 55" />
        <path d="M 44 64 L 18 76" />
        <path d="M 50 72 L 22 90" />
      </g>

      {/* Dorsal fin — flag set at body midpoint, with ray detail */}
      <path d="M 122 18 C 136 6, 156 6, 164 20 L 156 26 Q 138 24, 122 20 Z" />
      <g opacity="0.5">
        <path d="M 128 24 L 130 12" />
        <path d="M 138 24 L 138 8" />
        <path d="M 148 24 L 148 10" />
        <path d="M 156 24 L 156 18" />
      </g>

      {/* Pectoral fin — behind the operculum */}
      <path d="M 186 62 Q 176 80, 158 78 L 176 62 Z" />

      {/* Pelvic fin — small, on the belly mid-way back */}
      <path d="M 142 72 Q 134 86, 122 82 L 134 70 Z" opacity="0.85" />

      {/* Anal fin */}
      <path d="M 100 76 Q 90 92, 74 84 L 96 70 Z" opacity="0.85" />

      {/* Operculum (gill cover) */}
      <path d="M 200 32 C 198 50, 198 60, 200 80" opacity="0.5" />

      {/* Engraving hatching — parallel strokes along the shaded back */}
      <g opacity="0.22">
        <path d="M 80 26 L 96 22" />
        <path d="M 102 22 L 118 20" />
        <path d="M 124 20 L 142 18" />
        <path d="M 148 18 L 166 20" />
        <path d="M 172 20 L 188 24" />
        <path d="M 92 32 L 108 28" />
        <path d="M 114 28 L 132 26" />
        <path d="M 138 26 L 156 26" />
        <path d="M 162 26 L 178 28" />
      </g>

      {/* Lateral stripe — tetra / rasbora signature */}
      <path
        d="M 56 55 L 198 53"
        opacity="0.55"
        strokeDasharray="1 2.5"
      />

      {/* Eye — outline + filled pupil */}
      <circle cx="214" cy="46" r="4.5" />
      <circle cx="214" cy="46" r="2.2" fill="currentColor" />

      {/* Mouth */}
      <path d="M 234 53 L 237.5 53" />
    </svg>
  );
}

/**
 * Aquatic stem plate — substrate stippled with grain, gently curving
 * central stem, alternating leaves at four levels with central veins,
 * a small leaf bud at the apex. Drawn outline-only for a botanical-
 * plate feel.
 */
export function PlantPlate(props: IconProps) {
  return (
    <svg
      viewBox="0 0 120 170"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Substrate line */}
      <path d="M8 152 L 112 152" opacity="0.7" />
      {/* Substrate stipple — tiny round grains */}
      <g opacity="0.5" fill="currentColor" stroke="none">
        <circle cx="18" cy="156" r="0.7" />
        <circle cx="28" cy="158" r="0.6" />
        <circle cx="40" cy="156" r="0.7" />
        <circle cx="52" cy="158" r="0.6" />
        <circle cx="72" cy="158" r="0.7" />
        <circle cx="86" cy="156" r="0.6" />
        <circle cx="98" cy="158" r="0.7" />
        <circle cx="108" cy="156" r="0.6" />
      </g>
      {/* Roots — three fine tapered strokes below the substrate */}
      <g opacity="0.6">
        <path d="M58 152 Q 54 158, 52 168" />
        <path d="M60 152 L 60 170" />
        <path d="M62 152 Q 66 158, 68 168" />
      </g>

      {/* Main stem — gentle S-curve rather than ruler-straight */}
      <path d="M60 152 Q 58 110, 62 70 Q 60 36, 60 18" />

      {/* Lower leaf pair — large lanceolate */}
      <path d="M60 134 C 36 130, 20 118, 10 96 C 26 98, 44 116, 60 128 Z" />
      <path d="M60 134 C 84 130, 100 118, 110 96 C 94 98, 76 116, 60 128 Z" />
      <g opacity="0.45">
        <path d="M58 130 Q 38 120, 18 100" />
        <path d="M62 130 Q 82 120, 102 100" />
      </g>

      {/* Mid-low leaves */}
      <path d="M60 110 C 38 104, 24 92, 18 70 C 32 74, 48 88, 60 104 Z" />
      <path d="M60 110 C 82 104, 96 92, 102 70 C 88 74, 72 88, 60 104 Z" />
      <g opacity="0.45">
        <path d="M58 106 Q 40 96, 24 76" />
        <path d="M62 106 Q 80 96, 96 76" />
      </g>

      {/* Mid-high leaves */}
      <path d="M60 84 C 42 78, 30 66, 26 48 C 38 52, 50 64, 60 78 Z" />
      <path d="M60 84 C 78 78, 90 66, 94 48 C 82 52, 70 64, 60 78 Z" />
      <g opacity="0.45">
        <path d="M58 80 Q 44 70, 30 54" />
        <path d="M62 80 Q 76 70, 90 54" />
      </g>

      {/* Small upper leaves */}
      <path d="M60 60 C 46 56, 38 48, 38 36 C 48 38, 56 48, 60 56 Z" />
      <path d="M60 60 C 74 56, 82 48, 82 36 C 72 38, 64 48, 60 56 Z" />

      {/* Top bud — small filled teardrop */}
      <path
        d="M60 30 Q 66 22, 60 14 Q 54 22, 60 30 Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

/**
 * Shrimp plate — proper carcinological view. Distinct cephalothorax
 * with a forward-pointing rostrum, segmented pleon (abdomen),
 * pereiopods (walking legs) along the thorax, pleopods (swimmerets)
 * along the abdomen, telson + uropod tail fan, and a pair of long
 * antennae trailing forward.
 */
export function ShrimpPlate(props: IconProps) {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Body outline — gentle banana curve. Drawn so the cephalothorax
          sits at the right with the tail fan at the left. */}
      <path d="
        M 36 76
        Q 22 62, 32 44
        Q 52 28, 90 30
        Q 130 32, 156 38
        Q 170 42, 168 56
        Q 166 74, 150 82
        Q 110 92, 70 90
        Q 46 88, 36 76
        Z
      " />

      {/* Cephalothorax / abdomen division */}
      <path d="M 116 32 Q 122 56, 116 84" opacity="0.6" />

      {/* Abdomen segments — six slim arcs */}
      <g opacity="0.55">
        <path d="M 50 38 Q 52 60, 58 84" />
        <path d="M 64 32 Q 66 60, 72 88" />
        <path d="M 80 30 Q 82 60, 88 90" />
        <path d="M 96 30 Q 98 60, 104 90" />
        <path d="M 112 30 Q 114 60, 118 88" />
      </g>

      {/* Carapace shading — fine hatching along the upper back */}
      <g opacity="0.22">
        <path d="M 50 38 L 60 36" />
        <path d="M 66 34 L 78 32" />
        <path d="M 84 32 L 96 30" />
        <path d="M 102 30 L 116 30" />
        <path d="M 122 32 L 134 34" />
        <path d="M 140 36 L 152 40" />
      </g>

      {/* Rostrum — saw-edged spike projecting forward */}
      <path d="M 156 40 L 188 36" />
      <path d="M 188 36 L 156 44" opacity="0.7" />
      <g opacity="0.55">
        <path d="M 164 38 L 166 36" />
        <path d="M 172 37 L 174 35" />
        <path d="M 180 37 L 182 35" />
      </g>

      {/* Eye — on a short stalk */}
      <path d="M 152 46 L 156 50" opacity="0.7" />
      <circle cx="158" cy="50" r="2.6" />
      <circle cx="158" cy="50" r="1.1" fill="currentColor" />

      {/* Antennae — one long primary, one shorter antennule, both
          sweeping forward and curling at the tips */}
      <path d="M 160 42 Q 180 28, 196 14" />
      <path d="M 158 46 Q 178 36, 198 28" opacity="0.85" />
      <path d="M 154 50 Q 170 52, 184 50" opacity="0.6" />

      {/* Pereiopods — five pairs of walking legs from the thorax */}
      <g opacity="0.75">
        <path d="M 120 84 L 118 106" />
        <path d="M 130 86 L 132 108" />
        <path d="M 140 84 L 144 106" />
        <path d="M 148 80 L 154 102" />
        <path d="M 154 76 L 162 96" />
      </g>

      {/* Pleopods — swimmerets along the abdomen */}
      <g opacity="0.55">
        <path d="M 56 84 L 54 98" />
        <path d="M 68 88 L 66 102" />
        <path d="M 80 90 L 80 104" />
        <path d="M 92 90 L 94 104" />
        <path d="M 104 88 L 106 102" />
      </g>

      {/* Tail fan — telson (centre) with uropod blades flaring out */}
      <path d="M 36 76 L 14 90" />
      <path d="M 32 64 L 8 68" />
      <path d="M 36 52 L 14 36" />
      <path
        d="M 36 76 Q 22 86, 14 90 Q 6 78, 8 68 Q 8 54, 14 36"
        opacity="0.45"
      />
      <path d="M 24 68 L 18 62" opacity="0.5" />
      <path d="M 24 72 L 18 78" opacity="0.5" />
    </svg>
  );
}

/**
 * Moss plate — a soft dome cluster of branching fronds rising from a
 * stippled substrate. Fronds vary in height and lean direction so the
 * cluster reads naturally rather than as a comb. Each frond carries
 * three pairs of upturned branchlets and a soft tip drop.
 */
export function MossPlate(props: IconProps) {
  // Each frond: x position, height, slight lean (-1 → +1), and tilt
  // for the tip droop.
  const fronds: Array<{ x: number; h: number; lean: number }> = [
    { x: 14, h: 26, lean: -0.3 },
    { x: 26, h: 40, lean: -0.4 },
    { x: 38, h: 52, lean: -0.2 },
    { x: 50, h: 60, lean: -0.1 },
    { x: 62, h: 68, lean: 0.05 },
    { x: 74, h: 74, lean: 0.1 },
    { x: 86, h: 70, lean: 0.15 },
    { x: 98, h: 62, lean: 0.2 },
    { x: 110, h: 54, lean: 0.25 },
    { x: 122, h: 44, lean: 0.3 },
    { x: 134, h: 34, lean: 0.35 },
    { x: 146, h: 22, lean: 0.4 },
  ];
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Substrate line */}
      <path d="M6 96 L 154 96" opacity="0.7" />
      {/* Substrate stipple */}
      <g opacity="0.5" fill="currentColor" stroke="none">
        <circle cx="14" cy="100" r="0.6" />
        <circle cx="26" cy="102" r="0.7" />
        <circle cx="40" cy="100" r="0.6" />
        <circle cx="54" cy="102" r="0.7" />
        <circle cx="68" cy="100" r="0.6" />
        <circle cx="84" cy="102" r="0.7" />
        <circle cx="100" cy="100" r="0.6" />
        <circle cx="116" cy="102" r="0.7" />
        <circle cx="130" cy="100" r="0.6" />
        <circle cx="144" cy="102" r="0.6" />
      </g>

      {fronds.map(({ x, h, lean }, i) => {
        const tipX = x + lean * h * 0.45;
        const tipY = 96 - h;
        return (
          <g key={i}>
            {/* Stem — curves slightly in the direction of the lean */}
            <path
              d={`M${x} 96 Q ${x + lean * h * 0.18} ${96 - h * 0.55}, ${tipX} ${tipY}`}
            />
            {/* Three pairs of upturned branchlets */}
            {[0.28, 0.55, 0.82].map((t, j) => {
              const px = x + lean * h * 0.45 * t;
              const py = 96 - h * t;
              const len = 4 + (1 - t) * 2;
              return (
                <g key={j} opacity={0.85 - t * 0.1}>
                  <path
                    d={`M${px - len} ${py + 2} Q ${px} ${py - 1}, ${px + len} ${py + 2}`}
                  />
                </g>
              );
            })}
            {/* Tip droop — small curve at the apex */}
            <path
              d={`M${tipX} ${tipY} q 1 -1.4, ${lean * 2 + 0.2} -2.5`}
              opacity="0.7"
            />
          </g>
        );
      })}

      {/* Faint cluster halo — broad arc behind the dome to give the
          mass a soft outer silhouette */}
      <path
        d="M 8 96 Q 30 56, 78 24 Q 124 50, 152 96"
        opacity="0.18"
        strokeDasharray="2 3"
      />
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
 * Stocky / barb body — deep-bodied perciform. Almond profile, tall
 * dorsal and anal fins, three faint vertical bars suggesting barb /
 * dwarf-cichlid markings. Suits cherry barbs, rams, apistogrammas,
 * dwarf puffers.
 */
export function FishPlateStocky(props: IconProps) {
  return (
    <svg
      viewBox="0 0 240 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Body — deep almond */}
      <path d="
        M 60 36
        C 78 14, 152 8, 200 22
        C 222 30, 234 42, 236 60
        C 234 78, 222 90, 200 98
        C 152 112, 78 106, 60 84
        Z
      " />

      {/* Caudal peduncle → squarish tail */}
      <path d="M 60 36 L 14 16 L 28 60 L 14 104 L 60 84" />
      <g opacity="0.5">
        <path d="M 50 40 L 22 24" />
        <path d="M 44 50 L 18 36" />
        <path d="M 42 60 L 14 60" />
        <path d="M 44 70 L 18 84" />
        <path d="M 50 80 L 22 96" />
      </g>

      {/* Dorsal — tall, slightly forward-leaning */}
      <path d="M 110 16 C 128 0, 156 0, 168 18 L 158 26 Q 134 24, 110 20 Z" />
      <g opacity="0.5">
        <path d="M 118 24 L 120 8" />
        <path d="M 130 24 L 130 4" />
        <path d="M 142 24 L 142 4" />
        <path d="M 154 24 L 154 6" />
        <path d="M 164 24 L 164 14" />
      </g>

      {/* Anal — mirror of dorsal */}
      <path d="M 110 102 C 128 116, 156 116, 168 102 L 158 94 Q 134 96, 110 98 Z" />
      <g opacity="0.5">
        <path d="M 118 96 L 120 110" />
        <path d="M 130 96 L 130 114" />
        <path d="M 142 96 L 142 114" />
        <path d="M 154 96 L 154 112" />
      </g>

      {/* Pectoral fin */}
      <path d="M 184 66 Q 174 84, 156 84 L 174 64 Z" />

      {/* Pelvic fin */}
      <path d="M 142 82 Q 136 96, 122 92 L 134 80 Z" opacity="0.85" />

      {/* Operculum */}
      <path d="M 200 34 C 198 56, 198 64, 200 86" opacity="0.55" />

      {/* Engraving hatching along the upper flank */}
      <g opacity="0.2">
        <path d="M 72 30 L 88 26" />
        <path d="M 92 26 L 108 22" />
        <path d="M 116 22 L 132 20" />
        <path d="M 138 20 L 154 22" />
        <path d="M 160 22 L 178 24" />
        <path d="M 184 26 L 198 30" />
      </g>

      {/* Vertical bars — barb / cichlid signature */}
      <path d="M 88 26 C 86 60, 86 70, 88 96" opacity="0.3" />
      <path d="M 122 20 C 120 60, 120 70, 122 100" opacity="0.3" />
      <path d="M 156 22 C 154 60, 154 70, 156 98" opacity="0.3" />

      {/* Eye */}
      <circle cx="214" cy="48" r="5" />
      <circle cx="214" cy="48" r="2.4" fill="currentColor" />

      {/* Mouth — slightly upturned */}
      <path d="M 234 58 L 237.5 56" />
    </svg>
  );
}

/**
 * Gourami / labyrinth fish — laterally compressed disk-body. Long
 * dorsal + anal fins spanning the back and belly, plus the gourami
 * signature: long thread-like ventral filaments trailing below. Also
 * covers angelfish thanks to the deep disk profile.
 */
export function FishPlateGourami(props: IconProps) {
  return (
    <svg
      viewBox="0 0 240 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Body — very deep oval */}
      <path d="
        M 70 40
        C 86 14, 154 8, 200 22
        C 222 32, 234 46, 236 66
        C 234 86, 222 100, 200 110
        C 154 124, 86 118, 70 92
        Z
      " />

      {/* Caudal peduncle → rounded fan */}
      <path d="M 70 60 L 30 36 L 38 66 L 30 96 L 70 72" />
      <g opacity="0.5">
        <path d="M 58 50 L 34 38" />
        <path d="M 50 58 L 32 50" />
        <path d="M 48 66 L 30 66" />
        <path d="M 50 74 L 32 82" />
        <path d="M 58 82 L 34 94" />
      </g>

      {/* Long dorsal — spans most of the back */}
      <path d="M 86 18 C 116 -2, 184 2, 204 22 C 184 30, 130 32, 86 24 Z" />
      <g opacity="0.5">
        <path d="M 104 26 L 106 6" />
        <path d="M 124 26 L 124 0" />
        <path d="M 146 26 L 146 0" />
        <path d="M 168 26 L 168 4" />
        <path d="M 188 26 L 188 12" />
      </g>

      {/* Long anal — mirrors the dorsal */}
      <path d="M 86 110 C 116 130, 184 126, 204 108 C 184 100, 130 102, 86 104 Z" />
      <g opacity="0.5">
        <path d="M 104 102 L 106 124" />
        <path d="M 124 102 L 124 130" />
        <path d="M 146 102 L 146 130" />
        <path d="M 168 102 L 168 126" />
      </g>

      {/* Thread ventrals — the gourami signature */}
      <path
        d="M 122 102 Q 110 128, 90 156"
        strokeWidth="1.4"
        opacity="0.95"
      />
      <path
        d="M 132 102 Q 128 130, 110 158"
        strokeWidth="1.4"
        opacity="0.8"
      />

      {/* Pectoral fin */}
      <path d="M 184 78 Q 174 92, 158 90 L 174 76 Z" opacity="0.8" />

      {/* Operculum */}
      <path d="M 200 32 C 198 66, 198 70, 200 102" opacity="0.55" />

      {/* Engraving hatching */}
      <g opacity="0.2">
        <path d="M 88 32 L 104 26" />
        <path d="M 110 26 L 130 22" />
        <path d="M 138 22 L 158 22" />
        <path d="M 164 22 L 184 24" />
        <path d="M 190 26 L 204 32" />
      </g>

      {/* Pearl-spot — characteristic of pearl gouramis */}
      <circle cx="132" cy="68" r="3.2" opacity="0.4" />

      {/* Eye */}
      <circle cx="214" cy="52" r="4.5" />
      <circle cx="214" cy="52" r="2.2" fill="currentColor" />

      {/* Mouth — small terminal */}
      <path d="M 234 62 L 237.5 61" />
    </svg>
  );
}

/**
 * Eel / loach body — elongated S-shaped tube with a tiny caudal fan,
 * subtle dorsal fin, kuhli-style saddle bars, and four short head
 * barbels. Suits kuhli loaches and similar long-bodied burrowers.
 */
export function FishPlateEel(props: IconProps) {
  return (
    <svg
      viewBox="0 0 240 90"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Elongated body — gentle S-curve from caudal fan (left) to head
          (right). Upper and lower edges drawn as parallel curves. */}
      <path d="
        M 14 42
        Q 24 32, 56 38
        Q 92 50, 130 38
        Q 166 22, 196 26
        Q 220 30, 232 40
        Q 236 44, 236 46
        Q 236 48, 232 52
        Q 220 60, 196 64
        Q 166 70, 130 60
        Q 92 58, 56 50
        Q 24 54, 14 48
        Z
      " />

      {/* Caudal fan — small rounded tail */}
      <path d="M 14 42 Q 4 32, 4 45 Q 4 58, 14 48" />
      <g opacity="0.5">
        <path d="M 10 38 L 6 36" />
        <path d="M 8 45 L 4 45" />
        <path d="M 10 52 L 6 54" />
      </g>

      {/* Saddle bars — kuhli-loach signature, soft elliptical saddles
          across the dorsum (drawn at varying widths so they read as a
          natural band pattern). */}
      <g opacity="0.42" fill="currentColor" stroke="none">
        <ellipse cx="46" cy="42" rx="3" ry="6" />
        <ellipse cx="76" cy="48" rx="3" ry="6" />
        <ellipse cx="106" cy="48" rx="3" ry="6" />
        <ellipse cx="138" cy="42" rx="3" ry="6" />
        <ellipse cx="170" cy="32" rx="3" ry="6" />
        <ellipse cx="200" cy="30" rx="3" ry="6" />
      </g>

      {/* Tiny dorsal fin — barely a bump halfway along */}
      <path d="M 102 38 Q 112 30, 124 38" opacity="0.65" />
      <g opacity="0.45">
        <path d="M 108 36 L 108 32" />
        <path d="M 114 34 L 114 30" />
        <path d="M 120 36 L 120 33" />
      </g>

      {/* Lateral line — fine dashed dorsal-ventral midline */}
      <path
        d="M 14 45 Q 60 44, 100 47 Q 160 42, 232 44"
        opacity="0.35"
        strokeDasharray="1 3"
      />

      {/* Eye — set high on the head */}
      <circle cx="222" cy="36" r="2.6" />
      <circle cx="222" cy="36" r="1.1" fill="currentColor" />

      {/* Mouth + four short barbels */}
      <path d="M 235 46 L 238 45" />
      <path d="M 235 48 Q 240 51, 240 55" opacity="0.7" />
      <path d="M 233 49 Q 238 52, 238 56" opacity="0.7" />
      <path d="M 231 50 Q 235 54, 236 58" opacity="0.65" />
      <path d="M 229 51 Q 232 55, 233 59" opacity="0.6" />
    </svg>
  );
}

/**
 * Catfish / bottom dweller — humped back, flat belly, tall dorsal
 * banner, adipose fin, large low-set pectorals, downturned barbeled
 * mouth, and bony lateral plates. Suits corydoras, otocinclus, plecos,
 * hillstream loaches.
 */
export function FishPlateCatfish(props: IconProps) {
  return (
    <svg
      viewBox="0 0 240 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Body — arched back over a flat belly */}
      <path d="
        M 58 40
        C 64 16, 132 8, 192 22
        C 214 28, 230 38, 234 56
        C 234 68, 224 78, 208 82
        L 56 82
        Z
      " />

      {/* Caudal peduncle → forked tail */}
      <path d="M 56 40 L 14 14 L 28 60 L 14 102 L 56 82" />
      <g opacity="0.5">
        <path d="M 48 42 L 22 24" />
        <path d="M 42 52 L 18 38" />
        <path d="M 42 60 L 14 60" />
        <path d="M 42 70 L 18 82" />
        <path d="M 48 80 L 22 96" />
      </g>

      {/* Flat-belly emphasis line */}
      <path d="M 56 82 L 208 82" opacity="0.4" />

      {/* Tall triangular dorsal — the cory banner */}
      <path d="M 100 20 L 122 -2 L 142 20 Z" />
      <g opacity="0.5">
        <path d="M 108 18 L 112 4" />
        <path d="M 118 18 L 122 0" />
        <path d="M 128 18 L 132 4" />
        <path d="M 138 18 L 136 8" />
      </g>

      {/* Adipose fin — small bump behind the dorsal */}
      <path d="M 162 22 L 172 10 L 180 22 Z" />

      {/* Pectoral fin — large, low and forward */}
      <path d="M 188 82 L 208 110 L 218 84 Z" />
      <g opacity="0.5">
        <path d="M 196 88 L 202 104" />
        <path d="M 204 88 L 208 106" />
        <path d="M 212 86 L 212 100" />
      </g>

      {/* Pelvic fin */}
      <path d="M 132 82 L 144 100 L 152 82 Z" opacity="0.85" />

      {/* Bony lateral plates — cory armor suggestion */}
      <g opacity="0.32">
        <path d="M 88 28 C 86 54, 86 70, 88 82" />
        <path d="M 124 22 C 122 54, 122 70, 124 82" />
        <path d="M 160 22 C 158 54, 158 70, 160 82" />
        <path d="M 192 26 C 190 54, 190 70, 192 82" />
      </g>

      {/* Engraving hatching on the back */}
      <g opacity="0.2">
        <path d="M 72 36 L 88 30" />
        <path d="M 92 28 L 110 24" />
        <path d="M 116 22 L 134 22" />
        <path d="M 142 22 L 160 24" />
        <path d="M 166 24 L 186 28" />
        <path d="M 192 30 L 210 36" />
      </g>

      {/* Eye — set high on the head */}
      <circle cx="210" cy="44" r="3.8" />
      <circle cx="210" cy="44" r="1.7" fill="currentColor" />

      {/* Mouth — downturned */}
      <path d="M 228 60 Q 234 66, 228 72" opacity="0.75" />

      {/* Barbels — four whiskers from the mouth */}
      <path d="M 226 64 Q 236 66, 240 68" opacity="0.7" />
      <path d="M 224 67 Q 234 71, 238 74" opacity="0.7" />
      <path d="M 224 70 Q 232 76, 236 80" opacity="0.65" />
      <path d="M 224 73 Q 230 78, 233 84" opacity="0.6" />
    </svg>
  );
}

/**
 * Livebearer — small ovoid body with a dramatic flowing fan tail.
 * Modest dorsal, pointed gonopodium (male anal fin), lateral spot.
 * Suits Endler's, guppies, mollies, platys, swordtails.
 */
export function FishPlateLivebearer(props: IconProps) {
  return (
    <svg
      viewBox="0 0 240 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Body — compact ovoid on the right side of the canvas */}
      <path d="
        M 100 60
        C 112 32, 168 28, 200 36
        C 222 42, 234 52, 236 60
        C 234 70, 222 80, 200 86
        C 168 94, 112 90, 100 60
        Z
      " />

      {/* Fan tail — drawn as a flag arching above and below the
          peduncle, with internal ray detail */}
      <path d="
        M 100 60
        Q 64 22, 30 14
        Q 16 28, 10 56
        L 30 60
        L 10 64
        Q 16 92, 30 106
        Q 64 98, 100 60
        Z
      " />
      <g opacity="0.5">
        <path d="M 100 60 L 34 18" />
        <path d="M 100 60 L 18 30" />
        <path d="M 100 60 L 10 46" />
        <path d="M 100 60 L 10 60" />
        <path d="M 100 60 L 10 74" />
        <path d="M 100 60 L 18 90" />
        <path d="M 100 60 L 34 102" />
      </g>

      {/* Dorsal fin — small banner */}
      <path d="M 140 30 Q 152 14, 168 22 L 164 32 Q 150 32, 140 30 Z" />
      <g opacity="0.45">
        <path d="M 148 30 L 150 18" />
        <path d="M 158 30 L 160 18" />
      </g>

      {/* Gonopodium — pointed male anal fin */}
      <path d="M 152 86 L 158 104 L 164 88 Z" opacity="0.9" />

      {/* Pectoral fin */}
      <path d="M 184 70 Q 174 82, 158 82 L 174 68 Z" opacity="0.8" />

      {/* Operculum */}
      <path d="M 200 44 C 198 60, 198 62, 200 78" opacity="0.55" />

      {/* Lateral spot — Endler / guppy male marking */}
      <circle cx="156" cy="62" r="2.6" opacity="0.45" />

      {/* Engraving hatching on the upper flank */}
      <g opacity="0.2">
        <path d="M 116 38 L 132 32" />
        <path d="M 140 32 L 156 30" />
        <path d="M 164 30 L 180 30" />
        <path d="M 188 32 L 204 34" />
      </g>

      {/* Eye — large, forward */}
      <circle cx="214" cy="52" r="4" />
      <circle cx="214" cy="52" r="1.9" fill="currentColor" />

      {/* Mouth */}
      <path d="M 234 58 L 237.5 57" />
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

/** Rosette — broad ovate leaves radiating outward from a central crown.
 *  Suits Echinodorus, Cryptocoryne, Aponogeton, and other plants that
 *  spread from a single basal point. */
export function PlantPlateRosette(props: IconProps) {
  return (
    <svg
      viewBox="0 0 140 170"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Substrate */}
      <path d="M14 154 L 126 154" opacity="0.7" />
      <g opacity="0.5" fill="currentColor" stroke="none">
        <circle cx="22" cy="158" r="0.7" />
        <circle cx="36" cy="160" r="0.6" />
        <circle cx="52" cy="158" r="0.7" />
        <circle cx="86" cy="158" r="0.7" />
        <circle cx="100" cy="160" r="0.6" />
        <circle cx="116" cy="158" r="0.7" />
      </g>

      {/* Roots — three fine tapered strokes */}
      <g opacity="0.6">
        <path d="M68 154 Q 64 162, 60 170" />
        <path d="M70 154 L 70 170" />
        <path d="M72 154 Q 76 162, 80 170" />
      </g>

      {/* Crown — small filled mound at the base */}
      <path d="M58 146 Q 70 152, 82 146 Q 76 152, 70 154 Q 64 152, 58 146 Z" />

      {/* Leaves radiating outward — five blades, each with central
          midrib. Drawn closed so they read as broad ovate leaves. */}
      {/* Far left */}
      <path d="M70 148 C 30 134, 16 102, 12 60 C 28 76, 50 110, 70 140 Z" />
      <path d="M18 90 Q 38 102, 60 130" opacity="0.42" />
      {/* Left mid */}
      <path d="M70 148 C 42 100, 38 50, 44 12 C 56 44, 64 90, 70 138 Z" />
      <path d="M44 38 Q 52 80, 64 130" opacity="0.42" />
      {/* Centre upright */}
      <path d="M70 148 C 64 90, 66 38, 70 6 C 74 38, 76 90, 70 148 Z" />
      <path d="M70 16 L 70 142" opacity="0.4" />
      {/* Right mid */}
      <path d="M70 148 C 98 100, 102 50, 96 12 C 84 44, 76 90, 70 138 Z" />
      <path d="M96 38 Q 88 80, 76 130" opacity="0.42" />
      {/* Far right */}
      <path d="M70 148 C 110 134, 124 102, 128 60 C 112 76, 90 110, 70 140 Z" />
      <path d="M122 90 Q 102 102, 80 130" opacity="0.42" />
    </svg>
  );
}

/**
 * Rhizome epiphyte — a creeping horizontal rhizome sitting atop a
 * piece of hardscape, with broad upright leaves rising from it at
 * intervals. Holdfast roots grip the rock. Suits anubias, java fern,
 * bucephalandra, bolbitis.
 */
export function PlantPlateRhizome(props: IconProps) {
  return (
    <svg
      viewBox="0 0 140 170"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Hardscape rock — irregular hump along the bottom */}
      <path d="M6 148 Q 28 124, 50 126 Q 78 124, 104 130 Q 122 134, 132 148 L 132 162 L 6 162 Z" />
      {/* Rock contour lines for stone texture */}
      <g opacity="0.4">
        <path d="M16 138 Q 26 130, 44 130" />
        <path d="M58 132 Q 76 128, 96 134" />
        <path d="M104 142 Q 116 142, 124 148" />
      </g>
      {/* Rock stipple */}
      <g opacity="0.45" fill="currentColor" stroke="none">
        <circle cx="22" cy="142" r="0.6" />
        <circle cx="48" cy="138" r="0.6" />
        <circle cx="76" cy="140" r="0.6" />
        <circle cx="108" cy="148" r="0.6" />
      </g>

      {/* Horizontal rhizome — drawn slightly thicker than the leaves */}
      <path
        d="M14 132 Q 36 122, 70 124 Q 104 126, 126 134"
        strokeWidth="1.8"
      />

      {/* Holdfast roots — short fibres gripping the rock under the rhizome */}
      <g opacity="0.65">
        <path d="M22 130 Q 21 134, 22 138" />
        <path d="M36 122 Q 36 130, 36 136" />
        <path d="M52 122 L 52 134" />
        <path d="M70 124 L 70 134" />
        <path d="M88 122 L 88 134" />
        <path d="M104 124 L 104 134" />
        <path d="M118 130 Q 119 134, 118 138" />
      </g>

      {/* Broad upright leaves — five rising at intervals, with central
          midrib veining. */}
      {/* Leaf 1 — left */}
      <path d="M30 124 C 10 100, 14 60, 22 24 C 30 60, 36 100, 34 122 Z" />
      <path d="M22 36 Q 26 76, 32 116" opacity="0.45" />
      {/* Leaf 2 */}
      <path d="M52 124 C 38 92, 42 44, 50 8 C 56 44, 58 92, 56 122 Z" />
      <path d="M50 22 L 54 116" opacity="0.45" />
      {/* Leaf 3 — centre, tallest */}
      <path d="M72 124 C 64 80, 68 30, 72 0 C 76 30, 80 80, 74 124 Z" />
      <path d="M72 12 L 72 120" opacity="0.45" />
      {/* Leaf 4 */}
      <path d="M92 124 C 106 92, 102 44, 94 8 C 88 44, 86 92, 88 122 Z" />
      <path d="M94 22 L 90 116" opacity="0.45" />
      {/* Leaf 5 — right */}
      <path d="M114 124 C 134 100, 130 60, 122 24 C 114 60, 108 100, 110 122 Z" />
      <path d="M122 36 Q 118 76, 112 116" opacity="0.45" />
    </svg>
  );
}

/**
 * Carpet — dense lawn of short upright shoots emerging from a
 * horizontal runner. Suits HC cuba, monte carlo, dwarf hairgrass,
 * glossostigma, lilaeopsis, marsilea.
 */
export function PlantPlateCarpet(props: IconProps) {
  // Stagger the shoot heights so the lawn reads as natural rather
  // than mechanical. Slight randomised lean per shoot.
  const shoots: Array<{ x: number; h: number; lean: number }> = [
    { x: 10, h: 26, lean: -0.18 },
    { x: 18, h: 38, lean: -0.1 },
    { x: 26, h: 44, lean: -0.05 },
    { x: 34, h: 32, lean: 0.05 },
    { x: 42, h: 50, lean: -0.08 },
    { x: 50, h: 38, lean: 0.06 },
    { x: 58, h: 54, lean: 0 },
    { x: 66, h: 42, lean: -0.05 },
    { x: 74, h: 48, lean: 0.04 },
    { x: 82, h: 36, lean: -0.08 },
    { x: 90, h: 52, lean: 0.05 },
    { x: 98, h: 40, lean: -0.04 },
    { x: 106, h: 46, lean: 0.08 },
    { x: 114, h: 34, lean: 0.12 },
    { x: 122, h: 28, lean: 0.2 },
  ];
  return (
    <svg
      viewBox="0 0 140 170"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Substrate */}
      <path d="M4 148 L 136 148" opacity="0.7" />
      <g opacity="0.5" fill="currentColor" stroke="none">
        <circle cx="12" cy="152" r="0.6" />
        <circle cx="24" cy="154" r="0.7" />
        <circle cx="38" cy="152" r="0.6" />
        <circle cx="56" cy="154" r="0.7" />
        <circle cx="72" cy="152" r="0.6" />
        <circle cx="86" cy="154" r="0.7" />
        <circle cx="102" cy="152" r="0.6" />
        <circle cx="116" cy="154" r="0.7" />
        <circle cx="128" cy="152" r="0.6" />
      </g>

      {/* Runner — gentle wave just above the substrate */}
      <path
        d="M4 142 Q 36 138, 70 142 Q 102 146, 136 140"
        opacity="0.6"
      />

      {shoots.map(({ x, h, lean }, i) => {
        const tipX = x + lean * h;
        const tipY = 142 - h;
        return (
          <g key={i}>
            {/* Stem */}
            <path
              d={`M${x} 142 Q ${x + lean * h * 0.4} ${142 - h * 0.55}, ${tipX} ${tipY}`}
            />
            {/* Tiny leaf cluster at the apex */}
            <path
              d={`M${tipX - 3} ${tipY + 3} Q ${tipX} ${tipY - 3}, ${tipX + 3} ${tipY + 3} Z`}
              fill="currentColor"
              opacity="0.85"
            />
          </g>
        );
      })}

      {/* Sub-runner crossing — faint diagonal stolon */}
      <path
        d="M22 144 Q 64 152, 110 144"
        opacity="0.25"
        strokeDasharray="1 2"
      />
    </svg>
  );
}

/**
 * Floating — rounded leaves resting atop a wavy water-surface line
 * with feathery root tendrils descending below. Suits salvinia,
 * frogbit, duckweed, water lettuce.
 */
export function PlantPlateFloating(props: IconProps) {
  return (
    <svg
      viewBox="0 0 140 170"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Water surface — gently undulating ripple line */}
      <path
        d="M4 40 Q 18 36, 32 40 Q 46 44, 60 40 Q 74 36, 88 40 Q 102 44, 116 40 Q 128 36, 136 40"
        opacity="0.7"
      />
      {/* Secondary fainter ripple just below */}
      <path
        d="M4 46 Q 22 44, 40 46 Q 62 48, 80 46 Q 102 44, 120 46 Q 130 47, 136 46"
        opacity="0.3"
        strokeDasharray="1 2"
      />

      {/* Leaves resting on the surface — three rounded pads of varying
          size, the largest centre. Each leaf has a central vein and
          two side veins. */}
      {/* Left leaf */}
      <ellipse cx="36" cy="30" rx="14" ry="9" />
      <path d="M36 22 L 36 38" opacity="0.45" />
      <path d="M28 28 Q 36 32, 44 28" opacity="0.4" />
      <path d="M30 32 Q 36 34, 42 32" opacity="0.35" />

      {/* Centre leaf — largest */}
      <ellipse cx="70" cy="24" rx="18" ry="11" />
      <path d="M70 14 L 70 34" opacity="0.45" />
      <path d="M58 22 Q 70 26, 82 22" opacity="0.4" />
      <path d="M60 28 Q 70 30, 80 28" opacity="0.35" />
      <path d="M55 18 Q 70 14, 85 18" opacity="0.3" />

      {/* Right leaf */}
      <ellipse cx="104" cy="30" rx="13" ry="8" />
      <path d="M104 22 L 104 38" opacity="0.45" />
      <path d="M97 28 Q 104 32, 111 28" opacity="0.4" />

      {/* Hanging root systems — feathery tendrils */}
      {[
        { x: 36, branches: 4 },
        { x: 70, branches: 5 },
        { x: 104, branches: 4 },
      ].map(({ x, branches }, leafIdx) => (
        <g key={leafIdx}>
          {/* Main root — drifts slightly */}
          <path
            d={`M${x} 40 Q ${x - 3} 90, ${x + 2} 150`}
            opacity="0.7"
          />
          {/* Side rootlets — alternating each side, taper outward */}
          {Array.from({ length: branches }).map((_, i) => {
            const y = 58 + i * 22;
            const side = i % 2 === 0 ? -1 : 1;
            const len = 6 + i * 1.5;
            return (
              <path
                key={i}
                d={`M${x + side * 0.5} ${y} Q ${x + side * (len * 0.5)} ${y + 6}, ${x + side * len} ${y + 16}`}
                opacity={0.5 - i * 0.04}
              />
            );
          })}
          {/* Root tip terminal hair */}
          <path
            d={`M${x + 2} ${145 + leafIdx * 2} Q ${x - 2} ${152}, ${x + 4} ${160}`}
            opacity="0.4"
          />
        </g>
      ))}
    </svg>
  );
}

/**
 * Grass — long narrow strap blades arching outward from a tight
 * crown. Each blade is drawn as two parallel edges with a central
 * vein, giving the blade visible width without a heavy silhouette.
 * Suits vallisneria, sagittaria, dwarf hairgrass.
 */
export function PlantPlateGrass(props: IconProps) {
  // Each blade: tip position + which edge dominates (controls curl)
  const blades: Array<{ tipX: number; tipY: number; side: -1 | 1 }> = [
    { tipX: 8, tipY: 38, side: -1 },
    { tipX: 18, tipY: 22, side: -1 },
    { tipX: 36, tipY: 10, side: -1 },
    { tipX: 56, tipY: 2, side: -1 },
    { tipX: 70, tipY: 0, side: 1 },
    { tipX: 84, tipY: 2, side: 1 },
    { tipX: 104, tipY: 10, side: 1 },
    { tipX: 122, tipY: 22, side: 1 },
    { tipX: 132, tipY: 38, side: 1 },
  ];
  return (
    <svg
      viewBox="0 0 140 170"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Substrate */}
      <path d="M14 154 L 126 154" opacity="0.7" />
      <g opacity="0.5" fill="currentColor" stroke="none">
        <circle cx="28" cy="158" r="0.7" />
        <circle cx="48" cy="160" r="0.6" />
        <circle cx="70" cy="158" r="0.7" />
        <circle cx="92" cy="160" r="0.6" />
        <circle cx="112" cy="158" r="0.7" />
      </g>

      {/* Roots */}
      <g opacity="0.55">
        <path d="M64 154 L 60 168" />
        <path d="M70 154 L 70 170" />
        <path d="M76 154 L 80 168" />
      </g>

      {/* Crown — tight base */}
      <path d="M58 148 Q 70 154, 82 148 Q 76 156, 70 156 Q 64 156, 58 148 Z" />

      {blades.map(({ tipX, tipY, side }, i) => {
        const baseX = 70;
        const baseY = 148;
        const midX = (tipX + baseX) / 2 + side * -2;
        const midY = (tipY + baseY) / 2 - 10;
        const offset = 1.2; // blade thickness
        // Two parallel edges + central vein for the blade interior
        return (
          <g key={i}>
            <path
              d={`M${baseX - 0.6} ${baseY} Q ${midX} ${midY}, ${tipX} ${Math.max(tipY, 0)}`}
              opacity="0.88"
            />
            <path
              d={`M${baseX + 0.6} ${baseY} Q ${midX + offset * side * 0.6} ${midY + offset * 0.4}, ${tipX + side * 0.8} ${Math.max(tipY + 1, 1)}`}
              opacity="0.55"
            />
            {/* Subtle central vein only on alternate blades */}
            {i % 2 === 0 && (
              <path
                d={`M${baseX} ${baseY - 2} Q ${midX + side * 0.3} ${midY + 1}, ${tipX + side * 0.4} ${Math.max(tipY + 0.5, 0.5)}`}
                opacity="0.25"
                strokeDasharray="0.6 2.5"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Snail plate — coiled shell with body extended forward, antennae out.
 * Drawn outline-only at ~120 px to match the other scientific plates.
 */
export function SnailPlate(props: IconProps) {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Foot / body — long extended slug shape resting on a baseline */}
      <path d="
        M 12 96
        Q 8 80, 26 76
        L 80 76
        Q 130 64, 158 70
        Q 184 78, 184 96
        L 12 96
        Z
      " />

      {/* Baseline ground line */}
      <path d="M 8 100 L 192 100" opacity="0.45" />

      {/* Spiral shell — large coiled chamber on the rear (right side) */}
      <circle cx="132" cy="58" r="34" />
      <circle cx="132" cy="58" r="24" opacity="0.85" />
      <circle cx="132" cy="58" r="14" opacity="0.7" />
      <circle cx="132" cy="58" r="6" opacity="0.6" />

      {/* Spiral connector — line tracing the whorl from outer to inner */}
      <path
        d="M 132 92 Q 100 92, 100 58 Q 100 24, 132 24 Q 156 24, 156 58 Q 156 82, 132 82 Q 116 82, 116 58 Q 116 44, 132 44"
        opacity="0.4"
      />

      {/* Hatching along the upper shell — engraved tonal lines */}
      <g opacity="0.25">
        <path d="M 110 36 L 100 30" />
        <path d="M 120 30 L 116 22" />
        <path d="M 132 28 L 132 18" />
        <path d="M 146 30 L 152 22" />
        <path d="M 158 38 L 168 32" />
      </g>

      {/* Eye stalks / antennae rising from the front of the body */}
      <path d="M 30 76 L 26 56" />
      <path d="M 40 76 L 38 54" />
      <circle cx="26" cy="54" r="2.2" />
      <circle cx="38" cy="52" r="2.2" />
      <circle cx="26" cy="54" r="0.9" fill="currentColor" />
      <circle cx="38" cy="52" r="0.9" fill="currentColor" />

      {/* Mouth — tiny */}
      <path d="M 14 88 L 22 86" opacity="0.65" />
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
  React.ComponentType<MarkProps>
> = {
  fish: FishMark,
  plants: PlantMark,
  shrimp: ShrimpMark,
  mosses: MossMark,
  snails: SnailMark,
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
  snails: SnailPlate,
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
  if (entry.category === "snails") {
    return { Plate: SnailPlate, label: "Snail" };
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
