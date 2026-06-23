import { constructMetadata } from "@/lib/seo";
import SitemapClient from "./client";

export const metadata = constructMetadata({
  title: "XML Sitemap Generator",
  description: "Generate an XML sitemap for your website. Free, fast, and runs in your browser.",
  path: "/tools/seo/sitemap",
});

export default function SitemapPage() {
  return <SitemapClient />;
}
