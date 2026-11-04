import "server-only";

import { prisma } from "@/lib/db/prisma";

const WINDOW_MS = 15 * 60 * 1000;
const LOCK_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;

function keysFor(email: string, ip: string): string[] {
  return [`email:${email.trim().toLowerCase()}`, `ip:${ip}`];
}

export async function recordLoginAttempt(input: {
  email: string;
  ip: string;
  success: boolean;
}): Promise<void> {
  const email = input.email.trim().toLowerCase();
  const rows = keysFor(email, input.ip).map((key) => ({
    key,
    success: input.success,
    ip: input.ip,
    email,
  }));
  await prisma.loginAttempt.createMany({ data: rows });
}

async function isKeyLocked(key: string, since: Date): Promise<boolean> {
  const failures = await prisma.loginAttempt.findMany({
    where: { key, success: false, createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
    take: MAX_FAILURES,
  });
  if (failures.length < MAX_FAILURES) return false;
  const latest = failures[0];
  if (!latest) return false;
  return latest.createdAt.getTime() + LOCK_MS > Date.now();
}

export async function isLoginLocked(email: string, ip: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS);
  for (const key of keysFor(email, ip)) {
    if (await isKeyLocked(key, since)) return true;
  }
  return false;
}
