"use server";

import type { ArchitectureDiagram, ContentStatus, ProjectDomain, ProjectStatus } from "@prisma/client";
import { z } from "zod";
import { invalidate, TAGS } from "@/lib/cache";
import { writeAudit } from "@/lib/admin/audit";
import { fail, ok, type ActionResult } from "@/lib/admin/types";
import { asInputJson } from "@/lib/admin/json";
import { prisma } from "@/lib/db/prisma";
import { sanitize } from "@/lib/sanitize";
import { slugify } from "@/lib/utils";
import { adminContext } from "@/server/actions/helpers";

const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  summary: z.string().min(1),
  problem: z.string().optional(),
  approach: z.string().optional(),
  impact: z.string().optional(),
  caseStudyJson: z.record(z.string(), z.unknown()).optional().nullable(),
  caseStudyHtml: z.string().optional(),
  role: z.string().optional(),
  stack: z.array(z.string()),
  domains: z.array(z.string()),
  projectStatus: z.string(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  period: z.string().optional(),
  liveUrl: z.string().optional(),
  repoUrl: z.string().optional(),
  coverUrl: z.string().optional(),
  coverKey: z.string().optional(),
  coverAlt: z.string().optional(),
  diagram: z.string(),
  featured: z.boolean(),
  order: z.number().int(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export async function listProjects() {
  await adminContext();
  return prisma.project.findMany({ orderBy: [{ order: "asc" }, { updatedAt: "desc" }] });
}

export async function getProject(id: string) {
  await adminContext();
  return prisma.project.findUnique({ where: { id } });
}

export async function saveProject(id: string | null, input: z.infer<typeof projectSchema>): Promise<ActionResult<{ id: string }>> {
  const { actorId } = await adminContext();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");

  const slug = parsed.data.slug?.trim() || slugify(parsed.data.title);
  const html = parsed.data.caseStudyHtml ? sanitize(parsed.data.caseStudyHtml) : null;

  const data = {
    ...parsed.data,
    slug,
    caseStudyHtml: html,
    caseStudyJson: asInputJson(parsed.data.caseStudyJson ?? undefined),
    domains: parsed.data.domains as ProjectDomain[],
    projectStatus: parsed.data.projectStatus as ProjectStatus,
    diagram: parsed.data.diagram as ArchitectureDiagram,
    status: parsed.data.status as ContentStatus,
  };

  if (id) {
    await prisma.project.update({ where: { id }, data });
    await writeAudit({ action: "UPDATE", entity: "Project", entityId: id, summary: `Updated project ${data.title}`, actorId });
    invalidate([TAGS.projects], ["/projects", `/projects/${slug}`]);
    return ok({ id });
  }

  const created = await prisma.project.create({ data });
  await writeAudit({ action: "CREATE", entity: "Project", entityId: created.id, summary: `Created project ${data.title}`, actorId });
  invalidate([TAGS.projects], ["/projects"]);
  return ok({ id: created.id });
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const { actorId } = await adminContext();
  const row = await prisma.project.delete({ where: { id } });
  await writeAudit({ action: "DELETE", entity: "Project", entityId: id, summary: `Deleted project ${row.title}`, actorId });
  invalidate([TAGS.projects], ["/projects"]);
  return ok();
}
