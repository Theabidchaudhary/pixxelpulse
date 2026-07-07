import type { Metadata } from "next";
import PageStage from "@/components/layout/PageStage";
import Link from "next/link";
import { posts } from "@/content/posts";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/Button";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Insights — Video Editing, Retention & Content Strategy",
  description:
    "Practical writing on video editing, YouTube retention, short-form strategy, and running a modern content pipeline — from the Orwyx team.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <PageStage variant="pulse">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])} />
      <div className="relative mx-auto max-w-[1440px] px-6 pb-24 pt-[calc(var(--nav-h)+3.5rem)] lg:px-12 lg:pb-36 lg:pt-[calc(var(--nav-h)+5.5rem)]">
        <SectionHeading
          as="h1"
          eyebrow="Insights"
          heading={
            <>
              Notes from the <span className="text-gradient">timeline.</span>
            </>
          }
          lead="What we learn shipping video every day — retention, pacing, process, and the craft behind content that performs."
          className="mb-16 lg:mb-24"
        />

        <div className="grid gap-6 md:grid-cols-2">
          {sorted.map((p, i) => (
            <Reveal key={p.slug} delay={i * 100}>
              <Link href={`/blog/${p.slug}`} className="panel panel-hover group flex h-full flex-col p-8 lg:p-10">
                <div className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-fg-faint">
                  <span className="rounded-full border border-line px-3 py-1">{p.tag}</span>
                  <time dateTime={p.date}>
                    {new Date(p.date + "T00:00:00Z").toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
                    })}
                  </time>
                  <span>·</span>
                  <span>{p.readingTime}</span>
                </div>
                <h2 className="text-h3 transition-colors duration-300 group-hover:text-white">{p.title}</h2>
                <p className="mt-4 leading-relaxed text-fg-soft">{p.description}</p>
                <span className="mt-auto flex items-center gap-2 pt-8 text-sm text-fg-faint transition-colors duration-500 group-hover:text-fg">
                  Read article <ArrowIcon />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </PageStage>
  );
}
