import Link from "next/link";
import type { Project } from "@/lib/content";
import { projectThumb } from "@/lib/content";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const outcomes = [
  {
    tag: "Short-form",
    color: "#2fbf8f",
    heading: (
      <>
        Turns scrolls into <span className="serif" style={{ color: "#2fbf8f" }}>followers.</span>
      </>
    ),
    body: "Reels, TikToks and Shorts built to stop the thumb.",
    checks: ["Hook-first structure", "Platform-native pacing & captions"],
    cta: "See short-form work",
    href: "/work",
    icon: <path d="M8 4h8a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2zM10 9l4.5 3-4.5 3V9z" strokeLinejoin="round" />,
  },
  {
    tag: "YouTube",
    color: "#ff8a4f",
    heading: (
      <>
        Grows your channel, <span className="serif" style={{ color: "#ff8a4f" }}>day and night.</span>
      </>
    ),
    body: "Long-form edits that keep people watching to the end.",
    checks: ["Retention-tuned pacing", "Thumbnails & chapters ready"],
    cta: "See YouTube work",
    href: "/work",
    icon: <path d="M3.5 12c0-3 .3-4.6.8-5.4.5-.8 1.4-1 3-1.1C9 5.4 10.7 5.4 12 5.4s3 0 4.7.1c1.6.1 2.5.3 3 1.1.5.8.8 2.4.8 5.4s-.3 4.6-.8 5.4c-.5.8-1.4 1-3 1.1-1.7.1-3.4.1-4.7.1s-3 0-4.7-.1c-1.6-.1-2.5-.3-3-1.1-.5-.8-.8-2.4-.8-5.4zM10 9l5 3-5 3V9z" strokeLinejoin="round" />,
  },
  {
    tag: "Video ads",
    color: "#4c8dff",
    heading: (
      <>
        Turns ad clicks into <span className="serif" style={{ color: "#4c8dff" }}>customers.</span>
      </>
    ),
    body: "Performance creative that guides viewers straight to the offer.",
    checks: ["Built for conversion", "Ready for Meta & Google Ads"],
    cta: "See ad work",
    href: "/work",
    icon: <path d="M4 17l5-5 4 4 7-8M15 8h5v5" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    tag: "Motion design",
    color: "#a86cf6",
    heading: (
      <>
        Makes your brand <span className="serif" style={{ color: "#a86cf6" }}>unmistakable.</span>
      </>
    ),
    body: "Intros, lower thirds and animation systems in your visual language.",
    checks: ["On-brand motion system", "Reused across every video"],
    cta: "See motion work",
    href: "/services/motion-design-animation",
    icon: <path d="M12 3l1.9 4.6L18.5 9l-4.6 1.4L12 15l-1.9-4.6L5.5 9l4.6-1.4L12 3zM18.5 14l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z" strokeLinejoin="round" />,
  },
];

export default function DreamOutcomes({ projects }: { projects: Project[] }) {
  const shots = projects.slice(0, outcomes.length);

  return (
    <section className="relative mx-auto max-w-[1240px] px-6 py-16 lg:px-10 lg:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-h2">
          What should your <span className="serif text-gradient">dream video</span> do?
        </h2>
        <p className="text-lead mx-auto mt-5 max-w-md">Pick the type that fits your goal best.</p>
      </Reveal>

      <div className="mt-14 space-y-6 lg:mt-20">
        {outcomes.map((o, i) => {
          const project = shots[i];
          const reverse = i % 2 === 1;
          return (
            <Reveal key={o.tag}>
              <div
                className={cn(
                  "panel group relative grid overflow-hidden rounded-3xl lg:grid-cols-2",
                  reverse && "lg:[&>*:first-child]:order-2"
                )}
              >
                {/* Image half */}
                <div className="relative min-h-[240px] overflow-hidden lg:min-h-[330px]">
                  {project && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={projectThumb(project, "max")}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover transition-transform duration-700 [transition-timing-function:var(--ease-pulse)] group-hover:scale-[1.04]"
                    />
                  )}
                  <div
                    className={cn(
                      "absolute inset-0",
                      reverse ? "bg-gradient-to-l" : "bg-gradient-to-r",
                      "from-transparent via-transparent to-ink-800/90"
                    )}
                    aria-hidden
                  />
                </div>

                {/* Content half */}
                <div className="relative flex flex-col items-start justify-center p-8 lg:p-12">
                  {/* Corner arrow chip */}
                  <Link
                    href={o.href}
                    aria-label={o.cta}
                    className="absolute right-6 top-6 flex size-9 items-center justify-center rounded-lg border border-line text-fg-soft transition-colors hover:border-line-strong hover:text-fg"
                  >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M4 12L12 4m0 0H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>

                  <span className="relative mb-5 inline-flex size-12 items-center justify-center" aria-hidden>
                    <span className="dot-grid absolute inset-[-10px] opacity-50" style={{ maskImage: "radial-gradient(circle, black 30%, transparent 72%)" }} />
                    <span
                      className="relative flex size-10 items-center justify-center rounded-lg border"
                      style={{ borderColor: `${o.color}55`, color: o.color, boxShadow: `0 0 22px ${o.color}44, inset 0 0 12px ${o.color}22` }}
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        {o.icon}
                      </svg>
                    </span>
                  </span>

                  <p className="text-label !text-[0.66rem]" style={{ color: o.color }}>
                    {o.tag}
                  </p>
                  <h3 className="mt-3 font-display text-[1.45rem] font-bold leading-snug lg:text-[1.7rem]">{o.heading}</h3>
                  <p className="mt-2.5 text-[0.9rem] text-fg-soft">{o.body}</p>

                  <ul className="mt-5 space-y-2">
                    {o.checks.map((c) => (
                      <li key={c} className="flex items-center gap-2.5 text-[0.85rem] text-fg-soft">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ color: o.color }} aria-hidden>
                          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
                          <path d="M5 8.2l2 2 4-4.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {c}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={o.href}
                    className="group/cta mt-7 inline-flex items-center gap-2 rounded-full border border-line bg-ink-900/70 px-5.5 py-2.5 text-[0.82rem] font-semibold text-fg transition-all duration-500 hover:border-line-strong hover:bg-ink-700"
                  >
                    {o.cta}
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-500 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5">
                      <path d="M4 12L12 4m0 0H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
