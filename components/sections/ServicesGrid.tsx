import Link from "next/link";
import { services } from "@/content/services";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/Button";

const icons: Record<string, React.ReactNode> = {
  "short-form-video-editing": (
    <path d="M9 3h6a2 2 0 012 2v14a2 2 0 01-2 2H9a2 2 0 01-2-2V5a2 2 0 012-2zm2 14.5h2" strokeLinecap="round" />
  ),
  "youtube-video-editing": (
    <path d="M3 6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6zm7 3l5 3-5 3V9z" strokeLinejoin="round" />
  ),
  "motion-design-animation": (
    <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m14.5-6.5l-2 2m-7 7l-2 2m11 0l-2-2m-7-7l-2-2M12 9a3 3 0 100 6 3 3 0 000-6z" strokeLinecap="round" />
  ),
  "video-ads-performance-creative": (
    <path d="M3 17l5-6 4 4 6-8 3 4M3 21h18" strokeLinecap="round" strokeLinejoin="round" />
  ),
  "podcast-editing": (
    <path d="M12 3a3 3 0 013 3v6a3 3 0 11-6 0V6a3 3 0 013-3zm-6 9a6 6 0 0012 0M12 18v3" strokeLinecap="round" />
  ),
  "agency-partnerships": (
    <path d="M8 11a3 3 0 100-6 3 3 0 000 6zm8 0a3 3 0 100-6 3 3 0 000 6zM2.5 19a5.5 5.5 0 0111 0m1-4.6a5.5 5.5 0 017 4.6" strokeLinecap="round" />
  ),
};

export default function ServicesGrid() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 lg:py-40">
      <div
        className="glow right-[-240px] top-[-140px] h-[460px] w-[460px] opacity-[0.1]"
        style={{ background: "#7c6af7" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
        <SectionHeading
          eyebrow="What we do"
          heading={
            <>
              One partner. Every frame <span className="text-gradient">covered.</span>
            </>
          }
          lead="Six disciplines, one production system — so your short-form, long-form, and motion design all speak the same visual language."
        />

        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-6">
          {services.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={(i % 3) * 90}>
              <Link
                href={`/services/${s.slug}`}
                className="panel panel-hover group relative flex h-full flex-col p-7 lg:p-8"
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px scale-x-0 opacity-0 transition-all duration-700 [transition-timing-function:var(--ease-pulse)] group-hover:scale-x-100 group-hover:opacity-100" style={{ background: "var(--gradient-pulse)" }} aria-hidden />
                <span className="mb-6 flex size-11 items-center justify-center rounded-xl border border-line text-fg-soft transition-colors duration-500 group-hover:border-line-strong group-hover:text-fg">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                    {icons[s.slug]}
                  </svg>
                </span>
                <span className="mb-2 flex items-baseline justify-between gap-4">
                  <span className="text-h3">{s.navLabel}</span>
                  <span className="font-mono text-xs text-fg-faint">0{i + 1}</span>
                </span>
                <span className="text-[0.95rem] leading-relaxed text-fg-soft">{s.promise}</span>
                <span className="mt-auto flex items-center gap-2 pt-7 text-sm text-fg-faint transition-colors duration-500 group-hover:text-fg">
                  Explore <ArrowIcon />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
