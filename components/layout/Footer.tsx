import Link from "next/link";
import { site } from "@/content/site";
import GiantWordmark from "@/components/ui/GiantWordmark";

const columns: { title: string; links: { href: string; label: string; external?: boolean }[] }[] = [
  {
    title: "Studio",
    links: [
      { href: "/work", label: "Work" },
      { href: "/services", label: "Services" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="band-light sticky bottom-0 z-0 bg-cream">
      {/* Bright dot matrix across the light band, like the reference footer */}
      <div
        className="dot-grid-dark pointer-events-none absolute inset-0 opacity-60"
        style={{ maskImage: "linear-gradient(180deg, black 0%, rgba(0,0,0,0.35) 100%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1440px] px-6 pt-16 lg:px-12">
        <p className="text-right text-xs text-fg-faint">
          © {new Date().getFullYear()} {site.name} was here
        </p>

        <div className="mt-2 grid gap-10 pb-6 sm:grid-cols-3 lg:max-w-2xl">
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="font-display text-[1.05rem] font-bold text-fg transition-colors hover:text-pulse-magenta"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="font-display text-[1.05rem] font-bold text-fg">Contact</p>
            <ul className="mt-3 space-y-2.5 text-sm text-fg-soft">
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 transition-colors hover:text-fg">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <rect x="1.5" y="3" width="13" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M2 4.5L8 9l6-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  {site.email}
                </a>
              </li>
              <li>
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-fg">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3.5 2.5h2l1 3-1.5 1a9 9 0 004.5 4.5l1-1.5 3 1v2a1.5 1.5 0 01-1.6 1.5C6.5 13.6 2.4 9.5 2 4.1A1.5 1.5 0 013.5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                  </svg>
                  {site.phone}
                </a>
              </li>
              {Object.entries(site.socials).map(([k, v]) => (
                <li key={k}>
                  <a href={v} target="_blank" rel="noopener noreferrer" className="capitalize transition-colors hover:text-fg">
                    {k}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <GiantWordmark />
    </footer>
  );
}
