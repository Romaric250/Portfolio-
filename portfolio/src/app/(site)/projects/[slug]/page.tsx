import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects, getAdjacentProjects } from "@/lib/db/queries/public";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, projectSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { ArchitectureDiagramView } from "@/components/diagrams/architecture";
import { MediaSlotImage } from "@/components/site/media-slot";
import { enumLabel } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return buildMetadata({
    title: project.seoTitle ?? project.title,
    description: project.seoDescription ?? project.summary,
    path: `/projects/${slug}`,
    image: project.coverUrl,
  });
}

export default async function ProjectCaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  const { prev, next } = await getAdjacentProjects(slug);
  const gallery = (project.gallery as Array<{ url?: string; alt?: string }> | null) ?? [];

  return (
    <>
      <JsonLd data={[projectSchema(project), breadcrumbSchema([{ name: "Projects", path: "/projects" }, { name: project.title, path: `/projects/${slug}` }])]} />
      <article className="container-x py-16 md:py-24">
        <p className="font-accent text-xs uppercase tracking-widest text-accent">{project.domains.map(enumLabel).join(" · ")}</p>
        <h1 className="mt-3 max-w-4xl font-display text-4xl font-bold md:text-5xl">{project.title}</h1>
        <p className="mt-6 max-w-3xl text-lg text-fg-muted">{project.summary}</p>
        {project.coverUrl ? (
          <MediaSlotImage url={project.coverUrl} alt={project.coverAlt ?? project.title} className="mt-10 aspect-[21/9] w-full rounded-2xl" priority />
        ) : null}
        <div className="prose prose-neutral dark:prose-invert mt-12 max-w-3xl">
          {project.problem ? (
            <section>
              <h2>Problem</h2>
              <p>{project.problem}</p>
            </section>
          ) : null}
          {project.approach ? (
            <section>
              <h2>Approach</h2>
              <p>{project.approach}</p>
            </section>
          ) : null}
          {project.caseStudyHtml ? <div dangerouslySetInnerHTML={{ __html: project.caseStudyHtml }} /> : null}
        </div>
        {project.diagram !== "NONE" ? (
          <div className="mt-12">
            <ArchitectureDiagramView diagram={project.diagram} />
          </div>
        ) : null}
        {project.stack.length ? (
          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold">Stack</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <li key={s} className="rounded-full bg-bg-sunken px-3 py-1 font-mono text-xs">
                  {s}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {project.role ? (
          <section className="mt-8">
            <h2 className="font-display text-xl font-semibold">Role</h2>
            <p className="mt-2 text-fg-muted">{project.role}</p>
          </section>
        ) : null}
        {project.impact ? (
          <section className="mt-8">
            <h2 className="font-display text-xl font-semibold">Impact</h2>
            <p className="mt-2 text-fg-muted">{project.impact}</p>
          </section>
        ) : null}
        {gallery.length ? (
          <section className="mt-12 grid gap-4 sm:grid-cols-2">
            {gallery.map((g, i) => (
              <MediaSlotImage key={i} url={g.url} alt={g.alt ?? project.title} className="aspect-video rounded-xl" />
            ))}
          </section>
        ) : null}
        <nav className="mt-16 flex flex-wrap justify-between gap-4 border-t border-border pt-8 text-sm">
          {prev ? (
            <Link href={`/projects/${prev.slug}`} className="text-accent hover:underline">
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/projects/${next.slug}`} className="text-accent hover:underline">
              {next.title} →
            </Link>
          ) : null}
        </nav>
      </article>
    </>
  );
}
