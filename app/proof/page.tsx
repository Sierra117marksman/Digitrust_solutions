import type { Metadata } from "next";
import { companyConfig } from "@/config/company";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ProofDossierClient } from "./ProofDossierClient";

export const metadata: Metadata = {
  title: "Verified Meta Ads Campaign Proof & Video Walkthroughs | Digitrust Solutions",
  description: "Watch unedited backend Meta Ads Manager walkthroughs showing real client accounts, Opportunity Scores, and lead acquisition across wellness, furniture, real estate, and education.",
  alternates: { canonical: "/proof" },
  openGraph: {
    title: `Verified Meta Ads Campaign Proof | ${companyConfig.company.name}`,
    description: "Watch unedited backend Meta Ads Manager walkthroughs showing real client accounts, Opportunity Scores, and lead acquisition.",
    url: "/proof",
    type: "website",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "Digitrust Solutions Meta Ads Proof" }],
  },
};

export default function ProofPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://digitrustsolutions.in";

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Verified Meta Ads Campaign Proof & Walkthroughs",
        url: `${siteUrl}/proof`,
        description: "Watch unedited backend Meta Ads Manager walkthroughs showing real client accounts, Opportunity Scores, and lead acquisition.",
        publisher: {
          "@type": "Organization",
          name: companyConfig.company.name,
          url: siteUrl,
          logo: `${siteUrl}/brand/logo.png`,
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
