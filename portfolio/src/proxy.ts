import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createGateToken, GATE_COOKIE, timingSafeEqualSecret, verifyGateToken } from "@/lib/auth/gate";
import { hasValidAuthSession } from "@/lib/auth/session-jwt";

const BLOCKED_AUTH_PATHS = new Set(["/api/auth/signin", "/api/auth/signup", "/api/auth/error"]);

function notFoundRewrite(origin: string): NextResponse {
  return NextResponse.rewrite(new URL("/404", origin), { status: 404 });
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const origin = request.nextUrl.origin;
  const isProd = process.env.NODE_ENV === "production";
  const cookieHeader = request.headers.get("cookie");

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const secret = process.env.AUTH_SECRET;
    if (!(await hasValidAuthSession(cookieHeader, secret, isProd))) {
      return notFoundRewrite(origin);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/auth")) {
    if (BLOCKED_AUTH_PATHS.has(pathname)) {
      return notFoundRewrite(origin);
    }
    return NextResponse.next();
  }

  if (pathname === "/login") {
    const sr = request.nextUrl.searchParams.get("sr");
    const adminSecret = process.env.ADMIN_SECRET_KEY;
    const gateSecret = process.env.ADMIN_GATE_JWT_SECRET;

    if (sr && adminSecret && gateSecret && timingSafeEqualSecret(sr, adminSecret)) {
      const token = await createGateToken(gateSecret);
      const redirectUrl = new URL("/login", origin);
      const response = NextResponse.redirect(redirectUrl, 302);
      response.cookies.set(GATE_COOKIE, token, {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        path: "/",
        maxAge: 20 * 60,
      });
      return response;
    }

    const gate = request.cookies.get(GATE_COOKIE)?.value;
    if (!gateSecret || !gate || !(await verifyGateToken(gate, gateSecret))) {
      return notFoundRewrite(origin);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/admin/:path*", "/api/admin/:path*", "/api/auth/:path*"],
};
