import type { Metadata } from "next";
import { companyConfig } from "@/config/company";
import "./globals.css";

const siteUrl = companyConfig.seo.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Digitrust Solutions | Digital Growth & Full-Stack Development Agency Gurugram",
    template: "%s | Digitrust Solutions",
  },
  description:
    "Digitrust Solutions is a Gurugram-based digital growth and engineering agency specializing in Meta ads, full-stack development, technical SEO, and e-commerce growth.",
  keywords: [
    "Digitrust Solutions",
    "Meta ads agency Gurugram",
    "digital marketing Gurugram",
    "web development Gurugram",
    "full stack development India",
    "technical SEO services",
    "e-commerce account management",
    "social media marketing",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/brand/logo.png",
    shortcut: "/brand/logo.png",
    apple: "/brand/logo.png",
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
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    title: "Digitrust Solutions | Digital Growth & Engineering Agency",
    description:
      "Strategic Meta advertising, full-stack engineering, technical SEO, and high-converting growth systems for modern businesses.",
    siteName: "Digitrust Solutions",
    images: [
      {
        url: "/og.png",
        width: 1734,
        height: 907,
        alt: "Digitrust Solutions - Digital growth, built on trust",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digitrust Solutions | Digital Growth & Engineering Agency",
    description: "Digital growth, verified Meta Ads ROI, and full-stack web engineering.",
    images: ["/og.png"],
  },
  other: {
    "geo.region": "IN-HR",
    "geo.placename": "Gurugram, Haryana",
    "geo.position": "28.5033;77.0396",
    "ICBM": "28.5033, 77.0396",
  },
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
