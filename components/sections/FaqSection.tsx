import Accordion from "@/components/ui/Accordion";
import Reveal from "@/components/ui/Reveal";
import { faqs } from "@/content/faqs";
import { JsonLd, faqJsonLd } from "@/lib/seo";

/**
 * Two-column FAQ: open accordion stack on the left, heading + remaining
 * questions on the right, over a warm gradient wash that runs into the footer.
 */
export default function FaqSection() {
  const left = faqs.slice(0, Math.ceil(faqs.length / 2));
  const right = faqs.slice(Math.ceil(faqs.length / 2));

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <JsonLd data={faqJsonLd(faqs)} />
      {/* Purple → pink → orange wash flowing into the footer */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[-260px] h-[560px] opacity-[0.55] blur-[80px]"
        style={{
          background:
            "radial-gradient(ellipse 45% 90% at 18% 100%, #5b2f9e 0%, transparent 70%), radial-gradient(ellipse 45% 90% at 55% 100%, #a03d7c 0%, transparent 70%), radial-gradient(ellipse 40% 90% at 88% 100%, #b45f2e 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-[1240px] gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
        <Reveal className="order-2 lg:order-1">
          <Accordion items={left} />
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <h2 className="text-h2">
              Frequently asked <span className="serif text-candy">questions</span>
            </h2>
            <p className="text-lead mt-4">The most important questions and answers at a glance.</p>
          </Reveal>
          <Reveal delay={140} className="mt-9">
            <Accordion items={right} defaultOpen={null} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
