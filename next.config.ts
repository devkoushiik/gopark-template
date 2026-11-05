import type { NextConfig } from "next";

// Static export for Cloudflare Pages: `next build` writes plain HTML/CSS/JS to `out/`.
// Pages settings: build command `npm run build`, output directory `out`.
const nextConfig: NextConfig = {
  output: "export",
  // no Next.js image server on a static host: serve the files as-is
  // (photos in /public are already compressed to WebP)
  images: { unoptimized: true },
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
