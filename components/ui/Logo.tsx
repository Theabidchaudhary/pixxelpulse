import { cn } from "@/lib/utils";

/**
 * The pixxelpulse wordmark — the double-x carries a gradient pulse line
 * through its intersection.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex items-baseline font-display text-[1.35rem] font-semibold lowercase tracking-tight text-fg",
        className
      )}
    >
      pi
      <span className="relative inline-block tracking-[-0.08em]">
        xx
        <span
          aria-hidden
          className="absolute left-[8%] right-[8%] top-1/2 h-[2px] -translate-y-1/2 rounded-full"
          style={{ background: "var(--gradient-pulse)" }}
        />
      </span>
      elpulse
    </span>
  );
}

/** Standalone pulse glyph for favicons / avatars / footer. */
export function PulseGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <rect x="1" y="1" width="30" height="30" rx="8" stroke="url(#pg)" strokeWidth="1.5" />
      <path
        d="M7 16h5l2.5-6 3 12 2.5-6h5"
        stroke="url(#pg)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#7C6AF7" />
          <stop offset="0.55" stopColor="#4D8DFF" />
          <stop offset="1" stopColor="#53D8FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
