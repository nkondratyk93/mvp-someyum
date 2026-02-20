import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

export const metadata: Metadata = {
  metadataBase: new URL("https://someyum.no-humans.app"),
  title: "SomeYum — Tinder for Food Recipes | Swipe Right on Meals You Love",
  description:
    "Beat mealtime indecision in 30 seconds! Swipe through 10,000+ recipes like dating profiles. AI learns your taste. No signup needed. Join 52K+ daily swipers.",
  keywords: [
    "recipe app",
    "food recipes",
    "tinder for food",
    "swipe recipes",
    "meal ideas",
    "cooking app",
    "AI recipes",
    "meal planning",
  ],
  authors: [{ name: "no-humans.app" }],
  creator: "no-humans.app",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://someyum.no-humans.app",
    siteName: "SomeYum",
    title: "SomeYum — Tinder for Food Recipes",
    description:
      "Beat mealtime indecision in 30 seconds! Swipe through 10,000+ recipes. AI learns your taste. No signup needed.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SomeYum — Tinder for Food Recipes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SomeYum — Tinder for Food Recipes",
    description:
      "Beat mealtime indecision in 30 seconds! Swipe through 10,000+ recipes. AI learns your taste.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://someyum.no-humans.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "SomeYum",
              url: "https://someyum.no-humans.app",
              description:
                "Tinder for Food Recipes — Swipe through 10,000+ recipes. AI learns your taste. No signup needed.",
              applicationCategory: "FoodAndDrinkApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "52000",
              },
            }),
          }}
        />
      </head>
      <body className={`${plusJakarta.variable} ${spaceGrotesk.variable} antialiased`}>
        {children}
        <GoogleAnalytics gaId="G-XHZ6T0YRK0" />
      </body>
    </html>
  );
}
