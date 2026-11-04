"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TocItem = { id: string; text: string; level: number };

export function PostToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = React.useState(items[0]?.id ?? "");

  React.useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-10% 0px -70% 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav className="no-print sticky top-24 hidden xl:block" aria-label="Table of contents">
      <p className="font-accent text-xs uppercase tracking-widest text-fg-subtle">On this page</p>
      <ul className="mt-3 space-y-2 border-l border-border pl-3 text-sm">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: (item.level - 2) * 8 }}>
            <a href={`#${item.id}`} className={cn("text-fg-muted hover:text-accent", active === item.id && "font-medium text-accent")}>
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function extractToc(html: string): TocItem[] {
  const items: TocItem[] = [];
  const re = /<h([2-4])[^>]*id="([^"]+)"[^>]*>(.*?)<\/h\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const id = m[2];
    const text = m[3]?.replace(/<[^>]+>/g, "") ?? "";
    if (id) items.push({ level: Number(m[1]), id, text });
  }
  return items;
}
