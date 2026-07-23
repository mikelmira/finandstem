"use client";

/**
 * Small shared client hooks built on `useSyncExternalStore`, the
 * React-blessed way to read browser state without effect-driven
 * setState cascades (and the pattern the react-hooks v6 lint enforces).
 */

import * as React from "react";

const emptySubscribe = () => () => {};

/**
 * False during SSR and the hydration render, true afterwards.
 * Use to gate `createPortal` and other DOM-only rendering.
 */
export function useHydrated(): boolean {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

/**
 * Reactive `window.matchMedia` — false during SSR, live-updates on
 * viewport / preference changes after hydration.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
