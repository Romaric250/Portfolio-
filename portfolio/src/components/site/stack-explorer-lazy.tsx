"use client";

import dynamic from "next/dynamic";
import type { SerializableSkill } from "@/components/site/stack-explorer";

const StackExplorer = dynamic(
  () => import("@/components/site/stack-explorer").then((m) => m.StackExplorer),
  { ssr: false, loading: () => <p className="text-sm text-fg-muted">Loading stack explorer…</p> },
);

export function StackExplorerLazy({ skills, compact }: { skills: SerializableSkill[]; compact?: boolean }) {
  return <StackExplorer skills={skills} compact={compact} />;
}
