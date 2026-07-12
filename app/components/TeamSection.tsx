import React from 'react';
import Image from "next/image";

export default function TeamSection() {
  return (
    <section className="section team-section" id="team">
      <div className="container">
        <div className="team-header">
          <h2>Meet the People Behind DigiTrust</h2>
          <p className="team-lead">
            The experts dedicated to turning your ideas into measurable business growth.
          </p>
        </div>

        <div className="team-grid">
          {/* CEO Card */}
          <article className="team-card ceo-card">
            <div className="team-photo-wrap">
              <Image src="/team-ceo.webp" alt="Tarun Yadav - CEO & Founder" fill className="team-photo" />
              <div className="team-accent founder-accent">★ Founder</div>
            </div>
            <div className="team-content">
              <h3>Tarun Yadav</h3>
              <p className="team-role">CEO &amp; Founder</p>
              <p className="team-focus">Vision, business strategy, and client relationships.</p>
              <p className="team-bio">&quot;Leading DigiTrust with a commitment to delivering innovative digital solutions and long-term client success.&quot;</p>
              <ul className="team-highlights">
                <li>8+ Yrs Experience</li>
                <li>Digital Strategy</li>
                <li>Business Growth</li>
                <li>Client Success</li>
              </ul>
            </div>
          </article>

          {/* Developer Card */}
          <article className="team-card">
            <div className="team-photo-wrap">
              <Image src="/team-dev.webp" alt="Ajay Thakkar - Lead Developer" fill className="team-photo" />
              <div className="team-accent code-accent">&lt;/&gt;</div>
            </div>
            <div className="team-content">
              <h3>Ajay Thakkar</h3>
              <p className="team-role">Lead Developer</p>
              <p className="team-focus">Building fast, secure, scalable websites and applications.</p>
              <p className="team-bio">&quot;Specialized in modern web technologies, performance optimization, and secure application development.&quot;</p>
              <ul className="team-highlights">
                <li>5+ Yrs Experience</li>
                <li>Next.js</li>
                <li>Shopify</li>
                <li>Performance</li>
                <li>Security</li>
              </ul>
            </div>
          </article>

          {/* Project Manager Card */}
          <article className="team-card">
            <div className="team-photo-wrap">
              <div className="team-photo placeholder">PM</div>
              <div className="team-accent pm-accent">📅</div>
            </div>
            <div className="team-content">
              <h3>Project Manager</h3>
              <p className="team-role">Delivery & Client Success</p>
              <p className="team-focus">Your dedicated point of contact, ensuring smooth communication, timely delivery, and solutions aligned with your business goals.</p>
              <p className="team-bio">&quot;Working closely with you to understand your goals, coordinate the team, and keep every project on schedule.&quot;</p>
              <ul className="team-highlights">
                <li>Dedicated Support</li>
                <li>Project Planning</li>
                <li>Clear Comm.</li>
                <li>On-Time Delivery</li>
              </ul>
            </div>
          </article>
        </div>

        <div className="experience-strip">
          <div className="experience-item">👋 Direct Communication</div>
          <div className="experience-item">🚀 Fast Turnaround</div>
          <div className="experience-item">🔒 Transparent Process</div>
          <div className="experience-item">📈 Results-Focused Approach</div>
        </div>
      </div>
    </section>
  );
}
