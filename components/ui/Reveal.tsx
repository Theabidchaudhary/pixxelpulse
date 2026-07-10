"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Standard scroll-in reveal: rise 20px + fade, ease-out.
 * `delay` in ms for stagger choreography.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: delay / 1000, ease: "easeOut" }}
      className={className}
    >
      {children}
    </Tag>
  );
}

/**
 * Masked line-rise for headings.
 * The viewport observer lives on the (unclipped) outer wrapper — observing
 * the translated inner span directly never fires, because it starts fully
 * clipped by the overflow-hidden mask.
 */
export function RevealText({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className={cn("block overflow-hidden", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      <motion.span
        className="block"
        variants={{
          hidden: reduce ? { opacity: 0 } : { y: "110%" },
          // Always resolve both axes: SSR renders the non-reduced initial
          // (y 110%), so a reduced-motion client must still reset y to 0.
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.9, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
