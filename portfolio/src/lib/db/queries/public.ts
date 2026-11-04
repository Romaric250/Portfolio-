import "server-only";
import type {
  Award,
  Certificate,
  CertificateCategory,
  ClientWork,
  CommunityEntry,
  Education,
  Experience,
  Project,
  SecurityLabEntry,
  Service,
  ServiceFaq,
  SiteSettings,
  Skill,
  Testimonial,
  CvSettings,
  MediaAsset,
  MediaSlot,
} from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { cached, TAGS } from "@/lib/cache";
import { SITE } from "@/lib/seo/site";
import { asDate } from "@/lib/utils";

async function safe<T>(fn: () => Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(`[db:${label}]`, error instanceof Error ? error.message : error);
    return fallback;
  }
}

/* ───────────── Settings ───────────── */

export const DEFAULT_SETTINGS: SiteSettings = {
  id: "default",
  key: "default",
  name: SITE.name,
  alternateNames: [...SITE.alternateNames],
  headline: SITE.headline,
  tagline: SITE.tagline,
  bio: "",
  shortBio: SITE.description,
  location: SITE.location,
  availability: "Available for select projects",
  availabilityOpen: true,
  email: SITE.email,
  phone: null,
  bookingUrl: null,
  githubUrl: SITE.github,
  linkedinUrl: SITE.linkedin,
  xUrl: SITE.x,
  whatsappUrl: null,
  siteUrl: SITE.url,
  defaultSeoTitle: SITE.defaultTitle,
  defaultSeoDescription: SITE.description,
  defaultKeywords: [...SITE.keywords],
  googleVerification: null,
  bingVerification: null,
  ogImageUrl: null,
  ogImageKey: null,
  accentHue: 160,
  featureFlags: null,
  jobTitle: SITE.jobTitle,
  worksFor: null,
  nowText: "",
  usesText: "",
  createdAt: new Date(0),
  updatedAt: new Date(0),
};

export const getSettings = cached(
  async (): Promise<SiteSettings> =>
    safe(
      async () => (await prisma.siteSettings.findUnique({ where: { key: "default" } })) ?? DEFAULT_SETTINGS,
      DEFAULT_SETTINGS,
      "settings",
    ),
  ["settings"],
  [TAGS.settings],
);

/* ───────────── Projects ───────────── */

export const getProjects = cached(
  async (): Promise<Project[]> =>
    safe(
      () =>
        prisma.project.findMany({
          where: { status: "PUBLISHED" },
          orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
        }),
      [],
      "projects",
    ),
  ["projects"],
  [TAGS.projects],
);

export const getFeaturedProjects = cached(
  async (): Promise<Project[]> =>
    safe(
      () =>
        prisma.project.findMany({
          where: { status: "PUBLISHED", featured: true },
          orderBy: [{ order: "asc" }],
          take: 4,
        }),
      [],
      "featured-projects",
    ),
  ["featured-projects"],
  [TAGS.projects],
);

export const getProjectBySlug = cached(
  async (slug: string): Promise<Project | null> =>
    safe(() => prisma.project.findFirst({ where: { slug, status: "PUBLISHED" } }), null, "project"),
  ["project"],
  [TAGS.projects],
);

export async function getAdjacentProjects(slug: string): Promise<{ prev: Project | null; next: Project | null }> {
  const all = await getProjects();
  const idx = all.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return { prev: all[idx - 1] ?? null, next: all[idx + 1] ?? null };
}

/* ───────────── Client work ───────────── */

export const getClientWork = cached(
  async (): Promise<ClientWork[]> =>
    safe(
      () => prisma.clientWork.findMany({ where: { status: "PUBLISHED" }, orderBy: [{ featured: "desc" }, { order: "asc" }] }),
      [],
      "client-work",
    ),
  ["client-work"],
  [TAGS.clientWork],
);

/* ───────────── Services ───────────── */

export type ServiceWithFaqs = Service & { faqs: ServiceFaq[] };

export const getServices = cached(
  async (): Promise<ServiceWithFaqs[]> =>
    safe(
      () =>
        prisma.service.findMany({
          where: { status: "PUBLISHED" },
          orderBy: [{ order: "asc" }],
          include: { faqs: { orderBy: { order: "asc" } } },
        }),
      [],
      "services",
    ),
  ["services"],
  [TAGS.services],
);

export const getServiceBySlug = cached(
  async (slug: string): Promise<ServiceWithFaqs | null> =>
    safe(
      () =>
        prisma.service.findFirst({
          where: { slug, status: "PUBLISHED" },
          include: { faqs: { orderBy: { order: "asc" } } },
        }),
      null,
      "service",
    ),
  ["service"],
  [TAGS.services],
);

/* ───────────── Skills ───────────── */

export const getSkills = cached(
  async (): Promise<Skill[]> =>
    safe(
      () => prisma.skill.findMany({ where: { status: "PUBLISHED" }, orderBy: [{ domain: "asc" }, { order: "asc" }] }),
      [],
      "skills",
    ),
  ["skills"],
  [TAGS.skills],
);

/* ───────────── Security lab ───────────── */

export const getSecurityEntries = cached(
  async (): Promise<SecurityLabEntry[]> =>
    safe(
      () =>
        prisma.securityLabEntry.findMany({
          where: { status: "PUBLISHED" },
          orderBy: [{ kind: "asc" }, { order: "asc" }, { date: "desc" }],
        }),
      [],
      "security",
    ),
  ["security"],
  [TAGS.security],
);

