export const companyConfig = {
  company: {
    name: "Digitrust Solutions",
    shortName: "Digitrust",
    legalName: "Digitrust Solutions",
    gst: "06DUYPD9228L1ZT",
    pan: "",
    foundedYear: 2024,
  },
  contact: {
    email: "hello@digitrust.in",
    phone: "+91 99999 99999",
    whatsapp: "+91 99999 99999",
    address: "Palam Vihar, Gurugram, Haryana - 122017",
    city: "Gurugram",
    state: "Haryana",
    country: "India",
    postalCode: "122017",
  },
  branding: {
    logo: "/brand/logo.png",
    logoSvg: "/brand/logo.svg",
    favicon: "/brand/logo.png",
    primaryColor: "#219DC5",
    secondaryColor: "#0B1F33",
  },
  seo: {
    title: "Digitrust Solutions | Digital Growth & Full-Stack Development",
    description: "Digitrust Solutions is a Gurugram-based digital agency specialising in web development, social media, SEO, Meta ads, and full-stack development.",
    ogImage: "/og.png",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://digitrustsolutions.com",
  },
} as const;

export type CompanyConfig = typeof companyConfig;
