import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPosts, getRelatedPosts, getSeriesPosts } from "@/lib/db/queries/blog";
import { getSettings } from "@/lib/db/queries/public";
import { buildMetadata } from "@/lib/seo/metadata";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { PostBody } from "@/components/blog/post-body";
import { PostToc, extractToc } from "@/components/blog/post-toc";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { formatDateLong, absoluteUrl } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not found" };
  return buildMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    tags: post.tags.map((t) => t.name),
    image: post.ogImageUrl ?? post.coverUrl,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const [settings, related, all] = await Promise.all([getSettings(), getRelatedPosts(post), getPosts()]);
  const idx = all.findIndex((p) => p.slug === slug);
  const prev = all[idx + 1];
  const next = all[idx - 1];
  const seriesPosts = post.seriesId ? await getSeriesPosts(post.seriesId) : [];
  const toc = extractToc(post.contentHtml);
  const shareUrl = absoluteUrl(`/blog/${slug}`);

  return (
    <>
      <ReadingProgress />
      <JsonLd
        data={[
          blogPostingSchema(post),
          breadcrumbSchema([
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${slug}` },
          ]),
        ]}
      />
      <article className="container-x grid gap-12 py-16 xl:grid-cols-[200px_minmax(0,1fr)_200px] md:py-24">
        <PostToc items={toc} />
        <div className="min-w-0 max-w-3xl xl:col-start-2">
          <header>
            {post.category ? (
              <Link href={`/blog/category/${post.category.slug}`} className="font-accent text-xs uppercase tracking-widest text-accent">
                {post.category.name}
              </Link>
            ) : null}
            <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">{post.title}</h1>
            <p className="mt-4 text-fg-muted">{post.excerpt}</p>
            <p className="mt-4 font-mono text-xs text-fg-subtle">
              {formatDateLong(post.publishedAt)} · {post.readingTime} min read
            </p>
          </header>
          <div className="mt-10">
            <PostBody html={post.contentHtml} />
          </div>
          {post.tags.length ? (
            <ul className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <li key={t.id}>
                  <Link href={`/blog/tag/${t.slug}`} className="rounded-full bg-bg-sunken px-3 py-1 font-mono text-xs">
                    #{t.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-10 flex flex-wrap gap-3 text-sm">
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Share on X
            </a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Share on LinkedIn
            </a>
          </div>
          <aside className="mt-12 rounded-xl border border-border bg-bg-sunken p-6">
            <p className="font-display font-semibold">{settings.name}</p>
            <p className="mt-1 text-sm text-fg-muted">{settings.jobTitle}</p>
            <Link href="/about" className="mt-3 inline-block text-sm text-accent">
              About the author
            </Link>
          </aside>
          {seriesPosts.length > 1 && post.series ? (
            <nav className="mt-10">
              <p className="font-accent text-xs uppercase tracking-widest text-fg-subtle">Series · {post.series.name}</p>
              <ol className="mt-3 space-y-2 text-sm">
                {seriesPosts.map((sp) => (
                  <li key={sp.id}>
                    <Link href={`/blog/${sp.slug}`} className={sp.slug === slug ? "font-semibold text-accent" : "hover:text-accent"}>
                      {sp.seriesOrder}. {sp.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          {related.length ? (
            <section className="mt-12">
              <h2 className="font-display text-lg font-semibold">Related</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link href={`/blog/${r.slug}`} className="text-accent hover:underline">
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          <nav className="mt-12 flex justify-between border-t border-border pt-8 text-sm">
            {prev ? <Link href={`/blog/${prev.slug}`} className="text-accent">← {prev.title}</Link> : <span />}
            {next ? <Link href={`/blog/${next.slug}`} className="text-accent">{next.title} →</Link> : null}
          </nav>
          <div className="mt-12">
            <NewsletterForm source={`blog:${slug}`} />
          </div>
        </div>
        <div className="hidden xl:block" aria-hidden />
      </article>
    </>
  );
}
