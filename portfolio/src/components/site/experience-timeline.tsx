"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Experience } from "@prisma/client";
import { cn, formatRange } from "@/lib/utils";
import { EASE } from "@/components/motion/reveal";

type ExperienceTimelineProps = {
  items: Experience[];
};

export function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  const reduce = useReducedMotion();
  const [openId, setOpenId] = React.useState<string | null>(items[0]?.id ?? null);

  if (!items.length) {
    return <p className="text-sm text-fg-muted">Experience entries will appear here when published.</p>;
  }

  return (
    <ol className="relative border-l border-border pl-8 md:pl-10">
      {items.map((exp, i) => {
        const open = openId === exp.id;
        return (
          <li key={exp.id} className="relative pb-10 last:pb-0">
            <motion.span
              className="absolute -left-[calc(0.5rem+1px)] top-1.5 size-3 rounded-full border-2 border-accent bg-bg"
              initial={reduce ? false : { scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: EASE }}
              aria-hidden
            />
            <button
              type="button"
              className="flex w-full items-start justify-between gap-4 text-left"
              onClick={() => setOpenId(open ? null : exp.id)}
              aria-expanded={open}
            >
              <div>
                <p className="font-mono text-xs text-fg-subtle">
                  {formatRange(exp.startDate, exp.endDate, exp.current)}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold text-fg">{exp.role}</h3>
                <p className="text-sm text-fg-muted">{exp.organisation}</p>
              </div>
              <ChevronDown className={cn("size-5 shrink-0 text-fg-subtle transition-transform", open && "rotate-180")} aria-hidden />
            </button>
            <motion.div
              initial={false}
              animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="pt-4 pr-4">
                {exp.summary ? <p className="text-sm text-fg-muted">{exp.summary}</p> : null}
                {exp.highlights.length ? (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-fg-muted">
                    {exp.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                ) : null}
                {exp.stack.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {exp.stack.map((s) => (
                      <span key={s} className="rounded-full bg-bg-sunken px-2.5 py-0.5 font-mono text-xs text-fg-muted">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </motion.div>
          </li>
        );
      })}
    </ol>
  );
}
