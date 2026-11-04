import "dotenv/config";
import {
  PrismaClient,
  type ArchitectureDiagram,
  type CommunityKind,
  type ContentStatus,
  type PostStatus,
  type ProjectDomain,
  type ProjectStatus,
  type SecurityEntryState,
  type SkillDomain,
  type SkillLevel,
} from "@prisma/client";
import { SITE } from "../src/lib/seo/site";
import { slugify } from "../src/lib/utils";

const prisma = new PrismaClient();

const BIO =
  "Backend Software Engineer, AI builder, and grassroots technology leader with 3+ years building and shipping production software across healthcare, education, and accessibility. Founder of Tech4Girls Cameroon, co-founder of Skaleway, Mastercard Foundation Scholar at Ashesi University.";

const NOW_TEXT =
  "Studying computer science at Ashesi University, building health-tech backends (nBogne, hospital platforms), and learning cybersecurity and C# in public.";

const USES_TEXT =
  "VS Code and Cursor, Git, Docker, Linux, Notion, and GitHub for day-to-day engineering, writing, and collaboration.";

async function seedSiteSettings(): Promise<void> {
  await prisma.siteSettings.upsert({
    where: { key: "default" },
    create: {
      key: "default",
      name: "Romaric Lonfonyuy",
      alternateNames: [...SITE.alternateNames],
      headline: "Backend engineer. AI builder. Security-minded.",
      tagline: "I build secure, intelligent systems that work where the internet doesn't.",
      bio: BIO,
      shortBio: SITE.description,
      email: "romaric.lonfonyuy@ashesi.edu.gh",
      githubUrl: "https://github.com/Romaric250",
      linkedinUrl: "https://linkedin.com/in/romaric-lonfonyuy",
      xUrl: "https://x.com/romaric250",
      siteUrl: "https://rlonfonyuy.online",
      jobTitle: "Backend Engineer, AI Builder & Cybersecurity-focused Developer",
      location: "Accra, Ghana · Yaoundé, Cameroon",
      nowText: NOW_TEXT,
      usesText: USES_TEXT,
      defaultKeywords: [...SITE.keywords],
      defaultSeoTitle: SITE.defaultTitle,
      defaultSeoDescription: SITE.description,
      availability: "Available for select projects",
      availabilityOpen: true,
    },
    update: {
      name: "Romaric Lonfonyuy",
      alternateNames: [...SITE.alternateNames],
      headline: "Backend engineer. AI builder. Security-minded.",
      tagline: "I build secure, intelligent systems that work where the internet doesn't.",
      bio: BIO,
      shortBio: SITE.description,
      email: "romaric.lonfonyuy@ashesi.edu.gh",
      githubUrl: "https://github.com/Romaric250",
      linkedinUrl: "https://linkedin.com/in/romaric-lonfonyuy",
      xUrl: "https://x.com/romaric250",
      siteUrl: "https://rlonfonyuy.online",
      jobTitle: "Backend Engineer, AI Builder & Cybersecurity-focused Developer",
      location: "Accra, Ghana · Yaoundé, Cameroon",
      nowText: NOW_TEXT,
      usesText: USES_TEXT,
      defaultKeywords: [...SITE.keywords],
      defaultSeoTitle: SITE.defaultTitle,
      defaultSeoDescription: SITE.description,
      availability: "Available for select projects",
      availabilityOpen: true,
    },
  });
}

async function seedCvSettings(): Promise<void> {
  await prisma.cvSettings.upsert({
    where: { key: "default" },
    create: {
      key: "default",
      summary: BIO,
      fileName: "Romaric-Lonfonyuy-CV.pdf",
      useUploadedCv: false,
      referencesNote: "References available on request.",
    },
    update: {
      summary: BIO,
      fileName: "Romaric-Lonfonyuy-CV.pdf",
      useUploadedCv: false,
      referencesNote: "References available on request.",
    },
  });
}

type ProjectSeed = {
  title: string;
  slug: string;
  summary: string;
  problem?: string;
  approach?: string;
  impact?: string;
  role?: string;
  stack: string[];
  domains: ProjectDomain[];
  projectStatus: ProjectStatus;
  period?: string;
  liveUrl?: string | null;
  repoUrl?: string | null;
  coverUrl?: string | null;
  diagram: ArchitectureDiagram;
  featured: boolean;
  order: number;
  status?: ContentStatus;
};

