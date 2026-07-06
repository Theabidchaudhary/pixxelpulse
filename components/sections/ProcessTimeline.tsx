"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const steps = [
  {
    n: "01",
    title: "Brief",
    body: "Tell us the goal, the audience, and drop the footage. A five-minute written brief is all we need to start.",
    promise: "Same-day kickoff",
    x: 70,
    y: 322,
    label: "below",
  },
  {
    n: "02",
    title: "Edit",
    body: "A dedicated editor builds the cut — story first, then pacing, sound, captions, and color.",
    promise: "First cut in 48–72h",
    x: 430,
    y: 92,
    label: "above",
  },
  {
    n: "03",
    title: "Refine",
    body: "Timestamped feedback goes in, a tightened cut comes back. No endless loops, no vanishing acts.",
    promise: "Revisions included",
    x: 790,
    y: 332,
    label: "below",
  },
  {
    n: "04",
    title: "Publish",
    body: "Exports for every platform, named and organized. Masters are yours, forever.",
    promise: "Full ownership",
    x: 1140,
    y: 100,
    label: "above",
  },
] as const;

const VB_W = 1200;
const VB_H = 420;

const PATH_D =
  "M70,322 C230,322 260,92 430,92 C610,92 620,332 790,332 C960,332 970,100 1140,100";

function StepNode({
  step,
  index,
  progress,
}: {
  step: (typeof steps)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const start = index / steps.length;
  const end = start + 0.55 / steps.length;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [step.label === "below" ? -14 : 14, 0]);
  const scale = useTransform(progress, [start, end], [0.85, 1]);

  return (
    <motion.div
      style={{
        left: `${(step.x / VB_W) * 100}%`,
        top: `${(step.y / VB_H) * 100}%`,
        opacity,
        y,
        scale,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
    >
      <span
        className="block size-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "var(--gradient-aurora)", boxShadow: "0 0 16px rgba(124,106,247,0.7)" }}
        aria-hidden
      />
      <div
        className={`absolute w-56 sm:w-64 ${
          step.label === "below" ? "top-6" : "bottom-6"
        } left-1/2 -translate-x-1/2 text-center sm:text-left`}
      >
        <p className="font-mono text-xs text-pulse-violet">{step.n}</p>
        <h3 className="text-h3 mt-1 text-[1.15rem] sm:text-[1.35rem]">{step.title}</h3>
        <p className="mt-2 hidden text-[0.85rem] leading-relaxed text-fg-soft sm:block">{step.body}</p>
        <p className="mt-3 hidden font-mono text-[0.65rem] uppercase tracking-[0.12em] text-fg-faint sm:inline-block">
          {step.promise}
        </p>
      </div>
    </motion.div>
  );
}

function DesktopProcess() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const pathLength = useTransform(scrollYProgress, [0.04, 0.92], [0, 1]);

  return (
    <div ref={ref} className="relative hidden h-[320vh] lg:block">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-16">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-12">
          <SectionHeading
            eyebrow="The process"
            heading={
              <>
                It&apos;s this simple, in <span className="text-gradient">4 steps.</span>
              </>
            }
            lead="A production system refined over 1,300 projects. You stay in the creative seat; we run the machine."
          />
        </div>

        <div className="relative mx-auto mt-14 aspect-[1200/420] w-full max-w-[1200px] px-6 lg:px-12">
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 size-full overflow-visible" fill="none">
            <defs>
              <linearGradient id="stepGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={VB_W} y2="0">
                <stop offset="0%" stopColor="#4d8dff" />
                <stop offset="35%" stopColor="#7c6af7" />
                <stop offset="70%" stopColor="#f062c0" />
                <stop offset="100%" stopColor="#ff9d5c" />
              </linearGradient>
            </defs>
            <path d={PATH_D} stroke="var(--color-line)" strokeWidth={2} />
            <motion.path d={PATH_D} stroke="url(#stepGrad)" strokeWidth={2.5} style={{ pathLength }} strokeLinecap="round" />
          </svg>

          {steps.map((s, i) => (
            <StepNode key={s.n} step={s} index={i} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileProcess({ lgHidden = true }: { lgHidden?: boolean }) {
  return (
    <div className={`mx-auto max-w-[1440px] px-6 py-24 ${lgHidden ? "lg:hidden" : ""}`}>
      <SectionHeading
        eyebrow="The process"
        heading={
          <>
            It&apos;s this simple, in <span className="text-gradient">4 steps.</span>
          </>
        }
        lead="A production system refined over 1,300 projects. You stay in the creative seat; we run the machine."
      />
      <ol className="relative mt-14 space-y-10">
        <div
          className="absolute bottom-4 left-[5px] top-4 w-px"
          style={{ background: "var(--gradient-aurora)", opacity: 0.5 }}
          aria-hidden
        />
        {steps.map((s, i) => (
          <Reveal as="li" key={s.n} delay={i * 110} className="relative pl-8">
            <span
              className="absolute left-0 top-1.5 block size-2.5 rounded-full"
              style={{ background: "var(--gradient-aurora)" }}
              aria-hidden
            />
            <p className="font-mono text-xs text-pulse-violet">{s.n}</p>
            <h3 className="text-h3 mt-1">{s.title}</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-fg-soft">{s.body}</p>
            <p className="mt-3 inline-block rounded-full border border-line px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-fg-soft">
              {s.promise}
            </p>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

export default function ProcessTimeline() {
  const reduce = useReducedMotion();
  if (reduce) return <MobileProcess lgHidden={false} />;
  return (
    <section className="relative">
      <DesktopProcess />
      <MobileProcess />
    </section>
  );
}
