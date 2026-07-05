"use client";

import { useState } from "react";
import type { Project } from "@/lib/content";

/** Lite YouTube facade: thumbnail until clicked, then the real iframe. */
export default function InlinePlayer({ project }: { project: Project }) {
  const [playing, setPlaying] = useState(false);
  const vertical = project.format === "short-form";
  const [thumb, setThumb] = useState(
    vertical
      ? `https://i.ytimg.com/vi/${project.youtubeId}/oar2.jpg`
      : `https://i.ytimg.com/vi/${project.youtubeId}/maxresdefault.jpg`
  );

  return (
    <div
      className={`relative mx-auto overflow-hidden rounded-2xl border border-line bg-ink-900 shadow-[0_40px_120px_rgba(0,0,0,0.55)] ${
        vertical ? "max-w-[420px] aspect-[9/16]" : "aspect-video"
      }`}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title={project.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="size-full"
        />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="group absolute inset-0"
          aria-label={`Play ${project.title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb}
            alt={`${project.title} — video thumbnail`}
            onError={() =>
              setThumb(`https://i.ytimg.com/vi/${project.youtubeId}/hqdefault.jpg`)
            }
            className="absolute inset-0 size-full object-cover transition-transform duration-700 [transition-timing-function:var(--ease-pulse)] group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-ink-950/30 transition-opacity duration-500 group-hover:bg-ink-950/15" aria-hidden />
          <span
            className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-ink-950/70 backdrop-blur-md transition-transform duration-500 [transition-timing-function:var(--ease-pulse)] group-hover:scale-110"
            aria-hidden
          >
            <svg width="20" height="22" viewBox="0 0 11 12" fill="none">
              <path d="M10 4.7c1 .58 1 2.02 0 2.6L2.5 11.63c-1 .58-2.25-.14-2.25-1.3V1.67C.25.51 1.5-.21 2.5.37L10 4.7z" fill="white" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
