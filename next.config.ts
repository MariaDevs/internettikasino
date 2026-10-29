import type { NextConfig } from "next";
import casinos from "./src/lib/data/casinos.json";
import legacyRedirects from "./src/lib/data/legacy-redirects.json";

const isStaticExport = process.env.EXPORT === "true";

// Affiliate links keep the /go/<slug>/ shape the WordPress site used, so any
// existing backlinks or bookmarks to them keep working. This is the source of
// truth on Vercel; a static export gets the same rules via public/.htaccess.
const goRedirects = casinos
  .filter((c) => c.go && c.affiliateUrl)
  .map((c) => ({ source: `/go/${c.go}`, destination: c.affiliateUrl as string, permanent: false }));

const nextConfig: NextConfig = {
  // WordPress served every URL with a trailing slash; keeping it means every
  // indexed/linked URL resolves to the same address with no redirect hop.
  trailingSlash: true,
  // A stray package-lock.json in the user profile would otherwise be picked as the root.
  turbopack: { root: __dirname },
  ...(isStaticExport && { output: "export" }),
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
    // Static export requires unoptimized (no server to process images)
    ...(isStaticExport && { unoptimized: true }),
  },
  compress: true,
  poweredByHeader: false,
  ...(!isStaticExport && {
    async redirects() {
      return [
        // www → bare domain is a Vercel domain redirect (Settings → Domains), which
        // keeps the path and trailing slash in one hop; a rule here would drop the slash.
        ...legacyRedirects.map((r) => ({ ...r, permanent: true })),
        ...goRedirects,
      ];
    },
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "X-Frame-Options", value: "DENY" },
            { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          ],
        },
        {
          source: "/images/:path*",
          headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
        },
      ];
    },
  }),
};

export default nextConfig;
