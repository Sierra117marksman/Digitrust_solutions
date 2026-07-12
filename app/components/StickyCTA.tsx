"use client";

import { useEffect, useState } from "react";
import { contactInfo } from "../../content/contact";

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isAtBottom = window.innerHeight + currentScrollY >= document.body.offsetHeight - 100;
      
      if (currentScrollY < 300) {
        // Hide at the very top of the page
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY || isAtBottom) {
        // Show if scrolling up or at the very bottom
        setIsVisible(true);
      } else {
        // Hide on scroll down
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`sticky-mobile-cta ${isVisible ? "visible" : ""}`}>
      <a href={contactInfo.phones[0].href} className="sticky-btn call-btn">
        <span className="icon">📞</span>
        Call
      </a>
      <a href={contactInfo.whatsapp.href} className="sticky-btn wa-btn">
        <span className="icon">💬</span>
        WhatsApp
      </a>
      <a href="#contact" className="sticky-btn quote-btn">
        <span className="icon">📋</span>
        Get Quote
      </a>
    </div>
  );
}
