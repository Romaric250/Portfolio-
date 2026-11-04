"use client";

import * as React from "react";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_ITEMS = [
  { id: "secrets", label: "No secrets in client bundles or repos", done: true },
  { id: "auth", label: "Auth flows reviewed before shipping", done: true },
  { id: "input", label: "Validate & sanitize all external input", done: true },
  { id: "deps", label: "Dependency audit in CI (when applicable)", done: false },
  { id: "headers", label: "Security headers on production deploys", done: true },
  { id: "least", label: "Least-privilege API keys & DB access", done: true },
] as const;

export function SecurityLabChecklist({ className }: { className?: string }) {
  const [items, setItems] = React.useState(() =>
    DEFAULT_ITEMS.map((i) => ({ ...i, done: i.done })),
  );

  const toggle = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  };

  return (
    <ul className={cn("space-y-2", className)}>
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => toggle(item.id)}
            className="flex w-full items-start gap-3 rounded-lg border border-border bg-bg-elevated px-4 py-3 text-left text-sm transition-colors hover:bg-bg-sunken"
          >
            {item.done ? (
              <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
            ) : (
              <Circle className="mt-0.5 size-4 shrink-0 text-fg-subtle" aria-hidden />
            )}
            <span className={cn(item.done ? "text-fg-muted line-through" : "text-fg")}>{item.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
