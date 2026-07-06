"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PulseGlyph } from "@/components/ui/Logo";
import Reveal from "@/components/ui/Reveal";

type Promise_ = {
  lead: string;
  accent: string;
  label: string;
  body: string;
  color: string;
  pos: { left: string; top: string };
  panelSide: "left" | "right";
  icon: React.ReactNode;
};

const promises: Promise_[] = [
  {
    lead: "Satisfaction",
    accent: "guarantee",
    label: "Guarantee",
    body: "We only deliver once the result truly convinces you. So you take no risk at all.",
    color: "#a86cf6",
    pos: { left: "50%", top: "6%" },
    panelSide: "right",
    icon: <path d="M12 2.5l2.4 5 5.6.7-4.1 3.8 1.1 5.5-5-2.8-5 2.8 1.1-5.5L4 8.2l5.6-.7 2.4-5zM9 12l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    lead: "Senior editors",
    accent: "only",
    label: "Quality",
    body: "No trainees learning on your account — every project is cut by a senior editor.",
    color: "#f0559f",
    pos: { left: "79%", top: "34%" },
    panelSide: "right",
    icon: <path d="M6 7a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0zM6 17a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0zM10.5 8.5L20 18M10.5 15.5L20 6" strokeLinecap="round" />,
  },
  {
    lead: "Full",
    accent: "ownership",
    label: "Ownership",
    body: "Full-resolution masters, exports for every platform, and organized project files — yours forever.",
    color: "#56c8f5",
    pos: { left: "62%", top: "70%" },
    panelSide: "right",
    icon: <path d="M12 3l7.5 3v6c0 4.5-3.2 7.8-7.5 9-4.3-1.2-7.5-4.5-7.5-9V6L12 3zM9 12l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    lead: "Unlimited",
    accent: "revisions",
    label: "Collaboration",
    body: "We refine the cut until it truly fits. Design tweaks are included, at no extra cost.",
    color: "#2fbf8f",
    pos: { left: "28%", top: "64%" },
    panelSide: "left",
    icon: <path d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3M14 3v4h-4M10 21v-4h4" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    lead: "Fixed price",
    accent: "from day one",
    label: "Pricing",
    body: "One quote before we start. Scope changes get a heads-up first — no surprise invoices.",
    color: "#ff8a4f",
    pos: { left: "20%", top: "24%" },
    panelSide: "left",
    icon: <path d="M13 3l8 8-9 9-8-8V4a1 1 0 011-1h8zM8.5 8a1 1 0 100-2 1 1 0 000 2z" strokeLinejoin="round" />,
  },
];

function PromiseCard({ p }: { p: Promise_ }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: p.pos.left, top: p.pos.top }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <div className="relative">
        <div
          tabIndex={0}
          className="relative w-44 cursor-default rounded-2xl border p-5 text-center outline-none transition-all duration-500"
          style={{
            borderColor: open ? `${p.color}88` : "rgba(255,255,255,0.08)",
            background: open
              ? `linear-gradient(160deg, ${p.color}26 0%, rgba(19,19,24,0.92) 60%)`
              : "rgba(19,19,24,0.85)",
            boxShadow: open ? `0 0 44px ${p.color}44` : "none",
            opacity: open ? 1 : 0.62,
          }}
        >
          <span className="relative mx-auto mb-4 flex size-12 items-center justify-center" aria-hidden>
            <span className="dot-grid absolute inset-[-8px] opacity-50" style={{ maskImage: "radial-gradient(circle, black 30%, transparent 72%)" }} />
            <span
              className="relative flex size-9 items-center justify-center rounded-lg border transition-shadow duration-500"
              style={{
                borderColor: `${p.color}66`,
                color: p.color,
                boxShadow: open ? `0 0 20px ${p.color}66` : `0 0 10px ${p.color}22`,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                {p.icon}
              </svg>
            </span>
          </span>
          <p className="font-display text-[0.95rem] font-bold leading-snug text-fg">
            {p.lead} <span className="serif block" style={{ color: p.color }}>{p.accent}</span>
          </p>
        </div>

        {/* Expanding info panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: p.panelSide === "right" ? -12 : 12, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: p.panelSide === "right" ? -8 : 8, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute top-1/2 z-20 w-60 -translate-y-1/2 rounded-2xl border p-5 ${
                p.panelSide === "right" ? "left-full ml-3" : "right-full mr-3"
              }`}
              style={{
                borderColor: `${p.color}55`,
                background: `linear-gradient(160deg, ${p.color}1f 0%, rgba(14,14,18,0.97) 55%)`,
                boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 34px ${p.color}33`,
              }}
            >
              <p className="text-label !text-[0.6rem]" style={{ color: p.color }}>
                {p.label}
              </p>
              <p className="mt-2.5 text-[0.88rem] leading-relaxed text-fg">{p.body}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function QualityPromises() {
  return (
    <section className="relative py-20 lg:py-28">
      {/* Strong ambient glows: blue left, magenta/purple right — like the reference */}
      <div className="glow left-[-240px] top-[30%] h-[560px] w-[560px] opacity-[0.3]" style={{ background: "#1c4f9e" }} aria-hidden />
      <div className="glow right-[-240px] top-[20%] h-[600px] w-[600px] opacity-[0.32]" style={{ background: "#7a2f8e" }} aria-hidden />
      <div className="glow bottom-[-10%] right-[10%] h-[420px] w-[420px] opacity-[0.22]" style={{ background: "#b03d75" }} aria-hidden />
      <div className="dot-grid absolute inset-0 opacity-45" style={{ maskImage: "radial-gradient(ellipse 70% 70% at 50% 55%, black 25%, transparent 80%)" }} aria-hidden />

      <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2">
            Our five
            <br />
            <span className="serif text-sky">quality promises</span>
          </h2>
          <p className="text-lead mx-auto mt-5 max-w-md">We&apos;re only happy once you are.</p>
        </Reveal>

        {/* Desktop: orbital layout */}
        <Reveal className="relative mx-auto mt-10 hidden h-[560px] max-w-3xl lg:block">
          {/* Orbit ring */}
          <div className="absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line" aria-hidden />
          {/* Center glyph — bright colorful mark like the reference logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden>
            <div className="relative flex size-28 items-center justify-center">
              <div className="glow left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 opacity-80" style={{ background: "var(--gradient-aurora)", filter: "blur(34px)" }} />
              <PulseGlyph className="relative size-16 drop-shadow-[0_0_24px_rgba(240,85,159,0.6)]" />
            </div>
          </div>

          {promises.map((p) => (
            <PromiseCard key={p.label} p={p} />
          ))}
        </Reveal>

        {/* Mobile / tablet: stacked cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:hidden">
          {promises.map((p, i) => (
            <Reveal key={p.label} delay={i * 80}>
              <div
                className="rounded-2xl border p-6"
                style={{
                  borderColor: `${p.color}44`,
                  background: `linear-gradient(160deg, ${p.color}1a 0%, rgba(19,19,24,0.9) 55%)`,
                }}
              >
                <span
                  className="mb-4 flex size-9 items-center justify-center rounded-lg border"
                  style={{ borderColor: `${p.color}66`, color: p.color }}
                  aria-hidden
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    {p.icon}
                  </svg>
                </span>
                <p className="font-display text-[0.95rem] font-bold text-fg">
                  {p.lead} <span className="serif" style={{ color: p.color }}>{p.accent}</span>
                </p>
                <p className="mt-2 text-[0.82rem] leading-relaxed text-fg-soft">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
