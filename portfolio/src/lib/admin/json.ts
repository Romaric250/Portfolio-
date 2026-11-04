import type { Prisma } from "@prisma/client";

export function asInputJson(value: Record<string, unknown> | null | undefined): Prisma.InputJsonValue | undefined {
  if (value === null || value === undefined) return undefined;
  return value as Prisma.InputJsonValue;
}
