"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "!bg-bg-elevated !text-fg !shadow-md !border-0 hairline !rounded-xl",
            description: "!text-fg-muted",
          },
        }}
      />
    </ThemeProvider>
  );
}
