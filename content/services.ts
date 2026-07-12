import type { ServiceSlug } from "./testimonials";

export type ServiceFaq = { question: string; answer: string };

export type Service = {
  slug: ServiceSlug;
  number: string;
  title: string;
  cardDescription: string;
  tags: string[];
  eyebrow: string;
  heroTitle: string;
  heroAccent: string;
  heroCopy: string;
  idealFor: string[];
  problems: { title: string; copy: string }[];
  deliverables: { title: string; copy: string }[];
  technologies: string[];
  outcomes: string[];
  process: { step: string; title: string; copy: string }[];
  faqs: ServiceFaq[];
  seoTitle: string;
  seoDescription: string;
};

export const services: Service[] = [
  {
    slug: "meta-ads",
    number: "01",
    title: "Meta Ads Specialty",
    cardDescription: "Focused Facebook and Instagram campaigns built around the right audience, creative, offer, and conversion path.",
    tags: ["Lead campaigns", "Retargeting", "Optimisation"],
    eyebrow: "Paid social connected to the full funnel",
    heroTitle: "Meta Ads designed around",
    heroAccent: "meaningful business actions.",
    heroCopy: "We plan, launch, and optimise Facebook and Instagram campaigns with careful tracking, focused creative, and landing journeys designed to turn paid attention into useful leads or sales.",
    idealFor: ["Service businesses generating enquiries", "D2C brands promoting products and offers", "Businesses retargeting engaged audiences", "Teams that need clearer ad reporting and accountability"],
    problems: [
      { title: "Clicks without outcomes", copy: "Campaigns optimise surface metrics while the landing experience and lead quality remain weak." },
      { title: "Unclear tracking", copy: "Pixel, events, forms, CRM status, and attribution are not connected well enough to guide decisions." },
      { title: "Creative fatigue", copy: "The same messages and assets run too long without structured testing or audience insight." },
    ],
    deliverables: [
      { title: "Campaign strategy", copy: "Objectives, audiences, offers, funnel stages, budgets, tests, and success measures." },
      { title: "Tracking foundation", copy: "Pixel and event review, conversion paths, lead capture, UTMs, and reporting setup." },
      { title: "Creative direction", copy: "Hooks, formats, copy angles, briefs, variations, and a practical testing plan." },
      { title: "Optimisation & reporting", copy: "Budget control, audience and creative analysis, lead-quality feedback, and next actions." },
    ],
    technologies: ["Meta Ads Manager", "Meta Pixel", "Conversions API", "Facebook", "Instagram", "Analytics", "Landing Pages", "CRM Tracking"],
    outcomes: ["Clearer campaign measurement", "Better alignment between ads and landing pages", "More disciplined creative testing", "Decisions based on lead and sales quality"],
    process: [
      { step: "01", title: "Offer & funnel audit", copy: "We review the audience, economics, creative, tracking, landing page, and sales follow-up." },
      { step: "02", title: "Campaign build", copy: "We structure campaigns, audiences, events, assets, budgets, and reporting." },
      { step: "03", title: "Controlled testing", copy: "We test meaningful variables without changing too many elements at once." },
      { step: "04", title: "Optimise & scale", copy: "We use campaign and lead-quality evidence to refine spend and creative direction." },
    ],
    faqs: [
      { question: "Is the advertising budget included in your fee?", answer: "No. Media spend is paid directly to Meta and is separate from strategy, setup, management, creative, or landing-page fees." },
      { question: "What budget should we start with?", answer: "The right testing budget depends on the market, offer, location, sales value, and available creative. We recommend it after reviewing the economics." },
      { question: "Do you create ad graphics and videos?", answer: "Creative direction and requirements are included in planning. Design and production can be included depending on the package." },
      { question: "Can you guarantee a specific ROAS?", answer: "No. Results depend on the offer, price, market, website, creative, follow-up, budget, and competition. We provide transparent optimisation and reporting." },
    ],
    seoTitle: "Meta Ads Management for Facebook & Instagram",
    seoDescription: "Meta Ads strategy, campaign management, tracking, retargeting, creative testing, landing pages, optimisation, and reporting.",
  },
  {
    slug: "full-stack-development",
    number: "02",
    title: "Full-Stack Development",
    cardDescription: "End-to-end digital products with dependable frontends, secure APIs, dashboards, and scalable data architecture.",
    tags: ["Web applications", "APIs", "CRM systems"],
    eyebrow: "Custom software around real operations",
    heroTitle: "Digital systems shaped around",
    heroAccent: "how your business works.",
    heroCopy: "Digitrust engineers custom portals, CRM systems, dashboards, APIs, and web applications when templates cannot support your workflows, permissions, integrations, or data.",
    idealFor: ["Businesses replacing spreadsheet-heavy processes", "Teams that need a custom CRM or admin panel", "Startups validating a software product", "Organisations connecting multiple systems"],
    problems: [
      { title: "Disconnected operations", copy: "Important information is divided across spreadsheets, messages, and tools that do not communicate." },
      { title: "Restricted platforms", copy: "Template software forces teams to change useful workflows instead of supporting them." },
      { title: "Limited visibility", copy: "Managers cannot see reliable status, ownership, performance, or audit information in one place." },
    ],
    deliverables: [
      { title: "Product & workflow definition", copy: "Roles, journeys, rules, data, edge cases, permissions, and a phased delivery roadmap." },
      { title: "Frontend applications", copy: "Responsive dashboards, portals, operational interfaces, and customer-facing experiences." },
      { title: "Backend & database", copy: "Secure APIs, validation, business logic, MongoDB or PostgreSQL architecture, and integrations." },
      { title: "Deployment & observability", copy: "Environment setup, access controls, logging, backups, monitoring, documentation, and support." },
    ],
    technologies: ["Next.js", "React", "TypeScript", "Node.js", "MongoDB", "PostgreSQL", "REST APIs", "Vercel"],
    outcomes: ["Less repetitive manual work", "Clearer ownership and reporting", "Software aligned with real workflows", "A controlled path from MVP to larger system"],
    process: [
      { step: "01", title: "Requirements mapping", copy: "We document users, decisions, data, dependencies, risks, and the smallest valuable release." },
      { step: "02", title: "Architecture & prototype", copy: "We design the system, database, permissions, interfaces, and critical interactions." },
      { step: "03", title: "Phased engineering", copy: "We build in reviewable milestones with testing, demonstrations, and controlled feedback." },
      { step: "04", title: "Release & evolution", copy: "We deploy, monitor, document, train users, and plan improvements from actual usage." },
    ],
    faqs: [
      { question: "Can you build a CRM for our team?", answer: "Yes. Lead stages, roles, assignments, follow-ups, activity history, dashboards, and integrations can be designed around your process." },
      { question: "Do you build an MVP first?", answer: "Usually. A focused first release reduces risk and gives the team real evidence before investing in secondary features." },
      { question: "How do you handle application security?", answer: "We apply access control, validation, secure secret handling, dependency checks, logging, and environment separation appropriate to the system." },
      { question: "Can you integrate existing software?", answer: "Yes, where a secure and documented API or supported integration method is available." },
    ],
    seoTitle: "Full-Stack Development & Custom CRM Systems",
    seoDescription: "Custom web applications, CRM systems, portals, dashboards, APIs, MongoDB, PostgreSQL, Next.js, and Node.js development.",
  },
  {
    slug: "web-development",
    number: "03",
    title: "Website Design & Development",
    cardDescription: "Fast, responsive business websites designed around clear journeys, strong credibility, and measurable goals.",
    tags: ["Corporate websites", "Landing pages", "Next.js"],
    eyebrow: "Web experiences built for business",
    heroTitle: "Websites that earn attention",
    heroAccent: "and turn it into action.",
    heroCopy: "Digitrust designs and develops responsive, credible websites that explain your value clearly, guide visitors naturally, and give your team a dependable platform for growth.",
    idealFor: ["Startups launching a new brand", "Established businesses replacing an outdated website", "Professional services that need qualified enquiries", "Campaign teams requiring focused landing pages"],
    problems: [
      { title: "Unclear positioning", copy: "Visitors cannot quickly understand what you offer, who it is for, or why they should trust you." },
      { title: "Weak mobile experience", copy: "Layouts, forms, and calls to action become difficult to use on the devices customers use most." },
      { title: "Slow, fragile pages", copy: "Heavy templates and disconnected plugins make updates difficult and create avoidable performance problems." },
    ],
    deliverables: [
      { title: "Strategy & information architecture", copy: "Page planning, user journeys, conversion paths, and a content structure aligned with your goals." },
      { title: "Responsive UI development", copy: "A distinct, accessible interface that works consistently across phones, tablets, and desktops." },
      { title: "Forms & integrations", copy: "Enquiry capture, WhatsApp, analytics, CRM, email, maps, and other practical connections." },
      { title: "Launch foundations", copy: "Technical SEO, performance checks, metadata, redirects, deployment, and handover guidance." },
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB", "Vercel", "Analytics"],
    outcomes: ["Clearer brand communication", "More usable mobile journeys", "Better-qualified enquiry paths", "A maintainable foundation for future growth"],
    process: [
      { step: "01", title: "Discover", copy: "We understand the audience, offer, content, competitors, and primary conversion goal." },
      { step: "02", title: "Structure & design", copy: "We map the pages and create a visual system around trust, clarity, and action." },
      { step: "03", title: "Develop & integrate", copy: "We build responsive pages, connect required tools, and prepare content for launch." },
      { step: "04", title: "Test & launch", copy: "We verify devices, forms, metadata, accessibility, and performance before release." },
    ],
    faqs: [
      { question: "How long does a business website take?", answer: "Timing depends on page count, content readiness, integrations, and approval speed. A clear delivery schedule is agreed after discovery." },
      { question: "Can you redesign our existing website?", answer: "Yes. We can retain useful content and SEO value while improving the structure, design, technology, and conversion journey." },
      { question: "Will our team be able to update content?", answer: "Yes. We can provide an appropriate content-management workflow and document how routine updates should be handled." },
      { question: "Is SEO included?", answer: "Every build includes sound technical and on-page foundations. Ongoing keyword, content, and authority work is available through our SEO service." },
    ],
    seoTitle: "Website Design & Development in Gurugram",
    seoDescription: "Responsive website design and Next.js development for businesses that need stronger credibility, performance, and enquiry journeys.",
  },
  {
    slug: "shopify-development",
    number: "04",
    title: "Shopify Development",
    cardDescription: "Conversion-focused storefronts, theme customisation, catalogue setup, and practical integrations for growing brands.",
    tags: ["Store builds", "Liquid", "Conversion UX"],
    eyebrow: "Commerce engineered around customers",
    heroTitle: "Shopify stores designed",
    heroAccent: "to make buying easier.",
    heroCopy: "We build and improve Shopify storefronts with clean journeys, focused product experiences, practical integrations, and code that supports growth without unnecessary complexity.",
    idealFor: ["D2C brands launching their first store", "Retailers migrating to Shopify", "Stores limited by an off-the-shelf theme", "Teams reducing unnecessary app dependency"],
    problems: [
      { title: "Generic storefronts", copy: "A standard theme does not communicate the brand or guide customers through product decisions effectively." },
      { title: "App overload", copy: "Too many overlapping apps increase cost, add scripts, and make the storefront harder to maintain." },
      { title: "Checkout friction", copy: "Product information, navigation, cart actions, and mobile layouts create hesitation before purchase." },
    ],
    deliverables: [
      { title: "Store strategy & setup", copy: "Navigation, collections, catalogue structure, settings, payments, shipping, and essential policies." },
      { title: "Theme development", copy: "Custom sections, Liquid development, responsive merchandising, and brand-specific presentation." },
      { title: "Conversion experience", copy: "Product pages, cart journeys, trust signals, bundles, discovery, and mobile buying flows." },
      { title: "Integrations & migration", copy: "Apps, analytics, marketing tools, inventory connections, data migration, and launch support." },
    ],
    technologies: ["Shopify", "Liquid", "JavaScript", "Shopify APIs", "Checkout", "Analytics", "Meta Pixel", "Search Console"],
    outcomes: ["A clearer path from discovery to checkout", "A more distinctive storefront", "Reduced avoidable app dependency", "Simpler day-to-day store management"],
    process: [
      { step: "01", title: "Store audit", copy: "We review products, theme, apps, analytics, customer journey, and commercial priorities." },
      { step: "02", title: "Commerce design", copy: "We plan navigation, product discovery, merchandising, and high-intent page layouts." },
      { step: "03", title: "Theme engineering", copy: "We develop, configure, integrate, and test the store away from live customers." },
      { step: "04", title: "Migration & launch", copy: "We move approved content and settings, verify tracking, and manage release carefully." },
    ],
    faqs: [
      { question: "Can you customise an existing Shopify theme?", answer: "Yes. We can improve an existing theme or recommend a more suitable rebuild when its structure is limiting performance or maintainability." },
      { question: "Do you set up products and collections?", answer: "Yes. Catalogue and collection setup can be included. The quantity and data requirements are confirmed in scope." },
      { question: "Can you replace paid Shopify apps with custom features?", answer: "Sometimes. We first compare the build and maintenance cost with the app cost, then recommend the practical option." },
      { question: "Do you guarantee conversion improvements?", answer: "No agency can responsibly guarantee a specific result. We improve the experience and measurement foundation, then use real data to guide optimisation." },
    ],
    seoTitle: "Shopify Development & Store Design",
    seoDescription: "Shopify store development, Liquid customisation, conversion-focused product journeys, integrations, and performance improvement.",
  },
  {
    slug: "wordpress-development",
    number: "05",
    title: "WordPress Development",
    cardDescription: "Flexible, easy-to-manage websites built with clean structure, strong SEO foundations, and dependable performance.",
    tags: ["Business websites", "WooCommerce", "Custom themes"],
    eyebrow: "Flexible publishing without the clutter",
    heroTitle: "WordPress websites your team",
    heroAccent: "can confidently manage.",
    heroCopy: "We create structured WordPress websites for organisations that need editorial control, dependable performance, search-friendly foundations, and room to evolve.",
    idealFor: ["Content-led businesses", "Professional and local service companies", "Teams that publish frequently", "WooCommerce businesses requiring flexible ownership"],
    problems: [
      { title: "Plugin dependence", copy: "Overlapping plugins create security, speed, compatibility, and maintenance concerns." },
      { title: "Difficult editing", copy: "Unstructured page builders make ordinary content changes unpredictable for internal teams." },
      { title: "Poor search foundations", copy: "Content hierarchy, metadata, schema, and internal links are not planned around discoverability." },
    ],
    deliverables: [
      { title: "WordPress architecture", copy: "Content types, categories, navigation, user roles, editorial flows, and hosting recommendations." },
      { title: "Custom page system", copy: "Reusable page patterns and blocks designed around your brand and routine publishing needs." },
      { title: "WooCommerce capability", copy: "Product, payment, shipping, tax, email, and account experiences when commerce is required." },
      { title: "Security & maintenance setup", copy: "Updates, backups, essential hardening, performance configuration, and team handover." },
    ],
    technologies: ["WordPress", "PHP", "Gutenberg", "WooCommerce", "MySQL", "JavaScript", "Cloudflare", "Search Console"],
    outcomes: ["Simpler content publishing", "Cleaner plugin architecture", "Stronger search foundations", "A website your organisation can own"],
    process: [
      { step: "01", title: "Content audit", copy: "We review existing pages, editorial needs, users, plugins, and search considerations." },
      { step: "02", title: "System design", copy: "We plan reusable blocks, templates, content types, navigation, and permissions." },
      { step: "03", title: "Build & migrate", copy: "We develop the system and move agreed content into the new structure." },
      { step: "04", title: "Train & maintain", copy: "We test, launch, document workflows, and agree the right maintenance model." },
    ],
    faqs: [
      { question: "Do you use Elementor?", answer: "We can work with Elementor when it suits the project, but we also build cleaner block-editor or custom-theme systems when long-term performance and control matter more." },
      { question: "Can you migrate our current WordPress site?", answer: "Yes. We plan content, URL, media, metadata, and redirect migration to reduce disruption." },
      { question: "Do you provide WordPress maintenance?", answer: "Yes. Ongoing updates, backups, monitoring, fixes, and improvement support can be scoped separately." },
      { question: "Can WordPress support an online store?", answer: "Yes. WooCommerce is suitable for many stores. We compare it with Shopify and custom commerce before recommending a platform." },
    ],
    seoTitle: "WordPress & WooCommerce Development",
    seoDescription: "Structured WordPress websites, WooCommerce stores, custom themes, migrations, performance, security, and editorial workflows.",
  },
  {
    slug: "seo",
    number: "06",
    title: "Search Engine Optimisation",
    cardDescription: "Practical technical, on-page, content, and local SEO that builds discoverability and sustainable organic growth.",
    tags: ["Technical SEO", "Content SEO", "Local visibility"],
    eyebrow: "Search visibility built methodically",
    heroTitle: "SEO that makes your website",
    heroAccent: "easier to find and trust.",
    heroCopy: "We combine technical improvements, useful content, local signals, and clear measurement to help the right audience discover your business through search over time.",
    idealFor: ["Local businesses competing in Gurugram and nearby markets", "Service companies seeking qualified organic enquiries", "Stores improving category and product discovery", "Websites recovering from weak technical foundations"],
    problems: [
      { title: "Low discoverability", copy: "Important services and locations are not aligned with how potential customers search." },
      { title: "Technical barriers", copy: "Crawling, indexing, speed, duplication, metadata, or structured-data issues reduce search clarity." },
      { title: "Content without direction", copy: "Pages are published without a keyword purpose, internal-link plan, or connection to commercial goals." },
    ],
    deliverables: [
      { title: "SEO audit & priorities", copy: "Technical, content, competitor, indexing, local, and measurement findings organised by impact." },
      { title: "On-page optimisation", copy: "Search intent, titles, descriptions, headings, copy guidance, internal links, and structured data." },
      { title: "Content & local strategy", copy: "Topic planning, service and location coverage, Google Business Profile guidance, and reputation signals." },
      { title: "Measurement & reporting", copy: "Search Console, analytics, keyword visibility, actions completed, findings, and next priorities." },
    ],
    technologies: ["Google Search Console", "Google Analytics", "PageSpeed Insights", "Schema.org", "Keyword Research", "Technical Audits", "Local SEO", "Content Strategy"],
    outcomes: ["Better search-engine understanding", "More relevant organic visibility", "Stronger local discovery", "A measurable long-term search programme"],
    process: [
      { step: "01", title: "Audit & baseline", copy: "We establish current visibility, technical health, content coverage, and measurement quality." },
      { step: "02", title: "Prioritise", copy: "We organise fixes and opportunities around relevance, feasibility, and business value." },
      { step: "03", title: "Implement", copy: "Technical, on-page, content, and local actions are delivered in clear cycles." },
      { step: "04", title: "Measure & improve", copy: "We review changes in visibility and engagement, then adjust the next cycle." },
    ],
    faqs: [
      { question: "How quickly will SEO show results?", answer: "SEO timing varies by competition, website history, technical condition, content, and authority. Meaningful progress usually requires consistent work rather than a one-time fix." },
      { question: "Can you guarantee first-page rankings?", answer: "No. Search engines control rankings, and responsible SEO providers do not guarantee positions. We commit to transparent, evidence-led work." },
      { question: "Do you provide content writing?", answer: "Content briefs, optimisation, and writing support can be included depending on the agreed programme." },
      { question: "Is local SEO different from regular SEO?", answer: "Local SEO gives additional attention to geographic relevance, Google Business Profile, consistent business information, reviews, and locally useful pages." },
    ],
    seoTitle: "SEO Services in Gurugram",
    seoDescription: "Technical SEO, on-page optimisation, local SEO, content strategy, Search Console, analytics, and transparent reporting.",
  },
  {
    slug: "social-media-management",
    number: "07",
    title: "Social Media Management",
    cardDescription: "Consistent planning, publishing, community management, and reporting that keeps your brand active and relevant.",
    tags: ["Content calendars", "Publishing", "Community"],
    eyebrow: "A consistent brand presence",
    heroTitle: "Social media managed with",
    heroAccent: "clarity and consistency.",
    heroCopy: "We organise your social presence through practical calendars, brand-aligned publishing, community care, and reporting—so your channels stay active without becoming an internal burden.",
    idealFor: ["Businesses without an internal social team", "Founders who struggle to publish consistently", "Brands managing multiple channels", "Teams that need a dependable content workflow"],
    problems: [
      { title: "Inconsistent publishing", copy: "Long gaps and last-minute posting weaken recognition and make the brand feel inactive." },
      { title: "Disconnected content", copy: "Individual posts are created without clear themes, campaigns, or connection to business priorities." },
      { title: "Slow community response", copy: "Comments and messages are missed or handled without an agreed tone and escalation process." },
    ],
    deliverables: [
      { title: "Monthly content calendar", copy: "Themes, formats, publishing dates, business moments, approvals, and channel planning." },
      { title: "Content coordination", copy: "Captions, hashtags, design briefs, asset organisation, scheduling, and publishing." },
      { title: "Community management", copy: "Comment and message monitoring within agreed hours, tone, and escalation rules." },
      { title: "Monthly reporting", copy: "Content performance, audience response, observations, and recommendations for the next cycle." },
    ],
    technologies: ["Instagram", "Facebook", "LinkedIn", "Meta Business Suite", "Content Calendars", "Scheduling", "Community Workflows", "Analytics"],
    outcomes: ["A more consistent brand presence", "Less internal coordination pressure", "Faster community handling", "Clear evidence for future content decisions"],
    process: [
      { step: "01", title: "Brand onboarding", copy: "We align goals, voice, audiences, channels, assets, approvals, and response rules." },
      { step: "02", title: "Calendar planning", copy: "We create a monthly mix of useful, promotional, trust-building, and timely content." },
      { step: "03", title: "Create & publish", copy: "Approved content is prepared, scheduled, published, and monitored." },
      { step: "04", title: "Report & refine", copy: "We review audience response and improve future themes, formats, and timing." },
    ],
    faqs: [
      { question: "Which platforms do you manage?", answer: "Instagram, Facebook, and LinkedIn are common. The right channels are agreed around your audience and available content resources." },
      { question: "Does management include photography or video shoots?", answer: "Production can be added, but it is scoped separately because requirements vary by location, quantity, and creative complexity." },
      { question: "Will you reply to every message?", answer: "Community coverage, hours, response types, and escalation rules are agreed before work begins. Sales or support decisions may remain with your team." },
      { question: "How many posts are included?", answer: "Posting frequency is package-specific and should follow the channel strategy rather than an arbitrary volume." },
    ],
    seoTitle: "Social Media Management Services",
    seoDescription: "Social content calendars, publishing, scheduling, community management, brand consistency, and monthly reporting.",
  },
  {
    slug: "social-media-marketing",
    number: "08",
    title: "Social Media Marketing",
    cardDescription: "Channel-specific strategy and creative campaigns that turn attention into engagement and qualified conversations.",
    tags: ["Campaign strategy", "Creative direction", "Reporting"],
    eyebrow: "Campaigns built around a purpose",
    heroTitle: "Social marketing that connects",
    heroAccent: "content to commercial goals.",
    heroCopy: "Digitrust develops channel-specific campaigns, creative directions, launch plans, and measurement frameworks that give social activity a clear role in brand and business growth.",
    idealFor: ["Brands launching products or services", "Businesses running seasonal campaigns", "Teams entering a new audience segment", "Companies combining organic and paid social"],
    problems: [
      { title: "Activity without strategy", copy: "Posts are published regularly but do not build toward a defined audience or business objective." },
      { title: "Generic campaign ideas", copy: "The same creative approach is repeated across channels without respecting audience behaviour." },
      { title: "Weak measurement", copy: "Reports list reach and likes without explaining what changed or what the team should do next." },
    ],
    deliverables: [
      { title: "Audience & channel strategy", copy: "Priority segments, platform roles, themes, formats, messages, and campaign objectives." },
      { title: "Campaign concepts", copy: "Launch, seasonal, promotional, educational, and partnership ideas connected by a clear narrative." },
      { title: "Creative direction", copy: "Hooks, copy territories, visual briefs, format recommendations, and content journeys." },
      { title: "Measurement framework", copy: "Relevant indicators, campaign tracking, learning summaries, and next-step recommendations." },
    ],
    technologies: ["Instagram", "Facebook", "LinkedIn", "Meta Ads", "Campaign Planning", "Analytics", "Creative Testing", "Landing Pages"],
    outcomes: ["More purposeful social campaigns", "Stronger alignment across organic and paid activity", "Creative built around audience insight", "Reporting that leads to decisions"],
    process: [
      { step: "01", title: "Market & audience review", copy: "We clarify the offer, audience, competitors, campaign moment, and available assets." },
      { step: "02", title: "Campaign strategy", copy: "We define the idea, messages, channels, formats, journey, timeline, and measures." },
      { step: "03", title: "Activation", copy: "Creative production, publishing, partnerships, landing pages, and paid support are coordinated." },
      { step: "04", title: "Learn & evolve", copy: "We interpret performance and audience response to guide the next campaign." },
    ],
    faqs: [
      { question: "How is social media marketing different from management?", answer: "Management handles the ongoing channel operation. Marketing focuses on audience strategy, campaigns, creative direction, launches, and measurable growth objectives." },
      { question: "Can organic and paid social work together?", answer: "Yes. Strong campaign concepts can be adapted across organic content, creator activity, retargeting, and paid acquisition." },
      { question: "Do you work with influencers?", answer: "Influencer or creator planning can be included. Selection, outreach, fees, contracts, and production requirements are scoped clearly." },
      { question: "Which metrics will you report?", answer: "Metrics depend on the campaign goal and may include qualified reach, engagement quality, traffic, leads, sales, cost, and audience learning." },
    ],
    seoTitle: "Social Media Marketing & Campaign Strategy",
    seoDescription: "Social media strategy, campaign concepts, creative direction, organic and paid coordination, launches, and meaningful reporting.",
  },
];

export const serviceTitles = services.map((service) => service.title);

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
