import type { Metadata } from "next";
import ContactForm from "@/components/sections/ContactForm";
import Accordion from "@/components/ui/Accordion";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/content/site";
import { faqs } from "@/content/faqs";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact — Start a Project",
  description:
    "Tell us about your project and get a reply within 12 hours. Book a call or send a brief — video editing, motion design, and post-production by Pixxelpulse.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="relative overflow-x-clip">
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]),
          faqJsonLd(faqs),
        ]}
      />
      <div
        className="glow left-1/2 top-[-220px] h-[440px] w-[800px] -translate-x-1/2 opacity-[0.16]"
        style={{ background: "var(--gradient-pulse)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1440px] px-6 pb-24 pt-[calc(var(--nav-h)+3.5rem)] lg:px-12 lg:pb-36 lg:pt-[calc(var(--nav-h)+5.5rem)]">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
          <div>
            <SectionHeading
              as="h1"
              eyebrow="Contact"
              heading={
                <>
                  Let&apos;s talk about <span className="text-gradient">your footage.</span>
                </>
              }
              lead="Send the brief — the goal, the platform, the deadline. We reply within 12 hours with next steps and an honest read on fit."
            />

            <Reveal delay={200} className="mt-12 space-y-5">
              <div>
                <p className="text-label mb-2">Email</p>
                <a href={`mailto:${site.email}`} className="font-display text-xl font-medium tracking-tight text-fg transition-colors hover:text-pulse-cyan">
                  {site.email}
                </a>
              </div>
              <div>
                <p className="text-label mb-2">WhatsApp</p>
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="font-display text-xl font-medium tracking-tight text-fg transition-colors hover:text-pulse-cyan">
                  {site.phone}
                </a>
              </div>
              <div className="pt-2">
                <p className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-xs text-fg-soft">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-pulse-cyan opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-pulse-cyan" />
                  </span>
                  {site.availability}
                </p>
              </div>
            </Reveal>

            {site.bookingUrl && (
              <Reveal delay={280} className="mt-10">
                <a
                  href={site.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-3.5 text-[0.95rem] font-medium text-fg transition-all hover:border-white/40 hover:bg-white/5"
                >
                  Prefer to talk? Book a 20-min call
                </a>
              </Reveal>
            )}
          </div>

          <Reveal delay={150}>
            <div className="panel relative p-7 lg:p-10">
              <ContactForm />
            </div>
          </Reveal>
        </div>

        <div className="mx-auto mt-28 max-w-3xl lg:mt-40">
          <SectionHeading eyebrow="FAQ" heading="Quick answers first." className="mb-12" />
          <Reveal>
            <Accordion items={faqs} />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
