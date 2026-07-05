import Reveal, { RevealText } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * Standard section opener: mono eyebrow + display heading + optional lead.
 */
export default function SectionHeading({
  eyebrow,
  heading,
  lead,
  align = "left",
  className,
  as: Tag = "h2",
}: {
  eyebrow: string;
  heading: React.ReactNode;
  lead?: string;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <Reveal>
        <p className="text-label mb-5 flex items-center gap-3">
          <span
            aria-hidden
            className="inline-block h-px w-8"
            style={{ background: "var(--gradient-pulse)" }}
          />
          {eyebrow}
        </p>
      </Reveal>
      <Tag className="text-h2">
        <RevealText delay={80}>{heading}</RevealText>
      </Tag>
      {lead && (
        <Reveal delay={200}>
          <p className={cn("text-lead mt-6", align === "center" && "mx-auto")}>{lead}</p>
        </Reveal>
      )}
    </div>
  );
}
