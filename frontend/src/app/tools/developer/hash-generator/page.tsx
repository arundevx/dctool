import { constructMetadata } from "@/lib/seo";
import HashGeneratorClient from "./client";

export const metadata = constructMetadata({
  title: "Hash Generator (MD5, SHA-256)",
  description: "Generate MD5 and SHA-256 hashes from any text instantly in your browser.",
  path: "/tools/developer/hash-generator",
});

export default function HashGeneratorPage() {
  return <HashGeneratorClient />;
}
