import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import InlinePlayer from "@/components/media/InlinePlayer";
import WorkRail from "@/components/sections/WorkRail";
import Reveal from "@/components/ui/Reveal";
import { Button, ArrowIcon } from "@/components/ui/Button";
import {
  featuredProjects,
  getProject,
  relatedProjects,
  FORMAT_LABELS,
} from "@/lib/content";
import { JsonLd, breadcrumbJsonLd, videoJsonLd } from "@/lib/seo";

const FORMAT_DELIVERABLES: Record<string, string[]> = {
  "short-form": ["Hook-first vertical edit", "Kinetic captions", "Sound design", "Platform-ratio exports"],
  "long-form": ["Full episode edit", "Retention pass", "Color & mix", "Chaptering & packaging"],
  motion: ["Style frames", "Animation & compositing", "Sound design", "Reusable templates"],
};

export function generateStaticParams() {
  return featuredProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.title} — ${FORMAT_LABELS[p.format]} Case Study`,
    description: `${p.title}: ${FORMAT_LABELS[p.format].toLowerCase()} work for the ${p.niches.join(", ").toLowerCase()} space, edited by Pixxelpulse.`,
    alternates: { canonical: `/work/${p.slug}` },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const related = relatedProjects(p, 4);
  const idx = featuredProjects.findIndex((x) => x.slug === p.slug);
  const next = idx >= 0 ? featuredProjects[(idx + 1) % featuredProjects.length] : featuredProjects[0];

  return (
    <article className="relative overflow-x-clip">
      <JsonLd
        data={[
          videoJsonLd(p),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
            { name: p.title, path: `/work/${p.slug}` },
          ]),
        ]}
      />
      <div
        className="glow left-1/2 top-[-200px] h-[400px] w-[700px] -translate-x-1/2 opacity-[0.15]"
        style={{ background: "var(--gradient-pulse)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1440px] px-6 pb-24 pt-[calc(var(--nav-h)+3rem)] lg:px-12 lg:pt-[calc(var(--nav-h)+4.5rem)]">
        <Reveal>
          <Link
            href="/work"
            className="group mb-10 inline-flex items-center gap-2 text-sm text-fg-soft transition-colors hover:text-fg"
          >
            <ArrowIcon className="rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0" />
            All work
          </Link>
        </Reveal>

        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <Reveal>
              <p className="text-label mb-4">
                {FORMAT_LABELS[p.format]} · {p.niches.join(" · ")}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="text-h2">{p.title}</h1>
            </Reveal>
          </div>
        </div>

        <Reveal delay={120}>
          <InlinePlayer project={p} />
        </Reveal>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-3">
          <Reveal>
            <h2 className="text-label mb-5">Format</h2>
            <p className="text-lg text-fg">{FORMAT_LABELS[p.format]}</p>
            <p className="mt-2 text-sm leading-relaxed text-fg-soft">
              {p.format === "short-form"
                ? "Vertical-native content cut for TikTok, Reels, and Shorts — hook-first pacing built for the feed."
                : p.format === "long-form"
                ? "Long-form storytelling edited for retention — pacing, sound, and structure that hold attention to the end."
                : "Design-driven animation — motion built frame by frame to make the brand feel engineered."}
            </p>
          </Reveal>
          <Reveal delay={90}>
            <h2 className="text-label mb-5">Industry</h2>
            <ul className="flex flex-wrap gap-2">
              {p.niches.map((n) => (
                <li key={n} className="rounded-full border border-line px-4 py-1.5 text-sm text-fg-soft">
                  {n}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={180}>
            <h2 className="text-label mb-5">Scope</h2>
            <ul className="space-y-2.5">
              {FORMAT_DELIVERABLES[p.format].map((d) => (
                <li key={d} className="flex items-center gap-3 text-sm text-fg-soft">
                  <span className="size-1 rounded-full bg-pulse-violet" aria-hidden />
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="playhead-rule mt-20" aria-hidden />

        <div className="mt-16 lg:mt-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-h3">Related work</h2>
            <Button href="/work" variant="text">
              View everything
            </Button>
          </div>
          <WorkRail projects={related} />
        </div>

        {/* Next project */}
        <Link
          href={`/work/${next.slug}`}
          className="group mt-20 block rounded-2xl border border-line bg-ink-900 p-8 transition-all duration-500 hover:border-line-strong lg:mt-28 lg:p-12"
        >
          <p className="text-label mb-3">Next project</p>
          <p className="flex items-center justify-between gap-6">
            <span className="text-h3">{next.title}</span>
            <ArrowIcon className="size-6 shrink-0" />
          </p>
        </Link>
      </div>
    </article>
  );
}
