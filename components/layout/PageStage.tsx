import { cn } from "@/lib/utils";

type Variant = "violet" | "blue" | "warm" | "teal" | "pulse";

/** Per-variant top-stage color washes, mirroring the reference's section moods. */
const tops: Record<Variant, string> = {
  violet:
    "radial-gradient(ellipse 80% 640px at 50% -80px, rgba(101,58,196,0.7) 0%, rgba(64,38,130,0.35) 45%, transparent 72%), radial-gradient(ellipse 45% 560px at -4% 320px, rgba(34,84,190,0.45) 0%, transparent 70%), radial-gradient(ellipse 45% 560px at 104% 360px, rgba(120,52,170,0.4) 0%, transparent 70%)",
  blue:
    "radial-gradient(ellipse 85% 700px at 50% -80px, rgba(30,74,168,0.75) 0%, rgba(23,48,110,0.35) 45%, transparent 72%), radial-gradient(ellipse 42% 560px at 102% 240px, rgba(21,110,82,0.45) 0%, transparent 70%), radial-gradient(ellipse 38% 520px at -2% 420px, rgba(190,96,42,0.4) 0%, transparent 70%)",
  warm:
    "radial-gradient(ellipse 70% 640px at 70% -60px, rgba(128,58,42,0.6) 0%, transparent 70%), radial-gradient(ellipse 55% 560px at 10% 140px, rgba(96,36,64,0.55) 0%, transparent 70%), radial-gradient(ellipse 45% 480px at 95% 700px, rgba(96,36,64,0.3) 0%, transparent 70%)",
  teal:
    "radial-gradient(ellipse 75% 640px at 50% -80px, rgba(16,94,72,0.65) 0%, rgba(14,64,52,0.3) 45%, transparent 72%), radial-gradient(ellipse 45% 560px at -4% 320px, rgba(30,74,168,0.4) 0%, transparent 70%), radial-gradient(ellipse 42% 520px at 104% 380px, rgba(101,58,196,0.35) 0%, transparent 70%)",
  pulse:
    "radial-gradient(ellipse 70% 620px at 30% -80px, rgba(190,74,110,0.55) 0%, transparent 70%), radial-gradient(ellipse 60% 580px at 85% 60px, rgba(190,96,42,0.5) 0%, transparent 70%), radial-gradient(ellipse 50% 520px at 0% 480px, rgba(101,58,196,0.4) 0%, transparent 70%)",
};

/**
 * Dark gradient stage for the inner pages: rich Amphora-style ambient colors,
 * bright dot matrix, a colorful wash into the footer, and the rounded bottom
 * cap curving into the light footer band.
 */
export default function PageStage({
  variant = "violet",
  children,
  className,
}: {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("block-dark cap-b z-10", className)}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[1400px]"
        style={{ background: tops[variant] }}
        aria-hidden
      />
      {/* Second, softer pass of the same mood repeating down the page so the
          stage never cuts to flat black — sections blend into each other */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[380px] top-[1150px] opacity-55"
        style={{
          background: tops[variant],
          backgroundRepeat: "repeat-y",
          backgroundSize: "100% 1700px",
          filter: "blur(46px)",
        }}
        aria-hidden
      />
      {/* Colorful wash rising into the rounded bottom, flowing toward the footer */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[-200px] h-[680px] opacity-[0.85] blur-[65px]"
        style={{
          background:
            "radial-gradient(ellipse 45% 90% at 12% 100%, #7a4ae8 0%, transparent 68%), radial-gradient(ellipse 45% 90% at 50% 100%, #e055a8 0%, transparent 68%), radial-gradient(ellipse 42% 90% at 88% 100%, #f08040 0%, transparent 68%)",
        }}
        aria-hidden
      />
      <div
        className="dot-grid pointer-events-none absolute inset-x-0 top-0 h-[1000px] opacity-60"
        style={{ maskImage: "linear-gradient(180deg, black 55%, transparent 100%)" }}
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  );
}
