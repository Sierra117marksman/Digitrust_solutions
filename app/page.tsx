import Image from "next/image";
import { ContactForm } from "./components/ContactForm";

const services = [
  {
    number: "01",
    title: "Web Development",
    description:
      "Fast, responsive websites designed around clear journeys, strong credibility, and measurable business goals.",
    tags: ["Corporate websites", "Landing pages", "Performance"],
  },
  {
    number: "02",
    title: "Social Media Management",
    description:
      "Consistent planning, publishing, and community management that keeps your brand active and relevant.",
    tags: ["Content calendars", "Publishing", "Community"],
  },
  {
    number: "03",
    title: "Social Media Marketing",
    description:
      "Channel-specific campaigns that turn creative ideas into reach, engagement, and qualified conversations.",
    tags: ["Campaign strategy", "Creative direction", "Reporting"],
  },
  {
    number: "04",
    title: "Search Engine Optimisation",
    description:
      "Practical SEO foundations that improve discoverability, search relevance, and long-term organic growth.",
    tags: ["Technical SEO", "On-page SEO", "Local visibility"],
  },
  {
    number: "05",
    title: "Meta Ads Specialty",
    description:
      "Focused Facebook and Instagram advertising built around the right audience, message, and conversion path.",
    tags: ["Audience strategy", "Lead campaigns", "Optimisation"],
  },
  {
    number: "06",
    title: "Full-Stack Development",
    description:
      "End-to-end digital products with dependable frontends, secure backends, and scalable data architecture.",
    tags: ["Web applications", "APIs", "Database systems"],
  },
];

const process = [
  {
    step: "Discover",
    copy: "We clarify your audience, goals, current challenges, and the result that matters most.",
  },
  {
    step: "Design",
    copy: "We shape the strategy, experience, content direction, and delivery roadmap around your business.",
  },
  {
    step: "Deliver",
    copy: "We build, launch, measure, and refine with clear communication at every important milestone.",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <div className="container nav-wrap">
          <a className="brand" href="#top" aria-label="Digitrust Solutions home">
            <Image
              src="/brand/logo.svg"
              alt="Digitrust Solutions"
              width={500}
              height={500}
              priority
            />
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#services">Services</a>
            <a href="#approach">Approach</a>
            <a href="#about">Why us</a>
            <a href="#contact" className="nav-cta">
              Start a project
            </a>
          </nav>

          <details className="mobile-menu">
            <summary aria-label="Open navigation">Menu</summary>
            <nav aria-label="Mobile navigation">
              <a href="#services">Services</a>
              <a href="#approach">Approach</a>
              <a href="#about">Why us</a>
              <a href="#contact">Start a project</a>
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
              <a className="button button-primary" href="#contact">
                Discuss your project <span aria-hidden="true">↗</span>
              </a>
              <a className="text-link" href="#services">
                Explore our services <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="hero-proof" aria-label="Key business strengths">
              <div>
                <strong>6</strong>
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
                <div className="chart-line">
                  <i /><i /><i /><i /><i />
                </div>
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
              <article className="service-card" key={service.number}>
                <div className="service-topline">
                  <span>{service.number}</span>
                  <span className="service-arrow" aria-hidden="true">↗</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul aria-label={`${service.title} capabilities`}>
                  {service.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </article>
            ))}
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
            <a href="#contact" className="button button-light">
              Build with us <span aria-hidden="true">↗</span>
            </a>
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
              <div className="why-core">D</div>
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
                <p>142B1, Dharam Colony, Palam Vihar,<br />Gurugram, Haryana - 122017</p>
              </div>
              <div>
                <span>Business registration</span>
                <p>GSTIN: 06DUYPD9228L1ZT</p>
              </div>
            </div>
          </div>
          <ContactForm services={services.map((service) => service.title)} />
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-main">
          <a className="footer-brand" href="#top">
            <Image src="/brand/logo.svg" alt="Digitrust Solutions" width={500} height={500} />
          </a>
          <p>Strategy, creative marketing, and technology for confident digital growth.</p>
          <div className="footer-links">
            <a href="#services">Services</a>
            <a href="#approach">Approach</a>
            <a href="#about">Why us</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Digitrust Solutions. All rights reserved.</span>
          <span>Gurugram, Haryana</span>
        </div>
      </footer>
    </main>
  );
}
