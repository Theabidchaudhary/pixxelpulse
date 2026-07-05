import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { posts } from "@/content/posts";
import { featuredProjects } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entry = (path: string, priority: number, changeFrequency: "weekly" | "monthly" = "monthly") => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    entry("/", 1, "weekly"),
    entry("/work", 0.9, "weekly"),
    entry("/services", 0.9),
    ...services.map((s) => entry(`/services/${s.slug}`, 0.8)),
    entry("/pricing", 0.8),
    entry("/about", 0.7),
    entry("/contact", 0.8),
    entry("/blog", 0.6, "weekly"),
    ...posts.map((p) => entry(`/blog/${p.slug}`, 0.6)),
    ...featuredProjects.map((p) => entry(`/work/${p.slug}`, 0.6)),
  ];
}
