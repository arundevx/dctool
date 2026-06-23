import { constructMetadata } from "@/lib/seo";
import MetaDescriptionClient from "./client";

export const metadata = constructMetadata({
  title: "Meta Description Length Checker",
  description: "Check if your meta description is the optimal length for SEO.",
  path: "/tools/seo/meta-description",
});

export default function MetaDescriptionPage() {
  return <MetaDescriptionClient />;
}
