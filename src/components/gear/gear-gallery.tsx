"use client";

import * as React from "react";
import type { GearImage } from "@/types/gear";
import { cn } from "@/lib/utils";

export function GearGallery({ images, alt }: { images: GearImage[]; alt: string }) {
  const [active, setActive] = React.useState(0);
  const main = images[active] ?? images[0];
  if (!main) return null;
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={main.src}
          alt={alt}
          width={main.width}
          height={main.height}
          fetchPriority="high"
          className="mx-auto aspect-[4/3] h-auto w-full object-contain p-4"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-pressed={i === active}
              className={cn(
                "press size-16 overflow-hidden rounded-xl border bg-white p-1 transition-colors sm:size-20",
                i === active ? "border-[var(--brand)]" : "border-border hover:border-[var(--brand)]/40",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.thumb} alt="" loading="lazy" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
