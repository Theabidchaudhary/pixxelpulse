import type { Metadata } from "next";
import ContactForm from "@/components/sections/ContactForm";
import BookingPanel from "@/components/sections/BookingPanel";
import Accordion from "@/components/ui/Accordion";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/content/site";
import { faqs } from "@/content/faqs";
import { team } from "@/content/team";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const lead = team[0];

export const metadata: Metadata = {
  title: "Contact — Start a Project",
  description:
    "Tell us about your project and get a reply within 12 hours. Book a call or send a brief — video editing, motion design, and post-production by Orvix.",
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
                  Ready for your <span className="text-gradient">dream video?</span>
                </>
              }
              lead="Book a call, message us on WhatsApp, or send a brief by email. Whatever you prefer — you'll hear back within 12 hours."
            />

            <Reveal delay={180} className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[
                "Free first consultation",
                "Free scope & quote",
                "No obligation",
                "A dedicated editor",
              ].map((line) => (
                <p key={line} className="flex items-center gap-2 text-fg-soft">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 text-pulse-cyan" aria-hidden>
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M5 8.2l2 2 4-4.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {line}
                </p>
              ))}
            </Reveal>

            <Reveal delay={260} className="panel mt-10 flex items-center gap-4 p-5">
              <span
                className="flex size-12 shrink-0 items-center justify-center rounded-full font-display text-base font-semibold text-ink-950"
                style={{ background: "var(--gradient-aurora)" }}
                aria-hidden
              >
                {lead.name[0]}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-fg">{lead.name}</p>
                <p className="text-xs text-fg-faint">{lead.role}</p>
              </div>
              <div className="ml-auto space-y-1 text-right text-xs text-fg-soft">
                <a href={`mailto:${site.email}`} className="block transition-colors hover:text-fg">
                  {site.email}
                </a>
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="block transition-colors hover:text-fg">
                  {site.phone}
                </a>
              </div>
            </Reveal>

            <Reveal delay={320} className="mt-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-xs text-fg-soft">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-pulse-cyan opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-pulse-cyan" />
                </span>
                {site.availability}
              </p>
            </Reveal>
          </div>

          <Reveal delay={150}>
            <BookingPanel />
          </Reveal>
        </div>

        <Reveal delay={100} className="mt-16 lg:mt-24">
          <div className="panel relative p-7 lg:p-10">
            <p className="text-h3 mb-8">
              Prefer to leave a <span className="text-gradient">message instead?</span>
            </p>
            <ContactForm />
          </div>
        </Reveal>

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
