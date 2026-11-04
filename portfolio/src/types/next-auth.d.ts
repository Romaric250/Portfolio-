import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      sessionVersion: number;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    sessionVersion: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    name?: string;
    sessionVersion?: number;
  }
}
