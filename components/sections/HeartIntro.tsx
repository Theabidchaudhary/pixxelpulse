import type { Project } from "@/lib/content";
import { projectThumb } from "@/lib/content";
import Reveal from "@/components/ui/Reveal";

function IconTile({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="relative mb-6 flex size-16 items-center justify-center" aria-hidden>
      <span className="dot-grid absolute inset-[-14px] opacity-60" style={{ maskImage: "radial-gradient(circle, black 30%, transparent 70%)" }} />
      <span
        className="relative flex size-11 items-center justify-center rounded-xl border"
        style={{ borderColor: `${color}55`, color, boxShadow: `0 0 26px ${color}44, inset 0 0 14px ${color}22` }}
      >
        {children}
      </span>
    </span>
  );
}

/** "Built with heart" — photo + feature cards intro, closing on a green wash. */
export default function HeartIntro({ projects }: { projects: Project[] }) {
  const photo = projects[0];
  return (
    <section className="relative pb-[calc(var(--cap)+7rem)] pt-28 lg:pt-36">
      {/* Green wash in the rounded bottom cap: a deep emerald→teal rise from
          the bottom edge plus a bright blurred pill hugging it */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] blur-lg md:blur-3xl"
        style={{
          background:
            "linear-gradient(to top, rgba(6,78,59,0.4), rgba(19,78,74,0.2) 50%, transparent)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[-100px] left-1/2 h-[350px] w-4/5 -translate-x-1/2 rounded-full opacity-55 blur-2xl md:blur-[100px]"
        style={{
          background: "linear-gradient(90deg, #84cc16, #10b981, #14b8a6)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2">
            Built with <span className="serif text-heart">heart</span>
            <br />
            for your content
          </h2>
          <p className="text-lead mx-auto mt-5 max-w-md">
            Our long-standing quality standards have proven themselves time and again.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-[1.15fr_0.75fr_0.85fr]">
          {/* Photo card */}
          <Reveal className="relative min-h-[280px] overflow-hidden rounded-3xl border border-line lg:row-span-2">
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={projectThumb(photo, "max")} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
          </Reveal>

          {/* Feature card 1 */}
          <Reveal delay={100} className="card-lux panel relative flex flex-col items-center overflow-hidden rounded-3xl p-9 text-center [--card-glow:rgba(255,138,79,0.22)] [--card-line:rgba(255,138,79,0.55)] [--card-shadow:rgba(255,138,79,0.25)]">
            <div className="glow left-1/2 top-[-60px] h-40 w-56 -translate-x-1/2 opacity-30" style={{ background: "#ff8a4f" }} aria-hidden />
            <IconTile color="#ff8a4f">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M12 21s-7-5.3-7-11a7 7 0 0114 0c0 5.7-7 11-7 11z" strokeLinejoin="round" />
                <circle cx="12" cy="10" r="2.6" />
              </svg>
            </IconTile>
            <h3 className="font-display text-[1.05rem] font-bold">
              Personal &amp; <span className="serif text-gradient">direct</span>
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-fg-soft">
              A direct line to your editor — no ticket queues, no account managers in between.
            </p>
          </Reveal>

          {/* Feature card 2 */}
          <Reveal delay={180} className="card-lux panel relative flex flex-col items-center overflow-hidden rounded-3xl p-9 text-center [--card-glow:rgba(139,108,246,0.24)] [--card-line:rgba(139,108,246,0.55)] [--card-shadow:rgba(139,108,246,0.28)]">
            <div className="glow left-1/2 top-[-60px] h-40 w-56 -translate-x-1/2 opacity-30" style={{ background: "#8b6cf6" }} aria-hidden />
            <IconTile color="#a78bfa">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M12 3l1.9 4.6L18.5 9l-4.6 1.4L12 15l-1.9-4.6L5.5 9l4.6-1.4L12 3zM18.5 14l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z" strokeLinejoin="round" />
              </svg>
            </IconTile>
            <h3 className="font-display text-[1.05rem] font-bold">
              <span className="serif text-candy">More</span> than just pretty
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-fg-soft">
              Cut to hold attention and convert viewers — not just to look good in the portfolio.
            </p>
          </Reveal>

          {/* Wide card */}
          <Reveal delay={240} className="card-lux panel relative overflow-hidden rounded-3xl p-9 lg:col-span-2 [--card-glow:rgba(47,191,143,0.2)] [--card-line:rgba(47,191,143,0.5)] [--card-shadow:rgba(47,191,143,0.24)]">
            <div className="glow bottom-[-90px] left-[10%] h-44 w-[420px] opacity-25" style={{ background: "#2fbf8f" }} aria-hidden />
            <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-xl border"
                style={{ borderColor: "#2fbf8f55", color: "#2fbf8f", boxShadow: "0 0 26px #2fbf8f44, inset 0 0 14px #2fbf8f22" }}
                aria-hidden
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M4 17l5-5 4 4 7-8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 8h5v5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <h3 className="font-display text-[1.05rem] font-bold">
                  For channels that want to <span className="serif text-mint">grow</span>
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-soft">
                  For creators, startups, brands and B2B — 1,300+ videos across 40+ niches.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
