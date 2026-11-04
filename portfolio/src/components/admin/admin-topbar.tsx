"use client";

import Link from "next/link";
import { ExternalLink, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { AdminSearch } from "@/components/admin/admin-search";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initials } from "@/lib/utils";

export function AdminTopbar({ email, name }: { email: string; name?: string | null }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const display = name ?? email;

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-bg px-4">
      <div className="hidden flex-1 sm:block">
        <AdminSearch />
      </div>
      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link href="/" target="_blank" rel="noopener noreferrer" aria-label="View site">
            <ExternalLink className="size-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Toggle theme"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" || resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-2 pl-1.5">
              <span className="flex size-6 items-center justify-center rounded-full bg-bg-sunken text-[10px] font-semibold">
                {initials(display)}
              </span>
              <span className="hidden max-w-[120px] truncate text-xs sm:inline">{display}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium">{display}</p>
              <p className="text-xs text-fg-muted">{email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/security">Account security</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-danger focus:text-danger"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
