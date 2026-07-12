export type ServiceSlug =
  | "web-development"
  | "shopify-development"
  | "wordpress-development"
  | "full-stack-development"
  | "seo"
  | "meta-ads"
  | "social-media-management"
  | "social-media-marketing";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  services: ServiceSlug[];
  featured?: boolean;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Our store conversion rate jumped from 1.2% to 3.8% in just 30 days. No bloated apps, just pure speed and custom coding.",
    name: "Rohit Sharma",
    role: "Founder",
    company: "Mega Brands India",
    services: ["shopify-development", "web-development"],
    featured: true,
  },
  {
    quote:
      "We slashed our monthly Shopify app subscriptions by $148 with their custom Liquid coding. The site loads in under 1.5 seconds now.",
    name: "Ankit Vora",
    role: "Founder",
    company: "Vora Activewear",
    services: ["shopify-development"],
  },
  {
    quote:
      "Finally, developers who understand sales psychology, not just pretty designs. Coded bundles alone boosted order values.",
    name: "Priya Mehta",
    role: "Marketing Director",
    company: "Zoya Jewelry",
    services: ["shopify-development", "web-development"],
  },
  {
    quote:
      "Our site went from being invisible to ranking on Google's first page for our main keywords within 6 weeks. Technical SEO is outstanding.",
    name: "Amit Kumar",
    role: "Founder",
    company: "Zen Logistics",
    services: ["wordpress-development", "seo"],
    featured: true,
  },
  {
    quote:
      "The lead quality changed overnight. We stopped getting spam and started booking high-ticket strategy calls directly from form funnels.",
    name: "Neha Roy",
    role: "Consultant",
    company: "Roy Coaching & Partners",
    services: ["wordpress-development", "web-development", "seo"],
    featured: true,
  },
  {
    quote:
      "The Next.js and Node architecture they deployed is rock solid. Our storefront handles peak launch traffic spikes without a single hiccup.",
    name: "Karan Dave",
    role: "CEO",
    company: "SaaS Tech Logistics",
    services: ["full-stack-development", "web-development"],
    featured: true,
  },
  {
    quote:
      "We hit a 10x ROI in our very first campaign. They built a conversion landing page system, not just a random ad set.",
    name: "Suresh Patel",
    role: "Founder",
    company: "D2C Organics",
    services: ["meta-ads", "social-media-marketing"],
    featured: true,
  },
  {
    quote:
      "Our WhatsApp order flows combined with their Meta Ads strategy slashed our lead acquisition costs by 40%.",
    name: "Ravi Joshi",
    role: "Operations Manager",
    company: "Joshi Services Ltd",
    services: ["meta-ads", "social-media-management", "social-media-marketing"],
    featured: true,
  },
];

export const featuredTestimonials = testimonials.filter(
  (testimonial) => testimonial.featured,
);

export function getTestimonialsForService(service: ServiceSlug) {
  return testimonials.filter((testimonial) =>
    testimonial.services.includes(service),
  );
}
