"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Huge footer wordmark on the light band: gradient first letter, near-black
 * remaining letters fading toward the bottom edge, cropped at the page end.
 */
export default function GiantWordmark() {
  const reduce = useReducedMotion();
  return (
    <div className="relative overflow-hidden" aria-hidden>
      {/* Soft pastel rainbow wash behind the letter bottoms */}
      <div
        className="pointer-events-none absolute inset-x-[-10%] bottom-[-45%] h-[70%] opacity-50 blur-[70px]"
        style={{ background: "var(--gradient-aurora)" }}
      />
      <motion.p
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative select-none text-center font-display font-bold lowercase leading-[1.02] tracking-tight"
        style={{ fontSize: "clamp(5rem, 19.5vw, 17.5rem)", transform: "translateY(20%)", marginTop: "-0.16em" }}
      >
        <span className="text-aurora">o</span>
        <span
          style={{
            backgroundImage: "linear-gradient(180deg, #121214 25%, rgba(18,18,20,0.55) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          rwyx
        </span>
      </motion.p>
    </div>
  );
}
