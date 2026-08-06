import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { AppToaster } from "@/components/app-toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const siteUrl = "https://hh-goa-builder.vercel.app";
const siteName = "HH Goa 2026 Builder Identity Generator";
const siteDescription =
  "Upload your photo and create your premium HH Goa 2026 Builder Identity card or circular Profile Frame in seconds. Tropical, original, mobile-first, instant download and one-click share to X.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HH Goa 2026 — Builder Identity Generator",
    template: "%s · HH Goa 2026 Builder Generator",
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "HH Goa",
    "HH Goa 2026",
    "Builder Identity",
    "Builder ID",
    "Profile Frame",
    "Builder Card Generator",
    "Hackathon",
    "Builder Generator",
    "Tropical Frame",
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
    title: "HH Goa 2026 — Builder Identity Generator",
    description: siteDescription,
    url: siteUrl,
    siteName,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HH Goa 2026 Builder Identity Generator — tropical emerald, gold and coral aesthetic",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HH Goa 2026 — Builder Identity Generator",
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
    { media: "(prefers-color-scheme: light)", color: "#FFF8E7" },
    { media: "(prefers-color-scheme: dark)", color: "#0F3A2C" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "HH Goa 2026 Builder Identity Generator",
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
    "Upload photo (JPG, PNG, WEBP, HEIC)",
    "Generate circular Profile Frame",
    "Generate Builder ID card",
    "100+ random Builder Titles",
    "1080×1080 PNG export",
    "One-click share to X",
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
        className={`${inter.variable} ${fraunces.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
