import { constructMetadata } from "@/lib/seo";
import SplitClient from "./client";

export const metadata = constructMetadata({
  title: "Split PDF",
  description: "Split PDF files by page range or extract every page. Free and secure.",
  path: "/tools/pdf/split",
});

export default function SplitPage() {
  return <SplitClient />;
}