export const getSecurityEntryBySlug = cached(
  async (slug: string): Promise<SecurityLabEntry | null> =>
    safe(() => prisma.securityLabEntry.findFirst({ where: { slug, status: "PUBLISHED" } }), null, "security-entry"),
  ["security-entry"],
  [TAGS.security],
);

/* ───────────── Experience / education ───────────── */

export const getExperience = cached(
  async (): Promise<Experience[]> =>
    safe(
      () =>
        prisma.experience.findMany({
          where: { status: "PUBLISHED" },
          orderBy: [{ order: "asc" }, { startDate: "desc" }],
        }),
      [],
      "experience",
    ),
  ["experience"],
  [TAGS.experience],
);

export const getEducation = cached(
  async (): Promise<Education[]> =>
    safe(
      () => prisma.education.findMany({ where: { status: "PUBLISHED" }, orderBy: [{ order: "asc" }, { startYear: "desc" }] }),
      [],
      "education",
    ),
  ["education"],
  [TAGS.education],
);

/* ───────────── Certificates ───────────── */

export type CertificateWithCategory = Certificate & { category: CertificateCategory };
export type CategoryWithCount = CertificateCategory & { count: number };

export const getCertificateCategories = cached(
  async (): Promise<CategoryWithCount[]> =>
    safe(
      async () => {
        const cats = await prisma.certificateCategory.findMany({
          orderBy: [{ isDefault: "desc" }, { order: "asc" }],
          include: { _count: { select: { certificates: { where: { status: "PUBLISHED" } } } } },
        });
        return cats.map(({ _count, ...c }) => ({ ...c, count: _count.certificates }));
      },
      [],
      "certificate-categories",
    ),
  ["certificate-categories"],
  [TAGS.certificateCategories, TAGS.certificates],
);

export const getCertificates = cached(
  async (): Promise<CertificateWithCategory[]> =>
    safe(
      () =>
        prisma.certificate.findMany({
          where: { status: "PUBLISHED" },
          orderBy: [{ order: "asc" }, { issueDate: "desc" }],
          include: { category: true },
        }),
      [],
      "certificates",
    ),
  ["certificates"],
  [TAGS.certificates, TAGS.certificateCategories],
);

export const getCertificateBySlug = cached(
  async (slug: string): Promise<CertificateWithCategory | null> =>
    safe(
      () => prisma.certificate.findFirst({ where: { slug, status: "PUBLISHED" }, include: { category: true } }),
      null,
      "certificate",
    ),
  ["certificate"],
  [TAGS.certificates],
);

export async function getLatestTechCertificates(take = 4): Promise<CertificateWithCategory[]> {
  const all = await getCertificates();
  const tech = all.filter((c) => c.category.isDefault);
  const featured = tech.filter((c) => c.featured);
  const pool = featured.length >= take ? featured : tech;
  return [...pool]
    .sort((a, b) => (asDate(b.issueDate)?.getTime() ?? 0) - (asDate(a.issueDate)?.getTime() ?? 0))
    .slice(0, take);
}

/* ───────────── Awards / community / testimonials ───────────── */

export const getAwards = cached(
  async (): Promise<Award[]> =>
    safe(
      () => prisma.award.findMany({ where: { status: "PUBLISHED" }, orderBy: [{ order: "asc" }, { year: "desc" }] }),
      [],
      "awards",
    ),
  ["awards"],
  [TAGS.awards],
);

export const getCommunity = cached(
  async (): Promise<CommunityEntry[]> =>
    safe(
      () =>
        prisma.communityEntry.findMany({
          where: { status: "PUBLISHED" },
          orderBy: [{ featured: "desc" }, { order: "asc" }],
        }),
      [],
      "community",
    ),
  ["community"],
  [TAGS.community],
);

export const getTestimonials = cached(
  async (): Promise<Testimonial[]> =>
    safe(
      () => prisma.testimonial.findMany({ where: { status: "PUBLISHED" }, orderBy: [{ order: "asc" }] }),
      [],
      "testimonials",
    ),
  ["testimonials"],
  [TAGS.testimonials],
);

/* ───────────── CV ───────────── */

export const DEFAULT_CV: CvSettings = {
  id: "default",
  key: "default",
  fileName: "Romaric-Lonfonyuy-CV.pdf",
  useUploadedCv: false,
  uploadedUrl: null,
  uploadedKey: null,
  uploadedAt: null,
  summary: "",
  referencesNote: "References available on request.",
  includeCommunity: true,
  includeAwards: true,
  createdAt: new Date(0),
  updatedAt: new Date(0),
};

export const getCvSettings = cached(
  async (): Promise<CvSettings> =>
    safe(
      async () => (await prisma.cvSettings.findUnique({ where: { key: "default" } })) ?? DEFAULT_CV,
      DEFAULT_CV,
      "cv",
    ),
  ["cv"],
  [TAGS.cv],
);

/* ───────────── Media slots ───────────── */

export const getMediaBySlot = cached(
  async (slot: MediaSlot): Promise<MediaAsset[]> =>
    safe(() => prisma.mediaAsset.findMany({ where: { slot }, orderBy: { slotIndex: "asc" } }), [], "media"),
  ["media-slot"],
  [TAGS.media],
);

export async function getSlotImage(slot: MediaSlot): Promise<MediaAsset | null> {
  const items = await getMediaBySlot(slot);
  return items[0] ?? null;
}
