import Link from "next/link";
import { cn } from "@/lib/utils";
import Magnetic from "@/components/ui/Magnetic";

type Variant = "primary" | "ghost" | "text";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-500 [transition-timing-function:var(--ease-pulse)] focus-visible:outline-2";

const variants: Record<Variant, string> = {
  primary:
    "px-7 py-3.5 text-[0.9rem] text-white shadow-[0_0_28px_rgba(240,85,159,0.35)] hover:shadow-[0_0_44px_rgba(240,85,159,0.55)] hover:-translate-y-px",
  ghost:
    "border border-line-strong bg-white/[0.03] px-7 py-3.5 text-[0.9rem] text-fg hover:border-white/40 hover:bg-white/10",
  text: "text-[0.9rem] text-fg-soft hover:text-fg px-1 py-1",
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
      style={variant === "primary" ? { background: "var(--gradient-aurora)" } : undefined}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      <ArrowIcon />
    </Link>
  );
  if (variant === "primary" && magnetic) return <Magnetic className="inline-block">{inner}</Magnetic>;
  return inner;
}

/** Diagonal ↗ arrow used on every CTA. */
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cn(
        "transition-transform duration-500 [transition-timing-function:var(--ease-pulse)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
        className
      )}
    >
      <path
        d="M4 12L12 4m0 0H5.5M12 4v6.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
