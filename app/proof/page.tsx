import type { Metadata } from "next";
import { companyConfig } from "@/config/company";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ProofDossierClient } from "./ProofDossierClient";

export const metadata: Metadata = {
  title: "Verified Meta Ads Campaign Proof & Video Walkthroughs",
  description:
    "Watch unedited backend Meta Ads Manager walkthroughs showing real client accounts, Opportunity Scores, and verified lead acquisition across LED lighting, ayurveda, dental clinics, roofing, furniture, real estate, and education.",
  alternates: { canonical: "/proof" },
  openGraph: {
    title: `Verified Meta Ads Campaign Proof | ${companyConfig.company.name}`,
    description:
      "Watch unedited backend Meta Ads Manager walkthroughs showing real client accounts, Opportunity Scores, and verified lead acquisition across 8 industries.",
    url: "/proof",
    type: "website",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "Digitrust Solutions Meta Ads Proof" }],
  },
  other: {
    "geo.region": "IN-HR",
    "geo.placename": "Gurugram, Haryana",
    "geo.position": "28.5033;77.0396",
    "ICBM": "28.5033, 77.0396",
  },
};

export default function ProofPage() {
  const siteUrl = companyConfig.seo.siteUrl;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Verified Meta Ads Campaign Proof & Walkthroughs",
        url: `${siteUrl}/proof`,
        description:
          "Watch unedited backend Meta Ads Manager walkthroughs showing real client accounts, Opportunity Scores, and lead acquisition across 8 distinct industries.",
        publisher: {
          "@type": "Organization",
          name: companyConfig.company.name,
          url: siteUrl,
          logo: `${siteUrl}/brand/logo.png`,
          telephone: ["+91 92117 34699", "+91 92172 13181"],
          email: "digitrustsolutions@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Palam Vihar",
            addressLocality: "Gurugram",
            addressRegion: "Haryana",
            postalCode: "122017",
            addressCountry: "IN",
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Client Proof & Results",
            item: `${siteUrl}/proof`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <main className="proof-page-main">
        <div className="container">
          <ProofDossierClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
