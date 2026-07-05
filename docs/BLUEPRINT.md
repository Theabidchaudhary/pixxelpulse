# PIXXELPULSE — Project Blueprint

**The new pixxelpulse.com: a premium creative agency platform**
Version 1.0 · July 2026 · Status: awaiting approval

---

## 0. Executive Summary

Pixxelpulse is moving from "freelancer with a template site" to "elite creative post-production partner." The new website is not a portfolio — it is a sales instrument. Every screen must do one of three jobs: **prove capability, build trust, or move the visitor toward a conversation.**

The design language is dark, quiet, and confident — the Apple / Linear / Vercel / Framer / Stripe school: enormous whitespace, restrained color, one signature gradient, typography that carries the design, and motion that feels engineered rather than decorated.

What we keep from the current business: 7+ years of track record (since Dec 2018), 1,300+ delivered projects, 48–72h turnaround, a real team, real client love (Fiverr-verified testimonials), and a deep portfolio already hosted on YouTube. What we throw away: all template design, all existing copy, the light theme, the generic stock-agency voice.

---

## 1. Brand Strategy

### 1.1 Positioning statement

> **Pixxelpulse is the post-production partner for brands and creators who publish like media companies.**
> We turn raw footage into content engineered for retention, conversion, and brand equity — delivered with agency polish at creator speed.

### 1.2 The core insight

The market is split between cheap freelancer marketplaces (fast, inconsistent) and traditional production agencies (polished, slow, expensive). Pixxelpulse owns the gap: **agency-grade craft with a 48–72 hour pulse.** Speed is not a discount signal here — it's reframed as operational excellence ("a production system, not a person").

### 1.3 Brand pillars

| Pillar | What it means | Where it shows on the site |
|---|---|---|
| **Craft** | Every frame is intentional | Portfolio-first architecture, case studies with before/after |
| **Velocity** | 48–72h standard turnaround | Process section, stats, "how we work" |
| **Retention science** | Edits engineered for watch-time and conversion | Results metrics in case studies, service copy |
| **Partnership** | Embedded team, not a gig | Subscription/retainer offer, team page, communication promise |

### 1.4 Audience segments (in priority order)

1. **Content creators & YouTubers** scaling output (highest volume, current base)
2. **SaaS & startups** needing product videos, ads, launch content (highest value)
3. **Agencies & studios** white-labeling post-production (highest LTV)
4. **Brands & e-commerce** needing performance creative and social content

### 1.5 Voice & tone

Confident, precise, a little cinematic. Short sentences. No exclamation marks. No "we're passionate about." Numbers over adjectives. Example register:

- ❌ "We are passionate about creating amazing videos that wow your audience!"
- ✅ "1,300 projects. 40+ niches. One standard: the viewer doesn't scroll past."

### 1.6 Tagline candidates

- **"Post-production that moves people."** (primary recommendation)
- "Every frame, engineered."
- "Footage in. Momentum out."

---

## 2. Visual Identity

### 2.1 Logo & wordmark

New wordmark: **`pixxelpulse`** — lowercase, custom-spaced Clash Display Semibold, with the double-x treated as the brand mark: the two x's tightened into a ligature-like pair, with a 2px gradient "pulse line" running through their intersection (readable as both a waveform and a scanline). The standalone mark (favicon, avatars) is the **pulse glyph**: a rounded square containing a minimal 3-point waveform stroke in the brand gradient.

Rules: wordmark in white on dark; glyph may carry the gradient; never both gradient-filled at once.

### 2.2 Visual language summary

