"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";

const steps = [
  {
    titleLead: "Free",
    titleAccent: "intro chat",
    accentClass: "text-candy",
    color: "#8b6cf6",
    body: "In 30 minutes we talk goals, audience, and footage. Prefer WhatsApp or email? That works too.",
    icon: (
      <path d="M8 2v3M16 2v3M3.5 9h17M5 4.5h14A1.5 1.5 0 0120.5 6v13A1.5 1.5 0 0119 20.5H5A1.5 1.5 0 013.5 19V6A1.5 1.5 0 015 4.5z" strokeLinecap="round" strokeLinejoin="round" />
    ),
    canvas: { x: 380, y: 250 },
    align: "left",
  },
  {
    titleLead: "Free",
    titleAccent: "scope & quote",
    accentClass: "text-sky",
    color: "#4c8dff",
    body: "Within 24 hours you get a fixed quote and a committed delivery date — we refine it together.",
    icon: (
      <path d="M14.5 3.5l6 6L9 21H3v-6L14.5 3.5zM12 6l6 6" strokeLinecap="round" strokeLinejoin="round" />
    ),
    canvas: { x: 790, y: 540 },
    align: "right",
  },
  {
    titleLead: "We",
    titleAccent: "edit",
    titleTail: "your video",
    accentClass: "text-gradient",
    color: "#ff8a4f",
    body: "Once the scope is right, we make it happen. You get regular updates on the progress.",
    icon: (
      <path d="M8 6L3 12l5 6M16 6l5 6-5 6" strokeLinecap="round" strokeLinejoin="round" />
    ),
    canvas: { x: 415, y: 860 },
    align: "left",
  },
  {
    titleLead: "",
    titleAccent: "Delivery",
    titleTail: "& handover",
    accentClass: "text-mint",
    color: "#2fbf8f",
    body: "Exports for every platform, masters included. Revisions stay open until it matches your vision.",
    icon: (
      <path d="M5 15l-1.5 4.5L8 18m-3-3c-2-5 2.5-11.5 9-12.5.5 3-.5 10.5-6 12.5H5zm6.5-6a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z" strokeLinecap="round" strokeLinejoin="round" />
    ),
    canvas: { x: 775, y: 1190 },
    align: "right",
  },
] as const;

const VB_W = 1200;
const VB_H = 1600;

const PATH_D = [
  "M640,30",
  "C440,80 370,150 375,270",
  "C380,430 700,380 790,540",
  "C860,680 520,700 415,860",
  "C330,990 700,1020 775,1190",
  "C830,1310 660,1400 625,1500",
].join(" ");

