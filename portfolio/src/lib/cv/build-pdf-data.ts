import "server-only";
import {
  getSettings,
  getExperience,
  getEducation,
  getSkills,
  getCertificates,
  getCvSettings,
} from "@/lib/db/queries/public";
import { formatDate, formatRange } from "@/lib/utils";
import type { CvPdfData } from "@/lib/cv/pdf-document";

export async function buildCvPdfData(): Promise<CvPdfData> {
  const [settings, experience, education, skills, certificates, cvSettings] = await Promise.all([
    getSettings(),
    getExperience(),
    getEducation(),
    getSkills(),
    getCertificates(),
    getCvSettings(),
  ]);

  return {
    name: settings.name,
    email: settings.email,
    headline: settings.jobTitle,
    summary: cvSettings.summary || settings.shortBio,
    experience: experience
      .filter((e) => e.showOnCv)
      .map((e) => ({
        role: e.role,
        organisation: e.organisation,
        period: formatRange(e.startDate, e.endDate, e.current),
        highlights: e.highlights,
      })),
    education: education.map((e) => ({
      degree: `${e.degree}${e.field ? `, ${e.field}` : ""}`,
      institution: e.institution,
      period: `${e.startYear} – ${e.expected ? "Expected" : e.endYear ?? "Present"}`,
    })),
    skills: skills.filter((s) => s.featured).map((s) => s.name),
    certificates: certificates
      .filter((c) => c.showOnCv)
      .map((c) => ({ title: c.title, issuer: c.issuer, date: formatDate(c.issueDate) })),
    referencesNote: cvSettings.referencesNote,
  };
}
