import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "./components/ContactForm";
import { ScrollLink } from "./components/ScrollLink";
import { Testimonials } from "./components/Testimonials";
import { featuredTestimonials } from "../content/testimonials";
import { services } from "../content/services";
import { policies } from "../content/policies";
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
      <header className="site-header">
        <div className="container nav-wrap">
          <ScrollLink className="brand" targetId="top" aria-label="Digitrust Solutions home">
            <Image
              src="/brand/logo.svg"
              alt="Digitrust Solutions"
              width={500}
              height={500}
              priority
            />
          </ScrollLink>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <ScrollLink targetId="services">Services</ScrollLink>
            <ScrollLink targetId="technology">Technology</ScrollLink>
            <ScrollLink targetId="approach">Approach</ScrollLink>
            <ScrollLink targetId="about">Why us</ScrollLink>
            <ScrollLink targetId="contact" className="nav-cta">
              Start a project
            </ScrollLink>
          </nav>

          <details className="mobile-menu">
            <summary aria-label="Open navigation">Menu</summary>
            <nav aria-label="Mobile navigation">
              <ScrollLink targetId="services">Services</ScrollLink>
              <ScrollLink targetId="technology">Technology</ScrollLink>
              <ScrollLink targetId="approach">Approach</ScrollLink>
              <ScrollLink targetId="about">Why us</ScrollLink>
              <ScrollLink targetId="contact">Start a project</ScrollLink>
            </nav>
          </details>
        </div>
      </header>

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
                <strong>8</strong>
                <span>Core services</span>
              </div>
              <div>
                <strong>360°</strong>
                <span>Digital delivery</span>
              </div>
              <div>
                <strong>GGM</strong>
                <span>Gurugram based</span>
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

      <section className="section services-section" id="services">
        <div className="container">
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

          <div className="service-grid">
            {services.map((service) => (
              <article
                className="service-card"
                key={service.number}
              >
                <div className="service-topline">
                  <span>{service.number}</span>
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
            ))}
          </div>
        </div>
      </section>

      <section className="section stack-section" id="technology">
        <div className="container">
          <div className="section-heading stack-heading">
            <p className="eyebrow"><span /> Platforms & technology</p>
            <h2>The right stack for the job—not a one-size-fits-all build.</h2>
            <p>
              From marketing websites and online stores to custom applications,
              we select dependable tools around your goals, team, budget, and
              long-term ownership.
            </p>
          </div>

          <div className="stack-grid">
            {stackGroups.map((group, index) => (
              <article className="stack-card" key={group.label}>
                <div className="stack-card-head">
                  <span>0{index + 1}</span>
                  <h3>{group.label}</h3>
                </div>
                <ul aria-label={`${group.label} technologies`}>
                  {group.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>

          <div className="stack-note">
            <strong>Technology follows the business need.</strong>
            <p>We recommend a practical architecture after discovery, with security, maintainability, and performance considered from day one.</p>
          </div>
        </div>
      </section>

      <section className="section approach-section" id="approach">
        <div className="container approach-grid">
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

          <div className="process-list">
            {process.map((item, index) => (
              <article className="process-item" key={item.step}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{item.step}</h3>
                  <p>{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section why-section" id="about">
        <div className="container why-grid">
          <div className="why-visual" aria-hidden="true">
            <div className="why-ring">
              <div className="why-core">🎯</div>
              <span className="orbit-node node-one">01</span>
              <span className="orbit-node node-two">02</span>
              <span className="orbit-node node-three">03</span>
            </div>
            <p>Strategy • Creativity • Technology</p>
          </div>

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
        </div>
      </section>

      <Testimonials items={featuredTestimonials} />

      <section className="section contact-section" id="contact">
        <div className="container contact-shell">
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
          <ContactForm services={services.map((service) => service.title)} />
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-main">

          <p>Strategy, creative marketing, and technology for confident digital growth.</p>
          <div className="footer-links">
            <ScrollLink targetId="services">Services</ScrollLink>
            <ScrollLink targetId="technology">Technology</ScrollLink>
            <ScrollLink targetId="approach">Approach</ScrollLink>
            <ScrollLink targetId="about">Why us</ScrollLink>
            <ScrollLink targetId="testimonials">Reviews</ScrollLink>
            <ScrollLink targetId="contact">Contact</ScrollLink>
            <Link href={contactInfo.instagram.href}>Instagram</Link>
          </div>
        </div>
        <div className="container footer-bottom policy-footer-bottom">
          <span>© {new Date().getFullYear()} Digitrust Solutions. All rights reserved.</span>
          <nav aria-label="Legal links">
            {policies.map((policy) => <Link href={`/policies/${policy.slug}`} key={policy.slug}>{policy.shortTitle}</Link>)}
          </nav>
        </div>
      </footer>
    </main>
  );
}
