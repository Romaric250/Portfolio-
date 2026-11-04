"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certificates", label: "Certificates" },
] as const;

export function CvSectionNav() {
  const [active, setActive] = React.useState<string>("summary");

  React.useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, []);

  return (
    <nav className="no-print sticky top-24 hidden lg:block" aria-label="CV sections">
      <ul className="space-y-2 border-l border-border pl-4 font-mono text-xs">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={cn("text-fg-subtle hover:text-accent", active === s.id && "font-semibold text-accent")}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
