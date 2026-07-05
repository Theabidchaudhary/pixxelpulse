# Orvix — Premium Creative Agency Website

The new pixxelpulse.com: a dark, premium Next.js site for a video editing & motion design agency.
Design system, strategy, and architecture are documented in [`docs/BLUEPRINT.md`](docs/BLUEPRINT.md).

## Stack

- **Next.js 15** (App Router, TypeScript, static generation)
- **Tailwind CSS v4** — design tokens live in `app/globals.css`
- **Framer Motion** (reveals, page transitions, FLIP grid) + **Lenis** (smooth scroll)
- Custom canvas particle field & cursor glow (no three.js — keeps the JS budget lean)
- Self-hosted variable fonts: Space Grotesk (display), Geist (body), Geist Mono (labels)

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (39 static pages)
```

## Editing content (no code required)

All copy and data live in `content/` as plain, typed files:

| File | What it controls |
|---|---|
| `content/site.ts` | Name, email, phone, socials, stats, availability badge, booking URL |
| `content/projects.json` | All 165 portfolio items (title, format, niches, YouTube ID) |
| `content/services.ts` | The 6 service pages — copy, deliverables, process, FAQs, SEO |
| `content/testimonials.ts` | Client quotes |
| `content/team.ts` | Team members |
| `content/faqs.ts` | Global FAQ |
| `content/pricing.ts` | Plans, prices, features |
| `content/posts.ts` | Blog articles |

Curate which projects lead the portfolio (and get detail pages) via `FEATURED_SLUGS` in `lib/content.ts`.

This content layer is shaped like a CMS schema on purpose — swapping it for Sanity later
(per the blueprint) means replacing the imports in `lib/content.ts` with queries, nothing else.

## Contact form

`app/contact/actions.ts` sends leads via [Resend](https://resend.com). Copy `.env.example`
to `.env.local` and set `RESEND_API_KEY` + `LEAD_EMAIL`. Without a key, submissions are
logged to the server console (dev mode). Spam is filtered with a honeypot field.

To enable the "Book a call" embed link, set `bookingUrl` in `content/site.ts` to your
Cal.com/Calendly URL.

## SEO

- Per-page metadata + canonical URLs, OG/Twitter cards (`public/og.png`)
- JSON-LD: Organization, Service, VideoObject, FAQPage, BreadcrumbList, Article
- `sitemap.xml` + `robots.txt` generated from content
- 301 redirects from all legacy `.html` URLs (see `next.config.ts`)

## Legacy site

The previous static website is preserved untouched in `legacy/` for reference and asset
recovery. It is excluded from the build.
