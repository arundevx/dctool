import { constructMetadata } from "@/lib/seo";
import ImageToPdfClient from "./client";

export const metadata = constructMetadata({
  title: "Image to PDF",
  description: "Convert a single image to PDF format instantly.",
  path: "/tools/image/to-pdf",
});

export default function ImageToPdfPage() {
  return <ImageToPdfClient />;
}
