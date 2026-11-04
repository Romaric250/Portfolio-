import { SignJWT, jwtVerify } from "jose";
import { timingSafeEqualUtf8 } from "@/lib/auth/secure-compare";

export const GATE_COOKIE = "admin_gate";

const GATE_TTL_SEC = 20 * 60;

function gateSecretKey(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

export async function createGateToken(secret: string): Promise<string> {
  return new SignJWT({ gate: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${GATE_TTL_SEC}s`)
    .sign(gateSecretKey(secret));
}

export async function verifyGateToken(token: string, secret: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, gateSecretKey(secret), { algorithms: ["HS256"] });
    return payload.gate === true;
  } catch {
    return false;
  }
}

export function timingSafeEqualSecret(provided: string, expected: string): boolean {
  return timingSafeEqualUtf8(provided, expected);
}

export function readCookieValue(cookieHeader: string | null | undefined, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    if (key === name) return decodeURIComponent(trimmed.slice(eq + 1));
  }
  return undefined;
}
