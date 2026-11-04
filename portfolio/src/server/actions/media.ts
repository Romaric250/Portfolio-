"use server";

import type { MediaSlot } from "@prisma/client";
import { z } from "zod";
import { invalidate, TAGS } from "@/lib/cache";
import { writeAudit } from "@/lib/admin/audit";
import { fail, ok, type ActionResult } from "@/lib/admin/types";
import { prisma } from "@/lib/db/prisma";
import { deleteUploadThingFiles } from "@/lib/uploadthing/delete";
import { adminContext } from "@/server/actions/helpers";

const assetSchema = z.object({
  url: z.string().url(),
  key: z.string(),
  name: z.string(),
  size: z.number().int(),
  type: z.string(),
  width: z.number().int().optional().nullable(),
  height: z.number().int().optional().nullable(),
  alt: z.string().optional(),
  slot: z.string(),
  slotIndex: z.number().int(),
  folder: z.string().optional(),
});

export async function listMediaAssets() {
  await adminContext();
  return prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
}

export async function registerMediaAsset(input: z.infer<typeof assetSchema>): Promise<ActionResult<{ id: string }>> {
  const { actorId } = await adminContext();
  const parsed = assetSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const created = await prisma.mediaAsset.create({
    data: { ...parsed.data, slot: parsed.data.slot as MediaSlot },
  });
  await writeAudit({ action: "CREATE", entity: "MediaAsset", entityId: created.id, summary: `Uploaded ${created.name}`, actorId });
  invalidate([TAGS.media], ["/"]);
  return ok({ id: created.id });
}

export async function updateMediaAsset(
  id: string,
  patch: { alt?: string; slot?: MediaSlot; slotIndex?: number },
): Promise<ActionResult> {
  await adminContext();
  await prisma.mediaAsset.update({ where: { id }, data: patch });
  invalidate([TAGS.media], ["/"]);
  return ok();
}

export async function deleteMediaAsset(id: string): Promise<ActionResult> {
  const { actorId } = await adminContext();
  const row = await prisma.mediaAsset.delete({ where: { id } });
  await deleteUploadThingFiles([row.key]);
  await writeAudit({ action: "DELETE", entity: "MediaAsset", entityId: id, summary: `Deleted ${row.name}`, actorId });
  invalidate([TAGS.media], ["/"]);
  return ok();
}
