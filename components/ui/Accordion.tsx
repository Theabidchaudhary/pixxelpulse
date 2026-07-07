"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Faq } from "@/content/faqs";

/**
 * Card-per-item accordion. The open card gets a subtle warm glow border,
 * matching the reference FAQ styling.
 */
export default function Accordion({ items, defaultOpen = 0 }: { items: Faq[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className="space-y-3">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div
            key={f.q}
            className="rounded-2xl border transition-all duration-500"
            style={{
              borderColor: isOpen ? "rgba(240,85,159,0.4)" : "var(--color-line)",
              background: isOpen ? "linear-gradient(160deg, rgba(240,85,159,0.08) 0%, rgba(19,19,24,0.9) 55%)" : "rgba(19,19,24,0.7)",
              boxShadow: isOpen ? "0 0 30px rgba(240,85,159,0.12)" : "none",
            }}
          >
            <button
              className="group flex w-full items-center justify-between gap-5 px-5.5 py-4.5 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="font-display text-[0.92rem] font-bold text-fg">{f.q}</span>
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full border transition-all duration-500 [transition-timing-function:var(--ease-pulse)] ${
                  isOpen ? "rotate-45 border-line-strong bg-white/10 text-fg" : "border-line text-fg-faint"
                }`}
                aria-hidden
              >
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5.5 pb-5 text-[0.85rem] leading-relaxed text-fg-soft">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
