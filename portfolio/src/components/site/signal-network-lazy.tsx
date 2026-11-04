"use client";

import dynamic from "next/dynamic";

const SignalNetwork = dynamic(
  () => import("@/components/site/signal-network").then((m) => m.SignalNetwork),
  { ssr: false },
);

export function SignalNetworkLazy({ className }: { className?: string }) {
  return <SignalNetwork className={className} />;
}
