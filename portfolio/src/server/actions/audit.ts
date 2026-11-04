"use server";

import { prisma } from "@/lib/db/prisma";
import { adminContext } from "@/server/actions/helpers";

export async function listAuditLogs(limit = 100) {
  await adminContext();
  return prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: limit });
}
