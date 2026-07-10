"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import { site } from "@/content/site";

const ease = [0.16, 1, 0.3, 1] as const;

const AVATARS = [
  { initial: "S", bg: "#8b6cf6" },
  { initial: "M", bg: "#f0559f" },
  { initial: "A", bg: "#2fbf8f" },
];

function Stars() {
  return (
    <span className="flex gap-[3px]" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 16 16" fill="#fbbf24">
          <path d="M8 .8l2.1 4.6 5 .6-3.7 3.5.9 5-4.3-2.5L3.7 14.5l.9-5L.9 6l5-.6L8 .8z" />
        </svg>
      ))}
    </span>
  );
}

/** Dark analytics-dashboard browser mockup that turns to face the cursor.
 *  Tilt is measured from the mockup's own center: the pointer's offset,
 *  normalized to half the card size, drives rotateX (−10°·y) and rotateY
 *  (12°·x) through a stiff-ish spring. When the cursor leaves the hero
 *  (below its fold) the card relaxes to its resting pose (4°, −8°). */
const TILT_REST_X = 4;
const TILT_REST_Y = -8;
const TILT_SPRING = { stiffness: 120, damping: 20, mass: 0.8 };

function BrowserMockup() {
  const bars = [38, 62, 30, 74, 56, 88, 44, 70, 52, 92];
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const tx = useMotionValue(TILT_REST_X);
  const ty = useMotionValue(TILT_REST_Y);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const card = cardRef.current;
      if (!card) return;
      const section = card.closest("section");
      if (section) {
        const bottom = section.getBoundingClientRect().bottom;
        if (e.clientY > bottom) {
          tx.set(TILT_REST_X);
          ty.set(TILT_REST_Y);
          return;
        }
      }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        tx.set(-(10 * ny));
        ty.set(12 * nx);
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [tx, ty, reduce]);

  const rotateX = useSpring(tx, TILT_SPRING);
  const rotateY = useSpring(ty, TILT_SPRING);

  return (
    <div style={{ perspective: "1200px" }}>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.5, ease }}
        style={{
          transformStyle: "preserve-3d",
          rotateY: reduce ? TILT_REST_Y : rotateY,
          rotateX: reduce ? TILT_REST_X : rotateX,
        }}
        className="relative w-full max-w-xl rounded-2xl border border-white/10 shadow-[0_40px_90px_rgba(0,0,0,0.55)]"
      >
        <div className="overflow-hidden rounded-2xl bg-[#181a2e]">
          {/* Chrome */}
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <span className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
            </span>
            <span className="flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1 font-mono text-[0.6rem] text-white/60">
              <svg width="9" height="9" viewBox="0 0 16 16" fill="none" aria-hidden>
                <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              your-channel.com
            </span>
            <span className="ml-auto h-2 w-20 rounded bg-white/10" />
          </div>

          {/* Dashboard body */}
          <div className="relative grid grid-cols-[1fr_2.1fr_1.1fr] gap-3 bg-gradient-to-br from-[#123a33] via-[#16203a] to-[#181a2e] p-4">
            {/* Left rail */}
            <div className="space-y-2.5">
              <div className="h-2.5 w-12 rounded bg-emerald-400/80" />
              {[16, 20, 14, 18, 12, 17].map((w, i) => (
                <div key={i} className="h-2 rounded bg-white/15" style={{ width: `${w * 4}px` }} />
              ))}
              <div className="mt-4 h-2.5 w-10 rounded bg-white/25" />
              {[18, 14, 16].map((w, i) => (
                <div key={i} className="h-2 rounded bg-white/10" style={{ width: `${w * 4}px` }} />
              ))}
            </div>

            {/* Retention chart */}
            <div className="rounded-lg border border-emerald-300/20 bg-[#0e2b26]/70 p-3">
              <div className="mb-2 flex gap-2">
                <span className="h-2 w-14 rounded bg-emerald-400/90" />
                <span className="ml-auto h-2 w-8 rounded bg-white/20" />
              </div>
              <div className="flex h-28 items-end gap-1.5 sm:h-36">
                {bars.map((h, i) => (
                  <motion.span
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: 0.9 + i * 0.07, ease }}
                    className="flex-1 rounded-sm bg-emerald-400"
                    style={{ opacity: 0.55 + (h / 100) * 0.45 }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="h-1.5 w-6 rounded bg-white/15" />
                ))}
              </div>
            </div>

            {/* Right rail cards */}
            <div className="space-y-2.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-md border border-white/10 bg-white/5 p-2">
                  <div className="h-1.5 w-9 rounded bg-emerald-400/70" />
                  <div className="mt-1.5 h-1.5 w-full rounded bg-white/15" />
                </div>
              ))}
            </div>

            {/* Cursor */}
            <motion.svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="absolute left-[46%] top-[42%] drop-shadow-lg"
              animate={{ x: [0, 36, -22, 0], y: [0, -28, 24, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            >
              <path d="M5 3l14 8-6.5 1.5L9 19 5 3z" fill="#fff" stroke="#121214" strokeWidth="1.4" />
            </motion.svg>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const up = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: "easeOut" as const },
  });

  return (
    <section className="relative flex min-h-[96svh] items-center overflow-hidden pb-24 pt-[var(--nav-h)] lg:min-h-[100svh]">
      {/* Dot matrix — even field across the whole hero */}
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 z-0 opacity-40" />

      {/* ——— Fold: two blurred color strips hugging the bottom edge, grain
          over them, then a near-black fade so the section settles dark
          before the next heading ——— */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-4 -left-8 -right-8 z-0 h-[160px] blur-2xl"
        style={{
          background: "var(--gradient-fold)",
          opacity: 0.6,
          maskImage: "linear-gradient(to top, black 25%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 25%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-12 -right-12 bottom-0 z-20 h-[320px] blur-3xl"
        style={{
          background: "var(--gradient-fold)",
          opacity: 0.75,
          maskImage: "linear-gradient(to top, black 25%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 25%, transparent 100%)",
        }}
      />
      <div aria-hidden className="noise-fold -left-12 -right-12 bottom-0 z-[21] h-[320px]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[200px]"
        style={{
          background: "linear-gradient(to top, #020002, rgba(2,0,2,0.6), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] items-center gap-16 px-6 pb-8 pt-12 lg:grid-cols-[1fr_1.05fr] lg:gap-10 lg:px-12">
        <div>
          <h1 className="text-display">
            <motion.span
              {...up(0.1)}
              className="serif text-gradient block pb-1 pr-2"
              style={{ whiteSpace: "nowrap", fontSize: "clamp(1.65rem,0.9rem + 4vw,6.3rem)" }}
            >
              Dream video?
            </motion.span>
            <motion.span
              {...up(0.2)}
              className="block whitespace-nowrap text-[clamp(1.65rem,0.9rem+4vw,6.3rem)]"
            >
              Consider it <span className="squiggle">done.</span>
            </motion.span>
          </h1>

          <motion.div {...up(0.3)} className="mt-7 flex items-center gap-3.5">
            <span className="flex -space-x-2.5" aria-hidden>
              {AVATARS.map((a) => (
                <span
                  key={a.initial}
                  className="flex size-9 items-center justify-center rounded-full border-2 border-ink-950 font-display text-xs font-bold text-white"
                  style={{ background: a.bg }}
                >
                  {a.initial}
                </span>
              ))}
            </span>
            <span>
              <span className="block text-sm font-semibold text-fg">500+ happy clients</span>
              <span className="mt-0.5 flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.96 10.96 0 001 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <Stars />
              </span>
            </span>
          </motion.div>

          <motion.p {...up(0.4)} className="mt-7 max-w-md text-[1.05rem] leading-[1.7] text-fg-soft">
            Professional <strong className="font-semibold text-fg">short-form, YouTube &amp; brand videos</strong>{" "}
            — 1,400+ delivered across 40+ niches. First cut in just 48–72 hours{" "}
            <strong className="font-semibold text-fg">— clear scope, no strings attached.</strong>
          </motion.p>

          <motion.div {...up(0.5)} className="mt-9">
            <Link
              href="/contact"
              className="btn-sheen btn-cta group relative inline-flex items-center gap-2.5 rounded-xl px-8 py-4 text-[0.92rem] font-bold text-white"
            >
              Contact us
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <path d="M4 12L12 4m0 0H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </motion.div>

          <motion.p {...up(0.6)} className="mt-6 inline-flex items-center gap-2 text-xs text-fg-faint">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-pulse-green opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-pulse-green" />
            </span>
            {site.availability}
          </motion.p>
        </div>

        <BrowserMockup />
      </div>
    </section>
  );
}
