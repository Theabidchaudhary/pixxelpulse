"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LETTERS = "orvix".split("");

export default function Preloader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (
      sessionStorage.getItem("pp-loaded") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    sessionStorage.setItem("pp-loaded", "1");
    setShow(true);
    const t = setTimeout(() => setShow(false), 1650);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ink-950"
          exit={{ y: "-100%", transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] } }}
          aria-hidden
        >
          <div className="relative">
            <div className="flex font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {LETTERS.map((l, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.08 + i * 0.045, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {l}
                </motion.span>
              ))}
            </div>
            <motion.div
              className="absolute -bottom-3 left-0 h-px w-full origin-left"
              style={{ background: "var(--gradient-pulse)" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.35, duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
