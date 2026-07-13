"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ScrollLink } from "./ScrollLink";

const NAV_LINKS = [
  { label: "Services", id: "services" },
  { label: "Technology", id: "technology" },
  { label: "Approach", id: "approach" },
  { label: "Why us", id: "about" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        // Toggle floating state
        setIsScrolled(window.scrollY > 40);

        // Scroll Spy logic
        const sections = NAV_LINKS.map(link => document.getElementById(link.id)).filter(Boolean);
        let currentSection = "";
        
        // Add 'top' and 'contact' to spyable sections
        const allSections = [document.getElementById("top"), ...sections, document.getElementById("contact")].filter(Boolean) as HTMLElement[];

        for (let i = allSections.length - 1; i >= 0; i--) {
          const section = allSections[i];
          if (section) {
            const rect = section.getBoundingClientRect();
            // If the top of the section is anywhere above the middle of the viewport
            if (rect.top <= window.innerHeight / 2) {
              currentSection = section.id;
              break;
            }
          }
        }
        
        // If we're at the very bottom, highlight contact
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
          currentSection = "contact";
        }

        setActiveSection(currentSection);
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  // Trap focus / body lock would go here for robust a11y, simplified for brevity

  return (
    <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="container nav-wrap">
        <ScrollLink 
          className="brand" 
          targetId="top" 
          aria-label="Digitrust Solutions home"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Image
            src="/brand/logo.png"
            alt="Digitrust Solutions"
            width={500}
            height={500}
            priority
          />
        </ScrollLink>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => (
            <ScrollLink
              key={link.id}
              targetId={link.id}
              className={`nav-item ${activeSection === link.id ? "active" : ""}`}
            >
              {link.label}
            </ScrollLink>
          ))}
          <ScrollLink targetId="contact" className="nav-cta premium-cta">
            Let's discuss your project
            <span className="cta-arrow" aria-hidden="true">→</span>
          </ScrollLink>
        </nav>

        {/* Mobile menu trigger */}
        <button 
          className="mobile-menu-trigger"
          aria-expanded={isMobileMenuOpen}
          aria-label="Open navigation menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className={`hamburger ${isMobileMenuOpen ? "open" : ""}`}>
            <span className="line top"></span>
            <span className="line mid"></span>
            <span className="line bot"></span>
          </span>
        </button>

        {/* Mobile Slide Panel */}
        <div className={`mobile-slide-panel ${isMobileMenuOpen ? "open" : ""}`}>
          <div className="mobile-panel-inner">
            <ScrollLink 
              targetId="contact" 
              className="mobile-panel-cta"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Book Consultation
            </ScrollLink>
            
            <nav className="mobile-panel-nav" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <ScrollLink
                  key={link.id}
                  targetId={link.id}
                  className={activeSection === link.id ? "active" : ""}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </ScrollLink>
              ))}
            </nav>

            <div className="mobile-panel-footer">
              <a href="mailto:hello@digitrust.in">hello@digitrust.in</a>
            </div>
          </div>
        </div>
        
        {/* Mobile panel backdrop */}
        <div 
          className={`mobile-backdrop ${isMobileMenuOpen ? "visible" : ""}`} 
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      </div>
    </header>
  );
}
