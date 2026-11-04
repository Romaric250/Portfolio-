"use client";

import Script from "next/script";

/**
 * Optional Vercel Analytics + Speed Insights, loaded only when
 * NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS=true. Uses the platform scripts directly
 * (no extra dependency). OFF by default; first-party analytics are the source of truth.
 */
export function VercelAnalytics() {
  return (
    <>
      <Script src="/_vercel/insights/script.js" strategy="lazyOnload" data-sdkn="rl-portfolio" />
      <Script src="/_vercel/speed-insights/script.js" strategy="lazyOnload" />
    </>
  );
}
