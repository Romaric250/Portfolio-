import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  getSettings,
  getFeaturedProjects,
  getSkills,
  getServices,
  getClientWork,
  getLatestTechCertificates,
  getCommunity,
  getExperience,
} from "@/lib/db/queries/public";
import { getPosts } from "@/lib/db/queries/blog";
import { getGitHubData } from "@/lib/github";
import { buildMetadata } from "@/lib/seo/metadata";
import { profilePageSchema, breadcrumbSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { Section } from "@/components/site/section";
import { TerminalFallback } from "@/components/site/terminal-hero";
import { TerminalHeroClient } from "@/components/site/terminal-hero-shell";
import { SignalNetworkLazy } from "@/components/site/signal-network-lazy";
import { ImpactCounters } from "@/components/site/impact-counters";
import { ProjectBento } from "@/components/site/project-bento";
import { StackExplorerLazy } from "@/components/site/stack-explorer-lazy";
import { SecurityLabTeaser } from "@/components/site/security-lab-teaser";
import { GitHubPanel } from "@/components/site/github-panel";
import { ExperienceTimeline } from "@/components/site/experience-timeline";
import { HomeStartProjectCta } from "@/components/site/home-cta";
import { CertificateCard } from "@/components/certificates/card";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { formatDate, enumLabel } from "@/lib/utils";
import { SITE } from "@/lib/seo/site";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    title: settings.defaultSeoTitle || SITE.defaultTitle,
    description: settings.shortBio || SITE.description,
    path: "/",
    type: "profile",
  });
}

export default async function HomePage() {
  const [settings, projects, skills, services, clientWork, certs, posts, community, experience, github] =
    await Promise.all([
      getSettings(),
      getFeaturedProjects(),
      getSkills(),
      getServices(),
      getClientWork(),
      getLatestTechCertificates(4),
      getPosts(),
      getCommunity(),
      getExperience(),
      getGitHubData(),
    ]);

  const bio = settings.bio || settings.shortBio || SITE.description;
  const latestPosts = posts.slice(0, 3);
  const featuredCommunity = community.filter((c) => c.featured).slice(0, 4);
  const serializableSkills = skills.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    domain: s.domain,
    level: s.level,
    description: s.description,
    builtWith: s.builtWith,
    relatedProjectSlugs: s.relatedProjectSlugs,
  }));

  return (
    <>
      <JsonLd data={[profilePageSchema(settings, "/"), breadcrumbSchema([])]} />
      <section className="relative overflow-hidden border-b border-border">
        <SignalNetworkLazy className="pointer-events-none absolute inset-0 h-full w-full" />
        <div className="container-x relative grid gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16">
          <TerminalFallback headline={settings.headline} tagline={settings.tagline} bio={bio} className="max-w-xl" />
          <div className="min-w-0">
            <TerminalHeroClient
              headline={settings.headline}
              tagline={settings.tagline}
              bio={bio}
              availability={settings.availabilityOpen ? settings.availability : undefined}
            />
          </div>
        </div>
      </section>

      <Section index="01" eyebrow="Impact" title="Numbers I can stand behind" id="impact">
        <ImpactCounters />
      </Section>

      <Section index="02" eyebrow="Flagship" title="Systems with architecture, not card grids" id="projects" description="Health-tech, AI accessibility, and education platforms — with honest schematics.">
        <ProjectBento projects={projects} />
        <div className="mt-8">
          <Button variant="outline" asChild>
            <Link href="/projects">
              All projects
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Section>

      <Section index="03" eyebrow="Stack" title="Constellation explorer" id="stack" sideLabel="Stack">
        <StackExplorerLazy skills={serializableSkills} compact />
        <Button variant="link" className="mt-6 px-0" asChild>
          <Link href="/stack">Full stack map</Link>
        </Button>
      </Section>

      <Section eyebrow="Security" title="Learning in public" id="security-lab">
        <SecurityLabTeaser />
      </Section>

      <Section eyebrow="Services" title="Engineering & web for organisations" id="services">
        <ul className="grid gap-4 md:grid-cols-2">
          {services.slice(0, 4).map((s) => (
            <li key={s.id}>
              <Link href={`/services/${s.slug}`} className="block rounded-xl border border-border bg-bg-elevated p-6 transition-colors hover:bg-bg-sunken">
                <h3 className="font-display font-semibold">{s.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-fg-muted">{s.description}</p>
              </Link>
            </li>
          ))}
        </ul>
        <Button variant="outline" className="mt-8" asChild>
          <Link href="/services">All services</Link>
        </Button>
      </Section>

      <Section eyebrow="Client work" title="Websites I've built" id="work">
        <ul className="divide-y divide-border border-y border-border">
          {clientWork.slice(0, 6).map((w) => (
            <li key={w.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div>
                <p className="font-medium">{w.name}</p>
                <p className="text-sm text-fg-muted">{w.scope}</p>
              </div>
              {w.url ? (
                <Link href={w.url} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-accent">
                  Visit
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
        <Button variant="link" className="mt-4 px-0" asChild>
          <Link href="/work">Full client list</Link>
        </Button>
      </Section>

      <Section eyebrow="Credentials" title="Latest tech certificates" id="certificates">
        {certs.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {certs.map((c) => (
              <div key={c.id}>
                <Link href={`/certificates/${c.slug}`} className="block">
                  <CertificateCard cert={c} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-fg-muted">Certificates will appear here when published.</p>
        )}
        <Button variant="outline" className="mt-8" asChild>
          <Link href="/certificates">Open the vault</Link>
        </Button>
      </Section>

      <Section eyebrow="Writing" title="Latest from the blog" id="blog">
        {latestPosts.length ? (
          <ul className="space-y-6">
            {latestPosts.map((post) => (
              <li key={post.id}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <p className="font-mono text-xs text-fg-subtle">{formatDate(post.publishedAt)}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold group-hover:text-accent">{post.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-fg-muted">{post.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-fg-muted">Posts will appear when published.</p>
        )}
      </Section>

      <Section eyebrow="Community" title="Beyond the Code" id="beyond" description="Leadership and teaching — important, but secondary to the engineering work.">
        <ul className="grid gap-4 md:grid-cols-2">
          {featuredCommunity.map((entry) => (
            <li key={entry.id} className="rounded-xl border border-border bg-bg-sunken p-5">
              <p className="font-accent text-xs uppercase tracking-wider text-fg-subtle">{enumLabel(entry.kind)}</p>
              <h3 className="mt-2 font-display font-semibold">{entry.title}</h3>
              <p className="mt-2 text-sm text-fg-muted">{entry.summary}</p>
            </li>
          ))}
        </ul>
        <Button variant="link" className="mt-6 px-0" asChild>
          <Link href="/impact">Full impact story</Link>
        </Button>
      </Section>

      <Section eyebrow="Experience" title="Roles & timelines" id="experience">
        <ExperienceTimeline items={experience} />
      </Section>

      <Section eyebrow="Open source" title="GitHub activity" id="github">
        <GitHubPanel data={github} />
      </Section>

      <Section id="start-project">
        <Reveal className="rounded-2xl border border-border bg-terminal px-8 py-12 text-center text-terminal-fg md:px-16">
          <h2 className="font-display text-2xl font-semibold md:text-3xl">Have a system to build?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-terminal-fg/75">
            From NGO websites to health interoperability and AI prototypes — tell me what you are trying to ship.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <HomeStartProjectCta />
            <Button variant="outline" className="border-white/20 bg-transparent text-terminal-fg hover:bg-white/10" asChild>
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
