import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-lg bg-bg-elevated px-3 py-2 text-sm text-fg shadow-xs hairline transition-[box-shadow,color] outline-none selection:bg-accent selection:text-accent-fg file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-fg-subtle focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-2 aria-invalid:ring-danger/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
