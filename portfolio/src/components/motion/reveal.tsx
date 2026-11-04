"use client";

import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

export const staggerContainer = (stagger = 0.07, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number;
  as?: "div" | "section" | "article" | "li" | "span" | "header" | "footer";
};

/** Fade+rise in on scroll (transform/opacity only, honours reduced motion). */
export function Reveal({ children, className, delay = 0, y = 18, once = true, amount = 0.25, as = "div", ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.65, ease: EASE, delay }}
      className={cn(className)}
      {...rest}
    >
      {children}
    </Comp>
  );
}

type StaggerProps = HTMLMotionProps<"div"> & {
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "ol" | "section";
};

export function Stagger({ children, className, stagger = 0.07, delay = 0, as = "div", ...rest }: StaggerProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer(stagger, delay)}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className, as = "div", ...rest }: HTMLMotionProps<"div"> & { as?: "div" | "li" | "article" }) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp variants={fadeUp} className={className} {...rest}>
      {children}
    </Comp>
  );
}
