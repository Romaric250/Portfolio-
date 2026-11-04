import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { CredentialsSignin } from "next-auth";
import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/db/prisma";
import { writeAudit } from "@/lib/auth/audit";
import { GATE_COOKIE, readCookieValue, verifyGateToken } from "@/lib/auth/gate";
import { isLoginLocked, recordLoginAttempt } from "@/lib/auth/login-lockout";
import { DUMMY_PASSWORD_HASH, verifyPassword } from "@/lib/auth/password";
import { findRecoveryCodeIndex, verifyTotpCode } from "@/lib/auth/totp";
import { getClientIp, getUserAgent, rateLimit } from "@/lib/rate-limit";
import { env } from "@/lib/env";

type CredentialFields = {
  email?: string;
  password?: string;
  totpCode?: string;
  recoveryCode?: string;
};

async function failLogin(input: {
  email: string;
  ip: string;
  userAgent: string | null;
  actorId?: string;
  summary: string;
}): Promise<null> {
  await recordLoginAttempt({ email: input.email, ip: input.ip, success: false });
  await writeAudit({
    action: "LOGIN_FAILED",
    entity: "AdminUser",
    entityId: input.actorId,
    summary: input.summary,
    ip: input.ip,
    userAgent: input.userAgent ?? undefined,
    actorId: input.actorId,
  });
  return null;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        totpCode: { label: "Authenticator code", type: "text" },
        recoveryCode: { label: "Recovery code", type: "text" },
      },
      authorize: async (credentials, request) => {
        const fields = credentials as CredentialFields;
        const email = fields.email?.trim().toLowerCase() ?? "";
        const password = fields.password ?? "";
        const totpCode = fields.totpCode?.trim() ?? "";
        const recoveryCode = fields.recoveryCode?.trim() ?? "";

        const ip = request?.headers ? await resolveIpFromRequest(request) : await getClientIp();
        const userAgent = request?.headers?.get("user-agent") ?? (await getUserAgent());

        const gateToken = readCookieValue(request?.headers?.get("cookie"), GATE_COOKIE);
        if (!gateToken || !(await verifyGateToken(gateToken, env.ADMIN_GATE_JWT_SECRET))) {
          await failLogin({ email, ip, userAgent, summary: "Login without valid admin gate" });
          return null;
        }

        if (!email || !password) {
          await failLogin({ email, ip, userAgent, summary: "Missing email or password" });
          return null;
        }

        if (await isLoginLocked(email, ip)) {
          await failLogin({ email, ip, userAgent, summary: "Login locked after repeated failures" });
          return null;
        }

        const rl = await rateLimit(`login:${ip}`, 40, 15 * 60);
        if (!rl.ok) {
          await failLogin({ email, ip, userAgent, summary: "Login rate limit exceeded" });
          return null;
        }

        const user = await prisma.adminUser.findUnique({ where: { email } });
        const passwordOk = await verifyPassword(password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);

        if (!user || !passwordOk) {
          await failLogin({ email, ip, userAgent, actorId: user?.id, summary: "Invalid credentials" });
          return null;
        }

        if (user.totpEnabled) {
          if (!totpCode && !recoveryCode) {
            const err = new CredentialsSignin();
            err.code = "TOTP_REQUIRED";
            throw err;
          }

          let secondFactorOk = false;
          if (totpCode && user.totpSecret) {
            secondFactorOk = await verifyTotpCode(user.totpSecret, totpCode);
          }
          if (!secondFactorOk && recoveryCode) {
            const index = await findRecoveryCodeIndex(recoveryCode, user.recoveryCodes);
            if (index !== null) {
              const nextCodes = user.recoveryCodes.filter((_, i) => i !== index);
              await prisma.adminUser.update({
                where: { id: user.id },
                data: { recoveryCodes: nextCodes },
              });
              secondFactorOk = true;
            }
          }
          if (!secondFactorOk) {
            await failLogin({ email, ip, userAgent, actorId: user.id, summary: "Invalid second factor" });
            return null;
          }
        }

        if (typeof user.sessionVersion !== "number" || user.sessionVersion < 1) {
          await failLogin({ email, ip, userAgent, actorId: user.id, summary: "Invalid session version" });
          return null;
        }

        await recordLoginAttempt({ email, ip, success: true });
        await prisma.adminUser.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date(), lastLoginIp: ip },
        });
        await writeAudit({
          action: "LOGIN",
          entity: "AdminUser",
          entityId: user.id,
          summary: "Admin login",
          ip,
          userAgent: userAgent ?? undefined,
          actorId: user.id,
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          sessionVersion: user.sessionVersion,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.sessionVersion = user.sessionVersion;
      } else if (token.sub) {
        const admin = await prisma.adminUser.findUnique({
          where: { id: token.sub },
          select: { sessionVersion: true, email: true, name: true },
        });
        if (!admin || admin.sessionVersion !== token.sessionVersion) {
          return token;
        }
        token.email = admin.email;
        token.name = admin.name;
        token.sessionVersion = admin.sessionVersion;
      }
      return token;
    },
    async session({ session, token }) {
      if (!token.sub || token.sessionVersion === undefined) {
        return { ...session, user: { ...session.user, id: "", email: "", name: "", sessionVersion: 0 } };
      }
      const admin = await prisma.adminUser.findUnique({
        where: { id: token.sub },
        select: { sessionVersion: true, email: true, name: true },
      });
      if (!admin || admin.sessionVersion !== token.sessionVersion) {
        return { ...session, user: { ...session.user, id: "", email: "", name: "", sessionVersion: 0 } };
      }
      session.user.id = token.sub;
      session.user.email = admin.email;
      session.user.name = admin.name;
      session.user.sessionVersion = admin.sessionVersion;
      return session;
    },
  },
});

async function resolveIpFromRequest(request: Request): Promise<string> {
  const fwd = request.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}