- **Dark canvas, luminous accents.** Near-black backgrounds; light is used like stage lighting — radial glows behind key content, never floodlit.
- **One signature gradient** (see §10), used sparingly: hero keyword, active states, the pulse line, section glows. Everything else is monochrome.
- **Depth through light, not skeuomorphism**: 1px `white/8%` borders, soft 60–120px shadow-glows, 4% white glass surfaces with `backdrop-blur`.
- **Film-grain noise texture** (2–3% opacity, tiled SVG) over all large dark surfaces — kills banding and adds the "shot on film" texture appropriate for a video company.
- **Mono-spaced eyebrow labels** (`SECTION 01 — WORK`) in uppercase tracked mono type: the Linear/Vercel engineering signature that also nods to timecode/editing UIs.
- **Editorial iconography**: 1.5px stroke icons (Lucide as base, customized), never filled, never multicolored.
- **Timeline motif**: thin horizontal rules with playhead-like markers recur as section dividers — a subtle post-production metaphor that becomes ownable.

---

## 3. Website Architecture

### 3.1 Principles

- **Portfolio-first**: work is reachable within one interaction from anywhere.
- **One page, one job**: every page has a single primary CTA.
- **Flat and shallow**: no page deeper than 2 clicks from home.
- **Every page ends in a conversion moment** (a full-width "Start a project" closer section, globally shared).

### 3.2 Global layout system

- 12-column fluid grid, max-width **1440px** content well, generous gutters (24px mobile → 48px desktop).
- Section vertical rhythm: 96px mobile → 160px desktop between major sections.
- **Nav**: fixed, glass-blur on scroll, logo left, 5 links center, "Book a call" pill CTA right. Collapses to a full-screen overlay menu on mobile with staggered link reveal.
- **Footer**: large-format — oversized "Let's make something people watch twice." headline, sitemap columns, social, email, timezone/availability badge ("Currently booking · Aug 2026").

---

## 4. User Journey

### 4.1 Primary journey (cold visitor → lead)

```
Land on Home
 → 0–3s: hero communicates "premium video partner" (showreel + headline)
 → Scroll: proof strip (logos/stats) removes doubt
 → Featured work autoplays muted previews → capability proven
 → Services scanned → "they do what I need"
 → Process section → "working with them is easy and fast"
 → Testimonials + metrics → risk removed
 → CTA: "Book a call" (Cal.com embed) or "Start a project" (form)
```

### 4.2 Secondary journeys

- **Referral visitor** ("check out their work"): lands on `/work`, filters to their niche, watches 2–3 pieces, hits the sticky "Work with us" CTA on the work grid.
- **Agency/white-label prospect**: Home → Services → "Agency partnerships" service page → dedicated pitch (NDA-friendly, capacity, turnaround SLA) → call.
- **Researcher/SEO visitor**: lands on a blog post or service page from search → internal links to relevant work → closer CTA.

### 4.3 Conversion infrastructure

- Primary CTA everywhere: **"Book a call"** (calendar embed — zero-friction, no form-and-wait).
- Secondary: **"Start a project"** — a beautiful 3-step project brief form (project type → scope/links → contact), with progress indication and a "we reply within 12 hours" promise.
- Tertiary passive: email + WhatsApp link in footer for low-intent visitors.
- Exit-intent is **not** used (cheapens the brand). Instead, the closer section on every page is the strongest visual moment after the hero.

---

## 5. Sitemap

```
/                       Home
/work                   Portfolio index (filterable)
/work/[slug]            Case study / project detail
/services               Services overview
/services/[slug]        6 service detail pages:
  /services/short-form-video-editing
  /services/youtube-video-editing        (long-form)
  /services/motion-design-animation
  /services/video-ads-performance-creative
  /services/podcast-editing
  /services/agency-partnerships          (white-label)
/about                  Story, values, team (team merged here — no thin /team page)
/pricing                Plans & engagement models (subscription + per-project)
/blog                   Insights (SEO engine)
/blog/[slug]            Article
/contact                Book a call + project brief form (FAQ accordion lives here + on services)
/privacy  /terms        Legal
```

Removed vs. current site: standalone `/team`, `/testimonial`, `/faq` pages (thin content, weak SEO — their content is distributed into About, service pages, and Contact). 301 redirects will map all old URLs (`/portfolio.html` → `/work`, `/short-form.html` → `/work?type=short-form`, etc.).

---

## 6. SEO Strategy

