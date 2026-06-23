import { constructMetadata } from "@/lib/seo";
import RedactClient from "./client";

export const metadata = constructMetadata({
  title: "Blur & Redact Image Region",
  description: "Blur or black out a region of an image for privacy.",
  path: "/tools/image/redact",
});

export default function RedactPage() {
  return <RedactClient />;
}
