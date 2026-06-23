import { constructMetadata } from "@/lib/seo";
import LoremIpsumClient from "./client";

export const metadata = constructMetadata({
  title: "Lorem Ipsum Generator",
  description: "Generate placeholder Lorem Ipsum text for designs and mockups.",
  path: "/tools/developer/lorem-ipsum",
});

export default function LoremIpsumPage() {
  return <LoremIpsumClient />;
}
