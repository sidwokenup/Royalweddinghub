import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.blinkwed.com",
      },
      {
        protocol: "https",
        hostname: "blinkwed.com",
      },
    ],
  },
};

export default nextConfig;
