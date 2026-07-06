import { cn } from "@/lib/utils";

/**
 * The Orvix wordmark — lowercase Poppins with a full-spectrum gradient on the
 * first letter, matching the brand treatment used across the site.
 * `tone` picks the letter color for the rest of the word.
 */
export function Wordmark({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <span
      className={cn(
        "relative inline-flex items-baseline font-display text-[1.45rem] font-bold lowercase tracking-tight",
        tone === "dark" ? "text-[#121214]" : "text-fg",
        className
      )}
    >
      <span className="text-aurora">o</span>rvix
    </span>
  );
}

/** Standalone glyph for avatars / promise-orbit center: gradient ring "o". */
export function PulseGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <circle cx="16" cy="16" r="13" stroke="url(#pg)" strokeWidth="5.5" />
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#4C8DFF" />
          <stop offset="0.35" stopColor="#8B6CF6" />
          <stop offset="0.68" stopColor="#F0559F" />
          <stop offset="1" stopColor="#FF8A4F" />
        </linearGradient>
      </defs>
    </svg>
  );
}
