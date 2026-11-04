"use server";

import { z } from "zod";
import { invalidate, TAGS } from "@/lib/cache";
import { writeAudit } from "@/lib/admin/audit";
import { fail, ok, type ActionResult } from "@/lib/admin/types";
import { prisma } from "@/lib/db/prisma";
import { deleteUploadThingFiles } from "@/lib/uploadthing/delete";
import { adminContext } from "@/server/actions/helpers";

const schema = z.object({
  fileName: z.string().min(1),
  useUploadedCv: z.boolean(),
  uploadedUrl: z.string().optional(),
  uploadedKey: z.string().optional(),
  summary: z.string(),
  referencesNote: z.string(),
  includeCommunity: z.boolean(),
  includeAwards: z.boolean(),
});

export async function getCvSettings() {
  await adminContext();
  return prisma.cvSettings.findFirst({ where: { key: "default" } });
}

export async function saveCvSettings(input: z.infer<typeof schema>): Promise<ActionResult> {
  const { actorId } = await adminContext();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");

  const existing = await prisma.cvSettings.findFirst({ where: { key: "default" } });
  const data = {
    ...parsed.data,
    uploadedAt: parsed.data.useUploadedCv && parsed.data.uploadedUrl ? new Date() : existing?.uploadedAt,
  };

  if (existing?.uploadedKey && parsed.data.uploadedKey && existing.uploadedKey !== parsed.data.uploadedKey) {
    await deleteUploadThingFiles([existing.uploadedKey]);
  }

  if (existing) await prisma.cvSettings.update({ where: { id: existing.id }, data });
  else await prisma.cvSettings.create({ data: { key: "default", ...data } });

  await writeAudit({ action: "SETTINGS", entity: "CvSettings", summary: "Updated CV settings", actorId });
  invalidate([TAGS.cv], ["/cv"]);
  return ok();
}
