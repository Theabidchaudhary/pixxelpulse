import Link from "next/link";
import { plans } from "@/content/pricing";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const cardMeta = [
  {
    color: "#ff8a4f",
    icon: <path d="M4 5.5h16v13H4zM4 9.5h16M8 5.5v4" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    color: "#4c8dff",
    icon: <path d="M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c2.5 2.4 3.8 5.6 3.8 9S14.5 18.6 12 21c-2.5-2.4-3.8-5.6-3.8-9S9.5 5.4 12 3z" strokeLinecap="round" />,
  },
  {
    color: "#2fbf8f",
    icon: <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM12 12l8-4.5M12 12v9M12 12L4 7.5" strokeLinejoin="round" />,
  },
];

export default function PricingTeaser() {
  return (
    <section className="relative pb-20 pt-[calc(var(--cap)+3.5rem)] lg:pb-28 lg:pt-[calc(var(--cap)+5rem)]">
      {/* Extra violet/blue stage glow on top of the block wash */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 8%, rgba(113,66,214,0.6) 0%, transparent 65%), radial-gradient(ellipse 45% 50% at 10% 42%, rgba(34,90,190,0.5) 0%, transparent 70%), radial-gradient(ellipse 45% 50% at 90% 44%, rgba(120,58,200,0.42) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2">
            Where&apos;s the <span className="serif text-gradient">catch?</span>
          </h2>
          <p className="text-lead mx-auto mt-5 max-w-md">
            There isn&apos;t one. Pick the model that fits how often you publish.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-3 lg:gap-7">
          {plans.map((p, i) => {
            const meta = cardMeta[i % cardMeta.length];
            return (
              <Reveal key={p.name} delay={i * 100}>
                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-2xl border border-line bg-ink-900/80 p-7 backdrop-blur-sm lg:p-8",
                    p.highlighted && "electric-border border-transparent bg-ink-900"
                  )}
                >
                  {p.highlighted && (
                    <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-pulse-blue px-4 py-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_0_20px_rgba(76,141,255,0.7)]">
                      Popular
                    </span>
                  )}

                  <span className="relative mb-6 inline-flex size-12 items-center justify-center" aria-hidden>
                    <span className="dot-grid absolute inset-[-10px] opacity-50" style={{ maskImage: "radial-gradient(circle, black 30%, transparent 72%)" }} />
                    <span
                      className="relative flex size-10 items-center justify-center rounded-lg border"
                      style={{ borderColor: `${meta.color}55`, color: meta.color, boxShadow: `0 0 22px ${meta.color}44, inset 0 0 12px ${meta.color}22` }}
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        {meta.icon}
                      </svg>
                    </span>
                  </span>

                  <h3 className="font-display text-[1.45rem] font-bold">{p.name}</h3>
                  <p className="mt-1 text-[0.9rem] text-fg-soft">{p.tag}</p>

                  <p className="serif mt-5 text-[2.5rem]" style={{ color: meta.color }}>
                    {p.price.toLowerCase().startsWith("from") ? (
                      <>
                        <span className="text-[0.62em]">from </span>
                        {p.price.slice(5)}
                      </>
                    ) : (
                      p.price.toLowerCase()
                    )}
                  </p>
                  <p className="text-sm text-fg-soft">{p.unit}</p>

                  <ul className="mt-6 flex-1 space-y-2.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[0.92rem] text-fg">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0" style={{ color: meta.color }} aria-hidden>
                          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
                          <path d="M5 8.2l2 2 4-4.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className="group mt-8 inline-flex items-center justify-center gap-2 rounded-full border border-line bg-ink-950/80 px-6 py-3 text-[0.82rem] font-bold text-fg transition-all duration-500 hover:border-line-strong hover:bg-ink-700"
                  >
                    {p.cta === "Book a call" ? "Contact us" : p.cta}
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                      <path d="M4 12L12 4m0 0H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={220} className="mt-10 text-center">
          <Link href="/pricing" className="text-sm text-fg-soft underline-offset-4 transition-colors hover:text-fg hover:underline">
            See full pricing &amp; features
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
