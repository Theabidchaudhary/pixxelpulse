export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  featured?: boolean;
};

/** Real client quotes (trimmed to their sharpest lines). */
export const testimonials: Testimonial[] = [
  {
    quote:
      "I gave them randomly shot videos and they made such a great video from them. They went over and beyond the requirements — delivering more than expected.",
    name: "Nunzio",
    role: "Content Creator",
    featured: true,
  },
  {
    quote:
      "The best editors I have found so far — and I tried MANY. Excellent quality that saves me a ton of time, so I can keep multiple channels running effortlessly.",
    name: "Tiago",
    role: "YouTuber",
    featured: true,
  },
  {
    quote:
      "Every video they deliver is polished, creative, and matches exactly what I had in mind. They work quickly without sacrificing quality. Their attention to detail makes them my first choice.",
    name: "Varinder",
    role: "Startup Founder",
    featured: true,
  },
  {
    quote:
      "Orvix has been a game-changer. Incredible speed without sacrificing quality — I finally feel confident hitting publish every week.",
    name: "Sarah Mitchell",
    role: "Content Creator",
  },
  {
    quote:
      "We needed consistent short-form for Instagram and they nailed it. Fresh, engaging, on-brand — we've already seen a boost in followers and interactions.",
    name: "Daniel Carter",
    role: "Marketing Manager, TrendHive",
    featured: true,
  },
  {
    quote:
      "I had a large batch of training videos and didn't expect such attention to detail. Every graphic, subtitle, and cut was spot on. Saved me weeks of stress.",
    name: "Ayesha Khan",
    role: "Corporate Trainer",
  },
  {
    quote:
      "What stood out was the professional communication. Updated at every step, delivered on time, and the final motion graphics looked better than I imagined.",
    name: "James Reynolds",
    role: "Startup Founder",
  },
];
