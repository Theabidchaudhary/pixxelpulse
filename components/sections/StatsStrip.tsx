import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { team } from "@/content/team";

const lead = team[0];

function Stars() {
  return (
    <div className="flex justify-center gap-1" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="17" height="17" viewBox="0 0 16 16" fill="#fbbf24">
          <path d="M8 .8l2.1 4.6 5 .6-3.7 3.5.9 5-4.3-2.5L3.7 14.5l.9-5L.9 6l5-.6L8 .8z" />
        </svg>
      ))}
    </div>
  );
}

export default function StatsStrip() {
  return (
    <section className="relative mx-auto max-w-[1240px] px-6 py-20 lg:px-10 lg:py-28">
      <div className="grid items-center gap-14 lg:grid-cols-3 lg:gap-0">
        {/* Projects delivered */}
        <Reveal className="text-center lg:border-r lg:border-line lg:px-10">
          <p className="serif text-mint text-6xl lg:text-7xl">1,300+</p>
          <p className="mt-4 text-sm text-fg-soft">Projects successfully delivered</p>
        </Reveal>

        {/* Rating */}
        <Reveal delay={90} className="text-center lg:border-r lg:border-line lg:px-10">
          <div className="flex items-center justify-center gap-2.5">
            <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.96 10.96 0 001 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <Stars />
          </div>
          <p className="mt-4 text-xs text-fg-faint">What our clients say:</p>
          <p className="mt-1 text-sm text-fg-soft">4.9 out of 5 across 50+ reviews</p>
        </Reveal>

        {/* Self-quote card */}
        <Reveal delay={180} className="lg:pl-10">
          <div
            className="relative mx-auto max-w-xs overflow-hidden rounded-2xl border p-7 text-center"
            style={{
              borderColor: "rgba(240,85,159,0.3)",
              background: "linear-gradient(160deg, rgba(240,85,159,0.12) 0%, rgba(19,19,24,0.9) 45%)",
              boxShadow: "0 0 40px rgba(240,85,159,0.14)",
            }}
          >
            <span
              className="mx-auto mb-5 flex size-9 items-center justify-center rounded-lg border"
              style={{ borderColor: "rgba(240,85,159,0.5)", color: "#f0559f", boxShadow: "0 0 18px rgba(240,85,159,0.4)" }}
              aria-hidden
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.5 11c1.9 0 3.5 1.6 3.5 3.5S8.4 18 6.5 18 3 16.4 3 14.5c0-3.6 2-6.8 5-8.5l1 1.6c-1.6 1-2.8 2.4-3.3 4 .3-.1.5-.1.8-.1zm11 0c1.9 0 3.5 1.6 3.5 3.5S19.4 18 17.5 18 14 16.4 14 14.5c0-3.6 2-6.8 5-8.5l1 1.6c-1.6 1-2.8 2.4-3.3 4 .3-.1.5-.1.8-.1z" />
              </svg>
            </span>
            <p className="serif text-[1.25rem] leading-snug text-fg">
              We cut videos that <span className="text-heart">pay off</span>. Not just ones that look good.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <span
                className="flex size-9 items-center justify-center rounded-full font-display text-xs font-bold text-white"
                style={{ background: "var(--gradient-aurora)" }}
                aria-hidden
              >
                {lead.name[0]}
              </span>
              <span className="text-left">
                <span className="block text-xs font-semibold text-fg">{lead.name}</span>
                <span className="block text-[0.68rem] text-fg-faint">{lead.role}</span>
              </span>
            </div>
            <Link
              href="/contact"
              className="group mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-ink-900/80 px-5 py-2.5 text-[0.78rem] font-semibold text-fg transition-colors hover:border-line-strong"
            >
              Contact us
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <path d="M4 12L12 4m0 0H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