async function seedProjects(): Promise<void> {
  const projects: ProjectSeed[] = [
    {
      title: "nBogne",
      slug: "nbogne",
      summary:
        "AI-enabled health interoperability for low-connectivity environments — connecting enterprise health systems when reliable internet is not guaranteed.",
      problem:
        "Health facilities in underserved regions need to exchange patient and program data across OpenMRS, OpenHIM, and DHIS2, but connectivity is intermittent.",
      approach:
        "Backend integration across OpenMRS, OpenHIM, and DHIS2, plus an SMS/USSD transport layer designed for medical data sync when online channels fail.",
      impact:
        "Deployed and integrated three or more enterprise health systems and engineered an SMS/USSD protocol for medical data transport in low-connectivity settings.",
      role: "Software Engineer Intern (Backend)",
      stack: ["Node.js", "OpenMRS", "OpenHIM", "DHIS2", "SMS/USSD"],
      domains: ["HEALTH_TECH", "AI"],
      projectStatus: "IN_PROGRESS",
      period: "Nov 2025 – May 2026",
      diagram: "NBOGNE",
      featured: true,
      order: 0,
    },
    {
      title: "SignConnect (SignNova)",
      slug: "signconnect",
      summary:
        "Real-time sign-to-text and text-to-sign backend powering accessibility-first educational workflows.",
      problem:
        "Deaf and hard-of-hearing learners need reliable, low-latency translation between sign language and text inside educational tools.",
      approach:
        "Backend services for real-time sign ↔ text pipelines, designed for classroom and learning-platform integration with accessibility as a first-class requirement.",
      impact:
        "Production backend supporting live sign language translation flows for SignConnect educational experiences.",
      role: "CTO & Backend Engineer",
      stack: ["Node.js", "WebSockets", "TypeScript", "Accessibility APIs"],
      domains: ["ACCESSIBILITY", "AI"],
      projectStatus: "LIVE",
      liveUrl: "https://signconnect.org",
      diagram: "SIGNCONNECT",
      featured: true,
      order: 1,
    },
    {
      title: "Hospital Management Platform (Dewise)",
      slug: "hospital-management-platform",
      summary:
        "Multi-hospital backend with role-based dashboards, appointments, and patient management APIs for three hospitals in Cameroon.",
      problem:
        "Hospitals needed shared digital infrastructure without sacrificing per-site autonomy or role-appropriate access.",
      approach:
        "Backend APIs and four role-based dashboards (patients, doctors, hospital admins, system admins) with multi-hospital tenancy.",
      impact:
        "Supports three hospitals with appointment scheduling, patient records, and admin workflows on a unified backend.",
      role: "Backend Software Engineer",
      stack: ["Node.js", "PostgreSQL", "REST APIs", "Role-based access"],
      domains: ["HEALTH_TECH"],
      projectStatus: "LIVE",
      period: "Sep 2025 – 2026",
      diagram: "HOSPITAL",
      featured: true,
      order: 2,
    },
    {
      title: "TiC Summit EdTech Platform",
      slug: "tic-summit-edtech",
      summary:
        "Large-scale edtech platform for course delivery, content management, and student engagement — serving thousands of learners.",
      problem:
        "Summit programs needed a single platform to deliver curriculum, manage content, and keep students engaged at scale.",
      approach:
        "Full-stack platform with Python and Node.js services, AI-assisted curriculum features, and admin tooling for program coordinators.",
      impact:
        "Course delivery and engagement for 5,000+ students across TiC Summit programs, with portal and public-facing sites.",
      role: "Backend Engineer & Program Mentor",
      stack: ["Python", "Node.js", "AI", "PostgreSQL"],
      domains: ["EDTECH", "AI"],
      projectStatus: "LIVE",
      liveUrl: "https://portal.ticsummit.org",
      coverUrl: null,
      diagram: "TIC_SUMMIT",
      featured: true,
      order: 3,
    },
    {
      title: "PixelFly",
      slug: "pixelfly",
      summary:
        "Image restoration, optimization, and enhancement with Python and OpenCV — classical computer vision, not generative models.",
      problem: "Users need sharper, cleaner images without relying on generative AI or heavy desktop tools.",
      approach: "OpenCV-based pipelines for denoising, contrast, and export optimization exposed through a web interface.",
      impact: "Public tool for practical image cleanup and optimization at pixelfly.online.",
      stack: ["Python", "OpenCV"],
      domains: ["WEB"],
      projectStatus: "LIVE",
      liveUrl: "https://pixelfly.online",
      repoUrl: "https://github.com/Romaric250/pixelfly",
      diagram: "NONE",
      featured: true,
      order: 4,
    },
    {
      title: "Automated Certificate Generation Platform",
      slug: "certificate-generation-platform",
      summary:
        "FastAPI and OpenCV service for personalized certificates at scale, integrable with e-learning platforms.",
      problem: "E-learning products need branded certificates generated automatically after course completion.",
      approach: "Python/FastAPI APIs with OpenCV layout rendering and MongoDB for template and issuance metadata.",
      impact: "API-first certificate generation for edtech clients without manual design work per cohort.",
      stack: ["Python", "FastAPI", "OpenCV", "MongoDB"],
      domains: ["EDTECH"],
      projectStatus: "LIVE",
      diagram: "NONE",
      featured: false,
      order: 5,
    },
    {
      title: "Jobo",
      slug: "jobo",
      summary:
        "National hackathon project — job-matching platform oriented to the Cameroonian labour market (2nd place, CityHack).",
      problem: "Job seekers and employers lack a lightweight matching layer tuned to local market realities.",
      approach: "Hackathon MVP with profiles, listings, and matching heuristics built under tight time constraints.",
      impact: "Recognised with 2nd place nationally at CityHack among 1,500 participants.",
      stack: ["Node.js", "React"],
      domains: ["WEB"],
      projectStatus: "CONCEPT",
      diagram: "NONE",
      featured: false,
      order: 6,
    },
    {
      title: "Elearning mobile App",
      slug: "elearning-mobile-app",
      summary: "Mobile learning experience — exam prep and structured study flows.",
      stack: ["Node.js", "Next.js", "React Native", "TypeScript", "Express"],
      domains: ["EDTECH"],
      projectStatus: "ARCHIVED",
      diagram: "NONE",
      featured: false,
      order: 10,
    },
    {
      title: "AgroLink",
      slug: "agrolink",
      summary: "E-commerce platform helping farmers in Cameroon scale their businesses online.",
      stack: ["Express", "Node.js", "React", "JavaScript"],
      domains: ["WEB"],
      projectStatus: "LIVE",
      liveUrl: "https://agro-link-cm.vercel.app/en",
      diagram: "NONE",
      featured: false,
      order: 11,
    },
    {
      title: "Notpadd",
      slug: "notpadd",
      summary: "Blog CMS for creators who want structured publishing without heavyweight tooling.",
      stack: ["Express", "Next.js", "TypeScript"],
      domains: ["WEB"],
      projectStatus: "LIVE",
      liveUrl: "https://notpadd.vercel.app/",
      diagram: "NONE",
      featured: false,
      order: 12,
    },
    {
      title: "Organiseme",
      slug: "organiseme",
      summary: "CLI utility to organise files in a directory with a single command.",
      stack: ["Node.js", "TypeScript"],
      domains: ["TOOLING"],
      projectStatus: "LIVE",
      repoUrl: "https://github.com/Romaric250/organiseme",
      diagram: "NONE",
      featured: false,
      order: 13,
    },
    {
      title: "pingflow",
      slug: "pingflow",
      summary: "Terminal-based internet speed testing for developers who live in the shell.",
      stack: ["Node.js", "TypeScript"],
      domains: ["TOOLING"],
      projectStatus: "LIVE",
      repoUrl: "https://github.com/Romaric250/pingflow",
      diagram: "NONE",
      featured: false,
      order: 14,
    },
  ];

  for (const p of projects) {
    const { status = "PUBLISHED", ...data } = p;
    await prisma.project.upsert({
      where: { slug: p.slug },
      create: { ...data, status },
      update: { ...data, status },
    });
  }
}

