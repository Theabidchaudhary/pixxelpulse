export type Plan = {
  name: string;
  tag: string;
  price: string;
  unit: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

/**
 * Engagement models. Prices are intentionally editable placeholders —
 * set real numbers or switch `price` to "Custom" to hide them.
 */
export const plans: Plan[] = [
  {
    name: "Per-Project",
    tag: "One-off & campaigns",
    price: "Custom",
    unit: "scoped quote",
    description: "A scoped quote for a defined deliverable — from a single hero video to a launch campaign pack.",
    features: [
      "Fixed scope, fixed price, fixed date",
      "48–72h standard turnaround",
      "Revision rounds included",
      "All formats & platforms",
      "Full ownership of masters",
    ],
    cta: "Get a quote",
  },
  {
    name: "Subscription",
    tag: "For consistent publishing",
    price: "From $1,000",
    unit: "per month",
    description: "A dedicated editor pod and a standing production pipeline for creators and brands that publish weekly.",
    features: [
      "Dedicated editor & art direction",
      "Standing 48–72h delivery windows",
      "Short-form, long-form & motion mixed",
      "Unlimited revision loop",
      "Pause or scale any month",
      "Priority support channel",
    ],
    cta: "Book a call",
    highlighted: true,
  },
  {
    name: "Partner",
    tag: "Agencies & studios",
    price: "Custom",
    unit: "retainer",
    description: "White-label capacity under your brand: NDA-first, SLA-backed, invisible to your clients.",
    features: [
      "Dedicated editor pods under NDA",
      "Your-brand delivery",
      "Custom SLA turnaround",
      "Elastic surge capacity",
      "Single point of contact",
    ],
    cta: "Talk partnerships",
  },
];
