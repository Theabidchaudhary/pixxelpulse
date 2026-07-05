import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const steps = [
  {
    n: "01",
    title: "Brief",
    body: "Tell us the goal, the audience, and drop the footage. A five-minute written brief is all we need to start.",
    promise: "Same-day kickoff",
  },
  {
    n: "02",
    title: "Edit",
    body: "A dedicated editor builds the cut — story first, then pacing, sound, captions, and color.",
    promise: "First cut in 48–72h",
  },
  {
    n: "03",
    title: "Refine",
    body: "Timestamped feedback goes in, a tightened cut comes back. No endless loops, no vanishing acts.",
    promise: "Revisions included",
  },
  {
    n: "04",
    title: "Publish",
    body: "Exports for every platform, named and organized. Masters are yours, forever.",
    promise: "Full ownership",
  },
];

export default function ProcessTimeline() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-40">
      <SectionHeading
        eyebrow="The process"
        heading={
          <>
            From raw footage to <span className="text-gradient">published</span> — in days.
          </>
        }
        lead="A production system refined over 1,300 projects. You stay in the creative seat; we run the machine."
      />

      <ol className="relative mt-16 grid gap-10 md:grid-cols-2 lg:mt-24 lg:grid-cols-4 lg:gap-8">
        {/* Timeline rule across desktop */}
        <div className="playhead-rule absolute -top-8 left-0 hidden w-full lg:block" aria-hidden />
        {steps.map((s, i) => (
          <Reveal as="li" key={s.n} delay={i * 110} className="relative">
            <p className="font-mono text-sm text-pulse-violet">{s.n}</p>
            <h3 className="text-h3 mt-3">{s.title}</h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-fg-soft">{s.body}</p>
            <p className="mt-5 inline-block rounded-full border border-line px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-fg-soft">
              {s.promise}
            </p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
