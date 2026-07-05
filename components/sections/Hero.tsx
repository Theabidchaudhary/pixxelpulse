"use client";

import { motion, useReducedMotion } from "framer-motion";
import ParticleField from "@/components/fx/ParticleField";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const reduce = useReducedMotion();
  const up = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay, ease },
  });

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-[var(--nav-h)]">
      {/* Lighting */}
      <div
        className="glow left-1/2 top-[-260px] h-[560px] w-[900px] -translate-x-1/2 opacity-25"
        style={{ background: "var(--gradient-pulse)" }}
        aria-hidden
      />
      <div
        className="glow bottom-[-300px] right-[-200px] h-[500px] w-[500px] opacity-[0.12]"
        style={{ background: "#4d8dff" }}
        aria-hidden
      />
      {/* Faint grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 40%, black 30%, transparent 75%)",
        }}
      />
      <ParticleField />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 py-24 lg:px-12">
        <motion.p {...up(0.15)} className="text-label mb-7 flex items-center gap-3">
          <span aria-hidden className="inline-block h-px w-10" style={{ background: "var(--gradient-pulse)" }} />
          Video editing · Motion design · Post-production
        </motion.p>

        <h1 className="text-display max-w-5xl">
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={reduce ? { opacity: 0 } : { y: "108%" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.25, ease }}
            >
              We edit videos people
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="text-gradient block pb-2"
              initial={reduce ? { opacity: 0 } : { y: "108%" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.38, ease }}
            >
              can&apos;t scroll past.
            </motion.span>
          </span>
        </h1>

        <motion.p {...up(0.6)} className="text-lead mt-8 max-w-xl">
          Orvix is the post-production partner behind 1,300+ videos for creators, startups,
          and brands in 40+ niches — delivered in as fast as 48 hours.
        </motion.p>

        <motion.div {...up(0.75)} className="mt-11 flex flex-wrap items-center gap-4">
          <Button href="/contact">Book a call</Button>
          <Button href="/work" variant="ghost">
            See the work
          </Button>
        </motion.div>

        <motion.div
          {...up(1)}
          className="mt-20 flex flex-wrap items-center gap-x-10 gap-y-3 border-t border-line pt-7 lg:mt-28"
        >
          {site.stats.map((s) => (
            <p key={s.label} className="flex items-baseline gap-2.5">
              <span className="font-mono text-lg font-medium text-fg">
                {s.value.toLocaleString()}
                {s.suffix}
              </span>
              <span className="text-sm text-fg-faint">{s.label}</span>
            </p>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block"
        aria-hidden
      >
        <div className="h-12 w-px overflow-hidden bg-line">
          <motion.div
            className="h-4 w-px bg-fg-soft"
            animate={{ y: [0, 48] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
