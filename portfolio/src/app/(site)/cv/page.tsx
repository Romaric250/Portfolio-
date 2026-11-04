import Link from "next/link";
import {
  getSettings,
  getExperience,
  getEducation,
  getSkills,
  getProjects,
  getCertificates,
  getCvSettings,
} from "@/lib/db/queries/public";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, personSchema, profilePageSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { CvSectionNav } from "@/components/site/cv-nav";
import { ExperienceTimeline } from "@/components/site/experience-timeline";
import { formatDate, enumLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "CV — Romaric Lonfonyuy",
    description: "Interactive web CV with downloadable ATS-friendly PDF.",
    path: "/cv",
    type: "profile",
  });
}

export default async function CvPage() {
  const [settings, experience, education, skills, projects, certificates, cvSettings] = await Promise.all([
    getSettings(),
    getExperience(),
    getEducation(),
    getSkills(),
    getProjects(),
    getCertificates(),
    getCvSettings(),
  ]);
  const cvCerts = certificates.filter((c) => c.showOnCv);
  const summary = cvSettings.summary || settings.shortBio;

  return (
    <>
      <JsonLd
        data={[
          personSchema(settings, { certificates: cvCerts }),
          profilePageSchema(settings, "/cv"),
          breadcrumbSchema([{ name: "CV", path: "/cv" }]),
        ]}
      />
      <div className="cv-page container-x grid gap-12 py-16 lg:grid-cols-[160px_1fr] md:py-24">
        <CvSectionNav />
        <div>
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl font-bold">{settings.name}</h1>
              <p className="mt-2 text-lg text-fg-muted">{settings.jobTitle}</p>
              <p className="mt-1 font-mono text-sm text-fg-subtle">{settings.email} · {settings.location}</p>
            </div>
            <Button variant="accent" className="no-print" asChild>
              <Link href="/cv/download">
                <Download className="size-4" />
                Download PDF
              </Link>
            </Button>
          </header>

          <section id="summary" className="cv-section mt-12">
            <h2 className="font-display text-xl font-semibold">Summary</h2>
            <p className="mt-3 text-fg-muted leading-relaxed">{summary}</p>
          </section>

          <section id="experience" className="cv-section mt-12">
            <h2 className="font-display text-xl font-semibold">Experience</h2>
            <div className="mt-6">
              <ExperienceTimeline items={experience.filter((e) => e.showOnCv)} />
            </div>
          </section>

          <section id="education" className="cv-section mt-12">
            <h2 className="font-display text-xl font-semibold">Education</h2>
            <ul className="mt-4 space-y-4">
              {education.map((e) => (
                <li key={e.id}>
                  <p className="font-medium">{e.degree}{e.field ? ` — ${e.field}` : ""}</p>
                  <p className="text-sm text-fg-muted">{e.institution}</p>
                </li>
              ))}
            </ul>
          </section>

          <section id="skills" className="cv-section mt-12">
            <h2 className="font-display text-xl font-semibold">Skills</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {skills.map((s) => (
                <li key={s.id} className="rounded-full bg-bg-sunken px-3 py-1 text-sm">
                  {s.name}
                  <span className="ml-1 text-xs text-fg-subtle">({enumLabel(s.level)})</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="projects" className="cv-section mt-12">
            <h2 className="font-display text-xl font-semibold">Selected projects</h2>
            <ul className="mt-4 space-y-4">
              {projects.slice(0, 6).map((p) => (
                <li key={p.id}>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-sm text-fg-muted">{p.summary}</p>
                </li>
              ))}
            </ul>
          </section>

          <section id="certificates" className="cv-section mt-12">
            <h2 className="font-display text-xl font-semibold">Certifications</h2>
            {cvCerts.length ? (
              <ul className="mt-4 space-y-2 text-sm">
                {cvCerts.map((c) => (
                  <li key={c.id}>
                    {c.title} — {c.issuer} ({formatDate(c.issueDate)})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-fg-muted">Certificates flagged for CV will appear here.</p>
            )}
          </section>

          <p className="cv-section mt-12 text-sm text-fg-muted">{cvSettings.referencesNote}</p>
        </div>
      </div>
    </>
  );
}
