import "server-only";
import { headers } from "next/headers";
import { prisma, warnIfReplicaSetRequired } from "@/lib/db/prisma";

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  const ip = fwd?.split(",")[0]?.trim() || h.get("x-real-ip") || h.get("cf-connecting-ip") || "unknown";
  return ip;
}

export async function getUserAgent(): Promise<string | null> {
  const h = await headers();
  return h.get("user-agent");
}

type RateLimitResult = { ok: boolean; remaining: number; resetAt: Date };

/**
 * Fixed-window rate limiter backed by MongoDB (works across serverless instances).
 * @param key   e.g. `contact:1.2.3.4`
 * @param limit max hits per window
 * @param windowSeconds window length
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  const now = new Date();
  try {
    const existing = await prisma.rateLimit.findUnique({ where: { key } });
    if (!existing || existing.resetAt <= now) {
      const resetAt = new Date(now.getTime() + windowSeconds * 1000);
      await prisma.rateLimit.upsert({
        where: { key },
        create: { key, count: 1, resetAt },
        update: { count: 1, resetAt },
      });
      return { ok: true, remaining: limit - 1, resetAt };
    }
    if (existing.count >= limit) return { ok: false, remaining: 0, resetAt: existing.resetAt };
    const updated = await prisma.rateLimit.update({ where: { key }, data: { count: { increment: 1 } } });
    return { ok: true, remaining: Math.max(0, limit - updated.count), resetAt: updated.resetAt };
  } catch (error) {
    if (!warnIfReplicaSetRequired(error, "rate-limit")) {
      console.error("[rate-limit]", error instanceof Error ? error.message : error);
    }
    return { ok: true, remaining: limit, resetAt: new Date(now.getTime() + windowSeconds * 1000) };
  }
}
