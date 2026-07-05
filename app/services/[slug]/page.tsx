import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, getService } from "@/content/services";
import { projects } from "@/lib/content";
import WorkRail from "@/components/sections/WorkRail";
import Accordion from "@/components/ui/Accordion";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return {
    title: s.seo.title,
    description: s.seo.description,
    alternates: { canonical: `/services/${s.slug}` },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const proof = projects
    .filter(
      (p) =>
        (s.proof.formats?.includes(p.format) ?? false) ||
        (s.proof.niches?.some((n) => p.niches.includes(n)) ?? false)
    )
    .slice(0, 4);

  const idx = services.findIndex((x) => x.slug === s.slug);
  const next = services[(idx + 1) % services.length];

  return (
    <article className="relative overflow-x-clip">
      <JsonLd
        data={[
          serviceJsonLd(s),
          faqJsonLd(s.faqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: s.title, path: `/services/${s.slug}` },
          ]),
        ]}
      />
      <div
        className="glow left-1/2 top-[-220px] h-[440px] w-[800px] -translate-x-1/2 opacity-[0.16]"
        style={{ background: "var(--gradient-pulse)" }}
        aria-hidden
      />

      {/* Hero */}
      <header className="relative mx-auto max-w-[1440px] px-6 pt-[calc(var(--nav-h)+3.5rem)] lg:px-12 lg:pt-[calc(var(--nav-h)+5.5rem)]">
        <SectionHeading as="h1" eyebrow={s.heroEyebrow} heading={s.heroHeading} lead={s.heroSub} />
        <Reveal delay={250} className="mt-10 flex flex-wrap gap-4">
          <Button href="/contact">Book a call</Button>
          <Button href="/pricing" variant="ghost">
            See pricing
          </Button>
        </Reveal>
      </header>

      {/* Pain + deliverables */}
      <section className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-36">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-24">
          <div>
            <Reveal>
              <h2 className="text-h3 max-w-md">{s.pain.heading}</h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-lead mt-6 max-w-lg">{s.pain.body}</p>
            </Reveal>
          </div>
          <Reveal delay={150}>
            <h3 className="text-label mb-6">What&apos;s included</h3>
            <ul className="divide-y divide-line border-y border-line">
              {s.deliverables.map((d, i) => (
                <li key={d} className="flex items-center gap-5 py-4">
                  <span className="font-mono text-xs text-pulse-violet">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-fg">{d}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="bg-ink-900 py-24 lg:py-36">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <SectionHeading eyebrow="How it runs" heading="A system, not a scramble." />
          <ol className="relative mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <div className="playhead-rule absolute -top-8 left-0 hidden w-full lg:block" aria-hidden />
            {s.process.map((step, i) => (
              <Reveal as="li" key={step.step} delay={i * 100}>
                <p className="font-mono text-sm text-pulse-violet">0{i + 1}</p>
                <h3 className="text-h3 mt-3">{step.step}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-fg-soft">{step.detail}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Proof */}
      {proof.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-36">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Proof" heading="Work from this service." />
            <Reveal delay={150}>
              <Button href="/work" variant="text">
                View all work
              </Button>
            </Reveal>
          </div>
          <WorkRail projects={proof} />
        </section>
      )}

      {/* FAQ */}
      <section className="mx-auto max-w-[1440px] px-6 pb-24 lg:px-12 lg:pb-36">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <SectionHeading eyebrow="FAQ" heading="Before you ask." />
          <Reveal delay={120}>
            <Accordion items={s.faqs} />
          </Reveal>
        </div>

        <Link
          href={`/services/${next.slug}`}
          className="group mt-24 block rounded-2xl border border-line bg-ink-900 p-8 transition-all duration-500 hover:border-line-strong lg:p-12"
        >
          <p className="text-label mb-3">Next service</p>
          <p className="flex items-center justify-between gap-6">
            <span className="text-h3">{next.title}</span>
            <ArrowIcon className="size-6 shrink-0" />
          </p>
        </Link>
      </section>
    </article>
  );
}
