"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { motion, useReducedMotion } from "framer-motion";
import { MoonStarIcon, SunIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const reduce = useReducedMotion();

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      className={cn(
        "relative inline-flex size-10 items-center justify-center overflow-hidden rounded-full text-fg transition-colors hover:bg-bg-sunken focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className,
      )}
    >
      <motion.span
        key={isDark ? "dark" : "light"}
        initial={reduce ? false : { rotate: -60, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="inline-flex"
      >
        {isDark ? <MoonStarIcon className="size-[18px]" /> : <SunIcon className="size-[18px]" />}
      </motion.span>
    </button>
  );
}
