import { Suspense } from "react";
import Link from "next/link";
import { getCertificateCategories, getCertificates } from "@/lib/db/queries/public";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, credentialListSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { Section } from "@/components/site/section";
import { VaultFilters, filterCertificates } from "@/components/certificates/vault-filters";
import { CertificateVault } from "@/components/certificates/vault";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Certificate Vault",
    description: "Verified tech and leadership credentials — filterable vault with PDF and image viewers.",
    path: "/certificates",
    canonical: "/certificates",
  });
}

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function CertificatesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category : "tech";
  const q = typeof sp.q === "string" ? sp.q : "";
  const year = typeof sp.year === "string" ? sp.year : "";
  const sort = typeof sp.sort === "string" && ["newest", "oldest", "issuer"].includes(sp.sort) ? (sp.sort as "newest" | "oldest" | "issuer") : "newest";
  const featuredFirst = sp.featured === "1";

  const [categories, all] = await Promise.all([getCertificateCategories(), getCertificates()]);
  const filtered = filterCertificates(all, { category, q, year, sort, featuredFirst });
  const years = [...new Set(all.map((c) => c.issueDate.getFullYear()))].sort((a, b) => b - a);
  const issuers = new Set(all.map((c) => c.issuer)).size;
  const hours = all.reduce((sum, c) => sum + (c.hours ?? 0), 0);

  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Certificates", path: "/certificates" }]), credentialListSchema(filtered.length ? filtered : all)]} />
      <div className="container-x py-16 md:py-24">
        <header className="max-w-3xl">
          <p className="font-accent text-xs font-semibold uppercase tracking-widest text-accent">The Vault</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">Certificates</h1>
          <p className="mt-4 text-lg text-fg-muted">Tech credentials by default — leadership and other categories when they exist in the database.</p>
        </header>
        <dl className="mt-10 grid grid-cols-3 gap-4 border-y border-border py-6 font-mono text-sm">
          <div>
            <dt className="text-fg-subtle">Total</dt>
            <dd className="text-2xl font-semibold text-fg">{all.length}</dd>
          </div>
          <div>
            <dt className="text-fg-subtle">Issuers</dt>
            <dd className="text-2xl font-semibold text-fg">{issuers}</dd>
          </div>
          <div>
            <dt className="text-fg-subtle">Learning hours</dt>
            <dd className="text-2xl font-semibold text-fg">{hours > 0 ? hours : "—"}</dd>
          </div>
        </dl>
        <div className="mt-10">
          <Suspense fallback={<p className="text-sm text-fg-muted">Loading filters…</p>}>
            <VaultFilters categories={categories} years={years} activeCategory={category} />
          </Suspense>
        </div>
        <Section className="py-12" as="div">
          {filtered.length ? (
            <Suspense>
              <CertificateVault certificates={filtered} />
            </Suspense>
          ) : (
            <p className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-fg-muted">
              No certificates in this view yet.{" "}
              <Link href="/certificates?category=all" className="text-accent underline-offset-2 hover:underline">
                Browse all certificates
              </Link>
              .
            </p>
          )}
        </Section>
      </div>
    </>
  );
}
