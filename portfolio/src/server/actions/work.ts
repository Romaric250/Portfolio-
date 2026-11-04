"use server";

import type { ContentStatus } from "@prisma/client";
import { z } from "zod";
import { invalidate, TAGS } from "@/lib/cache";
import { writeAudit } from "@/lib/admin/audit";
import { fail, ok, type ActionResult } from "@/lib/admin/types";
import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/utils";
import { adminContext } from "@/server/actions/helpers";

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  url: z.string().optional(),
  scope: z.string().min(1),
  description: z.string().optional(),
  tech: z.array(z.string()),
  coverUrl: z.string().optional(),
  coverKey: z.string().optional(),
  coverAlt: z.string().optional(),
  testimonial: z.string().optional(),
  clientType: z.string().optional(),
  year: z.number().int().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  featured: z.boolean(),
  order: z.number().int(),
});

export async function listClientWork() {
  await adminContext();
  return prisma.clientWork.findMany({ orderBy: [{ order: "asc" }, { updatedAt: "desc" }] });
}

export async function saveClientWork(id: string | null, input: z.infer<typeof schema>): Promise<ActionResult<{ id: string }>> {
  const { actorId } = await adminContext();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const slug = parsed.data.slug?.trim() || slugify(parsed.data.name);
  const data = { ...parsed.data, slug, status: parsed.data.status as ContentStatus };

  if (id) {
    await prisma.clientWork.update({ where: { id }, data });
    await writeAudit({ action: "UPDATE", entity: "ClientWork", entityId: id, summary: `Updated ${data.name}`, actorId });
  } else {
    const created = await prisma.clientWork.create({ data });
    id = created.id;
    await writeAudit({ action: "CREATE", entity: "ClientWork", entityId: id, summary: `Created ${data.name}`, actorId });
  }
  invalidate([TAGS.clientWork], ["/work"]);
  return ok({ id: id! });
}

export async function deleteClientWork(id: string): Promise<ActionResult> {
  const { actorId } = await adminContext();
  const row = await prisma.clientWork.delete({ where: { id } });
  await writeAudit({ action: "DELETE", entity: "ClientWork", entityId: id, summary: `Deleted ${row.name}`, actorId });
  invalidate([TAGS.clientWork], ["/work"]);
  return ok();
}
