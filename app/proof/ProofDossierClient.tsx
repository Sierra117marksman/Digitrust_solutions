"use client";

import { useRef } from "react";
import Link from "next/link";

interface CampaignItem {
  id: string;
  name: string;
  emoji: string;
  industry: string;
  videoSrc: string;
  posterSrc: string;
  duration: string;
  accountName: string;
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
    industry: "Health & Ayurveda",
    videoSrc: "/videos/proof/ayurved-wellness.mp4",
    posterSrc: "/videos/proof/poster-ayurved.jpg",
    duration: "23s Recording",
    accountName: "Aayurvira Wellness (9509...)",
    opportunityScore: 89,
    deliveryStatus: "Active Delivery",
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
    industry: "Luxury Furniture",
    videoSrc: "/videos/proof/furniture-shop.mp4",
    posterSrc: "/videos/proof/poster-furniture.jpg",
    duration: "26s Recording",
    accountName: "Digitrust x Valmont furniture",
    opportunityScore: 100,
    deliveryStatus: "Messaging Leads",
    campaigns: [
      "Digitrust x Valmont || Leads Campaign",
      "Digitrust || Leads campaign"
    ],
    campaignNote: "Results from 2 active campaigns",
    whatsappMessage: "Hi Digitrust Solutions, I watched the Valmont Furniture campaign walkthrough. Let's discuss lead generation for my business."
  },
  {
    id: "realestate",
    name: "Livewell Real Estate",
    emoji: "🏢",
    industry: "Real Estate Properties",
    videoSrc: "/videos/proof/real-estate.mp4",
    posterSrc: "/videos/proof/poster-realestate.jpg",
    duration: "20s Recording",
    accountName: "LivewellRealEstate",
    opportunityScore: 97,
    deliveryStatus: "Buyer Conversations",
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
    industry: "Creative Education",
    videoSrc: "/videos/proof/marketing-academy.mp4",
    posterSrc: "/videos/proof/poster-academy.jpg",
    duration: "25s Recording",
    accountName: "SAM Multimedia Academy",
    deliveryStatus: "Student Portfolios",
    campaigns: [
      "Student creative portfolios",
      "Event & Workshop promotions"
    ],
    campaignNote: "Admission & course lead pipelines",
    whatsappMessage: "Hi Digitrust Solutions, I saw your Multimedia Academy walkthrough. Want to discuss education & student intake lead campaigns."
  }
];

