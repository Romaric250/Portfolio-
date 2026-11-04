"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import type { CategoryWithCount } from "@/lib/db/queries/public";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Sort = "newest" | "oldest" | "issuer";

type VaultFiltersProps = {
  categories: CategoryWithCount[];
  years: number[];
  activeCategory: string;
};

export function VaultFilters({ categories, years, activeCategory }: VaultFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const year = searchParams.get("year") ?? "";
  const sort = (searchParams.get("sort") as Sort) || "newest";
  const featuredFirst = searchParams.get("featured") === "1";

  const push = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "") params.delete(k);
      else params.set(k, v);
    }
    router.push(`/certificates?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Certificate categories">
        {(() => {
          const visible = categories.filter((c) => c.count > 0);
          const defaultCat = visible.find((c) => c.isDefault) ?? visible[0];
          const rest = visible.filter((c) => c.id !== defaultCat?.id);
          const total = categories.reduce((n, c) => n + c.count, 0);
          const chips: Array<{ href: string; active: boolean; label: string }> = [];
          if (defaultCat) {
            chips.push({
              href: "/certificates",
              active: activeCategory === "tech" || activeCategory === defaultCat.slug || activeCategory === "",
              label: `${defaultCat.name} (${defaultCat.count})`,
            });
          }
          chips.push({
            href: "/certificates?category=all",
            active: activeCategory === "all",
            label: `All (${total})`,
          });
          for (const c of rest) {
            chips.push({
              href: `/certificates?category=${c.slug}`,
              active: activeCategory === c.slug,
              label: `${c.name} (${c.count})`,
            });
          }
          return chips.map((c) => <FilterChip key={c.href} {...c} />);
        })()}
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-subtle" aria-hidden />
          <Input
            defaultValue={q}
            placeholder="Search title, issuer, skills…"
            className="pl-9"
            onKeyDown={(e) => {
              if (e.key === "Enter") push({ q: (e.target as HTMLInputElement).value });
            }}
          />
        </div>
        <select
          className="h-10 rounded-full border border-border bg-bg-elevated px-3 font-mono text-xs"
          value={year}
          onChange={(e) => push({ year: e.target.value || null })}
          aria-label="Filter by year"
        >
          <option value="">All years</option>
          {years.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>
        <select
          className="h-10 rounded-full border border-border bg-bg-elevated px-3 font-mono text-xs"
          value={sort}
          onChange={(e) => push({ sort: e.target.value })}
          aria-label="Sort order"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="issuer">Issuer</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="featured-first"
          checked={featuredFirst}
          onCheckedChange={(v) => push({ featured: v ? "1" : null })}
        />
        <Label htmlFor="featured-first" className="text-sm text-fg-muted">
          Featured first
        </Label>
      </div>
    </div>
  );
}

function FilterChip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
        active ? "border-accent bg-accent-soft text-fg" : "border-border bg-bg-elevated text-fg-muted hover:bg-bg-sunken",
      )}
    >
      {label}
    </Link>
  );
}

export function filterCertificates<
  T extends {
    title: string;
    issuer: string;
    skills: string[];
    issueDate: Date;
    featured: boolean;
    category: { slug: string; isDefault: boolean };
  },
>(
  items: T[],
  opts: { category: string; q: string; year: string; sort: Sort; featuredFirst: boolean },
): T[] {
  let out = [...items];
  if (opts.category === "tech") {
    out = out.filter((c) => c.category.isDefault);
  } else if (opts.category !== "all") {
    out = out.filter((c) => c.category.slug === opts.category);
  }
  if (opts.q.trim()) {
    const needle = opts.q.toLowerCase();
    out = out.filter(
      (c) =>
        c.title.toLowerCase().includes(needle) ||
        c.issuer.toLowerCase().includes(needle) ||
        c.skills.some((s) => s.toLowerCase().includes(needle)),
    );
  }
  if (opts.year) {
    const y = Number(opts.year);
    out = out.filter((c) => c.issueDate.getFullYear() === y);
  }
  out.sort((a, b) => {
    if (opts.featuredFirst && a.featured !== b.featured) return Number(b.featured) - Number(a.featured);
    if (opts.sort === "issuer") return a.issuer.localeCompare(b.issuer);
    const ta = a.issueDate.getTime();
    const tb = b.issueDate.getTime();
    return opts.sort === "oldest" ? ta - tb : tb - ta;
  });
  return out;
}
