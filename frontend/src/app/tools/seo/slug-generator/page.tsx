import { constructMetadata } from "@/lib/seo";
import SlugGeneratorClient from "./client";

export const metadata = constructMetadata({
  title: "Slug Generator",
  description: "Convert text into URL-friendly slugs for blog posts and pages.",
  path: "/tools/seo/slug-generator",
});

export default function SlugGeneratorPage() {
  return <SlugGeneratorClient />;
}
