/**
 * Global site settings — edit everything here without touching components.
 */
export const site = {
  name: "Orwyx",
  tagline: "Post-production that moves people.",
  url: "https://www.pixxelpulse.com",
  description:
    "Orwyx is a premium video editing agency for creators, startups, and brands — 1,300+ videos delivered across 40+ niches, in as fast as 48 hours.",
  email: "hello@pixxelpulse.com",
  phone: "+44 741 308 9165",
  whatsapp: "https://wa.me/447413089165",
  foundingYear: 2018,
  availability: "Currently booking — August 2026",
  /** Set to your Cal.com / Calendly URL to enable the booking embed on /contact */
  bookingUrl: "",
  socials: {
    youtube: "https://www.youtube.com/@pixxelpulse",
    instagram: "https://www.instagram.com/pixxelpulse",
    linkedin: "https://www.linkedin.com/company/pixxelpulse",
    fiverr: "https://www.fiverr.com/pixxelpulse",
  },
  stats: [
    { value: 1300, suffix: "+", label: "Projects delivered" },
    { value: 7, suffix: "+", label: "Years in post-production" },
    { value: 48, suffix: "–72h", label: "Standard turnaround" },
    { value: 40, suffix: "+", label: "Industries served" },
  ],
};

export type Site = typeof site;
