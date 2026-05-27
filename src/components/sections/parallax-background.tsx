"use client";

import * as React from "react";
import Image from "next/image";
import type { AtmosphereImage } from "@/data/atmosphere";

interface ParallaxBackgroundProps {
  image: AtmosphereImage;
  /** Maximum vertical translate, in pixels at full scroll past. */
  intensity?: number;
}

/**
 * Parallax background image for the hero. The image is scaled
 * slightly larger than the section and translated upward as the
 * user scrolls through it, so it appears to drift at a different
 * rate from the foreground content.
 *
 * Uses `transform: translate3d(...)` so the GPU compositor handles
 * the motion. `requestAnimationFrame` throttles scroll updates so
 * the listener never runs more than once per frame. Respects
 * `prefers-reduced-motion` by leaving the image at the resting
 * position.
 */
export function ParallaxBackground({
  image,
  intensity = 120,
}: ParallaxBackgroundProps) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = wrap.getBoundingClientRect();
      const viewportH = window.innerHeight;
      // 0 when the section's top is at the bottom of the viewport
      // (about to enter); 1 when the section's bottom is at the top
      // (about to exit). Below the resting point we apply
      // proportional translateY.
      const progress = Math.max(
        -1,
        Math.min(1, (viewportH - r.top - r.height / 2) / r.height),
      );
      inner.style.transform = `translate3d(0, ${(-progress * intensity).toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [intensity]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="absolute inset-0 -z-30 overflow-hidden"
    >
      <div
        ref={innerRef}
        className="absolute inset-0 will-change-transform"
        // Scale slightly larger than the section so that the parallax
        // translation never reveals the section background underneath.
        style={{ height: "calc(100% + 240px)", top: "-120px" }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
