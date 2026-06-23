import { constructMetadata } from "@/lib/seo";
import CanonicalCheckerClient from "./client";

export const metadata = constructMetadata({
  title: "Canonical URL Checker",
  description: "Normalize and compare URLs to check if they are canonical equivalents.",
  path: "/tools/seo/canonical-checker",
});

export default function CanonicalCheckerPage() {
  return <CanonicalCheckerClient />;
}