### 6.1 Keyword architecture (page ↔ primary keyword)

| Page | Primary keyword target | Supporting terms |
|---|---|---|
| Home | `video editing agency` | creative video agency, premium video editing |
| Short-form service | `short form video editing service` | reels editing agency, tiktok editing service |
| YouTube service | `youtube video editing service` | youtube editing agency, long form video editor |
| Motion design | `motion graphics studio` | motion design agency, animation services |
| Video ads | `video ad creative agency` | UGC ads editing, performance creative |
| Podcast | `podcast editing service` | podcast video editing, clips from podcast |
| Agency partnerships | `white label video editing` | video editing for agencies, outsource video editing |
| Pricing | `video editing subscription` | unlimited video editing, video editing retainer |

Blog targets long-tail: "how much does video editing cost", "youtube retention editing", "short form content strategy", niche pages ("real estate video editing" etc. — future programmatic expansion).

### 6.2 Technical SEO

- Next.js Metadata API: unique title/description per route, canonical URLs, `og:` + Twitter cards with **generated OG images** (`@vercel/og` — dark branded card with page title).
- **JSON-LD** on every page: `Organization` (+ founder, foundingDate 2018, sameAs socials), `Service` on service pages, `VideoObject` on every portfolio item (thumbnail, duration, uploadDate — this earns video rich results), `FAQPage` on contact/services, `BreadcrumbList` sitewide, `Article` on blog.
- Semantic HTML: one `h1` per page, landmark elements, real `<button>`/`<a>` semantics, descriptive alt text.
- `sitemap.xml` + `robots.txt` generated from CMS content; clean lowercase-hyphen URLs; 301 map from all legacy `.html` URLs.
- Hreflang not needed (single locale, English).

---

## 7. Content Strategy

All copy rewritten from scratch. Register per §1.5. Key copy blocks:

### 7.1 Home page copy skeleton

- **Hero H1**: "We edit videos people **can't scroll past.**" (gradient on the emphasized phrase)
  Sub: "Pixxelpulse is the post-production partner behind 1,300+ videos for creators, startups, and brands in 40+ niches — delivered in as fast as 48 hours."
- **Proof strip**: "1,300+ projects · 7 years · 48–72h turnaround · 40+ niches" + client logos/platform badges.
- **Services teaser**: outcome-led one-liners, not feature lists ("Short-form that stops thumbs", "YouTube edits built for watch-time").
- **Process**: 4 steps — Brief → Edit → Refine → Publish, each with a concrete promise ("First cut in 72 hours or less").
- **Testimonials**: real quotes, trimmed to their sharpest sentence, with name/role. Keep the authentic Fiverr-era voices — they read true.
- **Closer**: "Your footage is sitting on a hard drive. Let's make it work." → Book a call.

### 7.2 Editorial rules

- Headlines ≤ 8 words. Subheads ≤ 25 words. Body ≤ 60 words per block.
- Every service page follows: problem → what we do → deliverables → process → proof (relevant portfolio pieces auto-pulled by category) → FAQ → CTA.
- Case studies follow: context → challenge → approach → result (with at least one number wherever obtainable).
- Blog: 2 posts at launch (turnaround-time guide + retention editing breakdown), then cadence-driven from CMS.

---

## 8. Animation System

Philosophy: **motion as physics, not decoration.** Everything obeys one easing family and consistent durations, so the site feels like a single machine.

### 8.1 Motion tokens

```
--ease-pulse:  cubic-bezier(0.16, 1, 0.3, 1)   (expo-out — all reveals/UI)
--ease-inout:  cubic-bezier(0.65, 0, 0.35, 1)  (page transitions, masks)
--dur-fast:    200ms   (hovers, micro)
--dur-base:    500ms   (card/UI transitions)
--dur-reveal:  900ms   (section text/image reveals)
--dur-scene:   1200ms  (page transitions, hero intro)
Stagger unit: 60ms (text lines), 90ms (cards)
```

### 8.2 The choreography catalog

