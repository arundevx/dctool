import { constructMetadata } from "@/lib/seo";
import SignPdfClient from "./client";

export const metadata = constructMetadata({
  title: "Sign PDF",
  description: "Add your signature image to a PDF document.",
  path: "/tools/pdf/sign",
});

export default function SignPdfPage() {
  return <SignPdfClient />;
}
