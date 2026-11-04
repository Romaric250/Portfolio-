import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { insertRaw, warnIfReplicaSetRequired } from "@/lib/db/prisma";

export const runtime = "nodejs";

const schema = z.object({
  path: z.string().min(1).max(300),
  referrer: z.string().max(500).nullable().optional(),
});

function deviceFrom(ua: string | null): string {
  if (!ua) return "unknown";
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (/mobi|android|iphone/i.test(ua)) return "mobile";
  if (/bot|crawl|spider|slurp|preview/i.test(ua)) return "bot";
  return "desktop";
}

export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
  const { path, referrer } = parsed.data;
  if (path.startsWith("/admin") || path.startsWith("/login") || path.startsWith("/api")) {
    return NextResponse.json({ ok: true });
  }
  const ua = req.headers.get("user-agent");
  const device = deviceFrom(ua);
  if (device === "bot") return NextResponse.json({ ok: true });

  let ref: string | null = null;
  if (referrer) {
    try {
      const u = new URL(referrer);
      const self = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://rlonfonyuy.online");
      ref = u.host === self.host ? null : u.host;
    } catch {
      ref = null;
    }
  }
  const country = req.headers.get("x-vercel-ip-country") ?? req.headers.get("cf-ipcountry") ?? null;
  const day = new Date().toISOString().slice(0, 10);

  try {
    await insertRaw("PageView", { path, referrer: ref, country, device, day, createdAt: new Date() });
  } catch (error) {
    if (!warnIfReplicaSetRequired(error, "analytics")) {
      console.error("[analytics]", error instanceof Error ? error.message : error);
    }
  }
  return NextResponse.json({ ok: true });
}