| Pattern | Implementation | Where |
|---|---|---|
| **Loader** | Wordmark letters resolve + pulse line sweeps once, curtain lifts (max 1.8s, first visit only, session-cached) | Initial load |
| **Page transitions** | Framer Motion template: outgoing fades/scales to 0.98, incoming content rises with clip-path wipe | All routes |
| **Text reveal** | SplitText-style line masking, lines rise with `--ease-pulse`, 60ms stagger, tiny blur→sharp | H1/H2s |
| **Scroll reveals** | GSAP ScrollTrigger: y:32→0 + fade, batched; sections never "pop" | All sections |
| **Parallax** | Subtle only: background glows at 0.85× scroll speed, hero media at 1.05×; ±40px max | Hero, section glows |
| **Magnetic buttons** | Primary CTAs attract cursor within 80px radius (translate ≤ 12px, spring return) | CTAs, nav pill |
| **Cursor** | Default cursor + a 400px radial glow that follows pointer on dark sections; grows into a "▶ Play" disc over video cards | Desktop only |
| **Video cards** | Hover: scale 1.02, border brightens, muted preview clip fades in after 300ms delay | Work grid |
| **Filter transitions** | FLIP-animated grid reshuffle (Framer Motion `layout`) | /work |
| **Number counters** | Stats count up on first view, mono font, slight overshoot | Proof strip |
| **Marquee** | Client/niche marquee at constant 40s loop, pauses on hover | Proof strip |
| **3D moment** | One R3F scene: hero background — a slow-drifting particle field / gradient mesh reacting gently to pointer (desktop only, static gradient fallback) | Home hero |

### 8.3 Restraint rules

- `prefers-reduced-motion`: all reveals become simple fades, parallax/magnetic/cursor/3D disabled, videos don't autoplay.
- Nothing animates on scroll-out (only in). No scroll-jacking. Lenis smooth scroll with modest lerp (0.1) — enhancement, not takeover.
- Mobile: no cursor effects, no magnetic, no R3F; keeps reveals + transitions only.

---

## 9. Component System

Atomic, typed, CMS-driven. Core inventory (~30 components):

**Primitives**: `Button` (primary gradient-border pill / ghost / text-arrow), `Eyebrow` (mono label), `Heading` (with split-text reveal built in), `GlassPanel`, `NoiseOverlay`, `GradientGlow`, `Divider` (timeline motif), `Badge`, `Accordion`, `Input/Textarea/Select` (dark, 1px borders, glow focus).

**Media**: `VideoCard` (thumbnail + hover preview + play cursor), `VideoLightbox` (custom player modal, lite-YouTube under the hood), `ShowreelHero`, `AspectFrame` (16:9 / 9:16 / 1:1 aware — critical since short-form is vertical).

**Sections** (each a CMS-mappable block): `Hero`, `ProofStrip`, `LogoMarquee`, `ServicesGrid`, `FeaturedWork`, `ProcessTimeline`, `TestimonialCarousel`, `StatsBand`, `TeamGrid`, `FaqSection`, `BlogTeaser`, `CloserCTA`, `ContactForm`, `PricingTable`.

**Layout**: `Nav`, `MobileMenu`, `Footer`, `PageTransition`, `SmoothScrollProvider`, `Section` (handles rhythm + reveal registration).

Every section component accepts CMS data as props — no copy hardcoded.

---

## 10. Color System

```
Backgrounds
  --ink-950:  #060709   page base
  --ink-900:  #0A0C10   section alternate
  --ink-800:  #10131A   cards / surfaces
  --ink-700:  #181C26   elevated / hover surfaces

Borders & glass
  --line:        rgba(255,255,255,0.08)
  --line-strong: rgba(255,255,255,0.16)
  --glass:       rgba(255,255,255,0.04) + backdrop-blur(16px)

Text
  --text-primary:   #F5F6F8
  --text-secondary: #9AA1B0
  --text-tertiary:  #5C6372   (mono labels, captions)

Brand accents
  --pulse-violet: #7C6AF7
  --pulse-blue:   #4D8DFF
  --pulse-cyan:   #53D8FF
  --gradient-pulse: linear-gradient(120deg, #7C6AF7 0%, #4D8DFF 55%, #53D8FF 100%)

Semantic
  --success: #4ADE80   --error: #F87171
```

