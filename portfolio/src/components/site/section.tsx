import * as React from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  index?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  sideLabel?: string;
  id?: string;
  as?: "section" | "div";
  className?: string;
  headerClassName?: string;
  children?: React.ReactNode;
};

/** Editorial section with optional numbered marker and sticky side label. */
export function Section({
  index,
  eyebrow,
  title,
  description,
  sideLabel,
  id,
  as: Tag = "section",
  className,
  headerClassName,
  children,
}: SectionProps) {
  const label = sideLabel ?? title;
  return (
    <Tag
      id={id}
      className={cn("relative scroll-mt-24 py-[var(--section-y,clamp(4rem,10vw,8rem))]", className)}
      aria-labelledby={title && id ? `${id}-heading` : undefined}
    >
      {label ? (
        <div
          className="pointer-events-none absolute left-0 top-[var(--section-y,clamp(4rem,10vw,8rem))] hidden w-8 -translate-x-full pr-4 xl:block"
          aria-hidden
        >
          <span className="sticky top-28 block origin-left -rotate-90 font-accent text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-fg-subtle whitespace-nowrap">
            {label}
          </span>
        </div>
      ) : null}
      <div className="container-x">
        {(index || eyebrow || title || description) && (
          <header className={cn("mb-10 max-w-3xl md:mb-14", headerClassName)}>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {index ? (
                <span className="font-accent text-sm font-bold tracking-widest text-accent">{index}</span>
              ) : null}
              {eyebrow ? (
                <span className="font-accent text-xs font-semibold uppercase tracking-[0.18em] text-fg-muted">{eyebrow}</span>
              ) : null}
            </div>
            {title ? (
              <h2 id={id ? `${id}-heading` : undefined} className="font-display text-3xl font-semibold tracking-tight text-fg md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                {title}
              </h2>
            ) : null}
            {description ? <p className="mt-4 text-lg text-fg-muted leading-relaxed">{description}</p> : null}
          </header>
        )}
        {children}
      </div>
    </Tag>
  );
}
