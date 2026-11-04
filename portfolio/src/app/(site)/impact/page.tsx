import { getCommunity, getAwards } from "@/lib/db/queries/public";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, organizationSchemas } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { enumLabel } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Beyond the Code",
    description: "Tech4Girls, TIC Summit, teaching, and community leadership — honest impact without inflated metrics.",
    path: "/impact",
  });
}

export default async function ImpactPage() {
  const [community, awards] = await Promise.all([getCommunity(), getAwards()]);

  return (
    <>
      <JsonLd data={[...organizationSchemas(), breadcrumbSchema([{ name: "Beyond the Code", path: "/impact" }])]} />
      <div className="container-x py-16 md:py-24">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Beyond the Code</h1>
        <p className="mt-4 max-w-3xl text-fg-muted">
          Community leadership and teaching matter to me — but they sit alongside engineering work, not instead of it. Numbers cited
          here are the ones I can stand behind (e.g. 500+ girls via Tech4Girls, 5,000+ learners at TIC Summit 2026).
        </p>
        <ul className="mt-12 space-y-10">
          {community.map((entry) => (
            <li key={entry.id} id={entry.slug} className="scroll-mt-24 rounded-2xl border border-border p-6 md:p-8">
              <p className="font-accent text-xs uppercase tracking-wider text-fg-subtle">{enumLabel(entry.kind)}</p>
              <h2 className="mt-2 font-display text-2xl font-semibold">{entry.title}</h2>
              <p className="text-sm text-fg-muted">{entry.organisation}{entry.role ? ` · ${entry.role}` : ""}</p>
              {entry.period ? <p className="font-mono text-xs text-fg-subtle">{entry.period}</p> : null}
              <p className="mt-4 text-fg-muted">{entry.summary}</p>
              {entry.metricLabel && entry.metricValue ? (
                <p className="mt-4 font-display text-lg font-semibold text-accent">
                  {entry.metricValue} {entry.metricLabel}
                </p>
              ) : null}
              {entry.highlights.length ? (
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-fg-muted">
                  {entry.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
        {awards.length ? (
          <section className="mt-16">
            <h2 className="font-display text-xl font-semibold">Recognition</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {awards.map((a) => (
                <li key={a.id}>
                  <span className="font-medium">{a.title}</span>
                  {a.year ? <span className="text-fg-subtle"> · {a.year}</span> : null}
                  {a.description ? <p className="text-fg-muted">{a.description}</p> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
