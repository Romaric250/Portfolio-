"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ADMIN_NAV } from "@/components/admin/nav-config";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/misc";
import { cn } from "@/lib/utils";

export function AdminSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-bg-elevated transition-[width] duration-200",
        collapsed ? "w-[56px]" : "w-56",
      )}
    >
      <div className="flex h-12 items-center justify-between border-b border-border px-2">
        {!collapsed ? (
          <Link href="/admin" className="truncate px-2 font-display text-sm font-semibold text-fg">
            Admin
          </Link>
        ) : null}
        <Button variant="ghost" size="icon-sm" onClick={onToggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </Button>
      </div>
      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="space-y-4">
          {ADMIN_NAV.map((group) => (
            <div key={group.label}>
              {!collapsed ? (
                <p className="mb-1 px-2 text-[10px] font-semibold tracking-wider text-fg-subtle uppercase">{group.label}</p>
              ) : null}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                          active ? "bg-accent-soft text-accent font-medium" : "text-fg-muted hover:bg-bg-sunken hover:text-fg",
                          collapsed && "justify-center px-0",
                        )}
                      >
                        <Icon className="size-4 shrink-0" />
                        {!collapsed ? <span className="truncate">{item.label}</span> : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
