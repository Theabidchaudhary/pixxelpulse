"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";

type Quadrant = {
  tag: string;
  titleAccent: string;
  titleTail: string;
  accentFirst?: boolean;
  body: string;
  color: string;
  /** rotateX / rotateY the panel leans when this corner is hovered */
  tilt: [number, number];
  icon: React.ReactNode;
};

const quadrants: Quadrant[] = [
  {
    tag: "Story & pacing",
    titleAccent: "gripping",
    titleTail: "watch",
    body: "Hooks, pacing and structure that spark interest and hold attention with every cut.",
    color: "#4c8dff",
    tilt: [5, -5],
    icon: <path d="M5 4.5h14v11H5zM9 19.5h6M12 15.5v4M9 8l3 2.5L9 13V8z" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    tag: "Found online",
    titleAccent: "Built",
    titleTail: "for the algorithm",
    accentFirst: true,
    body: "Titles, captions and cuts tuned for search, suggested feeds and AI platforms.",
    color: "#e14fa0",
    tilt: [5, 5],
    icon: <path d="M11 11m-6.5 0a6.5 6.5 0 1013 0 6.5 6.5 0 10-13 0M15.8 15.8L21 21" strokeLinecap="round" />,
  },
  {
    tag: "Click to customer",
    titleAccent: "Sells",
    titleTail: "while you sleep",
    accentFirst: true,
    body: "Viewers turn into subscribers and clients — the natural result of a well-built story arc.",
    color: "#ff8a4f",
    tilt: [-5, -5],
    icon: <path d="M4 17l5-5 4 4 7-8M15 8h5v5" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    tag: "High performance",
    titleAccent: "Reliable",
    titleTail: "on every screen",
    accentFirst: true,
    body: "Broadcast-clean audio, every aspect ratio, rock-solid delivery dates on every project.",
    color: "#2fbf8f",
    tilt: [-5, 5],
    icon: <path d="M13 2L4.5 13.5H11L9.5 22 19 10h-6.5L13 2z" strokeLinejoin="round" />,
  },
];

function AxisLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`text-label pointer-events-none absolute !text-[0.62rem] !tracking-[0.3em] ${className}`}>
      {children}
    </span>
  );
}

function QuadrantCell({ q, active, onHover }: { q: Quadrant; active: boolean; onHover: (v: boolean) => void }) {
  return (
    <div
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      tabIndex={0}
      className="group relative overflow-hidden p-7 outline-none transition-colors duration-700 sm:p-9"
    >
      {/* Colored fill + dot texture — always tinted, blazing on hover */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: active ? 1 : 0.42,
          background: `radial-gradient(ellipse 90% 90% at 30% 20%, ${q.color}52 0%, ${q.color}18 55%, transparent 100%)`,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: active ? 0.9 : 0,
          background: `radial-gradient(ellipse 60% 60% at 50% 45%, ${q.color}30 0%, transparent 70%)`,
          filter: "blur(24px)",
        }}
        aria-hidden
      />
      <div
        className="dot-grid absolute inset-0 transition-opacity duration-700"
        style={{ opacity: active ? 0.55 : 0.14 }}
        aria-hidden
      />

      <div className="relative transition-opacity duration-500" style={{ opacity: active ? 1 : 0.6 }}>
        <p className="flex items-center gap-2.5">
          <span
            className="flex size-7 items-center justify-center rounded-md border transition-shadow duration-500"
            style={{
              borderColor: `${q.color}66`,
              color: q.color,
              boxShadow: active ? `0 0 18px ${q.color}55` : "none",
            }}
            aria-hidden
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              {q.icon}
            </svg>
          </span>
          <span className="text-label !text-[0.64rem]" style={{ color: active ? q.color : undefined }}>
            {q.tag}
          </span>
        </p>
        <h3 className="mt-4 font-display text-[1.15rem] font-bold sm:text-[1.3rem]">
          {q.accentFirst ? (
            <>
              <span className="serif" style={{ color: q.color }}>{q.titleAccent}</span> {q.titleTail}
            </>
          ) : (
            <>
              A <span className="serif" style={{ color: q.color }}>{q.titleAccent}</span> {q.titleTail}
            </>
          )}
        </h3>
        <p className="mt-2.5 max-w-[280px] text-[0.92rem] leading-relaxed text-fg-soft">{q.body}</p>
      </div>
    </div>
  );
}

