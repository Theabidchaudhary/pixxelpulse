import { testimonials } from "@/content/testimonials";
import { site } from "@/content/site";
import Reveal from "@/components/ui/Reveal";

const quote = testimonials.find((t) => t.featured) ?? testimonials[0];

function Stars() {
  return (
    <div className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 16 16" fill="#ff9d5c">
          <path d="M8 .8l2.1 4.6 5 .6-3.7 3.5.9 5-4.3-2.5L3.7 14.5l.9-5L.9 6l5-.6L8 .8z" />
        </svg>
      ))}
    </div>
  );
}

export default function StatsStrip() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 pb-24 lg:px-12 lg:pb-32">
      <div className="grid gap-6 sm:grid-cols-3">
        <Reveal className="panel flex flex-col justify-center p-7 lg:p-8">
          <p className="font-display text-3xl font-semibold tracking-tight text-fg lg:text-4xl">
            {site.stats[0].value.toLocaleString()}
            {site.stats[0].suffix}
          </p>
          <p className="mt-2 text-sm text-fg-soft">{site.stats[0].label}, across 40+ niches.</p>
        </Reveal>

        <Reveal delay={90} className="panel flex flex-col justify-center p-7 lg:p-8">
          <Stars />
          <p className="mt-3 font-display text-2xl font-semibold tracking-tight text-fg">4.9/5</p>
          <p className="mt-1 text-sm text-fg-soft">Average client rating across {testimonials.length}+ reviews</p>
        </Reveal>

        <Reveal delay={180} className="panel flex flex-col justify-center p-7 lg:p-8">
          <p className="text-[0.92rem] italic leading-relaxed text-fg-soft">&ldquo;{quote.quote.slice(0, 96)}…&rdquo;</p>
          <p className="mt-3 text-sm font-medium text-fg">
            {quote.name} <span className="font-normal text-fg-faint">· {quote.role}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
