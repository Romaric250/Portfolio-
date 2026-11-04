import Link from "next/link";
import { Suspense } from "react";
import { getPosts, getCategories } from "@/lib/db/queries/blog";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { BlogSearchBar, BlogCategoryChips } from "@/components/blog/blog-filters";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Blog",
    description: "Writing on backend engineering, health-tech, security learning, and building in Africa.",
    path: "/blog",
  });
}

type Props = { searchParams: Promise<{ q?: string; page?: string }> };

const PAGE_SIZE = 9;

export default async function BlogIndexPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q ?? "").toLowerCase();
  const page = Math.max(1, Number(sp.page) || 1);
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);
  let filtered = posts;
  if (q) filtered = posts.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
  const featured = filtered.find((p) => p.featured) ?? filtered[0];
  const rest = filtered.filter((p) => p.id !== featured?.id);
  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const slice = rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Blog", path: "/blog" }])]} />
      <div className="container-x py-16 md:py-24">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Blog</h1>
        <div className="mt-8 max-w-xl">
          <Suspense>
            <BlogSearchBar />
          </Suspense>
        </div>
        <div className="mt-6">
          <Suspense>
            <BlogCategoryChips categories={categories} />
          </Suspense>
        </div>
        {featured ? (
          <Link href={`/blog/${featured.slug}`} className="mt-12 block rounded-2xl border border-border bg-terminal p-8 text-terminal-fg md:p-10">
            <p className="font-accent text-xs uppercase tracking-widest text-accent">Featured</p>
            <h2 className="mt-3 font-display text-2xl font-semibold md:text-3xl">{featured.title}</h2>
            <p className="mt-3 text-terminal-fg/75">{featured.excerpt}</p>
          </Link>
        ) : null}
        <ul className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {slice.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`} className="group block h-full rounded-xl border border-border p-6 hover:bg-bg-sunken">
                <p className="font-mono text-xs text-fg-subtle">{formatDate(post.publishedAt)}</p>
                <h2 className="mt-2 font-display font-semibold group-hover:text-accent">{post.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-fg-muted">{post.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
        {totalPages > 1 ? (
          <nav className="mt-12 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/blog?page=${p}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className={`rounded-full px-3 py-1 font-mono text-xs ${p === page ? "bg-accent text-accent-fg" : "border border-border"}`}
              >
                {p}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </>
  );
}
