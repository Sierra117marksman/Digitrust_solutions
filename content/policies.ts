export type PolicySection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

export type Policy = {
  slug: string;
  shortTitle: string;
  title: string;
  description: string;
  intro: string;
  sections: PolicySection[];
};

const disputeResolution: PolicySection = {
  title: "Governing law, dispute resolution and Delhi jurisdiction",
  items: [
    "These terms and any service engagement are governed by the laws of India.",
    "The parties should first attempt to resolve a dispute through written communication and good-faith discussion for at least 30 days after a written dispute notice, unless urgent interim relief is reasonably required.",
    "If a commercial dispute remains unresolved, it may be referred to arbitration under the Arbitration and Conciliation Act, 1996. The tribunal will consist of a sole arbitrator mutually appointed by the parties, the seat and venue will be New Delhi, India, and proceedings will be conducted in English.",
    "Subject to the arbitration clause, applicable law, and any non-waivable consumer remedy, courts at New Delhi, Delhi will have exclusive jurisdiction.",
    "Nothing in these policies limits any right or remedy that cannot lawfully be excluded, including rights available under applicable consumer-protection law.",
  ],
};

export const policies: Policy[] = [
  {
    slug: "privacy-policy",
    shortTitle: "Privacy",
    title: "Privacy Policy",
    description: "How Digitrust Solutions collects, uses, stores, shares, and protects personal information.",
    intro: "This Privacy Policy explains how Digitrust Solutions handles information received through this website, enquiry forms, meetings, communications, campaigns, and client-service workflows.",
    sections: [
      {
        title: "Who we are",
        paragraphs: [
          "Digitrust Solutions is a digital services business located at Palam Vihar, Gurugram, Haryana - 122017, India. GSTIN: 06DUYPD9228L1ZT.",
          "For applicable data-protection purposes, Digitrust Solutions determines why and how personal information submitted directly to us is processed, unless a written client agreement states that we process particular data only on a client's instructions.",
        ],
      },
      {
        title: "Information we may collect",
        items: [
          "Contact and business details such as name, email address, phone number, company, role, billing information, and correspondence.",
          "Enquiry and project information such as service interest, requirements, objectives, budgets, timelines, content, product data, technical dependencies, approvals, and feedback.",
          "Client-service information such as credentials shared through approved channels, account identifiers, access permissions, assets, documents, communication history, support requests, and deliverables.",
          "Technical and usage information such as IP address, browser, device type, referral source, pages viewed, approximate location derived from technical data, server logs, security events, and cookie or analytics identifiers where enabled.",
          "Marketing information such as campaign responses, consent preferences, lead source, engagement, and opt-out requests.",
        ],
      },
      {
        title: "Purposes and lawful processing",
        items: [
          "To respond to enquiries, qualify requirements, schedule meetings, prepare proposals, and communicate about requested services.",
          "To enter into and perform service agreements, deliver websites, software, commerce, SEO, advertising, social media, support, and related work.",
          "To operate, secure, troubleshoot, analyse, and improve our website, systems, service quality, and internal processes.",
          "To manage invoices, accounts, business records, tax, contractual obligations, fraud prevention, legal claims, and regulatory compliance.",
          "To send marketing communication where consent or another lawful basis applies, and to record or honour opt-out preferences.",
          "We process information on the basis of consent, steps requested before or under a contract, compliance with law, and other legitimate or permitted uses available under applicable law.",
        ],
      },
      {
        title: "Cookies, analytics and advertising technologies",
        items: [
          "The website may use essential storage or cookies required for security, hosting, forms, preferences, and reliable operation.",
          "If analytics, advertising pixels, conversion tags, or remarketing tools are enabled, they may process device, page-view, interaction, referral, and conversion information according to their own terms.",
          "Where applicable law requires consent for non-essential technologies, we will seek consent before using them. You may also manage cookies through browser settings, although blocking essential technologies may affect functionality.",
          "Further information is available in our Cookie Policy.",
        ],
      },
      {
        title: "Sharing and service providers",
        items: [
          "We do not sell personal information.",
          "We may share limited information with hosting, cloud, database, communications, analytics, CRM, payment, accounting, advertising, development, security, and professional-service providers where reasonably necessary.",
          "Information may be disclosed when required by law, court or government process, payment-dispute procedures, fraud prevention, security response, corporate reorganisation, or protection of legal rights.",
          "Client data may be made available to authorised team members and contractors who need it for the agreed work and are subject to appropriate obligations.",
        ],
      },
      {
        title: "International and third-party processing",
        items: [
          "Some cloud, analytics, advertising, communication, and software providers may process information outside your state or outside India.",
          "Where cross-border processing occurs, we will take reasonable steps required by applicable law and remain subject to any government restriction on transfers.",
          "Third-party websites and platforms have independent policies. We are not responsible for their separate processing practices.",
        ],
      },
      {
        title: "Retention",
        items: [
          "Enquiry records are retained for reasonable follow-up, relationship history, security, and business-record purposes.",
          "Project records may be retained during the engagement and afterwards for support, continuity, accounting, tax, contractual, warranty, dispute, and legal requirements.",
          "Information may be deleted, anonymised, or securely archived when it is no longer reasonably required, subject to mandatory retention and legitimate legal needs.",
        ],
      },
      {
        title: "Security",
        items: [
          "We use reasonable technical and organisational measures intended to protect information against unauthorised access, misuse, alteration, disclosure, and loss.",
          "No internet transmission, device, cloud service, or storage system can be guaranteed completely secure. Clients should share credentials through approved secure methods, use limited permissions, maintain backups, and revoke access when no longer needed.",
          "If we become aware of a personal-data breach, we will assess and respond to it in accordance with obligations that are legally in force at that time.",
        ],
      },
      {
        title: "Your choices and requests",
        items: [
          "Subject to applicable law, you may request information about processing, correction, completion, erasure, withdrawal of consent, grievance redressal, or nomination where such rights apply.",
          "Withdrawal of consent does not affect processing already lawfully completed and may prevent us from continuing a requested service where the information is necessary.",
          "We may verify identity and retain information where required for contracts, tax, accounting, security, fraud prevention, legal claims, or compliance.",
          "Marketing communication can be stopped through an unsubscribe option where provided or by submitting a request through our website contact form.",
        ],
      },
      {
        title: "Children's information",
        items: [
          "Our website and services are directed to businesses and adult decision-makers. We do not knowingly seek personal information from children.",
          "If you believe a child has submitted information, contact us so that we can review and take appropriate action.",
        ],
      },
      {
        title: "Privacy contact and grievance requests",
        items: [
          "Privacy, correction, deletion, consent, and grievance requests may be submitted through the contact form on this website or sent by post to Digitrust Solutions, Palam Vihar, Gurugram, Haryana - 122017, India.",
          "Please include your name, contact details, relationship with us, and a clear description of the request. We may ask for information reasonably needed to verify identity and locate the relevant record.",
          "This policy is intended to operate with the Digital Personal Data Protection Act, 2023, the Information Technology Act, 2000, and related rules or provisions as they are brought into force or amended from time to time.",
        ],
      },
      disputeResolution,
    ],
  },
  {
    slug: "terms-and-conditions",
    shortTitle: "Terms",
    title: "Terms and Conditions",
    description: "Terms governing use of the Digitrust Solutions website and our digital services.",
    intro: "These Terms govern use of this website and Digitrust Solutions' development, commerce, SEO, advertising, social media, consulting, maintenance, and related digital services.",
    sections: [
      {
        title: "Acceptance and project documents",
        items: [
          "By using the website, submitting an enquiry, approving a proposal, making a payment, or engaging us for services, you agree to these Terms to the extent applicable.",
          "A signed agreement, proposal, statement of work, approved quotation, invoice, email confirmation, or platform order may contain project-specific scope and terms. Project-specific written terms prevail for that engagement if they expressly conflict with these website Terms.",
          "Electronic records, approvals, and contracts may be used to conduct business as permitted by applicable law, including the Information Technology Act, 2000.",
        ],
      },
      {
        title: "Services and scope",
        items: [
          "Services may include website, Shopify, WordPress, full-stack software, CRM, API, SEO, Meta Ads, social media management, social media marketing, design, consulting, deployment, maintenance, and related work.",
          "Scope, deliverables, fees, assumptions, dependencies, revisions, timelines, and responsibilities are defined through written project documents.",
          "Features, pages, integrations, content, migration, campaigns, support, or revisions outside the agreed scope may require a change request, additional fees, and a revised schedule.",
          "Estimates, audits, recommendations, projections, and initial timelines are indicative until discovery and scope confirmation are complete.",
        ],
      },
      {
        title: "Fees, taxes and third-party costs",
        items: [
          "Payments must follow the agreed invoice or milestone schedule. Work, deployment, support, or handover may be paused while an amount is overdue.",
          "Quoted fees exclude GST and other taxes unless expressly stated otherwise.",
          "Domains, hosting, cloud usage, software licences, themes, plugins, stock assets, payment charges, creator fees, ad spend, and third-party subscriptions are separate unless expressly included.",
          "The Refund and Cancellation Policy forms part of these Terms.",
        ],
      },
      {
        title: "Client responsibilities",
        items: [
          "Clients must provide accurate requirements, authorised decisions, content, assets, legal text, product data, credentials, platform access, approvals, and feedback required for delivery.",
          "Clients confirm that they have the necessary rights and lawful basis for materials, trademarks, data, audiences, lists, credentials, and instructions supplied to us.",
          "The client remains responsible for its products, services, prices, claims, offers, legal notices, regulatory obligations, customer service, fulfilment, and business decisions.",
          "Delays in information, payment, approvals, content, access, or third-party response may extend schedules and require rescheduling or additional charges.",
        ],
      },
      {
        title: "Third-party platforms",
        items: [
          "Work may depend on providers such as Vercel, MongoDB, Shopify, WordPress, Meta, Google, cloud platforms, payment gateways, email services, domains, registrars, analytics, APIs, and other vendors.",
          "We are not responsible for a third party's downtime, account decisions, policy changes, price changes, API limits, security incidents, defects, data loss, rejection, suspension, or service discontinuation beyond our reasonable control.",
          "Clients are responsible for reviewing and complying with vendor terms, maintaining ownership of business accounts, paying vendor charges, and preserving suitable backups unless otherwise agreed.",
        ],
      },
      {
        title: "Credentials, access and acceptable use",
        items: [
          "Credentials should be shared using secure approved methods and, where possible, through limited-role accounts rather than personal master passwords.",
          "You must not use our website or services for unlawful, fraudulent, deceptive, abusive, infringing, malicious, discriminatory, or unauthorised activity.",
          "We may refuse, suspend, or terminate work that creates legal, ethical, platform, security, payment, or reputational risk.",
        ],
      },
      {
        title: "Intellectual property",
        items: [
          "Subject to full payment, final custom deliverables created specifically for the client are assigned or licensed as stated in the project documents.",
          "Digitrust Solutions retains ownership of pre-existing materials, know-how, methods, internal tools, reusable components, libraries, templates, workflows, and general skills used during delivery.",
          "Open-source software, fonts, stock assets, APIs, platform tools, themes, plugins, and other third-party materials remain subject to their own licences and restrictions.",
          "Unless confidentiality or white-label restrictions are agreed in writing, we may identify the client and display public, non-confidential work or outcomes in portfolios, proposals, and case studies after public launch.",
        ],
      },
      {
        title: "Reviews, acceptance, warranties and changes",
        items: [
          "Clients must review milestones within the agreed review period and provide consolidated, specific feedback.",
          "A deliverable may be treated as accepted when approved, deployed, used commercially, paid for as an accepted milestone, or not reasonably disputed within the agreed review period.",
          "Included revisions and bug-fix periods apply only to the agreed scope. New features, changed requirements, third-party changes, client edits, compromised credentials, hosting issues, and misuse may be separately chargeable.",
        ],
      },
      {
        title: "Marketing and business results",
        items: [
          "We do not guarantee revenue, profit, rankings, traffic, conversions, return on advertising spend, lead quantity, lead quality, follower growth, platform approval, or any other commercial result.",
          "Results depend on the market, offer, price, competition, content, product quality, traffic, budget, platform decisions, sales response, client operations, and other factors beyond our control.",
          "Reports, forecasts, case studies, and recommendations are informational and should not be treated as financial, legal, tax, or investment advice.",
        ],
      },
      {
        title: "Confidentiality and data",
        items: [
          "Each party should protect non-public information received for the engagement and use it only for the agreed purpose, subject to disclosure required by law or professional advice.",
          "Our Privacy Policy explains how personal information is handled. Project-specific data-processing obligations may be recorded separately where required.",
        ],
      },
      {
        title: "Suspension and termination",
        items: [
          "Either party may terminate according to the written project terms. Amounts for completed work, reserved resources, non-cancellable commitments, and third-party costs remain payable.",
          "We may suspend or terminate for non-payment, prolonged client inactivity, unlawful instructions, abusive conduct, repeated material scope changes, security risk, platform violation, or material breach.",
          "On termination and subject to payment, we will provide completed deliverables reasonably due under the agreed scope. Transition assistance beyond that scope may be charged separately.",
        ],
      },
      {
        title: "Disclaimers and limitation of liability",
        items: [
          "The website and any free information are provided on an as-available basis without a guarantee that they will be uninterrupted, error-free, or suitable for every purpose.",
          "To the maximum extent permitted by law, neither party will be liable for indirect, incidental, special, punitive, exemplary, or consequential loss, including loss of profit, opportunity, goodwill, revenue, or data.",
          "To the maximum extent permitted by law, our aggregate liability arising from a specific paid service will not exceed the fees actually paid to us for that service during the six months preceding the event giving rise to the claim.",
          "These limitations do not exclude liability that cannot lawfully be limited, or liability for fraud or wilful misconduct.",
        ],
      },
      {
        title: "Changes and severability",
        items: [
          "We may update these website Terms prospectively. The updated date will be shown on the page. Material project changes require written agreement.",
          "If a provision is held invalid or unenforceable, it will be limited to the minimum extent necessary and the remaining provisions will continue to apply.",
          "A failure to enforce a provision immediately is not a waiver of that provision.",
        ],
      },
      disputeResolution,
    ],
  },
  {
    slug: "refund-and-cancellation-policy",
    shortTitle: "Refunds",
    title: "Refund and Cancellation Policy",
    description: "How refunds, cancellations, retainers, milestones, and third-party costs are handled.",
    intro: "Digitrust Solutions provides customised digital services involving reserved time, planning, strategy, creative work, configuration, code, campaigns, and third-party commitments. This policy explains how cancellations and refund requests are assessed.",
    sections: [
      {
        title: "When work is considered started",
        items: [
          "Work is considered started when discovery, research, audit, planning, strategy, design, content, development, setup, configuration, account work, campaign preparation, meetings, or project-specific communication begins.",
          "Resource reservation, onboarding, requirement analysis, environment setup, and third-party procurement may also constitute commencement where they form part of the engagement.",
        ],
      },
      {
        title: "General refund position",
        items: [
          "Payments are not automatically refundable merely because a client changes direction, delays inputs, stops responding, no longer needs the work, or is dissatisfied with a result that was not guaranteed.",
          "Fees attributable to work performed, time spent, accepted milestones, reserved capacity, approved output, consumed retainers, and non-recoverable third-party costs are non-refundable to the extent permitted by law.",
          "Nothing in this policy removes a mandatory refund or remedy available under applicable law.",
        ],
      },
      {
        title: "Situations that may qualify",
        items: [
          "A verified duplicate payment or accidental overpayment will be refunded or adjusted.",
          "A payment made before any work starts may be considered for refund after deducting payment charges, non-recoverable costs, and any specifically reserved resources disclosed in the project terms.",
          "Where a milestone agreement separates unused future work from completed work, a proportionate unused amount may be considered after reconciliation.",
          "If we cancel for reasons not caused by the client, we will assess a refund of the unused portion after completed work and committed third-party expenses are accounted for.",
        ],
      },
      {
        title: "Non-refundable charges",
        items: [
          "Discovery, consultation, audit, research, strategy, planning, onboarding, design, content, completed milestones, approved deliverables, and work already performed.",
          "Domains, hosting, cloud usage, software licences, themes, plugins, stock assets, fonts, API credits, creator fees, payment charges, and subscriptions already purchased, allocated, or used.",
          "Advertising spend paid to Meta, Google, creators, publishers, or other media providers, which remains subject to the relevant provider's policy.",
          "Rush work, emergency support, monthly retainers, maintenance allocations, and support hours already reserved or consumed.",
        ],
      },
      {
        title: "Client cancellation, pause or abandonment",
        items: [
          "Cancellation requests must be submitted in writing through the website contact form or another agreed written channel.",
          "If cancellation occurs after work starts, we may invoice or retain amounts for completed work, work in progress, resource allocation, administrative effort, payment charges, and third-party commitments.",
          "A project paused by the client may be rescheduled subject to availability. A prolonged pause may require revised pricing, technical updates, and a restart fee.",
          "A project may be treated as abandoned after prolonged non-response, missing dependencies, unpaid invoices, or failure to approve next steps after reasonable written reminders.",
        ],
      },
      {
        title: "Subscription, retainer and campaign cancellation",
        items: [
          "Recurring or monthly services must be cancelled within the notice period stated in the proposal or agreement. Cancellation takes effect prospectively and does not reverse work or capacity already supplied.",
          "Ad-platform spend and active third-party commitments may continue until they are paused or cancelled in the relevant account. The client remains responsible for charges incurred before cancellation takes effect.",
          "Unused monthly deliverables or hours do not roll over unless the written package expressly allows it.",
        ],
      },
      {
        title: "Refund request and processing",
        items: [
          "Submit the request through our website contact form with the client name, invoice or payment reference, service, payment proof, amount, and detailed reason.",
          "We may request supporting information and will assess the request against the project documents, work records, expenses, and applicable law.",
          "An approved refund is ordinarily initiated within 7 to 10 business days after written approval. Banks and payment providers may require additional processing time.",
          "Refunds are generally returned to the original payment method. Transaction fees and foreign-exchange differences may be deducted where they are not recoverable from the provider and deduction is lawful.",
        ],
      },
      disputeResolution,
    ],
  },
  {
    slug: "service-delivery-policy",
    shortTitle: "Delivery",
    title: "Service Delivery Policy",
    description: "How Digitrust Solutions manages milestones, reviews, digital delivery, deployment, handover, and support.",
    intro: "This policy explains how our digital services and deliverables are planned, reviewed, delivered, deployed, accepted, and supported. We do not ordinarily ship physical products.",
    sections: [
      {
        title: "Digital deliverables",
        items: [
          "Deliverables may include strategy, reports, audits, creative assets, content, campaign structures, code, websites, stores, software, dashboards, APIs, databases, configurations, documentation, training, deployment, or support.",
          "Delivery may occur through email, shared documents, approved messaging channels, meetings, repositories, cloud dashboards, staging links, production links, project-management tools, or client-controlled systems.",
        ],
      },
      {
        title: "Schedules and estimates",
        items: [
          "Estimated schedules depend on scope, complexity, team availability, client inputs, content, approvals, payment milestones, integrations, platforms, and third-party response times.",
          "Schedules may change where requirements change, dependencies are delayed, approvals are not received, third-party systems fail, or unforeseen technical work is discovered.",
          "Rush or fixed-date delivery requires written confirmation and may involve additional fees or reduced scope.",
        ],
      },
      {
        title: "Milestones and reviews",
        items: [
          "Projects may be divided into discovery, strategy, design, content, development, campaign setup, testing, deployment, and handover milestones.",
          "Clients must review each milestone within the stated review period and provide consolidated, authorised feedback.",
          "If no clear objection is received within the review period after reasonable follow-up, the milestone may be treated as accepted for scheduling and billing purposes, subject to applicable law and written project terms.",
        ],
      },
      {
        title: "Client dependencies",
        items: [
          "The client must provide accurate content, brand assets, product data, legal notices, offers, account access, credentials, API information, domain or hosting access, payment details, approvals, and business rules on time.",
          "We are not responsible for delay caused by missing or incorrect information, unavailable stakeholders, late payment, delayed approval, platform review, DNS propagation, third-party outage, or external vendor action.",
        ],
      },
      {
        title: "Deployment and handover",
        items: [
          "Deployment may be made to staging, production, or client-controlled infrastructure according to scope and access availability.",
          "Handover may include repository access, deployment links, accounts, documentation, environment guidance, agreed credentials, reports, files, and walkthroughs.",
          "Source files, production release, administrative ownership, or final handover may be withheld while agreed payments remain overdue, to the extent permitted by law and contract.",
          "Clients should change shared passwords, review users, preserve backups, and confirm ownership after handover.",
        ],
      },
      {
        title: "Revisions and change requests",
        items: [
          "Included revisions are limited to the agreed scope and review rounds.",
          "New pages, features, workflows, integrations, redesigns, campaign requirements, migrations, data work, or material changes may require a written change request, revised fee, and updated schedule.",
          "Corrections to agreed functionality during a stated warranty period are distinguished from enhancements or third-party changes.",
        ],
      },
      {
        title: "Support and maintenance",
        items: [
          "Post-delivery support is provided only where included in the project, warranty, retainer, or maintenance agreement.",
          "Support may exclude new features, client or third-party edits, platform policy changes, hosting outages, compromised accounts, content changes, or incidents outside the agreed scope.",
          "Ongoing maintenance, monitoring, backups, updates, campaign optimisation, analytics review, and support may be quoted separately.",
        ],
      },
      {
        title: "Acceptance",
        items: [
          "A deliverable may be considered delivered when it is shared through the agreed channel, deployed, handed over, approved, or used commercially.",
          "Clients should report defects with clear reproduction information during the agreed review or warranty period so that they can be assessed promptly.",
        ],
      },
      disputeResolution,
    ],
  },
  {
    slug: "cookie-policy",
    shortTitle: "Cookies",
    title: "Cookie Policy",
    description: "How cookies, local storage, analytics, pixels, and similar technologies may be used on this website.",
    intro: "This Cookie Policy explains the small files and similar technologies that may be used when you visit the Digitrust Solutions website, and the choices available to you.",
    sections: [
      {
        title: "What cookies and similar technologies are",
        paragraphs: [
          "Cookies are small text files stored by a browser. Similar technologies include local storage, tags, pixels, scripts, and identifiers used to provide features, protect services, remember preferences, understand usage, or measure campaigns.",
        ],
      },
      {
        title: "Categories we may use",
        items: [
          "Strictly necessary technologies support hosting, security, network management, form protection, session integrity, and other functions needed to provide the website.",
          "Preference technologies remember choices such as language, region, display, or consent where those features are enabled.",
          "Analytics technologies help understand page use, performance, errors, referral sources, and aggregate interaction patterns.",
          "Advertising and measurement technologies may connect visits or conversions with campaigns on platforms such as Meta or Google where those tools are enabled.",
        ],
      },
      {
        title: "Current and future tools",
        items: [
          "The exact technologies may change as hosting, analytics, security, forms, and advertising configurations evolve.",
          "A provider may receive technical information such as IP address, device, browser, page URL, timestamp, referral information, event data, and cookie or advertising identifiers.",
          "Non-essential analytics or advertising tools will be managed in accordance with consent requirements that apply at the relevant time.",
        ],
      },
      {
        title: "Your controls",
        items: [
          "You can delete or block cookies through browser settings. Browser help pages explain the available controls.",
          "Where a consent control is displayed, you can use it to accept, reject, or change optional categories.",
          "Blocking essential storage may prevent forms, preferences, security controls, or other website features from working correctly.",
          "You may also use the privacy and advertising settings offered by your device, browser, Meta, Google, and other providers.",
        ],
      },
      {
        title: "Third-party responsibility",
        items: [
          "Third-party providers control their own technologies and process information under their own privacy terms. Their practices may change independently of this website.",
          "Links to external websites do not mean that we control their cookies or privacy practices.",
        ],
      },
      {
        title: "Contact and updates",
        items: [
          "Cookie questions may be submitted through the website contact form or sent by post to our Gurugram business address stated in the Privacy Policy.",
          "We may update this policy when technologies, providers, or applicable requirements change.",
        ],
      },
      disputeResolution,
    ],
  },
];

export function getPolicy(slug: string) {
  return policies.find((policy) => policy.slug === slug);
}
