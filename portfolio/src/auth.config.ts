import type { NextAuthConfig } from "next-auth";

const SESSION_MAX_AGE = 12 * 60 * 60;

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.sessionVersion = user.sessionVersion;
      }
      return token;
    },
    session({ session, token }) {
      if (typeof token.id === "string") {
        session.user.id = token.id;
        session.user.email = token.email ?? "";
        session.user.name = token.name ?? "";
        session.user.sessionVersion = token.sessionVersion ?? 0;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