async function seedClientWork(): Promise<void> {
  const items = [
    {
      name: "Dewise Learning",
      slug: "dewise-learning",
      url: "https://dewise-energy.com/",
      scope: "Renewable energy learning website",
      description:
        "Course-focused web experience for energy transition topics — client work for Dewise, separate from the hospital management platform.",
      tech: ["Node.js", "Next.js"],
      clientType: "Organisation",
      year: 2024,
      order: 0,
    },
    {
      name: "AgroLink",
      slug: "agrolink-client",
      url: "https://agro-link-cm.vercel.app/en",
      scope: "Farmer e-commerce website",
      description: "Web platform for farmers in Cameroon to reach buyers and manage listings.",
      tech: ["Express", "Node.js", "React"],
      clientType: "SME",
      year: 2024,
      order: 1,
    },
    {
      name: "Notpadd",
      slug: "notpadd-client",
      url: "https://notpadd.vercel.app/",
      scope: "Blog CMS product site",
      description: "Marketing and product surface for a lightweight blog CMS.",
      tech: ["Express", "Next.js", "TypeScript"],
      clientType: "SME",
      order: 2,
    },
    {
      name: "Elearning mobile App",
      slug: "elearning-mobile-app-client",
      scope: "Mobile learning app",
      description: "Client-facing mobile learning product — structured study and exam preparation.",
      tech: ["Node.js", "React Native", "TypeScript"],
      clientType: "Individual",
      order: 3,
    },
  ];

  for (const item of items) {
    await prisma.clientWork.upsert({
      where: { slug: item.slug },
      create: { ...item, status: "PUBLISHED" },
      update: { ...item, status: "PUBLISHED" },
    });
  }
}

type ServiceSeed = {
  title: string;
  slug: string;
  description: string;
  tagline?: string;
  deliverables: string[];
  process: Array<{ title: string; description: string }>;
  startingFrom: string;
  icon: string;
  order: number;
  faqs: Array<{ question: string; answer: string; order: number }>;
};

async function seedServices(): Promise<void> {
  const services: ServiceSeed[] = [
    {
      title: "Websites for organisations & NGOs",
      slug: "organisation-websites",
      tagline: "Clear, credible web presence for mission-driven teams.",
      description:
        "Design and development for organisations and NGOs that need accessible, maintainable sites — not cookie-cutter templates.",
      deliverables: [
        "Information architecture and content structure",
        "Responsive, accessible UI",
        "CMS or static workflow that your team can update",
        "Basic analytics and SEO setup",
      ],
      process: [
        { title: "Discover", description: "Goals, audiences, and content you already have." },
        { title: "Design & build", description: "Iterative design in the browser with your feedback." },
        { title: "Launch", description: "Deployment, handoff docs, and a short support window." },
      ],
      startingFrom: "Let's talk",
      icon: "Globe",
      order: 0,
      faqs: [
        {
          question: "Do you work with teams outside Cameroon and Ghana?",
          answer: "Yes — remote collaboration is normal. Timelines account for async feedback.",
          order: 0,
        },
        {
          question: "Can you migrate an existing site?",
          answer: "Often yes. We start with a content and URL audit before committing to a approach.",
          order: 1,
        },
      ],
    },
    {
      title: "SME & business websites",
      slug: "sme-business-websites",
      tagline: "Fast, trustworthy sites for growing businesses.",
      description:
        "Websites for SMEs that need to look professional, load quickly, and convert visitors without enterprise budgets.",
      deliverables: [
        "Brand-aligned landing and core pages",
        "Contact and lead capture flows",
        "Performance-conscious implementation",
        "Optional blog or product highlights",
      ],
      process: [
        { title: "Scope", description: "Pages, integrations, and launch date." },
        { title: "Build", description: "Mobile-first implementation with your assets." },
        { title: "Handoff", description: "Training for updates and optional maintenance." },
      ],
      startingFrom: "Let's talk",
      icon: "Store",
      order: 1,
      faqs: [
        {
          question: "How long does a typical SME site take?",
          answer: "Simple sites often ship in a few weeks once content is ready; larger scopes take longer.",
          order: 0,
        },
        {
          question: "Do you provide hosting?",
          answer: "I recommend proven hosts (e.g. Vercel) and help you deploy; billing stays with you.",
          order: 1,
        },
        {
          question: "Can you integrate payments?",
          answer: "Basic integrations are possible when providers support your region — we confirm early.",
          order: 2,
        },
      ],
    },
    {
      title: "Professional portfolios",
      slug: "professional-portfolios",
      tagline: "Portfolios that read well to humans and search engines.",
      description:
        "Personal sites for engineers, founders, and creatives who want case studies, CV flows, and credible storytelling.",
      deliverables: [
        "Project and case-study templates",
        "CV / resume download flow",
        "SEO and structured data basics",
        "Admin-friendly content updates where needed",
      ],
      process: [
        { title: "Story", description: "What you want hiring managers or clients to remember." },
        { title: "Structure", description: "Projects, stack, and proof aligned to your goals." },
        { title: "Ship", description: "Polish, performance, and launch checklist." },
      ],
      startingFrom: "Let's talk",
      icon: "User",
      order: 2,
      faqs: [
        {
          question: "Can this match my existing brand?",
          answer: "Yes — typography, color, and tone follow your guidelines or a lightweight mood board.",
          order: 0,
        },
        {
          question: "Do you write the copy?",
          answer: "I help refine engineering-focused copy; you stay the author of your career story.",
          order: 1,
        },
      ],
    },
    {
      title: "Backend & API development",
      slug: "backend-api-development",
      tagline: "APIs and services built for clarity and longevity.",
      description:
        "Backend engineering for products that need reliable APIs, sensible data models, and documentation your team can use.",
      deliverables: [
        "REST (or agreed) API design and implementation",
        "Database schema and migrations",
        "Auth integration hooks",
        "Deployment notes and basic observability",
      ],
      process: [
        { title: "Model", description: "Entities, endpoints, and non-functional requirements." },
        { title: "Implement", description: "Tested services with incremental delivery." },
        { title: "Document", description: "OpenAPI or equivalent and runbooks." },
      ],
      startingFrom: "Let's talk",
      icon: "Server",
      order: 3,
      faqs: [
        {
          question: "Which stacks do you prefer?",
          answer: "Node.js/TypeScript and Python/FastAPI are my production defaults; we align on your constraints.",
          order: 0,
        },
        {
          question: "Do you take over existing codebases?",
          answer: "Yes, after a short review to understand debt and deployment reality.",
          order: 1,
        },
      ],
    },
    {
      title: "Health-tech & interoperability",
      slug: "health-tech-interoperability",
      tagline: "Connecting systems when connectivity is unreliable.",
      description:
        "Integration and backend work across OpenMRS, OpenHIM, DHIS2, and custom APIs — informed by nBogne and hospital platform experience.",
      deliverables: [
        "Integration planning across health information systems",
        "Adapter services and messaging flows",
        "Offline/low-bandwidth transport patterns where needed",
        "Documentation for facility IT teams",
      ],
      process: [
        { title: "Assess", description: "Systems, data flows, and connectivity constraints." },
        { title: "Integrate", description: "Incremental connectors with test environments." },
        { title: "Support handoff", description: "Runbooks and monitoring recommendations." },
      ],
      startingFrom: "Let's talk",
      icon: "HeartPulse",
      order: 4,
      faqs: [
        {
          question: "Are you clinically certified?",
          answer: "No — I am a software engineer; clinical workflows are validated with your domain experts.",
          order: 0,
        },
        {
          question: "Have you worked with OpenMRS and DHIS2?",
          answer: "Yes — production integration work through nBogne and related health-tech projects.",
          order: 1,
        },
      ],
    },
    {
      title: "Secure-by-default web builds",
      slug: "secure-by-default-web",
      tagline: "Hardening baked into how I build — not sold as audits or pentests.",
      description:
        "Web and API projects implemented with validation, auth, headers, and dependency hygiene from day one. This is not a penetration testing or formal certification service.",
      deliverables: [
        "Input validation and safe defaults on forms and APIs",
        "Session/auth patterns appropriate to the app",
        "Security headers and HTTPS deployment guidance",
        "Dependency update workflow recommendations",
      ],
      process: [
        { title: "Threat sketch", description: "Lightweight modeling of realistic abuse cases." },
        { title: "Build secure", description: "Controls implemented as features ship." },
        { title: "Checklist review", description: "Secure-by-default checklist before launch." },
      ],
      startingFrom: "Let's talk",
      icon: "ShieldCheck",
      order: 5,
      faqs: [
        {
          question: "Is this a security audit?",
          answer: "No — I apply secure development practices to projects I build; formal audits need dedicated specialists.",
          order: 0,
        },
        {
          question: "Do you offer bug bounties or pentesting?",
          answer: "Not at this time — I focus on building and learning security in public.",
          order: 1,
        },
      ],
    },
  ];

  for (const svc of services) {
    const { faqs, ...data } = svc;
    const service = await prisma.service.upsert({
      where: { slug: svc.slug },
      create: {
        ...data,
        process: svc.process,
        status: "DRAFT",
      },
      update: {
        ...data,
        process: svc.process,
        status: "DRAFT",
      },
    });
    await prisma.serviceFaq.deleteMany({ where: { serviceId: service.id } });
    for (const faq of faqs) {
      await prisma.serviceFaq.create({
        data: { ...faq, serviceId: service.id },
      });
    }
  }
}

