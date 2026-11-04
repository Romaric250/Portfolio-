import { getSettings } from "@/lib/db/queries/public";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE } from "@/lib/seo/site";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Now",
    description: "What Romaric Lonfonyuy is focused on right now.",
    path: "/now",
  });
}

export default async function NowPage() {
  const settings = await getSettings();
  const text =
    settings.nowText ||
    "Backend engineering at Ashesi, health-tech integrations, AI accessibility experiments, and deepening cybersecurity fundamentals — learning in public via the Security Lab.";

  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Now", path: "/now" }])]} />
      <div className="container-x py-16 md:max-w-2xl md:py-24">
        <h1 className="font-display text-4xl font-bold">Now</h1>
        <p className="mt-2 font-mono text-xs text-fg-subtle">Updated when focus shifts · {SITE.name}</p>
        <div className="mt-8 whitespace-pre-line text-lg leading-relaxed text-fg-muted">{text}</div>
      </div>
    </>
  );
}
