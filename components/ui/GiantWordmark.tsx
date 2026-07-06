"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Huge fade+blur reveal wordmark for the footer, triggered once scrolled into view. */
export default function GiantWordmark() {
  const reduce = useReducedMotion();
  return (
    <motion.p
      initial={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(18px)", scale: 0.94 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      className="text-aurora mt-20 select-none text-center font-display font-semibold leading-[0.85] tracking-tight lg:mt-28"
      style={{ fontSize: "clamp(4rem, 17vw, 13rem)" }}
      aria-hidden
    >
      orvix
    </motion.p>
  );
}
