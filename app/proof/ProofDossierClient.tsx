"use client";

import { useState } from "react";
import Link from "next/link";

interface CampaignItem {
  id: string;
  name: string;
  emoji: string;
  title: string;
  description: string;
  videoSrc: string;
  posterSrc: string;
  duration: string;
  accountName: string;
  accountSnippet?: string;
  opportunityScore?: number;
  deliveryStatus: string;
  campaigns: string[];
  campaignNote: string;
  whatsappMessage: string;
}

const CAMPAIGNS: CampaignItem[] = [
  {
    id: "ayurved",
    name: "Aayurvira Wellness",
    emoji: "🌿",
    title: "Aayurvira Wellness — Meta Ads Backend Walkthrough",
    description: "Unedited screen recording showing active campaigns, opportunity scores, and backend delivery metrics directly inside Meta Ads Manager.",
    videoSrc: "/videos/proof/ayurved-wellness.mp4",
    posterSrc: "/videos/proof/poster-ayurved.jpg",
    duration: "23s Recording",
    accountName: "Aayurvira Wellness",
    accountSnippet: "Account ID: (9509...)",
    opportunityScore: 89,
    deliveryStatus: "Active Ads Delivery",
    campaigns: [
      "Digitrust || campaign || 2 October 2026",
      "neuro vira leads"
    ],
    campaignNote: "3 active campaigns in delivery",
    whatsappMessage: "Hi Digitrust Solutions, I watched the Aayurvira Wellness Meta Ads walkthrough. Let's discuss marketing for my business."
  },
  {
    id: "furniture",
    name: "Valmont Furniture",
    emoji: "🛋️",
    title: "Valmont Furniture — Meta Ads Lead Generation",
    description: "Live Ads Manager screen recording displaying Valmont luxury furniture lead generation and messaging campaigns with 100 Opportunity Score.",
    videoSrc: "/videos/proof/furniture-shop.mp4",
    posterSrc: "/videos/proof/poster-furniture.jpg",
    duration: "26s Recording",
    accountName: "Digitrust x Valmont furniture",
    opportunityScore: 100,
    deliveryStatus: "Messaging Conversations",
    campaigns: [
      "Digitrust x Valmont || Leads Campaign",
      "Digitrust || Leads campaign"
    ],
    campaignNote: "Results from 2 campaigns",
    whatsappMessage: "Hi Digitrust Solutions, I watched the Valmont Furniture campaign walkthrough. Let's discuss lead generation for my business."
  },
  {
    id: "realestate",
    name: "Livewell Real Estate",
    emoji: "🏢",
    title: "Livewell Real Estate — High-Ticket Property Leads",
    description: "Direct verification of live real estate lead generation campaigns with messaging conversations and qualified buyer inquiries.",
    videoSrc: "/videos/proof/real-estate.mp4",
    posterSrc: "/videos/proof/poster-realestate.jpg",
    duration: "20s Recording",
    accountName: "LivewellRealEstate",
    opportunityScore: 97,
    deliveryStatus: "Messaging Conversions",
    campaigns: [
      "Digitrust x Live well || Leads - Copy",
      "Digitrust x Live well || Leads"
    ],
    campaignNote: "Results from 4 campaigns",
    whatsappMessage: "Hi Digitrust Solutions, I saw the Livewell Real Estate walkthrough. Can we talk about real estate buyer lead generation?"
  },
  {
    id: "academy",
    name: "Multimedia Academy",
    emoji: "🎓",
    title: "Multimedia Academy — Creative Education Growth",
    description: "Screen recording showcasing student portfolio work, engagement, and education lead generation across social channels.",
    videoSrc: "/videos/proof/marketing-academy.mp4",
    posterSrc: "/videos/proof/poster-academy.jpg",
    duration: "25s Recording",
    accountName: "SAM Multimedia Academy",
    deliveryStatus: "Student Creative Portfolios",
    campaigns: [
      "Student creative portfolios",
      "Event & Workshop promotions"
    ],
    campaignNote: "Admission & course lead pipelines",
    whatsappMessage: "Hi Digitrust Solutions, I saw your Multimedia Academy walkthrough. Want to discuss education & student intake lead campaigns."
  }
];

