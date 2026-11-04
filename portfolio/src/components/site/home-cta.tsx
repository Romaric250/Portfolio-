"use client";

import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStartProject } from "@/components/site/start-project-modal";

export function HomeStartProjectCta() {
  const { open } = useStartProject();
  return (
    <Button variant="accent" size="lg" onClick={() => open("/")}>
      <Rocket className="size-4" aria-hidden />
      Start a project
    </Button>
  );
}
