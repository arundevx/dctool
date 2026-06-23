import { constructMetadata } from "@/lib/seo";
import PdfCompressClient from "./client";

export const metadata = constructMetadata({
  title: "Compress PDF",
  description: "Reduce PDF file size online for free. Secure processing with automatic file deletion.",
  path: "/tools/pdf/compress",
});

export default function PdfCompressPage() {
  return <PdfCompressClient />;
}