type SkillSeed = {
  name: string;
  domain: SkillDomain;
  level: SkillLevel;
  description?: string;
  relatedProjectSlugs?: string[];
  order: number;
};

async function seedSkills(): Promise<void> {
  const skills: SkillSeed[] = [
    { name: "Python", domain: "LANGUAGES", level: "PRODUCTION", relatedProjectSlugs: ["pixelfly", "certificate-generation-platform", "tic-summit-edtech"], order: 0 },
    { name: "JavaScript", domain: "LANGUAGES", level: "PRODUCTION", order: 1 },
    { name: "TypeScript", domain: "LANGUAGES", level: "PRODUCTION", order: 2 },
    { name: "Java", domain: "LANGUAGES", level: "PROFICIENT", order: 3 },
    { name: "SQL", domain: "LANGUAGES", level: "PRODUCTION", order: 4 },
    { name: "Rust", domain: "LANGUAGES", level: "LEARNING", order: 5 },
    { name: "C#", domain: "LANGUAGES", level: "LEARNING", order: 6 },
    { name: "Node.js", domain: "BACKEND", level: "PRODUCTION", relatedProjectSlugs: ["nbogne", "signconnect", "hospital-management-platform"], order: 0 },
    { name: "Express.js", domain: "BACKEND", level: "PRODUCTION", order: 1 },
    { name: "REST APIs", domain: "BACKEND", level: "PRODUCTION", order: 2 },
    { name: "FastAPI", domain: "BACKEND", level: "PRODUCTION", relatedProjectSlugs: ["certificate-generation-platform"], order: 3 },
    { name: "System design", domain: "BACKEND", level: "PROFICIENT", order: 4 },
    { name: "React", domain: "FRONTEND", level: "PRODUCTION", order: 0 },
    { name: "Next.js", domain: "FRONTEND", level: "PRODUCTION", order: 1 },
    { name: "React Native", domain: "FRONTEND", level: "PROFICIENT", relatedProjectSlugs: ["elearning-mobile-app"], order: 2 },
    { name: "PostgreSQL", domain: "DATABASES", level: "PRODUCTION", relatedProjectSlugs: ["hospital-management-platform"], order: 0 },
    { name: "MongoDB", domain: "DATABASES", level: "PRODUCTION", relatedProjectSlugs: ["certificate-generation-platform"], order: 1 },
    { name: "MySQL", domain: "DATABASES", level: "PROFICIENT", order: 2 },
    { name: "OpenMRS", domain: "HEALTH_INFORMATICS", level: "PROFICIENT", relatedProjectSlugs: ["nbogne"], order: 0 },
    { name: "OpenHIM", domain: "HEALTH_INFORMATICS", level: "PROFICIENT", relatedProjectSlugs: ["nbogne"], order: 1 },
    { name: "DHIS2", domain: "HEALTH_INFORMATICS", level: "PROFICIENT", relatedProjectSlugs: ["nbogne"], order: 2 },
    { name: "Interoperability", domain: "HEALTH_INFORMATICS", level: "PROFICIENT", relatedProjectSlugs: ["nbogne"], order: 3 },
    { name: "Git", domain: "TOOLS", level: "PRODUCTION", order: 0 },
    { name: "Docker", domain: "TOOLS", level: "PROFICIENT", order: 1 },
    { name: "Linux", domain: "TOOLS", level: "PROFICIENT", order: 2 },
    { name: "GitHub", domain: "TOOLS", level: "PRODUCTION", order: 3 },
    { name: "Notion", domain: "TOOLS", level: "PROFICIENT", order: 4 },
    { name: "Web application security", domain: "SECURITY", level: "LEARNING", order: 0 },
    { name: "Networking", domain: "SECURITY", level: "EXPLORING", order: 1 },
    { name: "Cryptography basics", domain: "SECURITY", level: "EXPLORING", order: 2 },
    { name: "Secure API design", domain: "SECURITY", level: "LEARNING", order: 3 },
    { name: "Linux hardening", domain: "SECURITY", level: "EXPLORING", order: 4 },
    { name: "Threat modeling", domain: "SECURITY", level: "EXPLORING", order: 5 },
    { name: "C# and .NET security", domain: "SECURITY", level: "EXPLORING", order: 6 },
    { name: "Mentorship", domain: "SOFT_SKILLS", level: "PROFICIENT", order: 0 },
    { name: "Curriculum design", domain: "SOFT_SKILLS", level: "PROFICIENT", order: 1 },
    { name: "Workshop facilitation", domain: "SOFT_SKILLS", level: "PROFICIENT", order: 2 },
    { name: "Public speaking", domain: "SOFT_SKILLS", level: "PROFICIENT", order: 3 },
    { name: "Project management", domain: "SOFT_SKILLS", level: "PROFICIENT", order: 4 },
  ];

  for (const skill of skills) {
    const slug = slugify(skill.name);
    await prisma.skill.upsert({
      where: { slug },
      create: {
        name: skill.name,
        slug,
        domain: skill.domain,
        level: skill.level,
        description: skill.description,
        relatedProjectSlugs: skill.relatedProjectSlugs ?? [],
        order: skill.order,
        status: "PUBLISHED",
      },
      update: {
        name: skill.name,
        domain: skill.domain,
        level: skill.level,
        description: skill.description,
        relatedProjectSlugs: skill.relatedProjectSlugs ?? [],
        order: skill.order,
        status: "PUBLISHED",
      },
    });
  }
}

