import { SiteShell } from "@/components/site/site-shell";

export const dynamic = "force-dynamic";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
