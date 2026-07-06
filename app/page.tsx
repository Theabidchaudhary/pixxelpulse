import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import NicheMarquee from "@/components/sections/NicheMarquee";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import ProvenSystem from "@/components/sections/ProvenSystem";
import DreamOutcomes from "@/components/sections/DreamOutcomes";
import ServicesGrid from "@/components/sections/ServicesGrid";
import StatsStrip from "@/components/sections/StatsStrip";
import FeastForEyes from "@/components/sections/FeastForEyes";
import ImpactStats from "@/components/sections/ImpactStats";
import PricingTeaser from "@/components/sections/PricingTeaser";
import QualityPromises from "@/components/sections/QualityPromises";
import ComparisonTable from "@/components/sections/ComparisonTable";
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
      <ProcessTimeline />
      <ProvenSystem />
      <DreamOutcomes projects={featuredProjects} />
      <ServicesGrid />
      <StatsStrip />
      <FeastForEyes projects={featuredProjects} />
      <ImpactStats />
      <PricingTeaser />
      <QualityPromises />
      <ComparisonTable />
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
