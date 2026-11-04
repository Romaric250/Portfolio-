import Link from "next/link";
import { ArrowUpRightIcon, MailIcon } from "lucide-react";
import type { SiteSettings } from "@prisma/client";
import { FOOTER_LINKS } from "@/lib/seo/site";
import { Monogram } from "@/components/site/monogram";
import { GitHubIcon, LinkedInIcon, WhatsAppIcon, XIcon } from "@/components/site/brand-icons";
import { NewsletterForm } from "@/components/site/newsletter-form";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  const socials = [
    { href: settings.githubUrl, label: "GitHub", Icon: GitHubIcon },
    { href: settings.linkedinUrl, label: "LinkedIn", Icon: LinkedInIcon },
    { href: settings.xUrl, label: "X (Twitter)", Icon: XIcon },
    { href: settings.whatsappUrl, label: "WhatsApp", Icon: WhatsAppIcon },
  ].filter((s): s is { href: string; label: string; Icon: typeof GitHubIcon } => Boolean(s.href));

  return (
    <footer data-site-footer className="relative mt-24 border-t border-border bg-bg-sunken/60">
      <div className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Romaric Lonfonyuy — home">
              <Monogram className="size-9" />
              <span className="font-semibold tracking-tight">Romaric Lonfonyuy</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-fg-muted">
              Backend engineer, AI builder and cybersecurity-focused developer. I build secure, intelligent systems for
              health, education and accessibility — and websites that organisations and SMEs can actually run.
            </p>
            <div className="mt-5 flex items-center gap-1">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="me noopener noreferrer"
                  aria-label={`${label} — Romaric Lonfonyuy`}
                  className="inline-flex size-9 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-bg-elevated hover:text-fg"
                >
                  <Icon className="size-[17px]" />
                </a>
              ))}
              <a
                href={`mailto:${settings.email}`}
                aria-label="Email Romaric Lonfonyuy"
                className="inline-flex size-9 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-bg-elevated hover:text-fg"
              >
                <MailIcon className="size-[17px]" />
              </a>
            </div>
            <div className="mt-8 max-w-sm">
              <p className="eyebrow mb-3">Occasional notes</p>
              <NewsletterForm source="footer" compact />
            </div>
          </div>

          <FooterColumn title="Explore" links={FOOTER_LINKS.explore} />
          <FooterColumn title="About" links={FOOTER_LINKS.about} />
          <FooterColumn title="Services" links={FOOTER_LINKS.services} />
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Romaric Lonfonyuy. Built with Next.js, deployed from {settings.location}.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/rss.xml" className="hover:text-fg">
              RSS
            </Link>
            <Link href="/llms.txt" className="hover:text-fg">
              llms.txt
            </Link>
            <Link href="/sitemap.xml" className="hover:text-fg">
              Sitemap
            </Link>
            <a href={settings.githubUrl ?? "https://github.com/Romaric250"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-fg">
              Source on GitHub <ArrowUpRightIcon className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: ReadonlyArray<{ href: string; label: string }> }) {
  return (
    <nav aria-label={title}>
      <p className="eyebrow mb-4">{title}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-fg-muted transition-colors hover:text-fg">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
