import type { Metadata } from "next";
import PageStage from "@/components/layout/PageStage";
import { plans } from "@/content/pricing";
import { faqs } from "@/content/faqs";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Accordion from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Pricing — Video Editing Subscriptions & Project Rates",
  description:
    "Three ways to work with Orwyx: per-project quotes, monthly video editing subscriptions, and white-label agency retainers. 48–72h turnaround standard.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <PageStage variant="violet">
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }]),
          faqJsonLd(faqs),
        ]}
      />
      <div className="relative mx-auto max-w-[1440px] px-6 pb-24 pt-[calc(var(--nav-h)+3.5rem)] lg:px-12 lg:pb-36 lg:pt-[calc(var(--nav-h)+5.5rem)]">
        <SectionHeading
          as="h1"
          eyebrow="Pricing"
          heading={
            <>
              Simple models. <span className="text-gradient">Serious output.</span>
            </>
          }
          lead="Pick the engagement that matches how you publish. Every model ships with the same editors, the same quality bar, and the same 48–72h rhythm."
          align="center"
          className="mb-16 lg:mb-24"
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 110}>
              <div
                className={cn(
                  "panel relative flex h-full flex-col p-8 lg:p-10",
                  p.highlighted && "border-transparent"
                )}
                style={
                  p.highlighted
                    ? {
                        backgroundImage:
                          "linear-gradient(var(--color-ink-800), var(--color-ink-800)), var(--gradient-pulse)",
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, border-box",
                        border: "1px solid transparent",
                      }
                    : undefined
                }
              >
                {p.highlighted && (
                  <span className="absolute -top-3.5 left-8 rounded-full px-3.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ink-950" style={{ background: "var(--gradient-pulse)" }}>
                    Most booked
                  </span>
                )}
                <p className="text-label mb-2">{p.tag}</p>
                <h2 className="text-h3">{p.name}</h2>
                <p className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-4xl font-semibold tracking-tight">{p.price}</span>
                  <span className="text-sm text-fg-faint">/ {p.unit}</span>
                </p>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-fg-soft">{p.description}</p>
                <ul className="mt-8 space-y-3.5 border-t border-line pt-8">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-fg-soft">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0 text-pulse-cyan" aria-hidden>
                        <path d="M13.5 4.5l-7 7L3 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-10">
                  <Button
                    href="/contact"
                    variant={p.highlighted ? "primary" : "ghost"}
                    className="w-full"
                    magnetic={false}
                  >
                    {p.cta}
                  </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-16 max-w-2xl text-center">
          <p className="text-sm leading-relaxed text-fg-faint">
            Every engagement includes revision rounds, platform-ready exports, and full ownership
            of your masters. Not sure which fits? A 20-minute call sorts it.
          </p>
        </Reveal>

        <div className="mx-auto mt-24 max-w-3xl lg:mt-36">
          <SectionHeading eyebrow="FAQ" heading="The details." className="mb-12" />
          <Reveal>
            <Accordion items={faqs} />
          </Reveal>
        </div>
      </div>
    </PageStage>
  );
}
