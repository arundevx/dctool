import { constructMetadata } from "@/lib/seo";
import HeadingAnalyzerClient from "./client";

export const metadata = constructMetadata({
  title: "Heading Structure Analyzer",
  description: "Analyze H1–H6 heading hierarchy from HTML for SEO.",
  path: "/tools/seo/heading-analyzer",
});

export default function HeadingAnalyzerPage() {
  return <HeadingAnalyzerClient />;
}
