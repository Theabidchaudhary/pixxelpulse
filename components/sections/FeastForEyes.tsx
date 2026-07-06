"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { Project } from "@/lib/content";
import { projectThumb } from "@/lib/content";
import ScrambleText from "@/components/fx/ScrambleText";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

function Thumb({
  project,
  index,
  total,
  progress,
  window: [wStart, wEnd],
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  window: [number, number];
}) {
  const span = wEnd - wStart;
  const seg = span / total;
  const start = wStart + index * seg;
  const end = start + seg;
  const opacity = useTransform(progress, [start, start + seg * 0.15, end - seg * 0.15, end], [0, 1, 1, 0]);
  const scale = useTransform(progress, [start, end], [1.04, 1]);

  return (
    <motion.div style={{ opacity, scale }} className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={projectThumb(project)} alt="" loading="lazy" className="size-full object-cover" />
    </motion.div>
  );
}

function ClosingCaption({ progress, window: [wStart, wEnd] }: { progress: MotionValue<number>; window: [number, number] }) {
  const opacity = useTransform(progress, [wStart, wStart + 0.03, wEnd], [0, 1, 1]);
  return (
    <motion.div style={{ opacity }} className="absolute inset-0 flex flex-col items-center justify-center bg-ink-950 px-8 text-center">
      <div className="glow left-1/2 top-1/2 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 opacity-20" style={{ background: "var(--gradient-aurora)" }} aria-hidden />
      <p className="text-label relative mb-6">Scroll on</p>
      <p className="text-h3 relative max-w-lg">
        Built for creators and brands who publish <span className="text-gradient">every week.</span>
      </p>
    </motion.div>
  );
}

function DesktopFeastForEyes({ shots }: { shots: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Three acts across the pinned scroll: gallery (0–0.55), keyword + line (0.55–0.8), closing (0.8–1)
  const galleryWindow: [number, number] = [0.04, 0.55];
  const wordWindow: [number, number] = [0.55, 0.8];
  const closingWindow: [number, number] = [0.8, 1];

  const wordOpacity = useTransform(scrollYProgress, [wordWindow[0], wordWindow[0] + 0.03, wordWindow[1] - 0.03, wordWindow[1]], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="relative hidden h-[360vh] lg:block">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="relative mx-auto w-full max-w-[1440px] px-6 lg:px-12">
          <SectionHeading
            eyebrow="Portfolio"
            heading={
              <>
                …and a <span className="text-gradient">feast</span> for the eyes.
              </>
            }
            lead="A cut of recent deliveries — every piece built for the platform, the niche, and the goal it served."
            align="center"
            className="mx-auto"
          />

          <div className="relative mx-auto mt-14 w-full max-w-3xl lg:mt-16">
            <div className="panel relative overflow-hidden">
              <div className="flex items-center gap-2 border-b border-line bg-ink-900/80 px-5 py-3.5">
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
              </div>
              <div className="relative aspect-video">
                {shots.map((p, i) => (
                  <Thumb key={p.slug} project={p} index={i} total={shots.length} progress={scrollYProgress} window={galleryWindow} />
                ))}

                <motion.div style={{ opacity: wordOpacity }} className="absolute inset-0 flex flex-col items-center justify-center bg-ink-950 px-8 text-center">
                  <ScrambleText text="ATTENTION" className="text-4xl font-semibold tracking-tight text-fg sm:text-5xl" />
                  <p className="mt-6 max-w-md text-[0.98rem] leading-relaxed text-fg-soft">
                    Every edit is built to earn it back — and hold it.
                  </p>
                </motion.div>

                <ClosingCaption progress={scrollYProgress} window={closingWindow} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileFeastForEyes({ shots }: { shots: Project[] }) {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-24 lg:hidden">
      <SectionHeading
        eyebrow="Portfolio"
        heading={
          <>
            …and a <span className="text-gradient">feast</span> for the eyes.
          </>
        }
        lead="A cut of recent deliveries — every piece built for the platform, the niche, and the goal it served."
        align="center"
        className="mx-auto"
      />
      <div className="mt-12 grid grid-cols-2 gap-3">
        {shots.map((p, i) => (
          <Reveal
            key={p.slug}
            delay={i * 80}
            className={`relative aspect-video overflow-hidden rounded-xl border border-line bg-ink-800 ${i === 0 ? "col-span-2 aspect-[16/10]" : ""}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={projectThumb(p)} alt="" loading="lazy" className="size-full object-cover" />
          </Reveal>
        ))}
      </div>
      <Reveal delay={200} className="panel relative mt-8 overflow-hidden p-8 text-center">
        <div className="glow left-1/2 top-1/2 h-[220px] w-[320px] -translate-x-1/2 -translate-y-1/2 opacity-20" style={{ background: "var(--gradient-aurora)" }} aria-hidden />
        <ScrambleText text="ATTENTION" className="relative text-3xl font-semibold tracking-tight text-fg" />
        <p className="relative mt-4 text-[0.95rem] leading-relaxed text-fg-soft">
          Every edit is built to earn it back — and hold it. Built for creators and brands who publish{" "}
          <span className="text-gradient">every week.</span>
        </p>
      </Reveal>
    </div>
  );
}

export default function FeastForEyes({ projects }: { projects: Project[] }) {
  const shots = projects.slice(0, 5);
  return (
    <section className="relative">
      <DesktopFeastForEyes shots={shots} />
      <MobileFeastForEyes shots={shots} />
    </section>
  );
}
