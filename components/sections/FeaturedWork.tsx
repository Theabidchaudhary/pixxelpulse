"use client";

import { useState } from "react";
import type { Project } from "@/lib/content";
import VideoCard from "@/components/media/VideoCard";
import VideoLightbox from "@/components/media/VideoLightbox";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export default function FeaturedWork({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Project | null>(null);
  const shorts = projects.filter((p) => p.format === "short-form").slice(0, 2);
  const wide = projects.filter((p) => p.format !== "short-form").slice(0, 4);

  return (
    <section className="relative mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-40">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-8 lg:mb-20">
        <SectionHeading
          eyebrow="Selected work"
          heading={
            <>
              Proof, not <span className="text-gradient">promises.</span>
            </>
          }
          lead="A cut of recent work across formats and industries. Every piece built for the platform it lives on."
        />
        <Reveal delay={150} className="hidden lg:block">
          <Button href="/work" variant="ghost">
            View all work
          </Button>
        </Reveal>
      </div>

      {/* Mixed-aspect grid on fixed row tracks: verticals interleaved with wide pieces */}
      <div className="grid grid-cols-2 auto-rows-[160px] gap-4 md:grid-cols-4 md:auto-rows-[210px] md:gap-6">
        <Reveal className="col-span-2 row-span-2">
          <VideoCard project={wide[0]} onOpen={setActive} fill className="h-full" />
        </Reveal>
        <Reveal delay={90} className="row-span-2">
          <VideoCard project={shorts[0]} onOpen={setActive} fill className="h-full" />
        </Reveal>
        <Reveal delay={180} className="row-span-2">
          <VideoCard project={shorts[1]} onOpen={setActive} fill className="h-full" />
        </Reveal>
        <Reveal delay={60}>
          <VideoCard project={wide[1]} onOpen={setActive} fill className="h-full" />
        </Reveal>
        <Reveal delay={140}>
          <VideoCard project={wide[2]} onOpen={setActive} fill className="h-full" />
        </Reveal>
        <Reveal delay={220} className="col-span-2">
          <VideoCard project={wide[3]} onOpen={setActive} fill className="h-full" />
        </Reveal>
      </div>

      <Reveal className="mt-12 text-center lg:hidden">
        <Button href="/work" variant="ghost">
          View all work
        </Button>
      </Reveal>

      <VideoLightbox project={active} onClose={() => setActive(null)} />
    </section>
  );
}
