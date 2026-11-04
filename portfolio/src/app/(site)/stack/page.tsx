import { getSkills } from "@/lib/db/queries/public";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { StackExplorerLazy } from "@/components/site/stack-explorer-lazy";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Stack Explorer",
    description: "Interactive map of languages, backends, health informatics, security topics, and tools — with honest proficiency levels.",
    path: "/stack",
  });
}

export default async function StackPage() {
  const skills = await getSkills();
  const serializable = skills.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    domain: s.domain,
    level: s.level,
    description: s.description,
    builtWith: s.builtWith,
    relatedProjectSlugs: s.relatedProjectSlugs,
  }));

  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Stack", path: "/stack" }])]} />
      <div className="container-x py-16 md:py-24">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Stack Explorer</h1>
        <p className="mt-4 max-w-2xl text-fg-muted">
          Filter by domain and level. C# and several security topics are marked Learning or Exploring — not production claims.
        </p>
        <div className="mt-12">
          <StackExplorerLazy skills={serializable} />
        </div>
      </div>
    </>
  );
}
