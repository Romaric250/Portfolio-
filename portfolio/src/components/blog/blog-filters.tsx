"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function BlogSearchBar() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  return (
    <form action="/blog" method="get" className="flex gap-2">
      <input
        name="q"
        defaultValue={q}
        placeholder="Search posts…"
        className="h-10 flex-1 rounded-full border border-border bg-bg-elevated px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </form>
  );
}

export function BlogCategoryChips({ categories }: { categories: Array<{ slug: string; name: string; count: number }> }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Chip href="/blog" label="All" />
      {categories.filter((c) => c.count > 0).map((c) => (
        <Chip key={c.slug} href={`/blog/category/${c.slug}`} label={`${c.name} (${c.count})`} />
      ))}
    </div>
  );
}

function Chip({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className={cn("rounded-full border border-border px-3 py-1 font-mono text-xs hover:bg-bg-sunken")}>
      {label}
    </Link>
  );
}
