import type { NextConfig } from "next";
import legacy from "./legacy-content/old-urls.json" with { type: "json" };

const isDev = process.env.NODE_ENV === "development";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rlonfonyuy.online";
const canonicalHost = new URL(siteUrl).host;

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://utfs.io https://*.ufs.sh https://*.uploadthing.com https://avatars.githubusercontent.com https://github.com https://i.ytimg.com https://api.qrserver.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.ingest.uploadthing.com https://api.uploadthing.com https://uploadthing.com https://*.ufs.sh https://utfs.io https://api.github.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "media-src 'self' https://utfs.io https://*.ufs.sh blob:",
  "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com https://gist.github.com https://utfs.io https://*.ufs.sh",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const legacyRedirects = legacy.urls
  .filter((u) => u.redirect && !u.old.includes("#"))
  .map((u) => ({ source: u.old, destination: u.new, permanent: true }));

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  typedRoutes: false,
  reactCompiler: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "*.ufs.sh" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  serverExternalPackages: ["@prisma/client", "@react-pdf/renderer", "bcryptjs", "shiki", "pdfjs-dist"],
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/(admin|login)(.*)",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
      {
        source: "/api/(admin|auth)(.*)",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
    ];
  },
  async redirects() {
    return [
      // www → canonical host
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${canonicalHost}` }],
        destination: `${siteUrl}/:path*`,
        permanent: true,
      },
      ...legacyRedirects,
    ];
  },
};

export default nextConfig;
