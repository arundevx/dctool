import { constructMetadata } from "@/lib/seo";
import HreflangClient from "./client";

export const metadata = constructMetadata({
  title: "hreflang Tag Generator",
  description: "Generate hreflang link tags for multilingual SEO.",
  path: "/tools/seo/hreflang",
});

export default function HreflangPage() {
  return <HreflangClient />;
}
