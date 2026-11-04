import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/session";
import { exportSubscribersCsv } from "@/server/actions/subscribers";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const result = await exportSubscribersCsv();
  if (!result.ok) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return new NextResponse(result.data.csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
