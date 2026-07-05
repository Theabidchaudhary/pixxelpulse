import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import NicheMarquee from "@/components/sections/NicheMarquee";
import FeaturedWork from "@/components/sections/FeaturedWork";
import ServicesGrid from "@/components/sections/ServicesGrid";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import Testimonials from "@/components/sections/Testimonials";
import Accordion from "@/components/ui/Accordion";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { featuredProjects } from "@/lib/content";
import { faqs } from "@/content/faqs";
import { JsonLd, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <NicheMarquee />
      <FeaturedWork projects={featuredProjects} />
      <ServicesGrid />
      <ProcessTimeline />
      <Testimonials />

      {/* FAQ */}
      <section className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-40">
        <JsonLd data={faqJsonLd(faqs.slice(0, 4))} />
        <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <div>
            <SectionHeading
              eyebrow="FAQ"
              heading="Answers, upfront."
              lead="The questions every client asks before the first project — answered without the sales fog."
            />
            <Reveal delay={250} className="mt-9">
              <Button href="/contact" variant="ghost">
                Ask something else
              </Button>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <Accordion items={faqs.slice(0, 4)} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
