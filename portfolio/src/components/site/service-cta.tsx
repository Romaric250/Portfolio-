"use client";

import { Button } from "@/components/ui/button";
import { useStartProject } from "@/components/site/start-project-modal";

export function ServiceCta({ label }: { label?: string }) {
  const { open } = useStartProject();
  return (
    <Button variant="accent" onClick={() => open("/services")}>
      {label ?? "Start a project"}
    </Button>
  );
}
