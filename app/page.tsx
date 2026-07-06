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
      {/* ——— Block 1 · Hero + Heart — one continuous dark gradient, rounds
             into the marquee band below ——— */}
      <div className="block-dark cap-b z-30">
        {/* Aurora junction between the hero fold and the heart section */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[78svh] h-[520px] opacity-[0.4] blur-[110px]"
          style={{
            background:
              "radial-gradient(ellipse 40% 90% at 12% 50%, #3d63d8 0%, transparent 70%), radial-gradient(ellipse 42% 90% at 42% 55%, #8b3d9e 0%, transparent 70%), radial-gradient(ellipse 42% 90% at 68% 50%, #d84a86 0%, transparent 70%), radial-gradient(ellipse 40% 90% at 94% 55%, #d8703a 0%, transparent 70%)",
          }}
          aria-hidden
        />
        <Hero />
        <HeartIntro projects={featuredProjects} />
      </div>

      {/* ——— Marquee band, pinned beneath Block 2 (scroll cover effect) ——— */}
      <div className="overlap-up relative z-20">
        <div className="sticky top-0 z-0">
          <NicheMarquee />
        </div>

        {/* ——— Block 2 · Process → Feast — deep blue stage with warm edges ——— */}
        <div className="block-dark cap-t cap-b overlap-up z-10">
          {/* Rich blue top like the reference process stage */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[1400px]"
            style={{
              background:
                "radial-gradient(ellipse 85% 780px at 50% -80px, rgba(30,74,168,0.85) 0%, rgba(23,48,110,0.4) 45%, transparent 72%), radial-gradient(ellipse 42% 620px at 102% 240px, rgba(21,110,82,0.55) 0%, transparent 70%), radial-gradient(ellipse 38% 560px at -2% 420px, rgba(190,96,42,0.5) 0%, transparent 70%), radial-gradient(ellipse 36% 500px at 100% 950px, rgba(23,105,79,0.4) 0%, transparent 70%)",
            }}
            aria-hidden
          />
          <div
            className="dot-grid pointer-events-none absolute inset-x-0 top-0 h-[1200px] opacity-45"
            style={{ maskImage: "linear-gradient(180deg, black 55%, transparent 100%)" }}
            aria-hidden
          />
          <ProcessTimeline />
          <ProvenSystem />
          <DreamOutcomes projects={featuredProjects} />
          <StatsStrip />
          <FeastForEyes projects={featuredProjects} />
        </div>
      </div>

      {/* ——— Light band · real impact (tall, plain flow) ——— */}
      <div className="overlap-up relative z-10">
        <ImpactStats projects={featuredProjects} />
      </div>

      {/* ——— Block 3 · Pricing → Comparison — violet nebula stage ——— */}
      <div className="block-dark cap-t cap-b overlap-up z-20">
        {/* Vivid indigo/violet filling the rounded top, like the reference */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[1100px]"
          style={{
            background:
              "radial-gradient(ellipse 80% 640px at 50% -60px, rgba(101,58,196,0.8) 0%, rgba(64,38,130,0.42) 45%, transparent 72%), radial-gradient(ellipse 45% 560px at -4% 320px, rgba(34,84,190,0.55) 0%, transparent 70%), radial-gradient(ellipse 45% 560px at 104% 360px, rgba(120,52,170,0.5) 0%, transparent 70%)",
          }}
          aria-hidden
        />
        <div
          className="dot-grid pointer-events-none absolute inset-x-0 top-0 h-[1000px] opacity-40"
          style={{ maskImage: "linear-gradient(180deg, black 60%, transparent 100%)" }}
          aria-hidden
        />
        {/* Blue→purple glow rising into the rounded bottom, like the reference */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-[-160px] h-[720px] opacity-[0.75] blur-[70px]"
          style={{
            background:
              "radial-gradient(ellipse 55% 85% at 18% 100%, #2456c4 0%, transparent 68%), radial-gradient(ellipse 55% 85% at 78% 100%, #7a3fd4 0%, transparent 68%)",
          }}
          aria-hidden
        />
        <PricingTeaser />
        <QualityPromises />
        <ComparisonTable />
      </div>

      {/* ——— Testimonials band, pinned beneath Block 4 ——— */}
      <div className="overlap-up relative z-10">
        <div className="sticky top-0 z-0">
          <Testimonials />
        </div>

        {/* ——— Block 4 · Contact + FAQ — warm maroon stage, rounds into footer ——— */}
        <div className="block-dark cap-t cap-b overlap-up z-10">
          {/* Warm rust/maroon top like the reference contact block */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[1100px]"
            style={{
              background:
                "radial-gradient(ellipse 70% 620px at 72% -40px, rgba(128,58,42,0.6) 0%, transparent 70%), radial-gradient(ellipse 55% 560px at 12% 120px, rgba(96,36,64,0.55) 0%, transparent 70%), radial-gradient(ellipse 45% 480px at 96% 620px, rgba(96,36,64,0.35) 0%, transparent 70%)",
            }}
            aria-hidden
          />
          <div
            className="dot-grid pointer-events-none absolute inset-0 opacity-40"
            style={{ maskImage: "linear-gradient(180deg, black 30%, rgba(0,0,0,0.5) 70%, transparent 100%)" }}
            aria-hidden
          />
          <section className="relative pb-6 pt-20 lg:pt-28">
            <ContactPanel />
          </section>
          <FaqSection />
        </div>
      </div>
    </>
  );
}
