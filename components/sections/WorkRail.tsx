"use client";

import { useState } from "react";
import type { Project } from "@/lib/content";
import VideoCard from "@/components/media/VideoCard";
import VideoLightbox from "@/components/media/VideoLightbox";
import Reveal from "@/components/ui/Reveal";

/** Horizontal set of related work cards with a shared lightbox. */
export default function WorkRail({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Project | null>(null);
  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 md:gap-6">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 80}>
            <VideoCard project={p} onOpen={setActive} />
          </Reveal>
        ))}
      </div>
      <VideoLightbox project={active} onClose={() => setActive(null)} />
    </>
  );
}
