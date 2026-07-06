import Link from "next/link";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { PulseGlyph } from "@/components/ui/Logo";
import Reveal from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/Button";
import GiantWordmark from "@/components/ui/GiantWordmark";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-900">
      <div
        className="glow left-1/2 top-[-200px] h-[420px] w-[720px] -translate-x-1/2 opacity-20"
        style={{ background: "var(--gradient-pulse)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1440px] px-6 py-20 lg:px-12 lg:py-28">
        <Reveal>
          <Link href="/contact" className="group block max-w-4xl">
            <p className="text-label mb-6">Next step</p>
            <p className="text-h2">
              Let&apos;s make something people{" "}
              <span className="text-gradient">watch twice.</span>
            </p>
            <span className="mt-8 inline-flex items-center gap-3 text-lg text-fg-soft transition-colors group-hover:text-fg">
              Start a project <ArrowIcon className="size-5" />
            </span>
          </Link>
        </Reveal>

        <div className="playhead-rule mt-16 lg:mt-24" aria-hidden />

        <div className="mt-14 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <PulseGlyph className="size-8" />
              <span className="font-display text-lg font-semibold lowercase tracking-tight">
                orvix
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-soft">
              A premium video editing and motion design agency for creators, startups, and brands
              — since {site.foundingYear}.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-xs text-fg-soft">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-pulse-cyan opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-pulse-cyan" />
              </span>
              {site.availability}
            </p>
          </div>

          <nav aria-label="Services">
            <p className="text-label mb-5">Services</p>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-fg-soft transition-colors hover:text-fg"
                  >
                    {s.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <p className="text-label mb-5">Company</p>
            <ul className="space-y-3">
              {[
                { href: "/work", label: "Work" },
                { href: "/about", label: "About" },
                { href: "/pricing", label: "Pricing" },
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-fg-soft transition-colors hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-label mb-5">Connect</p>
            <ul className="space-y-3">
              <li>
                <a href={`mailto:${site.email}`} className="text-sm text-fg-soft transition-colors hover:text-fg">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm text-fg-soft transition-colors hover:text-fg">
                  WhatsApp
                </a>
              </li>
              {Object.entries(site.socials).map(([k, v]) => (
                <li key={k}>
                  <a
                    href={v}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm capitalize text-fg-soft transition-colors hover:text-fg"
                  >
                    {k}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <GiantWordmark />

        <div className="mt-4 flex flex-col gap-4 border-t border-line pt-8 text-xs text-fg-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Orvix. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-fg-soft">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-fg-soft">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
