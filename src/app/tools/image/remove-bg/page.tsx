import { constructMetadata } from "@/lib/seo";
import RemoveBgClient from "./client";

export const metadata = constructMetadata({
  title: "AI Background Remover",
  description: "Remove image backgrounds instantly and accurately for free with our AI-powered tool.",
  path: "/tools/image/remove-bg",
});

export default function RemoveBgPage() {
  return <RemoveBgClient />;
}
