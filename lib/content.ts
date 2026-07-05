import projectsData from "@/content/projects.json";

export type ProjectFormat = "short-form" | "long-form" | "motion";

export type Project = {
  slug: string;
  title: string;
  format: ProjectFormat;
  niches: string[];
  youtubeId: string;
};

export const FORMAT_LABELS: Record<ProjectFormat, string> = {
  "short-form": "Short-Form",
  "long-form": "Long-Form",
  motion: "Motion Design",
};

/**
 * Curated "best of" ordering — these slugs surface first on /work and get
 * static detail pages. Edit this list to change what leads the portfolio.
 */
export const FEATURED_SLUGS = [
  "samsung-dual-display-tv-ad",
  "nike-hyperadapt-vr-experience",
  "icc-showreel",
  "dynamic-3d-intro-adobe-suite",
  "gymreapers-v1",
  "luxurious-real-estate-walkthrough",
  "essence-festival-dj",
  "3d-gunfire-trailer",
  "toxic-garbage-island",
  "football-promotional-ad",
  "the-global-goals",
  "veteran-profiles",
  "bangladeshi-bank-heist",
  "sierra-leone",
  "realistic-rain-drop-vfx",
  "manifestation",
];

const raw = projectsData as Project[];

export const projects: Project[] = [
  ...FEATURED_SLUGS.map((s) => raw.find((p) => p.slug === s)).filter(
    (p): p is Project => Boolean(p)
  ),
  ...raw.filter((p) => !FEATURED_SLUGS.includes(p.slug)),
].map((p) => ({
  ...p,
  niches: p.niches.filter(Boolean).length ? p.niches.filter(Boolean) : ["Brand & Promo"],
}));

export const featuredProjects = projects.slice(0, FEATURED_SLUGS.length);

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const allNiches = [...new Set(projects.flatMap((p) => p.niches))].sort();

export function projectThumb(p: Project, quality: "hq" | "max" = "hq") {
  return `https://i.ytimg.com/vi/${p.youtubeId}/${quality === "max" ? "maxresdefault" : "hqdefault"}.jpg`;
}

/** Vertical (9:16) thumbnail for shorts, with 16:9 fallback handled client-side */
export function projectThumbVertical(p: Project) {
  return `https://i.ytimg.com/vi/${p.youtubeId}/oar2.jpg`;
}

export function relatedProjects(p: Project, count = 4) {
  return projects
    .filter((x) => x.slug !== p.slug)
    .sort((a, b) => {
      const score = (x: Project) =>
        (x.format === p.format ? 2 : 0) + (x.niches.some((n) => p.niches.includes(n)) ? 3 : 0);
      return score(b) - score(a);
    })
    .slice(0, count);
}