async function seedSecurityLab(): Promise<void> {
  const roadmap: Array<{
    title: string;
    slug: string;
    state: SecurityEntryState;
    summary: string;
    order: number;
  }> = [
    {
      title: "Web application security",
      slug: "web-application-security",
      state: "IN_PROGRESS",
      summary: "Learning OWASP-aligned basics and applying them to my own apps.",
      order: 0,
    },
    {
      title: "Networking",
      slug: "networking-security",
      state: "PLANNED",
      summary: "Foundational networking concepts for understanding attack surfaces.",
      order: 1,
    },
    {
      title: "Cryptography basics",
      slug: "cryptography-basics",
      state: "PLANNED",
      summary: "Practical crypto building blocks — hashes, TLS, and key handling.",
      order: 2,
    },
    {
      title: "Secure API design",
      slug: "secure-api-design",
      state: "IN_PROGRESS",
      summary: "AuthN/Z, rate limits, and validation patterns on APIs I ship.",
      order: 3,
    },
    {
      title: "Linux hardening",
      slug: "linux-hardening",
      state: "PLANNED",
      summary: "Baseline hardening for servers I deploy and experiment on.",
      order: 4,
    },
    {
      title: "Threat modeling",
      slug: "threat-modeling",
      state: "PLANNED",
      summary: "Lightweight STRIDE-style sketches for personal projects.",
      order: 5,
    },
    {
      title: "C# and .NET security",
      slug: "csharp-dotnet-security",
      state: "PLANNED",
      summary: "Security topics alongside learning C# and .NET.",
      order: 6,
    },
  ];

  for (const entry of roadmap) {
    await prisma.securityLabEntry.upsert({
      where: { slug: entry.slug },
      create: {
        ...entry,
        kind: "ROADMAP",
        status: "PUBLISHED",
      },
      update: {
        ...entry,
        kind: "ROADMAP",
        status: "PUBLISHED",
      },
    });
  }

  const checklistHtml = `<h2>Secure-by-default checklist (my builds)</h2>
<p>I use this as a living checklist for sites and APIs I own — not a certification or audit standard.</p>
<ul>
<li><strong>Input validation</strong> — schema validation on every boundary; reject early.</li>
<li><strong>AuthN &amp; authZ</strong> — least privilege, session hygiene, no security by obscurity.</li>
<li><strong>Rate limiting</strong> — protect auth and write endpoints from abuse.</li>
<li><strong>Headers</strong> — sensible CSP, HSTS where HTTPS is fixed, minimal exposure.</li>
<li><strong>Secrets</strong> — environment variables only; never commit keys; rotate when leaked.</li>
<li><strong>Dependencies</strong> — regular updates, lockfiles, and quick patches for critical CVEs.</li>
</ul>`;

  await prisma.securityLabEntry.upsert({
    where: { slug: "secure-by-default-checklist" },
    create: {
      title: "Secure-by-default checklist",
      slug: "secure-by-default-checklist",
      kind: "WRITEUP",
      state: "IN_PROGRESS",
      summary: "How I harden my own sites and APIs while I learn security in public.",
      bodyHtml: checklistHtml,
      status: "PUBLISHED",
      order: 10,
    },
    update: {
      title: "Secure-by-default checklist",
      kind: "WRITEUP",
      state: "IN_PROGRESS",
      summary: "How I harden my own sites and APIs while I learn security in public.",
      bodyHtml: checklistHtml,
      status: "PUBLISHED",
      order: 10,
    },
  });

  await prisma.securityLabEntry.upsert({
    where: { slug: "opening-the-security-lab" },
    create: {
      title: "Opening the Security Lab",
      slug: "opening-the-security-lab",
      kind: "LOG",
      state: "IN_PROGRESS",
      summary: "Starting a public log of security learning — no fabricated wins, just honest notes.",
      bodyHtml: "<p>First entry: documenting what I am studying and what I apply to my own projects.</p>",
      date: new Date("2026-11-01"),
      status: "PUBLISHED",
      order: 20,
    },
    update: {
      title: "Opening the Security Lab",
      kind: "LOG",
      state: "IN_PROGRESS",
      summary: "Starting a public log of security learning — no fabricated wins, just honest notes.",
      bodyHtml: "<p>First entry: documenting what I am studying and what I apply to my own projects.</p>",
      date: new Date("2026-11-01"),
      status: "PUBLISHED",
      order: 20,
    },
  });
}

