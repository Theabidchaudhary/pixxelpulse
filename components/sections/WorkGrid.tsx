"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import type { Project, ProjectFormat } from "@/lib/content";
import { FORMAT_LABELS } from "@/lib/content";
import VideoCard from "@/components/media/VideoCard";
import VideoLightbox from "@/components/media/VideoLightbox";
import { cn } from "@/lib/utils";

const PAGE = 18;
const FORMATS: (ProjectFormat | "all")[] = ["all", "short-form", "long-form", "motion"];

export default function WorkGrid({
  projects,
  niches,
}: {
  projects: Project[];
  niches: string[];
}) {
  const params = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const format = (params.get("format") ?? "all") as ProjectFormat | "all";
  const niche = params.get("niche") ?? "all";
  const [limit, setLimit] = useState(PAGE);
  const [active, setActive] = useState<Project | null>(null);

  const setFilter = (key: "format" | "niche", value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value === "all") next.delete(key);
    else next.set(key, value);
    setLimit(PAGE);
    startTransition(() =>
      router.replace(`/work${next.size ? `?${next}` : ""}`, { scroll: false })
    );
  };

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (format === "all" || p.format === format) &&
          (niche === "all" || p.niches.includes(niche))
      ),
    [projects, format, niche]
  );

  const visible = filtered.slice(0, limit);

  return (
    <div>
      {/* Filter bar */}
      <div className="sticky top-[var(--nav-h)] z-40 -mx-6 mb-10 border-b border-line bg-ink-950/85 px-6 py-4 backdrop-blur-xl lg:-mx-12 lg:px-12">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by format">
            {FORMATS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter("format", f)}
                aria-pressed={format === f}
                className={cn(
                  "rounded-full border px-4.5 py-2 text-[0.85rem] font-medium transition-all duration-300",
                  format === f
                    ? "border-transparent bg-fg text-ink-950"
                    : "border-line text-fg-soft hover:border-line-strong hover:text-fg"
                )}
              >
                {f === "all" ? "All work" : FORMAT_LABELS[f]}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-4">
            <label className="sr-only" htmlFor="niche-filter">
              Filter by industry
            </label>
            <select
              id="niche-filter"
              value={niche}
              onChange={(e) => setFilter("niche", e.target.value)}
              className="rounded-full border border-line bg-ink-900 px-4 py-2 text-[0.85rem] text-fg-soft outline-none transition-colors hover:border-line-strong focus:border-pulse-blue"
            >
              <option value="all">All industries</option>
              {niches.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <p className="hidden font-mono text-xs text-fg-faint sm:block" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? "project" : "projects"}
            </p>
          </div>
        </div>
      </div>

      {/* Grid — fixed row tracks + dense flow so 9:16 and 16:9 pack cleanly */}
      <LayoutGroup>
        <div className="grid grid-flow-dense grid-cols-2 auto-rows-[150px] gap-4 sm:grid-cols-3 sm:auto-rows-[170px] md:gap-6 lg:grid-cols-4 lg:auto-rows-[200px]">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <VideoCard
                key={p.slug}
                project={p}
                onOpen={setActive}
                eager={i < 4}
                fill
                className={p.format === "short-form" ? "row-span-2" : "row-span-1"}
              />
            ))}
          </AnimatePresence>
        </div>
      </LayoutGroup>

      {filtered.length === 0 && (
        <p className="py-24 text-center text-fg-soft">
          Nothing in that combination yet — try a different format or industry.
        </p>
      )}

      {limit < filtered.length && (
        <div className="mt-14 text-center">
          <button
            onClick={() => setLimit((l) => l + PAGE)}
            className="rounded-full border border-line-strong px-8 py-3.5 text-[0.95rem] font-medium text-fg transition-all duration-500 hover:border-white/40 hover:bg-white/5"
          >
            Load more ({filtered.length - limit} remaining)
          </button>
        </div>
      )}

      <VideoLightbox project={active} onClose={() => setActive(null)} />
    </div>
  );
}
