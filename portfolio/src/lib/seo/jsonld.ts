import type {
  Award,
  Certificate,
  CertificateCategory,
  Education,
  Project,
  Service,
  ServiceFaq,
  SiteSettings,
} from "@prisma/client";
import { SITE } from "@/lib/seo/site";
import { absoluteUrl, stripHtml, toIso, truncate } from "@/lib/utils";
import type { PostWithRelations } from "@/lib/db/queries/blog";

// Minimal typed JSON-LD shapes (schema.org is open-ended; we keep these honest and small).
export type JsonLd = Record<string, unknown> & { "@type": string | string[] };

export const PERSON_ID = `${SITE.url}/#person`;
export const WEBSITE_ID = `${SITE.url}/#website`;
export const ORG_ID = `${SITE.url}/#professional-service`;

export function personSchema(
  settings: SiteSettings,
  extras: { awards?: Award[]; education?: Education[]; certificates?: Array<Certificate & { category: CertificateCategory }>; imageUrl?: string | null } = {},
): JsonLd {
  const sameAs = [settings.githubUrl, settings.linkedinUrl, settings.xUrl, SITE.url].filter((s): s is string => Boolean(s));
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: settings.name,
    alternateName: settings.alternateNames,
    url: SITE.url,
    image: extras.imageUrl ?? `${SITE.url}/opengraph-image`,
    email: `mailto:${settings.email}`,
    jobTitle: settings.jobTitle,
    description: settings.shortBio || SITE.description,
    nationality: { "@type": "Country", name: "Cameroon" },
    homeLocation: { "@type": "Place", name: "Accra, Ghana" },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Ashesi University", url: SITE.organisations.ashesi.url },
      { "@type": "EducationalOrganization", name: "Holberton School / ALX" },
    ],
    affiliation: [
      { "@type": "Organization", name: "Mastercard Foundation Scholars Program" },
      { "@type": "Organization", name: "Tech4Girls Cameroon", url: `${SITE.url}/impact#tech4girls`, founder: { "@id": PERSON_ID } },
      { "@type": "Organization", name: "Skaleway", url: `${SITE.url}/impact#skaleway` },
    ],
    worksFor: settings.worksFor ? { "@type": "Organization", name: settings.worksFor } : undefined,
    knowsAbout: [
      "Backend engineering",
      "API design",
      "Cybersecurity",
      "Health informatics",
      "OpenMRS",
      "OpenHIM",
      "DHIS2",
      "Artificial intelligence",
      "Accessibility technology",
      "Python",
      "TypeScript",
      "Node.js",
      "Web development for SMEs",
    ],
    knowsLanguage: ["en", "fr"],
    award: extras.awards?.map((a) => a.title),
    hasCredential: extras.certificates?.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      "@id": `${SITE.url}/certificates/${c.slug}#credential`,
      name: c.title,
      credentialCategory: c.category.name,
      recognizedBy: { "@type": "Organization", name: c.issuer, url: c.issuerUrl ?? undefined },
      url: `${SITE.url}/certificates/${c.slug}`,
    })),
    sameAs,
  };
}

export function websiteSchema(settings: SiteSettings): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE.url,
    name: settings.name,
    description: settings.defaultSeoDescription || SITE.description,
    publisher: { "@id": PERSON_ID },
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE.url}/blog?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function profilePageSchema(settings: SiteSettings, path = "/"): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE.url}${path}#profile`,
    url: `${SITE.url}${path}`,
    name: `${settings.name} — ${settings.headline}`,
    mainEntity: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
    dateModified: toIso(settings.updatedAt),
  };
}

export function professionalServiceSchema(settings: SiteSettings, services: Array<Service & { faqs?: ServiceFaq[] }>): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: `${settings.name} — Engineering & Web Services`,
    url: `${SITE.url}/services`,
    founder: { "@id": PERSON_ID },
    email: settings.email,
    areaServed: [
      { "@type": "Country", name: "Cameroon" },
      { "@type": "Country", name: "Ghana" },
      { "@type": "Place", name: "Remote" },
    ],
    priceRange: "$$",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: truncate(s.description, 200),
          url: `${SITE.url}/services/${s.slug}`,
          provider: { "@id": PERSON_ID },
        },
      })),
    },
  };
}

