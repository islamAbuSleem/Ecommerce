import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Seed catalog serves product photos from picsum; ProductCard renders via next/image.
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
};

export default nextConfig;
