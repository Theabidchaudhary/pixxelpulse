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

const poppins = localFont({
  src: [
    { path: "../public/fonts/poppins-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/poppins-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/poppins-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/poppins-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
});
const instrument = localFont({
  src: "../public/fonts/instrument-serif-latin-400-italic.woff2",
  variable: "--font-instrument",
  weight: "400",
  style: "italic",
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
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Orwyx — post-production that moves people" }],
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
      className={`${poppins.variable} ${instrument.variable} ${geistMono.variable}`}
    >
      <body className="noise">
        <JsonLd data={organizationJsonLd()} />
        <Preloader />
        <CursorGlow />
        <Nav />
        <SmoothScroll>
          {/* main stacks above the footer, which sits pinned behind the last
              dark block and is revealed through its rounded bottom cap */}
          <main id="main" className="relative z-10">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
