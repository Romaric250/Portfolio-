"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { ADMIN_NAV } from "@/components/admin/nav-config";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/misc";

const flatItems = ADMIN_NAV.flatMap((g) => g.items.map((i) => ({ ...i, group: g.label })));

export function AdminSearch() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Button variant="outline" size="sm" className="h-8 w-full max-w-xs justify-start gap-2 text-fg-muted" onClick={() => setOpen(true)}>
        <Search className="size-3.5" />
        <span className="flex-1 text-left text-xs">Search admin…</span>
        <Kbd>Cmd K</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Jump to section…" />
        <CommandList>
          <CommandEmpty>No matches.</CommandEmpty>
          {ADMIN_NAV.map((group, idx) => (
            <React.Fragment key={group.label}>
              {idx > 0 ? <CommandSeparator /> : null}
              <CommandGroup heading={group.label}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem
                      key={item.href}
                      onSelect={() => {
                        setOpen(false);
                        router.push(item.href);
                      }}
                    >
                      <Icon className="size-4 text-fg-muted" />
                      {item.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}

export { flatItems };
