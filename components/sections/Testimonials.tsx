import { testimonials, type Testimonial } from "@/content/testimonials";

const colors = ["#8b6cf6", "#f0559f", "#2fbf8f", "#ff8a4f", "#4c8dff", "#56c8f5", "#e14fa0"];

function Stars() {
  return (
    <span className="flex gap-[2px]" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 16 16" fill="#fbbf24">
          <path d="M8 .8l2.1 4.6 5 .6-3.7 3.5.9 5-4.3-2.5L3.7 14.5l.9-5L.9 6l5-.6L8 .8z" />
        </svg>
      ))}
    </span>
  );
}

function Card({ t, color }: { t: Testimonial; color: string }) {
  return (
    <figure className="w-[320px] shrink-0 rounded-2xl bg-white p-6 shadow-[0_14px_40px_rgba(18,18,20,0.08)] sm:w-[360px]">
      <figcaption className="flex items-center gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold text-white"
          style={{ background: color }}
          aria-hidden
        >
          {t.name[0]}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-fg">{t.name}</span>
          <span className="block truncate text-xs text-fg-faint">{t.role}</span>
        </span>
        <span className="ml-auto">
          <Stars />
        </span>
      </figcaption>
      <blockquote className="mt-4 text-[0.84rem] leading-relaxed text-fg-soft">{t.quote}</blockquote>
    </figure>
  );
}

function Row({ items, reverse }: { items: Testimonial[]; reverse?: boolean }) {
  return (
    <div
      className={`flex w-max gap-5 ${reverse ? "animate-marquee-reverse" : "animate-marquee-slow"} hover:[animation-play-state:paused]`}
    >
      {[0, 1].map((half) => (
        <div key={half} className="flex shrink-0 gap-5" aria-hidden={half === 1}>
          {items.map((t, i) => (
            <Card key={`${half}-${t.name}`} t={t} color={colors[i % colors.length]} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Light band: two opposing marquee rows of client quotes. Rendered centered
    inside a full-viewport pinned cream band. */
export default function Testimonials() {
  const rowA = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const rowB = testimonials.slice(Math.ceil(testimonials.length / 2));

  return (
    <section className="relative py-6">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-h2 whitespace-nowrap text-[#121214]">
          What{" "}
          <span
            className="serif"
            style={{
              background: "linear-gradient(96deg, #7c3aed 0%, #d946a8 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            our clients
          </span>{" "}
          say
        </h2>
        <p className="text-lead mt-4">How we turn footage into results, together.</p>
      </div>
      <div className="relative mt-12 space-y-5 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-cream to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-cream to-transparent" />
        <Row items={rowA} />
        <Row items={rowB} reverse />
      </div>
    </section>
  );
}
