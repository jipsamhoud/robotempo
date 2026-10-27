import type { NextConfig } from "next";

// GitHub Pages: statische export onder een subpad (bijv. /robotempo).
// Vercel: gewone build met API-route, zonder subpad.
const isPages = process.env.PAGES_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  ...(isPages ? { output: "export", trailingSlash: true, images: { unoptimized: true } } : {}),
  basePath: basePath || undefined,
};

export default nextConfig;
