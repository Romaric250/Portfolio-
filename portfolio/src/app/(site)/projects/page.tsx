import Link from "next/link";
import { Suspense } from "react";
import { getProjects } from "@/lib/db/queries/public";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { ProjectFilters } from "@/components/site/project-filters";
import { MediaSlotImage } from "@/components/site/media-slot";
import { enumLabel } from "@/lib/utils";
import type { ProjectDomain } from "@prisma/client";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Projects",
    description: "Flagship health-tech, AI accessibility, EdTech, and web systems — with honest architecture notes.",
    path: "/projects",
  });
}

type Props = { searchParams: Promise<{ domain?: string }> };

export default async function ProjectsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const domain = sp.domain as ProjectDomain | undefined;
  const all = await getProjects();
  const projects = domain ? all.filter((p) => p.domains.includes(domain)) : all;

  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Projects", path: "/projects" }])]} />
      <div className="container-x py-16 md:py-24">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Projects</h1>
        <p className="mt-4 max-w-2xl text-fg-muted">Filter by domain. Each case study includes problem, approach, stack, and schematic diagrams where applicable.</p>
        <div className="mt-8">
          <Suspense>
            <ProjectFilters />
          </Suspense>
        </div>
        <ul className="mt-12 space-y-8">
          {projects.map((p) => (
            <li key={p.id}>
              <Link href={`/projects/${p.slug}`} className="grid gap-6 rounded-2xl border border-border p-4 transition-colors hover:bg-bg-sunken md:grid-cols-[240px_1fr] md:p-6">
                <MediaSlotImage url={p.coverUrl} alt={p.coverAlt ?? p.title} className="aspect-video rounded-xl md:aspect-square" />
                <div>
                  <p className="font-accent text-xs uppercase tracking-wider text-fg-subtle">{p.domains.map(enumLabel).join(" · ")}</p>
                  <h2 className="mt-2 font-display text-xl font-semibold">{p.title}</h2>
                  <p className="mt-2 text-sm text-fg-muted">{p.summary}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {!projects.length ? <p className="mt-12 text-sm text-fg-muted">No projects in this domain yet.</p> : null}
      </div>
    </>
  );
}
