"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/lib/content";
import { FORMAT_LABELS } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Portfolio card. Vertical (9:16) for short-form, 16:9 otherwise.
 * Shorts try YouTube's vertical thumb (oar2) and fall back to a
 * center-cropped hqdefault.
 */
export default function VideoCard({
  project,
  onOpen,
  className,
  eager = false,
  fill = false,
}: {
  project: Project;
  onOpen: (p: Project) => void;
  className?: string;
  eager?: boolean;
  /** Fill the grid cell instead of enforcing an aspect ratio (for fixed-row grids). */
  fill?: boolean;
}) {
  const vertical = project.format === "short-form";
  const [src, setSrc] = useState(
    vertical
      ? `https://i.ytimg.com/vi/${project.youtubeId}/oar2.jpg`
      : `https://i.ytimg.com/vi/${project.youtubeId}/hqdefault.jpg`
  );

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onOpen(project)}
      className={cn(
        "group relative block w-full overflow-hidden rounded-2xl border border-line bg-ink-800 text-left transition-[border-color,box-shadow] duration-500 hover:border-line-strong hover:shadow-[0_20px_80px_rgba(124,106,247,0.14)]",
        fill ? "h-full" : vertical ? "aspect-[9/16]" : "aspect-video",
        className
      )}
      aria-label={`Play ${project.title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading={eager ? "eager" : "lazy"}
        width={vertical ? 405 : 480}
        height={vertical ? 720 : 360}
        onError={() =>
          setSrc(`https://i.ytimg.com/vi/${project.youtubeId}/hqdefault.jpg`)
        }
        className="absolute inset-0 size-full object-cover transition-transform duration-700 [transition-timing-function:var(--ease-pulse)] group-hover:scale-[1.045]"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/15 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      {/* Play chip */}
      <span
        className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-white/20 bg-ink-950/60 backdrop-blur-sm transition-all duration-500 [transition-timing-function:var(--ease-pulse)] group-hover:scale-110 group-hover:border-white/50 group-hover:bg-ink-950/80"
        aria-hidden
      >
        <svg width="11" height="12" viewBox="0 0 11 12" fill="none">
          <path d="M10 4.7c1 .58 1 2.02 0 2.6L2.5 11.63c-1 .58-2.25-.14-2.25-1.3V1.67C.25.51 1.5-.21 2.5.37L10 4.7z" fill="currentColor" transform="translate(0.4,0)" />
        </svg>
      </span>

      <span className="absolute inset-x-0 bottom-0 p-5">
        <span className="mb-1.5 block truncate font-mono text-[0.68rem] uppercase tracking-[0.14em] text-fg-faint">
          {FORMAT_LABELS[project.format]} · {project.niches[0]}
        </span>
        <span className="block font-display text-[1.05rem] font-semibold leading-snug text-fg">
          {project.title}
        </span>
      </span>
    </motion.button>
  );
}
