import { getSettings } from "@/lib/db/queries/public";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { ContactForm } from "@/components/site/contact-form";
import { SITE } from "@/lib/seo/site";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Contact",
    description: `Contact ${SITE.name} for backend engineering, health-tech, or website projects.`,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Contact", path: "/contact" }])]} />
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 md:py-24">
        <div>
          <h1 className="font-display text-4xl font-bold">Contact</h1>
          <p className="mt-4 text-fg-muted">Tell me about your project, timeline, and constraints. I read every message.</p>
          <dl className="mt-8 space-y-3 font-mono text-sm">
            <div>
              <dt className="text-fg-subtle">Email</dt>
              <dd>
                <a href={`mailto:${settings.email}`} className="text-accent hover:underline">
                  {settings.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-fg-subtle">Location</dt>
              <dd>{settings.location}</dd>
            </div>
          </dl>
        </div>
        <ContactForm bookingUrl={settings.bookingUrl} />
      </div>
    </>
  );
}