export function ProofDossierClient() {
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const handlePlay = (playingId: string) => {
    Object.entries(videoRefs.current).forEach(([id, videoEl]) => {
      if (id !== playingId && videoEl && !videoEl.paused) {
        videoEl.pause();
      }
    });
  };

  const waBaseUrl = "https://wa.me/919211734699";

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
            <span>4 UNCUT ADS MANAGER RECORDINGS</span>
          </div>
        </div>

        {/* Title & Introduction */}
        <div className="proof-title-area">
          <h1 className="proof-main-title">Live Meta Ads Performance &amp; Backend Walkthroughs</h1>
          <p className="proof-main-desc">
            Direct unedited phone recordings inside active client Meta Ads Manager accounts — real Opportunity Scores, campaign delivery structures, and messaging lead flows.
          </p>
        </div>

        {/* Showcase Box: All 4 Videos in One Place */}
        <div className="proof-video-grid" role="region" aria-label="Verified Video Proof Vault">
          {CAMPAIGNS.map((camp) => {
            const cardWaUrl = `${waBaseUrl}?text=${encodeURIComponent(camp.whatsappMessage)}`;

            return (
              <article key={camp.id} className="proof-video-card">
                
                {/* Video Card Top Header */}
                <div className="proof-video-card-top">
                  <div className="proof-card-top-row">
                    <span className="proof-card-emoji">{camp.emoji}</span>
                    <h2 className="proof-card-client-name">{camp.name}</h2>
                  </div>
                  <div className="proof-card-badge-row">
                    <span className="proof-card-industry">{camp.industry}</span>
                    {typeof camp.opportunityScore === "number" ? (
                      <span className="proof-chip proof-chip-score" title="Meta Ads Manager Opportunity Score">
                        Score: {camp.opportunityScore}
                      </span>
                    ) : (
                      <span className="proof-chip" title="Campaign Delivery Status">
                        {camp.deliveryStatus}
                      </span>
                    )}
                  </div>
                </div>

                {/* 9:16 Vertical Video Player Box */}
                <div className="proof-video-box">
                  <div className="proof-video-frame">
                    <video
                      ref={(el) => {
                        videoRefs.current[camp.id] = el;
                      }}
                      src={camp.videoSrc}
                      poster={camp.posterSrc}
                      controls
                      playsInline
                      preload="metadata"
                      onPlay={() => handlePlay(camp.id)}
                      className="proof-video-element"
                      aria-label={`${camp.name} Meta Ads Manager video walkthrough`}
                    >
                      Your browser does not support HTML5 video playback.
                    </video>
                  </div>
                  <div className="proof-video-meta">
                    <span><strong>FEED:</strong> Screen Capture</span>
                    <span>{camp.duration}</span>
                    <span className="proof-quality-badge">1080p HD</span>
                  </div>
                </div>

                {/* Video Evidence Summary */}
                <div className="proof-video-card-body">
                  <div className="proof-card-account-line">
                    <span className="proof-sub-label">Account on Screen:</span>
                    <strong className="proof-account-name">{camp.accountName}</strong>
                  </div>

                  <div className="proof-card-campaigns-block">
                    <span className="proof-sub-label">Campaigns Shown:</span>
                    <div className="proof-campaign-chips">
                      {camp.campaigns.map((cName, idx) => (
                        <code key={idx} className="proof-campaign-pill">
                          {cName}
                        </code>
                      ))}
                    </div>
                    <span className="proof-campaign-note">({camp.campaignNote})</span>
                  </div>
                </div>

                {/* Individual Direct WhatsApp Action */}
                <div className="proof-video-card-footer">
                  <a
                    href={cardWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="proof-card-wa-btn"
                    aria-label={`Discuss ${camp.name} results with Digitrust Solutions on WhatsApp`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.777.82 2.791.82 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.768-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.764 0-3.421-.462-4.869-1.268l-7.131 1.868 1.898-6.945c-.908-1.516-1.428-3.29-1.428-5.187 0-5.514 4.486-10 10-10 5.514 0 10 4.486 10 10z"/>
                    </svg>
                    <span>Discuss on WhatsApp →</span>
                  </a>
                </div>

              </article>
            );
          })}
        </div>

        {/* Global Bottom Banner: Direct Consultation & Service Navigation */}
        <div className="proof-bottom-banner">
          <div className="proof-banner-content">
            <h3 className="proof-banner-title">Want to scale your brand with proven Meta Ads?</h3>
            <p className="proof-banner-desc">
              Send your current website or ad account on WhatsApp for an unvarnished audit with zero sales pressure.
            </p>
            <div className="proof-banner-actions">
              <a
                href={`${waBaseUrl}?text=${encodeURIComponent("Hi Digitrust Solutions, I reviewed your verified campaign proof recordings. I want to discuss advertising for my business.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="proof-whatsapp-btn"
                aria-label="Discuss your campaign with Digitrust Solutions on WhatsApp"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.777.82 2.791.82 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.768-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.764 0-3.421-.462-4.869-1.268l-7.131 1.868 1.898-6.945c-.908-1.516-1.428-3.29-1.428-5.187 0-5.514 4.486-10 10-10 5.514 0 10 4.486 10 10z"/>
                </svg>
                <span>Discuss Your Campaign on WhatsApp (+91 92117 34699)</span>
              </a>
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
  );
}
