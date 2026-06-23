import type { MetadataRoute } from "next";
import { ALL_TOOLS, CATEGORY_META } from "@/lib/tools";
import { siteConfig } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteConfig.url}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteConfig.url}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    ...Object.values(CATEGORY_META).map((cat) => ({
      url: `${siteConfig.url}${cat.href}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];

  const toolPages: MetadataRoute.Sitemap = ALL_TOOLS.map((tool) => ({
    url: `${siteConfig.url}${tool.href}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: tool.popular ? 0.8 : 0.7,
  }));

  return [...staticPages, ...toolPages];
}
