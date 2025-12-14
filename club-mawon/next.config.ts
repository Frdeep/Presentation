import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify-friendly: full static export (no server runtime needed)
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