async function seedExperience(): Promise<void> {
  const rows = [
    {
      role: "Software Engineer Intern (Backend)",
      organisation: "nBogne",
      employmentType: "Internship",
      startDate: new Date("2025-11-01"),
      endDate: new Date("2026-05-31"),
      current: false,
      summary: "Backend intern on AI-enabled health interoperability for low-connectivity environments.",
      highlights: [
        "Integrated OpenMRS, OpenHIM, and DHIS2 in production-oriented environments.",
        "Engineered SMS/USSD medical data transport for offline and low-bandwidth sync.",
        "Collaborated on interoperability workflows for enterprise health systems.",
      ],
      stack: ["Node.js", "OpenMRS", "OpenHIM", "DHIS2", "SMS/USSD"],
      order: 0,
    },
    {
      role: "Backend Software Engineer",
      organisation: "Dewise Foundation",
      employmentType: "Contract",
      startDate: new Date("2025-09-01"),
      endDate: null,
      current: true,
      summary: "Paid backend work on a multi-hospital management platform in Cameroon.",
      highlights: [
        "Built APIs and dashboards for patients, doctors, hospital admins, and system admins.",
        "Supported three hospitals with appointments and patient-management workflows.",
        "Delivered role-based access and multi-hospital tenancy on a shared backend.",
      ],
      stack: ["Node.js", "PostgreSQL", "REST APIs"],
      order: 1,
    },
    {
      role: "Backend Engineer",
      organisation: "Brilydal",
      organisationUrl: undefined,
      location: "United States (remote)",
      employmentType: "Contract",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-10-31"),
      current: false,
      summary: "Remote backend engineering on production APIs for a US-based client.",
      highlights: [
        "Shipped 100+ production API endpoints with testing and documentation.",
        "Worked in agile sprints with async collaboration across time zones.",
      ],
      stack: ["Node.js", "TypeScript", "REST APIs"],
      order: 2,
    },
  ];

  for (const row of rows) {
    const existing = await prisma.experience.findFirst({
      where: { organisation: row.organisation, role: row.role },
    });
    if (existing) {
      await prisma.experience.update({
        where: { id: existing.id },
        data: { ...row, showOnCv: true, status: "PUBLISHED" },
      });
    } else {
      await prisma.experience.create({
        data: { ...row, showOnCv: true, status: "PUBLISHED" },
      });
    }
  }
}

async function seedEducation(): Promise<void> {
  const rows = [
    {
      institution: "Ashesi University",
      degree: "BSc Computer Science",
      field: "Computer Science",
      location: "Ghana",
      startYear: 2025,
      endYear: 2029,
      expected: true,
      details: ["Mastercard Foundation Scholar"],
      url: "https://www.ashesi.edu.gh",
      order: 0,
    },
    {
      institution: "Holberton School / ALX",
      degree: "Software Engineering Program",
      field: "Software Engineering",
      startYear: 2023,
      endYear: 2023,
      expected: false,
      details: ["Specialization in backend development"],
      order: 1,
    },
  ];

  for (const row of rows) {
    const existing = await prisma.education.findFirst({
      where: { institution: row.institution, degree: row.degree },
    });
    if (existing) {
      await prisma.education.update({ where: { id: existing.id }, data: { ...row, status: "PUBLISHED" } });
    } else {
      await prisma.education.create({ data: { ...row, status: "PUBLISHED" } });
    }
  }
}

async function seedCertificateCategories(): Promise<Record<string, string>> {
  const cats = [
    { name: "Tech", slug: "tech", color: "#047857", order: 0, isDefault: true },
    { name: "Leadership", slug: "leadership", color: "#8B6F47", order: 1, isDefault: false },
    { name: "Community & Mentorship", slug: "community-mentorship", color: "#0F766E", order: 2, isDefault: false },
    { name: "Academic", slug: "academic", color: "#1D4ED8", order: 3, isDefault: false },
    { name: "Awards & Honors", slug: "awards-honors", color: "#B45309", order: 4, isDefault: false },
    { name: "Other", slug: "other", color: "#57534E", order: 5, isDefault: false },
  ];
  const map: Record<string, string> = {};
  for (const cat of cats) {
    const row = await prisma.certificateCategory.upsert({
      where: { slug: cat.slug },
      create: cat,
      update: cat,
    });
    map[cat.slug] = row.id;
  }
  return map;
}

