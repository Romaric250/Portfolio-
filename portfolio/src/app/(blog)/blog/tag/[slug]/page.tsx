import Link from "next/link";
import { notFound } from "next/navigation";
import { getTags, getPosts } from "@/lib/db/queries/blog";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tags = await getTags();
  const tag = tags.find((t) => t.slug === slug);
  if (!tag) return { title: "Tag" };
  return buildMetadata({
    title: `#${tag.name} — Blog`,
    description: `Posts tagged ${tag.name}.`,
    path: `/blog/tag/${slug}`,
  });
}

export default async function BlogTagPage({ params }: Props) {
  const { slug } = await params;
  const tags = await getTags();
  const tag = tags.find((t) => t.slug === slug);
  if (!tag) notFound();
  const posts = (await getPosts()).filter((p) => p.tags.some((t) => t.slug === slug));

  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Blog", path: "/blog" }, { name: tag.name, path: `/blog/tag/${slug}` }])]} />
      <div className="container-x py-16 md:py-24">
        <Link href="/blog" className="font-mono text-xs text-accent">
          ← Blog
        </Link>
        <h1 className="mt-4 font-display text-4xl font-bold">#{tag.name}</h1>
        <ul className="mt-12 space-y-6">
          {posts.map((p) => (
            <li key={p.id}>
              <Link href={`/blog/${p.slug}`}>
                <p className="font-mono text-xs text-fg-subtle">{formatDate(p.publishedAt)}</p>
                <h2 className="font-display text-xl font-semibold">{p.title}</h2>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
