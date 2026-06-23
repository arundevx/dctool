import { constructMetadata } from "@/lib/seo";
import ReorderPdfClient from "./client";

export const metadata = constructMetadata({
  title: "Reorder PDF Pages",
  description: "Rearrange PDF pages in any order and download the reordered document.",
  path: "/tools/pdf/reorder",
});

export default function ReorderPdfPage() {
  return <ReorderPdfClient />;
}
