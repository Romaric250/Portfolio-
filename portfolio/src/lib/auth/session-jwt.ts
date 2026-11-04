import { decode } from "next-auth/jwt";
import { readCookieValue } from "@/lib/auth/gate";

export const AUTH_SESSION_COOKIE_NAMES = ["__Secure-authjs.session-token", "authjs.session-token"] as const;

export async function decodeAuthJsSessionToken(
  token: string,
  secret: string,
  salt: string,
): Promise<Record<string, unknown> | null> {
  try {
    const payload = await decode({ token, secret, salt });
    if (!payload || typeof payload !== "object") return null;
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getSessionTokenFromRequest(
  cookieHeader: string | null | undefined,
  preferSecure: boolean,
): { token: string; salt: string } | null {
  const order = preferSecure
    ? ([...AUTH_SESSION_COOKIE_NAMES].reverse() as (typeof AUTH_SESSION_COOKIE_NAMES)[number][])
    : [...AUTH_SESSION_COOKIE_NAMES];
  for (const name of order) {
    const token = readCookieValue(cookieHeader, name);
    if (token) return { token, salt: name };
  }
  return null;
}

export async function hasValidAuthSession(
  cookieHeader: string | null | undefined,
  secret: string | undefined,
  preferSecure: boolean,
): Promise<boolean> {
  if (!secret) return false;
  const found = getSessionTokenFromRequest(cookieHeader, preferSecure);
  if (!found) return false;
  const payload = await decodeAuthJsSessionToken(found.token, secret, found.salt);
  if (!payload) return false;
  const exp = payload.exp;
  if (typeof exp === "number" && exp * 1000 < Date.now()) return false;
  return typeof payload.sub === "string" && payload.sub.length > 0;
}
