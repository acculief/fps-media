import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wikia.nocookie.net",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "fastcdn.hoyoverse.com",
      },
      {
        protocol: "https",
        hostname: "act-webstatic.hoyoverse.com",
      },
      {
        protocol: "https",
        hostname: "upload-os-bbs.hoyoverse.com",
      },
    ],
  },
};

export default nextConfig;
