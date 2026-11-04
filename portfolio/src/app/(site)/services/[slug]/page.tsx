import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug, getServices } from "@/lib/db/queries/public";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { ServiceCta } from "@/components/site/service-cta";
import type { Metadata } from "next";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Not found" };
  return buildMetadata({
    title: service.seoTitle ?? service.title,
    description: service.seoDescription ?? service.description,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();
  const processSteps = (service.process as Array<{ title: string; description: string }> | null) ?? [];

  return (
    <>
      <JsonLd data={[...serviceSchema(service), breadcrumbSchema([{ name: "Services", path: "/services" }, { name: service.title, path: `/services/${slug}` }])]} />
      <div className="container-x py-16 md:py-24">
        <Link href="/services" className="font-mono text-xs text-accent">
          ← Services
        </Link>
        <h1 className="mt-6 font-display text-4xl font-bold">{service.title}</h1>
        {service.tagline ? <p className="mt-3 text-lg text-accent">{service.tagline}</p> : null}
        <p className="mt-6 max-w-3xl text-fg-muted">{service.description}</p>
        {service.deliverables.length ? (
          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold">Deliverables</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-fg-muted">
              {service.deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </section>
        ) : null}
        {processSteps.length ? (
          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold">Process</h2>
            <ol className="mt-6 space-y-6">
              {processSteps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="font-accent text-sm font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="mt-1 text-sm text-fg-muted">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
        {service.faqs.length ? (
          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold">FAQs</h2>
            <dl className="mt-6 space-y-6">
              {service.faqs.map((f) => (
                <div key={f.id}>
                  <dt className="font-medium">{f.question}</dt>
                  <dd className="mt-2 text-sm text-fg-muted">{f.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
        <div className="mt-12">
          <ServiceCta label={service.ctaLabel} />
        </div>
      </div>
    </>
  );
}
