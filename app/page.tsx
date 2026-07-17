
import Link from "next/link";
import { ContactForm } from "./components/ContactForm";
import { ScrollLink } from "./components/ScrollLink";
import { Testimonials } from "./components/Testimonials";
import TeamSection from "./components/TeamSection";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { StickyCTA } from "./components/StickyCTA";
import { ScrollProgress } from "./components/ScrollProgress";
import { Reveal } from "./components/Reveal";
import { featuredTestimonials } from "../content/testimonials";
import { services } from "../content/services";
import { contactInfo } from "../content/contact";

const stackGroups = [
  {
    label: "Frontend",
    items: ["Next.js", "React", "TypeScript", "HTML", "CSS", "Tailwind CSS"],
  },
  {
    label: "Backend & Data",
    items: ["Node.js", "REST APIs", "MongoDB", "PostgreSQL", "Authentication", "Integrations"],
  },
  {
    label: "Commerce & CMS",
    items: ["Shopify", "Liquid", "WordPress", "WooCommerce", "Headless CMS", "Content Systems"],
  },
  {
    label: "Growth & Delivery",
    items: ["Technical SEO", "Meta Ads", "Analytics", "Vercel", "Cloud Deployment", "Performance"],
  },
];

const process = [
  {
    step: "Discover & audit",
    copy: "We clarify your audience, goals, current challenges, existing systems, and the result that matters most.",
  },
  {
    step: "Plan & design",
    copy: "We shape the strategy, user experience, content direction, technical architecture, and delivery roadmap.",
  },
  {
    step: "Build & create",
    copy: "Development, content, campaigns, and integrations move together with visible milestone reviews.",
  },
  {
    step: "Launch & optimise",
    copy: "We test the experience, performance, tracking, and conversion paths before a carefully managed launch.",
  },
  {
    step: "Grow & report",
    copy: "We monitor the right signals, share clear reporting, and improve the system as your business evolves.",
  },
];

