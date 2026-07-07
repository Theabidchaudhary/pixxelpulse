"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Wordmark } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[300] rounded-md bg-fg px-4 py-2 text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-0 z-[100] px-4 pt-4 sm:px-6 lg:px-8 lg:pt-5">
        {/* Floating white pill */}
        <nav
          className="relative mx-auto flex h-[60px] max-w-[1380px] items-center justify-between rounded-full bg-white px-5 shadow-[0_10px_40px_rgba(10,10,12,0.16)] sm:px-7"
          aria-label="Main"
        >
          {/* Left links */}
          <ul className="hidden items-center gap-7 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "font-display text-[0.78rem] font-bold uppercase tracking-[0.02em] transition-colors duration-300",
                    pathname.startsWith(l.href) ? "text-[#121214]" : "text-[#121214]/80 hover:text-[#121214]"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Centered wordmark (left-aligned on mobile) */}
          <Link
            href="/"
            aria-label="Orwyx — home"
            className="relative z-[130] lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2"
          >
            <Wordmark tone="dark" />
          </Link>

          {/* Right CTA */}
          <div className="hidden lg:block">
            <Link
              href="/contact"
              className="btn-sheen group inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[0.82rem] font-bold text-white shadow-[0_4px_20px_rgba(240,85,159,0.4)]"
              style={{ background: "var(--gradient-aurora)" }}
            >
              Contact us
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <path d="M4 12L12 4m0 0H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="relative z-[130] flex size-11 items-center justify-center lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="relative block h-3 w-6">
              <span
                className={cn(
                  "absolute left-0 top-0 h-[2px] w-full rounded bg-[#121214] transition-all duration-300",
                  open && "top-1/2 rotate-45"
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-[2px] w-full rounded bg-[#121214] transition-all duration-300",
                  open && "bottom-auto top-1/2 -rotate-45"
                )}
              />
            </span>
          </button>
        </nav>
      </header>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[120] flex flex-col justify-between bg-white px-8 pb-10 pt-32 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <nav aria-label="Mobile">
              <ul className="flex flex-col gap-3">
                {[{ href: "/", label: "Home" }, ...links, { href: "/blog", label: "Blog" }, { href: "/contact", label: "Contact" }].map(
                  (l, i) => (
                    <motion.li
                      key={l.href}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={l.href}
                        className="font-display text-4xl font-bold tracking-tight text-[#121214]"
                      >
                        {l.label}
                      </Link>
                    </motion.li>
                  )
                )}
              </ul>
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-label !text-[#92929b]"
            >
              Post-production that moves people.
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
