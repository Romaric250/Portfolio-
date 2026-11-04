"use client";

import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const COUNTERS = [
  { value: 5000, suffix: "+", label: "Students engaged at TIC Summit 2026", note: "Course delivery & workshops" },
  { value: 500, suffix: "+", label: "Girls reached through Tech4Girls Cameroon", note: "Curriculum and mentorship" },
  { value: 250, suffix: "+", label: "Students mentored", note: "Open Dreams, TIC Summit, Technovation" },
  { value: 500, suffix: "+", label: "Students taught", note: "CS & ICT instruction" },
  { value: 100, suffix: "+", label: "Production API endpoints shipped", note: "Brilydal & health-tech backends" },
  { value: 3, suffix: "", label: "Hospitals running the platform", note: "Backend led for Dewise" },
  { value: 3, suffix: "+", label: "Enterprise health systems integrated", note: "OpenMRS, OpenHIM, DHIS2" },
  { value: 20, suffix: "+", label: "Lesson plans written", note: "CS & ICT instruction" },
  { value: 2, suffix: "nd", label: "Place nationally at CityHack", note: "Of 1,500 participants · Jobo" },
] as const;

export function ImpactCounters({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3", className)}>
      {COUNTERS.map((c, i) => (
        <Reveal key={c.label} delay={i * 0.05} className="bg-bg-elevated p-6 md:p-8">
          <p className="font-display text-4xl font-semibold tabular-nums text-fg md:text-5xl">
            <CountUp to={c.value} suffix={c.suffix} />
          </p>
          <p className="mt-2 text-sm font-medium text-fg">{c.label}</p>
          <p className="mt-1 font-mono text-xs text-fg-subtle">{c.note}</p>
        </Reveal>
      ))}
    </div>
  );
}
