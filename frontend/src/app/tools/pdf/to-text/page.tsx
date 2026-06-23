import { constructMetadata } from "@/lib/seo";
import PdfToTextClient from "./client";

export const metadata = constructMetadata({
  title: "PDF to Text",
  description: "Extract plain text from PDF documents and download as a .txt file.",
  path: "/tools/pdf/to-text",
});

export default function PdfToTextPage() {
  return <PdfToTextClient />;
}
