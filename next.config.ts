import type { NextConfig } from "next";
import casinos from "./src/lib/data/casinos.json";

const isStaticExport = process.env.EXPORT === "true";

// Affiliate links keep the /go/<slug>/ shape the WordPress site used, so any
// existing backlinks or bookmarks to them keep working. In the static export
// these live in public/.htaccess (Cloudways) and vercel.json instead.
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
        ...goRedirects,
        { source: "/go/casinofriday", destination: "/go/casino-friday/", permanent: true },
        { source: "/list/:path*", destination: "/parhaat-kasinot/", permanent: true },
        { source: "/kierratysvapaat-bonukset", destination: "/ilmaiskierrokset/", permanent: true },
        { source: "/kierratysvapaat-ilmaiskierrokset", destination: "/ilmaiskierrokset/", permanent: true },
        { source: "/nettikasino-ilman-rekisteroitymista", destination: "/kasino-ilman-rekisteroitymista/", permanent: true },
        { source: "/paras-nettikasino", destination: "/parhaat-kasinot/", permanent: true },
        { source: "/parhaat-nettikasinot", destination: "/parhaat-kasinot/", permanent: true },
        { source: "/homepage", destination: "/", permanent: true },
        { source: "/feed", destination: "/", permanent: true },
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
      ];
    },
  }),
};

export default nextConfig;
