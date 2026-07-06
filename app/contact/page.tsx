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
    <div className="relative overflow-x-clip">
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])}
      />
      {/* Dot matrix backdrop, like the reference contact page */}
      <div
        className="dot-grid absolute inset-x-0 top-0 h-[900px] opacity-50"
        style={{ maskImage: "linear-gradient(180deg, black 40%, transparent 100%)" }}
        aria-hidden
      />

      <div className="relative pb-6 pt-[calc(var(--nav-h)+3rem)] lg:pt-[calc(var(--nav-h)+4.5rem)]">
        <ContactPanel as="h1" />
      </div>

      <FaqSection />
    </div>
  );
}
