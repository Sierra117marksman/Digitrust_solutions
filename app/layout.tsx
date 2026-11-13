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

import Script from "next/script";
import { Toaster } from "react-hot-toast";
import FacebookPixel from "./components/FacebookPixel";
import { FB_PIXEL_ID } from "@/lib/fpixel";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {/* Facebook Pixel Code */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID}'); 
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <FacebookPixel />
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
