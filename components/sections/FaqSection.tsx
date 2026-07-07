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
    <section className="relative pb-[calc(var(--cap)+4rem)] pt-20 lg:pt-28">
      <JsonLd data={faqJsonLd(faqs)} />
      {/* Vivid purple → pink → orange wash filling the rounded bottom, like the reference */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[-200px] h-[720px] opacity-[0.95] blur-[62px]"
        style={{
          background:
            "radial-gradient(ellipse 45% 90% at 12% 100%, #7a4ae8 0%, transparent 68%), radial-gradient(ellipse 45% 90% at 50% 100%, #e055a8 0%, transparent 68%), radial-gradient(ellipse 42% 90% at 88% 100%, #f08040 0%, transparent 68%)",
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
