import { allNiches } from "@/lib/content";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const impacts = [
  { value: "+220%", label: "Average watch time after a re-edit", color: "#4d8dff" },
  { value: "3.2×", label: "Median completion-rate lift", color: "#f062c0" },
  { value: "+58%", label: "Subscriber growth, first 90 days", color: "#ff9d5c" },
];

export default function ImpactStats() {
  const badges = allNiches.slice(0, 10);

  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 lg:py-40">
      <div className="glow left-1/2 top-[-160px] h-[420px] w-[760px] -translate-x-1/2 opacity-[0.12]" style={{ background: "var(--gradient-aurora)" }} aria-hidden />
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
        <SectionHeading
          eyebrow="Real numbers"
          heading={
            <>
              …with real <span className="text-gradient">impact.</span>
            </>
          }
          lead="A sharper edit doesn't just look better — it changes what the analytics say."
          align="center"
          className="mx-auto"
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-3 lg:mt-20">
          {impacts.map((s, i) => (
            <Reveal key={s.label} delay={i * 100} className="panel p-8 text-center lg:p-10">
              <p className="font-display text-4xl font-semibold tracking-tight lg:text-5xl" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="mt-3 text-sm text-fg-soft">{s.label}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-16 text-center lg:mt-20">
          <p className="text-label mb-6">Publishing across</p>
          <div className="flex flex-wrap justify-center gap-3">
            {badges.map((n) => (
              <span key={n} className="rounded-full border border-line px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] text-fg-soft">
                {n}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