export function serviceSchema(service: Service & { faqs: ServiceFaq[] }): JsonLd[] {
  const out: JsonLd[] = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${SITE.url}/services/${service.slug}#service`,
      name: service.title,
      description: service.description,
      url: `${SITE.url}/services/${service.slug}`,
      serviceType: service.title,
      provider: { "@id": PERSON_ID },
      areaServed: ["Cameroon", "Ghana", "Remote"],
      offers: service.startingFrom ? { "@type": "Offer", description: service.startingFrom } : undefined,
    },
  ];
  if (service.faqs.length) {
    out.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: service.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }
  return out;
}

export function projectSchema(project: Project): JsonLd {
  const isSoftware = project.liveUrl || project.repoUrl;
  return {
    "@context": "https://schema.org",
    "@type": isSoftware ? "SoftwareApplication" : "CreativeWork",
    "@id": `${SITE.url}/projects/${project.slug}#work`,
    name: project.title,
    description: project.summary,
    url: `${SITE.url}/projects/${project.slug}`,
    image: project.coverUrl ?? `${SITE.url}/projects/${project.slug}/opengraph-image`,
    author: { "@id": PERSON_ID },
    creator: { "@id": PERSON_ID },
    dateModified: toIso(project.updatedAt),
    keywords: [...project.stack, ...project.domains.map((d) => d.toLowerCase().replace("_", "-"))].join(", "),
    ...(isSoftware
      ? {
          applicationCategory: "WebApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          sameAs: [project.liveUrl, project.repoUrl].filter(Boolean),
        }
      : {}),
  };
}

export function credentialSchema(c: Certificate & { category: CertificateCategory }): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    "@id": `${SITE.url}/certificates/${c.slug}#credential`,
    name: c.title,
    description: c.description ? stripHtml(c.description) : `${c.title} issued by ${c.issuer} to ${SITE.name}.`,
    url: `${SITE.url}/certificates/${c.slug}`,
    image: c.thumbnailUrl ?? (c.fileType === "IMAGE" ? c.fileUrl : undefined) ?? `${SITE.url}/certificates/${c.slug}/opengraph-image`,
    credentialCategory: c.category.name,
    recognizedBy: { "@type": "Organization", name: c.issuer, url: c.issuerUrl ?? undefined },
    dateCreated: toIso(c.issueDate)?.slice(0, 10),
    validUntil: c.expiryDate && !c.noExpiry ? toIso(c.expiryDate)?.slice(0, 10) : undefined,
    identifier: c.credentialId ?? undefined,
    sameAs: c.credentialUrl ?? undefined,
    about: c.skills.map((s) => ({ "@type": "Thing", name: s })),
    ...(c.hours ? { timeRequired: `PT${c.hours}H` } : {}),
    holder: { "@id": PERSON_ID },
  };
}

export function credentialListSchema(items: Array<Certificate & { category: CertificateCategory }>): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE.url}/certificates#list`,
    name: `Certificates — ${SITE.name}`,
    numberOfItems: items.length,
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: credentialSchema(c),
    })),
  };
}

export function blogPostingSchema(post: PostWithRelations): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE.url}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.excerpt,
    image: post.ogImageUrl ?? post.coverUrl ?? `${SITE.url}/blog/${post.slug}/opengraph-image`,
    url: `${SITE.url}/blog/${post.slug}`,
    datePublished: toIso(post.publishedAt),
    dateModified: toIso(post.updatedAt),
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
    articleSection: post.category?.name,
    keywords: post.tags.map((t) => t.name).join(", "),
    wordCount: post.wordCount,
    timeRequired: `PT${post.readingTime}M`,
    inLanguage: "en",
    isPartOf: post.series ? { "@type": "CreativeWorkSeries", name: post.series.name, url: `${SITE.url}/blog/series/${post.series.slug}` } : undefined,
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function organizationSchemas(): JsonLd[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE.url}/impact#tech4girls`,
      name: "Tech4Girls Cameroon",
      description: "Grassroots initiative founded by Romaric Lonfonyuy that has introduced 500+ girls in Cameroon to technology through curriculum, workshops and mentorship.",
      founder: { "@id": PERSON_ID },
      areaServed: { "@type": "Country", name: "Cameroon" },
      url: `${SITE.url}/impact#tech4girls`,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE.url}/impact#skaleway`,
      name: "Skaleway",
      description: "SME-focused technology startup co-founded by Romaric Lonfonyuy, aligned with Cameroon's Vision 2035.",
      founder: { "@id": PERSON_ID },
      areaServed: { "@type": "Country", name: "Cameroon" },
      url: `${SITE.url}/impact#skaleway`,
    },
  ];
}
