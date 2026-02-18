import type { NextConfig } from "next";
import { resolve } from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: resolve(__dirname),
  },
  images: {
    formats: ["image/avif", "image/webp"],
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
