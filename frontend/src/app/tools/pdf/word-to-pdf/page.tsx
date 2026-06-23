import { constructMetadata } from "@/lib/seo";
import WordToPdfClient from "./client";

export const metadata = constructMetadata({
  title: "Word to PDF",
  description: "Convert Word (.docx) documents to PDF online for free.",
  path: "/tools/pdf/word-to-pdf",
});

export default function WordToPdfPage() {
  return <WordToPdfClient />;
}
