import { getSettings, getEducation, getSkills, getMediaBySlot } from "@/lib/db/queries/public";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { Section } from "@/components/site/section";
import { MediaSlotImage } from "@/components/site/media-slot";
import { enumLabel } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    title: "About Romaric Lonfonyuy",
    description: settings.shortBio || "Cameroonian backend engineer, Mastercard Scholar at Ashesi University, building secure systems across Africa.",
    path: "/about",
  });
}

export default async function AboutPage() {
  const [settings, education, skills, aboutMedia, gallery] = await Promise.all([
    getSettings(),
    getEducation(),
    getSkills(),
    getMediaBySlot("ABOUT_PORTRAIT"),
    getMediaBySlot("GALLERY"),
  ]);
  const bio =
    settings.bio ||
    "I am a Cameroonian computer science student at Ashesi University (Mastercard Foundation Scholar), building backends, AI systems, and accessible health-tech across Ghana and Cameroon. Cybersecurity is a specialisation I am actively learning — not a claim of mastery.";

  const languages = skills.filter((s) => s.domain === "LANGUAGES");
  const tools = skills.filter((s) => s.domain === "TOOLS").slice(0, 12);

  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "About", path: "/about" }])]} />
      <div className="container-x py-16 md:py-24">
        <header className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="font-accent text-xs uppercase tracking-widest text-accent">Story</p>
            <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">About {settings.name.split(" ")[0]}</h1>
            <p className="mt-6 text-lg leading-relaxed text-fg-muted whitespace-pre-line">{bio}</p>
          </div>
          <MediaSlotImage
            url={aboutMedia[0]?.url}
            alt={aboutMedia[0]?.alt ?? settings.name}
            className="aspect-[4/5] w-full rounded-2xl"
            priority
          />
        </header>

        <Section index="01" as="div" className="py-16" title="Philosophy" eyebrow="Secure by design">
          <p className="max-w-3xl text-fg-muted leading-relaxed">
            I treat every system like it will handle real people&apos;s data tomorrow: explicit trust boundaries, boring defaults,
            and documentation that survives handoffs. Editorial clarity for humans, terminal precision for operators.
          </p>
        </Section>

        <Section index="02" as="div" className="py-16" title="Education" eyebrow="Learning">
          <ul className="space-y-6">
            {education.map((e) => (
              <li key={e.id} className="border-l-2 border-accent pl-4">
                <h3 className="font-display font-semibold">{e.degree}{e.field ? ` — ${e.field}` : ""}</h3>
                <p className="text-sm text-fg-muted">{e.institution}{e.location ? ` · ${e.location}` : ""}</p>
                <p className="font-mono text-xs text-fg-subtle">
                  {e.startYear} – {e.expected ? "Expected" : e.endYear ?? "Present"}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section index="03" as="div" className="py-16" title="Languages & tools" eyebrow="Stack">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-mono text-xs uppercase text-fg-subtle">Languages</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {languages.map((s) => (
                  <li key={s.id} className="rounded-full border border-border px-3 py-1 text-sm">
                    {s.name}
                    <span className="ml-1 text-fg-subtle">· {enumLabel(s.level)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-xs uppercase text-fg-subtle">Tools</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {tools.map((s) => (
                  <li key={s.id} className="rounded-full bg-bg-sunken px-3 py-1 text-sm">
                    {s.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section as="div" className="py-16" title="Interests" eyebrow="Beyond code">
          <p className="max-w-2xl text-fg-muted">
            Community leadership (Tech4Girls, Open Dreams), teaching, hackathons, and exploring how AI can widen access — especially
            for sign-language users and offline-first communities.
          </p>
        </Section>

        {gallery.length ? (
          <Section as="div" className="py-16" title="Gallery" eyebrow="Moments">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((img) => (
                <MediaSlotImage key={img.id} url={img.url} alt={img.alt ?? settings.name} className="aspect-square rounded-xl" />
              ))}
            </div>
          </Section>
        ) : null}
      </div>
    </>
  );
}
