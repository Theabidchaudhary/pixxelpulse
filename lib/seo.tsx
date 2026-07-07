import { site } from "@/content/site";

export function absoluteUrl(path = "/") {
  return `${site.url}${path === "/" ? "" : path}`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    description: site.description,
    email: site.email,
    telephone: site.phone,
    foundingDate: String(site.foundingYear),
    founder: { "@type": "Person", name: "Abid Fareed" },
    logo: `${site.url}/icon.svg`,
    sameAs: Object.values(site.socials),
  };
}

export function serviceJsonLd(s: { title: string; promise: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.promise,
    url: absoluteUrl(`/services/${s.slug}`),
    provider: { "@id": `${site.url}/#organization` },
    areaServed: "Worldwide",
    serviceType: s.title,
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function videoJsonLd(p: { title: string; youtubeId: string; slug: string; format: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: p.title,
    description: `${p.title} — ${p.format} video edited by Orwyx.`,
    thumbnailUrl: `https://i.ytimg.com/vi/${p.youtubeId}/hqdefault.jpg`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${p.youtubeId}`,
    url: absoluteUrl(`/work/${p.slug}`),
  };
}

export function articleJsonLd(post: { title: string; description: string; date: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
