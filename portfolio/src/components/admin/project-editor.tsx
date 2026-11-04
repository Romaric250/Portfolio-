"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ArchitectureDiagram, Project, ProjectDomain, ProjectStatus } from "@prisma/client";
import { toast } from "sonner";
import { LazyRichEditor } from "@/components/admin/lazy-editor";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { saveProject } from "@/server/actions/projects";

const DIAGRAMS: ArchitectureDiagram[] = ["NONE", "NBOGNE", "SIGNCONNECT", "HOSPITAL", "TIC_SUMMIT"];
const DOMAINS: ProjectDomain[] = ["AI", "HEALTH_TECH", "ACCESSIBILITY", "EDTECH", "WEB", "TOOLING"];
const PROJECT_STATUSES: ProjectStatus[] = ["LIVE", "IN_PROGRESS", "ARCHIVED", "CONCEPT"];

export function ProjectEditor({ project }: { project: Project | null }) {
  const router = useRouter();
  const isNew = !project;
  const [dirty, setDirty] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [form, setForm] = React.useState({
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    summary: project?.summary ?? "",
    problem: project?.problem ?? "",
    approach: project?.approach ?? "",
    impact: project?.impact ?? "",
    role: project?.role ?? "",
    stack: (project?.stack ?? []).join(", "),
    domains: project?.domains ?? ([] as ProjectDomain[]),
    projectStatus: project?.projectStatus ?? "LIVE",
    status: project?.status ?? "DRAFT",
    period: project?.period ?? "",
    liveUrl: project?.liveUrl ?? "",
    repoUrl: project?.repoUrl ?? "",
    diagram: project?.diagram ?? "NONE",
    featured: project?.featured ?? false,
    order: project?.order ?? 0,
    seoTitle: project?.seoTitle ?? "",
    seoDescription: project?.seoDescription ?? "",
  });
  const [caseJson, setCaseJson] = React.useState<Record<string, unknown> | null>(
    (project?.caseStudyJson as Record<string, unknown> | null) ?? null,
  );
  const [caseHtml, setCaseHtml] = React.useState(project?.caseStudyHtml ?? "");

  React.useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const submit = async () => {
    setPending(true);
    const result = await saveProject(project?.id ?? null, {
      ...form,
      stack: form.stack.split(",").map((s) => s.trim()).filter(Boolean),
      caseStudyJson: caseJson,
      caseStudyHtml: caseHtml,
    });
    setPending(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Saved");
    setDirty(false);
    if (isNew) router.replace(`/admin/projects/${result.data.id}`);
    else router.refresh();
  };

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === "s" || e.key === "Enter")) {
        e.preventDefault();
        void submit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  };

  return (
    <div className="pb-20">
      <PageHeader
        title={isNew ? "New project" : form.title || "Edit project"}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/projects">Back</Link>
            </Button>
            <Button onClick={() => void submit()} disabled={pending}>
              Save
            </Button>
          </div>
        }
      />
      <div className="sticky top-0 z-10 -mx-4 mb-4 border-b border-border bg-bg/95 px-4 py-2 backdrop-blur md:-mx-6 md:px-6">
        <div className="flex items-center justify-between text-xs text-fg-muted">
          <span>{dirty ? "Unsaved changes" : "All changes saved"}</span>
          <span>Cmd+S to save</span>
        </div>
      </div>

      <div className="grid max-w-4xl gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto from title" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Summary</Label>
          <Textarea value={form.summary} onChange={(e) => set("summary", e.target.value)} rows={2} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label>Content status</Label>
            <Select value={form.status} onValueChange={(v) => set("status", v as typeof form.status)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Project status</Label>
            <Select value={form.projectStatus} onValueChange={(v) => set("projectStatus", v as ProjectStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Architecture diagram</Label>
            <Select value={form.diagram} onValueChange={(v) => set("diagram", v as ArchitectureDiagram)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIAGRAMS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Domains</Label>
          <div className="flex flex-wrap gap-2">
            {DOMAINS.map((d) => {
              const on = form.domains.includes(d);
              return (
                <Button
                  key={d}
                  type="button"
                  size="sm"
                  variant={on ? "accent" : "outline"}
                  onClick={() =>
                    set(
                      "domains",
                      on ? form.domains.filter((x) => x !== d) : [...form.domains, d],
                    )
                  }
                >
                  {d}
                </Button>
              );
            })}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Stack (comma-separated)</Label>
          <Input value={form.stack} onChange={(e) => set("stack", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Case study</Label>
          <LazyRichEditor
            initialJson={caseJson}
            onChange={({ json, html }) => {
              setCaseJson(json);
              setCaseHtml(html);
              setDirty(true);
            }}
          />
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={form.featured} onCheckedChange={(v) => set("featured", v)} id="featured" />
          <Label htmlFor="featured">Featured</Label>
        </div>
      </div>
    </div>
  );
}
