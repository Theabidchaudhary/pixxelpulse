import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Preloader from "@/components/fx/Preloader";
import CursorGlow from "@/components/fx/CursorGlow";
import { site } from "@/content/site";
import { JsonLd, organizationJsonLd } from "@/lib/seo";

const spaceGrotesk = localFont({
  src: "../public/fonts/space-grotesk-var.woff2",
  variable: "--font-space-grotesk",
  weight: "300 700",
  display: "swap",
});
const geist = localFont({
  src: "../public/fonts/geist-var.woff2",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
});
const geistMono = localFont({
  src: "../public/fonts/geist-mono-var.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Premium Video Editing Agency`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "video editing agency",
    "short form video editing",
    "youtube video editing service",
    "motion graphics studio",
    "video post-production",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    url: site.url,
    title: `${site.name} — Premium Video Editing Agency`,
    description: site.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Pixxelpulse — post-production that moves people" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Premium Video Editing Agency`,
    description: site.description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#060709",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body className="noise">
        <JsonLd data={organizationJsonLd()} />
        <Preloader />
        <CursorGlow />
        <Nav />
        <SmoothScroll>
          <main id="main">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
