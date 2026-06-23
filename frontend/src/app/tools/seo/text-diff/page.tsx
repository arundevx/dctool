import { constructMetadata } from "@/lib/seo";
import TextDiffClient from "./client";

export const metadata = constructMetadata({
  title: "Text Diff Checker",
  description: "Compare two blocks of text and highlight added and removed lines.",
  path: "/tools/seo/text-diff",
});

export default function TextDiffPage() {
  return <TextDiffClient />;
}
