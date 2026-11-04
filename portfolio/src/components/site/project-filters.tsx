"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ProjectDomain } from "@prisma/client";
import { cn, enumLabel } from "@/lib/utils";

const DOMAINS: ProjectDomain[] = ["AI", "HEALTH_TECH", "ACCESSIBILITY", "EDTECH", "WEB"];

export function ProjectFilters() {
  const searchParams = useSearchParams();
  const active = searchParams.get("domain") ?? "all";

  return (
    <div className="flex flex-wrap gap-2">
      <Chip href="/projects" active={active === "all"} label="All" />
      {DOMAINS.map((d) => (
        <Chip key={d} href={`/projects?domain=${d}`} active={active === d} label={enumLabel(d)} />
      ))}
    </div>
  );
}

function Chip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3 py-1.5 font-mono text-xs",
        active ? "border-accent bg-accent-soft" : "border-border hover:bg-bg-sunken",
      )}
    >
      {label}
    </Link>
  );
}
