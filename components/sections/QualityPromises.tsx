import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const promises = [
  {
    title: "Senior editors only",
    body: "No trainees learning on your account — every project is cut by a senior editor.",
    icon: <path d="M12 3l2.6 5.6L21 9.3l-4.5 4.2 1.2 6.1L12 16.8l-5.7 2.8 1.2-6.1L3 9.3l6.4-.7L12 3z" strokeLinejoin="round" />,
    pos: "left-[4%] top-[6%]",
    float: { x: 8, y: -16, r: -3 },
    dur: 6.5,
  },
  {
    title: "48–72h delivery",
    body: "A committed date before we start, in writing — not a rolling estimate.",
    icon: <path d="M12 7v5l3.5 2M12 21a9 9 0 100-18 9 9 0 000 18z" strokeLinecap="round" />,
    pos: "left-[36%] top-[0%]",
    float: { x: -10, y: -14, r: 3 },
    dur: 7.5,
  },
  {
    title: "Unlimited revisions",
    body: "We keep refining until the cut matches what's in your head — no round limits.",
    icon: <path d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3M14 3v4h-4M10 21v-4h4" strokeLinecap="round" strokeLinejoin="round" />,
    pos: "left-[68%] top-[8%]",
    float: { x: 12, y: -18, r: -2 },
    dur: 6,
  },
  {
    title: "Transparent flat pricing",
    body: "One quote, no surprise invoices — scope changes get a heads-up first.",
    icon: <path d="M12 2v20M17 6.5c0-1.9-2.2-3.5-5-3.5S7 4.6 7 6.5 9.2 10 12 10s5 1.6 5 3.5-2.2 3.5-5 3.5-5-1.6-5-3.5" strokeLinecap="round" />,
    pos: "left-[8%] top-[54%]",
    float: { x: -8, y: -14, r: 2 },
    dur: 7,
  },
  {
    title: "You own every master",
    body: "Full-resolution exports and organized project files, yours forever.",
    icon: <path d="M12 3l7 4v10l-7 4-7-4V7l7-4zm0 6a3 3 0 110 6 3 3 0 010-6z" strokeLinejoin="round" />,
    pos: "left-[58%] top-[56%]",
    float: { x: 10, y: -16, r: -3 },
    dur: 6.8,
  },
];

function PromiseCard({ p }: { p: (typeof promises)[number] }) {
  return (
    <div
      className="panel w-52 p-5 animate-float lg:w-56"
      style={
        {
          "--float-x": `${p.float.x}px`,
          "--float-y": `${p.float.y}px`,
          "--float-r": `${p.float.r}deg`,
          animationDuration: `${p.dur}s`,
        } as React.CSSProperties
      }
    >
      <span className="mb-4 flex size-9 items-center justify-center rounded-lg border border-line text-fg-soft">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          {p.icon}
        </svg>
      </span>
      <p className="text-sm font-medium text-fg">{p.title}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-fg-soft">{p.body}</p>
    </div>
  );
}

export default function QualityPromises() {
  return (
    <section className="relative mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-40">
      <SectionHeading
        eyebrow="Quality bar"
        heading={
          <>
            Our five <span className="text-gradient">quality promises.</span>
          </>
        }
        lead="Every engagement model ships with the same five guarantees — no tier cuts corners."
        align="center"
        className="mx-auto"
      />

      {/* Desktop: scattered floating cluster */}
      <div className="relative mt-20 hidden h-[460px] lg:block">
        {promises.map((p) => (
          <Reveal key={p.title} className={`absolute ${p.pos}`}>
            <PromiseCard p={p} />
          </Reveal>
        ))}
      </div>

      {/* Mobile / tablet: simple grid */}
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:hidden">
        {promises.map((p, i) => (
          <Reveal key={p.title} delay={i * 80} className="panel p-6">
            <span className="mb-4 flex size-9 items-center justify-center rounded-lg border border-line text-fg-soft">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                {p.icon}
              </svg>
            </span>
            <p className="text-sm font-medium text-fg">{p.title}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-fg-soft">{p.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
