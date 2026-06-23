import { constructMetadata } from "@/lib/seo";
import ToImagesClient from "./client";

export const metadata = constructMetadata({
  title: "PDF to Images",
  description: "Convert PDF pages to PNG or JPG images. Download as ZIP.",
  path: "/tools/pdf/to-images",
});

export default function ToImagesPage() {
  return <ToImagesClient />;
}
