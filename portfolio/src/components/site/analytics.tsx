"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * First-party, cookie-less page-view beacon. No PII, no identifiers.
 * Skips admin/login routes and repeat views of the same path in the same tab session.
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const last = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/login")) return;
    if (last.current === pathname) return;
    last.current = pathname;
    try {
      const key = `pv:${pathname}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* storage blocked — still count */
    }
    const body = JSON.stringify({ path: pathname, referrer: document.referrer || null });
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/analytics", blob);
    else void fetch("/api/analytics", { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } });
  }, [pathname]);

  return null;
}
