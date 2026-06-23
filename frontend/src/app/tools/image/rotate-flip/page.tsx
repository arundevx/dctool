import { constructMetadata } from "@/lib/seo";
import RotateFlipClient from "./client";

export const metadata = constructMetadata({
  title: "Rotate & Flip Image",
  description: "Rotate or flip images online. Free, fast, and secure.",
  path: "/tools/image/rotate-flip",
});

export default function RotateFlipPage() {
  return <RotateFlipClient />;
}
