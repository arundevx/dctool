import { constructMetadata } from "@/lib/seo";
import UrlEncodeClient from "./client";

export const metadata = constructMetadata({
  title: "URL Encoder & Decoder",
  description: "Encode or decode URLs and query strings instantly in your browser.",
  path: "/tools/developer/url-encode",
});

export default function UrlEncodePage() {
  return <UrlEncodeClient />;
}
