import type { NextConfig } from "next";

const legacyRedirects = [
  { source: "/index.html", destination: "/", permanent: true },
  { source: "/about.html", destination: "/about", permanent: true },
  { source: "/services.html", destination: "/services", permanent: true },
  { source: "/portfolio.html", destination: "/work", permanent: true },
  { source: "/short-form.html", destination: "/work?format=short-form", permanent: true },
  { source: "/long-form.html", destination: "/work?format=long-form", permanent: true },
  { source: "/motion-graphics.html", destination: "/work?format=motion", permanent: true },
  { source: "/team.html", destination: "/about", permanent: true },
  { source: "/testimonial.html", destination: "/about", permanent: true },
  { source: "/faq.html", destination: "/contact", permanent: true },
  { source: "/contact.html", destination: "/contact", permanent: true },
  { source: "/privacy-policy.html", destination: "/privacy", permanent: true },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep nodemailer un-bundled so the contact server action loads it at
  // runtime exactly as published (avoids ESM-interop bundling breakage).
  serverExternalPackages: ["nodemailer"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
  async redirects() {
    return legacyRedirects;
  },
};

export default nextConfig;
