"use client";

import dynamic from "next/dynamic";

const TerminalHero = dynamic(
  () => import("@/components/site/terminal-hero").then((m) => m.TerminalHero),
  {
    ssr: false,
    loading: () => <p className="font-mono text-sm text-fg-muted">Loading terminal…</p>,
  },
);

type Props = {
  headline: string;
  tagline: string;
  bio: string;
  availability?: string;
};

export function TerminalHeroClient(props: Props) {
  return <TerminalHero {...props} />;
}
