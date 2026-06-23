import { constructMetadata } from "@/lib/seo";
import ToWordClient from "./client";

export const metadata = constructMetadata({
  title: "PDF to Word",
  description: "Convert PDF documents to editable Word (.docx) files online.",
  path: "/tools/pdf/to-word",
});

export default function ToWordPage() {
  return <ToWordClient />;
}
