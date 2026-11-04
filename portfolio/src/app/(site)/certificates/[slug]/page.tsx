import Link from "next/link";
import { notFound } from "next/navigation";
import { getCertificateBySlug, getCertificates } from "@/lib/db/queries/public";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, credentialSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { CertificatePlaceholder } from "@/components/site/media-slot";
import { formatDateLong } from "@/lib/utils";
import Image from "next/image";
import type { Metadata } from "next";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ category?: string }> };

export async function generateStaticParams() {
  const certs = await getCertificates();
  return certs.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cert = await getCertificateBySlug(slug);
  if (!cert) return { title: "Certificate not found" };
  return buildMetadata({
    title: `${cert.title} | ${cert.issuer} | Romaric Lonfonyuy`,
    description: cert.description ?? `${cert.title} issued by ${cert.issuer}.`,
    path: `/certificates/${slug}`,
    image: cert.thumbnailUrl ?? cert.fileUrl,
  });
}

export default async function CertificateDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const cert = await getCertificateBySlug(slug);
  if (!cert) notFound();
  const all = await getCertificates();
  const related = all.filter((c) => c.id !== cert.id && c.categoryId === cert.categoryId).slice(0, 3);
  const backQs = sp.category ? `?category=${sp.category}` : "";
  const imageUrl = cert.fileType === "IMAGE" ? cert.fileUrl : cert.thumbnailUrl;

  return (
    <>
      <JsonLd data={[credentialSchema(cert), breadcrumbSchema([{ name: "Certificates", path: "/certificates" }, { name: cert.title, path: `/certificates/${slug}` }])]} />
      <article className="container-x py-16 md:py-24">
        <Link href={`/certificates${backQs}`} className="font-mono text-xs text-accent hover:underline">
          ← Back to vault
        </Link>
        <header className="mt-6 max-w-3xl">
          <h1 className="font-display text-3xl font-bold md:text-4xl">{cert.title}</h1>
          <p className="mt-2 text-lg text-fg-muted">{cert.issuer}</p>
          <p className="mt-1 font-mono text-sm text-fg-subtle">Issued {formatDateLong(cert.issueDate)}</p>
        </header>
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="relative min-h-[320px] overflow-hidden rounded-xl border border-border">
            {imageUrl ? (
              <Image src={imageUrl} alt={cert.altText} fill className="object-contain p-4" sizes="(max-width:1024px) 100vw, 50vw" />
            ) : (
              <CertificatePlaceholder title={cert.title} issuer={cert.issuer} className="h-full min-h-[320px] w-full border-0" />
            )}
          </div>
          <div>
            {cert.description ? <div className="prose prose-neutral dark:prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: cert.description }} /> : null}
            {cert.skills.length ? (
              <ul className="mt-6 flex flex-wrap gap-2">
                {cert.skills.map((s) => (
                  <li key={s} className="rounded-full bg-bg-sunken px-3 py-1 font-mono text-xs">
                    {s}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
        {related.length ? (
          <section className="mt-16">
            <h2 className="font-display text-lg font-semibold">Related credentials</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={`/certificates/${r.slug}`} className="text-accent hover:underline">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </>
  );
}
