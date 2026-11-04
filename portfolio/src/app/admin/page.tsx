import Link from "next/link";
import { ArrowRight, FileText, Mail, Newspaper, BadgeCheck, Layers } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateLong, enumLabel } from "@/lib/utils";
import { getDashboardStats } from "@/server/actions/dashboard";

function StatCard({ label, value, href, icon: Icon }: { label: string; value: number; href: string; icon: React.ElementType }) {
  return (
    <Link
      href={href}
      className="hairline group flex flex-col rounded-lg bg-bg-elevated p-4 transition-colors hover:bg-bg-sunken/40"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-fg-muted">{label}</span>
        <Icon className="size-4 text-fg-subtle group-hover:text-accent" />
      </div>
      <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{value}</p>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const { counts } = stats;

  return (
    <div>
      <PageHeader title="Dashboard" description="Live counts from your database." />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Projects" value={counts.projects} href="/admin/projects" icon={Layers} />
        <StatCard label="Posts" value={counts.posts} href="/admin/blog" icon={Newspaper} />
        <StatCard label="Certificates" value={counts.certificates} href="/admin/certificates" icon={BadgeCheck} />
        <StatCard label="Messages" value={counts.messages} href="/admin/inbox" icon={Mail} />
        <StatCard label="Unread" value={counts.unread} href="/admin/inbox" icon={Mail} />
        <StatCard label="Subscribers" value={counts.subscribers} href="/admin/subscribers" icon={FileText} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="hairline rounded-lg bg-bg-elevated p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent drafts</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/blog">View blog</Link>
            </Button>
          </div>
          {stats.drafts.length === 0 ? (
            <p className="text-sm text-fg-muted">No drafts yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {stats.drafts.map((d) => (
                <li key={`${d.kind}-${d.id}`} className="flex items-center justify-between gap-2 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{d.title}</p>
                    <p className="text-xs text-fg-muted">
                      {d.kind === "post" ? "Blog" : "Project"} · Updated {formatDateLong(d.updatedAt)}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={d.kind === "post" ? `/admin/blog/${d.id}` : `/admin/projects/${d.id}`}>
                      Edit
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="hairline rounded-lg bg-bg-elevated p-4">
          <h2 className="mb-3 text-sm font-semibold">Top pages</h2>
          {stats.topPages.length === 0 ? (
            <p className="text-sm text-fg-muted">No page views recorded yet.</p>
          ) : (
            <ul className="space-y-2">
              {stats.topPages.map((p) => (
                <li key={p.path} className="flex items-center justify-between text-sm">
                  <code className="truncate text-xs text-fg-muted">{p.path}</code>
                  <Badge variant="mono">{p.views}</Badge>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="hairline rounded-lg bg-bg-elevated p-4 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Latest audit</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/audit">Full log</Link>
            </Button>
          </div>
          {stats.recentAudit.length === 0 ? (
            <p className="text-sm text-fg-muted">No audit entries yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {stats.recentAudit.map((row) => (
                <li key={row.id} className="flex flex-wrap items-center gap-2 py-2 text-sm">
                  <Badge variant="outline">{enumLabel(row.action)}</Badge>
                  <span className="text-fg-muted">{row.entity}</span>
                  <span className="min-w-0 flex-1 truncate">{row.summary}</span>
                  <span className="text-xs text-fg-subtle">{formatDateLong(row.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
