import { constructMetadata } from "@/lib/seo";
import CropClient from "./client";

export const metadata = constructMetadata({
  title: "Crop Image",
  description: "Crop images online by selecting exact pixel coordinates. Free and secure.",
  path: "/tools/image/crop",
});

export default function CropPage() {
  return <CropClient />;
}
