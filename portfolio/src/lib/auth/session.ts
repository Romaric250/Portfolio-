import "server-only";

import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) notFound();

  const admin = await prisma.adminUser.findUnique({
    where: { id: session.user.id },
    select: { sessionVersion: true },
  });
  if (!admin || admin.sessionVersion !== session.user.sessionVersion) notFound();

  return session;
}

export async function requireAdminApi(): Promise<Response | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(null, { status: 404 });
  }

  const admin = await prisma.adminUser.findUnique({
    where: { id: session.user.id },
    select: { sessionVersion: true },
  });
  if (!admin || admin.sessionVersion !== session.user.sessionVersion) {
    return new Response(null, { status: 404 });
  }

  return null;
}
