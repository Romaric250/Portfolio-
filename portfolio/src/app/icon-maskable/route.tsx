import { renderPwaIcon } from "@/lib/seo/pwa-icon";

export const dynamic = "force-static";

export function GET() {
  return renderPwaIcon(512, true);
}
