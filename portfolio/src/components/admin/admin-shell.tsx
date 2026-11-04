"use client";

import * as React from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { Providers } from "@/components/providers";

export function AdminShell({
  email,
  name,
  children,
}: {
  email: string;
  name?: string | null;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Providers>
      <div className="flex h-dvh overflow-hidden bg-bg text-fg">
        <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar email={email} name={name} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </Providers>
  );
}
