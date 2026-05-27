import { readdirSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import type { SubstrateEntry } from "@/types/substrate";
import { cn } from "@/lib/utils";

/**
 * Compute, once at module load, the set of substrate slugs that have a
 * self-hosted product photo in `/public/images/substrates/`. Used by
 * the SubstrateVisual component to decide between rendering the real
 * photo or falling back to the swatch palette.
 *
 * Server-component-only, fs is available at module init for SSG.
 */
function loadPhotoSet(): { slugs: ReadonlySet<string>; ext: Record<string, string> } {
  try {
    const dir = join(process.cwd(), "public", "images", "substrates");
    const files = readdirSync(dir);
    const slugs = new Set<string>();
    const ext: Record<string, string> = {};
    for (const f of files) {
      const m = f.match(/^(.+)\.(jpe?g|png|webp)$/i);
      if (!m) continue;
      slugs.add(m[1]);
      ext[m[1]] = m[2].toLowerCase();
    }
    return { slugs, ext };
  } catch {
    return { slugs: new Set(), ext: {} };
  }
}

const PHOTOS = loadPhotoSet();

interface SubstrateVisualProps {
  entry: SubstrateEntry;
  /** Visual size preset — "card" for catalogue cards, "hero" for the detail page banner. */
  size?: "card" | "hero";
  className?: string;
}

/**
 * Visual identity tile for a substrate.
 *
 * Substrates are sold as bagged products, ADA, Tropica, etc. own their
 * product photography and don't release it under a Creative Commons
 * license. Rather than fake product imagery, we render an honest
 * representation of what the substrate *looks like in the tank*:
 *   · Background coloured to match the substrate's documented colour
 *     (`palette` map below, hand-keyed per slug).
 *   · A subtle radial-gradient "grain" pattern overlay to suggest
 *     texture without claiming to be a product photo.
 *   · Brand badge + abbreviated name layered on top.
 *
 * One substrate, akadama, has a public-domain photo on Wikimedia
 * Commons and renders that real photo instead.
 */
export function SubstrateVisual({
  entry,
  size = "card",
  className,
}: SubstrateVisualProps) {
  // If we have a real product photo on disk, render it. Otherwise
  // fall back to the swatch palette below.
  if (PHOTOS.slugs.has(entry.slug)) {
    const ext = PHOTOS.ext[entry.slug] ?? "jpg";
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-muted",
          size === "card" ? "aspect-[5/3]" : "aspect-[16/7]",
          className,
        )}
      >
        <Image
          src={`/images/substrates/${entry.slug}.${ext}`}
          alt={`${entry.brand} ${entry.name} product photo`}
          fill
          sizes={size === "card" ? "(max-width: 1024px) 100vw, 400px" : "100vw"}
          className="object-cover"
        />
      </div>
    );
  }

  const tone = PALETTE[entry.slug] ?? FALLBACK;

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-2xl",
        size === "card" ? "aspect-[5/3]" : "aspect-[16/7]",
        className,
      )}
      style={{
        background: tone.bg,
        color: tone.text,
      }}
    >
      {/* Grain texture overlay, a stack of small radial gradients to
          suggest pellet shapes without faking a product photo. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-60 mix-blend-overlay"
        style={{ backgroundImage: tone.grain, backgroundSize: "26px 26px" }}
      />
      {/* Subtle top-light gloss so the tile reads as physical material
          rather than a flat fill. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-white/8 via-transparent to-black/14"
      />

      {/* Brand badge + product name */}
      <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
        <span
          className="inline-flex w-fit items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] backdrop-blur"
          style={{ color: tone.badgeText }}
        >
          {entry.brand}
        </span>
        <span
          className={cn(
            "text-display-tight font-semibold leading-tight",
            size === "card" ? "text-base sm:text-lg" : "text-2xl sm:text-3xl",
          )}
          style={{ color: tone.text }}
        >
          {entry.name}
        </span>
      </div>
    </div>
  );
}

/**
 * Per-substrate visual palette. Each entry chooses a background +
 * text colour pair that reads true to the actual substrate's documented
 * colour from Part 1 of the prompt, plus a CSS gradient stack that
 * suggests grain.
 *
 * Dark substrates use light text; pale sands use dark text.
 */
interface VisualTone {
  /** CSS `background` shorthand. */
  bg: string;
  /** Text colour for the product name. */
  text: string;
  /** Text colour for the brand badge (sits inside a black/25 pill, so it
   *  usually needs to be lighter than `text`). */
  badgeText: string;
  /** Background-image stack used as the grain overlay. */
  grain: string;
}

