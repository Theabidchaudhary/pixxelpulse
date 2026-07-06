import Link from "next/link";
import type { Project } from "@/lib/content";
import { projectThumb } from "@/lib/content";
import Reveal from "@/components/ui/Reveal";

const stats = [
  { value: "+220%", label: "Watch time after a re-edit" },
  { value: "3.2×", label: "Completion-rate lift" },
  { value: "+58%", label: "Subscriber growth in 90 days" },
];

const miniFrames = [
  { border: "#e7b32a", label: "Samsung TV Ad" },
  { border: "#4c8dff", label: "Nike VR Experience" },
  { border: "#7a8253", label: "ICC Showreel" },
];

/** Light "…with real impact" band between the dark feast block and pricing. */
export default function ImpactStats({ projects }: { projects: Project[] }) {
  const featured = projects[0];
  const minis = projects.slice(3, 6);

  return (
    <section className="band-light relative bg-cream">
      <div className="mx-auto max-w-[1240px] px-6 pb-[calc(var(--cap)+4rem)] pt-[calc(var(--cap)+3.5rem)] lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2">
            … with real <span className="serif text-mint">impact</span>
          </h2>
          <p className="text-lead mx-auto mt-5 max-w-md">
            We cut videos that move your channel&apos;s numbers in a real way.
          </p>
        </Reveal>

        {/* Case study card */}
        <Reveal delay={120} className="mt-12 lg:mt-16">
          <div className="grid items-center gap-8 rounded-3xl bg-white p-7 shadow-[0_24px_70px_rgba(18,18,20,0.08)] lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
            <div>
              <p className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full border border-[#2fbf8f]/40 bg-[#2fbf8f]/10 px-3.5 py-1 text-xs font-semibold text-[#1d8a66]">
                  Content creator
                </span>
                <span className="text-xs text-fg-faint">YouTube · multiple channels</span>
              </p>
              <h3 className="mt-5 font-display text-[1.6rem] font-bold leading-snug lg:text-[2rem]">
                A sharper edit <span className="serif text-mint">doubles</span> the watch time.
              </h3>
              <p className="mt-4 max-w-lg text-[0.92rem] leading-relaxed text-fg-soft">
                Consistent, retention-tuned edits mean viewers stay to the end and the algorithm keeps
                recommending. On top of that: publishing weekly finally became effortless.
              </p>

              <div className="mt-7 grid max-w-md grid-cols-3 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-xl border border-line bg-cream/60 p-3.5 text-center">
                    <p className="serif text-mint text-[1.55rem]">{s.value}</p>
                    <p className="mt-1 text-[0.62rem] leading-snug text-fg-faint">{s.label}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/work"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#121214] px-6 py-3 text-[0.82rem] font-bold text-white transition-shadow hover:shadow-[0_8px_30px_rgba(18,18,20,0.35)]"
              >
                See the work
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <path d="M4 12L12 4m0 0H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {/* Browser-framed thumbnail */}
            <div className="overflow-hidden rounded-2xl border-[3px] border-[#1d8a66] bg-white shadow-[0_20px_50px_rgba(18,18,20,0.14)]">
              <div className="flex items-center gap-1.5 border-b border-line bg-white px-3.5 py-2.5">
                <span className="size-2 rounded-full bg-[#ff5f57]" />
                <span className="size-2 rounded-full bg-[#febc2e]" />
                <span className="size-2 rounded-full bg-[#28c840]" />
                <span className="ml-auto flex size-6 items-center justify-center rounded-md bg-[#121214] text-white">
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M4 12L12 4m0 0H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
              {featured && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={projectThumb(featured, "max")} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
              )}
            </div>
          </div>
        </Reveal>

        {/* Mini browser cards */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {minis.map((p, i) => (
            <Reveal key={p.slug} delay={i * 90}>
              <Link href={`/work/${p.slug}`} className="group block">
                <div
                  className="overflow-hidden rounded-xl border-[3px] bg-white shadow-[0_12px_34px_rgba(18,18,20,0.1)] transition-transform duration-500 group-hover:-translate-y-1"
                  style={{ borderColor: miniFrames[i]?.border ?? "#4c8dff" }}
                >
                  <div className="flex items-center gap-1 px-2.5 py-1.5">
                    <span className="size-1.5 rounded-full bg-[#ff5f57]" />
                    <span className="size-1.5 rounded-full bg-[#febc2e]" />
                    <span className="size-1.5 rounded-full bg-[#28c840]" />
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={projectThumb(p)} alt={p.title} loading="lazy" className="aspect-video w-full object-cover" />
                </div>
                <p className="mt-2.5 text-xs font-medium text-fg-soft">{p.title}</p>
              </Link>
            </Reveal>
          ))}

          {/* "You next?" card */}
          <Reveal delay={280}>
            <Link href="/contact" className="group block">
              <div className="overflow-hidden rounded-xl border-[3px] border-[#c026d3] bg-white shadow-[0_12px_34px_rgba(18,18,20,0.1)] transition-transform duration-500 group-hover:-translate-y-1">
                <div className="flex items-center gap-1 px-2.5 py-1.5">
                  <span className="size-1.5 rounded-full bg-[#ff5f57]" />
                  <span className="size-1.5 rounded-full bg-[#febc2e]" />
                  <span className="size-1.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex aspect-video w-full items-center justify-center bg-white">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#121214] px-5 py-2.5 text-[0.8rem] font-bold text-white">
                    You next?
                    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M4 12L12 4m0 0H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
              <p className="mt-2.5 text-xs font-medium text-fg-soft">and many more</p>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
