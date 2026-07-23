import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile higher up the filesystem can make Turbopack infer the
  // wrong workspace root — pin it to this project explicitly.
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "inaturalist-open-data.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.inaturalist.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tropica.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.aquasabi.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "buceplant.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "live.staticflickr.com",
        pathname: "/**",
      },
    ],
  },
  /**
   * Site-wide security headers. HSTS protects the canonical https origin,
   * the rest harden the page against MIME sniffing, referrer leakage, and
   * uninvited use of the camera / mic / geolocation APIs.
   *
   * `Strict-Transport-Security` is only honoured over a real https
   * connection — local dev (http://localhost) ignores it, which is fine.
   */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Explicit indexability signal — some auditors expect this
          // header in addition to robots.txt. Mirrors metadata.robots.
          { key: "X-Robots-Tag", value: "index, follow" },
        ],
      },
    ];
  },
};

export default nextConfig;
