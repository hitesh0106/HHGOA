import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AppToaster } from "@/components/app-toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const siteUrl = "https://hh-goa-2026-builder-id.vercel.app";
const siteName = "HH Goa 2026 Builder ID Generator";
const siteDescription =
  "Build your HH Goa 2026 Builder ID in seconds. Upload a photo, pick your stack, get a random Builder Title, and generate a premium event badge. Instant PNG download + one-click share to X with #FrameInGoa.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HH Goa 2026 · Builder ID Generator",
    template: "%s · HH Goa 2026 Builder ID",
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "HH Goa",
    "HH Goa 2026",
    "Builder ID",
    "Builder Identity",
    "Builder ID Generator",
    "Event Badge",
    "Profile Frame",
    "Builder Card",
    "Hackathon",
    "Goa 2026",
  ],
  authors: [{ name: "HH Goa Builder Studio" }],
  creator: "HH Goa Builder Studio",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "HH Goa 2026 · Builder ID Generator",
    description: siteDescription,
    url: siteUrl,
    siteName,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HH Goa 2026 Builder ID Generator — luxury event badge for builders",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HH Goa 2026 · Builder ID Generator",
    description: siteDescription,
    images: ["/og-image.png"],
    creator: "@hhgoa",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF4E5" },
    { media: "(prefers-color-scheme: dark)", color: "#0B3A2C" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "HH Goa 2026 Builder ID Generator",
  description: siteDescription,
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  url: siteUrl,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Organization",
    name: "HH Goa Builder Studio",
  },
  featureList: [
    "Upload photo (JPG, PNG, WEBP, HEIC) — paste also supported",
    "Auto Builder Title from 100+ originals",
    "Random Fun Badges (Cloud Wizard, Bug Hunter, Prompt Engineer…)",
    "Builder Levels (Bronze, Silver, Gold, Platinum)",
    "QR Code + Unique ID Number on every card",
    "1080×1080 retina PNG export (2×)",
    "One-click Share to X with #FrameInGoa",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
