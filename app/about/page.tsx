import type { Metadata } from "next";
import PageStage from "@/components/layout/PageStage";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Testimonials from "@/components/sections/Testimonials";
import { Button } from "@/components/ui/Button";
import { team } from "@/content/team";
import { site } from "@/content/site";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About — The Team Behind the Edits",
  description:
    "Orvix started as one freelance editor in 2018 and grew into a full post-production team. Meet the people behind 1,300+ delivered videos.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    title: "Craft over volume",
    body: "We'd rather ship one edit that gets rewatched than ten that get skipped. Every frame earns its place — that bar doesn't move with deadline pressure.",
  },
  {
    title: "Speed is a system",
    body: "48–72 hour delivery isn't heroics, it's process: structured intake, dedicated editors, and a feedback loop designed to converge, not circle.",
  },
  {
    title: "Partners, not vendors",
    body: "We learn your audience, your voice, and your numbers. The tenth video should be meaningfully better than the first — that only happens in a real partnership.",
  },
];

export default function AboutPage() {
  return (
    <PageStage variant="teal">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />

      <header className="relative mx-auto max-w-[1440px] px-6 pt-[calc(var(--nav-h)+3.5rem)] lg:px-12 lg:pt-[calc(var(--nav-h)+5.5rem)]">
        <SectionHeading
          as="h1"
          eyebrow="About Orvix"
          heading={
            <>
              Built in the edit, <span className="text-gradient">one frame at a time.</span>
            </>
          }
          lead="Orvix started in December 2018 as one freelance editor taking on projects nobody else wanted to rush. Seven years and 1,300+ videos later, it's a full post-production team trusted by creators, startups, and brands across 40+ industries."
        />
      </header>

      {/* Story */}
      <section className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-36">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <h2 className="text-h3 max-w-md">From freelancer to agency — without losing the obsession.</h2>
          </Reveal>
          <div className="space-y-6">
            <Reveal delay={100}>
              <p className="text-lead">
                Most agencies start with a pitch deck. Ours started with deadlines: years of
                marketplace work where the only marketing was the last delivery. That history
                shaped everything — the turnaround discipline, the communication habits, and the
                belief that the work itself is the sales team.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-lead">
                Today Orvix runs as an editor-led studio: every project has a dedicated
                editor, every edit gets a second pair of eyes, and every client gets the same
                48–72 hour pulse that built our reputation.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-3 lg:mt-28 lg:gap-6">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 100}>
              <div className="panel panel-hover h-full p-7 lg:p-8">
                <p className="font-mono text-sm text-pulse-violet">0{i + 1}</p>
                <h3 className="text-h3 mt-4">{v.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-fg-soft">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-ink-900 py-24 lg:py-36">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <SectionHeading
            eyebrow="The team"
            heading="Small team. Full stack."
            lead="Editors, motion designers, and visual designers working as one pipeline — no hand-off gaps, no telephone game."
          />
          <ul className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
            {team.map((m, i) => (
              <Reveal as="li" key={m.name} delay={(i % 3) * 90}>
                <div className="panel panel-hover group p-7 lg:p-8">
                  <span
                    className="mb-6 flex size-14 items-center justify-center rounded-full font-display text-lg font-semibold text-ink-950 transition-transform duration-500 [transition-timing-function:var(--ease-pulse)] group-hover:scale-110"
                    style={{ background: "var(--gradient-pulse)" }}
                    aria-hidden
                  >
                    {m.name.split(" ").map((w) => w[0]).join("")}
                  </span>
                  <p className="font-display text-lg font-semibold tracking-tight">{m.name}</p>
                  <p className="mt-1 text-sm text-fg-faint">{m.role}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Testimonials />

      <section className="mx-auto max-w-[1440px] px-6 py-24 text-center lg:px-12 lg:py-36">
        <Reveal>
          <p className="text-label mb-6">{site.availability}</p>
          <h2 className="text-h2 mx-auto max-w-3xl">
            Your story deserves more than an edit.
          </h2>
          <div className="mt-10">
            <Button href="/contact">Start a project</Button>
          </div>
        </Reveal>
      </section>
    </PageStage>
  );
}
