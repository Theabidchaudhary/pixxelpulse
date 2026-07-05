"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight canvas particle drift for the hero — reacts gently to the
 * pointer. Hand-rolled (no three.js) to keep the JS budget intact.
 * Renders nothing on touch/reduced-motion.
 */
export default function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isDesktop = window.matchMedia("(pointer: fine)").matches;
    const COUNT = isDesktop ? 70 : 30;
    let w = 0, h = 0, dpr = Math.min(devicePixelRatio, 2);
    let mx = -9999, my = -9999;
    let raf = 0;

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; hue: number };
    let parts: P[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      parts = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.12 - 0.04,
        r: Math.random() * 1.6 + 0.4,
        a: Math.random() * 0.35 + 0.08,
        hue: Math.random(),
      }));
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        // gentle pointer repulsion
        const dx = p.x - mx, dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22500) {
          const f = (1 - d2 / 22500) * 0.06;
          p.vx += (dx / Math.sqrt(d2 + 1)) * f;
          p.vy += (dy / Math.sqrt(d2 + 1)) * f;
        }
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const c =
          p.hue < 0.45 ? "124,106,247" : p.hue < 0.8 ? "77,141,255" : "83,216,255";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c},${p.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };

    resize();
    seed();
    raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(() => {
      resize();
      seed();
    });
    ro.observe(canvas);
    if (isDesktop) addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 size-full" />;
}
