"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ArchitectureDiagram } from "@prisma/client";
import { cn } from "@/lib/utils";
import { EASE } from "@/components/motion/reveal";

type ArchitectureProps = {
  diagram: ArchitectureDiagram;
  className?: string;
};

const CAPTION = "Schematic illustration of the system design.";

export function ArchitectureDiagramView({ diagram, className }: ArchitectureProps) {
  const reduce = useReducedMotion();
  if (diagram === "NONE") return null;
  return (
    <figure className={cn("rounded-xl border border-border bg-bg-sunken p-4 md:p-6", className)}>
      <DiagramSvg diagram={diagram} animate={!reduce} />
      <figcaption className="mt-3 font-mono text-[0.65rem] text-fg-subtle">{CAPTION}</figcaption>
    </figure>
  );
}

function DiagramSvg({ diagram, animate }: { diagram: ArchitectureDiagram; animate: boolean }) {
  const common = "w-full h-auto max-h-64";
  switch (diagram) {
    case "NBOGNE":
      return <NbogneDiagram className={common} animate={animate} />;
    case "SIGNCONNECT":
      return <SignConnectDiagram className={common} animate={animate} />;
    case "HOSPITAL":
      return <HospitalDiagram className={common} animate={animate} />;
    case "TIC_SUMMIT":
      return <TicSummitDiagram className={common} animate={animate} />;
    default:
      return null;
  }
}

function Box({ x, y, w, h, label, animate, delay = 0 }: { x: number; y: number; w: number; h: number; label: string; animate: boolean; delay?: number }) {
  return (
    <g>
      <motion.rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        fill="var(--bg-elevated)"
        stroke="var(--accent)"
        strokeWidth={1.5}
        initial={animate ? { opacity: 0, y: y + 8 } : false}
        whileInView={{ opacity: 1, y }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay, ease: EASE }}
      />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" className="fill-fg font-mono text-[10px]">
        {label}
      </text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, animate, delay = 0 }: { x1: number; y1: number; x2: number; y2: number; animate: boolean; delay?: number }) {
  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="var(--fg-subtle)"
      strokeWidth={1}
      markerEnd="url(#arrow)"
      initial={animate ? { pathLength: 0, opacity: 0 } : false}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    />
  );
}

function NbogneDiagram({ className, animate }: { className?: string; animate: boolean }) {
  return (
    <svg viewBox="0 0 480 160" className={className} role="img" aria-label={CAPTION}>
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="var(--fg-subtle)" />
        </marker>
      </defs>
      <Box x={8} y={56} w={72} h={48} label="SMS/USSD" animate={animate} />
      <Box x={108} y={56} w={72} h={48} label="Gateway" animate={animate} delay={0.05} />
      <Box x={208} y={56} w={72} h={48} label="OpenHIM" animate={animate} delay={0.1} />
      <Box x={308} y={24} w={80} h={40} label="OpenMRS" animate={animate} delay={0.15} />
      <Box x={308} y={96} w={80} h={40} label="DHIS2" animate={animate} delay={0.2} />
      <Arrow x1={80} y1={80} x2={108} y2={80} animate={animate} />
      <Arrow x1={180} y1={80} x2={208} y2={80} animate={animate} delay={0.05} />
      <Arrow x1={280} y1={72} x2={308} y2={44} animate={animate} delay={0.1} />
      <Arrow x1={280} y1={88} x2={308} y2={116} animate={animate} delay={0.12} />
    </svg>
  );
}

function SignConnectDiagram({ className, animate }: { className?: string; animate: boolean }) {
  return (
    <svg viewBox="0 0 480 180" className={className} role="img" aria-label={CAPTION}>
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="var(--fg-subtle)" />
        </marker>
      </defs>
      <Box x={16} y={20} w={90} h={40} label="Camera" animate={animate} />
      <Box x={140} y={20} w={90} h={40} label="Vision model" animate={animate} delay={0.05} />
      <Box x={264} y={20} w={90} h={40} label="Sign text" animate={animate} delay={0.1} />
      <Box x={16} y={120} w={90} h={40} label="Text in" animate={animate} delay={0.12} />
      <Box x={140} y={120} w={90} h={40} label="Avatar synth" animate={animate} delay={0.15} />
      <Box x={264} y={70} w={120} h={48} label="Realtime backend" animate={animate} delay={0.18} />
      <Arrow x1={106} y1={40} x2={140} y2={40} animate={animate} />
      <Arrow x1={230} y1={40} x2={264} y2={40} animate={animate} delay={0.05} />
      <Arrow x1={309} y1={68} x2={309} y2={70} animate={animate} delay={0.08} />
      <Arrow x1={106} y1={140} x2={140} y2={140} animate={animate} delay={0.1} />
      <Arrow x1={230} y1={140} x2={264} y2={110} animate={animate} delay={0.12} />
    </svg>
  );
}

function HospitalDiagram({ className, animate }: { className?: string; animate: boolean }) {
  return (
    <svg viewBox="0 0 480 180" className={className} role="img" aria-label={CAPTION}>
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="var(--fg-subtle)" />
        </marker>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <Box key={i} x={16 + i * 110} y={16} w={96} h={36} label={`Dashboard ${i + 1}`} animate={animate} delay={i * 0.04} />
      ))}
      <Box x={120} y={100} w={240} h={56} label="Multi-hospital API layer" animate={animate} delay={0.2} />
      {[0, 1, 2].map((i) => (
        <Arrow key={i} x1={64 + i * 110} y1={52} x2={180 + i * 20} y2={100} animate={animate} delay={0.1 + i * 0.03} />
      ))}
    </svg>
  );
}

function TicSummitDiagram({ className, animate }: { className?: string; animate: boolean }) {
  return (
    <svg viewBox="0 0 480 140" className={className} role="img" aria-label={CAPTION}>
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="var(--fg-subtle)" />
        </marker>
      </defs>
      <Box x={8} y={48} w={88} h={44} label="Learners" animate={animate} />
      <Box x={116} y={48} w={100} h={44} label="Course delivery" animate={animate} delay={0.05} />
      <Box x={236} y={48} w={72} h={44} label="CMS" animate={animate} delay={0.1} />
      <Box x={328} y={48} w={100} h={44} label="Engagement" animate={animate} delay={0.15} />
      <Arrow x1={96} y1={70} x2={116} y2={70} animate={animate} />
      <Arrow x1={216} y1={70} x2={236} y2={70} animate={animate} delay={0.05} />
      <Arrow x1={308} y1={70} x2={328} y2={70} animate={animate} delay={0.1} />
    </svg>
  );
}
