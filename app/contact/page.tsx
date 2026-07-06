import type { Metadata } from "next";
import ContactPanel from "@/components/sections/ContactPanel";
import FaqSection from "@/components/sections/FaqSection";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact — Start a Project",
  description:
    "Tell us about your project and get a reply within 12 hours. Email or WhatsApp — video editing, motion design, and post-production by Orvix.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="block-dark cap-b z-10">
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])}
      />
      {/* Warm rust/maroon stage like the reference contact page */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[1200px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 640px at 70% -60px, rgba(128,58,42,0.6) 0%, transparent 70%), radial-gradient(ellipse 55% 560px at 10% 140px, rgba(96,36,64,0.55) 0%, transparent 70%), radial-gradient(ellipse 45% 480px at 95% 700px, rgba(96,36,64,0.35) 0%, transparent 70%)",
        }}
        aria-hidden
      />
      {/* Bright dot matrix backdrop */}
      <div
        className="dot-grid absolute inset-x-0 top-0 h-[1100px] opacity-70"
        style={{ maskImage: "linear-gradient(180deg, black 55%, transparent 100%)" }}
        aria-hidden
      />
      {/* Purple/pink/orange wash flowing into the footer */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[-200px] h-[680px] opacity-[0.85] blur-[70px]"
        style={{
          background:
            "radial-gradient(ellipse 45% 90% at 12% 100%, #6d3fd4 0%, transparent 68%), radial-gradient(ellipse 45% 90% at 50% 100%, #d14a9a 0%, transparent 68%), radial-gradient(ellipse 42% 90% at 88% 100%, #e07038 0%, transparent 68%)",
        }}
        aria-hidden
      />

      <div className="relative pb-6 pt-[calc(var(--nav-h)+3rem)] lg:pt-[calc(var(--nav-h)+4.5rem)]">
        <ContactPanel as="h1" />
      </div>

      <FaqSection />
    </div>
  );
}
