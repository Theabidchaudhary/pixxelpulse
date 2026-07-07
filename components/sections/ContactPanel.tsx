import ContactForm from "@/components/sections/ContactForm";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/content/site";
import { team } from "@/content/team";

const lead = team[0];

const perks = ["Free first consultation", "Free scope & quote", "No strings attached", "A personal contact"];

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0 text-pulse-green" aria-hidden>
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 8.2l2 2 4-4.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoRow({ label, value, href, icon }: { label: string; value: string; href?: string; icon: React.ReactNode }) {
  const content = (
    <span className="flex items-center gap-3.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line text-fg-soft" aria-hidden>
        {icon}
      </span>
      <span>
        <span className="text-label block !text-[0.58rem]">{label}</span>
        <span className="mt-0.5 block text-sm font-medium text-fg">{value}</span>
      </span>
    </span>
  );
  if (href)
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block transition-opacity hover:opacity-80">
        {content}
      </a>
    );
  return content;
}

/**
 * The "Ready for your dream video?" block — heading + lead card on the left,
 * white direct-contact card on the right, message form panel underneath.
 * Used on both the home page and /contact.
 */
export default function ContactPanel({ as = "h2" }: { as?: "h1" | "h2" }) {
  const Tag = as;
  return (
    <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
      <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Left: heading + perks + lead card */}
        <div>
          <Reveal>
            <Tag className="text-h2">
              Ready for your
              <br />
              <span className="serif text-heart">dream video?</span>
            </Tag>
            <p className="mt-5 max-w-md text-[0.95rem] leading-[1.75] text-fg-soft">
              Message us on <strong className="font-semibold text-fg">WhatsApp</strong> or by{" "}
              <strong className="font-semibold text-fg">email</strong> — whatever you prefer. After that
              you get a <strong className="font-semibold text-fg">clear scope and quote</strong>. No
              strings attached.
            </p>
          </Reveal>

          <Reveal delay={140} className="mt-7 grid max-w-md grid-cols-2 gap-x-6 gap-y-2.5">
            {perks.map((p) => (
              <p key={p} className="flex items-center gap-2 text-[0.82rem] text-fg-soft">
                <Check />
                {p}
              </p>
            ))}
          </Reveal>

          {/* Lead card */}
          <Reveal delay={220} className="mt-9">
            <div className="max-w-md rounded-2xl border border-line bg-gradient-to-br from-ink-800 to-ink-900 p-6">
              <div className="flex items-center gap-4">
                <span
                  className="flex size-12 shrink-0 items-center justify-center rounded-full font-display text-base font-bold text-white"
                  style={{ background: "var(--gradient-aurora)" }}
                  aria-hidden
                >
                  {lead.name[0]}
                </span>
                <span>
                  <span className="block text-[0.95rem] font-bold text-fg">{lead.name}</span>
                  <span className="block text-xs text-fg-faint">{lead.role}</span>
                </span>
              </div>
              <div className="mt-6 space-y-4">
                <InfoRow
                  label="Phone · WhatsApp"
                  value={site.phone}
                  href={site.whatsapp}
                  icon={
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                      <path d="M3.5 2.5h2l1 3-1.5 1a9 9 0 004.5 4.5l1-1.5 3 1v2a1.5 1.5 0 01-1.6 1.5C6.5 13.6 2.4 9.5 2 4.1A1.5 1.5 0 013.5 2.5z" strokeLinejoin="round" />
                    </svg>
                  }
                />
                <InfoRow
                  label="Email"
                  value={site.email}
                  href={`mailto:${site.email}`}
                  icon={
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                      <rect x="1.5" y="3" width="13" height="10" rx="2" />
                      <path d="M2 4.5L8 9l6-4.5" strokeLinecap="round" />
                    </svg>
                  }
                />
                <InfoRow
                  label="Availability"
                  value={site.availability}
                  icon={
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                      <circle cx="8" cy="8" r="6.5" />
                      <path d="M8 4.5V8l2.5 1.5" strokeLinecap="round" />
                    </svg>
                  }
                />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right: white direct-contact card */}
        <Reveal delay={150}>
          <div className="band-light relative rounded-2xl bg-white p-7 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-9">
            <p className="text-center font-display text-[1.15rem] font-bold text-fg">Reach us directly</p>
            <p className="mt-2 text-center text-[0.82rem] text-fg-soft">
              Pick whatever channel you prefer — same person answers both.
            </p>

            <div className="mt-7 space-y-3.5">
              <a
                href={`mailto:${site.email}`}
                className="group flex items-center gap-4 rounded-xl border border-line bg-cream/60 p-4.5 transition-all duration-300 hover:border-line-strong hover:bg-cream"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#121214] text-white" aria-hidden>
                  <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                    <rect x="1.5" y="3" width="13" height="10" rx="2" />
                    <path d="M2 4.5L8 9l6-4.5" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-fg">Email us</span>
                  <span className="block truncate text-xs text-fg-soft">{site.email}</span>
                </span>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden className="ml-auto shrink-0 text-fg-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <path d="M4 12L12 4m0 0H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>

              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-line bg-cream/60 p-4.5 transition-all duration-300 hover:border-line-strong hover:bg-cream"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#25D366] text-white" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 1.8a8.2 8.2 0 11-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0112 3.8zm-3.1 4c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.9 2.2.9 2.6.7 3.1.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.4-.2-1.5-.7c-.2-.1-.4-.1-.5.1l-.7.8c-.1.2-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.1-.2 0-.4.1-.5l.5-.6c.1-.2.1-.3.2-.5v-.4L10 8.2c-.2-.4-.4-.4-.6-.4h-.5z" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-fg">WhatsApp us</span>
                  <span className="block truncate text-xs text-fg-soft">{site.phone}</span>
                </span>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden className="ml-auto shrink-0 text-fg-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <path d="M4 12L12 4m0 0H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <p className="mt-6 flex items-center justify-center gap-2 text-center text-[0.68rem] text-fg-faint">
              <span className="relative flex size-1.5" aria-hidden>
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-pulse-green opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-pulse-green" />
              </span>
              We reply within 12 hours — usually much faster.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Message form panel */}
      <Reveal delay={120} className="mt-14 lg:mt-20">
        <div className="relative grid gap-10 overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-ink-800/90 to-ink-900 p-7 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:p-12">
          {/* Violet corner light spreading across the panel, like the reference */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 65% at 0% 0%, rgba(139,108,246,0.3) 0%, rgba(139,108,246,0.08) 45%, transparent 70%), radial-gradient(ellipse 40% 50% at 100% 100%, rgba(240,85,159,0.12) 0%, transparent 65%)",
            }}
            aria-hidden
          />
          <div>
            <p className="text-h3">
              Prefer to leave a <span className="serif text-candy">message instead?</span>
            </p>
            <p className="mt-4 max-w-sm text-[0.9rem] leading-relaxed text-fg-soft">
              We&apos;ll get back to you within 12 hours with first ideas and a no-obligation proposal
              for your video.
            </p>
            <div className="mt-7 space-y-2.5">
              {perks.map((p) => (
                <p key={p} className="flex items-center gap-2 text-[0.82rem] text-fg-soft">
                  <Check />
                  {p}
                </p>
              ))}
            </div>
          </div>
          <ContactForm />
        </div>
      </Reveal>
    </div>
  );
}
