import Link from "next/link";
import { ExternalLink, GitBranch, Star } from "lucide-react";
import type { GitHubData } from "@/lib/github";
import { SITE } from "@/lib/seo/site";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

type GitHubPanelProps = {
  data: GitHubData;
};

export function GitHubPanel({ data }: GitHubPanelProps) {
  const { profile, repos, weeks = [] } = data;
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <Reveal className="rounded-2xl border border-border bg-terminal p-6 text-terminal-fg md:p-8">
        <p className="font-mono text-xs text-terminal-fg/60">$ gh api user</p>
        {profile ? (
          <>
            <p className="mt-4 font-display text-2xl font-semibold">{profile.name ?? profile.login}</p>
            {profile.bio ? <p className="mt-2 text-sm text-terminal-fg/80">{profile.bio}</p> : null}
            <dl className="mt-6 grid grid-cols-2 gap-4 font-mono text-sm">
              <div>
                <dt className="text-terminal-fg/50">repos</dt>
                <dd className="text-accent">{profile.public_repos}</dd>
              </div>
              <div>
                <dt className="text-terminal-fg/50">followers</dt>
                <dd className="text-accent">{profile.followers}</dd>
              </div>
            </dl>
          </>
        ) : (
          <p className="mt-4 text-sm text-terminal-fg/70">
            Open-source work lives on GitHub — connect when the API is reachable.
          </p>
        )}
        <Button variant="accent" size="sm" className="mt-6" asChild>
          <Link href={SITE.github} target="_blank" rel="noopener noreferrer">
            @{SITE.githubUser}
            <ExternalLink className="size-3.5" aria-hidden />
          </Link>
        </Button>
        {weeks.length ? (
          <div className="mt-6 flex gap-px overflow-x-auto" aria-hidden>
            {weeks.slice(-26).map((week, i) => (
              <div key={i} className="flex flex-col gap-px">
                {week.days.map((n, j) => (
                  <span
                    key={j}
                    className="size-1.5 rounded-[1px]"
                    style={{ background: n === 0 ? "rgba(255,255,255,0.08)" : `color-mix(in oklab, var(--accent) ${Math.min(100, 25 + n * 18)}%, transparent)` }}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : null}
      </Reveal>
      <div className="space-y-3">
        {repos.length ? (
          repos.map((repo, i) => (
            <Reveal key={repo.name} delay={i * 0.04}>
              <Link
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-4 rounded-xl border border-border bg-bg-elevated p-4 transition-colors hover:border-border-strong hover:bg-bg-sunken"
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-mono text-sm font-medium text-fg">
                    <GitBranch className="size-3.5 shrink-0 text-fg-subtle" aria-hidden />
                    {repo.name}
                  </p>
                  {repo.description ? (
                    <p className="mt-1 line-clamp-2 text-sm text-fg-muted">{repo.description}</p>
                  ) : null}
                  {repo.language ? (
                    <p className="mt-2 font-mono text-xs text-fg-subtle">{repo.language}</p>
                  ) : null}
                </div>
                <span className="flex shrink-0 items-center gap-1 font-mono text-xs text-fg-subtle">
                  <Star className="size-3.5" aria-hidden />
                  {repo.stargazers_count}
                </span>
              </Link>
            </Reveal>
          ))
        ) : (
          <Reveal className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-fg-muted">
            Repository highlights will appear here when GitHub data is available.
          </Reveal>
        )}
      </div>
    </div>
  );
}
