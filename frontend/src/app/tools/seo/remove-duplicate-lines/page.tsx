import { constructMetadata } from "@/lib/seo";
import RemoveDuplicateLinesClient from "./client";

export const metadata = constructMetadata({
  title: "Remove Duplicate Lines",
  description: "Remove duplicate lines from text while preserving order.",
  path: "/tools/seo/remove-duplicate-lines",
});

export default function RemoveDuplicateLinesPage() {
  return <RemoveDuplicateLinesClient />;
}
