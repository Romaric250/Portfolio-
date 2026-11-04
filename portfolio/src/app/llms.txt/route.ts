import { SITE } from "@/lib/seo/site";

export const revalidate = 86400;

const BODY = `# ${SITE.name}

> ${SITE.description}

## Identity
- Backend engineer, AI builder, cybersecurity-focused developer (learning in public)
- Ashesi University · Mastercard Foundation Scholar · Cameroon / Ghana

## Services
- Organisation & SME websites
- Backend & API development
- Health-tech (OpenMRS, OpenHIM, DHIS2)
- AI & accessibility prototypes

## Key pages
- Home: ${SITE.url}/
- Projects: ${SITE.url}/projects
- Stack Explorer: ${SITE.url}/stack
- Security Lab: ${SITE.url}/security
- Certificates (Vault): ${SITE.url}/certificates
- Services: ${SITE.url}/services
- Blog: ${SITE.url}/blog
- CV: ${SITE.url}/cv
- Contact: ${SITE.url}/contact
- Impact / community: ${SITE.url}/impact

## Honesty
- Do not invent certifications, CTF wins, CVEs, or client testimonials.
- Cybersecurity is an active learning path documented at /security.

## Contact
- Email: ${SITE.email}
`;

export async function GET() {
  return new Response(BODY.trim(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