const FALLBACK: VisualTone = {
  bg: "linear-gradient(160deg, #2a2018, #3a2d22)",
  text: "rgb(245 240 230)",
  badgeText: "rgb(220 210 195)",
  grain:
    "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18) 0 18%, transparent 22%), radial-gradient(circle at 70% 70%, rgba(0,0,0,0.22) 0 20%, transparent 24%)",
};

const PALETTE: Record<string, VisualTone> = {
  // ─── Active aquasoils (dark brown / black volcanic clay) ──────────
  "ada-amazonia-v2": {
    bg: "linear-gradient(160deg, #1a120c, #2d1f14 60%, #1a120c)",
    text: "rgb(245 235 220)",
    badgeText: "rgb(230 215 190)",
    grain:
      "radial-gradient(circle at 25% 30%, rgba(255,245,225,0.18) 0 20%, transparent 24%), radial-gradient(circle at 75% 70%, rgba(0,0,0,0.35) 0 22%, transparent 28%)",
  },
  "ada-amazonia-powder-v2": {
    bg: "linear-gradient(160deg, #1a120c, #2a1d12 60%, #1a120c)",
    text: "rgb(245 235 220)",
    badgeText: "rgb(230 215 190)",
    grain:
      "radial-gradient(circle at 30% 35%, rgba(255,245,225,0.14) 0 14%, transparent 18%), radial-gradient(circle at 70% 65%, rgba(0,0,0,0.3) 0 16%, transparent 20%)",
  },
  "ada-africana": {
    bg: "linear-gradient(160deg, #2b1a0d, #3a2616 55%, #261609)",
    text: "rgb(245 230 210)",
    badgeText: "rgb(230 210 185)",
    grain:
      "radial-gradient(circle at 30% 30%, rgba(255,225,180,0.18) 0 18%, transparent 22%), radial-gradient(circle at 70% 70%, rgba(0,0,0,0.32) 0 20%, transparent 26%)",
  },
  "tropica-aquarium-soil": {
    bg: "linear-gradient(160deg, #221610, #3a2618 55%, #221610)",
    text: "rgb(245 235 220)",
    badgeText: "rgb(225 210 185)",
    grain:
      "radial-gradient(circle at 28% 32%, rgba(255,235,200,0.16) 0 19%, transparent 23%), radial-gradient(circle at 72% 68%, rgba(0,0,0,0.32) 0 21%, transparent 26%)",
  },
  "tropica-aquarium-soil-powder": {
    bg: "linear-gradient(160deg, #221610, #36251a 55%, #221610)",
    text: "rgb(245 235 220)",
    badgeText: "rgb(225 210 185)",
    grain:
      "radial-gradient(circle at 32% 35%, rgba(255,235,200,0.12) 0 12%, transparent 16%), radial-gradient(circle at 68% 65%, rgba(0,0,0,0.28) 0 14%, transparent 18%)",
  },
  "uns-controsoil": {
    bg: "linear-gradient(160deg, #15110d, #2a1e15 60%, #15110d)",
    text: "rgb(240 230 215)",
    badgeText: "rgb(220 205 180)",
    grain:
      "radial-gradient(circle at 28% 30%, rgba(255,235,210,0.14) 0 17%, transparent 22%), radial-gradient(circle at 72% 70%, rgba(0,0,0,0.34) 0 19%, transparent 24%)",
  },
  "fluval-stratum": {
    bg: "linear-gradient(160deg, #1d1610, #3b2c20 55%, #1d1610)",
    text: "rgb(245 235 220)",
    badgeText: "rgb(225 210 185)",
    grain:
      "radial-gradient(circle at 30% 35%, rgba(255,230,195,0.15) 0 18%, transparent 23%), radial-gradient(circle at 70% 65%, rgba(0,0,0,0.3) 0 19%, transparent 25%)",
  },
  "dennerle-scapers-soil": {
    bg: "linear-gradient(160deg, #14110e, #281e16 60%, #14110e)",
    text: "rgb(240 232 218)",
    badgeText: "rgb(220 207 185)",
    grain:
      "radial-gradient(circle at 28% 32%, rgba(255,235,205,0.14) 0 17%, transparent 22%), radial-gradient(circle at 72% 68%, rgba(0,0,0,0.34) 0 19%, transparent 25%)",
  },

  // ─── Inert nutrient (slate / iron-rich black gravel) ──────────────
  "caribsea-eco-complete": {
    bg: "linear-gradient(160deg, #0c0c10, #1f1f25 60%, #0c0c10)",
    text: "rgb(232 232 240)",
    badgeText: "rgb(210 210 220)",
    grain:
      "radial-gradient(circle at 28% 30%, rgba(255,255,255,0.12) 0 16%, transparent 22%), radial-gradient(circle at 72% 70%, rgba(0,0,0,0.42) 0 22%, transparent 28%)",
  },
  "seachem-flourite-black": {
    bg: "linear-gradient(160deg, #0c0c10, #22222a 60%, #0c0c10)",
    text: "rgb(235 235 244)",
    badgeText: "rgb(212 212 222)",
    grain:
      "radial-gradient(circle at 30% 32%, rgba(255,255,255,0.1) 0 16%, transparent 22%), radial-gradient(circle at 70% 68%, rgba(0,0,0,0.4) 0 22%, transparent 28%)",
  },
  "seachem-flourite-black-sand": {
    bg: "linear-gradient(160deg, #0d0d11, #21212a 60%, #0d0d11)",
    text: "rgb(235 235 244)",
    badgeText: "rgb(212 212 222)",
    grain:
      "radial-gradient(circle at 32% 36%, rgba(255,255,255,0.08) 0 10%, transparent 14%), radial-gradient(circle at 68% 64%, rgba(0,0,0,0.34) 0 12%, transparent 16%)",
  },

  // ─── Inert sand & gravel (pale / black silica) ────────────────────
  "pool-filter-sand": {
    bg: "linear-gradient(160deg, #d8cdb6, #ece1c5 55%, #cdc09f)",
    text: "rgb(45 35 20)",
    badgeText: "rgb(40 32 20)",
    grain:
      "radial-gradient(circle at 28% 30%, rgba(255,250,235,0.55) 0 16%, transparent 20%), radial-gradient(circle at 72% 70%, rgba(60,45,20,0.18) 0 18%, transparent 24%)",
  },
  "black-diamond-blasting-sand": {
    bg: "linear-gradient(160deg, #060608, #1c1c22 60%, #060608)",
    text: "rgb(232 232 240)",
    badgeText: "rgb(208 208 218)",
    grain:
      "radial-gradient(circle at 28% 32%, rgba(255,255,255,0.08) 0 12%, transparent 18%), radial-gradient(circle at 72% 68%, rgba(0,0,0,0.45) 0 22%, transparent 28%)",
  },
  "caribsea-tahitian-moon-sand": {
    bg: "linear-gradient(160deg, #060608, #1d1d24 60%, #060608)",
    text: "rgb(232 232 240)",
    badgeText: "rgb(208 208 218)",
    grain:
      "radial-gradient(circle at 30% 34%, rgba(255,255,255,0.08) 0 12%, transparent 16%), radial-gradient(circle at 70% 66%, rgba(0,0,0,0.4) 0 18%, transparent 22%)",
  },

  // ─── Additives / base layers ──────────────────────────────────────
  "ada-power-sand": {
    bg: "linear-gradient(160deg, #c6b89c, #a89673 55%, #b8a886)",
    text: "rgb(50 38 22)",
    badgeText: "rgb(40 32 20)",
    grain:
      "radial-gradient(circle at 28% 30%, rgba(255,250,235,0.4) 0 16%, transparent 20%), radial-gradient(circle at 72% 70%, rgba(40,30,15,0.32) 0 18%, transparent 24%), radial-gradient(circle at 50% 50%, rgba(20,18,16,0.45) 0 6%, transparent 8%)",
  },
  "ada-bacter-100": {
    bg: "linear-gradient(160deg, #d6cbb6, #b9a98a 55%, #c4b294)",
    text: "rgb(45 35 20)",
    badgeText: "rgb(40 32 20)",
    grain:
      "radial-gradient(circle at 28% 30%, rgba(255,250,240,0.5) 0 14%, transparent 18%), radial-gradient(circle at 72% 70%, rgba(40,30,15,0.22) 0 14%, transparent 18%), radial-gradient(circle at 50% 50%, rgba(20,18,16,0.5) 0 4%, transparent 6%)",
  },

  // ─── Extended aquasoil coverage (added 2026-05-28) ────────────────
  "ada-amazonia-light": {
    bg: "linear-gradient(160deg, #2a1d12, #3d2a1a 55%, #2a1d12)",
    text: "rgb(245 232 215)",
    badgeText: "rgb(228 212 188)",
    grain:
      "radial-gradient(circle at 28% 32%, rgba(255,230,195,0.16) 0 18%, transparent 22%), radial-gradient(circle at 72% 68%, rgba(0,0,0,0.3) 0 20%, transparent 26%)",
  },
  "ada-malaya": {
    bg: "linear-gradient(160deg, #3a2516, #5a3a22 55%, #3a2516)",
    text: "rgb(248 228 200)",
    badgeText: "rgb(235 210 178)",
    grain:
      "radial-gradient(circle at 30% 32%, rgba(255,215,170,0.2) 0 18%, transparent 22%), radial-gradient(circle at 70% 68%, rgba(0,0,0,0.3) 0 20%, transparent 26%)",
  },
  "landen-aquasoil": {
    bg: "linear-gradient(160deg, #1a130d, #2d1f14 60%, #1a130d)",
    text: "rgb(245 235 220)",
    badgeText: "rgb(228 212 188)",
    grain:
      "radial-gradient(circle at 26% 30%, rgba(255,235,200,0.16) 0 18%, transparent 22%), radial-gradient(circle at 74% 70%, rgba(0,0,0,0.32) 0 20%, transparent 26%)",
  },
  "mr-aqua-aquasoil": {
    bg: "linear-gradient(160deg, #221610, #38261a 55%, #221610)",
    text: "rgb(243 232 218)",
    badgeText: "rgb(225 210 185)",
    grain:
      "radial-gradient(circle at 30% 35%, rgba(255,230,195,0.12) 0 12%, transparent 16%), radial-gradient(circle at 70% 65%, rgba(0,0,0,0.28) 0 14%, transparent 18%)",
  },
  "jbl-proscape-plantsoil": {
    bg: "linear-gradient(160deg, #181410, #2e2218 60%, #181410)",
    text: "rgb(240 230 215)",
    badgeText: "rgb(220 205 180)",
    grain:
      "radial-gradient(circle at 28% 30%, rgba(255,235,210,0.14) 0 17%, transparent 22%), radial-gradient(circle at 72% 70%, rgba(0,0,0,0.34) 0 19%, transparent 24%)",
  },
  "oliver-knott-nature-soil": {
    bg: "linear-gradient(160deg, #14110e, #271d15 60%, #14110e)",
    text: "rgb(240 232 218)",
    badgeText: "rgb(220 207 185)",
    grain:
      "radial-gradient(circle at 28% 32%, rgba(255,232,205,0.13) 0 14%, transparent 18%), radial-gradient(circle at 72% 68%, rgba(0,0,0,0.34) 0 16%, transparent 20%)",
  },
  "brightwell-florinvolcanit": {
    bg: "linear-gradient(160deg, #161410, #2a221a 55%, #161410)",
    text: "rgb(240 230 215)",
    badgeText: "rgb(220 205 180)",
    grain:
      "radial-gradient(circle at 30% 32%, rgba(255,230,200,0.14) 0 16%, transparent 20%), radial-gradient(circle at 70% 68%, rgba(0,0,0,0.36) 0 20%, transparent 26%)",
  },
  "aquario-neo-soil": {
    bg: "linear-gradient(160deg, #1a140e, #2e1f14 60%, #1a140e)",
    text: "rgb(245 232 215)",
    badgeText: "rgb(228 212 188)",
    grain:
      "radial-gradient(circle at 28% 30%, rgba(255,230,195,0.15) 0 18%, transparent 22%), radial-gradient(circle at 72% 70%, rgba(0,0,0,0.32) 0 20%, transparent 26%)",
  },
  "prodibio-aquagrowth-soil": {
    bg: "linear-gradient(160deg, #1d1610, #322318 55%, #1d1610)",
    text: "rgb(243 232 218)",
    badgeText: "rgb(225 210 185)",
    grain:
      "radial-gradient(circle at 30% 35%, rgba(255,228,195,0.13) 0 16%, transparent 20%), radial-gradient(circle at 70% 65%, rgba(0,0,0,0.3) 0 18%, transparent 24%)",
  },
  "help-advanced-soil": {
    bg: "linear-gradient(160deg, #161210, #2c1f17 60%, #161210)",
    text: "rgb(243 232 218)",
    badgeText: "rgb(225 210 185)",
    grain:
      "radial-gradient(circle at 28% 32%, rgba(255,230,200,0.14) 0 17%, transparent 22%), radial-gradient(circle at 72% 68%, rgba(0,0,0,0.32) 0 19%, transparent 25%)",
  },
};
