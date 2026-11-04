import Link from "next/link";
import { getClientWork } from "@/lib/db/queries/public";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { MediaSlotImage } from "@/components/site/media-slot";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Websites I've built",
    description: "Organisation, SME, and personal sites delivered for clients in Cameroon and Ghana.",
    path: "/work",
  });
}

export default async function WorkPage() {
  const items = await getClientWork();

  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Websites I've built", path: "/work" }])]} />
      <div className="container-x py-16 md:py-24">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Websites I&apos;ve built</h1>
        <p className="mt-4 max-w-2xl text-fg-muted">Client and organisation sites — scope, tech, and live links when public.</p>
        <ul className="mt-12 grid gap-8 md:grid-cols-2">
          {items.map((w) => (
            <li key={w.id} className="overflow-hidden rounded-2xl border border-border">
              <MediaSlotImage url={w.coverUrl} alt={w.coverAlt ?? w.name} className="aspect-video w-full" />
              <div className="p-6">
                <h2 className="font-display text-lg font-semibold">{w.name}</h2>
                <p className="mt-1 text-sm text-fg-muted">{w.scope}</p>
                {w.description ? <p className="mt-3 text-sm text-fg-muted">{w.description}</p> : null}
                {w.tech.length ? (
                  <p className="mt-3 font-mono text-xs text-fg-subtle">{w.tech.join(" · ")}</p>
                ) : null}
                {w.url ? (
                  <Link href={w.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm text-accent">
                    Visit site
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
        {!items.length ? <p className="mt-12 text-sm text-fg-muted">Client work will appear when published.</p> : null}
      </div>
    </>
  );
}
