import type { Metadata } from "next";
import PageStage from "@/components/layout/PageStage";
import { Suspense } from "react";
import WorkGrid from "@/components/sections/WorkGrid";
import SectionHeading from "@/components/ui/SectionHeading";
import { projects, allNiches } from "@/lib/content";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Work — Video Editing & Motion Design Portfolio",
  description:
    "165+ published projects across short-form, long-form, and motion design — YouTube videos, Reels, ads, documentaries, and brand animation by Orwyx.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <PageStage variant="violet">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Work", path: "/work" }])} />
      <div className="relative mx-auto max-w-[1440px] px-6 pb-24 pt-[calc(var(--nav-h)+3.5rem)] lg:px-12 lg:pb-32 lg:pt-[calc(var(--nav-h)+5.5rem)]">
        <SectionHeading
          as="h1"
          eyebrow="The work"
          heading={
            <>
              {projects.length} projects. Zero <span className="text-gradient">filler.</span>
            </>
          }
          lead="Short-form, long-form, and motion design across 40+ industries. Filter to your world and press play."
          className="mb-14 lg:mb-20"
        />
        <Suspense>
          <WorkGrid projects={projects} niches={allNiches} />
        </Suspense>
      </div>
    </PageStage>
  );
}
