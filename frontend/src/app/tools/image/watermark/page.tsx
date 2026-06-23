import { constructMetadata } from "@/lib/seo";
import WatermarkClient from "./client";

export const metadata = constructMetadata({
  title: "Add Watermark to Image",
  description: "Add a text watermark to your images online. Customize position, opacity, and color.",
  path: "/tools/image/watermark",
});

export default function WatermarkPage() {
  return <WatermarkClient />;
}
