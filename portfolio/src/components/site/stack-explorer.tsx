"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { SkillDomain, SkillLevel } from "@prisma/client";
import { enumLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EASE } from "@/components/motion/reveal";

export type SerializableSkill = {
  id: string;
  name: string;
  slug: string;
  domain: SkillDomain;
  level: SkillLevel;
  description: string | null;
  builtWith: string | null;
  relatedProjectSlugs: string[];
};

type StackExplorerProps = {
  skills: SerializableSkill[];
  compact?: boolean;
};

const DOMAINS: SkillDomain[] = [
  "LANGUAGES",
  "BACKEND",
  "FRONTEND",
  "DATABASES",
  "HEALTH_INFORMATICS",
  "SECURITY",
  "TOOLS",
  "SOFT_SKILLS",
];

const LEVELS: SkillLevel[] = ["PRODUCTION", "PROFICIENT", "LEARNING", "EXPLORING"];

export function StackExplorer({ skills, compact }: StackExplorerProps) {
  const reduce = useReducedMotion();
  const [domain, setDomain] = React.useState<SkillDomain | "ALL">("ALL");
  const [level, setLevel] = React.useState<SkillLevel | "ALL">("ALL");
  const [active, setActive] = React.useState<SerializableSkill | null>(null);

  const filtered = skills.filter((s) => {
    if (domain !== "ALL" && s.domain !== domain) return false;
    if (level !== "ALL" && s.level !== level) return false;
    return true;
  });

  const grouped = DOMAINS.map((d) => ({
    domain: d,
    items: filtered.filter((s) => s.domain === d),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <div className={cn("flex flex-wrap gap-2", compact ? "mb-4" : "mb-8")}>
        <FilterChip active={domain === "ALL"} onClick={() => setDomain("ALL")} label="All domains" />
        {DOMAINS.map((d) => (
          <FilterChip key={d} active={domain === d} onClick={() => setDomain(d)} label={enumLabel(d)} />
        ))}
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        <FilterChip active={level === "ALL"} onClick={() => setLevel("ALL")} label="All levels" small />
        {LEVELS.map((l) => (
          <FilterChip key={l} active={level === l} onClick={() => setLevel(l)} label={enumLabel(l)} small />
        ))}
      </div>

      {!filtered.length ? (
        <p className="text-sm text-fg-muted">No skills match these filters.</p>
      ) : (
        <div className="space-y-10">
          {grouped.map((g) => (
            <div key={g.domain}>
              <h3 className="font-accent text-xs font-semibold uppercase tracking-widest text-fg-muted">{enumLabel(g.domain)}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((skill, i) => (
                  <li key={skill.id}>
                    <motion.button
                      type="button"
                      onClick={() => setActive(skill)}
                      className={cn(
                        "rounded-full border border-border bg-bg-elevated px-3 py-1.5 font-mono text-xs text-fg transition-colors hover:border-accent hover:bg-accent-soft",
                        skill.level === "LEARNING" && "border-dashed",
                      )}
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.02, duration: 0.4, ease: EASE }}
                    >
                      {skill.name}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-md">
          {active ? (
            <>
              <DialogHeader>
                <DialogTitle>{active.name}</DialogTitle>
                <DialogDescription>
                  {enumLabel(active.domain)} · {enumLabel(active.level)}
                </DialogDescription>
              </DialogHeader>
              {active.description ? <p className="text-sm text-fg-muted">{active.description}</p> : null}
              {active.builtWith ? (
                <p className="text-sm">
                  <span className="font-medium text-fg">Built with: </span>
                  <span className="text-fg-muted">{active.builtWith}</span>
                </p>
              ) : null}
              {active.relatedProjectSlugs.length ? (
                <ul className="space-y-1 text-sm">
                  {active.relatedProjectSlugs.map((slug) => (
                    <li key={slug}>
                      <Link href={`/projects/${slug}`} className="text-accent hover:underline">
                        {slug}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  small,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border font-mono transition-colors",
        small ? "px-2.5 py-1 text-[0.65rem]" : "px-3 py-1.5 text-xs",
        active ? "border-accent bg-accent-soft text-fg" : "border-border bg-bg-elevated text-fg-muted hover:bg-bg-sunken",
      )}
    >
      {label}
    </button>
  );
}
