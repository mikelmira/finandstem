import * as React from "react";

/**
 * Fin & Stem mark — a stylised stem rising through water, with a fin curl at
 * the base. Stroke uses currentColor so it inherits theme accent.
 */
export function WaveMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="Fin & Stem"
      {...props}
    >
      {/* Water surface */}
      <path
        d="M3 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
      {/* Stem */}
      <path
        d="M16 28V13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Leaf left */}
      <path
        d="M16 18c-3.4 0-5.4-2-5.4-5 2.6 0 5.4 1.8 5.4 5z"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Leaf right */}
      <path
        d="M16 15c3 0 5-1.8 5-4.5-2.4 0-5 1.6-5 4.5z"
        fill="currentColor"
      />
      {/* Fin curl at base */}
      <path
        d="M11 28c2-1 4-1 5-3 1 2 3 2 5 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
