import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const rows = [
  { label: "Turnaround", freelancer: "Whenever they're free", inhouse: "Fast, if fully staffed", orvix: "48–72h, committed" },
  { label: "Cost predictability", freelancer: "Varies project to project", inhouse: "Salary + tools + downtime", orvix: "Flat, quoted upfront" },
  { label: "Quality consistency", freelancer: "Depends who you find", inhouse: "One editor's ceiling", orvix: "Locked style system" },
  { label: "Creative range", freelancer: "One person's skillset", inhouse: "One person's skillset", orvix: "Full pod: edit, sound, motion" },
  { label: "Scales with you", freelancer: "Booked out fast", inhouse: "Hire another salary", orvix: "Add capacity same week" },
];

const columns: { key: "freelancer" | "inhouse" | "orvix"; label: string; highlight?: boolean }[] = [
  { key: "freelancer", label: "Freelancer" },
  { key: "inhouse", label: "In-house editor" },
  { key: "orvix", label: "Orvix", highlight: true },
];

export default function ComparisonTable() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 lg:py-40">
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
        <SectionHeading
          eyebrow="The alternative"
          heading={
            <>
              Freelancer, in-house editor, <span className="text-gradient">or Orvix?</span>
            </>
          }
          lead="Every option can produce a good video once. Only one produces it every week, on schedule, at one price."
          align="center"
          className="mx-auto"
        />

        <Reveal delay={150} className="mt-16 overflow-x-auto lg:mt-20">
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-1/4" />
                {columns.map((c) => (
                  <th
                    key={c.key}
                    className={cn(
                      "px-4 pb-5 text-left font-display text-base font-semibold tracking-tight",
                      c.highlight ? "text-fg" : "text-fg-soft"
                    )}
                  >
                    {c.highlight && (
                      <span className="mr-2 inline-block size-1.5 rounded-full" style={{ background: "var(--gradient-aurora)" }} aria-hidden />
                    )}
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.label} className="border-t border-line">
                  <td className="py-5 pr-4 text-sm text-fg-soft">{r.label}</td>
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        "px-4 py-5 text-sm",
                        c.highlight ? "font-medium text-fg" : "text-fg-faint",
                        c.highlight && i === 0 && "rounded-t-xl",
                        c.highlight && i === rows.length - 1 && "rounded-b-xl"
                      )}
                      style={c.highlight ? { background: "rgba(124,106,247,0.08)" } : undefined}
                    >
                      {r[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}
