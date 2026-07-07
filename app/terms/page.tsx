import type { Metadata } from "next";
import PageStage from "@/components/layout/PageStage";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern working with Orwyx.",
  alternates: { canonical: "/terms" },
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <PageStage variant="warm">
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-[calc(var(--nav-h)+3.5rem)] lg:pb-36">
      <p className="text-label mb-5">Legal</p>
      <h1 className="text-h2 mb-10">Terms of Service</h1>
      <div className="space-y-6 leading-[1.8] text-fg-soft">
        <h2 className="text-h3 pt-4 text-fg">Scope of work</h2>
        <p>
          Every project begins with a written scope: deliverables, timeline, and price. Work
          outside the agreed scope is quoted separately before it starts — no surprise invoices.
        </p>
        <h2 className="text-h3 pt-4 text-fg">Revisions</h2>
        <p>
          Projects include the revision rounds stated in their scope. Revisions cover changes to
          the agreed deliverable; new creative directions are scoped as new work.
        </p>
        <h2 className="text-h3 pt-4 text-fg">Ownership</h2>
        <p>
          Upon full payment, you own the final deliverables outright. We retain the right to
          display completed work in our portfolio unless a confidentiality agreement says
          otherwise — white-label partners are never credited or displayed.
        </p>
        <h2 className="text-h3 pt-4 text-fg">Your materials</h2>
        <p>
          You confirm you have the rights to all footage, music, and assets you provide. Licensed
          assets we source for your project are licensed in your name or under licenses that
          permit your intended use.
        </p>
        <h2 className="text-h3 pt-4 text-fg">Questions</h2>
        <p>Anything unclear? Email {site.email} before starting a project.</p>
        <p className="pt-4 text-sm text-fg-faint">Last updated: July 2026</p>
      </div>
    </div>
    </PageStage>
  );
}
