import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SecurityLabChecklist } from "@/components/site/security-lab-checklist";
import { Reveal } from "@/components/motion/reveal";

export function SecurityLabTeaser() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <Reveal>
        <div className="rounded-2xl border border-border bg-terminal p-6 text-terminal-fg md:p-8">
          <Shield className="size-8 text-accent" aria-hidden />
          <h3 className="mt-4 font-display text-2xl font-semibold">Security Lab — learning in public</h3>
          <p className="mt-3 text-sm leading-relaxed text-terminal-fg/80">
            Cybersecurity is a specialisation I am actively building: secure-by-default backends, threat-aware design,
            and documented experiments — not a claim of mastery. Follow the roadmap, logs, and write-ups as they grow.
          </p>
          <ul className="mt-4 space-y-2 font-mono text-xs text-terminal-fg/70">
            <li>→ Currently learning: defensive web, auth hardening, health-data boundaries</li>
            <li>→ No invented CTF wins, CVEs, or certifications</li>
          </ul>
          <Button variant="accent" size="sm" className="mt-6" asChild>
            <Link href="/security">
              Open Security Lab
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <div>
          <p className="font-accent text-xs font-semibold uppercase tracking-widest text-fg-muted">Secure by default</p>
          <p className="mt-2 text-sm text-fg-muted">Personal checklist I apply before shipping (toggle for your own copy).</p>
          <SecurityLabChecklist className="mt-4" />
        </div>
      </Reveal>
    </div>
  );
}
