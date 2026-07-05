import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Orvix collects, uses, and protects your information.",
  alternates: { canonical: "/privacy" },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-[calc(var(--nav-h)+3.5rem)] lg:pb-36">
      <p className="text-label mb-5">Legal</p>
      <h1 className="text-h2 mb-10">Privacy Policy</h1>
      <div className="space-y-6 leading-[1.8] text-fg-soft">
        <p>
          Orvix (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy
          explains what we collect through {site.url} and why.
        </p>
        <h2 className="text-h3 pt-4 text-fg">What we collect</h2>
        <p>
          When you contact us we collect the details you provide: your name, email address, and
          project information. We use standard, privacy-respecting analytics to understand how the
          site is used (pages visited, approximate region, device type) — never to identify you
          personally.
        </p>
        <h2 className="text-h3 pt-4 text-fg">How we use it</h2>
        <p>
          Contact details are used solely to respond to your inquiry and manage projects you hire
          us for. We do not sell, rent, or share your information with third parties for
          marketing.
        </p>
        <h2 className="text-h3 pt-4 text-fg">Embedded video</h2>
        <p>
          Portfolio videos are embedded from YouTube in privacy-enhanced mode
          (youtube-nocookie.com). YouTube only sets cookies once you actively play a video, and
          its own privacy policy applies from that point.
        </p>
        <h2 className="text-h3 pt-4 text-fg">Your rights</h2>
        <p>
          You can request a copy or deletion of any personal data we hold about you at any time by
          emailing {site.email}.
        </p>
        <p className="pt-4 text-sm text-fg-faint">Last updated: July 2026</p>
      </div>
    </div>
  );
}
