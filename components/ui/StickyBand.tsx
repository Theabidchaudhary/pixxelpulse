"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sticky wrapper for a tall light band: it scrolls normally until its bottom
 * edge reaches the viewport bottom, then pins there (top = viewportH − height,
 * negative for bands taller than the screen). The dark block that follows then
 * rides up and covers it — the reference's cover/reveal scroll effect.
 */
export default function StickyBand({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState<number | undefined>(undefined);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setTop(Math.min(0, window.innerHeight - el.offsetHeight));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={ref} className={`sticky z-0 ${className}`} style={{ top }}>
      {children}
    </div>
  );
}
