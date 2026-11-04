import Link from "next/link";
import { getSecurityEntries } from "@/lib/db/queries/public";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { SecurityLabChecklist } from "@/components/site/security-lab-checklist";
import { enumLabel, formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Security Lab",
    description: "Cybersecurity learning roadmap, logs, and write-ups — honest progress, no invented credentials.",
    path: "/security",
  });
}

export default async function SecurityPage() {
  const entries = await getSecurityEntries();
  const roadmap = entries.filter((e) => e.kind === "ROADMAP");
  const logs = entries.filter((e) => e.kind === "LOG");
  const writeups = entries.filter((e) => e.kind === "WRITEUP" || e.kind === "LAB");

  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Security Lab", path: "/security" }])]} />
      <div className="container-x py-16 md:py-24">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Security Lab</h1>
        <p className="mt-4 max-w-3xl text-fg-muted">
          Specialising in secure backends while actively learning offensive and defensive fundamentals. This section documents
          real progress — not marketing claims.
        </p>
        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <section>
            <h2 className="font-display text-xl font-semibold">Roadmap</h2>
            {roadmap.length ? (
              <ul className="mt-4 space-y-3">
                {roadmap.map((e) => (
                  <li key={e.id} className="rounded-lg border border-border p-4">
                    <Link href={`/security/${e.slug}`} className="font-medium hover:text-accent">
                      {e.title}
                    </Link>
                    <p className="mt-1 text-xs text-fg-subtle">{enumLabel(e.state)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-fg-muted">Roadmap entries coming soon.</p>
            )}
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold">Secure-by-default checklist</h2>
            <SecurityLabChecklist className="mt-4" />
          </section>
        </div>
        <section className="mt-16">
          <h2 className="font-display text-xl font-semibold">Learning log</h2>
          {logs.length ? (
            <ul className="mt-4 divide-y divide-border">
              {logs.map((e) => (
                <li key={e.id} className="py-4">
                  <Link href={`/security/${e.slug}`} className="hover:text-accent">
                    {e.title}
                  </Link>
                  {e.date ? <p className="font-mono text-xs text-fg-subtle">{formatDate(e.date)}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-fg-muted">Logs will appear as learning continues.</p>
          )}
        </section>
        <section className="mt-16">
          <h2 className="font-display text-xl font-semibold">Write-ups & labs</h2>
          {writeups.length ? (
            <ul className="mt-4 space-y-3">
              {writeups.map((e) => (
                <li key={e.id}>
                  <Link href={`/security/${e.slug}`} className="text-accent hover:underline">
                    {e.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-fg-muted">No write-ups published yet.</p>
          )}
        </section>
      </div>
    </>
  );
}
