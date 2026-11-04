import { SiteShell } from "@/components/site/site-shell";

export const dynamic = "force-dynamic";

export default function SiteLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <SiteShell>
      {children}
      {modal}
    </SiteShell>
  );
}
