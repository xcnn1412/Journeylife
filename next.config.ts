import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin the workspace root to THIS project (a stray ~/package-lock.json otherwise
  // makes Turbopack pick the home dir as root).
  turbopack: { root: dirname },
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
      // custom media domain (set NEXT_PUBLIC_MEDIA_HOST e.g. media.journeylife.co.th)
      ...(process.env.NEXT_PUBLIC_MEDIA_HOST
        ? [{ protocol: "https" as const, hostname: process.env.NEXT_PUBLIC_MEDIA_HOST }]
        : []),
    ],
  },
};

export default withPayload(nextConfig);
