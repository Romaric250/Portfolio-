"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { writeAudit } from "@/lib/admin/audit";
import { fail, ok, type ActionResult } from "@/lib/admin/types";
import { generateRecoveryCodes, generateTotpSecret, verifyTotpCode } from "@/lib/auth/totp";
import { prisma } from "@/lib/db/prisma";
import { adminContext } from "@/server/actions/helpers";

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(12),
});

function totpUri(email: string, secret: string): string {
  const label = encodeURIComponent(`Romaric Portfolio Admin:${email}`);
  const issuer = encodeURIComponent("Romaric Portfolio Admin");
  return `otpauth://totp/${label}?secret=${secret}&issuer=${issuer}`;
}

export async function getSecurityProfile() {
  const { session } = await adminContext();
  const user = await prisma.adminUser.findUnique({
    where: { id: session.user.id },
    select: { email: true, totpEnabled: true, recoveryCodes: true, lastLoginAt: true },
  });
  return user;
}

export async function changePassword(input: z.infer<typeof passwordSchema>): Promise<ActionResult> {
  const { actorId, session } = await adminContext();
  const parsed = passwordSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");

  const user = await prisma.adminUser.findUnique({ where: { id: session.user.id } });
  if (!user) return fail("User not found");
  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) return fail("Current password is incorrect");

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.adminUser.update({ where: { id: user.id }, data: { passwordHash } });
  await writeAudit({ action: "SECURITY", entity: "AdminUser", entityId: user.id, summary: "Changed password", actorId });
  return ok();
}

export async function setupTotp(): Promise<ActionResult<{ secret: string; otpauth: string }>> {
  const { session, actorId } = await adminContext();
  const secret = generateTotpSecret();
  const otpauth = totpUri(session.user.email, secret);
  await prisma.adminUser.update({ where: { id: session.user.id }, data: { totpSecret: secret, totpEnabled: false } });
  await writeAudit({ action: "SECURITY", entity: "AdminUser", entityId: session.user.id, summary: "Started TOTP setup", actorId });
  return ok({ secret, otpauth });
}

export async function confirmTotp(code: string): Promise<ActionResult<{ recoveryCodes: string[] }>> {
  const { session, actorId } = await adminContext();
  const user = await prisma.adminUser.findUnique({ where: { id: session.user.id } });
  if (!user?.totpSecret) return fail("Setup TOTP first");
  if (!(await verifyTotpCode(user.totpSecret, code))) return fail("Invalid code");

  const recoveryCodes = generateRecoveryCodes(8);
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { totpEnabled: true, recoveryCodes },
  });
  await writeAudit({ action: "SECURITY", entity: "AdminUser", entityId: user.id, summary: "Enabled TOTP", actorId });
  return ok({ recoveryCodes });
}

export async function disableTotp(code: string): Promise<ActionResult> {
  const { session, actorId } = await adminContext();
  const user = await prisma.adminUser.findUnique({ where: { id: session.user.id } });
  if (!user?.totpSecret || !user.totpEnabled) return fail("TOTP not enabled");
  if (!(await verifyTotpCode(user.totpSecret, code))) return fail("Invalid code");

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { totpEnabled: false, totpSecret: null, recoveryCodes: [] },
  });
  await writeAudit({ action: "SECURITY", entity: "AdminUser", entityId: user.id, summary: "Disabled TOTP", actorId });
  return ok();
}

export async function signOutEverywhere(): Promise<ActionResult> {
  const { session, actorId } = await adminContext();
  await prisma.adminUser.update({
    where: { id: session.user.id },
    data: { sessionVersion: { increment: 1 } },
  });
  await writeAudit({ action: "SECURITY", entity: "AdminUser", entityId: session.user.id, summary: "Signed out all sessions", actorId });
  return ok();
}
