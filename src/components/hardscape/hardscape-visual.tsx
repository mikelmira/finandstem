import { readdirSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { Mountain, TreePine } from "lucide-react";
import type { HardscapeType } from "@/data/hardscape";
import { cn } from "@/lib/utils";

/**
 * Visual identity for a hardscape item.
 *
 * Wikimedia Commons has no reliable, correctly-identified photos of most
 * named aquascaping stones and woods, and faking or mismatching a photo is
 * worse than none. So, exactly as the substrate visuals do, we render an
 * honest material-toned tile keyed to the item's category and its effect on
 * water, warm and woody for wood, cool and stony for stone, tinted toward
 * pale for calcareous stones and darker for inert ones.
 *
 * If a correctly-licensed photo is ever dropped in
 * `/public/images/hardscape/<slug>.<ext>`, it is shown instead.
 */
function loadPhotoSet(): { slugs: ReadonlySet<string>; ext: Record<string, string> } {
  try {
    const dir = join(process.cwd(), "public", "images", "hardscape");
    const files = readdirSync(dir);
    const slugs = new Set<string>();
    const ext: Record<string, string> = {};
    for (const file of files) {
      const m = file.match(/^(.+)\.(jpe?g|png|webp)$/i);
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

interface VisualTone {
  bg: string;
  text: string;
  grain: string;
}

const STONE_INERT: VisualTone = {
  bg: "linear-gradient(155deg, #3f4550, #565d69 55%, #333840)",
  text: "rgb(238 240 244)",
  grain:
    "radial-gradient(circle at 28% 30%, rgba(255,255,255,0.14) 0 16%, transparent 22%), radial-gradient(circle at 72% 70%, rgba(0,0,0,0.3) 0 20%, transparent 26%)",
};

const STONE_CALCAREOUS: VisualTone = {
  bg: "linear-gradient(155deg, #8a8b83, #b4b3a6 55%, #7c7d75)",
  text: "rgb(38 36 30)",
  grain:
    "radial-gradient(circle at 28% 30%, rgba(255,255,250,0.5) 0 16%, transparent 20%), radial-gradient(circle at 72% 70%, rgba(60,55,40,0.2) 0 18%, transparent 24%)",
};

const WOOD_TONE: VisualTone = {
  bg: "linear-gradient(150deg, #5a3d24, #7a5433 55%, #43301d)",
  text: "rgb(248 238 224)",
  grain:
    "repeating-linear-gradient(115deg, rgba(0,0,0,0.16) 0 2px, transparent 2px 9px), radial-gradient(circle at 70% 60%, rgba(255,235,205,0.14) 0 22%, transparent 30%)",
};

function toneFor(item: HardscapeType): VisualTone {
  if (item.category === "wood") return WOOD_TONE;
  return item.phEffect === "raises" ? STONE_CALCAREOUS : STONE_INERT;
}

export function HardscapeVisual({
  item,
  size = "card",
  className,
}: {
  item: HardscapeType;
  size?: "card" | "hero";
  className?: string;
}) {
  const aspect = size === "card" ? "aspect-[5/3]" : "aspect-[16/7]";

  if (PHOTOS.slugs.has(item.slug)) {
    const ext = PHOTOS.ext[item.slug] ?? "webp";
    return (
      <div className={cn("relative overflow-hidden rounded-2xl bg-muted", aspect, className)}>
        <Image
          src={`/images/hardscape/${item.slug}.${ext}`}
          alt={`${item.name}, aquascaping ${item.category}`}
          fill
          sizes={size === "card" ? "(max-width: 1024px) 100vw, 400px" : "100vw"}
          className="object-cover"
        />
      </div>
    );
  }

  const tone = toneFor(item);
  const Icon = item.category === "wood" ? TreePine : Mountain;

  return (
    <div
      className={cn("relative isolate overflow-hidden rounded-2xl", aspect, className)}
      style={{ background: tone.bg, color: tone.text }}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-60 mix-blend-overlay"
        style={{ backgroundImage: tone.grain, backgroundSize: "30px 30px" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-white/8 via-transparent to-black/16"
      />
      <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] backdrop-blur">
          <Icon className="size-3" aria-hidden />
          {item.category === "wood" ? "Wood" : "Stone"}
        </span>
        <span
          className={cn(
            "text-display-tight font-semibold leading-tight",
            size === "card" ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl",
          )}
        >
          {item.name}
        </span>
      </div>
    </div>
  );
}
