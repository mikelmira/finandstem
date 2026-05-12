"use client";

import { useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type ParamValue = string | string[] | number | null | undefined;

export function useFilterUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const setParams = useCallback(
    (patch: Record<string, ParamValue>) => {
      const sp = new URLSearchParams(search?.toString() ?? "");
      for (const [key, value] of Object.entries(patch)) {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          sp.delete(key);
          continue;
        }
        if (Array.isArray(value)) {
          sp.set(key, value.join(","));
        } else if (typeof value === "number") {
          sp.set(key, String(value));
        } else {
          sp.set(key, value);
        }
      }
      const qs = sp.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [pathname, router, search],
  );

  const clearAll = useCallback(() => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }, [pathname, router]);

  return { setParams, clearAll, isPending };
}
