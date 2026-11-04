"use server";

import type { ContentStatus, SecurityEntryKind, SecurityEntryState } from "@prisma/client";
import { z } from "zod";
import { invalidate, TAGS } from "@/lib/cache";
import { writeAudit } from "@/lib/admin/audit";
import { fail, ok, type ActionResult } from "@/lib/admin/types";
import { asInputJson } from "@/lib/admin/json";
import { prisma } from "@/lib/db/prisma";
import { sanitize } from "@/lib/sanitize";
import { slugify } from "@/lib/utils";
import { adminContext } from "@/server/actions/helpers";

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  kind: z.string(),
  state: z.string(),
  summary: z.string().optional(),
  bodyJson: z.record(z.string(), z.unknown()).optional().nullable(),
  bodyHtml: z.string().optional(),
  topics: z.array(z.string()),
  date: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  order: z.number().int(),
});

export async function listSecurityLabEntries() {
  await adminContext();
  return prisma.securityLabEntry.findMany({ orderBy: [{ order: "asc" }, { updatedAt: "desc" }] });
}

export async function saveSecurityLabEntry(id: string | null, input: z.infer<typeof schema>): Promise<ActionResult<{ id: string }>> {
  const { actorId } = await adminContext();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const slug = parsed.data.slug?.trim() || slugify(parsed.data.title);
  const data = {
    ...parsed.data,
    slug,
    kind: parsed.data.kind as SecurityEntryKind,
    state: parsed.data.state as SecurityEntryState,
    status: parsed.data.status as ContentStatus,
    bodyHtml: parsed.data.bodyHtml ? sanitize(parsed.data.bodyHtml) : undefined,
    bodyJson: asInputJson(parsed.data.bodyJson ?? undefined),
    date: parsed.data.date ? new Date(parsed.data.date) : null,
  };

  if (id) {
    await prisma.securityLabEntry.update({ where: { id }, data });
    await writeAudit({ action: "UPDATE", entity: "SecurityLabEntry", entityId: id, summary: `Updated ${data.title}`, actorId });
  } else {
    const c = await prisma.securityLabEntry.create({ data });
    id = c.id;
    await writeAudit({ action: "CREATE", entity: "SecurityLabEntry", entityId: id, summary: `Created ${data.title}`, actorId });
  }
  invalidate([TAGS.security], ["/security"]);
  return ok({ id: id! });
}

export async function deleteSecurityLabEntry(id: string): Promise<ActionResult> {
  const { actorId } = await adminContext();
  const row = await prisma.securityLabEntry.delete({ where: { id } });
  await writeAudit({ action: "DELETE", entity: "SecurityLabEntry", entityId: id, summary: `Deleted ${row.title}`, actorId });
  invalidate([TAGS.security], ["/security"]);
  return ok();
}