function StepCard({ step }: { step: (typeof steps)[number] }) {
  return (
    <div className="panel w-[280px] rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)] xl:w-[310px]">
      <span className="relative mb-5 inline-flex size-14 items-center justify-center" aria-hidden>
        <span
          className="dot-grid absolute inset-[-10px] opacity-60"
          style={{ maskImage: "radial-gradient(circle, black 30%, transparent 72%)" }}
        />
        <span
          className="relative flex size-10 items-center justify-center rounded-lg border"
          style={{
            borderColor: `${step.color}55`,
            color: step.color,
            boxShadow: `0 0 22px ${step.color}44, inset 0 0 12px ${step.color}22`,
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            {step.icon}
          </svg>
        </span>
      </span>
      <h3 className="font-display text-[1.02rem] font-bold">
        {step.titleLead && <>{step.titleLead} </>}
        <span className={`serif ${step.accentClass}`}>{step.titleAccent}</span>
        {"titleTail" in step && step.titleTail ? <> {step.titleTail}</> : null}
      </h3>
      <p className="mt-2 text-[0.84rem] leading-relaxed text-fg-soft">{step.body}</p>
    </div>
  );
}

function Heading() {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <h2 className="text-h2">
        It&apos;s this simple,
        <br />
        <span className="serif text-candy">in 4 steps</span>
      </h2>
      <p className="text-lead mx-auto mt-5 max-w-md">
        This is how your footage becomes a finished video.
      </p>
    </Reveal>
  );
}

function DesktopProcess() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.75"] });
  const drawn = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 90,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="relative mx-auto mt-6 hidden w-full max-w-[1240px] px-6 lg:block">
      <div ref={ref} className="relative aspect-[1200/1600] w-full">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 size-full overflow-visible" fill="none" aria-hidden>
          <defs>
            <linearGradient id="flowGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={VB_H}>
              <stop offset="0.06" stopColor="#8b6cf6" />
              <stop offset="0.33" stopColor="#4c8dff" />
              <stop offset="0.56" stopColor="#ff8a4f" />
              <stop offset="0.82" stopColor="#2fbf8f" />
              <stop offset="1" stopColor="#2fbf8f" />
            </linearGradient>
            <filter id="flowBlur" x="-40%" y="-10%" width="180%" height="120%">
              <feGaussianBlur stdDeviation="9" />
            </filter>
          </defs>
          <path d={PATH_D} stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
          {/* Soft glow underlay */}
          <motion.path d={PATH_D} stroke="url(#flowGrad)" strokeWidth={10} strokeLinecap="round" style={{ pathLength: drawn }} filter="url(#flowBlur)" opacity={0.55} />
          <motion.path d={PATH_D} stroke="url(#flowGrad)" strokeWidth={3.5} strokeLinecap="round" style={{ pathLength: drawn }} />
        </svg>

        {steps.map((s) => (
          <div
            key={s.titleAccent}
            className="absolute"
            style={{
              left: `${(s.canvas.x / VB_W) * 100}%`,
              top: `${(s.canvas.y / VB_H) * 100}%`,
              transform: `translate(${s.align === "left" ? "-88%" : "-12%"}, -50%)`,
            }}
          >
            <Reveal>
              <StepCard step={s} />
            </Reveal>
          </div>
        ))}

        {/* CTA at the end of the line */}
        <Reveal className="absolute left-[52%] top-[95%] -translate-x-1/2 -translate-y-1/2">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[0.88rem] font-bold text-white"
            style={{
              background: "linear-gradient(#14141a, #14141a) padding-box, linear-gradient(96deg, #2fbf8f, #7be3c0) border-box",
              border: "1.5px solid transparent",
              boxShadow: "0 0 30px rgba(47,191,143,0.35)",
            }}
          >
            Contact us
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              <path d="M4 12L12 4m0 0H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </Reveal>
      </div>
    </div>
  );
}

function MobileProcess({ lgHidden = true }: { lgHidden?: boolean }) {
  return (
    <div className={`mx-auto mt-12 max-w-xl px-6 ${lgHidden ? "lg:hidden" : ""}`}>
      <ol className="relative space-y-8">
        <div
          className="absolute bottom-6 left-[27px] top-6 w-[2px] rounded"
          style={{ background: "linear-gradient(180deg,#8b6cf6,#4c8dff,#ff8a4f,#2fbf8f)", opacity: 0.6 }}
          aria-hidden
        />
        {steps.map((s, i) => (
          <Reveal as="li" key={s.titleAccent} delay={i * 100} className="relative">
            <StepCard step={s} />
          </Reveal>
        ))}
      </ol>
      <Reveal className="mt-10 text-center">
        <Link
          href="/contact"
          className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[0.88rem] font-bold text-white"
          style={{
            background: "linear-gradient(#14141a, #14141a) padding-box, linear-gradient(96deg, #2fbf8f, #7be3c0) border-box",
            border: "1.5px solid transparent",
            boxShadow: "0 0 30px rgba(47,191,143,0.35)",
          }}
        >
          Contact us
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M4 12L12 4m0 0H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </Reveal>
    </div>
  );
}

export default function ProcessTimeline() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden pb-16 pt-24 lg:pb-24 lg:pt-32">
      {/* Ambient washes: blue top, orange mid-left, green tail — like the reference */}
      <div className="glow left-[8%] top-[-140px] h-[440px] w-[640px] opacity-[0.22]" style={{ background: "#1c4f9e" }} aria-hidden />
      <div className="glow right-[4%] top-[6%] h-[380px] w-[420px] opacity-[0.14]" style={{ background: "#8b6cf6" }} aria-hidden />
      <div className="glow left-[-160px] top-[44%] h-[460px] w-[460px] opacity-[0.14]" style={{ background: "#b45f2e" }} aria-hidden />

      <div className="relative">
        <Heading />
        {reduce ? <MobileProcess lgHidden={false} /> : (
          <>
            <DesktopProcess />
            <MobileProcess />
          </>
        )}
      </div>
    </section>
  );
}
