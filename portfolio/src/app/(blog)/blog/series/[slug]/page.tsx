import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSeries, getPosts } from "@/lib/db/queries/blog";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import type { Metadata } from "next";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const series = await getAllSeries();
  return series.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const series = await getAllSeries();
  const s = series.find((x) => x.slug === slug);
  if (!s) return { title: "Series" };
  return buildMetadata({
    title: `${s.name} — Series`,
    description: s.description ?? `Blog series: ${s.name}`,
    path: `/blog/series/${slug}`,
  });
}

export default async function BlogSeriesPage({ params }: Props) {
  const { slug } = await params;
  const seriesList = await getAllSeries();
  const series = seriesList.find((s) => s.slug === slug);
  if (!series) notFound();
  const posts = (await getPosts())
    .filter((p) => p.series?.slug === slug)
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));

  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Blog", path: "/blog" }, { name: series.name, path: `/blog/series/${slug}` }])]} />
      <div className="container-x py-16 md:py-24">
        <Link href="/blog" className="font-mono text-xs text-accent">
          ← Blog
        </Link>
        <h1 className="mt-4 font-display text-4xl font-bold">{series.name}</h1>
        {series.description ? <p className="mt-4 max-w-2xl text-fg-muted">{series.description}</p> : null}
        <ol className="mt-12 space-y-4">
          {posts.map((p) => (
            <li key={p.id}>
              <Link href={`/blog/${p.slug}`} className="flex gap-4 hover:text-accent">
                <span className="font-mono text-sm text-fg-subtle">{p.seriesOrder ?? "·"}</span>
                <span className="font-display font-semibold">{p.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
