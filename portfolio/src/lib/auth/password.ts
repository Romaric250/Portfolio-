import bcrypt from "bcryptjs";

const ROUNDS = 12;

export const DUMMY_PASSWORD_HASH =
  "$2b$12$oltbbEfGO18eK4Uvv45ieuJELTrKqmnPyS5uPxB.2G3T4O9wkEIJe";

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
