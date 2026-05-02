import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Static HTML export — deploy được Netlify/GitHub Pages/anywhere
  trailingSlash: true, // Friendly cho static hosts (e.g. /hangul/index.html)
  images: {
    unoptimized: true, // next/image optimization không support ở static export
  },
};

export default nextConfig;
