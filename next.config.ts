import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
