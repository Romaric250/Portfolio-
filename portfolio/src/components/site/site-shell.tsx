import * as React from "react";
import dynamic from "next/dynamic";
import { getSettings, getProjects, getCertificates, getServices } from "@/lib/db/queries/public";
import { getPosts } from "@/lib/db/queries/blog";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { CommandPaletteProvider, type PaletteIndex } from "@/components/site/command-palette";
import { StartProjectProvider } from "@/components/site/start-project-modal";
import { PageTransition, ScrollProgress } from "@/components/motion/page-transition";
import { PageViewTracker } from "@/components/site/analytics";
import { JsonLd } from "@/components/seo/json-ld";
import { personSchema, websiteSchema } from "@/lib/seo/jsonld";
import { Providers } from "@/components/providers";

const VercelAnalytics = dynamic(() => import("@/components/site/vercel-analytics").then((m) => m.VercelAnalytics));

/** Shared chrome for all public routes: header, footer, palette, inquiry modal, transitions, analytics. */
export async function SiteShell({ children }: { children: React.ReactNode }) {
  const [settings, projects, certificates, services, posts] = await Promise.all([
    getSettings(),
    getProjects(),
    getCertificates(),
    getServices(),
    getPosts(),
  ]);

  const index: PaletteIndex = {
    email: settings.email,
    projects: projects.map((p) => ({ label: p.title, href: `/projects/${p.slug}`, hint: p.domains[0]?.replace("_", "-").toLowerCase() })),
    certificates: certificates.map((c) => ({ label: c.title, href: `/certificates/${c.slug}`, hint: c.issuer })),
    services: services.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
    posts: posts.slice(0, 12).map((p) => ({ label: p.title, href: `/blog/${p.slug}` })),
  };

  return (
    <Providers>
      <StartProjectProvider>
        <CommandPaletteProvider index={index}>
          <ScrollProgress />
          <SiteHeader availability={settings.availabilityOpen ? settings.availability : undefined} />
          <main id="main" className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <SiteFooter settings={settings} />
          <PageViewTracker />
          {process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS === "true" ? <VercelAnalytics /> : null}
          <JsonLd data={[personSchema(settings), websiteSchema(settings)]} />
        </CommandPaletteProvider>
      </StartProjectProvider>
    </Providers>
  );
}
