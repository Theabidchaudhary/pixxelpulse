"use client";

import { useEffect, useRef } from "react";

/**
 * A soft radial light that trails the pointer on desktop.
 * Pure transform animation — zero layout cost. Hidden on touch devices
 * and under prefers-reduced-motion.
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    let x = innerWidth / 2, y = innerHeight / 3, tx = x, ty = y;
    let raf = 0;
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (el.style.opacity === "") el.style.opacity = "1";
    };
    const loop = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[1] hidden size-[600px] rounded-full opacity-0 transition-opacity duration-1000 md:block"
      style={{
        background:
          "radial-gradient(circle, rgba(124,106,247,0.07) 0%, rgba(77,141,255,0.04) 40%, transparent 70%)",
      }}
    />
  );
}
