import { plans } from "@/content/pricing";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function PricingTeaser() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-40">
      <SectionHeading
        eyebrow="Pricing"
        heading={
          <>
            Where&apos;s the <span className="text-gradient">catch?</span> There isn&apos;t one.
          </>
        }
        lead="Three engagement models, one quality bar. Pick the one that matches how often you publish."
        align="center"
        className="mx-auto"
      />

      <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-3">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 100}>
            <div
              className={cn("panel relative flex h-full flex-col p-7 lg:p-8", p.highlighted && "border-transparent")}
              style={
                p.highlighted
                  ? {
                      backgroundImage: "linear-gradient(var(--color-ink-800), var(--color-ink-800)), var(--gradient-aurora)",
                      backgroundOrigin: "border-box",
                      backgroundClip: "padding-box, border-box",
                      border: "1px solid transparent",
                    }
                  : undefined
              }
            >
              <p className="text-label">{p.tag}</p>
              <h3 className="text-h3 mt-3">{p.name}</h3>
              <p className="mt-4 font-display text-2xl font-semibold tracking-tight text-fg">{p.price}</p>
              <p className="text-xs text-fg-faint">{p.unit}</p>
              <p className="mt-4 text-sm leading-relaxed text-fg-soft">{p.description}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={200} className="mt-12 text-center">
        <Button href="/pricing" variant="ghost">
          See full pricing & features
        </Button>
      </Reveal>
    </section>
  );
}
