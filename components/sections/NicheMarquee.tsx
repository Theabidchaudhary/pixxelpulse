const rowA = [
  "YouTube", "SaaS", "Real Estate", "Fitness", "Education", "E-commerce",
  "Podcasts", "Sports", "Documentary", "Startups",
];
const rowB = [
  "Agencies", "Events", "Gaming", "Travel", "Finance", "Music",
  "Beauty", "Food", "Tech", "Automotive",
];

/* Alternate type treatments so the strip reads like a wall of client logos. */
const styles = [
  "font-display font-bold tracking-tight",
  "font-serif italic",
  "font-display font-semibold uppercase tracking-[0.22em] text-[0.7em]",
  "font-display font-bold lowercase tracking-tight",
  "font-serif italic uppercase tracking-[0.08em] text-[0.85em]",
];

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  return (
    <div
      className={`flex w-max items-center gap-0 ${reverse ? "animate-marquee-reverse" : "animate-marquee-slow"} hover:[animation-play-state:paused]`}
    >
      {[0, 1].map((half) => (
        <div key={half} className="flex shrink-0 items-center">
          {items.map((n, i) => (
            <span
              key={`${half}-${n}`}
              className={`whitespace-nowrap px-9 text-[1.35rem] text-[#26262b]/75 transition-colors hover:text-[#121214] lg:px-12 lg:text-[1.6rem] ${styles[i % styles.length]}`}
            >
              {n}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Light "trusted by" band between the dark hero block and the process block.
    The dark blocks above/below overlap it by var(--cap) with rounded corners. */
export default function NicheMarquee() {
  return (
    <section
      className="band-light relative bg-cream pb-[calc(var(--cap)+2.5rem)] pt-[calc(var(--cap)+2rem)]"
      aria-label="Industries we edit for"
    >
      <p className="text-label mb-10 text-center !text-[#3c3c44]">
        Together we&apos;ve built great things
      </p>
      <div className="relative space-y-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-cream to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-cream to-transparent" />
        <Row items={rowA} />
        <Row items={rowB} reverse />
      </div>
    </section>
  );
}
