"use server";

import { writeAudit } from "@/lib/admin/audit";
import { ok, type ActionResult } from "@/lib/admin/types";
import { prisma } from "@/lib/db/prisma";
import { toCsv } from "@/lib/utils";
import { adminContext } from "@/server/actions/helpers";

export async function listSubscribers() {
  await adminContext();
  return prisma.subscriber.findMany({ where: { unsubscribedAt: null }, orderBy: { createdAt: "desc" } });
}

export async function exportSubscribersCsv(): Promise<ActionResult<{ csv: string }>> {
  const { actorId } = await adminContext();
  const rows = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });
  const csv = toCsv(
    rows.map((r) => ({
      email: r.email,
      confirmed: r.confirmed,
      source: r.source ?? "",
      createdAt: r.createdAt.toISOString(),
      unsubscribedAt: r.unsubscribedAt?.toISOString() ?? "",
    })),
  );
  await writeAudit({ action: "EXPORT", entity: "Subscriber", summary: "Exported subscribers CSV", actorId });
  return ok({ csv });
}