export default function ProvenSystem() {
  const [hovered, setHovered] = useState<number | null>(null);
  const tilt = hovered === null ? [0, 0] : quadrants[hovered].tilt;

  return (
    <section className="relative py-20 lg:py-28">
      {/* Strong ambient glows like the reference: violet top-left, warm orange
          bottom-left, teal right */}
      <div className="glow left-[-220px] top-[4%] h-[560px] w-[560px] opacity-[0.3]" style={{ background: "#5b2f9e" }} aria-hidden />
      <div className="glow bottom-[-6%] left-[-200px] h-[520px] w-[520px] opacity-[0.32]" style={{ background: "#c4622a" }} aria-hidden />
      <div className="glow right-[-220px] top-[28%] h-[560px] w-[560px] opacity-[0.28]" style={{ background: "#17694f" }} aria-hidden />
      <div className="glow right-[-160px] top-[-4%] h-[400px] w-[400px] opacity-[0.2]" style={{ background: "#8b3d75" }} aria-hidden />

      <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2">
            You get a <span className="serif text-candy">proven system</span>
          </h2>
          <p className="text-lead mx-auto mt-5 max-w-md">
            Every edit meets the demands of both people and platforms.
          </p>
        </Reveal>

        {/* Matrix */}
        <div className="relative mx-auto mt-16 hidden max-w-3xl sm:block lg:mt-20" style={{ perspective: "1400px" }}>
          <AxisLabel className="left-1/2 top-[-26px] -translate-x-1/2">Attention</AxisLabel>
          <AxisLabel className="bottom-[-26px] left-1/2 -translate-x-1/2">Performance</AxisLabel>
          <AxisLabel className="left-[-30px] top-1/2 -translate-y-1/2 rotate-180 [writing-mode:vertical-rl]">
            Viewers
          </AxisLabel>
          <AxisLabel className="right-[-30px] top-1/2 -translate-y-1/2 [writing-mode:vertical-rl]">
            Algorithm
          </AxisLabel>

          <motion.div
            animate={{ rotateX: tilt[0], rotateY: tilt[1] }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-ink-900/70 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
          >
            {/* Cross hairlines */}
            <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-px bg-line" aria-hidden />
            <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-px bg-line" aria-hidden />
            {/* Center dot */}
            <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]" aria-hidden />

            {quadrants.map((q, i) => (
              <QuadrantCell key={q.tag} q={q} active={hovered === i} onHover={(v) => setHovered(v ? i : null)} />
            ))}
          </motion.div>
        </div>

        {/* Mobile: stacked cards */}
        <div className="mt-12 space-y-4 sm:hidden">
          {quadrants.map((q, i) => (
            <Reveal key={q.tag} delay={i * 90} className="panel relative overflow-hidden p-6">
              <div
                className="absolute inset-0 opacity-40"
                style={{ background: `linear-gradient(135deg, ${q.color}30 0%, transparent 60%)` }}
                aria-hidden
              />
              <p className="text-label relative !text-[0.62rem]" style={{ color: q.color }}>{q.tag}</p>
              <h3 className="relative mt-2.5 font-display text-[1.05rem] font-bold">
                {q.accentFirst ? "" : "A "}
                <span className="serif" style={{ color: q.color }}>{q.titleAccent}</span> {q.titleTail}
              </h3>
              <p className="relative mt-2 text-[0.85rem] leading-relaxed text-fg-soft">{q.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
