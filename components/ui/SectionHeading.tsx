import Reveal, { RevealText } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * Standard section opener: stacked display heading (bold sans + serif italic
 * gradient accents supplied inline) with a small lead underneath.
 * Eyebrow is optional — most sections go straight into the heading.
 */
export default function SectionHeading({
  eyebrow,
  heading,
  lead,
  align = "left",
  className,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  heading: React.ReactNode;
  lead?: string;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal>
          <p className={cn("text-label mb-5 flex items-center gap-3", align === "center" && "justify-center")}>
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Tag className="text-h2">
        <RevealText delay={80}>{heading}</RevealText>
      </Tag>
      {lead && (
        <Reveal delay={200}>
          <p className={cn("text-lead mt-5", align === "center" && "mx-auto max-w-xl")}>{lead}</p>
        </Reveal>
      )}
    </div>
  );
}
