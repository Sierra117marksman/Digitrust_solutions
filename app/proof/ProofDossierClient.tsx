"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

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

interface ScreenshotCaseStudy {
  id: string;
  industry: string;
  title: string;
  emoji: string;
  badge: string;
  imageSrc: string;
  totalLeads: string;
  costPerLead: string;
  leadsConverted: string;
  conversionRate: string;
  accountShown: string;
  campaignShown: string;
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

const SCREENSHOT_CASE_STUDIES: ScreenshotCaseStudy[] = [
  {
    id: "roofing-b2b",
    industry: "Roofing Business (B2B)",
    title: "Commercial & Industrial Roofing Leads",
    emoji: "🏗️",
    badge: "B2B Lead Generation",
    imageSrc: "/images/proof/roofing-b2b.png",
    totalLeads: "74 Leads",
    costPerLead: "₹6.00",
    leadsConverted: "7 Clients",
    conversionRate: "9.4%",
    accountShown: "Digitrust (138692528659...) • Opportunity Score: 83",
    campaignShown: "Digitrust || Awareness Campaign",
    whatsappMessage: "Hi Digitrust Solutions, I saw your B2B Roofing case study (74 leads, ₹6 CPL, 9.4% conversion). Let's discuss B2B commercial leads for my business."
  },
  {
    id: "dental-clinic",
    industry: "Dentist — Dental Clinic",
    title: "Clinic Patient Inbound Appointment Calls",
    emoji: "🦷",
    badge: "Healthcare & Clinic",
    imageSrc: "/images/proof/dental-clinic.png",
    totalLeads: "57 Calls",
    costPerLead: "₹8.00 / call",
    leadsConverted: "6 Appointments",
    conversionRate: "~11%",
    accountShown: "Dental clinic (109960139...) • Opportunity Score: 100",
    campaignShown: "Digitrust|| New Leads|| Lucknow Targetting",
    whatsappMessage: "Hi Digitrust Solutions, I saw your Dental Clinic campaign results (57 appointment calls, ₹8 cost/call, 11% conversion). Let's discuss clinic patient bookings."
  },
  {
    id: "furniture-business",
    industry: "Furniture Business",
    title: "High-Ticket Furniture Store Inquiries",
    emoji: "🛋️",
    badge: "Retail & Showroom",
    imageSrc: "/images/proof/furniture-business.png",
    totalLeads: "55 Leads",
    costPerLead: "₹18.49",
    leadsConverted: "5 Buyers",
    conversionRate: "11%",
    accountShown: "Digitrust x Valmont furniture",
    campaignShown: "Digitrust || Leads campaign",
    whatsappMessage: "Hi Digitrust Solutions, I saw your Furniture business case study (55 leads, ₹18.49 CPL, 11% conversion). Let's discuss lead generation for my store."
  },
  {
    id: "coaching-institute",
    industry: "Professional Coaching Institute",
    title: "Digital Academy Student Admissions",
    emoji: "📚",
    badge: "Education & Coaching",
    imageSrc: "/images/proof/coaching-institute.png",
    totalLeads: "34 Leads",
    costPerLead: "₹53.00",
    leadsConverted: "4 Admissions",
    conversionRate: "~12%",
    accountShown: "Saffron Digital Academy ...",
    campaignShown: "Digitrust x SAM Leads Campaign 1",
    whatsappMessage: "Hi Digitrust Solutions, I saw your Coaching Institute campaign results (34 leads, ₹53 CPL, 12% conversion). Let's discuss student leads for my institute."
  },
  {
    id: "real-estate",
    industry: "Real Estate Properties",
    title: "High-Ticket Real Estate Buyer Leads",
    emoji: "🏢",
    badge: "Property & Construction",
    imageSrc: "/images/proof/real-estate-leads.png",
    totalLeads: "14 Leads",
    costPerLead: "₹65.00",
    leadsConverted: "1 Closed Buyer",
    conversionRate: "7%",
    accountShown: "LiveWellRealEstate (1438...)",
    campaignShown: "Digitrust x Live well || Leads",
    whatsappMessage: "Hi Digitrust Solutions, I saw your Real Estate campaign numbers (14 leads, ₹65 CPL, 7% conversion). Let's discuss high-ticket buyer leads."
  }
];

export function ProofDossierClient() {
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [activeModalItem, setActiveModalItem] = useState<ScreenshotCaseStudy | null>(null);

  const handlePlay = (playingId: string) => {
    Object.entries(videoRefs.current).forEach(([id, videoEl]) => {
      if (id !== playingId && videoEl && !videoEl.paused) {
        videoEl.pause();
      }
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModalItem(null);
      }
    };
    if (activeModalItem) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModalItem]);

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
            <span>4 VIDEO RECORDINGS • 5 VERIFIED CASE STUDIES</span>
          </div>
        </div>