async function seedCertificates(categoryIds: Record<string, string>): Promise<void> {
  const certs = [
    {
      title: "Software Engineering with a Specialization in Backend Development",
      slug: "holberton-backend-engineering",
      issuer: "Holberton School of Engineering",
      categorySlug: "tech",
      issueDate: new Date("2023-12-01"),
      description: "Holberton software engineering program with backend specialization.",
      skills: ["Backend", "Node.js", "Python"],
      hours: null as number | null,
      showOnCv: true,
      featured: true,
      altText: "Holberton School backend engineering certificate (file not uploaded yet)",
    },
    {
      title: "JavaScript Algorithms and Data Structures",
      slug: "fcc-javascript-algorithms",
      issuer: "freeCodeCamp",
      categorySlug: "tech",
      issueDate: new Date("2023-10-01"),
      description: "freeCodeCamp JavaScript algorithms and data structures curriculum.",
      skills: ["JavaScript", "Algorithms", "Data Structures"],
      hours: 300,
      showOnCv: true,
      featured: true,
      altText: "freeCodeCamp JavaScript Algorithms and Data Structures certificate (file not uploaded yet)",
    },
    {
      title: "Responsive Web Design",
      slug: "fcc-responsive-web-design",
      issuer: "freeCodeCamp",
      categorySlug: "tech",
      issueDate: new Date("2023-09-01"),
      description: "freeCodeCamp responsive web design certification.",
      skills: ["HTML", "CSS", "Responsive design"],
      hours: 300,
      showOnCv: true,
      featured: true,
      altText: "freeCodeCamp Responsive Web Design certificate (file not uploaded yet)",
    },
    {
      title: "Introduction to Python Programming",
      slug: "innoventure-python",
      issuer: "Innoventure",
      categorySlug: "tech",
      issueDate: new Date("2023-06-01"),
      description: "Introductory Python programming certificate.",
      skills: ["Python"],
      hours: null,
      showOnCv: true,
      featured: false,
      altText: "Innoventure Introduction to Python Programming certificate (file not uploaded yet)",
    },
    {
      title: "Developing, Mentoring & Supporting Youth Leadership",
      slug: "yali-youth-leadership",
      issuer: "YALI Network",
      categorySlug: "leadership",
      issueDate: new Date("2022-09-01"),
      description: "Youth leadership development and mentoring certificate.",
      skills: ["Leadership", "Mentorship"],
      hours: null,
      showOnCv: true,
      featured: false,
      altText: "YALI Network youth leadership certificate (file not uploaded yet)",
    },
    {
      title: "Volunteerism Certificate",
      slug: "tic-volunteerism",
      issuer: "TiC Foundation",
      categorySlug: "community-mentorship",
      issueDate: new Date("2024-01-01"),
      description: "Recognition for volunteer service with TiC Foundation programs.",
      skills: ["Volunteering", "Community"],
      hours: null,
      showOnCv: false,
      featured: false,
      altText: "TiC Foundation volunteerism certificate (file not uploaded yet)",
    },
    {
      title: "2019 Human Rights & SDG Excellence Award",
      slug: "human-rights-sdg-2019",
      issuer: "National Commission on Human Rights and Freedoms × CAMYOSFOP",
      categorySlug: "awards-honors",
      issueDate: new Date("2019-12-01"),
      description: "Award for human rights and SDG-related excellence.",
      skills: [] as string[],
      hours: null,
      showOnCv: false,
      featured: false,
      altText: "2019 Human Rights and SDG Excellence Award certificate (file not uploaded yet)",
    },
  ];

  for (const cert of certs) {
    const categoryId = categoryIds[cert.categorySlug];
    if (!categoryId) continue;
    const { categorySlug: _c, ...rest } = cert;
    await prisma.certificate.upsert({
      where: { slug: cert.slug },
      create: {
        ...rest,
        categoryId,
        fileUrl: null,
        status: "PUBLISHED",
        noExpiry: true,
      },
      update: {
        ...rest,
        categoryId,
        fileUrl: null,
        status: "PUBLISHED",
        noExpiry: true,
      },
    });
  }
}

async function seedAwards(): Promise<void> {
  const awards = [
    {
      title: "2nd Place — CityHack National Hackathon",
      issuer: "CityHack",
      year: 2024,
      description: "National hackathon with 1,500 participants; project: Jobo job-matching for Cameroon.",
      showOnCv: true,
      order: 0,
    },
    {
      title: "Delegate — CITS24 National Hackathon",
      issuer: "CITS24 (Centre Region)",
      year: 2024,
      description: "Delegate among 350 innovators at the Centre Region national hackathon.",
      showOnCv: true,
      order: 1,
    },
    {
      title: "2019 Human Rights & SDG Excellence Award",
      issuer: "National Commission on Human Rights and Freedoms × CAMYOSFOP",
      year: 2019,
      date: new Date("2019-12-01"),
      showOnCv: false,
      order: 2,
    },
    {
      title: "Volunteerism Certificate",
      issuer: "TiC Foundation",
      year: 2024,
      description: "Volunteer recognition for TiC Foundation community programs.",
      showOnCv: false,
      order: 3,
    },
  ];

  for (const award of awards) {
    const existing = await prisma.award.findFirst({
      where: { title: award.title, issuer: award.issuer },
    });
    if (existing) {
      await prisma.award.update({
        where: { id: existing.id },
        data: { ...award, status: "PUBLISHED" },
      });
    } else {
      await prisma.award.create({ data: { ...award, status: "PUBLISHED" } });
    }
  }
}

async function seedCommunity(): Promise<void> {
  const entries: Array<{
    title: string;
    slug: string;
    organisation: string;
    kind: CommunityKind;
    role?: string;
    period?: string;
    summary: string;
    highlights?: string[];
    metricLabel?: string;
    metricValue?: string;
    featured?: boolean;
    order: number;
  }> = [
    {
      title: "Tech4Girls Cameroon",
      slug: "tech4girls-cameroon",
      organisation: "Tech4Girls Cameroon",
      kind: "FOUNDING",
      role: "Founder",
      period: "Since secondary school (Grade 12)",
      summary: "Grassroots initiative introducing girls to technology through workshops and mentorship.",
      highlights: ["Founded while in Grade 12", "STEM outreach across Cameroon"],
      metricLabel: "Girls reached",
      metricValue: "500+",
      featured: true,
      order: 0,
    },
    {
      title: "Open Dreams Foundation",
      slug: "open-dreams-mentor",
      organisation: "Open Dreams Foundation",
      kind: "MENTORSHIP",
      role: "Academic Mentor & College Access Advisor",
      period: "2023 – present",
      summary: "Mentoring students on college access, applications, and academic planning.",
      metricLabel: "Students supported",
      metricValue: "250+",
      order: 1,
    },
    {
      title: "TIC Summit",
      slug: "tic-summit-coordinator",
      organisation: "TiC Foundation",
      kind: "MENTORSHIP",
      role: "Mentor & Program Coordinator",
      period: "2023 – Apr 2026",
      summary: "Program coordination and mentorship for TiC Summit edtech initiatives.",
      highlights: ["Mentored 100+ participants", "Supported large-scale student programs"],
      metricLabel: "Students (2026 cohort scale)",
      metricValue: "5,000+",
      order: 2,
    },
    {
      title: "Technology Club",
      slug: "technology-club-president",
      organisation: "Secondary school technology club",
      kind: "LEADERSHIP",
      role: "President",
      period: "Grades 10–12 (three consecutive years)",
      summary: "Led school technology club activities, events, and peer learning sessions.",
      order: 3,
    },
    {
      title: "Skaleway",
      slug: "skaleway-co-founder",
      organisation: "Skaleway",
      kind: "FOUNDING",
      role: "Co-Founder",
      summary: "Co-founded SME-focused venture aligned with Cameroon Vision 2035 goals.",
      order: 4,
    },
    {
      title: "CS & ICT Instruction",
      slug: "cs-ict-instructor-2024",
      organisation: "Independent / contract teaching",
      kind: "TEACHING",
      role: "CS & ICT Instructor",
      period: "Jun – Dec 2024",
      summary: "Introductory CS and ICT classes for secondary-level learners.",
      highlights: ["20+ lesson plans", "100+ students taught"],
      order: 5,
    },
    {
      title: "Technovation Challenge",
      slug: "technovation-mentor",
      organisation: "Technovation Challenge",
      kind: "MENTORSHIP",
      role: "Mentor",
      summary: "Mentored an all-girls team on MIT App Inventor, Figma, and Canva for their submission.",
      highlights: ["5-person all-girls team"],
      order: 6,
    },
  ];

  for (const entry of entries) {
    await prisma.communityEntry.upsert({
      where: { slug: entry.slug },
      create: { ...entry, status: "PUBLISHED", showOnCv: true },
      update: { ...entry, status: "PUBLISHED", showOnCv: true },
    });
  }
}

