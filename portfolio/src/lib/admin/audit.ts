import type { AuditAction, Prisma } from "@prisma/client";
import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";

export async function writeAudit(input: {
  action: AuditAction;
  entity: string;
  entityId?: string;
  summary: string;
  actorId?: string;
  meta?: Prisma.InputJsonValue;
}): Promise<void> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? undefined;
  const userAgent = h.get("user-agent") ?? undefined;

  await prisma.auditLog.create({
    data: {
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      summary: input.summary,
      actorId: input.actorId,
      meta: input.meta,
      ip,
      userAgent,
    },
  });
}
