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
import StickyBand from "@/components/ui/StickyBand";
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
        <Hero />
        <HeartIntro projects={featuredProjects} />
      </div>

      {/* ——— Junction 1 · full-viewport cream band pinned behind; the window
             between block 1 and block 2 slides over it ——— */}
      <div className="relative z-20 mt-[-100svh]">
        <div className="band-light sticky top-0 z-0 flex h-[100svh] flex-col justify-center bg-cream">
          <div className="scroll-drift">
            <NicheMarquee />
          </div>
        </div>

        {/* ——— Block 2 · Process → Feast — deep blue stage with warm edges ——— */}
        <div className="block-dark cap-t cap-b z-10 mt-[38svh] !bg-ink-blue">
          {/* Rich blue top like the reference process stage */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[1400px]"
            style={{
              background:
                "radial-gradient(ellipse 85% 780px at 50% -80px, rgba(36,88,196,0.95) 0%, rgba(25,54,124,0.45) 45%, transparent 72%), radial-gradient(ellipse 42% 620px at 102% 240px, rgba(23,122,90,0.6) 0%, transparent 70%), radial-gradient(ellipse 38% 560px at -2% 420px, rgba(202,102,44,0.55) 0%, transparent 70%), radial-gradient(ellipse 36% 500px at 100% 950px, rgba(23,105,79,0.45) 0%, transparent 70%)",
            }}
            aria-hidden
          />
          <div
            className="dot-grid pointer-events-none absolute inset-x-0 top-0 h-[1200px] opacity-50"
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

      {/* ——— Junction 2 · tall "real impact" band: scrolls, then pins so the
             violet pricing block covers it ——— */}
      <div className="overlap-up relative z-10">
        <StickyBand>
          <ImpactStats projects={featuredProjects} />
        </StickyBand>

        {/* ——— Block 3 · Pricing → Comparison — violet nebula stage ——— */}
        <div className="block-dark cap-t cap-b overlap-up z-10">
          {/* Vivid indigo/violet filling the rounded top, like the reference */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[1100px]"
            style={{
              background:
                "radial-gradient(ellipse 80% 640px at 50% -60px, rgba(112,64,214,0.85) 0%, rgba(70,42,142,0.46) 45%, transparent 72%), radial-gradient(ellipse 45% 560px at -4% 320px, rgba(38,92,206,0.6) 0%, transparent 70%), radial-gradient(ellipse 45% 560px at 104% 360px, rgba(132,58,188,0.55) 0%, transparent 70%)",
            }}
            aria-hidden
          />
          <div
            className="dot-grid pointer-events-none absolute inset-x-0 top-0 h-[1000px] opacity-45"
            style={{ maskImage: "linear-gradient(180deg, black 60%, transparent 100%)" }}
            aria-hidden
          />
          {/* Purple/blue rise + bright blue→pink→orange pill in the rounded bottom */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[300px] rounded-full blur-lg md:blur-3xl"
            style={{
              background:
                "linear-gradient(to top, rgba(88,28,135,0.4), rgba(30,58,138,0.2) 50%, transparent)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-[-100px] left-1/2 h-[300px] w-4/5 -translate-x-1/2 rounded-full opacity-60 blur-2xl md:blur-[100px]"
            style={{
              background: "linear-gradient(90deg, #2563eb, #db2777, #f97316)",
            }}
            aria-hidden
          />
          <PricingTeaser />
          <QualityPromises />
          <ComparisonTable />
        </div>
      </div>

      {/* ——— Junction 3 · testimonials band pinned full-viewport behind the
             window between the comparison block and the contact block ——— */}
      <div className="relative z-[5] mt-[-100svh]">
        <div className="band-light sticky top-0 z-0 flex h-[100svh] flex-col justify-center bg-cream">
          <div className="scroll-drift">
            <Testimonials />
          </div>
        </div>

        {/* ——— Block 4 · Contact + FAQ — warm maroon stage, rounds into footer ——— */}
        <div className="block-dark cap-t cap-b z-10 mt-[38svh]">
          {/* Warm rust/maroon top like the reference contact block */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[1100px]"
            style={{
              background:
                "radial-gradient(ellipse 70% 620px at 72% -40px, rgba(142,64,46,0.7) 0%, transparent 70%), radial-gradient(ellipse 55% 560px at 12% 120px, rgba(110,42,74,0.65) 0%, transparent 70%), radial-gradient(ellipse 45% 480px at 96% 620px, rgba(110,42,74,0.4) 0%, transparent 70%)",
            }}
            aria-hidden
          />
          <div
            className="dot-grid pointer-events-none absolute inset-0 opacity-45"
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
