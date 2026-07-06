import type { Project } from "@/lib/content";
import { projectThumb } from "@/lib/content";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const outcomes = [
  {
    heading: "Hook viewers in the first second.",
    body: "The first frame decides whether they stay. We build every cut backwards from the strongest moment in your footage.",
  },
  {
    heading: "Keep them watching to the end.",
    body: "Pacing, sound design, and caption rhythm tuned so retention holds — not just the hook, the whole watch.",
  },
  {
    heading: "Turn views into followers and clients.",
    body: "Clear calls-to-action and on-brand captions that convert attention into a following you can actually monetize.",
  },
  {
    heading: "Make you look consistent, everywhere.",
    body: "One visual language across every platform — so your channel looks like a brand, not a pile of one-offs.",
  },
];

export default function DreamOutcomes({ projects }: { projects: Project[] }) {
  const shots = projects.slice(0, outcomes.length);

  return (
    <section className="relative mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-40">
      <SectionHeading
        eyebrow="Why it matters"
        heading={
          <>
            What should your <span className="text-gradient">dream video</span> do?
          </>
        }
        lead="Editing is a means to an end. Here's what a properly-edited video should be doing for you."
        align="center"
        className="mx-auto"
      />

      <div className="mt-16 space-y-16 lg:mt-24 lg:space-y-24">
        {outcomes.map((o, i) => {
          const project = shots[i];
          const reverse = i % 2 === 1;
          return (
            <div
              key={o.heading}
              className={cn(
                "grid items-center gap-8 lg:grid-cols-2 lg:gap-16",
                reverse && "lg:[&>*:first-child]:order-2"
              )}
            >
              <Reveal className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-ink-800">
                {project && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={projectThumb(project)}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 font-mono text-xs uppercase tracking-[0.14em] text-fg-soft">
                  0{i + 1}
                </span>
              </Reveal>
              <Reveal delay={120}>
                <h3 className="text-h3 max-w-md">{o.heading}</h3>
                <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-fg-soft">{o.body}</p>
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
