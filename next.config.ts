import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
  async redirects() {
    return [
      {
        source: "/instagram",
        destination: "https://www.instagram.com/royal_weddinghug?stkn=bndlcGtpMGY5NWVm",
        permanent: false,
      },
      {
        source: "/ig",
        destination: "https://www.instagram.com/royal_weddinghug?stkn=bndlcGtpMGY5NWVm",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
