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
    name: "Ayurvedic Healthcare",
    emoji: "🌿",
    industry: "Health & Ayurveda",
    videoSrc: "/videos/proof/ayurved-wellness.mp4",
    posterSrc: "/videos/proof/poster-ayurved.jpg",
    duration: "23s Recording",
    accountName: "Digitrust Client Account (9509...)",
    opportunityScore: 89,
    deliveryStatus: "Active Delivery",
    campaigns: [
      "Digitrust || Healthcare Campaign",
      "Digitrust || Leads Campaign"
    ],
    campaignNote: "3 active campaigns in delivery",
    whatsappMessage: "Hi Digitrust Solutions, I watched your Ayurvedic Healthcare Meta Ads walkthrough. Let's discuss marketing for my business."
  },
  {
    id: "furniture",
    name: "Furniture & Home Decor",
    emoji: "🛋️",
    industry: "Luxury Furniture",
    videoSrc: "/videos/proof/furniture-shop.mp4",
    posterSrc: "/videos/proof/poster-furniture.jpg",
    duration: "26s Recording",
    accountName: "Digitrust Client Account (Furniture)",
    opportunityScore: 100,
    deliveryStatus: "Messaging Leads",
    campaigns: [
      "Digitrust || Store Leads Campaign",
      "Digitrust || Leads campaign"
    ],
    campaignNote: "Results from 2 active campaigns",
    whatsappMessage: "Hi Digitrust Solutions, I watched your Furniture campaign walkthrough. Let's discuss lead generation for my business."
  },
  {
    id: "realestate",
    name: "Real Estate Properties",
    emoji: "🏢",
    industry: "Property & Construction",
    videoSrc: "/videos/proof/real-estate.mp4",
    posterSrc: "/videos/proof/poster-realestate.jpg",
    duration: "20s Recording",
    accountName: "Digitrust Client Account (Real Estate)",
    opportunityScore: 97,
    deliveryStatus: "Buyer Conversations",
    campaigns: [
      "Digitrust || Property Leads - Copy",
      "Digitrust || Buyer Leads"
    ],
    campaignNote: "Results from 4 campaigns",
    whatsappMessage: "Hi Digitrust Solutions, I saw your Real Estate campaign walkthrough. Can we talk about buyer lead generation?"
  },
  {
    id: "academy",
    name: "Creative Media Academy",
    emoji: "🎓",
    industry: "Education & Training",
    videoSrc: "/videos/proof/marketing-academy.mp4",
    posterSrc: "/videos/proof/poster-academy.jpg",
    duration: "25s Recording",
    accountName: "Digitrust Client Account (Education)",
    deliveryStatus: "Student Portfolios",
    campaigns: [
      "Digitrust || Student Creative Portfolios",
      "Digitrust || Workshop Admissions"
    ],
    campaignNote: "Admission & course lead pipelines",
    whatsappMessage: "Hi Digitrust Solutions, I saw your Education & Academy walkthrough. Want to discuss student intake lead campaigns."
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
    accountShown: "Digitrust Account (13869...) • Score: 83",
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
    accountShown: "Digitrust Client Account (10996...) • Score: 100",
    campaignShown: "Digitrust || Inbound Patient Calls",
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
    accountShown: "Digitrust Client Account (Furniture)",
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
    accountShown: "Digitrust Client Account (Education)",
    campaignShown: "Digitrust || Admissions Campaign 1",
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
    accountShown: "Digitrust Client Account (1438...)",
    campaignShown: "Digitrust || Property Leads",
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

        {/* Section 3: Transparent Pricing & 7-Day Trial Proposal */}
        <div className="proof-section-block proof-pricing-section">
          <div className="proof-section-divider" aria-hidden="true" />
          
          <div className="proof-title-area">
            <div className="proof-section-tag">TIER 3 • TRANSPARENT PRICING &amp; 7-DAY TRIAL</div>
            <h2 className="proof-main-title">Turn Your Ads Into Growth Opportunities</h2>
            <p className="proof-main-desc">
              A structured Meta advertising service built to help your business reach the right audience, attract relevant enquiries, and make smarter use of your advertising budget.
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="proof-pricing-plans-grid">
            
            {/* Plan 1: 7-Day Trial */}
            <div className="proof-plan-card proof-plan-trial">
              <div className="proof-plan-badge">START RISK-FREE</div>
              <div className="proof-plan-header">
                <span className="proof-plan-tagline">Start With a 7-Day Trial</span>
                <div className="proof-plan-price-wrap">
                  <span className="proof-plan-currency">₹</span>
                  <span className="proof-plan-price">1,999</span>
                  <span className="proof-plan-period">/ 7 days</span>
                </div>
                <p className="proof-plan-sub">Try our service for 7 days</p>
                <div className="proof-plan-callout">
                  <span className="callout-icon">✨</span>
                  <span><strong>₹1,999 is adjusted</strong> against your first month</span>
                </div>
              </div>

              <div className="proof-plan-features-list">
                <h4>What&apos;s Included in Your Trial:</h4>
                <ul>
                  <li><span>✓</span> <strong>01 Full Campaign Setup:</strong> Objectives, ad set structure, placements &amp; launch config.</li>
                  <li><span>✓</span> <strong>02 Targeted Audience Research:</strong> Audience strategy based on customer profile, location &amp; goals.</li>
                  <li><span>✓</span> <strong>03 Ad Creative &amp; Copy Support:</strong> Messaging guidance designed to communicate your offer clearly.</li>
                  <li><span>✓</span> <strong>04 Campaign Monitoring:</strong> Performance checks &amp; optimization focused on CPC, CTR &amp; efficiency.</li>
                  <li><span>✓</span> <strong>05 Lead Generation Focus:</strong> Campaigns designed to attract relevant enquiries &amp; reduce wasted spend.</li>
                  <li><span>✓</span> <strong>06 Performance Insights:</strong> Clear updates &amp; practical recommendations based on data.</li>
                </ul>
              </div>

              <div className="proof-plan-cta">
                <a
                  href={`${waBaseUrl}?text=${encodeURIComponent("Hi Digitrust Solutions, I want to start the 7-Day Meta Ads Trial for ₹1,999.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proof-plan-btn proof-plan-btn-trial"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.777.82 2.791.82 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.768-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.764 0-3.421-.462-4.869-1.268l-7.131 1.868 1.898-6.945c-.908-1.516-1.428-3.29-1.428-5.187 0-5.514 4.486-10 10-10 5.514 0 10 4.486 10 10z"/>
                  </svg>
                  <span>Start 7-Day Trial on WhatsApp (₹1,999) →</span>
                </a>
              </div>
            </div>

            {/* Plan 2: Monthly Campaign Management */}
            <div className="proof-plan-card proof-plan-monthly">
              <div className="proof-plan-badge proof-badge-monthly">REGULAR RETAINER</div>
              <div className="proof-plan-header">
                <span className="proof-plan-tagline">Monthly Campaign Management</span>
                <div className="proof-plan-price-wrap">
                  <span className="proof-plan-currency">₹</span>
                  <span className="proof-plan-price">5,000</span>
                  <span className="proof-plan-period">/ month</span>
                </div>
                <p className="proof-plan-sub">Regular monthly service fee</p>
                <div className="proof-plan-callout proof-callout-monthly">
                  <span className="callout-icon">💳</span>
                  <span>Pay just <strong>₹3,001 balance</strong> to continue after trial</span>
                </div>
              </div>

              <div className="proof-plan-features-list">
                <h4>What&apos;s Included in Monthly Management:</h4>
                <ul>
                  <li><span>✓</span> <strong>Ongoing Campaign Scaling:</strong> Dynamic budget allocation, bidding control &amp; scaling.</li>
                  <li><span>✓</span> <strong>Continuous Audience Refinement:</strong> Custom audiences, retargeting pools &amp; negative lists.</li>
                  <li><span>✓</span> <strong>Creative &amp; Copy Variations:</strong> Ongoing testing of hooks, angles, formats &amp; copy refreshes.</li>
                  <li><span>✓</span> <strong>Lead Quality &amp; Conversion Tracking:</strong> Form optimization, CRM sync &amp; lead validation.</li>
                  <li><span>✓</span> <strong>Weekly Strategy Updates:</strong> Comprehensive performance analytics &amp; next step roadmaps.</li>
                  <li><span>✓</span> <strong>Dedicated WhatsApp Support:</strong> Direct communication with your campaign strategist.</li>
                </ul>
              </div>

              <div className="proof-plan-cta">
                <a
                  href={`${waBaseUrl}?text=${encodeURIComponent("Hi Digitrust Solutions, I want to discuss Monthly Meta Ads Campaign Management for ₹5,000/mo.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proof-plan-btn proof-plan-btn-monthly"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.777.82 2.791.82 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.768-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.764 0-3.421-.462-4.869-1.268l-7.131 1.868 1.898-6.945c-.908-1.516-1.428-3.29-1.428-5.187 0-5.514 4.486-10 10-10 5.514 0 10 4.486 10 10z"/>
                  </svg>
                  <span>Book Monthly Management (₹5,000) →</span>
                </a>
              </div>
            </div>

          </div>

          {/* 3-Step "How the Trial Works" Timeline */}
          <div className="proof-trial-steps-box">
            <h3 className="proof-trial-steps-title">How the 7-Day Trial Works</h3>
            <div className="proof-trial-steps-grid">
              
              <div className="proof-trial-step">
                <div className="proof-step-badge">1</div>
                <div className="proof-step-body">
                  <h4>START</h4>
                  <p>Pay <strong>₹1,999</strong> to begin your 7-day trial and launch onboarding.</p>
                </div>
              </div>

              <div className="proof-step-arrow" aria-hidden="true">→</div>

              <div className="proof-trial-step">
                <div className="proof-step-badge">2</div>
                <div className="proof-step-body">
                  <h4>TEST &amp; REVIEW</h4>
                  <p>We launch the agreed campaign and review available performance data together.</p>
                </div>
              </div>

              <div className="proof-step-arrow" aria-hidden="true">→</div>

              <div className="proof-trial-step">
                <div className="proof-step-badge">3</div>
                <div className="proof-step-body">
                  <h4>CONTINUE</h4>
                  <p>If you continue, ₹1,999 is deducted from ₹5,000. <strong>First-month balance: ₹3,001</strong>.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Transparent Disclaimers Box from the Flyer */}
          <div className="proof-scope-notes">
            <div className="proof-scope-note-item">
              <span className="scope-bullet">🎯</span>
              <p><strong>Ad spend is separate:</strong> We aim to improve campaign efficiency and attract relevant leads, but CPC, lead volume, and sales are not guaranteed.</p>
            </div>
            <div className="proof-scope-note-item">
              <span className="scope-bullet">📋</span>
              <p><strong>Budget &amp; Assets:</strong> Advertising budget paid to Meta is not included. Client provides business information, approvals, and required assets. Photo/video shoots, influencer fees, premium tools, and website work are excluded unless agreed separately.</p>
            </div>
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
