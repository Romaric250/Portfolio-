import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full rounded-lg bg-bg-elevated px-3 py-2 text-sm text-fg shadow-xs hairline transition-[box-shadow] outline-none placeholder:text-fg-subtle focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-2 aria-invalid:ring-danger/40",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
