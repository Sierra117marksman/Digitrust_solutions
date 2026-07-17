"use client";


import Link from "next/link";
import { ScrollLink } from "./ScrollLink";

// Ensure these exist or can be resolved. Wait, I should make sure I import what exists.
// Let&apos;s import the data objects but define them correctly or assume they export what we need.
// Since this is in components, the relative path to content is `../../content/...` or `../content/...`
// The page.tsx is in `app/`, so `app/content/` is `../content/...` from `app/components/`.

import { policies } from "../../content/policies";
import { contactInfo } from "../../content/contact";

export function Footer() {
  return (
    <>
      <section className="pre-footer-cta">
        <div className="container pre-footer-content">
          <h2>Let&apos;s discuss your project.</h2>
          <ScrollLink targetId="contact" className="button button-primary pre-footer-button">
            Book a free consultation
          </ScrollLink>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-top-cta">
            <h3>Let&apos;s Build Your Next Digital Success Story.</h3>
          </div>

          <div className="footer-grid">
            <div className="footer-col brand-col">
              <Link href="/" className="footer-brand" aria-label="Digitrust Solutions home">
                {/* Fallback text if logo doesn't load, though SVG is preferred. Let&apos;s use text to make it simpler and premium */}
                <span className="brand-text">Digitrust</span>
              </Link>
              <p className="footer-bio">
                Ready to transform your digital presence? Let&apos;s build something extraordinary together.
              </p>
              <div className="footer-socials">
                <Link href={contactInfo.instagram.href} className="social-icon" aria-label="Instagram">
                  In
                </Link>
                {/* LinkedIn or other socials would go here */}
              </div>
            </div>

            <div className="footer-col">
              <h4>Services</h4>
              <nav aria-label="Services links">
                <ScrollLink targetId="services">Web Development</ScrollLink>
                <ScrollLink targetId="services">Shopify & E-commerce</ScrollLink>
                <ScrollLink targetId="services">SEO & Marketing</ScrollLink>
                <ScrollLink targetId="services">Meta Ads</ScrollLink>
              </nav>
            </div>

            <div className="footer-col">
              <h4>Case Studies</h4>
              <nav aria-label="Case Studies links">
                <ScrollLink targetId="testimonials">Client Reviews</ScrollLink>
                <ScrollLink targetId="approach">Our Approach</ScrollLink>
                <ScrollLink targetId="technology">Technology Stack</ScrollLink>
              </nav>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <nav aria-label="Company links">
                <ScrollLink targetId="about">Why Digitrust</ScrollLink>
                <ScrollLink targetId="team">Meet the Team</ScrollLink>
                <Link href="/policies/privacy-policy">Privacy Policy</Link>
              </nav>
            </div>

            <div className="footer-col contact-col">
              <h4>Contact</h4>
              <address>
                <a href="mailto:hello@digitrust.in" className="contact-link">
                  hello@digitrust.in
                </a>
                <a href={contactInfo.phones[0].href} className="contact-link">
                  {contactInfo.phones[0].display}
                </a>
                <p>123 Digital Avenue<br />Tech District<br />Mumbai, Maharashtra 400001<br />India</p>
              </address>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-trust">
              <span>Responsive Design</span>
              <span className="trust-dot">•</span>
              <span>Performance Optimized</span>
              <span className="trust-dot">•</span>
              <span>Secure Development</span>
              <span className="trust-dot">•</span>
              <span>Dedicated Support</span>
            </div>
            <div className="footer-legal">
              <span>© {new Date().getFullYear()} Digitrust Solutions.</span>
              <nav aria-label="Legal links">
                {policies.map((policy) => (
                  <Link href={`/policies/${policy.slug}`} key={policy.slug}>
                    {policy.shortTitle}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
