"use client";

import * as React from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

type CountUpProps = {
  to: number;
  from?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
};

function formatValue(value: number, decimals: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function CountUp({ to, from = 0, duration = 1.6, prefix = "", suffix = "", className, decimals = 0 }: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    const write = (n: number) => {
      el.textContent = `${prefix}${formatValue(n, decimals)}${suffix}`;
    };
    if (reduce) {
      write(to);
      return;
    }
    const controls = animate(from, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: write,
    });
    return () => controls.stop();
  }, [inView, from, to, duration, reduce, prefix, suffix, decimals]);

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${to.toLocaleString()}${suffix}`}>
      {prefix}
      {formatValue(reduce ? to : from, decimals)}
      {suffix}
    </span>
  );
}
