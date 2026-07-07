import type { Metadata } from "next";
import PageStage from "@/components/layout/PageStage";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPost } from "@/content/posts";
import Reveal from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/Button";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", publishedTime: post.date, title: post.title, description: post.description },
  };
}

function renderBody(body: string) {
  const blocks = body.trim().split(/\n\n+/);
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="text-h3 mt-12 mb-4">
          {block.slice(3)}
        </h2>
      );
    }
    if (block.split("\n").every((l) => l.startsWith("- "))) {
      return (
        <ul key={i} className="my-6 space-y-2.5">
          {block.split("\n").map((l) => (
            <li key={l} className="flex items-start gap-3 leading-relaxed text-fg-soft">
              <span className="mt-2.5 size-1 shrink-0 rounded-full bg-pulse-violet" aria-hidden />
              {l.slice(2)}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="my-5 leading-[1.8] text-fg-soft">
        {block}
      </p>
    );
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <PageStage variant="pulse">
      <JsonLd
        data={[
          articleJsonLd(post),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <div
        className="glow left-1/2 top-[-200px] h-[400px] w-[700px] -translate-x-1/2 opacity-[0.14]"
        style={{ background: "var(--gradient-pulse)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl px-6 pb-24 pt-[calc(var(--nav-h)+3rem)] lg:pb-36 lg:pt-[calc(var(--nav-h)+4.5rem)]">
        <Reveal>
          <Link href="/blog" className="group mb-10 inline-flex items-center gap-2 text-sm text-fg-soft transition-colors hover:text-fg">
            <ArrowIcon className="rotate-180" />
            All articles
          </Link>
        </Reveal>

        <Reveal delay={60}>
          <div className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-fg-faint">
            <span className="rounded-full border border-line px-3 py-1">{post.tag}</span>
            <time dateTime={post.date}>
              {new Date(post.date + "T00:00:00Z").toLocaleDateString("en-GB", {
                day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
              })}
            </time>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
        </Reveal>

        <h1 className="text-h2">
          <Reveal delay={120}>{post.title}</Reveal>
        </h1>

        <Reveal delay={220}>
          <div className="playhead-rule mt-10 mb-4" aria-hidden />
          <div className="text-[1.05rem]">{renderBody(post.body)}</div>
        </Reveal>

        <Reveal className="mt-16">
          <Link
            href="/contact"
            className="group block rounded-2xl border border-line bg-ink-900 p-8 transition-all duration-500 hover:border-line-strong"
          >
            <p className="text-label mb-3">Put this into practice</p>
            <p className="flex items-center justify-between gap-6">
              <span className="text-h3">Let&apos;s edit your next video.</span>
              <ArrowIcon className="size-6 shrink-0" />
            </p>
          </Link>
        </Reveal>
      </div>
    </PageStage>
  );
}
