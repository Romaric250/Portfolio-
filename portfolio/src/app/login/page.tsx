import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { GATE_COOKIE, verifyGateToken } from "@/lib/auth/gate";
import { env } from "@/lib/env";
import { LoginForm } from "@/app/login/login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const jar = await cookies();
  const gate = jar.get(GATE_COOKIE)?.value;
  if (!gate || !(await verifyGateToken(gate, env.ADMIN_GATE_JWT_SECRET))) {
    notFound();
  }

  return <LoginForm />;
}
