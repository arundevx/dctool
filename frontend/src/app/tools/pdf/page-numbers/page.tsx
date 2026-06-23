import { constructMetadata } from "@/lib/seo";
import PdfPageNumbersClient from "./client";

export const metadata = constructMetadata({
  title: "Add Page Numbers to PDF",
  description: "Add page numbers to every page of your PDF document.",
  path: "/tools/pdf/page-numbers",
});

export default function PdfPageNumbersPage() {
  return <PdfPageNumbersClient />;
}
