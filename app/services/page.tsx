import type { Metadata } from "next";
import ServicesGrid from "@/components/sections/ServicesGrid";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Services — Video Editing, Motion Design & Post-Production",
  description:
    "Six post-production services under one roof: short-form editing, YouTube long-form, motion design, video ads, podcast post, and white-label agency partnerships.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="relative overflow-x-clip">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />
      <div
        className="glow left-1/2 top-[-220px] h-[440px] w-[800px] -translate-x-1/2 opacity-[0.16]"
        style={{ background: "var(--gradient-pulse)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1440px] px-6 pt-[calc(var(--nav-h)+3.5rem)] lg:px-12 lg:pt-[calc(var(--nav-h)+5.5rem)]">
        <SectionHeading
          as="h1"
          eyebrow="Services"
          heading={
            <>
              Everything after the <span className="text-gradient">record button.</span>
            </>
          }
          lead="From a single hero video to a full monthly content engine — six disciplines run by one team, on one quality bar."
          className="mb-6"
        />
        <Reveal delay={200} className="mb-4">
          <Button href="/contact">Book a call</Button>
        </Reveal>
      </div>
      <ServicesGrid />
      <ProcessTimeline />
    </div>
  );
}
