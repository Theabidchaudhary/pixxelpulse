export type Service = {
  slug: string;
  title: string;
  navLabel: string;
  /** One-line outcome promise used on cards and meta descriptions */
  promise: string;
  heroEyebrow: string;
  heroHeading: string;
  heroSub: string;
  pain: { heading: string; body: string };
  deliverables: string[];
  process: { step: string; detail: string }[];
  /** Which portfolio formats/niches this service pulls proof from */
  proof: { formats?: string[]; niches?: string[] };
  faqs: { q: string; a: string }[];
  seo: { title: string; description: string };
};

export const services: Service[] = [
  {
    slug: "short-form-video-editing",
    title: "Short-Form Video Editing",
    navLabel: "Short-Form",
    promise: "Reels, TikToks, and Shorts engineered to stop thumbs.",
    heroEyebrow: "Service — Short-Form",
    heroHeading: "Short-form that stops the scroll.",
    heroSub:
      "The first second decides everything. We cut hook-first verticals with kinetic captions, motion callouts, and pacing tuned per platform — so your content earns attention instead of renting it.",
    pain: {
      heading: "Volume without a system burns creators out.",
      body: "Posting daily is table stakes, but raw talent footage doesn't edit itself. We run your short-form like a production line: consistent style, batch delivery, and a feedback loop that compounds what performs.",
    },
    deliverables: [
      "Hook-first vertical edits (9:16, 1:1, 4:5)",
      "Kinetic captions & subtitle systems",
      "Motion callouts, zooms & sound design",
      "Platform-native pacing (TikTok / Reels / Shorts)",
      "Batch packages — 10 to 100+ clips per month",
      "Thumbnail frames & cover selects",
    ],
    process: [
      { step: "Ingest", detail: "Drop raw footage in a shared drive. We handle selects, sync, and organization." },
      { step: "Hook pass", detail: "We find the strongest 1–3 seconds and build the edit backwards from it." },
      { step: "Style system", detail: "Captions, color, and motion locked to your brand kit for every clip." },
      { step: "Batch delivery", detail: "Clips delivered in publishing-ready batches, 48–72h standard." },
    ],
    proof: { formats: ["short-form"] },
    faqs: [
      {
        q: "How many shorts can you handle per month?",
        a: "Our subscription tiers cover everything from 10 clips a month to daily publishing across multiple channels. Capacity scales with a dedicated editor pod, so quality doesn't dilute as volume grows.",
      },
      {
        q: "Can you repurpose my long-form content into shorts?",
        a: "Yes — clip mining is one of our most-booked packages. We pull the strongest moments from podcasts, YouTube videos, and webinars and rebuild them as native vertical content, not lazy crops.",
      },
      {
        q: "Do you match my existing editing style?",
        a: "We can match an existing style precisely, or design a sharper one. Most clients start with a style-match, then let us evolve it once the numbers come in.",
      },
    ],
    seo: {
      title: "Short-Form Video Editing Service — Reels, TikTok & Shorts",
      description:
        "Premium short-form video editing for creators and brands. Hook-first Reels, TikToks, and Shorts with kinetic captions, delivered in 48–72 hours by Orwyx.",
    },
  },
  {
    slug: "youtube-video-editing",
    title: "YouTube & Long-Form Editing",
    navLabel: "Long-Form & YouTube",
    promise: "Long-form edits engineered for watch-time and retention.",
    heroEyebrow: "Service — Long-Form",
    heroHeading: "Edits built for watch-time.",
    heroSub:
      "Retention is a craft, not luck. We edit long-form video with deliberate pacing, pattern interrupts, and story structure that keeps viewers past the moments where channels usually lose them.",
    pain: {
      heading: "Great footage dies in slow edits.",
      body: "Most long-form video loses half its audience in the first minute — not because the content is weak, but because the edit doesn't earn the next ten seconds. We treat every cut as a retention decision.",
    },
    deliverables: [
      "Full YouTube episode edits (talking head, docu, vlog)",
      "Retention passes — pacing, pattern interrupts, b-roll",
      "Documentary & interview post-production",
      "Chaptering, end screens & subscribe moments",
      "Podcast video episodes",
      "Color, sound design & mix",
    ],
    process: [
      { step: "Brief", detail: "Reference videos, audience, and goal — five minutes of your time, in writing." },
      { step: "Story cut", detail: "Structure first: we shape the narrative before polishing a single frame." },
      { step: "Retention pass", detail: "Pacing, b-roll, sound, and interrupts placed where attention dips." },
      { step: "Polish & deliver", detail: "Color, mix, captions, export presets per platform. 48–72h standard." },
    ],
    proof: { formats: ["long-form"] },
    faqs: [
      {
        q: "What's the typical turnaround for a 15-minute video?",
        a: "48–72 hours for a standard edit. Heavier documentary-style projects with motion graphics run 4–6 days. Rush delivery is available on request.",
      },
      {
        q: "Do you work with faceless channels?",
        a: "Yes — a large share of our long-form work is faceless: documentary, education, top-10, and narration-driven formats built from stock, archive, and motion graphics.",
      },
      {
        q: "Can you handle a weekly publishing schedule?",
        a: "That's our sweet spot. Subscription clients get a dedicated editor and a standing pipeline, so a weekly (or twice-weekly) cadence runs without you chasing anyone.",
      },
    ],
    seo: {
      title: "YouTube Video Editing Service — Long-Form & Retention Editing",
      description:
        "YouTube and long-form video editing engineered for retention. Full episode edits, documentary post-production, and weekly publishing pipelines by Orwyx.",
    },
  },
  {
    slug: "motion-design-animation",
    title: "Motion Design & Animation",
    navLabel: "Motion Design",
    promise: "Brand motion systems, intros, and animation with real polish.",
    heroEyebrow: "Service — Motion",
    heroHeading: "Motion that makes brands feel expensive.",
    heroSub:
      "Logo animations, intros, lower thirds, explainer graphics — the connective tissue that separates a channel from a brand. Designed once, systemized forever.",
    pain: {
      heading: "Static brands disappear in a moving feed.",
      body: "Every serious brand on video has a motion identity: how the logo resolves, how titles enter, how data animates. We build that system for you — then every video you ship reinforces it.",
    },
    deliverables: [
      "Logo animation & brand stingers",
      "Intros, outros & end-screen systems",
      "Lower thirds & title packages",
      "Explainer & product animation",
      "Animated ads & social graphics",
      "VFX & compositing",
    ],
    process: [
      { step: "Style frames", detail: "Static frames that lock look, type, and color before anything moves." },
      { step: "Animatic", detail: "Timing blocked against music and VO so the motion has rhythm." },
      { step: "Animation", detail: "Full-resolution animation with sound design." },
      { step: "System handoff", detail: "Reusable templates and exports so the system lives beyond one video." },
    ],
    proof: { formats: ["motion"] },
    faqs: [
      {
        q: "Do you do 3D work?",
        a: "Yes — 3D intros, product shots, and trailer-grade sequences where the concept calls for it. We'll always recommend the simplest technique that achieves the effect.",
      },
      {
        q: "Can you build templates my team can reuse?",
        a: "That's the point of a motion system: we deliver editable After Effects / Premiere templates for lower thirds, titles, and stingers so your team ships on-brand without us in the loop.",
      },
    ],
    seo: {
      title: "Motion Graphics & Animation Studio — Brand Motion Systems",
      description:
        "Motion design studio for brands and creators: logo animation, intros, lower thirds, explainer animation, and VFX. Build a motion identity with Orwyx.",
    },
  },
  {
    slug: "video-ads-performance-creative",
    title: "Video Ads & Performance Creative",
    navLabel: "Video Ads",
    promise: "Paid-social creative built to convert, not just to look good.",
    heroEyebrow: "Service — Performance",
    heroHeading: "Ad creative that earns its budget back.",
    heroSub:
      "UGC-style ads, product spots, and A/B variant packs cut for the platforms they'll actually run on — with hooks, ratios, and lengths built for testing, not guessing.",
    pain: {
      heading: "Creative is the new targeting.",
      body: "Algorithms optimize delivery; your creative decides the outcome. Winning accounts iterate on video weekly. We give marketing teams a creative engine: fresh variants, fast turnarounds, and edits informed by what the data says.",
    },
    deliverables: [
      "UGC-style & founder-story ads",
      "Product and app promo spots",
      "A/B hook & CTA variant packs",
      "Platform ratio exports (9:16, 1:1, 16:9, 4:5)",
      "Iteration sprints on winning concepts",
      "Motion-graphic ad animation",
    ],
    process: [
      { step: "Angle brief", detail: "Offer, audience, and the angles worth testing — mapped before we cut." },
      { step: "Variant build", detail: "Each concept shipped with multiple hooks and CTAs from day one." },
      { step: "Launch pack", detail: "Every ratio and length your media buyer needs, named and organized." },
      { step: "Iterate", detail: "Winners get iterations, losers get autopsies. Weekly cadence available." },
    ],
    proof: { niches: ["Business & Marketing", "Brand & Promo", "Product & SaaS"] },
    faqs: [
      {
        q: "Do you provide creators/actors for UGC ads?",
        a: "We edit and post-produce UGC — sourcing creators is on your side, though we're happy to brief them so the raw footage cuts well. Many clients pair us with a UGC sourcing platform.",
      },
      {
        q: "How fast can you turn ad variants?",
        a: "Standard is 48–72 hours per batch. Teams on an iteration sprint retainer get fixed weekly delivery slots.",
      },
    ],
    seo: {
      title: "Video Ad Editing & Performance Creative Agency",
      description:
        "Performance video creative for paid social: UGC-style ads, A/B variant packs, and platform-ratio exports delivered in 48–72 hours by Orwyx.",
    },
  },
  {
    slug: "podcast-editing",
    title: "Podcast Post-Production",
    navLabel: "Podcast",
    promise: "Full-stack podcast post: episodes, clips, and audiograms.",
    heroEyebrow: "Service — Podcast",
    heroHeading: "One recording. A week of content.",
    heroSub:
      "We turn every episode into a content system: the polished full episode, 10+ vertical clips, audiograms, and quote graphics — everything your podcast needs to grow beyond its feed.",
    pain: {
      heading: "Most podcasts publish once and vanish.",
      body: "The episode is the raw material, not the product. Shows that grow are the ones clipping relentlessly. We mine every recording for its sharpest moments and rebuild them as native short-form.",
    },
    deliverables: [
      "Full episode edit (video + audio)",
      "Multi-cam sync & switching",
      "Clip mining — 10+ shorts per episode",
      "Audiograms & quote graphics",
      "Show branding: intros, lower thirds, transitions",
      "Publishing-ready exports per platform",
    ],
    process: [
      { step: "Upload", detail: "Send raw multi-cam and audio tracks. We sync and organize." },
      { step: "Episode edit", detail: "Cuts, cleanup, level-matched audio, branded packaging." },
      { step: "Clip mining", detail: "We flag and cut the moments with hook potential — you approve from a list." },
      { step: "Weekly delivery", detail: "Episode plus clip pack delivered on a standing weekly schedule." },
    ],
    proof: { formats: ["long-form", "short-form"], niches: ["Motivation & Growth", "Education"] },
    faqs: [
      {
        q: "Do you handle audio-only podcasts?",
        a: "Yes — audio cleanup, leveling, and mixing, plus audiograms and quote graphics so audio-only shows still have a visual presence on social.",
      },
      {
        q: "How do you choose which moments become clips?",
        a: "Editors trained on short-form retention flag moments with a hook, a payoff, and a reason to share. You get a ranked list before we cut, so nothing publishes without your sign-off.",
      },
    ],
    seo: {
      title: "Podcast Editing Service — Episodes, Clips & Audiograms",
      description:
        "Podcast post-production that turns one recording into a week of content: full episode edits, 10+ vertical clips, and audiograms. By Orwyx.",
    },
  },
  {
    slug: "agency-partnerships",
    title: "Agency Partnerships",
    navLabel: "For Agencies",
    promise: "White-label post-production capacity for agencies and studios.",
    heroEyebrow: "Service — White-Label",
    heroHeading: "Your agency's post-production department.",
    heroSub:
      "Marketing agencies, production studios, and design teams plug Orwyx in as invisible editing capacity — NDA-first, SLA-backed, delivered under your brand.",
    pain: {
      heading: "Hiring editors is slow. Client demand isn't.",
      body: "Scaling an in-house post team means recruiting, managing, and covering the quiet months. A white-label partner gives you elastic capacity with a fixed quality bar — you sell, we ship.",
    },
    deliverables: [
      "Dedicated editor pods under NDA",
      "Your-brand delivery — we're invisible",
      "SLA-backed turnaround windows",
      "Overflow & seasonal surge capacity",
      "All formats: short-form, long-form, motion",
      "Direct Slack/email line to your pod",
    ],
    process: [
      { step: "Capability match", detail: "A pilot project scoped to your hardest current deliverable." },
      { step: "Pod setup", detail: "Dedicated editors briefed on your clients, styles, and workflows." },
      { step: "Pipeline", detail: "Shared board, standing SLAs, and a single point of contact." },
      { step: "Scale", detail: "Add capacity per client win — without a single job posting." },
    ],
    proof: { formats: ["short-form", "long-form", "motion"] },
    faqs: [
      {
        q: "Will you ever contact our clients?",
        a: "Never. Partnerships run NDA-first and your-brand-only. We exist inside your workflow and nowhere else.",
      },
      {
        q: "What turnaround SLAs do you offer?",
        a: "Standard pods run 48–72h per deliverable. Custom SLAs — including same-day social cuts — are available on dedicated retainers.",
      },
    ],
    seo: {
      title: "White-Label Video Editing for Agencies — Partner Program",
      description:
        "White-label video editing and motion design capacity for agencies: dedicated editor pods, NDA-first workflows, and SLA-backed turnaround from Orwyx.",
    },
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