**Usage discipline**: ~92% of any viewport is ink + text. The gradient appears in ≤ 3 places per screen (hero keyword, one glow, active CTA state). Glows are radial `--pulse-violet` at 10–16% opacity, blurred 120px+, positioned behind headlines and hero media. This restraint is what reads as expensive.

Light mode: **not offered.** The brand is dark; a toggle would double QA cost and dilute identity.

---

## 11. Typography System

| Role | Face | Weights | Source |
|---|---|---|---|
| Display / headings | **Clash Display** | 500, 600 | Fontshare (free for commercial) |
| Body / UI | **Satoshi** | 400, 500, 700 | Fontshare |
| Mono (labels, stats, timecodes) | **JetBrains Mono** | 400, 500 | Google Fonts |

All self-hosted via `next/font/local` (subset latin, `display: swap`).

**Fluid scale** (clamp-based):

```
display:  clamp(2.75rem, 1.2rem + 6.5vw, 7rem)     /* hero H1 */
h2:       clamp(2rem, 1.1rem + 3.2vw, 4rem)
h3:       clamp(1.4rem, 1.1rem + 1.2vw, 2rem)
lead:     clamp(1.05rem, 1rem + 0.35vw, 1.25rem)
body:     1rem / 1.7
label:    0.8125rem mono, uppercase, tracking 0.14em
```

Headings: tracking −0.02em, line-height 1.02–1.1, `text-wrap: balance`. Max body measure 65ch. Hero headlines mix Clash Display with one *italicized or gradient* keyword for editorial tension.

---

## 12. Motion Guidelines

(Governance layer over §8 — the rules a future editor/developer must obey.)

1. **One easing family.** Never introduce a new curve; use the two tokens.
2. **Motion must be interruptible** — no animation blocks input; page transition ≤ 600ms perceived.
3. **Distance discipline**: reveals travel ≤ 40px; parallax ≤ 40px; magnetic ≤ 12px.
4. **60fps or nothing**: animate only `transform`, `opacity`, `clip-path`, `filter`. No layout-affecting properties.
5. **Hierarchy of motion**: hero > section reveals > cards > micro. Only one "showpiece" animation per page (Home = R3F hero; Work = FLIP grid; Case study = scroll-scrub media).
6. **Sound off, always.** Videos autoplay muted; sound only on explicit interaction in the lightbox.
7. Every animated component ships a `prefers-reduced-motion` branch — reviewed in QA, not optional.

---

## 13. Portfolio Structure

The crown jewel. Current asset: ~170 YouTube-hosted pieces already tagged in three formats and ~20 niches.

### 13.1 Taxonomy (two axes, both filterable)

- **Format**: Short-Form (9:16) · Long-Form (16:9) · Motion Design
- **Industry/Niche**: Education, Health & Fitness, Real Estate, Sports, Business & Marketing, SaaS & Tech, Documentary, Gaming, Travel, Events, News, Horror/Entertainment, E-commerce…

### 13.2 `/work` experience

- Sticky filter bar (format pills + niche dropdown + result count), URL-synced (`/work?type=short-form&niche=fitness`) for shareability and SEO.
- **Mixed-aspect masonry grid**: vertical 9:16 cards interleaved with 16:9 — visually distinctive and honest to the medium.
- Cards: custom thumbnail, hover → muted 3–4s preview clip, mono label (niche · duration), FLIP reshuffle on filter change.
- Lazy pagination ("Load more"), first 12 items server-rendered for SEO.

### 13.3 Project detail `/work/[slug]`

Case-study layout for the ~15–20 hero projects (full player, context/challenge/approach, deliverable list, result metrics, related work rail, next-project footer nav). Remaining pieces open in the **lightbox player** directly from the grid (no thin pages — avoids 150 low-value URLs; only case studies get indexed detail pages, each with `VideoObject` schema).

