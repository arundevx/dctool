"use client";

import { ImagesToPdfClient } from "@/components/tools/images-to-pdf-client";

export default function ImageToPdfClient() {
  return (
    <ImagesToPdfClient
      category="image"
      toolTitle="Image to PDF"
      pageTitle="Image to PDF"
      description="Convert any image to a PDF file in one click."
      toolHref="/tools/image/to-pdf"
      singleImage
    />
  );
}
