"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Wordmark } from "@/components/ui/Logo";
import Magnetic from "@/components/ui/Magnetic";
import { cn } from "@/lib/utils";

const links = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

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
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[100] transition-all duration-500",
          scrolled && !open ? "glass" : "border-b border-transparent"
        )}
      >
        <nav
          className="mx-auto flex h-[var(--nav-h)] max-w-[1440px] items-center justify-between px-6 lg:px-12"
          aria-label="Main"
        >
          <Link href="/" aria-label="Pixxelpulse — home" className="relative z-[130]">
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-9 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "text-[0.92rem] transition-colors duration-300",
                    pathname.startsWith(l.href) ? "text-fg" : "text-fg-soft hover:text-fg"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <Magnetic>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-fg px-6 py-2.5 text-[0.9rem] font-medium text-ink-950 transition-shadow duration-500 hover:shadow-[0_0_32px_rgba(124,106,247,0.45)]"
              >
                Book a call
              </Link>
            </Magnetic>
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
                  "absolute left-0 top-0 h-px w-full bg-fg transition-all duration-300",
                  open && "top-1/2 rotate-45"
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-px w-full bg-fg transition-all duration-300",
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
            className="fixed inset-0 z-[120] flex flex-col justify-between bg-ink-950/95 px-6 pb-10 pt-28 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <nav aria-label="Mobile">
              <ul className="flex flex-col gap-2">
                {[{ href: "/", label: "Home" }, ...links, { href: "/contact", label: "Contact" }].map(
                  (l, i) => (
                    <motion.li
                      key={l.href}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={l.href}
                        className="font-display text-4xl font-semibold tracking-tight text-fg"
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
              className="text-label"
            >
              Post-production that moves people.
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
