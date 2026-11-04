"use server";

import { requireAdmin } from "@/lib/auth/session";

export async function adminContext() {
  const session = await requireAdmin();
  return { session, actorId: session.user.id };
}