async function seedBlog(): Promise<void> {
  const categories = [
    { name: "Backend Engineering", slug: "backend-engineering", order: 0 },
    { name: "Cybersecurity", slug: "cybersecurity", order: 1 },
    { name: "AI & Accessibility", slug: "ai-accessibility", order: 2 },
    { name: "Health-Tech", slug: "health-tech", order: 3 },
    { name: "Web for SMEs", slug: "web-for-smes", order: 4 },
    { name: "Mentorship & Community", slug: "mentorship-community", order: 5 },
    { name: "Learning C#/.NET and Rust", slug: "learning-csharp-rust", order: 6 },
  ];

  const categoryIds: Record<string, string> = {};
  for (const cat of categories) {
    const row = await prisma.category.upsert({
      where: { slug: cat.slug },
      create: cat,
      update: cat,
    });
    categoryIds[cat.slug] = row.id;
  }

  const backendCatId = categoryIds["backend-engineering"];
  await prisma.post.upsert({
    where: { slug: "how-i-think-about-backends-that-have-to-work-offline" },
    create: {
      title: "How I think about backends that have to work offline",
      slug: "how-i-think-about-backends-that-have-to-work-offline",
      excerpt:
        "Draft template — not published. Outline for a post on sync, SMS/USSD fallbacks, and honest tradeoffs in low-connectivity health-tech.",
      contentHtml: `<p><em>Template only — do not publish as-is.</em></p>
<h2>Outline</h2>
<ol>
<li>Why offline-first shows up in my health-tech work</li>
<li>Sync models I have tried (and where they broke)</li>
<li>SMS/USSD as a transport layer — constraints and safety</li>
<li>What I would do differently on the next project</li>
</ol>`,
      categoryId: backendCatId,
      status: "DRAFT" satisfies PostStatus,
      isTemplate: true,
      readingTime: 1,
      wordCount: 40,
    },
    update: {
      title: "How I think about backends that have to work offline",
      excerpt:
        "Draft template — not published. Outline for a post on sync, SMS/USSD fallbacks, and honest tradeoffs in low-connectivity health-tech.",
      contentHtml: `<p><em>Template only — do not publish as-is.</em></p>
<h2>Outline</h2>
<ol>
<li>Why offline-first shows up in my health-tech work</li>
<li>Sync models I have tried (and where they broke)</li>
<li>SMS/USSD as a transport layer — constraints and safety</li>
<li>What I would do differently on the next project</li>
</ol>`,
      categoryId: backendCatId,
      status: "DRAFT",
      isTemplate: true,
    },
  });
}

async function seedRedirects(): Promise<void> {
  const redirects = [
    { source: "/lab", destination: "/projects", permanent: true },
    { source: "/writings", destination: "/blog", permanent: true },
    { source: "/crafts", destination: "/projects", permanent: true },
    { source: "/portal", destination: "https://portal.ticsummit.org", permanent: true },
    { source: "/pixelfly", destination: "/projects/pixelfly", permanent: true },
    { source: "/site.webmanifest", destination: "/manifest.webmanifest", permanent: true },
    { source: "/cv.pdf", destination: "/cv/download", permanent: true },
    { source: "/resume", destination: "/cv", permanent: true },
    { source: "/projects.html", destination: "/projects", permanent: true },
    { source: "/index.html", destination: "/", permanent: true },
  ];

  for (const r of redirects) {
    await prisma.redirect.upsert({
      where: { source: r.source },
      create: { ...r, enabled: true },
      update: { ...r, enabled: true },
    });
  }
}

async function main(): Promise<void> {
  await seedSiteSettings();
  await seedCvSettings();
  await seedProjects();
  await seedClientWork();
  await seedServices();
  await seedSkills();
  await seedSecurityLab();
  await seedExperience();
  await seedEducation();
  const categoryIds = await seedCertificateCategories();
  await seedCertificates(categoryIds);
  await seedAwards();
  await seedCommunity();
  await seedBlog();
  await seedRedirects();

  const counts = {
    siteSettings: await prisma.siteSettings.count(),
    cvSettings: await prisma.cvSettings.count(),
    projects: await prisma.project.count(),
    clientWork: await prisma.clientWork.count(),
    services: await prisma.service.count(),
    serviceFaqs: await prisma.serviceFaq.count(),
    skills: await prisma.skill.count(),
    securityLabEntries: await prisma.securityLabEntry.count(),
    experience: await prisma.experience.count(),
    education: await prisma.education.count(),
    certificateCategories: await prisma.certificateCategory.count(),
    certificates: await prisma.certificate.count(),
    awards: await prisma.award.count(),
    community: await prisma.communityEntry.count(),
    categories: await prisma.category.count(),
    posts: await prisma.post.count(),
    redirects: await prisma.redirect.count(),
    testimonials: await prisma.testimonial.count(),
  };

  console.log("Seed complete:", counts);
}

main()
  .catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
