import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getPosts } from "@/lib/db/queries/blog";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cats = await getCategories();
  const cat = cats.find((c) => c.slug === slug);
  if (!cat) return { title: "Category" };
  return buildMetadata({
    title: `${cat.name} — Blog`,
    description: `Posts in ${cat.name}.`,
    path: `/blog/category/${slug}`,
  });
}

export default async function BlogCategoryPage({ params }: Props) {
  const { slug } = await params;
  const cats = await getCategories();
  const cat = cats.find((c) => c.slug === slug);
  if (!cat) notFound();
  const posts = (await getPosts()).filter((p) => p.category?.slug === slug);

  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Blog", path: "/blog" }, { name: cat.name, path: `/blog/category/${slug}` }])]} />
      <div className="container-x py-16 md:py-24">
        <Link href="/blog" className="font-mono text-xs text-accent">
          ← Blog
        </Link>
        <h1 className="mt-4 font-display text-4xl font-bold">{cat.name}</h1>
        <ul className="mt-12 space-y-6">
          {posts.map((p) => (
            <li key={p.id}>
              <Link href={`/blog/${p.slug}`} className="block hover:text-accent">
                <p className="font-mono text-xs text-fg-subtle">{formatDate(p.publishedAt)}</p>
                <h2 className="font-display text-xl font-semibold">{p.title}</h2>
                <p className="mt-1 text-sm text-fg-muted">{p.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
