"use server";

import { z } from "zod";
import { invalidate, TAGS } from "@/lib/cache";
import { writeAudit } from "@/lib/admin/audit";
import { fail, ok, type ActionResult } from "@/lib/admin/types";
import { prisma } from "@/lib/db/prisma";
import { adminContext } from "@/server/actions/helpers";

const schema = z.object({
  source: z.string().min(1),
  destination: z.string().min(1),
  permanent: z.boolean(),
  enabled: z.boolean(),
  note: z.string().optional(),
});

export async function listRedirects() {
  await adminContext();
  return prisma.redirect.findMany({ orderBy: { source: "asc" } });
}

export async function saveRedirect(id: string | null, input: z.infer<typeof schema>): Promise<ActionResult<{ id: string }>> {
  const { actorId } = await adminContext();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const source = parsed.data.source.startsWith("/") ? parsed.data.source : `/${parsed.data.source}`;

  if (id) {
    await prisma.redirect.update({ where: { id }, data: { ...parsed.data, source } });
    await writeAudit({ action: "UPDATE", entity: "Redirect", entityId: id, summary: `Updated redirect ${source}`, actorId });
  } else {
    const c = await prisma.redirect.create({ data: { ...parsed.data, source } });
    id = c.id;
    await writeAudit({ action: "CREATE", entity: "Redirect", entityId: id, summary: `Created redirect ${source}`, actorId });
  }
  invalidate([TAGS.redirects], []);
  return ok({ id: id! });
}

export async function deleteRedirect(id: string): Promise<ActionResult> {
  const { actorId } = await adminContext();
  await prisma.redirect.delete({ where: { id } });
  await writeAudit({ action: "DELETE", entity: "Redirect", entityId: id, summary: "Deleted redirect", actorId });
  invalidate([TAGS.redirects], []);
  return ok();
}
