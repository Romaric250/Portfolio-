import Link from "next/link";
import { getServices } from "@/lib/db/queries/public";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, professionalServiceSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { getSettings } from "@/lib/db/queries/public";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Services",
    description: "Backend engineering, health-tech interoperability, AI products, and websites for organisations and SMEs in Cameroon and Ghana.",
    path: "/services",
  });
}

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);

  return (
    <>
      <JsonLd data={[professionalServiceSchema(settings, services), breadcrumbSchema([{ name: "Services", path: "/services" }])]} />
      <div className="container-x py-16 md:py-24">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Services</h1>
        <p className="mt-4 max-w-2xl text-fg-muted">End-to-end delivery with secure defaults — from SME landing pages to OpenHIM/OpenMRS integrations.</p>
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <li key={s.id}>
              <Link href={`/services/${s.slug}`} className="block h-full rounded-2xl border border-border bg-bg-elevated p-8 transition-colors hover:border-border-strong">
                <h2 className="font-display text-xl font-semibold">{s.title}</h2>
                {s.tagline ? <p className="mt-2 text-sm text-accent">{s.tagline}</p> : null}
                <p className="mt-3 text-sm text-fg-muted line-clamp-3">{s.description}</p>
                {s.startingFrom ? <p className="mt-4 font-mono text-xs text-fg-subtle">From {s.startingFrom}</p> : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
