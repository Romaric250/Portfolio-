"use server";

import { AuthError, CredentialsSignin } from "next-auth";
import { cookies } from "next/headers";
import { auth, signIn, signOut } from "@/auth";
import { writeAudit } from "@/lib/auth/audit";
import { GATE_COOKIE, verifyGateToken } from "@/lib/auth/gate";
import { env } from "@/lib/env";
import { prisma } from "@/lib/db/prisma";
import { getClientIp, getUserAgent } from "@/lib/rate-limit";

export type LoginActionResult =
  | { ok: true }
  | { ok: false; error: string; totpRequired?: boolean };

async function assertAdminGate(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(GATE_COOKIE)?.value;
  if (!token) return false;
  return verifyGateToken(token, env.ADMIN_GATE_JWT_SECRET);
}

export async function loginAction(input: {
  email: string;
  password: string;
  totpCode?: string;
  recoveryCode?: string;
}): Promise<LoginActionResult> {
  if (!(await assertAdminGate())) {
    return { ok: false, error: "Invalid credentials" };
  }

  try {
    await signIn("credentials", {
      redirect: false,
      email: input.email,
      password: input.password,
      totpCode: input.totpCode ?? "",
      recoveryCode: input.recoveryCode ?? "",
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof CredentialsSignin && error.code === "TOTP_REQUIRED") {
      return { ok: false, error: "Second factor required", totpRequired: true };
    }
    if (error instanceof AuthError) {
      return { ok: false, error: "Invalid credentials" };
    }
    throw error;
  }
}

export async function logoutAction(): Promise<void> {
  const session = await auth();
  const ip = await getClientIp();
  const userAgent = await getUserAgent();

  if (session?.user?.id) {
    await writeAudit({
      action: "LOGOUT",
      entity: "AdminUser",
      entityId: session.user.id,
      summary: "Admin logout",
      ip,
      userAgent: userAgent ?? undefined,
      actorId: session.user.id,
    });
  }

  await signOut({ redirect: false });
}

export async function logoutEverywhereAction(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  await prisma.adminUser.update({
    where: { id: session.user.id },
    data: { sessionVersion: { increment: 1 } },
  });

  await writeAudit({
    action: "SECURITY",
    entity: "AdminUser",
    entityId: session.user.id,
    summary: "Session revoked on all devices",
    ip: await getClientIp(),
    userAgent: (await getUserAgent()) ?? undefined,
    actorId: session.user.id,
  });

  await signOut({ redirect: false });
}
