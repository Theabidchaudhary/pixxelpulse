"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/content";
import { projectThumb } from "@/lib/content";
import Reveal from "@/components/ui/Reveal";

/** Mini replica of the site hero rendered inside the tablet screen. */
function TabletScreen({ shot }: { shot?: Project }) {
  return (
    <div className="relative flex size-full flex-col overflow-hidden rounded-[10px] bg-[#0c0c10]">
      {/* Mini nav pill */}
      <div className="mx-auto mt-[3%] flex w-[92%] items-center justify-between rounded-full bg-white px-[3%] py-[1.6%]">
        <span className="flex gap-[6px]">
          {[10, 12, 11].map((w, i) => (
            <span key={i} className="h-[4px] rounded bg-[#121214]/70" style={{ width: w * 1.6 }} />
          ))}
        </span>
        <span className="font-display text-[0.55rem] font-bold lowercase text-[#121214]">
          <span className="text-aurora">o</span>rvix
        </span>
        <span className="h-[12px] w-[52px] rounded-full" style={{ background: "var(--gradient-aurora)" }} />
      </div>

      {/* Mini hero */}
      <div className="relative flex flex-1 items-center px-[6%]">
        <div className="dot-grid absolute inset-0 opacity-40" aria-hidden />
        <div className="relative z-10 max-w-[46%]">
          <p className="serif text-gradient text-[clamp(0.9rem,2.2vw,1.5rem)] leading-tight">Dream video?</p>
          <p className="font-display text-[clamp(0.95rem,2.4vw,1.65rem)] font-bold leading-tight text-white">
            Consider it done.
          </p>
          <div className="mt-[6%] flex items-center gap-[5px]">
            {["#8b6cf6", "#f0559f", "#2fbf8f"].map((c) => (
              <span key={c} className="size-[10px] rounded-full border border-[#0c0c10]" style={{ background: c }} />
            ))}
            <span className="ml-1 h-[5px] w-[40px] rounded bg-white/30" />
          </div>
          <span
            className="mt-[7%] inline-block rounded-full px-[10px] py-[4px] text-[0.42rem] font-bold uppercase tracking-wide text-white"
            style={{ background: "var(--gradient-heart)" }}
          >
            Contact us ↗
          </span>
        </div>
        {/* Screenshot card on the right of the mini hero */}
        <div className="absolute right-[5%] top-1/2 w-[42%] -translate-y-1/2 rotate-2 overflow-hidden rounded-lg border border-white/15 shadow-2xl">
          {shot ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={projectThumb(shot)} alt="" loading="lazy" className="aspect-video w-full object-cover" />
          ) : (
            <div className="aspect-video w-full bg-gradient-to-br from-[#123a33] to-[#181a2e]" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function FeastForEyes({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [38, 10]);
  const y = useTransform(scrollYProgress, [0, 1], [90, 0]);
  const shot = projects[2];

  return (
    <section className="relative overflow-hidden py-24 lg:py-36">
      {/* Warm orange→pink floor wash */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] opacity-[0.55]"
        style={{
          background:
            "radial-gradient(ellipse 46% 74% at 24% 88%, rgba(255,138,79,0.5) 0%, transparent 70%), radial-gradient(ellipse 46% 74% at 78% 88%, rgba(240,85,159,0.42) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2">
            …and a <span className="serif text-heart">feast for the eyes</span>
          </h2>
        </Reveal>

        <div ref={ref} className="mx-auto mt-10 max-w-4xl lg:mt-14" style={{ perspective: "1800px" }}>
          <motion.div
            style={reduce ? undefined : { rotateX, y, transformStyle: "preserve-3d" }}
            className="relative mx-auto aspect-[16/10.2] w-full rounded-[22px] bg-[#17171c] p-[1.1%] shadow-[0_60px_120px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(255,255,255,0.12)] lg:rounded-[30px]"
          >
            <TabletScreen shot={shot} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
