import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import HeartIntro from "@/components/sections/HeartIntro";
import NicheMarquee from "@/components/sections/NicheMarquee";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import ProvenSystem from "@/components/sections/ProvenSystem";
import DreamOutcomes from "@/components/sections/DreamOutcomes";
import StatsStrip from "@/components/sections/StatsStrip";
import FeastForEyes from "@/components/sections/FeastForEyes";
import ImpactStats from "@/components/sections/ImpactStats";
import PricingTeaser from "@/components/sections/PricingTeaser";
import QualityPromises from "@/components/sections/QualityPromises";
import ComparisonTable from "@/components/sections/ComparisonTable";
import Testimonials from "@/components/sections/Testimonials";
import ContactPanel from "@/components/sections/ContactPanel";
import FaqSection from "@/components/sections/FaqSection";
import { featuredProjects } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <HeartIntro projects={featuredProjects} />
      <NicheMarquee />
      <ProcessTimeline />
      <ProvenSystem />
      <DreamOutcomes projects={featuredProjects} />
      <StatsStrip />
      <FeastForEyes projects={featuredProjects} />
      <ImpactStats projects={featuredProjects} />
      <PricingTeaser />
      <QualityPromises />
      <ComparisonTable />
      <Testimonials />

      <section className="relative pb-10 pt-24 lg:pt-32">
        <ContactPanel />
      </section>

      <FaqSection />
    </>
  );
}
