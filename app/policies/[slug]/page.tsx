import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPolicy, policies } from "../../../content/policies";

type PolicyPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return policies.map((policy) => ({ slug: policy.slug }));
}

export async function generateMetadata({ params }: PolicyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) return {};

  return {
    title: policy.title,
    description: policy.description,
    alternates: { canonical: `/policies/${policy.slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const updated = "12 July 2026";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: policy.title,
    description: policy.description,
    url: `${siteUrl}/policies/${policy.slug}`,
    dateModified: "2026-07-12",
    isPartOf: { "@type": "WebSite", name: "Digitrust Solutions", url: siteUrl },
  };

  return (
    <main className="policy-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <header className="site-header">
        <div className="container nav-wrap">
          <Link className="brand" href="/" aria-label="Digitrust Solutions home">
            <Image src="/brand/logo.svg" alt="Digitrust Solutions" width={500} height={500} priority />
          </Link>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <Link href="/#services">Services</Link>
            <Link href="/#technology">Technology</Link>
            <Link href="/#testimonials">Reviews</Link>
            <Link href="/#contact" className="nav-cta">Contact us</Link>
          </nav>
          <details className="mobile-menu">
            <summary aria-label="Open navigation">Menu</summary>
            <nav aria-label="Mobile navigation">
              <Link href="/">Home</Link>
              <Link href="/#services">Services</Link>
              <Link href="/#contact">Contact us</Link>
            </nav>
          </details>
        </div>
      </header>

      <section className="policy-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><strong>{policy.title}</strong></nav>
          <p className="eyebrow"><span /> Legal & policy centre</p>
          <h1>{policy.title}</h1>
          <p>{policy.intro}</p>
          <div className="policy-meta"><span>Last updated</span><strong>{updated}</strong></div>
        </div>
      </section>

      <section className="section policy-content-section">
        <div className="container policy-layout">
          <aside className="policy-nav" aria-label="Policy pages">
            <p>Policy centre</p>
            <nav>
              {policies.map((item) => (
                <Link className={item.slug === policy.slug ? "active" : ""} href={`/policies/${item.slug}`} key={item.slug}>{item.shortTitle}</Link>
              ))}
            </nav>
            <div className="policy-business-card"><span>Digitrust Solutions</span><p>142B1, Dharam Colony, Palam Vihar, Gurugram, Haryana - 122017</p><strong>GSTIN: 06DUYPD9228L1ZT</strong></div>
          </aside>

          <article className="policy-document">
            <div className="policy-notice">
              <strong>Please read this with your project documents.</strong>
              <p>A signed agreement, statement of work, approved proposal, or invoice may contain additional service-specific terms.</p>
            </div>
            {policy.sections.map((section, index) => (
              <section key={section.title} id={`section-${index + 1}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2>{section.title}</h2>
                  {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
                </div>
              </section>
            ))}
          </article>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-main">
          <Link className="footer-brand" href="/"><Image src="/brand/logo.svg" alt="Digitrust Solutions" width={500} height={500} /></Link>
          <p>Strategy, creative marketing, and technology for confident digital growth.</p>
          <div className="footer-links"><Link href="/#services">Services</Link><Link href="/#testimonials">Reviews</Link><Link href="/#contact">Contact</Link></div>
        </div>
        <div className="container footer-bottom policy-footer-bottom">
          <span>© {new Date().getFullYear()} Digitrust Solutions.</span>
          <nav aria-label="Legal links">{policies.map((item) => <Link href={`/policies/${item.slug}`} key={item.slug}>{item.shortTitle}</Link>)}</nav>
        </div>
      </footer>
    </main>
  );
}