        {/* Section 1: Video Proof Vault */}
        <div className="proof-section-block">
          <div className="proof-title-area">
            <div className="proof-section-tag">TIER 1 • RECORDED VIDEO PROOF</div>
            <h1 className="proof-main-title">Uncut Meta Ads Manager Video Walkthroughs</h1>
            <p className="proof-main-desc">
              Direct unedited phone recordings inside active client Meta Ads Manager accounts — real Opportunity Scores, campaign delivery structures, and messaging lead flows.
            </p>
          </div>

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
        </div>

        {/* Section 2: Verified Screenshots & Unit Economics */}
        <div className="proof-section-block proof-screenshots-section">
          <div className="proof-section-divider" aria-hidden="true" />
          
          <div className="proof-title-area">
            <div className="proof-section-tag">TIER 2 • DASHBOARD DATA &amp; UNIT ECONOMICS</div>
            <h2 className="proof-main-title">Verified Lead Acquisition &amp; Cost Metrics</h2>
            <p className="proof-main-desc">
              Real performance data and backend dashboard exports across 5 distinct industries — showing exact lead counts, verified Cost Per Lead (CPL), and confirmed conversion ratios.
            </p>
          </div>

          <div className="proof-cases-grid" role="region" aria-label="Verified Client Case Studies">
            {SCREENSHOT_CASE_STUDIES.map((study) => {
              const studyWaUrl = `${waBaseUrl}?text=${encodeURIComponent(study.whatsappMessage)}`;

              return (
                <article key={study.id} className="proof-case-card">
                  
                  {/* Case Card Top Header */}
                  <div className="proof-case-header">
                    <div className="proof-case-title-row">
                      <span className="proof-case-emoji">{study.emoji}</span>
                      <div>
                        <h3 className="proof-case-industry">{study.industry}</h3>
                        <p className="proof-case-subtitle">{study.title}</p>
                      </div>
                    </div>
                    <span className="proof-chip">{study.badge}</span>
                  </div>

                  {/* 4-Stat Metric Summary Matrix */}
                  <div className="proof-metrics-grid">
                    <div className="proof-metric-cell">
                      <span className="proof-metric-label">Total Leads</span>
                      <strong className="proof-metric-val">{study.totalLeads}</strong>
                    </div>
                    <div className="proof-metric-cell">
                      <span className="proof-metric-label">Avg. Cost / Lead</span>
                      <strong className="proof-metric-val proof-val-highlight">{study.costPerLead}</strong>
                    </div>
                    <div className="proof-metric-cell">
                      <span className="proof-metric-label">Converted</span>
                      <strong className="proof-metric-val">{study.leadsConverted}</strong>
                    </div>
                    <div className="proof-metric-cell">
                      <span className="proof-metric-label">Conversion Rate</span>
                      <strong className="proof-metric-val proof-val-success">{study.conversionRate}</strong>
                    </div>
                  </div>

                  {/* Dashboard Screenshot Preview with Lightbox trigger */}
                  <div 
                    className="proof-case-image-box"
                    onClick={() => setActiveModalItem(study)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveModalItem(study);
                      }
                    }}
                    aria-label={`View full size Ads Manager dashboard screenshot for ${study.industry}`}
                  >
                    <Image
                      src={study.imageSrc}
                      alt={`${study.industry} Meta Ads Manager Dashboard`}
                      width={1000}
                      height={480}
                      className="proof-case-thumbnail"
                    />
                    <div className="proof-case-overlay">
                      <span className="proof-overlay-badge">🔍 Click to inspect full dashboard</span>
                    </div>
                  </div>

                  {/* Account & Campaign Info on Screen */}
                  <div className="proof-case-account-info">
                    <div className="proof-case-line">
                      <span className="proof-sub-label">Account on Screen:</span>
                      <code>{study.accountShown}</code>
                    </div>
                    <div className="proof-case-line">
                      <span className="proof-sub-label">Primary Campaign:</span>
                      <span className="proof-campaign-name">{study.campaignShown}</span>
                    </div>
                  </div>

                  {/* Individual WhatsApp Action */}
                  <div className="proof-case-footer">
                    <a
                      href={studyWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="proof-card-wa-btn"
                      aria-label={`Inquire about ${study.industry} marketing with Digitrust Solutions on WhatsApp`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.777.82 2.791.82 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.768-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.764 0-3.421-.462-4.869-1.268l-7.131 1.868 1.898-6.945c-.908-1.516-1.428-3.29-1.428-5.187 0-5.514 4.486-10 10-10 5.514 0 10 4.486 10 10z"/>
                      </svg>
                      <span>Discuss {study.industry.split("—")[0].trim()} on WhatsApp →</span>
                    </a>
                  </div>

                </article>
              );
            })}
          </div>
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
                href={`${waBaseUrl}?text=${encodeURIComponent("Hi Digitrust Solutions, I reviewed your verified campaign proof recordings and dashboard results. I want to discuss advertising for my business.")}`}
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

