"use server";

import type { InquiryStatus } from "@prisma/client";
import { z } from "zod";
import { writeAudit } from "@/lib/admin/audit";
import { fail, ok, type ActionResult } from "@/lib/admin/types";
import { prisma } from "@/lib/db/prisma";
import { adminContext } from "@/server/actions/helpers";

export async function listMessages(filters?: { status?: InquiryStatus; archived?: boolean }) {
  await adminContext();
  return prisma.contactMessage.findMany({
    where: {
      status: filters?.status,
      archived: filters?.archived ?? false,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateMessage(
  id: string,
  patch: { status?: InquiryStatus; read?: boolean; archived?: boolean; notes?: string },
): Promise<ActionResult> {
  const { actorId } = await adminContext();
  await prisma.contactMessage.update({ where: { id }, data: patch });
  await writeAudit({ action: "UPDATE", entity: "ContactMessage", entityId: id, summary: "Updated message", actorId });
  return ok();
}

export async function exportMessagesCsv(): Promise<ActionResult<{ csv: string }>> {
  const { actorId } = await adminContext();
  const rows = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  const { toCsv } = await import("@/lib/utils");
  const csv = toCsv(
    rows.map((r) => ({
      id: r.id,
      kind: r.kind,
      name: r.name,
      email: r.email,
      company: r.company ?? "",
      subject: r.subject ?? "",
      status: r.status,
      read: r.read,
      createdAt: r.createdAt.toISOString(),
    })),
  );
  await writeAudit({ action: "EXPORT", entity: "ContactMessage", summary: "Exported inbox CSV", actorId });
  return ok({ csv });
}

const bulkSchema = z.object({ ids: z.array(z.string()), status: z.enum(["NEW", "CONTACTED", "WON", "LOST", "ARCHIVED"]) });

export async function bulkUpdateMessageStatus(input: z.infer<typeof bulkSchema>): Promise<ActionResult> {
  await adminContext();
  const parsed = bulkSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid input");
  await prisma.contactMessage.updateMany({
    where: { id: { in: parsed.data.ids } },
    data: {
      status: parsed.data.status,
      archived: parsed.data.status === "ARCHIVED",
    },
  });
  return ok();
}
