import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  replicaSetWarned: boolean | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export function isMongoReplicaSetError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return /replica set/i.test(msg);
}

/** Prisma MongoDB writes use transactions. Standalone `mongod` cannot do that — warn once, not per request. */
export function warnIfReplicaSetRequired(error: unknown, context: string): boolean {
  if (!isMongoReplicaSetError(error)) return false;
  if (!globalForPrisma.replicaSetWarned) {
    globalForPrisma.replicaSetWarned = true;
    console.warn(
      `[db] ${context}: Prisma requires MongoDB as a replica set (Atlas is already one). Locally run mongod --replSet rs0 and rs.initiate(), or use DATABASE_URL from Atlas. Further write errors of this kind are silenced.`,
    );
  }
  return true;
}

/**
 * Single-document insert that does not open a Prisma transaction.
 * Works on standalone MongoDB; used for high-volume beacons like page views.
 */
export async function insertRaw(collection: string, document: Record<string, unknown>): Promise<void> {
  const createdAt = document.createdAt instanceof Date ? document.createdAt : new Date();
  await prisma.$runCommandRaw({
    insert: collection,
    documents: [
      {
        ...document,
        createdAt: { $date: createdAt.toISOString() },
      },
    ],
    ordered: false,
  });
}

export default prisma;
