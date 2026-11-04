import Link from "next/link";
import { notFound } from "next/navigation";
import { getSecurityEntryBySlug, getSecurityEntries } from "@/lib/db/queries/public";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { enumLabel, formatDateLong } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const entries = await getSecurityEntries();
  return entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getSecurityEntryBySlug(slug);
  if (!entry) return { title: "Not found" };
  return buildMetadata({
    title: entry.title,
    description: entry.summary ?? "Security Lab entry",
    path: `/security/${slug}`,
  });
}

export default async function SecurityEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = await getSecurityEntryBySlug(slug);
  if (!entry) notFound();

  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Security Lab", path: "/security" }, { name: entry.title, path: `/security/${slug}` }])]} />
      <article className="container-x py-16 md:py-24">
        <Link href="/security" className="font-mono text-xs text-accent">
          ← Security Lab
        </Link>
        <p className="mt-6 font-accent text-xs uppercase tracking-widest text-fg-subtle">{enumLabel(entry.kind)} · {enumLabel(entry.state)}</p>
        <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{entry.title}</h1>
        {entry.date ? <p className="mt-2 font-mono text-sm text-fg-subtle">{formatDateLong(entry.date)}</p> : null}
        {entry.summary ? <p className="mt-6 max-w-3xl text-lg text-fg-muted">{entry.summary}</p> : null}
        {entry.bodyHtml ? (
          <div className="prose prose-neutral dark:prose-invert mt-10 max-w-3xl" dangerouslySetInnerHTML={{ __html: entry.bodyHtml }} />
        ) : (
          <p className="mt-10 text-sm text-fg-muted">Full write-up coming soon.</p>
        )}
      </article>
    </>
  );
}
