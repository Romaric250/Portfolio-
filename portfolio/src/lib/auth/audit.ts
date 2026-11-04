import "server-only";

import type { AuditAction } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

type WriteAuditInput = {
  action: AuditAction;
  entity: string;
  entityId?: string;
  summary: string;
  ip?: string;
  userAgent?: string;
  actorId?: string;
};

export async function writeAudit(input: WriteAuditInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? null,
        summary: input.summary,
        ip: input.ip ?? null,
        userAgent: input.userAgent ?? null,
        actorId: input.actorId ?? null,
      },
    });
  } catch (error) {
    console.error("[audit]", error instanceof Error ? error.message : error);
  }
}
