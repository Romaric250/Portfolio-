"use server";

import { z } from "zod";
import { invalidate, TAGS } from "@/lib/cache";
import { writeAudit } from "@/lib/admin/audit";
import { fail, ok, type ActionResult } from "@/lib/admin/types";
import { prisma } from "@/lib/db/prisma";
import { adminContext } from "@/server/actions/helpers";

const schema = z.object({
  path: z.string().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  canonical: z.string().optional(),
  noindex: z.boolean(),
  ogImageUrl: z.string().optional(),
});

export async function listPageSeo() {
  await adminContext();
  return prisma.pageSeo.findMany({ orderBy: { path: "asc" } });
}

export async function savePageSeo(id: string | null, input: z.infer<typeof schema>): Promise<ActionResult<{ id: string }>> {
  const { actorId } = await adminContext();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const path = parsed.data.path.startsWith("/") ? parsed.data.path : `/${parsed.data.path}`;

  if (id) {
    await prisma.pageSeo.update({ where: { id }, data: { ...parsed.data, path } });
    await writeAudit({ action: "UPDATE", entity: "PageSeo", entityId: id, summary: `Updated SEO ${path}`, actorId });
  } else {
    const c = await prisma.pageSeo.create({ data: { ...parsed.data, path } });
    id = c.id;
    await writeAudit({ action: "CREATE", entity: "PageSeo", entityId: id, summary: `Created SEO ${path}`, actorId });
  }
  invalidate([TAGS.seo], [path]);
  return ok({ id: id! });
}

export async function deletePageSeo(id: string): Promise<ActionResult> {
  const { actorId } = await adminContext();
  const row = await prisma.pageSeo.delete({ where: { id } });
  await writeAudit({ action: "DELETE", entity: "PageSeo", entityId: id, summary: `Deleted SEO ${row.path}`, actorId });
  invalidate([TAGS.seo], [row.path]);
  return ok();
}
