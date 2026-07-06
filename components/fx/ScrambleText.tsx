"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const FRAMES = 16;
const FRAME_MS = 45;

function scrambledExcept(text: string, revealCount: number) {
  return text
    .split("")
    .map((ch, i) => {
      if (ch === " ") return " ";
      if (i < revealCount) return ch;
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    })
    .join("");
}

/** Decodes into `text` character-by-character once scrolled into view. */
export default function ScrambleText({
  text,
  className,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  as?: "span" | "h3" | "p" | "div";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (reduce) return;
    setDisplay(scrambledExcept(text, 0));
  }, [text, reduce]);

  useEffect(() => {
    if (!inView || reduce) return;
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      const revealCount = Math.floor((frame / FRAMES) * text.length);
      setDisplay(scrambledExcept(text, revealCount));
      if (frame >= FRAMES) {
        setDisplay(text);
        clearInterval(id);
      }
    }, FRAME_MS);
    return () => clearInterval(id);
  }, [inView, reduce, text]);

  return (
    // @ts-expect-error — dynamic intrinsic tag, ref typed loosely on purpose
    <Tag ref={ref} className={cn("font-mono tabular-nums", className)}>
      {display}
    </Tag>
  );
}
