import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Digitrust Solutions | Digital Growth & Full-Stack Development",
    template: "%s | Digitrust Solutions", //git comment
  },
  description:
    "Digitrust Solutions is a Gurugram-based digital agency specialising in web development, social media, SEO, Meta ads, and full-stack development.",
  keywords: [
    "Digitrust Solutions",
    "web development Gurugram",
    "social media marketing",
    "SEO services",
    "Meta ads",
    "full stack development",
  ],
  icons: {
    icon: "/brand/logo.svg",
    shortcut: "/brand/logo.svg",
    apple: "/brand/logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Digitrust Solutions | Ideas that move business forward",
    description:
      "Strategy, creative marketing, and full-stack technology for confident digital growth.",
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
    title: "Digitrust Solutions",
    description: "Digital growth, built on trust.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
