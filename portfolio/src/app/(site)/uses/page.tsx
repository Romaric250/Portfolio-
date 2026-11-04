import { getSettings } from "@/lib/db/queries/public";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Uses",
    description: "Hardware and software Romaric Lonfonyuy uses day to day.",
    path: "/uses",
  });
}

export default async function UsesPage() {
  const settings = await getSettings();
  const text =
    settings.usesText ||
    "Editor: Cursor / VS Code · Terminal: Windows Terminal · Languages: TypeScript, Python · Frameworks: Next.js, FastAPI · DB: MongoDB, PostgreSQL · Design: Figma · Notes: Obsidian";

  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Uses", path: "/uses" }])]} />
      <div className="container-x py-16 md:max-w-2xl md:py-24">
        <h1 className="font-display text-4xl font-bold">Uses</h1>
        <div className="mt-8 whitespace-pre-line text-fg-muted leading-relaxed">{text}</div>
      </div>
    </>
  );
}
