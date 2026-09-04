"use client";

import * as React from "react";

/**
 * A decorative background video that does not touch the network until the
 * section is about to scroll into view. Keeps the file (and its decode cost)
 * out of the initial page load, which matters a lot on mobile. Honours
 * prefers-reduced-motion by never loading, leaving the dark fallback behind it.
 */
export function BackgroundVideo({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [load, setLoad] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    if (!load || !el) return;
    el.load();
    el.play().catch(() => {});
  }, [load]);

  return (
    <video
      ref={ref}
      aria-hidden
      loop
      muted
      playsInline
      preload="none"
      className={className}
    >
      {load && <source src={src} type="video/mp4" />}
    </video>
  );
}
