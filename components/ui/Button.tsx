import Link from "next/link";
import { cn } from "@/lib/utils";
import Magnetic from "@/components/ui/Magnetic";

type Variant = "primary" | "ghost" | "text";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-500 [transition-timing-function:var(--ease-pulse)] focus-visible:outline-2";

const variants: Record<Variant, string> = {
  primary:
    "bg-fg text-ink-950 px-7 py-3.5 text-[0.95rem] hover:shadow-[0_0_40px_rgba(124,106,247,0.45)] hover:-translate-y-px",
  ghost:
    "border border-line-strong px-7 py-3.5 text-[0.95rem] text-fg hover:border-white/40 hover:bg-white/5",
  text: "text-[0.95rem] text-fg-soft hover:text-fg px-1 py-1",
};

export function Button({
  href,
  variant = "primary",
  children,
  className,
  magnetic = true,
  external,
}: {
  href: string;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  magnetic?: boolean;
  external?: boolean;
}) {
  const inner = (
    <Link
      href={href}
      className={cn(base, variants[variant], className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      <ArrowIcon />
    </Link>
  );
  if (variant === "primary" && magnetic) return <Magnetic className="inline-block">{inner}</Magnetic>;
  return inner;
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cn(
        "transition-transform duration-500 [transition-timing-function:var(--ease-pulse)] group-hover:translate-x-1",
        className
      )}
    >
      <path
        d="M2 8h11m0 0L8.5 3.5M13 8l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
