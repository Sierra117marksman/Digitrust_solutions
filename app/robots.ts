import type { MetadataRoute } from "next";
import { companyConfig } from "@/config/company";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = companyConfig.seo.siteUrl;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/admin"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: "digitrustsolutions.com",
  };
}
