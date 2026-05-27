/**
 * Shared Open Graph image template, used by every per-route
 * `opengraph-image.tsx` so the social-share card looks consistent
 * across species, pillars, guides, and the homepage.
 *
 * Renders 1200×630 PNG via Next.js `ImageResponse` (which uses Satori
 * under the hood). Tailwind class names are NOT supported by Satori,
 * so every style is inline.
 */

import { ImageResponse } from "next/og";

/** Shared canvas, 1200×630 is the universal OG card aspect. */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;

export interface OgTemplateInput {
  /** Pill text at the top of the card (e.g. "FIN & STEM · FISH"). */
  eyebrow: string;
  /** Big headline, the page's title. */
  title: string;
  /** Italic supporting line (scientific name, pillar subtitle, etc.). */
  subtitle?: string;
  /** One-line spec / hook beneath the subtitle (parameters, kind, etc.). */
  meta?: string;
}

/**
 * Renders one OG card. Each route's `opengraph-image.tsx` calls this
 * with its own copy and returns the ImageResponse. Keep the visual
 * system here (one source of truth) so brand consistency holds.
 */
export function renderOgImage({
  eyebrow,
  title,
  subtitle,
  meta,
}: OgTemplateInput): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          background:
            "linear-gradient(135deg, #0d2818 0%, #14402a 55%, #1a4d2e 100%)",
          fontFamily: "sans-serif",
          color: "white",
          position: "relative",
        }}
      >
        {/* Decorative gradient blob top-right for visual texture */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -180,
            width: 540,
            height: 540,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)",
          }}
        />
        {/* Soft bottom-left accent */}
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -120,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(132,204,170,0.18) 0%, rgba(132,204,170,0) 70%)",
          }}
        />

        {/* Eyebrow pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: 4,
            color: "rgba(255,255,255,0.85)",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 9999,
              background: "#84CCAA",
            }}
          />
          {eyebrow}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 40 ? 72 : 92,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
            color: "white",
            textShadow: "0 4px 30px rgba(0,0,0,0.35)",
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              fontSize: 38,
              fontStyle: "italic",
              marginTop: 24,
              color: "rgba(255,255,255,0.88)",
              lineHeight: 1.2,
            }}
          >
            {subtitle}
          </div>
        )}

        {/* Meta line */}
        {meta && (
          <div
            style={{
              fontSize: 22,
              marginTop: 32,
              color: "rgba(255,255,255,0.78)",
              letterSpacing: 0.5,
            }}
          >
            {meta}
          </div>
        )}
      </div>
    ),
    OG_SIZE,
  );
}
