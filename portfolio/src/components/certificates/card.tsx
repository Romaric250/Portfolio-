"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { CertificateWithCategory } from "@/lib/db/queries/public";
import { BadgeCheck } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { CertificatePlaceholder } from "@/components/site/media-slot";
import { EASE } from "@/components/motion/reveal";

type CertificateCardProps = {
  cert: CertificateWithCategory;
  onSelect?: (slug: string) => void;
  className?: string;
};

export function CertificateCard({ cert, onSelect, className }: CertificateCardProps) {
  const reduce = useReducedMotion();
  const thumb = cert.thumbnailUrl ?? (cert.fileType === "IMAGE" ? cert.fileUrl : null);

  const Comp = onSelect ? motion.button : motion.div;

  return (
    <Comp
      {...(onSelect
        ? { type: "button" as const, onClick: () => onSelect(cert.slug) }
        : {})}
      className={cn(
        "group relative w-full overflow-hidden rounded-xl border border-border bg-bg-elevated text-left shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
      style={{ transformStyle: "preserve-3d" }}
      whileHover={reduce ? undefined : { rotateX: 2, rotateY: -2 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-sunken">
        {thumb ? (
          <Image src={thumb} alt={cert.altText} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" sizes="(max-width:768px) 50vw, 25vw" />
        ) : (
          <CertificatePlaceholder title={cert.title} issuer={cert.issuer} className="h-full w-full border-0" />
        )}
        {cert.featured ? (
          <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 font-mono text-[0.6rem] text-accent-fg">Featured</span>
        ) : null}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 font-display text-sm font-semibold text-fg">{cert.title}</p>
          {cert.credentialUrl ? (
            <span className="shrink-0 text-accent" title="Verifiable credential">
              <BadgeCheck className="size-4" aria-label="Has verification URL" />
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-xs text-fg-muted">{cert.issuer}</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full px-2 py-0.5 font-mono text-[0.6rem]" style={{ background: `${cert.category.color}22`, color: cert.category.color }}>
            {cert.category.name}
          </span>
          <span className="font-mono text-[0.65rem] text-fg-subtle">{formatDate(cert.issueDate)}</span>
        </div>
        {cert.skills.length ? (
          <p className="mt-2 line-clamp-1 font-mono text-[0.6rem] text-fg-subtle">{cert.skills.join(" · ")}</p>
        ) : null}
      </div>
    </Comp>
  );
}
