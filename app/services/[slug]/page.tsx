import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactForm } from "../../components/ContactForm";
import { Testimonials } from "../../components/Testimonials";
import { getService, services, serviceTitles } from "../../../content/services";
import { getTestimonialsForService } from "../../../content/testimonials";
import { policies } from "../../../content/policies";
import { contactInfo } from "../../../content/contact";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return {
    title: service.seoTitle,
    description: service.seoDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.seoTitle} | Digitrust Solutions`,
      description: service.seoDescription,
      url: `/services/${service.slug}`,
      type: "website",
      images: [{ url: "/og.png", width: 1734, height: 907, alt: service.title }],
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const reviews = getTestimonialsForService(service.slug);
  const relatedServices = services.filter((item) => item.slug !== service.slug).slice(0, 3);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const pageUrl = `${siteUrl}/services/${service.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.title,
        description: service.seoDescription,
        url: pageUrl,
        areaServed: { "@type": "AdministrativeArea", name: "Gurugram, Haryana, India" },
        provider: {
          "@type": "Organization",
          name: "Digitrust Solutions",
          telephone: contactInfo.phones[0].display,
          sameAs: [contactInfo.instagram.href],
          address: {
            "@type": "PostalAddress",
            streetAddress: contactInfo.addressLines[0],
            addressLocality: "Gurugram",
            addressRegion: "Haryana",
            postalCode: "122017",
            addressCountry: "IN",
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/#services` },
          { "@type": "ListItem", position: 3, name: service.title, item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <main className="service-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="site-header">
        <div className="container nav-wrap">
          <Link className="brand" href="/" aria-label="Digitrust Solutions home">
            <Image src="/brand/logo.svg" alt="Digitrust Solutions" width={500} height={500} priority />
          </Link>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <Link href="/#services">Services</Link>
            <Link href="/#technology">Technology</Link>
            <Link href="/#testimonials">Reviews</Link>
            <a href="#service-faqs">FAQs</a>
            <a href="#service-contact" className="nav-cta">Start a project</a>
          </nav>
          <details className="mobile-menu">
            <summary aria-label="Open navigation">Menu</summary>
            <nav aria-label="Mobile navigation">
              <Link href="/">Home</Link>
              <Link href="/#services">All services</Link>
              <a href="#service-process">Process</a>
              <a href="#service-faqs">FAQs</a>
              <a href="#service-contact">Start a project</a>
            </nav>
          </details>
        </div>
      </header>

      <section className="service-hero">
        <div className="service-hero-orbit" aria-hidden="true" />
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><Link href="/#services">Services</Link><span>/</span><strong>{service.title}</strong>
          </nav>
          <div className="service-hero-grid">
            <div>
              <p className="eyebrow"><span /> {service.eyebrow}</p>
              <h1>{service.heroTitle}<span>{service.heroAccent}</span></h1>
              <p className="service-hero-copy">{service.heroCopy}</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#service-contact">Discuss this service <span aria-hidden="true">↗</span></a>
                <a className="text-link" href="#service-deliverables">See what&apos;s included <span aria-hidden="true">↓</span></a>
              </div>
            </div>
            <aside className="service-ideal-card">
              <span className="service-number">{service.number}</span>
              <p>Well suited for</p>
              <ul>{service.idealFor.map((item) => <li key={item}>{item}</li>)}</ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="service-stack-strip" aria-label={`${service.title} tools and platforms`}>
        <div className="container">
          {service.technologies.map((technology) => <span key={technology}>{technology}</span>)}
        </div>
      </section>

      <section className="section service-problems">
        <div className="container">
          <div className="service-section-heading">
            <p className="eyebrow"><span /> Problems we solve</p>
            <h2>Where this service creates clarity.</h2>
          </div>
          <div className="service-three-grid">
            {service.problems.map((problem, index) => (
              <article className="problem-card" key={problem.title}>
                <span>0{index + 1}</span><h3>{problem.title}</h3><p>{problem.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section service-deliverables" id="service-deliverables">
        <div className="container service-split-layout">
          <div className="service-section-heading sticky-copy">
            <p className="eyebrow"><span /> What you receive</p>
            <h2>Practical deliverables—not vague activity.</h2>
            <p>Final scope is tailored after discovery, with responsibilities and milestones agreed before delivery begins.</p>
          </div>
          <div className="deliverable-list">
            {service.deliverables.map((deliverable, index) => (
              <article key={deliverable.title}>
                <span>0{index + 1}</span>
                <div><h3>{deliverable.title}</h3><p>{deliverable.copy}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section service-outcomes">
        <div className="container outcomes-shell">
          <div>
            <p className="eyebrow eyebrow-light"><span /> Designed outcomes</p>
            <h2>What better should look like.</h2>
            <p>These are the improvements the work is designed to support. Specific commercial results depend on your market, offer, team, budget, and implementation.</p>
          </div>
          <ul>{service.outcomes.map((outcome) => <li key={outcome}><span>✓</span>{outcome}</li>)}</ul>
        </div>
      </section>

      <section className="section service-process" id="service-process">
        <div className="container">
          <div className="service-section-heading centered-heading">
            <p className="eyebrow"><span /> Delivery process</p>
            <h2>A visible path from brief to progress.</h2>
          </div>
          <div className="service-process-grid">
            {service.process.map((item) => (
              <article key={item.step}><span>{item.step}</span><h3>{item.title}</h3><p>{item.copy}</p></article>
            ))}
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <Testimonials
          items={reviews}
          title={`What clients say about ${service.title.toLowerCase()}.`}
          intro="Relevant feedback selected from projects and campaigns connected to this service."
        />
      )}

      <section className="section service-faqs" id="service-faqs">
        <div className="container service-split-layout faq-layout">
          <div className="service-section-heading sticky-copy">
            <p className="eyebrow"><span /> Common questions</p>
            <h2>Useful answers before we begin.</h2>
          </div>
          <div className="faq-list">
            {service.faqs.map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary>{faq.question}<span aria-hidden="true">+</span></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section related-services">
        <div className="container">
          <div className="service-section-heading"><p className="eyebrow"><span /> Related capabilities</p><h2>Build a connected solution.</h2></div>
          <div className="related-grid">
            {relatedServices.map((item) => (
              <Link href={`/services/${item.slug}`} key={item.slug}>
                <span>{item.number}</span><h3>{item.title}</h3><p>{item.cardDescription}</p><strong>Explore service ↗</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section contact-section" id="service-contact">
        <div className="container contact-shell">
          <div className="contact-copy">
            <p className="eyebrow eyebrow-light"><span /> Start a conversation</p>
            <h2>Let&apos;s discuss your {service.title.toLowerCase()} needs.</h2>
            <p>Share the current situation, the outcome you need, and any timing considerations. We will review the details and suggest the right next conversation.</p>
            <div className="contact-details">
              <div><span>Visit us</span><p>{contactInfo.addressLines[0]},<br />{contactInfo.addressLines[1]}</p></div>
              <div><span>Business registration</span><p>GSTIN: {contactInfo.gstin}</p></div>
              <div>
                <span>Call us</span>
                <p>
                  {contactInfo.phones.map((phone, index) => (
                    <Link href={phone.href} key={phone.href}>{phone.display}{index < contactInfo.phones.length - 1 ? <br /> : null}</Link>
                  ))}
                </p>
              </div>
              <div><span>WhatsApp leads</span><p><Link href={contactInfo.whatsapp.href}>Message {contactInfo.whatsapp.display}</Link></p></div>
              <div><span>Instagram</span><p><Link href={contactInfo.instagram.href}>{contactInfo.instagram.label}</Link></p></div>
            </div>
          </div>
          <ContactForm services={serviceTitles} defaultService={service.title} />
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-main">
          <Link className="footer-brand" href="/"><Image src="/brand/logo.svg" alt="Digitrust Solutions" width={500} height={500} /></Link>
          <p>Strategy, creative marketing, and technology for confident digital growth.</p>
          <div className="footer-links"><Link href="/#services">Services</Link><Link href="/#technology">Technology</Link><Link href="/#testimonials">Reviews</Link><a href="#service-contact">Contact</a><Link href={contactInfo.instagram.href}>Instagram</Link></div>
        </div>
        <div className="container footer-bottom policy-footer-bottom">
          <span>© {new Date().getFullYear()} Digitrust Solutions. All rights reserved.</span>
          <nav aria-label="Legal links">{policies.map((policy) => <Link href={`/policies/${policy.slug}`} key={policy.slug}>{policy.shortTitle}</Link>)}</nav>
        </div>
      </footer>
    </main>
  );
}
