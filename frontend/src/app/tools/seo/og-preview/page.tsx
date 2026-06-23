import { constructMetadata } from "@/lib/seo";
import OgPreviewClient from "./client";

export const metadata = constructMetadata({
  title: "Open Graph Preview",
  description: "Preview how your page will look when shared on social media.",
  path: "/tools/seo/og-preview",
});

export default function OgPreviewPage() {
  return <OgPreviewClient />;
}