### 13.4 Curation rule

Grid defaults to a curated "Best of" ordering (CMS field), not chronology. Quality gate: anything that doesn't look premium at 1440px doesn't ship at launch — depth is worthless if the first row isn't flawless.

**Needed from you**: the promised project videos + which 15–20 pieces deserve full case studies, plus any client names/metrics we're allowed to publish.

---

## 14. Service Structure

Researched against premium editing agencies (Veed-style productized services, subscription editors, motion studios). Six services, each a dedicated page:

| Service | Offer essence | Signature deliverables |
|---|---|---|
| **Short-Form Video Editing** | A content engine for Reels/TikTok/Shorts | Hook-first edits, captions/subtitle systems, motion callouts, batch packages |
| **YouTube & Long-Form Editing** | Retention-engineered long-form | Full edits, pacing/retention passes, thumbnails-ready frames, chaptering |
| **Motion Design & Animation** | Brand motion systems | Intros/outros, lower thirds, logo animation, explainer graphics, ad animation |
| **Video Ads & Performance Creative** | Paid-social creative that converts | UGC-style ads, A/B variant packs, platform-ratio exports, iteration sprints |
| **Podcast Post-Production** | Full-stack podcast output | Episode edits, video podcast, clip mining (1 episode → 10+ shorts), audiograms |
| **Agency Partnerships** | White-label post-production capacity | Dedicated editors, NDA-first, SLA turnaround, your-brand delivery |

Each page: outcome headline → pain framing → what's included → process → auto-pulled relevant portfolio → pricing pointer → FAQ (with schema) → CTA.

### Engagement models (Pricing page)

1. **Per-project** — scoped quotes, 48–72h standard delivery.
2. **Subscription** — monthly editing retainer (the "unlimited editing" model; tiered by volume/format) — recurring revenue, the strategic core of the agency transition.
3. **Partner** — agency white-label with custom SLA.

(Exact price points: your call at content-entry time; the blueprint builds the structure with CMS-editable numbers, with an option to show "from $X" or hide prices behind "Get a quote.")

---

## 15. Technical Architecture

```
Framework      Next.js 15 (App Router, React Server Components, TypeScript)
Styling        Tailwind CSS v4 + design tokens as CSS variables
Motion         Framer Motion (transitions, layout/FLIP) + GSAP ScrollTrigger
               (scroll choreography) + Lenis (smooth scroll)
3D             React Three Fiber + drei — Home hero only, dynamic import,
               desktop-only, graceful static-gradient fallback
Video          YouTube-hosted (existing library) behind a custom lite-embed
               facade; hover previews as tiny muted MP4/WebM loops
Fonts          next/font/local — Clash Display, Satoshi, JetBrains Mono
Forms          React Hook Form + Zod → Next.js Server Actions → Resend
               (email) — replaces PHPMailer entirely
Scheduling     Cal.com embed on /contact ("Book a call")
Hosting        Vercel (edge network, image optimization, analytics)
Analytics      Vercel Analytics + GA4
Rendering      Static + ISR: all pages statically generated, revalidated
               on CMS publish via webhook — CMS edits go live in seconds
               with zero rebuild cost
```

Repo layout: `app/` (routes) · `components/{ui,media,sections,layout}` · `lib/` (CMS client, schemas, seo helpers) · `sanity/` (studio + schema) · `public/`.

## 16. Backend Architecture

Deliberately serverless-thin — nothing to maintain:

- **No custom server.** All dynamic behavior via Server Actions and Route Handlers.
- **Contact/brief form** → Server Action: Zod validation → Resend email to you + auto-acknowledgement to the lead → lead also persisted as a document in the CMS (`lead` type) so you have a built-in mini-CRM. Honeypot + rate limit (no CAPTCHA friction).
- **Newsletter** (footer, optional phase 2): Resend Audiences.
- **CMS webhook** → `/api/revalidate` for on-demand ISR.
- **Redirect map** for all legacy `.html` URLs in `next.config`.