      {/* Lightbox Modal for Full Resolution Screenshot Inspection */}
      {activeModalItem && (
        <div 
          className="proof-lightbox-backdrop" 
          onClick={() => setActiveModalItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeModalItem.industry} Dashboard Inspection`}
        >
          <div className="proof-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="proof-lightbox-header">
              <div>
                <span className="proof-lightbox-tag">{activeModalItem.industry}</span>
                <h4 className="proof-lightbox-title">{activeModalItem.title}</h4>
                <div className="proof-lightbox-metrics-row">
                  <span>{activeModalItem.totalLeads}</span>
                  <span>•</span>
                  <span>CPL: {activeModalItem.costPerLead}</span>
                  <span>•</span>
                  <span>{activeModalItem.leadsConverted}</span>
                  <span>•</span>
                  <span style={{ color: "#34d399", fontWeight: 700 }}>Conversion: {activeModalItem.conversionRate}</span>
                </div>
              </div>
              <button 
                className="proof-lightbox-close"
                onClick={() => setActiveModalItem(null)}
                aria-label="Close dashboard inspection"
              >
                ✕
              </button>
            </div>

            <div className="proof-lightbox-image-wrap">
              <Image
                src={activeModalItem.imageSrc}
                alt={`${activeModalItem.industry} Dashboard Screenshot`}
                width={1920}
                height={1080}
                className="proof-lightbox-full-img"
              />
            </div>

            <div className="proof-lightbox-footer">
              <div className="proof-lightbox-account">
                <strong>Account on Screen:</strong> {activeModalItem.accountShown}
              </div>
              <a
                href={`${waBaseUrl}?text=${encodeURIComponent(activeModalItem.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="proof-card-wa-btn"
                style={{ maxWidth: "260px" }}
              >
                Discuss on WhatsApp →
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
