import { constructMetadata } from "@/lib/seo";
import ResizeClient from "./client";

export const metadata = constructMetadata({
  title: "Resize Image",
  description: "Resize images online to any width and height. Free, fast, and secure.",
  path: "/tools/image/resize",
});

export default function ResizePage() {
  return <ResizeClient />;
}
