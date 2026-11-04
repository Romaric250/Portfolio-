"use client";

import * as React from "react";
import Image from "next/image";
import { cn, hashString, seededRandom } from "@/lib/utils";

type MediaSlotImageProps = {
  url?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  children?: React.ReactNode;
};

export function MediaSlotImage({ url, alt, className, priority, sizes = "(max-width: 768px) 100vw, 50vw", children }: MediaSlotImageProps) {
  if (children) {
    return <div className={cn("relative overflow-hidden bg-bg-sunken", className)}>{children}</div>;
  }
  if (url) {
    return (
      <div className={cn("relative overflow-hidden bg-bg-sunken", className)}>
        <Image src={url} alt={alt} fill className="object-cover" sizes={sizes} priority={priority} />
      </div>
    );
  }
  return (
    <div className={cn("relative overflow-hidden bg-bg-sunken", className)} aria-hidden={!alt}>
      <GenerativeCover seed={alt || "placeholder"} title={alt} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

type GenerativeCoverProps = {
  seed: string;
  title?: string;
  className?: string;
};

/** Blueprint-style SVG cover unique per seed. */
export function GenerativeCover({ seed, title, className }: GenerativeCoverProps) {
  const rand = React.useMemo(() => seededRandom(seed), [seed]);
  const hue = hashString(seed) % 360;
  const nodes = React.useMemo(() => {
    const count = 6 + Math.floor(rand() * 8);
    return Array.from({ length: count }, (_, i) => ({
      x: 10 + rand() * 80,
      y: 10 + rand() * 80,
      r: 2 + rand() * 4,
      i,
    }));
  }, [rand]);
  const lines = React.useMemo(() => {
    const count = 8 + Math.floor(rand() * 10);
    return Array.from({ length: count }, (_, i) => ({
      x1: rand() * 100,
      y1: rand() * 100,
      x2: rand() * 100,
      y2: rand() * 100,
      i,
    }));
  }, [rand]);

  return (
    <svg
      className={cn("h-full w-full", className)}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={title ? `Generative cover for ${title}` : undefined}
    >
      <defs>
        <linearGradient id={`grad-${seed.slice(0, 8)}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`hsl(${hue} 35% 92%)`} />
          <stop offset="100%" stopColor={`hsl(${(hue + 40) % 360} 25% 88%)`} />
        </linearGradient>
        <pattern id={`grid-${seed.slice(0, 8)}`} width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M 8 0 L 0 0 0 8" fill="none" stroke={`hsl(${hue} 20% 75%)`} strokeWidth="0.15" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill={`url(#grad-${seed.slice(0, 8)})`} />
      <rect width="100" height="100" fill={`url(#grid-${seed.slice(0, 8)})`} />
      {lines.map((l) => (
        <line key={l.i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={`hsl(${hue} 45% 45%)`} strokeWidth="0.2" opacity="0.35" />
      ))}
      {nodes.map((n) => (
        <circle key={n.i} cx={n.x} cy={n.y} r={n.r} fill="none" stroke={`hsl(${hue} 50% 40%)`} strokeWidth="0.3" opacity="0.6" />
      ))}
      <rect x="8" y="8" width="84" height="84" fill="none" stroke={`hsl(${hue} 40% 50%)`} strokeWidth="0.25" strokeDasharray="2 1" opacity="0.4" />
    </svg>
  );
}

export function CertificatePlaceholder({ title, issuer, className }: { title: string; issuer: string; className?: string }) {
  return (
    <div
      className={cn(
        "relative flex aspect-[4/3] flex-col items-center justify-center gap-2 overflow-hidden border border-border bg-bg-sunken p-6 text-center",
        className,
      )}
    >
      <GenerativeCover seed={`cert-${title}`} title={title} className="absolute inset-0 opacity-40" />
      <div className="relative z-10">
        <p className="font-display text-sm font-semibold text-fg">{title}</p>
        <p className="mt-1 text-xs text-fg-muted">{issuer}</p>
        <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-wider text-fg-subtle">Certificate file coming soon</p>
      </div>
    </div>
  );
}
