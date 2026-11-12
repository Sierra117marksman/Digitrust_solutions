import type { MetadataRoute } from "next";
import { companyConfig } from "@/config/company";
import { services } from "../content/services";
import { policies } from "../content/policies";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = companyConfig.seo.siteUrl;
  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/client-results`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...services.map((service) => ({
      url: `${siteUrl}/services/${service.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...policies.map((policy) => ({
      url: `${siteUrl}/policies/${policy.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })),
  ];
}
