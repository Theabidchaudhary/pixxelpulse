const niches = [
  "YouTube", "SaaS", "Real Estate", "Fitness", "Education", "E-commerce",
  "Podcasts", "Sports", "Documentary", "Startups", "Agencies", "Events",
  "Gaming", "Travel", "Finance", "Music",
];

/** Industry marquee — pure CSS animation, pauses on hover. */
export default function NicheMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-line bg-ink-900/60 py-5" aria-hidden>
      <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-950 to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-950 to-transparent" />
      <div className="flex w-max animate-marquee gap-0 hover:[animation-play-state:paused]">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center">
            {niches.map((n) => (
              <span key={`${half}-${n}`} className="flex items-center">
                <span className="px-6 font-mono text-[0.78rem] uppercase tracking-[0.18em] text-fg-faint">
                  {n}
                </span>
                <span className="size-1 rounded-full bg-pulse-violet/60" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
