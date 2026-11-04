import { generateSecret, verify } from "otplib";
import { verifyPassword } from "@/lib/auth/password";

export function generateTotpSecret(): string {
  return generateSecret();
}

export async function verifyTotpCode(secret: string, token: string): Promise<boolean> {
  const result = await verify({ secret, token });
  return result.valid;
}

const RECOVERY_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function generateRecoveryCodes(count = 10): string[] {
  const codes: string[] = [];
  for (let c = 0; c < count; c += 1) {
    let part = "";
    for (let i = 0; i < 10; i += 1) {
      part += RECOVERY_ALPHABET[Math.floor(Math.random() * RECOVERY_ALPHABET.length)]!;
    }
    codes.push(`${part.slice(0, 5)}-${part.slice(5)}`);
  }
  return codes;
}

export async function findRecoveryCodeIndex(plain: string, hashedCodes: string[]): Promise<number | null> {
  const normalized = plain.trim().toUpperCase().replace(/\s+/g, "");
  for (let i = 0; i < hashedCodes.length; i += 1) {
    const hash = hashedCodes[i];
    if (hash && (await verifyPassword(normalized, hash))) return i;
  }
  return null;
}
