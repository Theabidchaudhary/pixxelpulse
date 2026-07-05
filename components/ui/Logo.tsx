import { cn } from "@/lib/utils";

/**
 * The Orvix wordmark — interim brand mark: lowercase display type with a
 * gradient pulse dot. Final logo lands once the brand name is locked.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex items-baseline gap-[3px] font-display text-[1.4rem] font-semibold lowercase tracking-tight text-fg",
        className
      )}
    >
      orvix
      <span
        aria-hidden
        className="mb-[3px] inline-block size-[7px] self-end rounded-full"
        style={{ background: "var(--gradient-pulse)" }}
      />
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
