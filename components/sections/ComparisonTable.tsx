import Reveal from "@/components/ui/Reveal";
import { PulseGlyph } from "@/components/ui/Logo";

const criteria = ["Speed", "Flexibility", "Quality", "Scalability", "Value"] as const;

type Row = {
  name: string;
  description: string;
  marks: boolean[];
  hero?: boolean;
  icon?: React.ReactNode;
};

const rows: Row[] = [
  {
    name: "Orvix",
    description:
      "Senior-led and built for top quality. Full results and full support, without hiring a single employee of your own.",
    marks: [true, true, true, true, true],
    hero: true,
  },
  {
    name: "In-house editor",
    description:
      "A dedicated editor keeps your brand consistent, but you risk limited range while paying for it month after month.",
    marks: [false, false, true, true, false],
    icon: <path d="M12 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM4.5 20c.8-3.3 3.9-5.5 7.5-5.5s6.7 2.2 7.5 5.5" strokeLinecap="round" />,
  },
  {
    name: "Creative agencies",
    description:
      "Agencies offer structured processes, but usually at high cost, with long timelines and little flexibility for your project.",
    marks: [false, false, true, true, false],
    icon: <path d="M4 20V8l8-4.5L20 8v12M9 20v-5h6v5M4 20h16" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    name: "Freelance",
    description:
      "Freelancers often deliver affordable work, but consistency, reliability and real collaboration are usually missing.",
    marks: [true, true, false, false, false],
    icon: <path d="M12 10a3 3 0 100-6 3 3 0 000 6zM6 20c.6-2.8 3-4.8 6-4.8s5.4 2 6 4.8" strokeLinecap="round" />,
  },
  {
    name: "DIY",
    description:
      "Editing yourself is budget-friendly, but don't expect strategic pacing or originality — and it eats your publishing time.",
    marks: [true, false, false, false, true],
    icon: <path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v7H4zM13 14h7v7h-7z" strokeLinejoin="round" />,
  },
];

function Mark({ ok }: { ok: boolean }) {
  return ok ? (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="mx-auto text-white" aria-hidden>
      <path d="M2.5 8.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="mx-auto text-[#ff6b57]" aria-hidden>
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function ComparisonTable() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-36">
      {/* Blue/purple wash at the bottom like the reference */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[-200px] h-[480px] opacity-[0.5] blur-[80px]"
        style={{ background: "radial-gradient(ellipse 55% 90% at 30% 100%, #1c4f9e 0%, transparent 70%), radial-gradient(ellipse 55% 90% at 75% 100%, #5b2f9e 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2">
            Freelancer, agency
            <br />
            or <span className="serif text-gradient">Orvix?</span>
          </h2>
          <p className="text-lead mx-auto mt-5 max-w-md">
            Every option has its price. And not just in dollars.
          </p>
        </Reveal>

        <Reveal delay={150} className="mt-14 overflow-x-auto lg:mt-20">
          <div className="min-w-[820px]">
            {/* Header */}
            <div className="grid grid-cols-[minmax(300px,1.4fr)_repeat(5,1fr)] items-center px-5 pb-4">
              <span className="text-label !text-[0.62rem]">Platform</span>
              {criteria.map((c) => (
                <span key={c} className="text-label text-center !text-[0.62rem]">
                  {c}
                </span>
              ))}
            </div>

            {/* Rows */}
            <div className="space-y-2.5">
              {rows.map((r) => (
                <div
                  key={r.name}
                  className={
                    r.hero
                      ? "grid grid-cols-[minmax(300px,1.4fr)_repeat(5,1fr)] items-center rounded-2xl border border-white/25 px-5 py-5 shadow-[0_16px_50px_rgba(76,141,255,0.3)]"
                      : "grid grid-cols-[minmax(300px,1.4fr)_repeat(5,1fr)] items-center rounded-2xl border border-line bg-ink-900/40 px-5 py-5"
                  }
                  style={
                    r.hero
                      ? { background: "linear-gradient(96deg, #2f6bdc 0%, #6d4fd8 45%, #b04fc4 75%, #d15aa8 100%)" }
                      : undefined
                  }
                >
                  <div className="flex items-center gap-4 pr-6">
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${
                        r.hero ? "border-white/40 bg-white/90" : "border-line text-fg-soft"
                      }`}
                      aria-hidden
                    >
                      {r.hero ? (
                        <PulseGlyph className="size-5" />
                      ) : (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          {r.icon}
                        </svg>
                      )}
                    </span>
                    <div>
                      <p className={`font-display text-[0.95rem] font-bold ${r.hero ? "text-white" : "text-fg"}`}>
                        {r.name}
                      </p>
                      <p className={`mt-0.5 text-[0.72rem] leading-relaxed ${r.hero ? "text-white/85" : "text-fg-faint"}`}>
                        {r.description}
                      </p>
                    </div>
                  </div>
                  {r.marks.map((ok, i) => (
                    <Mark key={i} ok={ok} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
