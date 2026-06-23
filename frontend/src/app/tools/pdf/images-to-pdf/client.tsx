"use client";

import { ImagesToPdfClient } from "@/components/tools/images-to-pdf-client";

export default function PdfImagesToPdfClient() {
  return (
    <ImagesToPdfClient
      category="pdf"
      toolTitle="Images to PDF"
      pageTitle="Images to PDF"
      description="Combine multiple images into one PDF. Order follows upload order."
      toolHref="/tools/pdf/images-to-pdf"
    />
  );
}
