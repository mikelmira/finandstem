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
    ],
  },
};

export default nextConfig;
