import { constructMetadata } from "@/lib/seo";
import PdfWatermarkClient from "./client";

export const metadata = constructMetadata({
  title: "PDF Watermark",
  description: "Add a text watermark to every page of your PDF document.",
  path: "/tools/pdf/watermark",
});

export default function PdfWatermarkPage() {
  return <PdfWatermarkClient />;
}
