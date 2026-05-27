import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono,
  Bricolage_Grotesque,
} from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { site } from "@/lib/site";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/footer";
import { JsonLd } from "@/components/seo/json-ld";
import { siteJsonLd } from "@/lib/seo";

const GA_MEASUREMENT_ID = "G-HEEVNK5JSE";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Display family — Bricolage Grotesque. A modern variable sans
 * with a slight architectural edge, tunable from light through
 * extra-bold across the page. Replaces Fraunces (serif) for the
 * more contemporary headline voice the reference set asked for.
 */
const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "aquascaping",
    "planted tank",
    "freshwater aquarium",
    "aquatic plants",
    "aquarium fish",
    "aquarium hardscape",
    "aquarium equipment",
    "fishkeeping",
    "iwagumi",
    "biotope aquarium",
    "shrimp tank",
  ],
  authors: [{ name: site.owner.name, url: site.url }],
  creator: site.owner.name,
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: site.url,
  },
  // Favicon + apple-touch-icon emitted automatically by Next 16 via
  // the file-system convention: src/app/icon.png and src/app/apple-icon.png.
  // Search-engine ownership verification. Each console reads its own meta tag.
  verification: {
    google: "133bZNW5jZs9SOy892fBwbJhyyRoYmtCWpquipIicD8",
    other: {
      "msvalidate.01": "E5C51B1AC8F11A3B6E1EEB686C8B412E",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={siteJsonLd()} id="site-jsonld" />

        {/* Google Analytics 4 — loads after the page is interactive so it
            never blocks the first paint. The Script component dedupes the
            tag across navigations and emits the snippet exactly once. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>

        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