## 17. CMS Structure

**Sanity** (recommended: generous free tier, real-time visual editing with live preview inside your actual site design, portable content model). Everything you listed becomes editable without code:

```
siteSettings   nav, footer, socials, contact info, availability badge, default SEO
homePage       every section's copy, featured work refs, stats
service (×6)   hero copy, deliverables[], process[], faqs[], related work rules, seo
project        title, slug, format, niches[], youtubeId, thumbnail, previewClip,
               featured?, caseStudy? {client, challenge, approach, results[]}, order
testimonial    quote, name, role, avatar?, source, featured?
teamMember     name, role, photo, order
faq            question, answer, category
post           title, slug, cover, body (portable text), seo, publishedAt
pricingPlan    name, price, unit, features[], highlighted?
page           generic legal/utility pages
lead           (write-only, from form submissions)
```

Studio hosted at `/studio` (behind your login). Every document type has live preview. You edit a testimonial on your phone; the site updates in ~10 seconds.

## 18. Performance Strategy

Budgets (mobile, Lighthouse): **Performance ≥ 95 · LCP < 2.0s · CLS < 0.02 · INP < 200ms · JS on Home < 220KB gzipped.**

- Hero poster image `priority` + AVIF/WebP via `next/image`; showreel video streams in after LCP.
- YouTube never loads an iframe until click (facade pattern) — this alone is worth ~1MB/embed vs. the current site.
- GSAP/Lenis loaded in a client boundary after hydration; R3F dynamically imported, desktop + `prefers-reduced-motion: no-preference` only.
- Hover preview clips: ≤ 400KB WebM, `preload="none"`, loaded on hover intent, capped concurrency.
- Font subsetting, exactly 5 font files total.
- All images through the CMS get automatic srcsets, blur placeholders, and enforced dimensions (zero CLS).
- CI check: Lighthouse budget assertion on every deploy.

## 19. Accessibility Strategy

- WCAG 2.2 AA. All text tokens verified ≥ 4.5:1 on all `--ink-*` surfaces (the palette in §10 already passes; gradient text always ≥ 3:1 with a solid fallback).
- Full keyboard support: visible focus rings (2px `--pulse-blue` offset ring), focus trap in lightbox/mobile menu, skip-to-content link.
- Semantic landmarks, single-h1, logical heading order (enforced by lint).
- All motion behind `prefers-reduced-motion` (§12.7); autoplaying previews are muted, decorative, and `aria-hidden` with the real content in text.
- Forms: proper labels, described errors (`aria-describedby`), no placeholder-as-label.
- Video lightbox: keyboard operable, labeled controls; captions supported where source videos have them (recommended for hero case studies).
- Automated axe checks in CI + manual keyboard/screen-reader pass before launch.

---

## Build Plan (after your approval)

| Phase | Scope |
|---|---|
| **1. Foundation** | Next.js scaffold, design tokens, typography, Nav/Footer, motion providers, loader |
| **2. Home** | Full home page with hero, all sections, closer — the design-language proof |
| **3. Work** | Portfolio grid + filters + lightbox + first case studies (migrating your existing 170 videos) |
| **4. Services ×6 + Pricing** | Templates + copy |
| **5. About / Contact / Blog** | Remaining pages, forms, Cal.com |
| **6. CMS + SEO + polish** | Sanity wiring, schema/JSON-LD, redirects, performance & a11y QA |

Each phase lands as reviewable pushes to this branch, page by page, as you requested.

---

### Open items needing your input (none block Phase 1)

1. **Approve or adjust** the brand direction (gradient palette §10, fonts §11, tagline §1.6).
2. **Portfolio assets**: the project videos you mentioned, your top 15–20 for case studies, and any publishable client names/metrics.
3. **Pricing**: show numbers publicly or "get a quote"? (Structure supports both.)
4. **Booking**: do you have a Cal.com/Calendly account, and which email should receive leads?
