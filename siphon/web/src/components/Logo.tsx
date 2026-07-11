export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      className="brand-mark"
      width={size}
      height={size}
      viewBox="0 0 512 512"
      role="img"
      aria-label="Vessel logo"
    >
      <defs>
        <linearGradient id="lg-tile" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#16121F" />
          <stop offset="1" stopColor="#0A0812" />
        </linearGradient>
        <linearGradient id="lg-glyph" x1="175" y1="166" x2="337" y2="346" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#9D8CFF" />
          <stop offset="1" stopColor="#7C6BFF" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="116" fill="url(#lg-tile)" />
      <rect x="2" y="2" width="508" height="508" rx="114" stroke="#FFFFFF" strokeOpacity="0.08" strokeWidth="4" fill="none" />
      <path
        d="M175 166 L175 303 C175 327 204 346 256 346 C308 346 337 327 337 303 L337 166"
        stroke="url(#lg-glyph)"
        strokeWidth="33"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M175 166 C175 190 204 209 256 209 C308 209 337 190 337 166"
        stroke="url(#lg-glyph)"
        strokeWidth="33"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="256" cy="265" r="27" fill="#46C8FF" />
    </svg>
  );
}