export default function Home() {
  return (
    <main>
      <ScrollProgress />
      <Navbar />

      <section className="hero" id="top">
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Digital growth, built on trust</p>
            <h1>
              Ideas that move
              <span>business forward.</span>
            </h1>
            <p className="hero-lead">
              Digitrust Solutions brings strategy, creative marketing, and
              full-stack technology together to help ambitious businesses grow
              with confidence.
            </p>
            <div className="hero-actions">
              <ScrollLink className="button button-primary" targetId="contact">
                Discuss your project <span aria-hidden="true">↗</span>
              </ScrollLink>
              <ScrollLink className="text-link" targetId="services">
                Explore our services <span aria-hidden="true">↓</span>
              </ScrollLink>
            </div>
            <div className="hero-proof" aria-label="Key business strengths">
              <div>
                <strong>300+</strong>
                <span>Projects delivered</span>
              </div>
              <div>
                <strong>99%</strong>
                <span>Client satisfaction</span>
              </div>
              <div>
                <strong>97%</strong>
                <span>Success rate</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Digitrust connected growth system">
            <div className="signal-card signal-card-top">
              <span className="signal-dot" />
              <p>Strategy aligned</p>
              <strong>Ready to grow</strong>
            </div>
            <div className="growth-panel">
              <div className="panel-head">
                <div>
                  <span>Digital momentum</span>
                  <strong>Built as one system</strong>
                </div>
                <span className="panel-badge">Live</span>
              </div>
              <div className="growth-chart" aria-hidden="true">
                <div className="chart-grid" />
                <svg className="chart-line" viewBox="0 0 420 190" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#219dc5" stopOpacity="0.24" />
                      <stop offset="100%" stopColor="#219dc5" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path className="chart-area" d="M12 160 L92 133 L168 142 L247 91 L324 106 L408 34 L408 190 L12 190 Z" />
                  <polyline className="chart-path" points="12,160 92,133 168,142 247,91 324,106 408,34" />
                  {["12,160", "92,133", "168,142", "247,91", "324,106", "408,34"].map((point) => {
                    const [cx, cy] = point.split(",");
                    return <circle key={point} cx={cx} cy={cy} r="5" />;
                  })}
                </svg>
              </div>
              <div className="panel-services">
                <span>Web</span>
                <span>Social</span>
                <span>Search</span>
                <span>Ads</span>
              </div>
            </div>
            <div className="signal-card signal-card-bottom">
              <span className="mini-mark">D</span>
              <div>
                <p>One trusted partner</p>
                <strong>From idea to impact</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-bar" aria-label="Digitrust capabilities">
        <div className="container trust-row">
          <span>Strategy</span><i />
          <span>Creative</span><i />
          <span>Technology</span><i />
          <span>Growth</span><i />
          <span>Trust</span>
        </div>
      </section>

      {/* Results Strip */}
      <section className="results-strip" aria-label="Track record">
        <div className="container results-grid">
          <div className="result-item">
            <strong>300+</strong>
            <span>Projects Delivered</span>
          </div>
          <div className="result-item">
            <strong>99%</strong>
            <span>Customer Satisfaction</span>
          </div>
          <div className="result-item">
            <strong>97%</strong>
            <span>Success Rate</span>
          </div>
          <div className="result-item">
            <strong>50+</strong>
            <span>Happy Clients</span>
          </div>
          <div className="result-item">
            <strong>4.9★</strong>
            <span>Average Rating</span>
          </div>
        </div>
      </section>

      <section className="section services-section" id="services">
        <div className="container">
          <Reveal>
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow"><span /> What we do</p>
                <h2>Connected services.<br />Stronger outcomes.</h2>
              </div>
              <p>
                Choose one focused service or bring everything together. Every
                engagement is shaped around your audience, your goals, and what
                comes next.
              </p>
            </div>
          </Reveal>

          {/* Spotlight Cards — Meta Ads & Custom Development */}
          <div className="spotlight-row">
            <Reveal delay={100} direction="up" fullWidth>
              <Link href="/services/meta-ads" className="spotlight-card spotlight-meta">
                <div className="spotlight-icon">📣</div>
                <div className="spotlight-content">
                  <span className="spotlight-label">Most Popular</span>
                  <h3>Meta Ads Specialty</h3>
                  <p>High-ROAS Facebook & Instagram campaigns with dedicated landing pages, pixel tracking, and creative testing frameworks.</p>
                </div>
                <span className="spotlight-arrow" aria-hidden="true">→</span>
              </Link>
            </Reveal>
            <Reveal delay={200} direction="up" fullWidth>
              <Link href="/services/full-stack-development" className="spotlight-card spotlight-dev">
                <div className="spotlight-icon">⚡</div>
                <div className="spotlight-content">
                  <span className="spotlight-label">High Demand</span>
                  <h3>Custom Development</h3>
                  <p>End-to-end web applications, CRM systems, dashboards & APIs — built around how your business actually works.</p>
                </div>
                <span className="spotlight-arrow" aria-hidden="true">→</span>
              </Link>
            </Reveal>
          </div>

          <div className="service-grid">
            {services.map((service, index) => (
              <Reveal key={service.number} delay={index * 50} direction="up" fullWidth>
                <article
                  className={`service-card ${service.featured ? "service-card-featured" : ""}`}
                >
                <div className="service-topline">
                  <div className="service-badge-group">
                    <span>{service.number}</span>
                    {service.featured && <span className="featured-badge">Featured</span>}
                  </div>
                  <span className="service-arrow" aria-hidden="true">↗</span>
                </div>
                <h3>
                  <Link 
                    href={`/services/${service.slug}`}
                    className="service-card-link"
                    aria-label={`Explore ${service.title}`}
                  >
                    {service.title}
                  </Link>
                </h3>
                <p>{service.cardDescription}</p>
                <ul aria-label={`${service.title} capabilities`}>
                  {service.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section stack-section" id="technology">
        <div className="container">
          <Reveal>
            <div className="section-heading stack-heading">
              <p className="eyebrow"><span /> Platforms & technology</p>
              <h2>The right stack for the job—not a one-size-fits-all build.</h2>
              <p>
                From marketing websites and online stores to custom applications,
                we select dependable tools around your goals, team, budget, and
                long-term ownership.
              </p>
            </div>
          </Reveal>

          <div className="stack-grid">
            {stackGroups.map((group, index) => (
              <Reveal key={group.label} delay={index * 100} direction="up" fullWidth>
                <article className="stack-card">
                <div className="stack-card-head">
                  <span>0{index + 1}</span>
                  <h3>{group.label}</h3>
                </div>
                <ul aria-label={`${group.label} technologies`}>
                  {group.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="stack-note">
              <strong>Technology follows the business need.</strong>
              <p>We recommend a practical architecture after discovery, with security, maintainability, and performance considered from day one.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section approach-section" id="approach">
        <div className="container approach-grid">
          <Reveal direction="right">
            <div className="approach-intro">
              <p className="eyebrow eyebrow-light"><span /> How we work</p>
              <h2>Clear thinking.<br />Clean execution.</h2>
              <p>
                No confusing handoffs or disconnected teams. We keep strategy,
                communication, and delivery moving in the same direction.
              </p>
              <ScrollLink targetId="contact" className="button button-light">
                Build with us <span aria-hidden="true">↗</span>
              </ScrollLink>
            </div>
          </Reveal>

          <div className="process-list">
            {process.map((item, index) => (
              <Reveal key={item.step} delay={index * 150} direction="left" fullWidth>
                <article className="process-item">
                <span>0{index + 1}</span>
                <div>
                  <h3>{item.step}</h3>
                  <p>{item.copy}</p>
                </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section why-section" id="about">
        <div className="container why-grid">
          <Reveal direction="right">
            <div className="why-visual" aria-hidden="true">
              <div className="why-dartboard">
                <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="dartboard-svg">
                {/* Outer shadow ring */}
                <circle cx="150" cy="150" r="140" fill="#0b1f33" opacity="0.06" />
                {/* Board base */}
                <circle cx="150" cy="150" r="135" fill="#0f2a3d" />
                {/* Ring 5 - outer */}
                <circle cx="150" cy="150" r="125" fill="#e8eff4" />
                {/* Ring 4 */}
                <circle cx="150" cy="150" r="105" fill="#147a9c" />
                {/* Ring 3 */}
                <circle cx="150" cy="150" r="80" fill="#e8eff4" />
                {/* Ring 2 */}
                <circle cx="150" cy="150" r="55" fill="#147a9c" />
                {/* Ring 1 - inner */}
                <circle cx="150" cy="150" r="30" fill="#e8eff4" />
                {/* Bullseye */}
                <circle cx="150" cy="150" r="14" fill="#f79009" />
                <circle cx="150" cy="150" r="5" fill="#0b1f33" />

                {/* Crosshair lines */}
                <line x1="150" y1="15" x2="150" y2="285" stroke="rgba(11,31,51,0.06)" strokeWidth="0.8" />
                <line x1="15" y1="150" x2="285" y2="150" stroke="rgba(11,31,51,0.06)" strokeWidth="0.8" />

                {/* Dart hitting bullseye — sleek & small */}
                <line x1="150" y1="150" x2="178" y2="118" stroke="#0b1f33" strokeWidth="2" strokeLinecap="round" />
                <line x1="178" y1="118" x2="192" y2="102" stroke="#666" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M192 102 L200 96 L196 107 Z" fill="#f79009" />
                <path d="M192 102 L186 94 L196 98 Z" fill="#e06800" />
                {/* Subtle impact ring */}
                <circle cx="150" cy="150" r="18" fill="none" stroke="#f79009" strokeWidth="0.8" opacity="0.25" />
              </svg>
              <span className="orbit-node node-one">01</span>
              <span className="orbit-node node-two">02</span>
              <span className="orbit-node node-three">03</span>
            </div>
            <p>Strategy • Creativity • Technology</p>
          </div>
          </Reveal>

          <Reveal direction="left">
            <div className="why-copy">
              <p className="eyebrow"><span /> Why Digitrust</p>
              <h2>Your goals deserve more than a generic solution.</h2>
              <p className="why-lead">
                We combine the agility of a focused team with the range to handle
                your complete digital journey.
              </p>
              <div className="benefit-list">
                <article>
                  <span>01</span>
                  <div><h3>Business-first thinking</h3><p>Every decision connects back to a real objective, not a passing trend.</p></div>
                </article>
                <article>
                  <span>02</span>
                  <div><h3>One connected team</h3><p>Marketing, design, and development work together from the beginning.</p></div>
                </article>
                <article>
                  <span>03</span>
                  <div><h3>Communication you can trust</h3><p>Clear expectations, visible progress, and honest recommendations.</p></div>
                </article>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Reveal direction="up" fullWidth>
        <TeamSection />
      </Reveal>

      <Reveal direction="up" fullWidth>
        <Testimonials items={featuredTestimonials} />
      </Reveal>

      <section className="section contact-section" id="contact">
        <div className="container contact-shell">
          <Reveal direction="right">
            <div className="contact-copy">
              <p className="eyebrow eyebrow-light"><span /> Start a conversation</p>
              <h2>Let&apos;s turn your next idea into progress.</h2>
              <p>
                Tell us what you are building, improving, or trying to grow. We
                will review the details and plan the right next conversation.
              </p>
              <div className="contact-details">
                <div>
                  <span>Visit us</span>
                  <p>{contactInfo.addressLines[0]},<br />{contactInfo.addressLines[1]}</p>
                </div>
                <div>
                  <span>Business registration</span>
                  <p>GSTIN: {contactInfo.gstin}</p>
                </div>
                <div>
                  <span>Call us</span>
                  <p>
                    {contactInfo.phones.map((phone, index) => (
                      <Link href={phone.href} key={phone.href}>{phone.display}{index < contactInfo.phones.length - 1 ? <br /> : null}</Link>
                    ))}
                  </p>
                </div>
                <div>
                  <span>WhatsApp leads</span>
                  <p><Link href={contactInfo.whatsapp.href}>Message {contactInfo.whatsapp.display}</Link></p>
                </div>
                <div>
                  <span>Instagram</span>
                  <p><Link href={contactInfo.instagram.href}>{contactInfo.instagram.label}</Link></p>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal direction="left" delay={200} fullWidth>
            <ContactForm services={services.map((service) => service.title)} />
          </Reveal>
        </div>
      </section>

      <Footer />
      <StickyCTA />
    </main>
  );
}
