"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const stages = [
  {
    label: "Story system",
    title: "Every cut starts with the hook.",
    body: "We storyboard the first 3 seconds before touching a timeline — structure decided, not discovered.",
    color: "#4d8dff",
  },
  {
    label: "Sound system",
    title: "Broadcast-clean audio, every time.",
    body: "Levelled dialogue, ducked music, and sound design mixed for phone speakers and studio monitors alike.",
    color: "#7c6af7",
  },
  {
    label: "Caption system",
    title: "Kinetic captions, on-brand fonts.",
    body: "A locked caption style per client — synced, styled, and readable with the sound off.",
    color: "#f062c0",
  },
  {
    label: "Delivery system",
    title: "Exports for every platform, named right.",
    body: "9:16, 1:1, 16:9 — organized and delivered in publishing-ready batches, not a folder dump.",
    color: "#ff9d5c",
  },
];

function StagePanel({
  stage,
  index,
  progress,
}: {
  stage: (typeof stages)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / stages.length;
  const start = index * seg;
  const end = start + seg;
  const fadeIn = start + seg * 0.12;
  const fadeOut = end - seg * 0.12;
  const opacity = useTransform(progress, [start, fadeIn, fadeOut, end], [0, 1, 1, 0]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 flex flex-col items-start justify-center p-8 sm:p-12">
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{ background: `radial-gradient(circle at 20% 20%, ${stage.color}, transparent 65%)` }}
        aria-hidden
      />
      <p className="relative font-mono text-xs uppercase tracking-[0.16em]" style={{ color: stage.color }}>
        {String(index + 1).padStart(2, "0")} · {stage.label}
      </p>
      <h3 className="text-h3 relative mt-4 max-w-md">{stage.title}</h3>
      <p className="text-lead relative mt-4 max-w-sm !text-[0.95rem]">{stage.body}</p>
    </motion.div>
  );
}

function StageDot({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const seg = 1 / stages.length;
  const opacity = useTransform(progress, (v) => (v >= index * seg && v < (index + 1) * seg ? 1 : 0.4));
  return <motion.span className="h-1 w-8 rounded-full bg-line-strong" style={{ opacity }} />;
}

function DesktopProvenSystem() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <div ref={ref} className="relative hidden h-[280vh] lg:block">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="relative mx-auto w-full max-w-[1440px] px-6 lg:px-12">
          <SectionHeading
            eyebrow="One partner"
            heading={
              <>
                You get a <span className="text-gradient">proven system.</span>
              </>
            }
            lead="Not a freelancer guessing at your brand — four locked systems that make every delivery consistent."
            align="center"
            className="mx-auto"
          />

          <div className="relative mx-auto mt-14 max-w-3xl lg:mt-20">
            <div className="panel relative overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
              </div>

              <div className="relative h-[340px] sm:h-[400px]">
                {stages.map((stage, i) => (
                  <StagePanel key={stage.label} stage={stage} index={i} progress={scrollYProgress} />
                ))}
              </div>
            </div>

            {/* Progress dots */}
            <div className="mt-6 flex justify-center gap-2">
              {stages.map((stage, i) => (
                <StageDot key={stage.label} index={i} progress={scrollYProgress} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileProvenSystem() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-24 lg:hidden">
      <SectionHeading
        eyebrow="One partner"
        heading={
          <>
            You get a <span className="text-gradient">proven system.</span>
          </>
        }
        lead="Not a freelancer guessing at your brand — four locked systems that make every delivery consistent."
        align="center"
        className="mx-auto"
      />
      <div className="mt-14 space-y-4">
        {stages.map((stage, i) => (
          <Reveal key={stage.label} delay={i * 90} className="panel relative overflow-hidden p-6">
            <div
              className="absolute inset-0 opacity-[0.14]"
              style={{ background: `radial-gradient(circle at 20% 20%, ${stage.color}, transparent 65%)` }}
              aria-hidden
            />
            <p className="relative font-mono text-xs uppercase tracking-[0.16em]" style={{ color: stage.color }}>
              {String(i + 1).padStart(2, "0")} · {stage.label}
            </p>
            <h3 className="text-h3 relative mt-3 text-[1.2rem]">{stage.title}</h3>
            <p className="relative mt-2 text-[0.9rem] leading-relaxed text-fg-soft">{stage.body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function ProvenSystem() {
  return (
    <section className="relative">
      <DesktopProvenSystem />
      <MobileProvenSystem />
    </section>
  );
}
