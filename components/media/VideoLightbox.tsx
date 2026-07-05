"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/lib/content";
import { FORMAT_LABELS } from "@/lib/content";

/**
 * Custom video modal. The YouTube iframe only exists while open —
 * the facade pattern that keeps ~1MB of player JS off every page view.
 */
export default function VideoLightbox({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [project, onClose]);

  const vertical = project?.format === "short-form";

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          <button
            className="absolute inset-0 bg-ink-950/90 backdrop-blur-md"
            onClick={onClose}
            aria-label="Close video"
            tabIndex={-1}
          />
          <motion.div
            className={`relative w-full ${vertical ? "max-w-[420px]" : "max-w-5xl"}`}
            initial={{ scale: 0.94, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 10 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-semibold">{project.title}</p>
                <p className="font-mono text-xs uppercase tracking-widest text-fg-faint">
                  {FORMAT_LABELS[project.format]} · {project.niches.join(" · ")}
                </p>
              </div>
              <button
                ref={closeRef}
                onClick={onClose}
                className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line-strong text-fg transition-colors hover:bg-white/10"
                aria-label="Close video"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div
              className={`overflow-hidden rounded-2xl border border-line bg-ink-900 shadow-[0_40px_120px_rgba(0,0,0,0.7)] ${
                vertical ? "aspect-[9/16]" : "aspect-video"
              }`}
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={project.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="size-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
