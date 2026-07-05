"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { testimonials } from "@/content/testimonials";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const featured = testimonials.filter((t) => t.featured);

export default function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const next = useCallback(() => setI((v) => (v + 1) % featured.length), []);
  const prev = () => setI((v) => (v - 1 + featured.length) % featured.length);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [paused, next]);

  const t = featured[i];

  return (
    <section
      className="relative overflow-hidden bg-ink-900 py-24 lg:py-40"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div
        className="glow left-[-200px] top-1/2 h-[420px] w-[420px] -translate-y-1/2 opacity-[0.09]"
        style={{ background: "#53d8ff" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
        <SectionHeading eyebrow="Client words" heading="Trusted by people who publish." />

        <div className="mt-14 max-w-4xl lg:mt-20" aria-live="polite">
          <div className="min-h-[220px] sm:min-h-[190px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="font-display text-xl font-medium leading-relaxed tracking-tight text-fg sm:text-2xl lg:text-[1.7rem]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-7 flex items-center gap-4">
                  <span
                    className="flex size-11 items-center justify-center rounded-full font-display text-sm font-semibold text-ink-950"
                    style={{ background: "var(--gradient-pulse)" }}
                    aria-hidden
                  >
                    {t.name[0]}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-fg">{t.name}</p>
                    <p className="text-sm text-fg-faint">{t.role}</p>
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <Reveal className="mt-10 flex items-center gap-5">
            <div className="flex gap-2">
              {featured.map((_, d) => (
                <button
                  key={d}
                  onClick={() => setI(d)}
                  aria-label={`Testimonial ${d + 1}`}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    d === i ? "w-8 bg-fg" : "w-3 bg-line-strong hover:bg-fg-faint"
                  }`}
                />
              ))}
            </div>
            <div className="ml-auto flex gap-3">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="flex size-11 items-center justify-center rounded-full border border-line text-fg-soft transition-colors hover:border-line-strong hover:text-fg"
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M14 8H3m0 0l4.5-4.5M3 8l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="flex size-11 items-center justify-center rounded-full border border-line text-fg-soft transition-colors hover:border-line-strong hover:text-fg"
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M2 8h11m0 0L8.5 3.5M13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
