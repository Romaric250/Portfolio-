import * as React from "react";
import { cn } from "@/lib/utils";

/** "RL" monogram mark — a rounded square with a signal node. Used for favicon, header, OG. */
export function Monogram({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" className={cn("text-fg", className)} aria-hidden {...props}>
      <rect x="2" y="2" width="60" height="60" rx="16" fill="currentColor" />
      <path
        d="M18 44V20h10.5c5 0 8 2.6 8 7 0 3.2-1.8 5.4-4.6 6.3L38 44h-5.6l-5.4-9.6h-4V44H18Zm5-13.7h5.2c2.4 0 3.9-1.3 3.9-3.3s-1.5-3.3-3.9-3.3H23v6.6Z"
        fill="var(--bg, #fafaf7)"
      />
      <path d="M40 44V20h5v19.6h9V44H40Z" fill="var(--bg, #fafaf7)" opacity=".55" />
      <circle cx="50" cy="16" r="4" fill="var(--signal, #10b981)" />
    </svg>
  );
}
