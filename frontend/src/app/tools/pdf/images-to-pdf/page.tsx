import { constructMetadata } from "@/lib/seo";
import ImagesToPdfClient from "./client";

export const metadata = constructMetadata({
  title: "Images to PDF",
  description: "Combine multiple images into a single PDF document.",
  path: "/tools/pdf/images-to-pdf",
});

export default function PdfImagesToPdfPage() {
  return <ImagesToPdfClient />;
}