export function ProofDossierClient() {
  const [activeId, setActiveId] = useState("ayurved");
  const active = CAMPAIGNS.find(c => c.id === activeId) || CAMPAIGNS[0];

  const waBaseUrl = "https://wa.me/919211734699";
  const waUrl = `${waBaseUrl}?text=${encodeURIComponent(active.whatsappMessage)}`;

  return (
    <div className="proof-dossier-wrapper">
      <div className="proof-dossier-card">
        
        {/* Header Strip */}
        <div className="proof-card-header">
          <div>
            <div className="proof-brand-mark">
              DIGITRUST <span>SOLUTIONS</span>
            </div>
            <p className="proof-brand-sub">Client Campaign Case Studies &amp; Verified Results</p>
          </div>
          <div className="proof-status-pill">
            <span className="proof-dot" aria-hidden="true" />
            <span>UNCUT ADS MANAGER RECORDINGS</span>
          </div>
        </div>

        {/* 4 Campaign Tabs */}
        <div className="proof-tabs-list" role="tablist" aria-label="Client Case Studies">
          {CAMPAIGNS.map(camp => {
            const isSelected = camp.id === activeId;
            return (
              <button
                key={camp.id}
                role="tab"
                aria-selected={isSelected}
                className={`proof-tab-btn ${isSelected ? "is-active" : ""}`}
                onClick={() => setActiveId(camp.id)}
              >
                <span className="proof-tab-emoji">{camp.emoji}</span>
                <span>{camp.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Title & Description */}
        <div className="proof-title-area">
          <h1 className="proof-main-title">{active.title}</h1>
          <p className="proof-main-desc">{active.description}</p>
        </div>

        {/* Two-Column Responsive Split */}
        <div className="proof-content-grid">
          
          {/* Left Column: 9:16 Vertical Video Player */}
          <div className="proof-video-col">
            <div className="proof-video-box">
              <div className="proof-video-frame">
                <video
                  key={active.videoSrc}
                  src={active.videoSrc}
                  poster={active.posterSrc}
                  controls
                  playsInline
                  preload="metadata"
                  className="proof-video-element"
                >
                  Your browser does not support HTML5 video playback.
                </video>
              </div>
              <div className="proof-video-meta">
                <span><strong>FEED:</strong> Screen Capture</span>
                <span>{active.duration}</span>
                <span className="proof-quality-badge">1080p HD Web</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Details & Direct CTA */}
          <div className="proof-details-col">
            <div className="proof-details-card">
              
              <div className="proof-meta-row">
                <div className="proof-meta-label">Verified Account on Screen:</div>
                <div className="proof-meta-content">
                  <strong>{active.accountName}</strong>
                  <div className="proof-chips-row">
                    {active.accountSnippet && (
                      <span className="proof-chip">{active.accountSnippet}</span>
                    )}
                    {typeof active.opportunityScore === "number" && (
                      <span className="proof-chip proof-chip-score">
                        Opportunity Score: {active.opportunityScore}
                      </span>
                    )}
                    <span className="proof-chip">{active.deliveryStatus}</span>
                  </div>
                </div>
              </div>

              <div className="proof-meta-row">
                <div className="proof-meta-label">Campaign Structure Shown in Video:</div>
                <div className="proof-meta-content">
                  <ul className="proof-campaigns-list">
                    {active.campaigns.map((name, i) => (
                      <li key={i}>
                        <code>{name}</code>
                      </li>
                    ))}
                  </ul>
                  <div className="proof-campaign-note">({active.campaignNote})</div>
                </div>
              </div>

              <div className="proof-cta-block">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proof-whatsapp-btn"
                  aria-label="Discuss your campaign with Digitrust Solutions on WhatsApp"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.777.82 2.791.82 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.768-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.764 0-3.421-.462-4.869-1.268l-7.131 1.868 1.898-6.945c-.908-1.516-1.428-3.29-1.428-5.187 0-5.514 4.486-10 10-10 5.514 0 10 4.486 10 10z"/>
                  </svg>
                  <span>Discuss Your Campaign with Digitrust Solutions on WhatsApp</span>
                </a>
                <p className="proof-cta-subtext">Direct WhatsApp chat • Zero sales pressure</p>
              </div>

              <div className="proof-links-row">
                <Link href="/services/meta-ads" className="proof-service-link">
                  Explore Meta Ads Management Service →
                </Link>
                <Link href="/services/ecommerce-account-management" className="proof-service-link">
                  Explore Marketplace Services (Amazon, Flipkart &amp; Meesho) →
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
