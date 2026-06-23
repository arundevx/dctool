import { constructMetadata } from "@/lib/seo";
import PdfRotateClient from "./client";

export const metadata = constructMetadata({
  title: "Rotate PDF",
  description: "Rotate all pages in a PDF document by 90°, 180°, or 270°.",
  path: "/tools/pdf/rotate",
});

export default function PdfRotatePage() {
  return <PdfRotateClient />;
}
